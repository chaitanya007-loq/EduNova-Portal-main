import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { Flame, Shield, Award } from 'lucide-react';
import { EduNovaHeroBanner } from '../common/EduNovaHeroBanner';

export const AchievementHero = () => {
  const { levelInfo, xp, streakDays, streakShields } = useLearning();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <EduNovaHeroBanner
        badge={`✦ LEVEL ${levelInfo.level} • ${levelInfo.rankTitle}`}
        title={`${xp.toLocaleString()} XP Earned 🏆`}
        subtitle={`${levelInfo.remainingXp.toLocaleString()} XP remaining to unlock Level ${levelInfo.level + 1}. Keep pushing your boundaries!`}
        stats={[
          { label: `Level ${levelInfo.level}`, subtext: `${xp} XP total`, icon: Award, color: '#f59e0b', progress: levelInfo.progressPercent },
          { label: `${streakDays} Days`, subtext: 'Daily Streak', icon: Flame, color: '#f97316' },
          { label: '3', subtext: 'Learning Goals', isPill: true }
        ]}
      />
    </div>
  );
};
