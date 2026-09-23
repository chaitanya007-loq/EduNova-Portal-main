/**
 * Smart Notes Frontend Service (src/services/notesService.js)
 * Interacts with noteApi with optimistic fallback support for seamless user experience.
 */

import { noteApi, showToast } from '../lib/apiClient';

const LOCAL_STORAGE_KEY = 'edunova_smart_notes_v1';

const INITIAL_LOCAL_NOTES = [
  {
    id: 'note-1',
    title: 'Physics Mechanics & Kinematic Equations Summary',
    content: 'Key equations: v = u + at, s = ut + 0.5at^2, v^2 = u^2 + 2as. Projectile motion velocity vectors at apex v_y = 0.',
    subjectId: 'sub-physics',
    subjectName: 'Physics (Science)',
    tags: ['Physics', 'Mechanics', 'Formulas'],
    isPinned: true,
    isFavorite: true,
    isAiGenerated: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'note-2',
    title: 'DBMS SQL Join Types & Normalization Checklist',
    content: '1NF: Atomic values. 2NF: No partial dependency. 3NF: No transitive dependency. Inner Join vs Left Outer Join performance indexing.',
    subjectId: 'sub-dbms',
    subjectName: 'Database Systems',
    tags: ['DBMS', 'SQL', 'Database'],
    isPinned: false,
    isFavorite: true,
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const getLocalNotes = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_LOCAL_NOTES));
  return INITIAL_LOCAL_NOTES;
};

const saveLocalNotes = (notes) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('edunova_note_updated'));
    }
  } catch (e) {}
};

class NotesService {
  async getNotes(params = {}) {
    try {
      const res = await noteApi.getNotes(params);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn('[NotesService] Backend fetch failed, using local storage fallback:', err.message);
    }

    let list = getLocalNotes();
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (params.subjectId) {
      list = list.filter(n => n.subjectId === params.subjectId);
    }
    if (params.isPinned) {
      list = list.filter(n => n.isPinned);
    }
    if (params.isFavorite) {
      list = list.filter(n => n.isFavorite);
    }
    return list;
  }

  async getSummary() {
    try {
      const res = await noteApi.getSummary();
      if (res && res.success && res.data) {
        return res.data;
      }
    } catch (err) {}

    const notes = getLocalNotes();
    return {
      totalNotes: notes.length,
      pinnedCount: notes.filter(n => n.isPinned).length,
      favoriteCount: notes.filter(n => n.isFavorite).length,
      aiNotesCount: notes.filter(n => n.isAiGenerated).length,
      recentNotes: notes.slice(0, 5)
    };
  }

  async getTags() {
    try {
      const res = await noteApi.getTags();
      if (res && res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err) {}

    const notes = getLocalNotes();
    const tagSet = new Set();
    notes.forEach(n => {
      if (n.tags) n.tags.forEach(t => tagSet.add(t));
    });
    return Array.from(tagSet);
  }

  async getNote(id) {
    try {
      const res = await noteApi.getNote(id);
      if (res && res.success && res.data) {
        return res.data;
      }
    } catch (err) {}

    const notes = getLocalNotes();
    return notes.find(n => n.id === id) || null;
  }

  async createNote(noteData) {
    let createdNote = null;
    try {
      const res = await noteApi.createNote(noteData);
      if (res && res.success && res.data) {
        createdNote = res.data;
      }
    } catch (err) {
      console.warn('[NotesService] Backend createNote failed, using local storage:', err.message);
    }

    if (!createdNote) {
      createdNote = {
        id: `note-${Date.now()}`,
        title: noteData.title || 'Untitled Note',
        content: noteData.content || '',
        subjectId: noteData.subjectId || '',
        subjectName: noteData.subjectName || 'General',
        tags: noteData.tags || [],
        isPinned: !!noteData.isPinned,
        isFavorite: !!noteData.isFavorite,
        isAiGenerated: !!noteData.isAiGenerated,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const notes = getLocalNotes();
      notes.unshift(createdNote);
      saveLocalNotes(notes);
    }
    showToast('Note saved successfully!', 'success');
    return createdNote;
  }

  async updateNote(id, noteData) {
    let updatedNote = null;
    try {
      const res = await noteApi.updateNote(id, noteData);
      if (res && res.success && res.data) {
        updatedNote = res.data;
      }
    } catch (err) {
      console.warn('[NotesService] Backend updateNote failed, using local storage:', err.message);
    }

    const notes = getLocalNotes();
    const idx = notes.findIndex(n => n.id === id);
    if (idx !== -1) {
      notes[idx] = { ...notes[idx], ...noteData, updatedAt: new Date().toISOString() };
      saveLocalNotes(notes);
      if (!updatedNote) updatedNote = notes[idx];
    }
    showToast('Note updated successfully!', 'success');
    return updatedNote;
  }

  async deleteNote(id) {
    try {
      await noteApi.deleteNote(id);
    } catch (err) {
      console.warn('[NotesService] Backend deleteNote failed, updating local storage:', err.message);
    }

    let notes = getLocalNotes();
    notes = notes.filter(n => n.id !== id);
    saveLocalNotes(notes);
    showToast('Note deleted.', 'success');
    return true;
  }

  async togglePin(id) {
    let updatedNote = null;
    try {
      const res = await noteApi.togglePin(id);
      if (res && res.success && res.data) {
        updatedNote = res.data;
      }
    } catch (err) {}

    const notes = getLocalNotes();
    const note = notes.find(n => n.id === id);
    if (note) {
      note.isPinned = !note.isPinned;
      saveLocalNotes(notes);
      if (!updatedNote) updatedNote = note;
    }
    showToast(note?.isPinned ? 'Note pinned' : 'Note unpinned', 'success');
    return updatedNote;
  }

  async toggleFavorite(id) {
    let updatedNote = null;
    try {
      const res = await noteApi.toggleFavorite(id);
      if (res && res.success && res.data) {
        updatedNote = res.data;
      }
    } catch (err) {}

    const notes = getLocalNotes();
    const note = notes.find(n => n.id === id);
    if (note) {
      note.isFavorite = !note.isFavorite;
      saveLocalNotes(notes);
      if (!updatedNote) updatedNote = note;
    }
    showToast(note?.isFavorite ? 'Added to favorites' : 'Removed from favorites', 'success');
    return updatedNote;
  }

  async generateSageNote(payload) {
    try {
      const res = await noteApi.generateSageNote(payload);
      if (res && res.success) {
        showToast('Sage AI generated note draft!', 'success');
        return res.data;
      }
      throw new Error(res?.message || 'Sage AI generation failed');
    } catch (err) {
      showToast(err.message || 'Sage AI is temporarily unavailable.', 'error');
      throw err;
    }
  }

  async createQuizFromNote(id, payload) {
    try {
      const res = await noteApi.createQuizFromNote(id, payload);
      if (res && res.success) {
        showToast('Quiz generated from note!', 'success');
        return res.data;
      }
      throw new Error(res?.message || 'Quiz generation failed');
    } catch (err) {
      showToast(err.message || 'Unable to generate quiz from this note.', 'error');
      throw err;
    }
  }

  async createFlashcardsFromNote(id, payload) {
    try {
      const res = await noteApi.createFlashcardsFromNote(id, payload);
      if (res && res.success) {
        showToast('Flashcards generated from note!', 'success');
        return res.data;
      }
      throw new Error(res?.message || 'Flashcards generation failed');
    } catch (err) {
      showToast(err.message || 'Unable to extract flashcards from this note.', 'error');
      throw err;
    }
  }

  async addToStudyPlanner(id, payload) {
    try {
      const res = await noteApi.addToStudyPlanner(id, payload);
      if (res && res.success) {
        showToast('Note added to Study Planner!', 'success');
        return res.data;
      }
      throw new Error(res?.message || 'Failed to add to Study Planner');
    } catch (err) {
      showToast(err.message || 'Unable to add to Study Planner.', 'error');
      throw err;
    }
  }

  async askSageAboutNote(id, payload) {
    try {
      const res = await noteApi.askSageAboutNote(id, payload);
      if (res && res.success) {
        return res.data;
      }
      throw new Error(res?.message || 'Sage AI query failed');
    } catch (err) {
      showToast(err.message || 'Unable to consult Sage AI about this note.', 'error');
      throw err;
    }
  }
}

export const notesService = new NotesService();
export default notesService;
