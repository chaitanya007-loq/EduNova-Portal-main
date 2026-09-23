const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getProfile,
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  updateLearnerType,
  completeOnboarding,
} = require('../controllers/learnerController');

// ── Zod Schemas ──────────────────────────────────────────────────────────────

const addGoalSchema = {
  body: z.object({
    title: z.string().min(1, 'Goal title is required'),
    targetDate: z.string().optional(),
    progress: z.number().min(0).max(100).optional(),
  }),
};

const updateGoalSchema = {
  body: z.object({
    title: z.string().optional(),
    targetDate: z.string().optional(),
    progress: z.number().min(0).max(100).optional(),
  }),
};

const updateTypeSchema = {
  body: z.object({
    learnerType: z.enum(['SCHOOL', 'COLLEGE', 'SKILLS', 'EXAM']),
    board: z.string().optional().nullable(),
    degree: z.string().optional().nullable(),
  }),
};

// ── Routes ───────────────────────────────────────────────────────────────────

router.get('/profile', requireAuth, getProfile);
router.get('/goals', requireAuth, getGoals);
router.post('/goals', requireAuth, validate(addGoalSchema), addGoal);
router.patch('/goals/:id', requireAuth, validate(updateGoalSchema), updateGoal);
router.delete('/goals/:id', requireAuth, deleteGoal);
router.patch('/type', requireAuth, validate(updateTypeSchema), updateLearnerType);
router.post('/onboarding', requireAuth, completeOnboarding);

module.exports = router;
