import React from 'react';
import { BookOpen, FileText, Brain, HelpCircle, Layers, Sparkles, Eye, Download } from 'lucide-react';
import { Button } from '../common/Button';

export const MaterialCard = ({ material, onView, onAskSage }) => {
  const getIcon = () => {
    switch (material.type) {
      case 'Notes': return <FileText size={18} color="#06b6d4" />;
      case 'Formula Sheets': return <BookOpen size={18} color="#6366f1" />;
      case 'Flashcards': return <Layers size={18} color="#a855f7" />;
      case 'MCQs': return <HelpCircle size={18} color="#f59e0b" />;
      default: return <FileText size={18} color="#38bdf8" />;
    }
  };

  return (
    <div style={{
      background: 'var(--glass-bg)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '12px',
      transition: 'all 0.2s ease',
      boxShadow: 'var(--glass-shadow)'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ padding: '6px', borderRadius: '8px', background: 'var(--bg-tertiary)' }}>
              {getIcon()}
            </span>
            <span className="cyber-badge-cyan" style={{ fontSize: '0.7rem' }}>
              {material.type}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{material.createdAt}</span>
        </div>

        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 6px', lineHeight: 1.35 }}>
          {material.title}
        </h4>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
          {material.description}
        </p>

        {material.tags && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
            {material.tags.map(t => (
              <span key={t} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '4px' }}>
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
        <Button size="sm" variant="outline" style={{ flex: 1, borderRadius: '8px', fontSize: '0.82rem' }} onClick={() => onView(material)}>
          <Eye size={14} /> Open Material
        </Button>
        <button
          onClick={() => onAskSage(material)}
          title="Ask Sage AI about this material"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 600,
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            color: 'var(--accent-cyan)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(6, 182, 212, 0.16)';
            e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(6, 182, 212, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Sparkles size={13} style={{ color: 'var(--accent-cyan)' }} /> Sage AI
        </button>
      </div>
    </div>
  );
};

export default MaterialCard;
