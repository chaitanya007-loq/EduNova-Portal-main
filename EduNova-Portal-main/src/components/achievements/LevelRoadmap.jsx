import React from 'react';
import { LEVEL_CONFIG } from '../../data/levels';
import { useLearning } from '../../context/LearningContext';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle2, Lock, Sparkles } from 'lucide-react';

export const LevelRoadmap = () => {
  const { level = 1 } = useLearning() || {};
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  return (
    <div
      style={{
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 246, 255, 0.88) 100%)'
          : 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius-xl)',
        border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid var(--border-color)',
        padding: '24px',
        boxShadow: isLight ? '0 12px 32px rgba(180, 200, 230, 0.3)' : 'var(--glass-shadow)'
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <span className="cyber-badge-cyan" style={{ fontSize: '0.78rem', marginBottom: '4px' }}>Level Progression Roadmap</span>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isLight ? '#0f172a' : 'var(--text-primary)', margin: '4px 0 0' }}>
          Rank & Level Unlocks Roadmap
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '12px' }}>
        {LEVEL_CONFIG.slice(0, 10).map((lvl) => {
          const isPassed = level > lvl.level;
          const isCurrent = level === lvl.level;
          const isLocked = level < lvl.level;

          return (
            <div
              key={lvl.level}
              style={{
                minWidth: '150px',
                background: isCurrent
                  ? (isLight ? 'rgba(6, 182, 212, 0.12)' : 'rgba(99, 102, 241, 0.2)')
                  : isPassed
                    ? (isLight ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)')
                    : (isLight ? 'rgba(255, 255, 255, 0.9)' : 'var(--bg-secondary)'),
                border: isCurrent
                  ? '2px solid #06b6d4'
                  : isPassed
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : (isLight ? '1px solid rgba(195, 215, 245, 0.85)' : '1px solid var(--border-color)'),
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: isLight ? '0 2px 10px rgba(180, 200, 230, 0.2)' : 'none'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isCurrent
                  ? 'linear-gradient(135deg, #06b6d4, #6366f1)'
                  : isPassed
                    ? '#10b981'
                    : (isLight ? 'rgba(203, 213, 225, 0.5)' : 'var(--bg-tertiary)'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                color: isPassed || isCurrent ? '#fff' : (isLight ? '#64748b' : '#cbd5e1'),
                fontWeight: 800,
                fontSize: '0.9rem'
              }}>
                {isPassed ? <CheckCircle2 size={18} /> : isLocked ? <Lock size={16} /> : lvl.level}
              </div>

              <strong style={{ display: 'block', fontSize: '0.95rem', color: isCurrent ? (isLight ? '#0284c7' : 'var(--accent-cyan)') : (isLight ? '#0f172a' : 'var(--text-primary)') }}>
                Level {lvl.level}
              </strong>
              <span style={{ fontSize: '0.75rem', color: isLight ? '#52668a' : 'var(--text-muted)', display: 'block', margin: '2px 0 8px', fontWeight: 600 }}>
                {lvl.xpRequired} XP
              </span>

              <p style={{ fontSize: '0.72rem', color: isLight ? '#475569' : 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
                {lvl.perk}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
