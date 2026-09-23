const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getMissions, updateMissionProgress, completeMission,
  getXpHistory, updateStreak, getLeaderboard, addXp, getSummary,
} = require('../controllers/gamificationController');

// ── Zod Schemas ──────────────────────────────────────────────────────────────

const updateMissionSchema = {
  body: z.object({
    progress: z.number().int().min(0).max(100),
  }),
};

const leaderboardSchema = {
  query: z.object({
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
};

// ── Routes ───────────────────────────────────────────────────────────────────

router.get('/summary', requireAuth, getSummary);
router.get('/leaderboard', validate(leaderboardSchema), getLeaderboard);
router.get('/missions', requireAuth, getMissions);
router.post('/missions/:id/complete', requireAuth, completeMission);
router.put('/missions/:missionId', requireAuth, validate(updateMissionSchema), updateMissionProgress);
router.get('/xp', requireAuth, getXpHistory);
router.post('/xp', requireAuth, addXp);
router.get('/xp-history', requireAuth, getXpHistory);
router.post('/streak', requireAuth, updateStreak);

module.exports = router;

