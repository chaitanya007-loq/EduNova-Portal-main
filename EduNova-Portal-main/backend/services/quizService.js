/**
 * EduNova Quiz Service
 * 
 * Manages cheat-proof quiz retrieval (omits correct answer keys from client payloads)
 * and server-side evaluation with atomic multi-table transactions (Prisma $transaction).
 */

const prisma = require('../config/db');

class QuizService {
  /**
   * Retrieve quiz questions with answer keys stripped to prevent cheating via DevTools
   * @param {string} quizId 
   * @param {boolean} sanitize Whether to strip correctOptionIndex and explanations
   */
  async getQuizQuestions(quizId, { sanitize = true } = {}) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        subject: {
          select: { id: true, name: true, category: true },
        },
        topic: {
          select: { id: true, title: true },
        },
        questions: {
          select: {
            id: true,
            questionText: true,
            options: true,
            // Only expose answer keys if explicitly asked (e.g. for instructors / review)
            correctOptionIndex: !sanitize,
            explanation: !sanitize,
            fingerprint: true,
          },
        },
      },
    });

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.status = 404;
      throw error;
    }

    return quiz;
  }

  /**
   * Server-side Quiz Evaluation
   * Evaluates student answers, records QuizAttempt, updates LearnerProfile XP,
   * streak, and dynamic weakTopics within an atomic transaction.
   * 
   * @param {string} userId 
   * @param {string} quizId 
   * @param {Array<{ questionId: string, selectedOptionIndex: number }>|Record<string, number>} userAnswers 
   * @param {number} timeSpentSec 
   */
  async submitQuiz(userId, quizId, userAnswers, timeSpentSec = 0) {
    // 1. Fetch complete quiz with internal answer keys
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        subject: { select: { id: true, name: true } },
        topic: { select: { id: true, title: true } },
        questions: true,
      },
    });

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.status = 404;
      throw error;
    }

    // Normalize user answers to a lookup map: questionId -> selectedOptionIndex
    const answerMap = new Map();
    if (Array.isArray(userAnswers)) {
      userAnswers.forEach((ans) => {
        answerMap.set(ans.questionId, Number(ans.selectedOptionIndex));
      });
    } else if (typeof userAnswers === 'object' && userAnswers !== null) {
      Object.entries(userAnswers).forEach(([qId, optIdx]) => {
        answerMap.set(qId, Number(optIdx));
      });
    }

    // 2. Evaluate answers
    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const detailedReview = [];

    quiz.questions.forEach((q) => {
      const selectedIndex = answerMap.has(q.id) ? answerMap.get(q.id) : -1;
      const isCorrect = selectedIndex === q.correctOptionIndex;

      if (isCorrect) {
        correctCount += 1;
      }

      detailedReview.push({
        questionId: q.id,
        questionText: q.questionText,
        options: q.options,
        selectedOptionIndex: selectedIndex,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation || 'No explanation provided for this question.',
      });
    });

    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const roundedAccuracy = Math.round(accuracy * 10) / 10;

    // Calculate XP: 20 XP per correct question + 50 XP bonus for accuracy >= 80%
    let xpAwarded = correctCount * 20;
    if (roundedAccuracy >= 80) {
      xpAwarded += 50; // Mastery bonus
    }

    const topicOrSubjectName = quiz.topic?.title || quiz.subject?.name || 'General';

    // 3. Execute atomic multi-table updates
    const result = await prisma.$transaction(async (tx) => {
      // A. Create QuizAttempt
      const attempt = await tx.quizAttempt.create({
        data: {
          quizId,
          userId,
          score: correctCount,
          totalQuestions,
          accuracy: roundedAccuracy,
          timeSpentSec: Number(timeSpentSec) || 0,
        },
      });

      // B. Create XP transaction if points earned
      if (xpAwarded > 0) {
        await tx.xpTransaction.create({
          data: {
            userId,
            amount: xpAwarded,
            sourceTitle: `Completed Quiz: ${quiz.title} (${roundedAccuracy}% accuracy)`,
          },
        });
      }

      // C. Update LearnerProfile (XP, level, weakTopics)
      const profile = await tx.learnerProfile.findUnique({
        where: { userId },
      });

      let currentWeakTopics = profile?.weakTopics || [];
      let weakTopicsModified = false;

      // Rule: If accuracy < 60%, auto-flag as weak topic
      if (roundedAccuracy < 60) {
        if (!currentWeakTopics.includes(topicOrSubjectName)) {
          currentWeakTopics = [...currentWeakTopics, topicOrSubjectName];
          weakTopicsModified = true;
        }
      } else if (roundedAccuracy >= 80) {
        // Mastery achieved: remove from weak topics if previously flagged
        if (currentWeakTopics.includes(topicOrSubjectName)) {
          currentWeakTopics = currentWeakTopics.filter((t) => t !== topicOrSubjectName);
          weakTopicsModified = true;
        }
      }

      let newXp = (profile?.xp || 0) + xpAwarded;
      let newLevel = Math.floor(newXp / 250) + 1;

      const updatedProfile = await tx.learnerProfile.upsert({
        where: { userId },
        update: {
          xp: newXp,
          level: newLevel,
          weakTopics: currentWeakTopics,
        },
        create: {
          userId,
          xp: newXp,
          level: newLevel,
          weakTopics: currentWeakTopics,
        },
      });

      // D. Update StudentSubjectProgress if linked
      if (quiz.subjectId) {
        const subjectProgress = await tx.studentSubjectProgress.findUnique({
          where: {
            userId_subjectId: {
              userId,
              subjectId: quiz.subjectId,
            },
          },
        });

        if (subjectProgress) {
          // Weight quiz score into subject progress
          const updatedScore = Math.round((subjectProgress.progress * 0.7) + (roundedAccuracy * 0.3));
          await tx.studentSubjectProgress.update({
            where: {
              userId_subjectId: {
                userId,
                subjectId: quiz.subjectId,
              },
            },
            data: {
              progress: Math.min(100, updatedScore),
            },
          });
        }
      }

      return {
        attempt,
        newXp,
        newLevel,
        weakTopics: updatedProfile.weakTopics,
        weakTopicsModified,
      };
    });

    return {
      attemptId: result.attempt.id,
      score: correctCount,
      totalQuestions,
      accuracy: roundedAccuracy,
      xpAwarded,
      newXp: result.newXp,
      newLevel: result.newLevel,
      weakTopics: result.weakTopics,
      weakTopicsModified: result.weakTopicsModified,
      detailedReview,
    };
  }

  /**
   * Create a new quiz with its questions in a single atomic transaction
   */
  async createQuiz({ subjectId, topicId = null, title, difficulty = 'BEGINNER', questions = [] }) {
    if (!subjectId || !title || !questions.length) {
      const error = new Error('subjectId, title, and at least one question are required');
      error.status = 400;
      throw error;
    }

    return await prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.create({
        data: {
          subjectId,
          topicId,
          title,
          difficulty,
          totalQuestions: questions.length,
        },
      });

      await tx.quizQuestion.createMany({
        data: questions.map((q) => ({
          quizId: quiz.id,
          questionText: q.questionText,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation || null,
          fingerprint: q.fingerprint || null,
        })),
      });

      return await tx.quiz.findUnique({
        where: { id: quiz.id },
        include: {
          questions: true,
          subject: true,
        },
      });
    });
  }

  /**
   * List available quizzes with optional filters
   */
  async listQuizzes({ subjectId, topicId, difficulty, search } = {}) {
    const where = {};
    if (subjectId) where.subjectId = subjectId;
    if (topicId) where.topicId = topicId;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.title = { contains: search };
    }

    return await prisma.quiz.findMany({
      where,
      include: {
        subject: { select: { id: true, name: true } },
        topic: { select: { id: true, title: true } },
        _count: { select: { questions: true, attempts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new QuizService();
