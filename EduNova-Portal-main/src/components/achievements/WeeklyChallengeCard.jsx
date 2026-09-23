import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { useTheme } from '../../context/ThemeContext';
import { Trophy, Award, Zap, Clock } from 'lucide-react';

export const WeeklyChallengeCard = () => {
  const { weeklyChallenge = {} } = useLearning() || {};
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const progress = typeof weeklyChallenge?.progress === 'number' ? weeklyChallenge.progress : 0;
  const target = typeof weeklyChallenge?.target === 'number' && weeklyChallenge.target > 0 ? weeklyChallenge.target : 3;
  const daysRemaining = typeof weeklyChallenge?.daysRemaining === 'number' ? weeklyChallenge.daysRemaining : 5;
  const progressPercent = Math.min(100, Math.round((progress / target) * 100));

  const title = weeklyChallenge?.title || 'Complete a Full Chapter';
  const description = weeklyChallenge?.description || 'Finish all topics in a chapter to earn bonus XP and unlock rewards.';
  const rewardXp = weeklyChallenge?.rewardXp || 200;
  const badgeReward = weeklyChallenge?.badgeReward || 'Chapter Mastery Badge';

  return (
    <div
      style={{
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 246, 255, 0.88) 100%)'
          : 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(99, 102, 241, 0.15))',
        border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(168, 85, 247, 0.4)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: isLight ? '0 12px 32px rgba(180, 200, 230, 0.3)' : 'var(--glass-shadow)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span className="cyber-badge-purple" style={{ fontSize: '0.78rem' }}>
          <Trophy size={14} /> WEEKLY CHALLENGE
        </span>
        <span style={{ fontSize: '0.78rem', color: isLight ? '#52668a' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
          <Clock size={14} /> {daysRemaining} days remaining
        </span>
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isLight ? '#0f172a' : 'var(--text-primary)', marginBottom: '6px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.88rem', color: isLight ? '#475569' : 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
        {description}
      </p>

      {/* Reward Badges */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <span className="cyber-badge-cyan" style={{ fontSize: '0.8rem' }}>
          <Zap size={14} /> +{rewardXp} XP Reward
        </span>
        <span className="cyber-badge-amber" style={{ fontSize: '0.8rem' }}>
          <Award size={14} /> {badgeReward}
        </span>
      </div>

      {/* Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: isLight ? '#52668a' : 'var(--text-muted)', marginBottom: '6px' }}>
          <span>Milestones Completed</span>
          <span style={{ color: isLight ? '#7e22ce' : '#a855f7', fontWeight: 800 }}>{progress} / {target} ({progressPercent}%)</span>
        </div>
        <div style={{ height: '8px', borderRadius: 'var(--radius-full)', background: isLight ? 'rgba(215, 228, 245, 0.8)' : 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #a855f7, #6366f1)', borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease' }} />
        </div>
      </div>
    </div>
  );
};
