import React, { useState } from 'react';
import { Zap, CheckCircle2, Award, Flame, Gift, ArrowRight } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { Button } from '../common/Button';

export const DailyQuestBountyCard = () => {
  const { earnXp } = useLearning();

  const [quests, setQuests] = useState([
    { id: 1, title: 'Scan 1 Object in AR Camera', xp: 50, category: 'AI Vision', completed: false },
    { id: 2, title: 'Complete React State Quiz', xp: 100, category: 'Knowledge', completed: false },
    { id: 3, title: 'Spend 10 mins in Immersive Lab', xp: 75, category: 'Immersive', completed: true },
    { id: 4, title: 'Barter 1 Skill in Marketplace', xp: 120, category: 'Community', completed: false }
  ]);

  const handleClaim = (id, xp) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q));
    earnXp(xp, true);
  };

  return (
    <div style={{
      background: 'rgba(12, 16, 36, 0.92)',
      backdropFilter: 'blur(20px)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid rgba(245, 158, 11, 0.35)',
      padding: '24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
          }}>
            <Gift size={18} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>Daily Quests & XP Bounties</h3>
            <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600 }}>Reset in 04h 22m</span>
          </div>
        </div>

        <div className="cyber-badge-amber" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
          <Flame size={14} color="#f59e0b" fill="#f59e0b" /> 1.5x XP Boost Active
        </div>
      </div>

      {/* Quests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {quests.map((q) => (
          <div
            key={q.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              background: q.completed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.75)',
              border: q.completed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: q.completed ? '#10b981' : 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {q.completed ? <CheckCircle2 size={16} color="#fff" /> : <Zap size={14} color="#fbbf24" />}
              </div>
              <div>
                <strong style={{ display: 'block', color: q.completed ? 'var(--text-muted)' : '#ffffff', fontSize: '0.88rem', textDecoration: q.completed ? 'line-through' : 'none' }}>
                  {q.title}
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700 }}>
                  +{q.xp} XP Bounty
                </span>
              </div>
            </div>

            {q.completed ? (
              <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>Claimed ✨</span>
            ) : (
              <button
                onClick={() => handleClaim(q.id, q.xp)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(245, 158, 11, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                Claim XP
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyQuestBountyCard;
