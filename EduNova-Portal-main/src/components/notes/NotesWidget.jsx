import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Pin, ArrowRight, Sparkles } from 'lucide-react';
import { notesService } from '../../services/notesService';
import { useTheme } from '../../context/ThemeContext';

export const NotesWidget = ({ onOpenCreateModal }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [summary, setSummary] = useState({
    totalNotes: 0,
    pinnedCount: 0,
    favoriteCount: 0,
    aiNotesCount: 0,
    recentNotes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await notesService.getSummary();
      if (res) setSummary(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: isLight
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 246, 255, 0.9) 100%)'
        : 'linear-gradient(135deg, rgba(20, 28, 58, 0.75) 0%, rgba(12, 17, 42, 0.88) 100%)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
      borderRadius: '28px',
      padding: '24px',
      boxShadow: isLight
        ? '0 15px 40px rgba(64, 100, 160, 0.12)'
        : '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '18px'
    }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
              My Smart Notes
            </h3>
            <span style={{ fontSize: '0.74rem', color: isLight ? '#0284c7' : '#94a3b8', fontWeight: 700 }}>
              {summary.totalNotes} Saved • {summary.pinnedCount} Pinned • {summary.favoriteCount} Favorites
            </span>
          </div>
        </div>

        <button
          onClick={() => onOpenCreateModal && onOpenCreateModal()}
          style={{
            padding: '8px 14px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.8rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)'
          }}
        >
          <Plus size={14} /> New Note
        </button>
      </div>

      {/* RECENT NOTES LIST */}
      {summary.recentNotes && summary.recentNotes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {summary.recentNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => navigate('/notes')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '16px',
                background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                border: isLight ? '1px solid rgba(200, 220, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {note.isPinned && <Pin size={13} color="#fbbf24" fill="#fbbf24" />}
                <div>
                  <strong style={{ fontSize: '0.88rem', color: isLight ? '#0f172a' : '#ffffff', display: 'block' }}>
                    {note.title}
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                    {note.subject?.name || 'General Note'} • {note.readTimeMin || 1} min read
                  </span>
                </div>
              </div>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.15)',
                padding: '4px 10px',
                borderRadius: '999px'
              }}>
                {note.type}
              </span>
            </div>
          ))}
        </div>
      ) : (
        /* ZERO STATE */
        <div style={{
          textAlign: 'center',
          padding: '24px 16px',
          background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)',
          borderRadius: '18px',
          border: isLight ? '1px dashed rgba(200,220,240,0.9)' : '1px dashed rgba(255,255,255,0.14)'
        }}>
          <Sparkles size={24} color="#38bdf8" style={{ marginBottom: '8px' }} />
          <strong style={{ display: 'block', fontSize: '0.94rem', color: isLight ? '#0f172a' : '#ffffff', marginBottom: '4px' }}>
            Your knowledge workspace is empty.
          </strong>
          <span style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#cbd5e1' }}>
            Create your first note or ask Sage to build one for you.
          </span>
        </div>
      )}

      {/* FOOTER ACTION */}
      <button
        onClick={() => navigate('/notes')}
        style={{
          background: 'none',
          border: 'none',
          color: isLight ? '#0284c7' : '#38bdf8',
          fontSize: '0.86rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: 0,
          alignSelf: 'flex-start'
        }}
      >
        View All Notes <ArrowRight size={15} />
      </button>
    </div>
  );
};

export default NotesWidget;
