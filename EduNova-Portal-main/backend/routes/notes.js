/**
 * Smart Notes Routes
 * Base path: /api/notes
 */

const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { requireAuth } = require('../middleware/auth');

// All notes endpoints require authentication
router.use(requireAuth);

// Collection endpoints
router.get('/', noteController.getNotes);
router.get('/summary', noteController.getNotesSummary);
router.get('/tags', noteController.getTags);
router.post('/', noteController.createNote);
router.post('/generate-sage', noteController.generateSageNote);

// Item endpoints
router.get('/:id', noteController.getNote);
router.patch('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

// Actions
router.post('/:id/pin', noteController.togglePin);
router.post('/:id/favorite', noteController.toggleFavorite);
router.post('/:id/create-quiz', noteController.createQuizFromNote);
router.post('/:id/create-flashcards', noteController.createFlashcardsFromNote);
router.post('/:id/add-to-planner', noteController.addToStudyPlanner);
router.post('/:id/ask-sage', noteController.askSageAboutNote);

module.exports = router;
