import React, { useState } from 'react';
import { X, BookOpen, Brain, Download, Share2, Sparkles, FileText, Check, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { FlashcardViewer } from './FlashcardViewer';
import { subjectService } from '../../services/subjectService';

export const MaterialViewer = ({ material, onClose, onAskSage }) => {
  const [savedToNotes, setSavedToNotes] = useState(false);

  if (!material) return null;

  const handleSaveToPersonalNotes = () => {
    subjectService.savePersonalNote({
      subjectId: material.subjectId || 'general',
      subjectName: material.subjectName || 'General',
      title: `Note: ${material.title}`,
      content: material.content || material.description || 'Saved study material reference.',
      category: material.type || 'Study Guide',
      color: '#06b6d4',
      tags: material.tags || ['SavedMaterial']
    });
    setSavedToNotes(true);
    setTimeout(() => setSavedToNotes(false), 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 20, 0.85)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '88vh',
        overflowY: 'auto',
        padding: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span className="cyber-badge-cyan" style={{ fontSize: '0.72rem', marginBottom: '6px', display: 'inline-block' }}>
              {material.type}
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {material.title}
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Uploaded by {material.uploadedBy || 'EduNova'} • {material.createdAt}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Render */}
        {material.type === 'Flashcards' && material.cards ? (
          <FlashcardViewer cards={material.cards} />
        ) : (
          <div style={{
            background: 'var(--glass-bg)',
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            fontSize: '0.92rem',
            color: 'var(--text-primary)',
            lineHeight: 1.65,
            whiteSpace: 'pre-line'
          }}>
            {material.content || material.description}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onAskSage(material)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: 'var(--accent-cyan)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(6, 182, 212, 0.16)';
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(6, 182, 212, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} /> Ask Sage AI
            </button>

            <button
              onClick={handleSaveToPersonalNotes}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: savedToNotes ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-tertiary)',
                border: savedToNotes ? '1px solid #10b981' : '1px solid var(--border-color)',
                color: savedToNotes ? '#34d399' : 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {savedToNotes ? <Check size={14} /> : <FileText size={14} />}
              {savedToNotes ? 'Saved to Notes!' : '+ Save to Personal Notes'}
            </button>
          </div>

          <Button variant="secondary" onClick={onClose} style={{ borderRadius: '8px', fontSize: '0.85rem' }}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaterialViewer;
