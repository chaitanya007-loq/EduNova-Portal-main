import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Plus, Sparkles, Copy, Check, Star, Trash2, Volume2, 
  VolumeX, ArrowRight, BookOpen, Tag, Edit3 
} from 'lucide-react';
import { Button } from '../../common/Button';
import { subjectService } from '../../../services/subjectService';

export const DashboardNotesWidget = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Revision');
  const [color, setColor] = useState('#06b6d4');
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [aiSummaryNoteId, setAiSummaryNoteId] = useState(null);
  const [aiSummaryText, setAiSummaryText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [isExpandingForm, setIsExpandingForm] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const all = subjectService.getPersonalNotes();
    setNotes(all);
  };

  const handleSaveQuickNote = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    subjectService.savePersonalNote({
      subjectId: 'dashboard_general',
      subjectName: 'General Notes',
      title,
      content,
      category,
      color,
      isPinned: false
    });

    setTitle('');
    setContent('');
    setIsExpandingForm(false);
    loadNotes();
  };

  const handleTogglePin = (noteId) => {
    const currentNote = notes.find(n => n.id === noteId);
    if (!currentNote) return;
    subjectService.updatePersonalNote(noteId, { isPinned: !currentNote.isPinned });
    loadNotes();
  };

  const handleDeleteNote = (noteId) => {
    subjectService.deletePersonalNote(noteId);
    loadNotes();
  };

  const handleCopyNote = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakNote = (id, text) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_-]/g, ' '));
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGenerateAiSummary = (note) => {
    if (aiSummaryNoteId === note.id) {
      setAiSummaryNoteId(null);
      return;
    }
    setAiSummaryNoteId(note.id);
    setAiLoading(true);
    setAiSummaryText('');

    setTimeout(() => {
      setAiSummaryText(`📌 **Sage AI Key Takeaway for ${note.title}:**\n- Core concept breakdown & formula verification.\n- Essential exam revision checklist item.`);
      setAiLoading(false);
    }, 600);
  };

  // Sort pinned to top, then recent
  const sortedNotes = [...notes].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div style={{
      background: 'var(--glass-bg)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-color)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      boxShadow: 'var(--glass-shadow)',
      backdropFilter: 'blur(16px)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={18} color="var(--accent-cyan)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              My Quick Notes & Annotations
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {notes.length} saved notes • Synced across all subjects
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/my-subjects')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            color: 'var(--accent-cyan)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Open Notes Studio <ArrowRight size={13} />
        </button>
      </div>

      {/* Quick Add Note Form */}
      <form onSubmit={handleSaveQuickNote} style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="+ Quick note title (e.g., Ohm's Law Derivation)..."
            value={title}
            onFocus={() => setIsExpandingForm(true)}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '0.86rem'
            }}
            required
          />

          {!isExpandingForm && (
            <button
              type="button"
              onClick={() => setIsExpandingForm(true)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'var(--accent-cyan)',
                color: '#000',
                fontWeight: 700,
                fontSize: '0.82rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={14} /> Quick Note
            </button>
          )}
        </div>

        {isExpandingForm && (
          <>
            <textarea
              rows={3}
              placeholder="Type your notes observations, key formula, or exam tip here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '0.84rem',
                lineHeight: 1.45
              }}
              required
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tag:</span>
                {['Revision', 'Formula', 'ExamTip', 'Concept'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      background: category === c ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      color: category === c ? '#fff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    #{c}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsExpandingForm(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <Button type="submit" size="sm">
                  <Plus size={14} /> Save Note
                </Button>
              </div>
            </div>
          </>
        )}
      </form>

      {/* Recent Notes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
        {sortedNotes.length > 0 ? (
          sortedNotes.slice(0, 5).map(note => (
            <div
              key={note.id}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                padding: '12px 14px',
                border: `1px solid ${note.isPinned ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                borderLeft: `3px solid ${note.color || 'var(--accent-cyan)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    {note.category && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                        #{note.category}
                      </span>
                    )}
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      • {new Date(note.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)', display: 'block' }}>
                    {note.title}
                  </strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => handleTogglePin(note.id)}
                    style={{ background: 'none', border: 'none', color: note.isPinned ? '#f59e0b' : 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
                  >
                    <Star size={14} fill={note.isPinned ? '#f59e0b' : 'none'} />
                  </button>

                  <button
                    onClick={() => handleSpeakNote(note.id, note.content)}
                    style={{ background: 'none', border: 'none', color: speakingId === note.id ? '#38bdf8' : 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title="Listen Aloud"
                  >
                    {speakingId === note.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>

                  <button
                    onClick={() => handleCopyNote(note.id, note.content)}
                    style={{ background: 'none', border: 'none', color: copiedId === note.id ? '#34d399' : 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title="Copy Note"
                  >
                    {copiedId === note.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>

                  <button
                    onClick={() => handleGenerateAiSummary(note)}
                    style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer', padding: '2px' }}
                    title="AI Summarize"
                  >
                    <Sparkles size={14} />
                  </button>

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: '2px' }}
                    title="Delete Note"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
                {note.content}
              </p>

              {/* Inline AI Summary Drawer */}
              {aiSummaryNoteId === note.id && (
                <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.25)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                  {aiLoading ? (
                    <div style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles className="animate-spin" size={13} /> Sage AI is summarizing note...
                    </div>
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>{aiSummaryText}</div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
            No quick notes added yet. Use the input above to save your first study note!
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardNotesWidget;
