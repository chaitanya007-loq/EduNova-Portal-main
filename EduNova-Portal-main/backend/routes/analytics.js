/**
 * EduNova Performance Analytics Routes
 * Base path: /api/analytics
 */

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  getOverview,
  getStudentAnalytics,
  createStudySession,
  completeStudySession,
} = require('../controllers/analyticsController');

// All analytics routes require authentication
router.use(requireAuth);

// GET /api/analytics/overview - Powers Next.js ProgressAnalyticsPage
router.get('/overview', getOverview);

// GET /api/analytics/student/:userId? - Detailed analytics for student or parent
router.get('/student/:userId?', getStudentAnalytics);

// POST /api/analytics/study-sessions - Schedule a study session
router.post('/study-sessions', createStudySession);

// PATCH /api/analytics/study-sessions/:id/complete - Complete study session
router.patch('/study-sessions/:id/complete', completeStudySession);

module.exports = router;
