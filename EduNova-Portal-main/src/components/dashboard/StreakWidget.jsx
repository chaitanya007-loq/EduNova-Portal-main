import React from 'react';
import { Flame, Zap, Award } from 'lucide-react';
import { Card } from '../common/Card';
import { useLearning } from '../../context/LearningContext';

export const StreakWidget = () => {
  const { streakDays, xp, level } = useLearning();

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Daily Momentum</h3>
        <span className="cyber-badge-amber">
          <Flame size={14} color="#f59e0b" fill="#f59e0b" />
          {streakDays} Days Streak
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '10px 0' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(244, 63, 94, 0.2))',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Flame size={32} color="#f59e0b" />
        </div>

        <div>
          <span style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }} className="gradient-text">
            {streakDays}
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Consecutive Active Days</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.82rem'
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Level Badge</span>
          <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Lvl {level} Scholar</p>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Total Energy</span>
          <p style={{ fontWeight: 700, color: '#818cf8' }}>{xp} XP</p>
        </div>
      </div>
    </Card>
  );
};
