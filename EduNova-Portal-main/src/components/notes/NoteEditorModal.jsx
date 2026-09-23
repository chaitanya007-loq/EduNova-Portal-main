import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Pin,
  Heart,
  Sparkles,
  HelpCircle,
  Layers,
  Calendar,
  Tag as TagIcon,
  Paperclip,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Quote,
  Heading1,
  Heading2,
  Table,
  CheckCircle2,
  Clock,
  BookOpen
} from 'lucide-react';
import { notesService } from '../../services/notesService';
import { useTheme } from '../../context/ThemeContext';

export const NOTE_TYPES = [
  { id: 'GENERAL', label: 'General Notes', color: '#38bdf8' },
  { id: 'CLASS', label: 'Class Notes', color: '#a5b4fc' },
  { id: 'REVISION', label: 'Revision Notes', color: '#fbbf24' },
  { id: 'FORMULA_SHEET', label: 'Formula Sheet', color: '#34d399' },
  { id: 'IMPORTANT_QUESTIONS', label: 'Important Questions', color: '#f43f5e' },
  { id: 'SUMMARY', label: 'Summary', color: '#c084fc' },
  { id: 'CHEAT_SHEET', label: 'Cheat Sheet', color: '#fb7185' },
  { id: 'PROJECT', label: 'Project Notes', color: '#38bdf8' },
  { id: 'RESEARCH', label: 'Research Notes', color: '#818cf8' },
  { id: 'EXAM', label: 'Exam Notes', color: '#f59e0b' },
  { id: 'CODE', label: 'Code Notes', color: '#10b981' },
  { id: 'AI_NOTE', label: 'AI Notes', color: '#d946ef' }
];

export const NoteEditorModal = ({
  note = null,
  isOpen = false,
  onClose,
  onSaveSuccess,
  subjects = [],
  topics = [],
  onOpenQuizModal,
  onOpenFlashcardModal,
  onOpenStudyPlanModal,
  onOpenAskSageModal
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('GENERAL');
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isPinned, setIsPinned] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved'
  const [loading, setLoading] = useState(false);

  const autoSaveTimerRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setType(note.type || 'GENERAL');
      setSubjectId(note.subjectId || '');
      setTopicId(note.topicId || '');
      setTags(Array.isArray(note.tags) ? note.tags : []);
      setAttachments(Array.isArray(note.attachments) ? note.attachments : []);
      setIsPinned(Boolean(note.isPinned));
      setIsFavorite(Boolean(note.isFavorite));
      setSaveStatus('saved');
    } else {
      setTitle('');
      setContent('');
      setType('GENERAL');
      setSubjectId(subjects[0]?.id || '');
      setTopicId('');
      setTags([]);
      setAttachments([]);
      setIsPinned(false);
      setIsFavorite(false);
      setSaveStatus('saved');
    }
    isFirstRender.current = true;
  }, [note, subjects, isOpen]);

  // Handle content/title change & trigger debounced auto-save
  const handleContentChange = (newContent) => {
    setContent(newContent);
    setSaveStatus('unsaved');

    if (note && note.id) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        performAutoSave(newContent, title);
      }, 1200);
    }
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    setSaveStatus('unsaved');

    if (note && note.id) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        performAutoSave(content, newTitle);
      }, 1200);
    }
  };

  const performAutoSave = async (c, t) => {
    if (!note || !note.id || !t.trim()) return;
    try {
      setSaveStatus('saving');
      await notesService.updateNote(note.id, {
        title: t.trim(),
        content: c,
        type,
        subjectId: subjectId || null,
        topicId: topicId || null,
        tags,
        isPinned,
        isFavorite
      });
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('unsaved');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your note.');
      return;
    }

    try {
      setLoading(true);
      setSaveStatus('saving');

      const payload = {
        title: title.trim(),
        content,
        type,
        subjectId: subjectId || null,
        topicId: topicId || null,
        tags,
        attachments,
        isPinned,
        isFavorite
      };

      let saved;
      if (note && note.id) {
        saved = await notesService.updateNote(note.id, payload);
      } else {
        saved = await notesService.createNote(payload);
      }

      setSaveStatus('saved');
      if (onSaveSuccess) onSaveSuccess(saved);
      onClose();
    } catch (err) {
      setSaveStatus('unsaved');
    } finally {
      setLoading(false);
    }
  };

  const insertFormat = (prefix, suffix = '') => {
    const textarea = document.getElementById('note-editor-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = prefix + (selectedText || 'Text') + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    handleContentChange(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText || 'Text').length);
    }, 50);
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      let clean = tagInput.trim();
      if (!clean.startsWith('#')) clean = '#' + clean;
      if (!tags.includes(clean)) {
        const newTags = [...tags, clean];
        setTags(newTags);
        setSaveStatus('unsaved');
      }
      setTagInput('');
    }
  };

  const removeTag = (tToRemove) => {
    setTags(tags.filter(t => t !== tToRemove));
    setSaveStatus('unsaved');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 22, 0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '920px',
        maxHeight: '92vh',
        background: isLight ? '#ffffff' : 'linear-gradient(135deg, rgba(18, 26, 56, 0.96) 0%, rgba(10, 15, 38, 0.98) 100%)',
        border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '28px',
        boxShadow: isLight ? '0 25px 70px rgba(0,0,0,0.2)' : '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(56, 189, 248, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* MODAL HEADER */}
        <div style={{
          padding: '20px 28px',
          borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isLight ? 'rgba(248, 250, 252, 0.9)' : 'rgba(255, 255, 255, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(168, 85, 247, 0.25))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={20} color="#38bdf8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                {note ? 'Edit Note' : 'Create New Note'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {saveStatus === 'saving' ? 'Saving changes...' : saveStatus === 'unsaved' ? 'Unsaved changes' : 'All changes saved'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Pin Toggle */}
            <button
              onClick={() => { setIsPinned(!isPinned); setSaveStatus('unsaved'); }}
              title={isPinned ? 'Unpin Note' : 'Pin Note'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: isPinned ? 'rgba(251, 191, 36, 0.25)' : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'),
                border: isPinned ? '1px solid rgba(251, 191, 36, 0.6)' : '1px solid transparent',
                color: isPinned ? '#fbbf24' : (isLight ? '#64748b' : '#94a3b8'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Pin size={16} fill={isPinned ? '#fbbf24' : 'none'} />
            </button>

            {/* Favorite Toggle */}
            <button
              onClick={() => { setIsFavorite(!isFavorite); setSaveStatus('unsaved'); }}
              title={isFavorite ? 'Remove Favorite' : 'Add Favorite'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: isFavorite ? 'rgba(244, 63, 94, 0.25)' : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'),
                border: isFavorite ? '1px solid rgba(244, 63, 94, 0.6)' : '1px solid transparent',
                color: isFavorite ? '#f43f5e' : (isLight ? '#64748b' : '#94a3b8'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Heart size={16} fill={isFavorite ? '#f43f5e' : 'none'} />
            </button>

            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
                border: 'none',
                color: isLight ? '#0f172a' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* METADATA BAR (Subject, Topic, Type) */}
        <div style={{
          padding: '16px 28px',
          background: isLight ? 'rgba(241, 245, 249, 0.7)' : 'rgba(255, 255, 255, 0.02)',
          borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px'
        }}>
          {/* Title Input */}
          <div style={{ gridColumn: '1 / -1' }}>
            <input
              type="text"
              placeholder="Note Title..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: isLight ? '#0f172a' : '#ffffff',
                outline: 'none'
              }}
            />
          </div>

          {/* Subject Dropdown */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => { setSubjectId(e.target.value); setSaveStatus('unsaved'); }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '12px',
                background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.8)',
                border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.15)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              <option value="">Select Subject...</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.category || 'Core'})</option>
              ))}
            </select>
          </div>

          {/* Note Type Dropdown */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Note Type
            </label>
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); setSaveStatus('unsaved'); }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '12px',
                background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.8)',
                border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.15)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              {NOTE_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Tags Input */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Add Tags (Press Enter)
            </label>
            <input
              type="text"
              placeholder="#exam #important..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '12px',
                background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.8)',
                border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.15)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 600,
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* TAGS CHIPS ROW */}
        {tags.length > 0 && (
          <div style={{ padding: '8px 28px', display: 'flex', gap: '6px', flexWrap: 'wrap', background: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.2)' }}>
            {tags.map((t, i) => (
              <span key={i} style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '3px 10px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {t}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag(t)} />
              </span>
            ))}
          </div>
        )}

        {/* EDITOR FORMATTING TOOLBAR */}
        <div style={{
          padding: '10px 28px',
          background: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.9)',
          borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap'
        }}>
          <button onClick={() => insertFormat('**', '**')} title="Bold" style={toolbarBtnStyle(isLight)}><Bold size={15} /></button>
          <button onClick={() => insertFormat('*', '*')} title="Italic" style={toolbarBtnStyle(isLight)}><Italic size={15} /></button>
          <button onClick={() => insertFormat('<u>', '</u>')} title="Underline" style={toolbarBtnStyle(isLight)}><Underline size={15} /></button>
          <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />

          <button onClick={() => insertFormat('# ')} title="Heading 1" style={toolbarBtnStyle(isLight)}><Heading1 size={15} /></button>
          <button onClick={() => insertFormat('## ')} title="Heading 2" style={toolbarBtnStyle(isLight)}><Heading2 size={15} /></button>
          <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />

          <button onClick={() => insertFormat('- ')} title="Bullet List" style={toolbarBtnStyle(isLight)}><List size={15} /></button>
          <button onClick={() => insertFormat('1. ')} title="Numbered List" style={toolbarBtnStyle(isLight)}><ListOrdered size={15} /></button>
          <button onClick={() => insertFormat('- [ ] ')} title="Checklist" style={toolbarBtnStyle(isLight)}><CheckSquare size={15} /></button>
          <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />

          <button onClick={() => insertFormat('```javascript\n', '\n```')} title="Code Block" style={toolbarBtnStyle(isLight)}><Code size={15} /></button>
          <button onClick={() => insertFormat('> ')} title="Quote" style={toolbarBtnStyle(isLight)}><Quote size={15} /></button>
          <button onClick={() => insertFormat('\n$$\n', '\n$$\n')} title="Math Formula" style={toolbarBtnStyle(isLight)}>$$</button>
        </div>

        {/* EDITOR TEXTAREA BODY */}
        <div style={{ flex: 1, padding: '20px 28px', minHeight: '280px', display: 'flex', flexDirection: 'column' }}>
          <textarea
            id="note-editor-textarea"
            placeholder="Write your note content here (Markdown supported)..."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            style={{
              width: '100%',
              flex: 1,
              minHeight: '260px',
              background: 'transparent',
              border: 'none',
              color: isLight ? '#0f172a' : '#e2e8f0',
              fontSize: '0.98rem',
              lineHeight: 1.7,
              outline: 'none',
              resize: 'none',
              fontFamily: "'Inter', monospace, sans-serif"
            }}
          />
        </div>

        {/* SAGE AI POWERED ACTION BAR (Quiz, Flashcard, Study Plan, Ask Sage) */}
        {note && note.id && (
          <div style={{
            padding: '12px 28px',
            background: isLight ? 'rgba(240, 246, 255, 0.8)' : 'rgba(15, 23, 42, 0.85)',
            borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Sage AI Intelligence Actions:
            </span>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onOpenQuizModal && onOpenQuizModal(note)}
                style={aiActionBtnStyle(isLight)}
              >
                🧠 Create Quiz
              </button>
              <button
                onClick={() => onOpenFlashcardModal && onOpenFlashcardModal(note)}
                style={aiActionBtnStyle(isLight)}
              >
                🎴 Flashcards
              </button>
              <button
                onClick={() => onOpenStudyPlanModal && onOpenStudyPlanModal(note)}
                style={aiActionBtnStyle(isLight)}
              >
                📅 Study Plan
              </button>
              <button
                onClick={() => onOpenAskSageModal && onOpenAskSageModal(note)}
                style={aiActionBtnStyle(isLight, true)}
              >
                ✨ Ask Sage
              </button>
            </div>
          </div>
        )}

        {/* MODAL FOOTER */}
        <div style={{
          padding: '16px 28px',
          background: isLight ? '#f8fafc' : 'rgba(10, 15, 30, 0.95)',
          borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              background: 'transparent',
              border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.2)',
              color: isLight ? '#0f172a' : '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              padding: '10px 24px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)'
            }}
          >
            <Save size={16} /> {loading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

const toolbarBtnStyle = (isLight) => ({
  padding: '6px 10px',
  borderRadius: '8px',
  background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
  border: 'none',
  color: isLight ? '#0f172a' : '#cbd5e1',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const aiActionBtnStyle = (isLight, isGradient = false) => ({
  padding: '6px 14px',
  borderRadius: '9999px',
  fontSize: '0.78rem',
  fontWeight: 800,
  background: isGradient
    ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.4), rgba(168, 85, 247, 0.4))'
    : (isLight ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.08)'),
  color: isLight ? '#0f172a' : '#ffffff',
  border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.18)',
  cursor: 'pointer'
});

export default NoteEditorModal;
