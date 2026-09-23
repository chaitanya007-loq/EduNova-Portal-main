/**
 * EduNova Analytics Controller
 * 
 * Endpoints:
 * - GET   /api/analytics/overview                      (Powers Next.js ProgressAnalyticsPage)
 * - GET   /api/analytics/student/:userId?              (Learner analytics)
 * - POST  /api/analytics/study-sessions                (Schedule study session)
 * - PATCH /api/analytics/study-sessions/:id/complete   (Complete study session)
 */

const analyticsService = require('../services/analyticsService');

/**
 * GET /api/analytics/overview
 * Real PostgreSQL performance analytics (study hours, mastery, revision radar, consistency)
 */
const getOverview = async (req, res, next) => {
  try {
    const overview = await analyticsService.getLearnerOverview(req.user.id);
    return res.json({
      success: true,
      message: 'Learner performance analytics retrieved successfully',
      data: overview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/student/:userId?
 * Student analytics with role guard
 */
const getStudentAnalytics = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId || req.user.id;

    if (req.user.role === 'STUDENT' && targetUserId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view other students analytics' });
    }

    const data = await analyticsService.getLearnerOverview(targetUserId);
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/analytics/study-sessions
 * Schedule or log a study session
 */
const createStudySession = async (req, res, next) => {
  try {
    const { subjectId, durationMinutes, plannedDate } = req.body;
    const session = await analyticsService.createStudySession(req.user.id, {
      subjectId,
      durationMinutes,
      plannedDate,
    });
    return res.status(201).json({
      success: true,
      message: 'Study session logged successfully',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/analytics/study-sessions/:id/complete
 * Mark study session complete and award XP
 */
const completeStudySession = async (req, res, next) => {
  try {
    const result = await analyticsService.completeStudySession(req.user.id, req.params.id);
    return res.json({
      success: true,
      message: `Study session completed! +${result.xpEarned} XP awarded.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getStudentAnalytics,
  createStudySession,
  completeStudySession,
};
