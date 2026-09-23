import React from 'react';
import { Sparkles, Play, RotateCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const NextBestActionCard = ({ actionData, onAction }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!actionData) return null;

  return (
    <div
      style={{
        padding: '24px',
        borderRadius: '24px',
        background: isLight 
          ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(99, 102, 241, 0.12))'
          : 'linear-gradient(135deg, rgba(6, 182, 212, 0.22), rgba(99, 102, 241, 0.22))',
        border: isLight ? '1.5px solid rgba(6, 182, 212, 0.5)' : '1.5px solid #06b6d4',
        boxShadow: isLight ? '0 12px 35px rgba(6, 182, 212, 0.12)' : '0 12px 35px rgba(6, 182, 212, 0.25)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ padding: '3px 10px', borderRadius: '12px', background: '#06b6d4', color: '#fff', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase' }}>
            🎯 Next Best Learning Action
          </span>
          <span style={{ fontSize: '0.78rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 700 }}>
            Accuracy: {actionData.accuracy}%
          </span>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: isLight ? '#18345F' : '#fff', margin: 0 }}>
          {actionData.topic} ({actionData.subject})
        </h3>
        <p style={{ fontSize: '0.85rem', color: isLight ? '#334155' : '#e2e8f0', margin: '6px 0 0 0', maxWidth: '560px' }}>
          "{actionData.reason}"
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button
          onClick={() => onAction && onAction('practice', actionData)}
          className="se-btn se-btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.82rem' }}
        >
          <Play size={14} /> Start Practice
        </button>
        <button
          onClick={() => onAction && onAction('revise', actionData)}
          className="se-btn se-btn-secondary"
          style={{ padding: '10px 14px', fontSize: '0.82rem' }}
        >
          <RotateCcw size={14} /> Revise
        </button>
        <button
          onClick={() => onAction && onAction('sage', actionData)}
          style={{ padding: '10px 14px', borderRadius: '12px', background: isLight ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.2)', border: '1px solid #c084fc', color: isLight ? '#7e22ce' : '#c084fc', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles size={14} /> Ask Sage
        </button>
      </div>
    </div>
  );
};

export const SageInsightsSection = ({ insights, onAction }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!insights || insights.length === 0) return null;

  return (
    <div style={{
      padding: '20px',
      borderRadius: '24px',
      background: isLight 
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' 
        : 'rgba(12, 16, 36, 0.85)',
      border: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.05)' : '0 10px 30px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(16px)'
    }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={18} color="#a855f7" /> Sage AI — Your Learning Intelligence
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {insights.map(ins => (
          <div
            key={ins.id}
            style={{
              padding: '16px',
              borderRadius: '18px',
              background: isLight ? 'rgba(255, 255, 255, 0.75)' : '#050814',
              border: ins.type === 'positive' 
                ? (isLight ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(34, 197, 94, 0.3)')
                : (ins.type === 'warning' 
                  ? (isLight ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(251, 191, 36, 0.3)')
                  : (isLight ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid rgba(6, 182, 212, 0.3)')),
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: '0 0 4px 0' }}>
                {ins.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: isLight ? '#334155' : '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
                "{ins.text}"
              </p>
              <span style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#64748b', display: 'block', marginTop: '6px' }}>
                Source: {ins.source}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <button
                onClick={() => onAction && onAction('explain', ins)}
                className="se-btn se-btn-secondary"
                style={{ padding: '5px 10px', fontSize: '0.72rem' }}
              >
                Explain
              </button>
              <button
                onClick={() => onAction && onAction('practice', ins)}
                className="se-btn se-btn-primary"
                style={{ padding: '5px 10px', fontSize: '0.72rem' }}
              >
                Practice
              </button>
              <button
                onClick={() => onAction && onAction('sage', ins)}
                style={{ padding: '5px 10px', borderRadius: '8px', background: isLight ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.2)', border: '1px solid #c084fc', color: isLight ? '#7e22ce' : '#c084fc', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Sparkles size={12} /> Ask Sage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
