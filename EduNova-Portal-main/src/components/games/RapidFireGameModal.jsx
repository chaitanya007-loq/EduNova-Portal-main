import React, { useState, useEffect } from 'react';
import { X, Zap, Clock, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const RapidFireGameModal = ({ isOpen, onClose, onFinish, subjectData }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const questions = [
    { question: 'What is Newton’s Second Law equation?', options: ['F = ma', 'v = u + at', 'E = mc²'], answer: 'F = ma' },
    { question: 'First equation of motion under constant acceleration?', options: ['v = u + at', 's = ut + (1/2)at²', 'v² = u² + 2as'], answer: 'v = u + at' },
    { question: 'What is the Discriminant formula for quadratic equations?', options: ['b² - 4ac', '-b / 2a', 'a² + b²'], answer: 'b² - 4ac' },
    { question: 'Unit of Electrical Resistance?', options: ['Ohm (Ω)', 'Volt (V)', 'Ampere (A)'], answer: 'Ohm (Ω)' },
    { question: 'What does 3NF eliminate in relational databases?', options: ['Transitive Dependencies', 'Partial Dependencies', 'Duplicate rows'], answer: 'Transitive Dependencies' }
  ];

  useEffect(() => {
    let timer = null;
    if (isOpen && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isOpen) {
      handleCompleteGame();
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  if (!isOpen) return null;

  const handleAnswer = (option) => {
    const q = questions[currentIndex];
    const isCorrect = option === q.answer;

    setTotalAttempted(prev => prev + 1);
    if (isCorrect) {
      const addedScore = 100 + (combo * 20);
      setScore(prev => prev + addedScore);
      setCombo(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
    } else {
      setCombo(0);
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleCompleteGame();
    }
  };

  const handleCompleteGame = () => {
    const acc = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 100;
    onFinish({
      gameId: 'rapid-fire',
      gameTitle: '⚡ Rapid Fire Sprint',
      score,
      accuracy: acc,
      xpEarned: 120,
      durationSeconds: 60 - timeLeft
    });
  };

  const currentQ = questions[currentIndex];

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
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 65px rgba(0,0,0,0.5)',
          padding: '32px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={24} color="#38bdf8" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
              ⚡ Rapid Fire Sprint
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 900, fontSize: '1.1rem' }}>
              <Clock size={18} /> {timeLeft}s
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#0f172a' : '#ffffff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Score & Combo bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', padding: '12px 16px', borderRadius: '16px', background: 'rgba(56, 189, 248, 0.15)' }}>
          <span style={{ color: '#38bdf8', fontWeight: 800 }}>Score: {score}</span>
          <span style={{ color: '#c084fc', fontWeight: 800 }}>Combo: {combo}x 🔥</span>
        </div>

        {/* Question */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '20px', textAlign: 'center' }}>
          {currentQ.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.15)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
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
export default RapidFireGameModal;
