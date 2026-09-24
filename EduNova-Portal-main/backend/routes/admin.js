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
  getCourses,
  updateCourse,
  getSubjects,
  createSubject,
  updateSubject,
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
    thumbnail: z.union([z.string().url(), z.literal('')]).optional().nullable(),
    instructorId: z.string().optional(),
    modules: z.array(z.object({
      title: z.string().min(1),
      duration: z.number().int().optional(),
      order: z.number().int().optional(),
    })).optional(),
  }),
};

const adminSubjectSchema = {
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    educationType: z.enum(['SCHOOL', 'COLLEGE', 'SKILLS', 'EXAM']).optional(),
    class: z.string().optional().nullable(),
    board: z.string().optional().nullable(),
    degree: z.string().optional().nullable(),
    branch: z.string().optional().nullable(),
    semester: z.string().optional().nullable(),
    exam: z.string().optional().nullable(),
    topics: z.array(z.string().min(1)).optional(),
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
router.get('/courses', getCourses);
router.post('/courses', validate(adminCourseSchema), createCourse);
router.patch('/courses/:id', validate(adminCourseSchema), updateCourse);
router.get('/subjects', getSubjects);
router.post('/subjects', validate(adminSubjectSchema), createSubject);
router.patch('/subjects/:id', validate(adminSubjectSchema), updateSubject);
router.delete('/content/:type/:id', deleteContent);

module.exports = router;
