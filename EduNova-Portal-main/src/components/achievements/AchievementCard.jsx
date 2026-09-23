import React from 'react';
import { Lock, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AchievementCard = ({ achievement = {}, onClick }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const getRarityStyle = (rarity) => {
    if (isLight) {
      switch (rarity) {
        case 'LEGENDARY':
          return {
            border: '1.5px solid rgba(245, 158, 11, 0.5)',
            background: 'linear-gradient(135deg, rgba(255, 251, 235, 0.95), rgba(254, 243, 199, 0.9))',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)',
            tagBg: 'rgba(245, 158, 11, 0.18)',
            tagColor: '#b45309'
          };
        case 'EPIC':
          return {
            border: '1.5px solid rgba(168, 85, 247, 0.5)',
            background: 'linear-gradient(135deg, rgba(250, 245, 255, 0.95), rgba(243, 232, 255, 0.9))',
            boxShadow: '0 8px 24px rgba(168, 85, 247, 0.15)',
            tagBg: 'rgba(168, 85, 247, 0.18)',
            tagColor: '#6b21a8'
          };
        case 'RARE':
          return {
            border: '1.5px solid rgba(59, 130, 246, 0.5)',
            background: 'linear-gradient(135deg, rgba(240, 246, 255, 0.95), rgba(219, 234, 254, 0.9))',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
            tagBg: 'rgba(59, 130, 246, 0.18)',
            tagColor: '#1d4ed8'
          };
        default: // COMMON
          return {
            border: '1.5px solid rgba(6, 182, 212, 0.4)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 246, 255, 0.9))',
            boxShadow: '0 8px 24px rgba(180, 200, 230, 0.25)',
            tagBg: 'rgba(6, 182, 212, 0.15)',
            tagColor: '#0284c7'
          };
      }
    }

    switch (rarity) {
      case 'LEGENDARY':
        return {
          border: '1px solid rgba(245, 158, 11, 0.6)',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(8, 12, 30, 0.8))',
          boxShadow: '0 0 25px rgba(245, 158, 11, 0.2)',
          tagBg: 'rgba(245, 158, 11, 0.2)',
          tagColor: '#fbbf24'
        };
      case 'EPIC':
        return {
          border: '1px solid rgba(168, 85, 247, 0.6)',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(8, 12, 30, 0.8))',
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.2)',
          tagBg: 'rgba(168, 85, 247, 0.2)',
          tagColor: '#c084fc'
        };
      case 'RARE':
        return {
          border: '1px solid rgba(59, 130, 246, 0.5)',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(8, 12, 30, 0.8))',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)',
          tagBg: 'rgba(59, 130, 246, 0.2)',
          tagColor: '#60a5fa'
        };
      default: // COMMON
        return {
          border: '1px solid rgba(6, 182, 212, 0.4)',
          background: 'var(--glass-bg)',
          boxShadow: 'var(--glass-shadow)',
          tagBg: 'rgba(6, 182, 212, 0.18)',
          tagColor: '#38bdf8'
        };
    }
  };

  const style = getRarityStyle(achievement.rarity);
  const progress = achievement.progress || 0;
  const target = achievement.target || 1;
  const percent = Math.min(100, Math.round((progress / target) * 100));

  return (
    <div
      onClick={() => onClick(achievement)}
      style={{
        background: style.background,
        border: style.border,
        boxShadow: style.boxShadow,
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, boxShadow 0.2s ease',
        position: 'relative',
        opacity: achievement.unlocked ? 1 : 0.88
      }}
    >
      <div>
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: style.tagBg,
              color: style.tagColor,
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}
          >
            {achievement.rarity}
          </span>

          <span style={{ fontSize: '0.75rem', color: isLight ? '#52668a' : 'var(--text-muted)', fontWeight: 600 }}>
            {achievement.category}
          </span>
        </div>

        {/* Icon & Title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
          <div
            style={{
              fontSize: '2rem',
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.05)',
              border: isLight ? '1px solid rgba(195, 215, 245, 0.8)' : '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {achievement.icon}
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : 'var(--text-primary)', margin: '0 0 4px' }}>
              {achievement.title}
            </h4>
            <p style={{ fontSize: '0.84rem', color: isLight ? '#475569' : 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              {achievement.description}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Progress & Status */}
      <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: isLight ? '1px solid rgba(195, 215, 245, 0.8)' : '1px solid var(--border-color)' }}>
        {achievement.unlocked ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> UNLOCKED
            </span>
            <span style={{ fontSize: '0.75rem', color: isLight ? '#52668a' : 'var(--text-muted)' }}>
              {achievement.unlockedDate || 'Recently'}
            </span>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: isLight ? '#52668a' : 'var(--text-muted)', marginBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Lock size={12} /> Locked ({progress} / {target})
              </span>
              <span style={{ color: style.tagColor, fontWeight: 800 }}>+{achievement.xpReward} XP</span>
            </div>

            <div style={{ height: '6px', borderRadius: 'var(--radius-full)', background: isLight ? 'rgba(215, 228, 245, 0.8)' : 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${percent}%`, background: style.tagColor, borderRadius: 'var(--radius-full)' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
