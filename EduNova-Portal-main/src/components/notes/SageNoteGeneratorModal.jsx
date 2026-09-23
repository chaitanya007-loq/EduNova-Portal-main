import React, { useState } from 'react';
import { Sparkles, X, Save, RefreshCw, CheckCircle, BookOpen } from 'lucide-react';
import { notesService } from '../../services/notesService';
import { useTheme } from '../../context/ThemeContext';

export const SageNoteGeneratorModal = ({
  isOpen = false,
  onClose,
  onSaveGeneratedNote,
  subjects = []
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [prompt, setPrompt] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a topic or instruction for Sage AI.');
      return;
    }

    try {
      setLoading(true);
      setDraft(null);
      const res = await notesService.generateSageNote({
        prompt: prompt.trim(),
        subjectId: subjectId || null
      });
      setDraft(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!draft) return;
    try {
      setLoading(true);
      const saved = await notesService.createNote({
        title: draft.title,
        content: draft.content,
        type: draft.type || 'REVISION',
        source: 'SAGE_AI',
        subjectId: draft.subjectId || subjectId || null,
        tags: draft.tags || ['#sage-ai']
      });
      if (onSaveGeneratedNote) onSaveGeneratedNote(saved);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        maxWidth: '780px',
        maxHeight: '90vh',
        background: isLight ? '#ffffff' : 'linear-gradient(135deg, rgba(18, 26, 56, 0.98) 0%, rgba(10, 15, 38, 0.98) 100%)',
        border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1.5px solid rgba(168, 85, 247, 0.4)',
        borderRadius: '28px',
        boxShadow: '0 30px 80px rgba(168, 85, 247, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* HEADER */}
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
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
            }}>
              <Sparkles size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                ✨ Create Notes with Sage AI
              </h2>
              <span style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : '#cbd5e1' }}>
                Sage generates structured revision notes tailored to your curriculum.
              </span>
            </div>
          </div>

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

        {/* BODY */}
        <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Subject (Optional)
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '14px',
                background: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.8)',
                border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.15)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="">Auto-detect from prompt...</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              What topic should Sage generate notes for?
            </label>
            <textarea
              placeholder='e.g., "Create revision notes for Quadratic Equations including formulas and common exam mistakes"'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{
                width: '100%',
                height: '90px',
                padding: '12px 16px',
                borderRadius: '16px',
                background: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.8)',
                border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.15)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
                resize: 'none',
                lineHeight: 1.5
              }}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              padding: '12px 24px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.94rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)'
            }}
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? 'Sage AI is writing your note...' : 'Generate Note Draft'}
          </button>

          {/* DRAFT PREVIEW CARD */}
          {draft && (
            <div style={{
              background: isLight ? 'rgba(240, 246, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '20px',
              padding: '20px',
              marginTop: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                  ✦ Generated Draft Preview
                </span>
                <span style={{ fontSize: '0.74rem', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '4px 10px', borderRadius: '999px', fontWeight: 700 }}>
                  {draft.type}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 10px 0' }}>
                {draft.title}
              </h3>

              <div style={{
                maxHeight: '220px',
                overflowY: 'auto',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: isLight ? '#334155' : '#cbd5e1',
                background: isLight ? '#ffffff' : 'rgba(0,0,0,0.2)',
                padding: '14px',
                borderRadius: '12px',
                whiteSpace: 'pre-wrap'
              }}>
                {draft.content}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  onClick={handleSaveDraft}
                  disabled={loading}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Save size={16} /> Save Note to My Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SageNoteGeneratorModal;
