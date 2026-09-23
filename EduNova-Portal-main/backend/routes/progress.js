const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getSubjectProgress, updateSubjectProgress,
  getCourseProgress, updateCourseProgress,
  getDashboardProgress,
} = require('../controllers/progressController');

// ── Zod Schemas ──────────────────────────────────────────────────────────────

const updateSubjectProgressSchema = {
  body: z.object({
    progress: z.number().min(0).max(100).optional(),
    targetScore: z.number().int().min(0).max(100).optional(),
    syllabusCoverage: z.number().min(0).max(100).optional(),
  }),
};

const updateCourseProgressSchema = {
  body: z.object({
    completedModuleId: z.string().min(1, 'Module ID is required'),
  }),
};

// ── Routes ───────────────────────────────────────────────────────────────────

router.get('/dashboard', requireAuth, getDashboardProgress);
router.get('/subjects', requireAuth, getSubjectProgress);
router.put('/subjects/:subjectId', requireAuth, validate(updateSubjectProgressSchema), updateSubjectProgress);
router.get('/courses', requireAuth, getCourseProgress);
router.put('/courses/:courseId', requireAuth, validate(updateCourseProgressSchema), updateCourseProgress);

module.exports = router;
