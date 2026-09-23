import React from 'react';
import { Card } from '../common/Card';
import { Lock, CheckCircle } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const AchievementBadge = ({ achievement }) => {
  return (
    <Card hoverEffect style={{ opacity: achievement.unlocked ? 1 : 0.75 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{
          fontSize: '2.2rem',
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: achievement.unlocked ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-tertiary)',
          border: achievement.unlocked ? '1px solid var(--border-glow)' : '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {achievement.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700 }}>{achievement.title}</h4>
            {achievement.unlocked ? (
              <span className="cyber-badge-emerald" style={{ fontSize: '0.72rem' }}>
                <CheckCircle size={12} /> Unlocked
              </span>
            ) : (
              <span className="cyber-badge" style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                <Lock size={12} /> Locked
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>
            {achievement.description}
          </p>

          {!achievement.unlocked && achievement.total && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <span>Progress</span>
                <span>{achievement.progress} / {achievement.total}</span>
              </div>
              <ProgressBar progress={(achievement.progress / achievement.total) * 100} height={5} />
            </div>
          )}

          <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#818cf8', fontWeight: 600 }}>
            Reward: +{achievement.xpReward} XP
          </div>
        </div>
      </div>
    </Card>
  );
};
