import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Award, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const ClosestAchievementCard = () => {
  const { achievements = [] } = useLearning() || {};
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';
  const navigate = useNavigate();

  // Find the locked achievement closest to completion
  const lockedAchievements = achievements.filter((a) => !a.unlocked);
  const closest = lockedAchievements.sort((a, b) => {
    const pA = (a.progress || 0) / (a.target || 1);
    const pB = (b.progress || 0) / (b.target || 1);
    return pB - pA;
  })[0];

  if (!closest) return null;

  const percent = Math.min(100, Math.round(((closest.progress || 0) / (closest.target || 1)) * 100));

  return (
    <div
      style={{
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 246, 255, 0.88) 100%)'
          : 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius-xl)',
        border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(6, 182, 212, 0.4)',
        padding: '24px',
        boxShadow: isLight ? '0 12px 32px rgba(180, 200, 230, 0.3)' : 'var(--glass-shadow)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span className="cyber-badge-cyan" style={{ fontSize: '0.78rem' }}>
          🏆 ALMOST THERE!
        </span>
        <span className="cyber-badge" style={{ fontSize: '0.75rem' }}>{closest.rarity}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
        <div style={{ fontSize: '2.2rem', width: '54px', height: '54px', borderRadius: '16px', background: isLight ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.15)', border: isLight ? '1px solid rgba(6, 182, 212, 0.25)' : '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {closest.icon}
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isLight ? '#0f172a' : 'var(--text-primary)', margin: 0 }}>
            {closest.title}
          </h3>
          <p style={{ fontSize: '0.85rem', color: isLight ? '#475569' : 'var(--text-secondary)', margin: '2px 0 0' }}>
            {closest.description}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: isLight ? '#52668a' : 'var(--text-muted)', marginBottom: '6px' }}>
          <span>Progress: {closest.progress} / {closest.target}</span>
          <span style={{ color: isLight ? '#0284c7' : '#06b6d4', fontWeight: 800 }}>{percent}%</span>
        </div>
        <div style={{ height: '8px', borderRadius: 'var(--radius-full)', background: isLight ? 'rgba(215, 228, 245, 0.8)' : 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${percent}%`, background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', borderRadius: 'var(--radius-full)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="cyber-badge-cyan" style={{ fontSize: '0.78rem' }}>
          <Zap size={14} /> Reward: +{closest.xpReward} XP
        </span>
        <Button size="sm" onClick={() => navigate('/my-subjects')}>
          Continue Learning <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
};
