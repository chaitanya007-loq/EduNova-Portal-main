/**
 * EduNova Quiz Controller
 * 
 * Endpoints:
 * - GET  /api/quizzes/:id         (Retrieve quiz with answer keys stripped)
 * - POST /api/quizzes/:id/submit  (Server-side evaluation, attempt logging & XP awarding)
 * - GET  /api/quizzes             (Catalog listing)
 * - POST /api/quizzes             (Admin/Instructor quiz creation)
 */

const quizService = require('../services/quizService');

class QuizController {
  /**
   * GET /api/quizzes/:id
   * Get quiz questions with answer keys removed to prevent frontend cheating
   */
  async getQuiz(req, res, next) {
    try {
      // Instructors and Admins can view answers; students receive sanitized questions
      const isPrivileged = ['ADMIN', 'INSTRUCTOR'].includes(req.user?.role);
      const quiz = await quizService.getQuizQuestions(req.params.id, {
        sanitize: !isPrivileged,
      });

      return res.json({
        success: true,
        message: 'Quiz retrieved successfully',
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/quizzes/:id/submit
   * Server-side evaluation of student answers with atomic score, attempt, and XP updates
   */
  async submitQuiz(req, res, next) {
    try {
      const { answers, userAnswers, timeSpentSec } = req.body;
      const submittedAnswers = answers || userAnswers || [];

      const result = await quizService.submitQuiz(
        req.user.id,
        req.params.id,
        submittedAnswers,
        timeSpentSec
      );

      return res.json({
        success: true,
        message: `Quiz evaluated: ${result.score}/${result.totalQuestions} (${result.accuracy}%)`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/quizzes
   * Catalog of available quizzes
   */
  async listQuizzes(req, res, next) {
    try {
      const { subjectId, topicId, difficulty, search } = req.query;
      const quizzes = await quizService.listQuizzes({
        subjectId,
        topicId,
        difficulty,
        search,
      });

      return res.json({
        success: true,
        message: 'Quizzes retrieved successfully',
        data: quizzes,
        count: quizzes.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/quizzes
   * Create a new quiz with questions
   */
  async createQuiz(req, res, next) {
    try {
      const { subjectId, topicId, title, difficulty, questions } = req.body;
      const quiz = await quizService.createQuiz({
        subjectId,
        topicId,
        title,
        difficulty,
        questions,
      });

      return res.status(201).json({
        success: true,
        message: 'Quiz created successfully',
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QuizController();
