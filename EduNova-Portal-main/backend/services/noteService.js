/**
 * Smart Notes Service (backend/services/noteService.js)
 * 
 * Provides database operations and Sage AI integrations for student notes:
 * - CRUD operations with user isolation
 * - Search, filter, pin, favorite, and tag indexing
 * - Sage AI note generation & Q&A
 * - Note -> Quiz generation
 * - Note -> Flashcard extraction
 * - Note -> Study Planner integration
 */

const prisma = require('../config/db');
const contextBuilder = require('../ai/contextBuilder');
const geminiProvider = require('../ai/geminiProvider');

class NoteService {
  /**
   * Calculate word count and estimated reading time in minutes
   */
  calculateMetrics(content = '') {
    const text = content.replace(/<[^>]*>/g, ' ').trim();
    const words = text ? text.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const readTimeMin = Math.max(1, Math.ceil(wordCount / 180));
    return { wordCount, readTimeMin };
  }

  /**
   * Get all notes for authenticated user with search, filter, and pagination
   */
  async getUserNotes(userId, query = {}) {
    const {
      search,
      subjectId,
      topicId,
      type,
      isPinned,
      isFavorite,
      source,
      tag,
      sort = 'updatedAt_desc',
      page = 1,
      limit = 30
    } = query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 30;
    const skip = (pageNum - 1) * limitNum;

    // Build filter clause
    const where = {
      userId,
      isArchived: false,
    };

    if (subjectId) where.subjectId = subjectId;
    if (topicId) where.topicId = topicId;
    if (type && type !== 'ALL') where.type = type.toUpperCase();
    if (source) where.source = source.toUpperCase();
    if (isPinned === 'true' || isPinned === true) where.isPinned = true;
    if (isFavorite === 'true' || isFavorite === true) where.isFavorite = true;

    // Search query across title, content, type
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { content: { contains: q } },
        { type: { contains: q } }
      ];
    }

    // Determine sorting
    let orderBy = [{ isPinned: 'desc' }, { updatedAt: 'desc' }];
    if (sort === 'createdAt_desc') {
      orderBy = [{ isPinned: 'desc' }, { createdAt: 'desc' }];
    } else if (sort === 'title_asc') {
      orderBy = [{ isPinned: 'desc' }, { title: 'asc' }];
    } else if (sort === 'recently_updated') {
      orderBy = [{ updatedAt: 'desc' }];
    }

    const [notes, totalCount] = await Promise.all([
      prisma.note.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          subject: { select: { id: true, name: true, category: true, educationType: true } },
          topic: { select: { id: true, title: true } }
        }
      }),
      prisma.note.count({ where })
    ]);

    // Client-side tag filtering if requested
    let filteredNotes = notes;
    if (tag && tag.trim()) {
      const cleanTag = tag.trim().toLowerCase();
      filteredNotes = notes.filter(n => {
        const tagList = Array.isArray(n.tags) ? n.tags : [];
        return tagList.some(t => String(t).toLowerCase().includes(cleanTag));
      });
    }

    return {
      notes: filteredNotes,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    };
  }

  /**
   * Get single note by ID (user isolated)
   */
  async getNoteById(userId, noteId) {
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
      include: {
        subject: { select: { id: true, name: true, category: true, class: true, degree: true, exam: true } },
        topic: { select: { id: true, title: true } }
      }
    });

    if (!note) {
      throw new Error('Note not found or unauthorized');
    }

    return note;
  }

  /**
   * Create a new note
   */
  async createNote(userId, data) {
    const { title, content, subjectId, topicId, type = 'GENERAL', source = 'USER', tags = [], attachments = [], isPinned = false, isFavorite = false } = data;

    if (!title || !title.trim()) {
      throw new Error('Note title is required');
    }

    const { wordCount, readTimeMin } = this.calculateMetrics(content || '');

    const newNote = await prisma.note.create({
      data: {
        userId,
        title: title.trim(),
        content: content || '',
        subjectId: subjectId || null,
        topicId: topicId || null,
        type: type.toUpperCase(),
        source: source.toUpperCase(),
        tags: Array.isArray(tags) ? tags : [],
        attachments: Array.isArray(attachments) ? attachments : [],
        isPinned: Boolean(isPinned),
        isFavorite: Boolean(isFavorite),
        wordCount,
        readTimeMin
      },
      include: {
        subject: { select: { id: true, name: true, category: true } },
        topic: { select: { id: true, title: true } }
      }
    });

    return newNote;
  }

  /**
   * Update an existing note
   */
  async updateNote(userId, noteId, data) {
    await this.getNoteById(userId, noteId);

    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.content !== undefined) {
      updateData.content = data.content;
      const { wordCount, readTimeMin } = this.calculateMetrics(data.content);
      updateData.wordCount = wordCount;
      updateData.readTimeMin = readTimeMin;
    }
    if (data.subjectId !== undefined) updateData.subjectId = data.subjectId || null;
    if (data.topicId !== undefined) updateData.topicId = data.topicId || null;
    if (data.type !== undefined) updateData.type = data.type.toUpperCase();
    if (data.isPinned !== undefined) updateData.isPinned = Boolean(data.isPinned);
    if (data.isFavorite !== undefined) updateData.isFavorite = Boolean(data.isFavorite);
    if (data.isArchived !== undefined) updateData.isArchived = Boolean(data.isArchived);
    if (data.tags !== undefined) updateData.tags = Array.isArray(data.tags) ? data.tags : [];
    if (data.attachments !== undefined) updateData.attachments = Array.isArray(data.attachments) ? data.attachments : [];

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: updateData,
      include: {
        subject: { select: { id: true, name: true, category: true } },
        topic: { select: { id: true, title: true } }
      }
    });

    return updatedNote;
  }

  /**
   * Delete note
   */
  async deleteNote(userId, noteId) {
    await this.getNoteById(userId, noteId);
    await prisma.note.delete({ where: { id: noteId } });
    return { success: true, message: 'Note deleted successfully' };
  }

  /**
   * Toggle pin status
   */
  async togglePin(userId, noteId) {
    const note = await this.getNoteById(userId, noteId);
    return this.updateNote(userId, noteId, { isPinned: !note.isPinned });
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(userId, noteId) {
    const note = await this.getNoteById(userId, noteId);
    return this.updateNote(userId, noteId, { isFavorite: !note.isFavorite });
  }

  /**
   * Dynamic stats summary for workspace header & dashboard widget
   */
  async getNotesSummary(userId) {
    const [totalNotes, pinnedCount, favoriteCount, aiNotesCount, recentNotes] = await Promise.all([
      prisma.note.count({ where: { userId, isArchived: false } }),
      prisma.note.count({ where: { userId, isPinned: true, isArchived: false } }),
      prisma.note.count({ where: { userId, isFavorite: true, isArchived: false } }),
      prisma.note.count({ where: { userId, source: 'SAGE_AI', isArchived: false } }),
      prisma.note.findMany({
        where: { userId, isArchived: false },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          type: true,
          isPinned: true,
          isFavorite: true,
          updatedAt: true,
          readTimeMin: true,
          subject: { select: { name: true } }
        }
      })
    ]);

    return {
      totalNotes,
      pinnedCount,
      favoriteCount,
      aiNotesCount,
      recentNotes
    };
  }

  /**
   * Get all tags created across user notes
   */
  async getNoteTags(userId) {
    const notes = await prisma.note.findMany({
      where: { userId, isArchived: false },
      select: { tags: true }
    });

    const tagMap = new Map();
    notes.forEach(note => {
      if (Array.isArray(note.tags)) {
        note.tags.forEach(t => {
          const clean = String(t).trim();
          if (clean) {
            tagMap.set(clean, (tagMap.get(clean) || 0) + 1);
          }
        });
      }
    });

    return Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }));
  }

  /**
   * Generate structured note using Sage AI (Gemini 2.5) based on prompt & student context
   */
  async generateSageNote(userId, { prompt, subjectId, topicId }) {
    if (!prompt || !prompt.trim()) {
      throw new Error('Prompt is required for Sage note generation');
    }

    const studentContext = await contextBuilder.buildStudentContext(userId);
    let subjectName = 'General Science';
    let topicTitle = 'Core Concepts';

    if (subjectId) {
      const sb = await prisma.subject.findUnique({ where: { id: subjectId } });
      if (sb) subjectName = sb.name;
    }
    if (topicId) {
      const tp = await prisma.topic.findUnique({ where: { id: topicId } });
      if (tp) topicTitle = tp.title;
    }

    const systemPrompt = `You are Sage AI, EduNova's expert academic tutor.
Generate comprehensive, highly structured, well-formatted Markdown notes for a student.

Learner Context:
- Stage: ${studentContext.learnerType}
- Target Subject: ${subjectName}
- Target Topic: ${topicTitle}

Requested Topic/Prompt: "${prompt.trim()}"

Output ONLY a JSON object matching this structure:
{
  "title": "Clear, concise descriptive title",
  "type": "REVISION", // Options: GENERAL, REVISION, FORMULA_SHEET, CHEAT_SHEET, SUMMARY, CODE
  "content": "# Title\\n\\n## Concept Overview\\n...\\n\\n## Key Formulas / Principles\\n...\\n\\n## Solved Examples\\n...\\n\\n## Common Pitfalls & Exam Tips\\n...\\n\\n## Quick Summary\\n...",
  "tags": ["#tag1", "#tag2", "#tag3"]
}`;

    const jsonResult = await geminiProvider.generateStructuredJson({
      prompt: `Generate notes for: ${prompt}`,
      systemInstruction: systemPrompt
    });

    if (!jsonResult || !jsonResult.title) {
      throw new Error('Sage AI was unable to generate notes for this topic. Please try rephrasing.');
    }

    return {
      title: jsonResult.title,
      content: jsonResult.content || '',
      type: jsonResult.type || 'REVISION',
      source: 'SAGE_AI',
      subjectId: subjectId || null,
      topicId: topicId || null,
      tags: Array.isArray(jsonResult.tags) ? jsonResult.tags : ['#sage-ai', '#smart-notes']
    };
  }

  /**
   * Convert Note to Quiz using Gemini
   */
  async createQuizFromNote(userId, noteId, { questionCount = 5, difficulty = 'INTERMEDIATE' }) {
    const note = await this.getNoteById(userId, noteId);

    const prompt = `Generate a ${questionCount}-question multiple-choice quiz based STRICTLY on the following note content:

Title: ${note.title}
Content:
${note.content}

Return ONLY valid JSON with this exact schema:
{
  "title": "Quiz: ${note.title}",
  "difficulty": "${difficulty}",
  "totalQuestions": ${questionCount},
  "questions": [
    {
      "questionText": "Question string",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 0,
      "explanation": "Detailed step-by-step explanation"
    }
  ]
}`;

    const quizData = await geminiProvider.generateStructuredJson({
      prompt: `Build quiz from note ${note.title}`,
      systemInstruction: prompt
    });

    if (!quizData || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      throw new Error('Unable to extract quiz questions from this note.');
    }

    return quizData;
  }

  /**
   * Convert Note to Flashcards using Gemini
   */
  async createFlashcardsFromNote(userId, noteId, { count = 5 }) {
    const note = await this.getNoteById(userId, noteId);

    const prompt = `Extract ${count} essential concept flashcards from the following note content:

Title: ${note.title}
Content:
${note.content}

Return ONLY valid JSON with this exact schema:
{
  "title": "Flashcards: ${note.title}",
  "cards": [
    {
      "front": "Front question or concept prompt",
      "back": "Back answer or definition",
      "category": "Key Concept"
    }
  ]
}`;

    const flashcardData = await geminiProvider.generateStructuredJson({
      prompt: `Build flashcards from note ${note.title}`,
      systemInstruction: prompt
    });

    if (!flashcardData || !Array.isArray(flashcardData.cards)) {
      throw new Error('Unable to extract flashcards from this note.');
    }

    return flashcardData;
  }

  /**
   * Add Note to Study Planner
   */
  async addToStudyPlanner(userId, noteId, { plannedDate, durationMinutes = 30 }) {
    const note = await this.getNoteById(userId, noteId);

    if (!note.subjectId) {
      // Find default subject or assign first subject
      const defaultSubject = await prisma.subject.findFirst();
      if (defaultSubject) note.subjectId = defaultSubject.id;
    }

    if (!note.subjectId) {
      throw new Error('To schedule a study plan, please assign a subject to this note first.');
    }

    const session = await prisma.studySession.create({
      data: {
        userId,
        subjectId: note.subjectId,
        durationMinutes: parseInt(durationMinutes, 10) || 30,
        plannedDate: plannedDate ? new Date(plannedDate) : new Date(Date.now() + 86400000),
        completed: false
      },
      include: {
        subject: { select: { name: true } }
      }
    });

    return session;
  }

  /**
   * Ask Sage AI about note (Explain simply, summarize, key concepts)
   */
  async askSageAboutNote(userId, noteId, { action, customPrompt }) {
    const note = await this.getNoteById(userId, noteId);

    let systemPrompt = `You are Sage AI tutor assisting a student with their saved note.
Note Title: ${note.title}
Note Content:
${note.content}

Provide a helpful, precise markdown response for action: "${action || 'explain'}".`;

    let userQuery = customPrompt || 'Explain this note simply with key takeaways.';
    if (action === 'SUMMARIZE') {
      userQuery = 'Provide a 3-bullet point executive revision summary of this note.';
    } else if (action === 'KEY_CONCEPTS') {
      userQuery = 'List all key definitions, formulas, and critical concepts in this note.';
    } else if (action === 'MISSING_CONCEPTS') {
      userQuery = 'Identify any missing prerequisite concepts or logical gaps in this note.';
    }

    const reply = await geminiProvider.generateChatReply({
      systemInstruction: systemPrompt,
      history: [],
      message: userQuery
    });

    return { action, reply: reply.trim() };
  }
}

module.exports = new NoteService();
