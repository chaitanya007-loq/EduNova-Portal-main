import React, { useEffect } from 'react';
import { X, BookOpen, FileText, Brain, Video, Target, FlaskConical, Bot, Sparkles, PlayCircle, Star, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAI } from '../../context/AIContext';

export const SubjectContentPreviewModal = ({ subject, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { openAIChat, sendMessage } = useAI();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !subject) return null;

  const handleAskSagePrompt = (promptText) => {
    onClose();
    openAIChat();
    sendMessage(`For subject "${subject.name}" (${subject.category}): ${promptText}`);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '24px 16px',
        overflowY: 'auto'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(12, 16, 36, 0.96)',
          border: '1px solid rgba(6, 182, 212, 0.5)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto'
        }}
      >
        {/* Modal Banner Hero */}
        <div style={{ position: 'relative', height: '170px', width: '100%', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={subject.image}
            alt={subject.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(12, 16, 36, 1) 0%, rgba(12, 16, 36, 0.4) 60%, transparent 100%)'
          }} />

          {/* Top Back Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          {/* Top Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            title="Close (Esc)"
          >
            <X size={18} />
          </button>

          {/* Badges Overlay */}
          <div style={{ position: 'absolute', bottom: '16px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '999px',
                background: 'rgba(6, 182, 212, 0.25)',
                color: '#38bdf8',
                border: '1px solid rgba(6, 182, 212, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'inline-block',
                marginBottom: '6px'
              }}>
                {subject.category} • {subject.difficulty || 'Curriculum Subject'}
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                {subject.icon} {subject.name}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {subject.hasInteractiveLab && (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.5)', padding: '4px 10px', borderRadius: '999px' }}>
                  🥽 IMMERSIVE READY
                </span>
              )}
              {subject.aiEnabled && (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.5)', padding: '4px 10px', borderRadius: '999px' }}>
                  ✨ SAGE READY
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            {subject.description || subject.shortDescription}
          </p>

          {/* Syllabus Coverage Bar */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', letterSpacing: '0.5px' }}>
                Academic Telemetry
              </span>
              <strong style={{ fontSize: '1.05rem', color: '#34d399', fontWeight: 800 }}>
                {subject.syllabusCoverage || 78}% Syllabus Covered
              </strong>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span>Target: <strong style={{ color: '#38bdf8' }}>{subject.targetScore || 90}%</strong></span>
              <span>Progress: <strong style={{ color: '#ffffff' }}>{subject.progress || 70}%</strong></span>
            </div>
          </div>

          {/* WHAT'S INSIDE GRID */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="#06b6d4" /> WHAT'S INSIDE THIS SUBJECT
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px 12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', display: 'block' }}>📚</span>
                <strong style={{ fontSize: '0.95rem', color: '#ffffff', display: 'block' }}>{subject.chaptersCount || 14}</strong>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Chapters</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px 12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', display: 'block' }}>📝</span>
                <strong style={{ fontSize: '0.95rem', color: '#ffffff', display: 'block' }}>{subject.questionsCount || 320}</strong>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Questions</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px 12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', display: 'block' }}>🧠</span>
                <strong style={{ fontSize: '0.95rem', color: '#ffffff', display: 'block' }}>{subject.flashcardsCount || 85}</strong>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Flashcards</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px 12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', display: 'block' }}>📄</span>
                <strong style={{ fontSize: '0.95rem', color: '#ffffff', display: 'block' }}>{subject.notesCount || 18}</strong>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Notes</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px 12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', display: 'block' }}>🎥</span>
                <strong style={{ fontSize: '0.95rem', color: '#ffffff', display: 'block' }}>{subject.videosCount || 24}</strong>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Videos</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px 12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', display: 'block' }}>🎯</span>
                <strong style={{ fontSize: '0.95rem', color: '#ffffff', display: 'block' }}>{subject.quizzesCount || 12}</strong>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Quizzes</span>
              </div>
            </div>
          </div>

          {/* SAGE AI TUTOR INTEGRATION BOX */}
          <div style={{
            background: 'radial-gradient(ellipse at top left, rgba(168, 85, 247, 0.18), rgba(15, 23, 42, 0.9))',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Bot size={18} color="#c084fc" />
              <strong style={{ fontSize: '0.92rem', color: '#ffffff' }}>Sage AI Tutor Context</strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 12px' }}>
              Ask Sage to explain topics, build flashcards, or test your mastery in {subject.name}.
            </p>

            {/* Quick AI Prompts */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                'Explain a topic',
                'Generate notes',
                'Create MCQs',
                'Create flashcards',
                'Find weak areas'
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleAskSagePrompt(prompt)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#c084fc',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>

            {subject.hasInteractiveLab && (
              <button
                onClick={() => { onClose(); navigate('/immersive-lab'); }}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <FlaskConical size={16} /> Enter Lab
              </button>
            )}

            <button
              onClick={() => { onClose(); navigate(`/subjects/${subject.id}`); }}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)'
              }}
            >
              <PlayCircle size={16} /> Open Subject Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectContentPreviewModal;
