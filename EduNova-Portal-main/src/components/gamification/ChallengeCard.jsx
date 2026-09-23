import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { Zap, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { useLearning } from '../../context/LearningContext';

export const ChallengeCard = ({ challenge }) => {
  const { earnXp } = useLearning();

  const handleClaim = () => {
    earnXp(challenge.xpReward);
  };

  return (
    <Card hoverEffect style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="cyber-badge-amber">
            <Zap size={12} /> Daily Quest
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> Reset in {challenge.expiresIn}
          </span>
        </div>

        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>{challenge.title}</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          {challenge.task}
        </p>
      </div>

      <div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Completion</span>
            <span style={{ fontWeight: 700, color: '#38bdf8' }}>{challenge.progress} / {challenge.target}</span>
          </div>
          <ProgressBar progress={(challenge.progress / challenge.target) * 100} height={6} />
        </div>

        <Button
          style={{ width: '100%' }}
          disabled={challenge.completed || challenge.progress < challenge.target}
          onClick={handleClaim}
        >
          {challenge.completed ? <CheckCircle size={16} /> : <Zap size={16} />}
          {challenge.completed ? 'Claimed (+100 XP)' : `Claim +${challenge.xpReward} XP Reward`}
        </Button>
      </div>
    </Card>
  );
};
