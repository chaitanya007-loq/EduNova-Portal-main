import React, { useState } from 'react';
import { BookOpen, Target, Repeat, CheckCircle2, Clock, Star, Flame, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SkillStatisticsBar = ({ stats }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!stats) return null;

  const statItems = [
    { label: 'Skills I Teach', value: stats.skillsTeachCount ?? 0, icon: BookOpen, color: isLight ? '#0284c7' : '#38bdf8', glow: 'rgba(56, 189, 248, 0.2)' },
    { label: 'Skills I Want', value: stats.skillsWantCount ?? 0, icon: Target, color: isLight ? '#7e22ce' : '#c084fc', glow: 'rgba(192, 132, 252, 0.2)' },
    { label: 'Active Exchanges', value: stats.activeCount ?? 0, icon: Repeat, color: isLight ? '#047857' : '#34d399', glow: 'rgba(52, 211, 153, 0.2)' },
    { label: 'Completed Exchanges', value: stats.completedCount ?? 0, icon: CheckCircle2, color: isLight ? '#2563eb' : '#60a5fa', glow: 'rgba(96, 165, 250, 0.2)' },
    { label: 'Teaching Hours', value: `${stats.totalTeachingHours ?? 0} hrs`, icon: Clock, color: isLight ? '#d97706' : '#fbbf24', glow: 'rgba(251, 191, 36, 0.2)' },
    { label: 'Learning Hours', value: `${stats.totalLearningHours ?? 0} hrs`, icon: Zap, color: isLight ? '#db2777' : '#f472b6', glow: 'rgba(244, 114, 182, 0.2)' },
    { label: 'Peer Rating', value: stats.averagePeerRating ? `${stats.averagePeerRating} ★` : '0 ★', icon: Star, color: isLight ? '#d97706' : '#f59e0b', glow: 'rgba(245, 158, 11, 0.2)' },
    { label: 'Learning Streak', value: `${stats.currentStreakDays ?? 0} days`, icon: Flame, color: isLight ? '#ea580c' : '#f97316', glow: 'rgba(249, 115, 22, 0.2)' },
  ];

  return (
    <div className="se-stats-grid">
      {statItems.map((item, idx) => (
        <StatCard key={idx} item={item} isLight={isLight} />
      ))}
    </div>
  );
};

const StatCard = ({ item, isLight }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '14px 12px',
        borderRadius: '16px',
        background: isLight
          ? (hovered
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(230, 242, 255, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(245, 249, 255, 0.88) 100%)')
          : (hovered
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.015) 100%)'),
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: hovered
          ? `1px solid ${item.color}66`
          : (isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.09)'),
        boxShadow: hovered
          ? (isLight ? `0 12px 30px rgba(180, 200, 230, 0.45), 0 0 20px ${item.glow}` : `0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px ${item.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`)
          : (isLight ? '0 8px 24px rgba(180, 200, 230, 0.3)' : '0 8px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08)'),
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '94px'
      }}
    >
      {/* Subtle Top Accent Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: item.color,
          opacity: hovered ? (isLight ? 0.25 : 0.25) : (isLight ? 0.12 : 0.08),
          filter: 'blur(20px)',
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: isLight ? '#52668a' : 'rgba(226, 232, 240, 0.7)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            lineHeight: 1.2
          }}
        >
          {item.label}
        </span>
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '9px',
            background: isLight ? `${item.color}18` : `${item.color}15`,
            border: `1px solid ${item.color}35`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Icon size={14} color={item.color} />
        </div>
      </div>

      <div
        style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          color: item.color,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          textShadow: isLight ? 'none' : `0 0 12px ${item.glow}`
        }}
      >
        {item.value}
      </div>
    </div>
  );
};

