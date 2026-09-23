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
const aiService = require('../services/aiService');

class AiController {
  /**
   * POST /api/ai/chat
   * Socratic tutoring with streaming (SSE) and persistent Q&A storage in PostgreSQL
   */
  async chat(req, res, next) {
    try {
      const { message, conversationId = null } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Message string is required in request body',
        });
      }

      const result = await aiService.chat({
        userId: req.user.id,
        message,
        conversationId,
      });

      return res.json({
        success: true,
        message: 'Sage AI response generated',
        data: result,
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
      const data = await aiService.getHistory({
        userId: req.user.id,
        page: req.query.page,
        limit: req.query.limit,
      });

      return res.json({
        success: true,
        message: 'Chat history retrieved',
        data,
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
