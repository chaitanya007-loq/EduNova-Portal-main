/**
 * Smart Notes Controller (backend/controllers/noteController.js)
 * Express HTTP handlers for Smart Notes API endpoints
 */

const noteService = require('../services/noteService');

class NoteController {
  async getNotes(req, res, next) {
    try {
      const result = await noteService.getUserNotes(req.user.id, req.query);
      return res.json({
        success: true,
        data: result.notes,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getNotesSummary(req, res, next) {
    try {
      const summary = await noteService.getNotesSummary(req.user.id);
      return res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  async getTags(req, res, next) {
    try {
      const tags = await noteService.getNoteTags(req.user.id);
      return res.json({
        success: true,
        data: tags
      });
    } catch (error) {
      next(error);
    }
  }

  async getNote(req, res, next) {
    try {
      const note = await noteService.getNoteById(req.user.id, req.params.id);
      return res.json({
        success: true,
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async createNote(req, res, next) {
    try {
      const newNote = await noteService.createNote(req.user.id, req.body);
      return res.status(201).json({
        success: true,
        message: 'Note created successfully',
        data: newNote
      });
    } catch (error) {
      next(error);
    }
  }

  async updateNote(req, res, next) {
    try {
      const updatedNote = await noteService.updateNote(req.user.id, req.params.id, req.body);
      return res.json({
        success: true,
        message: 'Note updated successfully',
        data: updatedNote
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req, res, next) {
    try {
      const result = await noteService.deleteNote(req.user.id, req.params.id);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async togglePin(req, res, next) {
    try {
      const note = await noteService.togglePin(req.user.id, req.params.id);
      return res.json({
        success: true,
        message: note.isPinned ? 'Note pinned' : 'Note unpinned',
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleFavorite(req, res, next) {
    try {
      const note = await noteService.toggleFavorite(req.user.id, req.params.id);
      return res.json({
        success: true,
        message: note.isFavorite ? 'Added to favorites' : 'Removed from favorites',
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async generateSageNote(req, res, next) {
    try {
      const generatedNote = await noteService.generateSageNote(req.user.id, req.body);
      return res.json({
        success: true,
        message: 'Sage note draft generated',
        data: generatedNote
      });
    } catch (error) {
      next(error);
    }
  }

  async createQuizFromNote(req, res, next) {
    try {
      const quiz = await noteService.createQuizFromNote(req.user.id, req.params.id, req.body);
      return res.json({
        success: true,
        message: 'Quiz generated from note content',
        data: quiz
      });
    } catch (error) {
      next(error);
    }
  }

  async createFlashcardsFromNote(req, res, next) {
    try {
      const flashcards = await noteService.createFlashcardsFromNote(req.user.id, req.params.id, req.body);
      return res.json({
        success: true,
        message: 'Flashcards generated from note content',
        data: flashcards
      });
    } catch (error) {
      next(error);
    }
  }

  async addToStudyPlanner(req, res, next) {
    try {
      const session = await noteService.addToStudyPlanner(req.user.id, req.params.id, req.body);
      return res.json({
        success: true,
        message: 'Note added to Study Planner session',
        data: session
      });
    } catch (error) {
      next(error);
    }
  }

  async askSageAboutNote(req, res, next) {
    try {
      const response = await noteService.askSageAboutNote(req.user.id, req.params.id, req.body);
      return res.json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NoteController();
