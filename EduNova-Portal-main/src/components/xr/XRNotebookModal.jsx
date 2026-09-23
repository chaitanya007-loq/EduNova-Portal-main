import React, { useState } from 'react';
import { BookOpen, Save, Trash2, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const XRNotebookModal = ({ isOpen, onClose, experience }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Human Heart Observation',
      text: 'Left ventricle myocardium is significantly thicker due to systemic pumping pressure requirement (~120 mmHg).',
      date: '2026-09-18 22:45'
    }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');

  if (!isOpen) return null;

  const handleSaveNote = e => {
    e.preventDefault();
    if (!newText.trim()) return;
    const note = {
      id: Date.now(),
      title: newTitle.trim() || experience?.name || 'XR Spatial Note',
      text: newText.trim(),
      date: new Date().toLocaleString()
    };
    setNotes([note, ...notes]);
    setNewTitle('');
    setNewText('');
  };

  const handleDelete = id => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(5, 8, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 246, 255, 0.94) 100%)'
            : 'radial-gradient(circle at top left, #0f172a 0%, #050814 100%)',
          border: isLight ? '1.5px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          padding: '28px',
          color: isLight ? '#0f172a' : '#ffffff',
          boxShadow: isLight ? '0 25px 60px rgba(100, 130, 200, 0.25)' : '0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: isLight ? '#64748b' : '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '14px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
            <BookOpen size={24} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
              My Digital XR Notebook
            </h3>
            <p style={{ margin: 0, color: isLight ? '#52668a' : '#94a3b8', fontSize: '0.84rem' }}>
              Saved observations, experiment notes & AI explanations
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Note Title / Topic..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            style={{
              width: '100%',
              background: isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.6)',
              border: isLight ? '1px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: isLight ? '#0f172a' : '#fff',
              fontSize: '0.86rem',
              outline: 'none',
              fontWeight: 600
            }}
          />
          <textarea
            placeholder="Write observations, equations, or takeaways..."
            value={newText}
            onChange={e => setNewText(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              background: isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.6)',
              border: isLight ? '1px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: isLight ? '#0f172a' : '#fff',
              fontSize: '0.86rem',
              outline: 'none',
              resize: 'none',
              fontWeight: 600
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '6px',
              alignSelf: 'flex-end',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
            }}
          >
            <Save size={16} /> Save Note
          </button>
        </form>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notes.map(note => (
            <div
              key={note.id}
              style={{
                background: isLight ? 'rgba(240, 246, 255, 0.9)' : 'rgba(15, 23, 42, 0.7)',
                border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h4 style={{ margin: 0, color: isLight ? '#0284c7' : '#38bdf8', fontSize: '0.92rem', fontWeight: 800 }}>{note.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.74rem', color: isLight ? '#52668a' : '#94a3b8' }}>{note.date}</span>
                  <button onClick={() => handleDelete(note.id)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: isLight ? '#334155' : '#cbd5e1', lineHeight: 1.4 }}>{note.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default XRNotebookModal;
