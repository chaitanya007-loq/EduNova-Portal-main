/**
 * Sage AI Routes
 * Base path: /api/ai
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { requireAuth } = require('../middleware/auth');
const { z } = require('zod');
const { validate } = require('../middleware/validate');

// All AI routes require authentication
router.use(requireAuth);

const chatSchema = {
	body: z.object({
		message: z.string().trim().min(1, 'Message string is required'),
		conversationId: z.string().nullable().optional(),
	}),
};

// POST /api/ai/chat - Session-based Socratic Q&A with streaming & persistent storage
router.post('/chat', validate(chatSchema), aiController.chat);

// POST /api/ai/generate-quiz & /api/ai/quiz - Dynamic quiz targeting user's weakTopics
router.post('/generate-quiz', aiController.generateQuiz);
router.post('/quiz', aiController.generateQuiz);

// GET /api/ai/history - Student's past Sage Q&A turns from PostgreSQL
router.get('/history', aiController.getChatHistory);

// POST /api/ai/weak-topic-plan - Targeted remediation plan based on diagnostic errors
router.post('/weak-topic-plan', aiController.generateWeakTopicPlan);

module.exports = router;

