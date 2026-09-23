import React, { useState, useEffect } from 'react';
import { X, Flame, Clock, Trophy, Zap, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const FormulaRushGameModal = ({ isOpen, onClose, onFinish }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);

  const formulas = [
    { title: 'Newton’s 2nd Law of Motion', options: ['F = ma', 'E = mc²', 'v = u + at', 'P = IV'], correct: 'F = ma' },
    { title: 'Ohm’s Law Equation', options: ['V = IR', 'P = IV', 'F = ma', 'E = hf'], correct: 'V = IR' },
    { title: 'Einstein Mass-Energy Equivalence', options: ['E = mc²', 'p = mv', 'W = Fd', 'F = ma'], correct: 'E = mc²' },
    { title: 'Kinetic Energy Formula', options: ['KE = ½ mv²', 'PE = mgh', 'W = Fd', 'v = fλ'], correct: 'KE = ½ mv²' },
    { title: 'Wave Speed Formula', options: ['v = f λ', 'E = hf', 'P = W/t', 'F = G m1m2/r²'], correct: 'v = f λ' }
  ];

  useEffect(() => {
    let timer = null;
    if (isOpen && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isOpen) {
      handleComplete();
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  if (!isOpen) return null;

  const handleSelect = (opt) => {
    const isCorrect = opt === formulas[currentIdx].correct;
    if (isCorrect) {
      setScore(prev => prev + 150 + streak * 25);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    if (currentIdx + 1 < formulas.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    onFinish({
      gameId: 'formula-rush',
      gameTitle: '🏎️ Formula Rush Blitz',
      score,
      accuracy: score > 300 ? 100 : 70,
      xpEarned: 180,
      durationSeconds: 30 - timeLeft
    });
  };

  const f = formulas[currentIdx];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 22, 0.88)',
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
          boxShadow: '0 25px 65px rgba(245, 158, 11, 0.3)',
          padding: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Flame size={24} color="#f59e0b" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
              🏎️ Formula Rush Blitz
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 900, fontSize: '1.2rem' }}>
              <Clock size={18} /> {timeLeft}s
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#0f172a' : '#ffffff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Score & Streak Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.15)', marginBottom: '20px' }}>
          <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: '1.05rem' }}>Score: {score}</span>
          <span style={{ color: '#c084fc', fontWeight: 900, fontSize: '1.05rem' }}>Streak: {streak} 🔥</span>
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
          IDENTIFY THE FORMULA:
        </span>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '4px 0 20px 0' }}>
          {f.title}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {f.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              style={{
                padding: '16px',
                borderRadius: '18px',
                background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.15)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontWeight: 900,
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FormulaRushGameModal;
