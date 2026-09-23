import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { Flame, Award, Zap } from 'lucide-react';

export const LevelHeader = () => {
  const { xp, level, streakDays } = useLearning();

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
      border: '1px solid var(--border-glow)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800,
          fontSize: '1.4rem',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
        }}>
          {level}
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Level {level} Scholar</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Next Rank: Level {level + 1} ({400 - (xp % 400)} XP remaining)
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>STREAK</span>
          <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={18} fill="#f59e0b" /> {streakDays} Days
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ENERGY</span>
          <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={18} fill="#818cf8" /> {xp} XP
          </p>
        </div>
      </div>
    </div>
  );
};
