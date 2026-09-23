import React from 'react';
import { Award, Play, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const DailySkillChallenge = ({ onStartChallenge }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '24px',
        background: isLight ? 'linear-gradient(135deg, rgba(243, 232, 255, 0.95), rgba(238, 242, 255, 0.92))' : 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(99, 102, 241, 0.2))',
        border: '1.5px solid #a855f7',
        boxShadow: isLight ? '0 16px 40px rgba(168, 85, 247, 0.2)' : '0 10px 30px rgba(168, 85, 247, 0.2)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justify: 'space-between',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ padding: '12px', borderRadius: '16px', background: '#a855f7', color: '#fff' }}>
          <Award size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: isLight ? '#7e22ce' : '#c084fc', textTransform: 'uppercase' }}>Daily Skill Challenge</span>
            <span style={{ padding: '2px 8px', borderRadius: '6px', background: '#fbbf24', color: '#050814', fontSize: '0.7rem', fontWeight: 900 }}>+50 XP</span>
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff', margin: '2px 0 0 0' }}>
            React Hooks & Custom State Architecture
          </h4>
          <span style={{ fontSize: '0.75rem', color: isLight ? '#475569' : '#cbd5e1', fontWeight: isLight ? 600 : 400 }}>5 Diagnostic Questions • ~7 mins</span>
        </div>
      </div>

      <button onClick={onStartChallenge} className="se-btn se-btn-purple" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>
        <Play size={14} /> Start Challenge
      </button>
    </div>
  );
};
