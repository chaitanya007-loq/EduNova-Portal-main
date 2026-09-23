const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getProfile, updateProfile, updateLearnerProfile,
  getAllUsers, deleteUser, getChildData,
} = require('../controllers/userController');

// ── Zod Schemas ──────────────────────────────────────────────────────────────

const updateProfileSchema = {
  body: z.object({
    name: z.string().min(1).optional(),
    avatar: z.string().optional().nullable(),
    learnerType: z.enum(['SCHOOL', 'COLLEGE', 'SKILLS', 'EXAM']).optional(),
    studentUsername: z.string().min(2).optional(),
    username: z.string().min(2).optional(),
    title: z.string().optional(),
    bio: z.string().optional(),
    board: z.string().optional().nullable(),
    degree: z.string().optional().nullable(),
    education: z.any().optional(),
  }),
};

const updateLearnerProfileSchema = {
  body: z.object({
    board: z.string().optional().nullable(),
    degree: z.string().optional().nullable(),
    goals: z.array(z.string()).optional(),
    weakTopics: z.array(z.string()).optional(),
  }),
};

const listUsersSchema = {
  query: z.object({
    role: z.enum(['ADMIN', 'INSTRUCTOR', 'STUDENT', 'PARENT']).optional(),
    learnerType: z.enum(['SCHOOL', 'COLLEGE', 'SKILLS', 'EXAM']).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
};

// ── Routes ───────────────────────────────────────────────────────────────────

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, validate(updateProfileSchema), updateProfile);
router.put('/learner-profile', requireAuth, requireRole('STUDENT'), validate(updateLearnerProfileSchema), updateLearnerProfile);
router.get('/child', requireAuth, requireRole('PARENT'), getChildData);
router.get('/', requireAuth, requireRole('ADMIN'), validate(listUsersSchema), getAllUsers);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteUser);

module.exports = router;
