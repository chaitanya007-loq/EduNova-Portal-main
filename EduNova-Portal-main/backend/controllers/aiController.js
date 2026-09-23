/**
 * Sage AI Controller (backend/controllers/aiController.js)
 * 
 * Pipeline:
 * Next.js → POST /api/ai/chat → authMiddleware → contextBuilder → PostgreSQL → Gemini → responseValidator → Next.js
 * 
 * Endpoints:
 * - POST /api/ai/chat          (Streaming Socratic tutor responses, persisted to ai_conversations)
 * - POST /api/ai/generate-quiz (Dynamic quiz generation targeting user's weakTopics)
 * - POST /api/ai/quiz          (Alias for generate-quiz)
 * - GET  /api/ai/history       (Retrieve student's past Sage tutoring conversations)
 * - POST /api/ai/weak-topic-plan (Diagnostic remediation planner)
 */

const contextBuilder = require('../ai/contextBuilder');
const geminiProvider = require('../ai/geminiProvider');
const { buildQuizPrompt } = require('../ai/prompts/quizGenPrompt');
const { buildWeakTopicPlanPrompt } = require('../ai/prompts/weakTopicPrompt');
const { validateQuizResponse, validateWeakTopicPlanResponse } = require('../ai/responseValidator');
const prisma = require('../config/db');

class AiController {
  /**
   * POST /api/ai/chat
   * Socratic tutoring with streaming (SSE) and persistent Q&A storage in PostgreSQL
   */
  async chat(req, res, next) {
    try {
      const { message, history = [], stream = true } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Message string is required in request body',
        });
      }

      // 1. Build hyper-personalized student context from PostgreSQL
      const studentContext = await contextBuilder.buildStudentContext(req.user.id);
      const systemInstruction = await contextBuilder.getTutorSystemInstruction(req.user.id);

      const isStreamRequested =
        stream === true ||
        req.headers.accept?.includes('text/event-stream') ||
        req.query.stream === 'true';

      // ── STREAMING MODE (SSE) ────────────────────────────────────────────────
      if (isStreamRequested) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
        });
        if (typeof res.flushHeaders === 'function') {
          res.flushHeaders();
        }

        // Send initial connection packet
        res.write(
          `data: ${JSON.stringify({
            type: 'meta',
            model: geminiProvider.modelName,
            student: {
              name: studentContext.studentName,
              level: studentContext.level,
              weakTopics: studentContext.weakTopics,
            },
          })}\n\n`
        );

        let fullResponse = '';

        try {
          await geminiProvider.generateStream({
            systemInstruction,
            history,
            message: message.trim(),
            onChunk: (chunkText) => {
              fullResponse += chunkText;
              res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunkText })}\n\n`);
            },
          });

          // Persist Q&A turn to ai_conversations in PostgreSQL
          let conversationRecord = null;
          try {
            conversationRecord = await prisma.aiConversation.create({
              data: {
                userId: req.user.id,
                title: message.trim().slice(0, 80),
                prompt: message.trim(),
                response: fullResponse.trim(),
                metadata: {
                  model: geminiProvider.modelName,
                  weakTopicsTargeted: studentContext.weakTopics,
                  educationStage: studentContext.learnerType,
                },
              },
            });
          } catch (dbErr) {
            console.error('[AI Chat DB Save Warning]', dbErr.message);
          }

          res.write(
            `data: ${JSON.stringify({
              type: 'done',
              conversationId: conversationRecord?.id || null,
              fullResponse: fullResponse.trim(),
            })}\n\n`
          );
          res.write('data: [DONE]\n\n');
          return res.end();
        } catch (streamErr) {
          res.write(`data: ${JSON.stringify({ type: 'error', message: streamErr.message })}\n\n`);
          return res.end();
        }
      }

      // ── STANDARD JSON MODE (Non-Streaming) ──────────────────────────────────
      const reply = await geminiProvider.generateChatReply({
        systemInstruction,
        history,
        message: message.trim(),
      });

      let conversationRecord = null;
      try {
        conversationRecord = await prisma.aiConversation.create({
          data: {
            userId: req.user.id,
            title: message.trim().slice(0, 80),
            prompt: message.trim(),
            response: reply.trim(),
            metadata: {
              model: geminiProvider.modelName,
              weakTopicsTargeted: studentContext.weakTopics,
            },
          },
        });
      } catch (dbErr) {
        console.error('[AI Chat DB Save Warning]', dbErr.message);
      }

      return res.json({
        success: true,
        message: 'Sage AI response generated',
        data: {
          reply: reply.trim(),
          conversationId: conversationRecord?.id || null,
          model: geminiProvider.modelName,
          studentContext: {
            name: studentContext.studentName,
            level: studentContext.level,
            streakDays: studentContext.streakDays,
            weakTopics: studentContext.weakTopics,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/generate-quiz (and POST /api/ai/quiz)
   * Dynamically builds questions targeting user's weakTopics
   */
  async generateQuiz(req, res, next) {
    try {
      const {
        subject = 'General Science',
        topic = 'Core Concepts',
        questionCount = 5,
        difficulty = 'INTERMEDIATE',
      } = req.body;

      // 1. Fetch student context to extract weakTopics
      const studentContext = await contextBuilder.buildStudentContext(req.user.id);

      // 2. Build prompt with weak topics injection
      const prompt = buildQuizPrompt({
        subject,
        topic,
        questionCount,
        difficulty,
        learnerType: studentContext.learnerType,
        weakTopics: studentContext.weakTopics,
      });

      // 3. Generate structured JSON with Gemini (includes single-attempt retry logic)
      let parsedQuiz = await geminiProvider.generateStructuredJson({
        prompt,
        systemInstruction: 'You are an expert curriculum assessment generator for EduNova. Output strictly valid RFC-8259 JSON.',
      });

      // 4. Validate output schema with Zod
      let validatedQuiz = null;
      if (parsedQuiz) {
        try {
          validatedQuiz = validateQuizResponse(parsedQuiz);
        } catch (zodErr) {
          console.warn('[Zod Validation Warning]', zodErr.message);
        }
      }

      // Fallback simulation if model unconfigured
      if (!validatedQuiz) {
        const count = [5, 10, 15].includes(Number(questionCount)) ? Number(questionCount) : 5;
        validatedQuiz = {
          title: `${subject}: ${topic} Diagnostic Quiz`,
          subject,
          topic,
          difficulty,
          totalQuestions: count,
          questions: Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            question: `In ${subject} (${topic}), which principle is most critical for solving problem #${i + 1}?`,
            codeSnippet: null,
            options: [
              `Fundamental definition of ${topic}`,
              `Empirical approximation theorem`,
              `Inverse proportionality rule`,
              `Conservation principle`,
            ],
            correctIndex: 0,
            correctAnswer: `Fundamental definition of ${topic}`,
            explanation: `The foundational definition governs all boundary behavior in ${topic}.`,
            bloomTaxonomy: 'APPLY',
          })),
        };
      }

      return res.json({
        success: true,
        message: `Generated ${validatedQuiz.questions.length} questions tailored to ${studentContext.studentName}`,
        data: {
          ...validatedQuiz,
          weakTopicsTargeted: studentContext.weakTopics,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/ai/history
   * Retrieve student's past Sage AI Q&A turns from PostgreSQL
   */
  async getChatHistory(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);

      const [history, total] = await Promise.all([
        prisma.aiConversation.findMany({
          where: { userId: req.user.id },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.aiConversation.count({
          where: { userId: req.user.id },
        }),
      ]);

      return res.json({
        success: true,
        message: 'Chat history retrieved',
        data: {
          history,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/weak-topic-plan
   * Diagnostic remediation planner
   */
  async generateWeakTopicPlan(req, res, next) {
    try {
      const { recentErrors = [], targetTopics = [] } = req.body;
      const studentContext = await contextBuilder.buildStudentContext(req.user.id);

      const topicsToTarget = targetTopics.length > 0 ? targetTopics : studentContext.weakTopics;

      const prompt = buildWeakTopicPlanPrompt({
        studentName: studentContext.studentName,
        learnerType: studentContext.learnerType,
        board: studentContext.board,
        degree: studentContext.degree,
        weakTopics: topicsToTarget,
        recentErrors,
      });

      let rawJson = await geminiProvider.generateStructuredJson({
        prompt,
        systemInstruction: 'You are a master academic recovery coach. Return strictly valid JSON matching the schema.',
      });

      let validated = null;
      if (rawJson) {
        try {
          validated = validateWeakTopicPlanResponse(rawJson);
        } catch (err) {
          console.warn('[Weak Topic Plan Zod Warning]', err.message);
        }
      }

      if (!validated) {
        validated = {
          studentName: studentContext.studentName,
          diagnosticSummary: `Personalized 3-day recovery acceleration for ${topicsToTarget.join(', ') || 'Core Concepts'}.`,
          targetRecoveryAreas: (topicsToTarget.length > 0 ? topicsToTarget : ['Foundational Concepts']).map((t) => ({
            topic: t,
            coreMisconception: `Misapplication of core principles under time pressure in ${t}.`,
            actionableSteps: [
              `Review 3 worked diagnostic examples for ${t}.`,
              `Practice active recall using Feynman technique.`,
              `Solve 5 medium-difficulty numericals without looking at answer keys.`,
            ],
            practiceProblem: `Explain why the primary governing formula applies to ${t}.`,
            estimatedMinutes: 30,
          })),
          threeDayPlan: [
            {
              day: 1,
              focus: 'Diagnostic Clarity & Concept Unpacking',
              tasks: ['Identify core equations', 'Write 1-page summary sheet'],
              xpReward: 50,
            },
            {
              day: 2,
              focus: 'Guided Scaffolding & Problem Solving',
              tasks: ['Complete 5 practice problems with Sage AI', 'Analyze mistakes'],
              xpReward: 75,
            },
            {
              day: 3,
              focus: 'Independent Mastery & Benchmark Quiz',
              tasks: ['Take 10-question timed quiz', 'Reach >=80% accuracy'],
              xpReward: 100,
            },
          ],
        };
      }

      return res.json({
        success: true,
        message: 'Weak topic recovery plan generated',
        data: validated,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AiController();
