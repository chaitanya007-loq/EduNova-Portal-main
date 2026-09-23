import React, { useState } from 'react';
import { X, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const DailyChallengeModal = ({ isOpen, onClose, onFinish }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [selectedOpt, setSelectedOpt] = useState(null);

  if (!isOpen) return null;

  const challenge = {
    title: '🔥 Today’s Physics & Math Daily Challenge',
    question: 'A ball is thrown straight upward with velocity 20 m/s. Taking g = 10 m/s², what is maximum height reached?',
    options: ['10 meters', '20 meters', '40 meters', '5 meters'],
    correctIndex: 1, // 20m: h = v²/(2g) = 400/20 = 20m
    explanation: 'Maximum height h = v² / (2g) = (20)² / (2 * 10) = 400 / 20 = 20 meters.'
  };

  const handleSubmit = () => {
    const isCorrect = selectedOpt === challenge.correctIndex;
    onFinish({
      gameId: 'daily-challenge',
      gameTitle: '🔥 Daily Challenge Completed',
      score: isCorrect ? 500 : 150,
      accuracy: isCorrect ? 100 : 0,
      xpEarned: isCorrect ? 200 : 50,
      durationSeconds: 30
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 22, 0.85)',
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
          maxWidth: '600px',
          borderRadius: '28px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 246, 255, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(20, 30, 65, 0.95) 0%, rgba(12, 18, 42, 0.98) 100%)',
          border: '2px solid rgba(245, 158, 11, 0.5)',
          boxShadow: '0 25px 65px rgba(245, 158, 11, 0.25)',
          padding: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Flame size={24} color="#f59e0b" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
              🔥 Daily Learning Challenge
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#0f172a' : '#ffffff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '1.15rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '20px', lineHeight: 1.4 }}>
          {challenge.question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {challenge.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOpt(idx)}
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: selectedOpt === idx
                  ? '#38bdf8'
                  : (isLight ? '#ffffff' : 'rgba(255,255,255,0.08)'),
                border: selectedOpt === idx ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.15)',
                color: selectedOpt === idx ? '#ffffff' : (isLight ? '#0f172a' : '#ffffff'),
                fontWeight: 800,
                fontSize: '0.95rem',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={selectedOpt === null}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)'
          }}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};
export default DailyChallengeModal;
