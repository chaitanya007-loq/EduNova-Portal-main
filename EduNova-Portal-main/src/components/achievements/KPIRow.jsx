import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { useTheme } from '../../context/ThemeContext';
import { Zap, Flame, Trophy, Award, CheckCircle2 } from 'lucide-react';

export const KPIRow = () => {
  const { xp = 0, streakDays = 0, bestStreak = 0, achievements = [], milestones = [] } = useLearning() || {};
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const kpis = [
    { label: 'Total XP', value: xp.toLocaleString(), icon: Zap, color: isLight ? '#0284c7' : '#38bdf8' },
    { label: 'Current Streak', value: `${streakDays} Days`, icon: Flame, color: '#f59e0b' },
    { label: 'Best Streak', value: `${bestStreak} Days`, icon: Trophy, color: isLight ? '#7e22ce' : '#a855f7' },
    { label: 'Badges Unlocked', value: `${unlockedCount} / ${achievements.length}`, icon: Award, color: isLight ? '#059669' : '#10b981' },
    { label: 'Milestones', value: milestones.length, icon: CheckCircle2, color: isLight ? '#4f46e5' : '#6366f1' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' }}>
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            style={{
              background: isLight
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 246, 255, 0.88) 100%)'
                : 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-xl)',
              border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid var(--border-color)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: isLight ? '0 10px 25px rgba(180, 200, 230, 0.3)' : 'var(--glass-shadow)'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: `${kpi.color}18`,
                border: `1px solid ${kpi.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon size={22} color={kpi.color} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: isLight ? '#52668a' : 'var(--text-muted)', display: 'block', fontWeight: 600 }}>{kpi.label}</span>
              <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: isLight ? '#0f172a' : 'var(--text-primary)' }}>{kpi.value}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
};
