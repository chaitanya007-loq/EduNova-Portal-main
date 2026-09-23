import React from 'react';
import { Sparkles, Play, Calendar, HelpCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const NextBestSkillCard = ({ recommendationData, onAction }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!recommendationData || !recommendationData.skill) return null;

  const { skill, reason, estimatedHours } = recommendationData;

  return (
    <div
      style={{
        padding: '24px',
        borderRadius: '24px',
        background: isLight ? 'linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(224, 242, 254, 0.92))' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(6, 182, 212, 0.25))',
        border: '1.5px solid #6366f1',
        boxShadow: isLight ? '0 16px 40px rgba(99, 102, 241, 0.2)' : '0 12px 35px rgba(99, 102, 241, 0.25)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justify: 'space-between',
        gap: '16px'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ padding: '3px 10px', borderRadius: '12px', background: '#6366f1', color: '#fff', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase' }}>
            🎯 Your Next Best Skill
          </span>
          <span style={{ fontSize: '0.78rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800 }}>
            Est. Learning Time: {estimatedHours}
          </span>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
          {skill.name} ({skill.category})
        </h3>
        <p style={{ fontSize: '0.85rem', color: isLight ? '#334155' : '#e2e8f0', margin: '6px 0 0 0', maxWidth: '580px', fontWeight: isLight ? 600 : 400 }}>
          "{reason}"
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button
          onClick={() => onAction && onAction('start', skill)}
          className="se-btn se-btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.82rem' }}
        >
          <Play size={14} /> Start Skill
        </button>
        <button
          onClick={() => onAction && onAction('planner', skill)}
          className="se-btn se-btn-secondary"
          style={{ padding: '10px 14px', fontSize: '0.82rem' }}
        >
          <Calendar size={14} /> Add to Study Plan
        </button>
        <button
          onClick={() => onAction && onAction('sage', skill)}
          style={{ padding: '10px 14px', borderRadius: '12px', background: isLight ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.2)', border: '1px solid #c084fc', color: isLight ? '#7e22ce' : '#c084fc', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles size={14} /> Ask Sage Why
        </button>
      </div>
    </div>
  );
};
