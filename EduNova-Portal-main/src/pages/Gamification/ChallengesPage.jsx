import React from 'react';
import { sampleDailyChallenges } from '../../data/challenges';
import { ChallengeCard } from '../../components/gamification/ChallengeCard';
import { Zap } from 'lucide-react';

export const ChallengesPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={28} color="#f59e0b" /> Daily & Weekly Challenges
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Complete daily quest tasks to earn bonus XP energy and boost your streak.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {sampleDailyChallenges.map((ch) => (
          <ChallengeCard key={ch.id} challenge={ch} />
        ))}
      </div>
    </div>
  );
};
