/**
 * Sage AI Routes
 * Base path: /api/ai
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { requireAuth } = require('../middleware/auth');

// All AI routes require authentication
router.use(requireAuth);

// POST /api/ai/chat - Session-based Socratic Q&A with streaming & persistent storage
router.post('/chat', aiController.chat);

// POST /api/ai/generate-quiz & /api/ai/quiz - Dynamic quiz targeting user's weakTopics
router.post('/generate-quiz', aiController.generateQuiz);
router.post('/quiz', aiController.generateQuiz);

// GET /api/ai/history - Student's past Sage Q&A turns from PostgreSQL
router.get('/history', aiController.getChatHistory);

// POST /api/ai/weak-topic-plan - Targeted remediation plan based on diagnostic errors
router.post('/weak-topic-plan', aiController.generateWeakTopicPlan);

module.exports = router;

