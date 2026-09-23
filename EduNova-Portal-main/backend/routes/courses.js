const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getCourses, getCourseById, createCourse, updateCourse, deleteCourse,
  enrollCourse, getEnrolledCourses, addModule, completeModule,
} = require('../controllers/courseController');

// ── Zod Schemas ──────────────────────────────────────────────────────────────

const listCoursesSchema = {
  query: z.object({
    category: z.string().optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
};

const createCourseSchema = {
  body: z.object({
    title: z.string().min(1, 'Course title is required'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    thumbnail: z.string().url().optional().nullable(),
    modules: z.array(z.object({
      title: z.string().min(1),
      duration: z.number().int().optional(),
      order: z.number().int().optional(),
    })).optional(),
  }),
};

const addModuleSchema = {
  body: z.object({
    title: z.string().min(1, 'Module title is required'),
    duration: z.number().int().optional(),
    order: z.number().int().optional(),
  }),
};

// ── Routes ───────────────────────────────────────────────────────────────────

// Must be before /:id to avoid route conflict
router.get('/enrolled/me', requireAuth, getEnrolledCourses);

router.get('/', validate(listCoursesSchema), getCourses);
router.get('/:id', getCourseById);
router.post('/', requireAuth, requireRole('INSTRUCTOR', 'ADMIN'), validate(createCourseSchema), createCourse);
router.put('/:id', requireAuth, requireRole('INSTRUCTOR', 'ADMIN'), updateCourse);
router.delete('/:id', requireAuth, requireRole('INSTRUCTOR', 'ADMIN'), deleteCourse);
router.post('/:id/enroll', requireAuth, requireRole('STUDENT'), enrollCourse);
router.post('/:id/modules/:moduleId/complete', requireAuth, requireRole('STUDENT'), completeModule);
router.post('/:id/modules', requireAuth, requireRole('INSTRUCTOR', 'ADMIN'), validate(addModuleSchema), addModule);

module.exports = router;
