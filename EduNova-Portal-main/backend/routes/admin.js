const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getMetrics,
  getUsers,
  updateUserRole,
  createCourse,
  deleteContent,
} = require('../controllers/adminController');

// ── Zod Schemas ──────────────────────────────────────────────────────────────

const updateRoleSchema = {
  body: z.object({
    role: z.enum(['ADMIN', 'INSTRUCTOR', 'STUDENT', 'PARENT']),
  }),
};

const adminCourseSchema = {
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    thumbnail: z.string().url().optional().nullable(),
    instructorId: z.string().optional(),
    modules: z.array(z.object({
      title: z.string().min(1),
      duration: z.number().int().optional(),
      order: z.number().int().optional(),
    })).optional(),
  }),
};

const queryUsersSchema = {
  query: z.object({
    role: z.enum(['ADMIN', 'INSTRUCTOR', 'STUDENT', 'PARENT']).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
};

// ── Apply Admin Protection to All Routes ──────────────────────────────────────
router.use(requireAuth);
router.use(requireRole('ADMIN'));

// ── Routes ───────────────────────────────────────────────────────────────────

router.get('/metrics', getMetrics);
router.get('/users', validate(queryUsersSchema), getUsers);
router.patch('/users/:id/role', validate(updateRoleSchema), updateUserRole);
router.post('/courses', validate(adminCourseSchema), createCourse);
router.delete('/content/:type/:id', deleteContent);

module.exports = router;
