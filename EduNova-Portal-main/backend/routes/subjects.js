const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject,
  addTopic, deleteTopic, selectSubject, updateProgress,
  getEnrolledSubjects, unenrollSubject,
} = require('../controllers/subjectController');

// ── Zod Schemas ──────────────────────────────────────────────────────────────

const listSubjectsSchema = {
  query: z.object({
    educationType: z.enum(['SCHOOL', 'COLLEGE', 'SKILLS', 'EXAM']).optional(),
    board: z.string().optional(),
    className: z.string().optional(),
    class: z.string().optional(),
    degree: z.string().optional(),
    branch: z.string().optional(),
    semester: z.string().optional(),
    exam: z.string().optional(),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
};

const createSubjectSchema = {
  body: z.object({
    name: z.string().min(1, 'Subject name is required'),
    category: z.string().min(1, 'Category is required'),
    educationType: z.enum(['SCHOOL', 'COLLEGE', 'SKILLS', 'EXAM']).optional(),
    className: z.string().optional().nullable(),
    board: z.string().optional().nullable(),
    topics: z.array(z.object({
      title: z.string().min(1),
      order: z.number().int().optional(),
    })).optional(),
  }),
};

const addTopicSchema = {
  body: z.object({
    title: z.string().min(1, 'Topic title is required'),
    order: z.number().int().optional(),
  }),
};

// ── Routes ───────────────────────────────────────────────────────────────────

// Must be before /:id
router.get('/enrolled', requireAuth, getEnrolledSubjects);
router.post('/select', requireAuth, selectSubject);
router.delete('/:id/enrollment', requireAuth, unenrollSubject);

router.get('/', validate(listSubjectsSchema), getSubjects);
router.get('/:id', getSubjectById);
router.patch('/:id/progress', requireAuth, updateProgress);
router.post('/', requireAuth, requireRole('ADMIN', 'INSTRUCTOR'), validate(createSubjectSchema), createSubject);
router.put('/:id', requireAuth, requireRole('ADMIN', 'INSTRUCTOR'), updateSubject);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteSubject);
router.post('/:id/topics', requireAuth, requireRole('ADMIN', 'INSTRUCTOR'), validate(addTopicSchema), addTopic);
router.delete('/topics/:topicId', requireAuth, requireRole('ADMIN', 'INSTRUCTOR'), deleteTopic);

module.exports = router;

