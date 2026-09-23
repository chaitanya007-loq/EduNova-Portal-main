import React, { useState } from 'react';
import { X, Shield, Sword, Trophy, Zap, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const BossBattleGameModal = ({ isOpen, onClose, onFinish }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [stage, setStage] = useState(1); // 1, 2, 3

  const stages = [
    {
      title: 'Stage 1: Mechanics Trajectory Guardian',
      question: 'A projectile is launched at 45°. At max height, what is its vertical velocity vy?',
      options: ['0 m/s', 'Initial velocity u', '9.8 m/s²'],
      correctIndex: 0
    },
    {
      title: 'Stage 2: Physics Energy Warlord',
      question: 'If speed of an object doubles, its kinetic energy increases by factor of:',
      options: ['2', '4', '8'],
      correctIndex: 1
    },
    {
      title: 'Stage 3: Final Boss — Grand Master Sage',
      question: 'What is the work done by a centripetal force in uniform circular motion?',
      options: ['Zero (0 Joules)', 'Maximum Work', 'Negative Work'],
      correctIndex: 0
    }
  ];

  if (!isOpen) return null;

  const currentStage = stages[stage - 1];

  const handleAttack = (optIdx) => {
    const isCorrect = optIdx === currentStage.correctIndex;

    if (isCorrect) {
      setBossHp(prev => Math.max(0, prev - 35));
      if (stage < 3) {
        setStage(prev => prev + 1);
      } else {
        setTimeout(() => {
          onFinish({
            gameId: 'boss-battle',
            gameTitle: '⚔️ Physics Boss Battle Victory!',
            score: 1200,
            accuracy: 100,
            xpEarned: 300,
            durationSeconds: 90
          });
        }, 500);
      }
    } else {
      setPlayerHp(prev => Math.max(0, prev - 35));
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 22, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          borderRadius: '28px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 246, 255, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(20, 30, 65, 0.95) 0%, rgba(12, 18, 42, 0.98) 100%)',
          border: '2px solid rgba(245, 158, 11, 0.5)',
          boxShadow: '0 25px 65px rgba(245, 158, 11, 0.25)',
          padding: '32px'
        }}
      >
        {/* Boss Battle Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sword size={26} color="#fbbf24" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
              ⚔️ Boss Battle: Stage {stage}/3
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#0f172a' : '#ffffff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Health Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Player HP */}
          <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>
              <span>Learner Health</span>
              <span>{playerHp} HP</span>
            </div>
            <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
              <div style={{ width: `${playerHp}%`, height: '100%', background: '#10b981' }} />
            </div>
          </div>

          {/* Boss HP */}
          <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: '#ef4444', marginBottom: '4px' }}>
              <span>Boss Health</span>
              <span>{bossHp} HP</span>
            </div>
            <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
              <div style={{ width: `${bossHp}%`, height: '100%', background: '#ef4444' }} />
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '16px', textAlign: 'center' }}>
          {currentStage.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentStage.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAttack(idx)}
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.15)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              ⚔️ {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default BossBattleGameModal;
