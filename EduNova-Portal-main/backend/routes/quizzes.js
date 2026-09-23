/**
 * EduNova Quiz Routes
 * Base path: /api/quizzes
 */

const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { requireAuth } = require('../middleware/auth');

// All quiz routes require authentication
router.use(requireAuth);

// GET /api/quizzes - List quizzes
router.get('/', quizController.listQuizzes);

// POST /api/quizzes - Create quiz
router.post('/', quizController.createQuiz);

// GET /api/quizzes/:id - Get quiz questions (sanitized without answer keys)
router.get('/:id', quizController.getQuiz);

// POST /api/quizzes/:id/submit - Submit answers and evaluate server-side
router.post('/:id/submit', quizController.submitQuiz);

module.exports = router;
