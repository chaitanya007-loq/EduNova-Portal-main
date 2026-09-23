import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Sparkles,
  Paperclip,
  Search,
  Filter,
  ArrowUpDown,
  Pin,
  Heart,
  FileText,
  Clock,
  Layers,
  GraduationCap,
  HelpCircle,
  Calendar,
  MoreVertical,
  Trash2,
  Edit3,
  Tag as TagIcon,
  CheckCircle2,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { notesService } from '../../services/notesService';
import { subjectService } from '../../services/subjectService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLearner } from '../../context/LearnerContext';

import { NoteEditorModal } from '../../components/notes/NoteEditorModal';
import { SageNoteGeneratorModal } from '../../components/notes/SageNoteGeneratorModal';
import { NoteQuizGeneratorModal } from '../../components/notes/NoteQuizGeneratorModal';
import { NoteFlashcardModal } from '../../components/notes/NoteFlashcardModal';
import { EduNovaHeroBanner } from '../../components/common/EduNovaHeroBanner';

export const NotesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { profile } = useLearner() || {};
  const isLight = theme === 'light';

  // State Management
  const [notes, setNotes] = useState([]);
  const [summary, setSummary] = useState({
    totalNotes: 0,
    pinnedCount: 0,
    favoriteCount: 0,
    aiNotesCount: 0
  });
  const [subjects, setSubjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PINNED' | 'FAVORITES' | 'SUBJECTS' | 'AI_NOTES' | 'RECENT'
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt_desc');

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [isSageModalOpen, setIsSageModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [quizNote, setQuizNote] = useState(null);
  const [flashcardNote, setFlashcardNote] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [searchQuery, activeTab, selectedSubjectId, selectedType, selectedTag, sortBy]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [subs, sumData, tagList] = await Promise.all([
        subjectService.getStudentSubjects(),
        notesService.getSummary(),
        notesService.getTags()
      ]);
      setSubjects(subs || []);
      if (sumData) setSummary(sumData);
      setTags(tagList || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const params = {
        search: searchQuery,
        subjectId: selectedSubjectId,
        type: selectedType,
        tag: selectedTag,
        sort: sortBy
      };

      if (activeTab === 'PINNED') params.isPinned = true;
      if (activeTab === 'FAVORITES') params.isFavorite = true;
      if (activeTab === 'AI_NOTES') params.source = 'SAGE_AI';

      const data = await notesService.getNotes(params);
      setNotes(data || []);

      // Refresh summary numbers
      const sumData = await notesService.getSummary();
      if (sumData) setSummary(sumData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNew = () => {
    setActiveNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setActiveNote(note);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = async (e, noteId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      await notesService.deleteNote(noteId);
      fetchNotes();
    }
  };

  const handleTogglePin = async (e, noteId) => {
    e.stopPropagation();
    await notesService.togglePin(noteId);
    fetchNotes();
  };

  const handleToggleFavorite = async (e, noteId) => {
    e.stopPropagation();
    await notesService.toggleFavorite(noteId);
    fetchNotes();
  };

  // Determine Learner Context Text
  const getLearnerContextBadge = () => {
    const learnerType = user?.learnerType || 'SCHOOL';
    if (learnerType === 'SCHOOL') return `🏫 Class 10 CBSE • ${subjects.length} Active Subjects`;
    if (learnerType === 'COLLEGE') return `🎓 B.Tech CSE (Sem 5) • ${subjects.length} Subjects`;
    if (learnerType === 'EXAM') return `📝 CMAT Exam Prep Command Center`;
    return `💻 Full Stack Skill DNA Workspace`;
  };

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO GLASS BANNER HEADER WITH 3D GLASS ORB GRAPHIC          */}
      {/* ------------------------------------------------------------- */}
      <div style={{ marginBottom: '28px' }}>
        <EduNovaHeroBanner
          badge={`🏫 ${getLearnerContextBadge()}`}
          title="Smart Notes & Knowledge Workspace"
          subtitle="Capture, organize, and turn what you learn into long-term knowledge with Sage AI."
          actions={
            <>
              <button
                onClick={handleCreateNew}
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)'
                }}
              >
                <Plus size={18} /> New Note
              </button>

              <button
                onClick={() => setIsSageModalOpen(true)}
                style={{
                  padding: '12px 22px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))',
                  color: isLight ? '#0f172a' : '#ffffff',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <Sparkles size={18} color="#c084fc" /> Create with Sage
              </button>
            </>
          }
          stats={[
            { label: summary.totalNotes, subtext: 'Total Notes', icon: BookOpen, color: '#38bdf8', iconBg: 'rgba(56, 189, 248, 0.2)' },
            { label: summary.pinnedCount, subtext: 'Pinned Notes', icon: Pin, color: '#fbbf24', iconBg: 'rgba(251, 191, 36, 0.2)' },
            { label: summary.favoriteCount, subtext: 'Favorites', icon: Heart, color: '#f43f5e', iconBg: 'rgba(244, 63, 94, 0.2)' },
            { label: summary.aiNotesCount, subtext: 'Sage AI Notes', icon: Sparkles, color: '#c084fc', iconBg: 'rgba(192, 132, 252, 0.2)' }
          ]}
          rightGraphic={true}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. SEARCH & FILTERS CONTROLS BAR                             */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(28px)',
        border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.18)',
        padding: '16px 20px',
        borderRadius: '24px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.06)',
          border: isLight ? '1px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
          padding: '8px 16px',
          borderRadius: '9999px',
          flex: 1,
          minWidth: '260px'
        }}>
          <Search size={18} color={isLight ? '#0284c7' : '#38bdf8'} />
          <input
            type="text"
            placeholder="Search notes by title, content, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: isLight ? '#0f172a' : '#ffffff',
              fontSize: '0.9rem',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>

        {/* Subject Filter */}
        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          style={{
            padding: '9px 16px',
            borderRadius: '9999px',
            background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
            border: isLight ? '1px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)',
            color: isLight ? '#0f172a' : '#ffffff',
            fontSize: '0.86rem',
            fontWeight: 700,
            outline: 'none'
          }}
        >
          <option value="">All Subjects</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* Sort Selector */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '9px 16px',
            borderRadius: '9999px',
            background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
            border: isLight ? '1px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)',
            color: isLight ? '#0f172a' : '#ffffff',
            fontSize: '0.86rem',
            fontWeight: 700,
            outline: 'none'
          }}
        >
          <option value="updatedAt_desc">Recently Updated</option>
          <option value="createdAt_desc">Recently Created</option>
          <option value="title_asc">Alphabetical</option>
        </select>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. NAVIGATION TABS                                           */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '28px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'ALL', label: 'All Notes' },
          { id: 'PINNED', label: '📌 Pinned' },
          { id: 'FAVORITES', label: '♡ Favorites' },
          { id: 'AI_NOTES', label: '✨ AI Generated' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 22px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: 800,
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.4) 0%, rgba(168, 85, 247, 0.4) 100%)'
                : (isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)'),
              color: activeTab === tab.id ? '#ffffff' : (isLight ? '#0f172a' : '#cbd5e1'),
              border: activeTab === tab.id ? '1px solid rgba(56, 189, 248, 0.7)' : '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.25s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. NOTES GRID & CARDS                                        */}
      {/* ------------------------------------------------------------- */}
      {notes.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {notes.map(note => (
            <motion.div
              key={note.id}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => handleEditNote(note)}
              style={{
                background: isLight
                  ? 'rgba(255, 255, 255, 0.95)'
                  : 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: isLight
                  ? '0 10px 30px rgba(0,0,0,0.06)'
                  : '0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div>
                {/* Top Badge & Pin/Favorite */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.15)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}>
                    {note.type}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={(e) => handleTogglePin(e, note.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <Pin size={16} color={note.isPinned ? '#fbbf24' : '#64748b'} fill={note.isPinned ? '#fbbf24' : 'none'} />
                    </button>
                    <button
                      onClick={(e) => handleToggleFavorite(e, note.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <Heart size={16} color={note.isFavorite ? '#f43f5e' : '#64748b'} fill={note.isFavorite ? '#f43f5e' : 'none'} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: isLight ? '#0f172a' : '#ffffff',
                  margin: '0 0 8px 0',
                  lineHeight: 1.3
                }}>
                  {note.title}
                </h3>

                {/* Content Snippet */}
                <p style={{
                  fontSize: '0.88rem',
                  color: isLight ? '#475569' : '#cbd5e1',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  margin: '0 0 16px 0'
                }}>
                  {note.content || 'Empty note...'}
                </p>
              </div>

              <div>
                {/* Subject & Word Count */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: isLight ? '#64748b' : '#94a3b8', borderTop: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                  <span>{note.subject?.name || 'General'}</span>
                  <span>{note.readTimeMin || 1} min read</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* ZERO STATE (CRITICAL: NO HARDCODED DEMO NOTES) */
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(24px)',
          borderRadius: '32px',
          border: isLight ? '1.5px dashed rgba(200,220,240,0.9)' : '1px dashed rgba(255,255,255,0.16)'
        }}>
          <FolderOpen size={48} color="#38bdf8" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 8px 0' }}>
            Your knowledge workspace is empty.
          </h3>
          <p style={{ color: isLight ? '#64748b' : '#cbd5e1', fontSize: '0.98rem', maxWidth: '440px', margin: '0 auto 24px auto' }}>
            Create your first note or ask Sage to build one for you.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
            <button
              onClick={handleCreateNew}
              style={{
                padding: '12px 26px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              + Create First Note
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      <NoteEditorModal
        note={activeNote}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaveSuccess={fetchNotes}
        subjects={subjects}
        onOpenQuizModal={(n) => { setQuizNote(n); setIsQuizModalOpen(true); }}
        onOpenFlashcardModal={(n) => { setFlashcardNote(n); setIsFlashcardModalOpen(true); }}
      />

      <SageNoteGeneratorModal
        isOpen={isSageModalOpen}
        onClose={() => setIsSageModalOpen(false)}
        onSaveGeneratedNote={fetchNotes}
        subjects={subjects}
      />

      <NoteQuizGeneratorModal
        note={quizNote}
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      <NoteFlashcardModal
        note={flashcardNote}
        isOpen={isFlashcardModalOpen}
        onClose={() => setIsFlashcardModalOpen(false)}
      />
    </div>
  );
};

export default NotesPage;
