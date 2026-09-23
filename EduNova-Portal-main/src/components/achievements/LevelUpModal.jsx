import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { Sparkles, Award, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const LevelUpModal = () => {
  const { levelUpData, closeLevelUpModal } = useLearning();

  if (!levelUpData) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(3, 6, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(8, 12, 30, 0.95), rgba(14, 20, 43, 0.95))',
          border: '2px solid var(--accent-cyan)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '480px',
          width: '100%',
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(6, 182, 212, 0.4)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: 'var(--radius-full)', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid var(--accent-cyan)', color: '#38bdf8', fontWeight: 800, fontSize: '0.88rem', marginBottom: '18px' }}>
          <Sparkles size={16} /> LEVEL UP CELEBRATION!
        </div>

        <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Level {levelUpData.oldLevel} ➔ Level {levelUpData.newLevel}
        </h2>

        <p style={{ fontSize: '1.1rem', color: 'var(--accent-secondary)', fontWeight: 800, marginBottom: '24px' }}>
          New Rank Title: {levelUpData.rankTitle}
        </p>

        <div style={{ background: 'var(--glass-bg)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '28px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>PERK UNLOCKED</span>
          <strong style={{ fontSize: '1rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} /> {levelUpData.perk}
          </strong>
        </div>

        <Button size="lg" onClick={closeLevelUpModal} style={{ width: '100%' }}>
          Continue Learning <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};
