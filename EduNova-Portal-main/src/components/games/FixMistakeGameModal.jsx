import React, { useState } from 'react';
import { X, Bug, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const FixMistakeGameModal = ({ isOpen, onClose, onFinish }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [selectedFix, setSelectedFix] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const options = [
    { text: 'Change (1/2) a t³ to (1/2) a t²', isCorrect: true },
    { text: 'Change u t to u / t', isCorrect: false },
    { text: 'Remove initial velocity u entirely', isCorrect: false }
  ];

  if (!isOpen) return null;

  const handleSelect = (opt) => {
    setSelectedFix(opt);
    setShowExplanation(true);
  };

  const handleFinish = () => {
    onFinish({
      gameId: 'fix-mistake',
      gameTitle: '🐛 Fix the Mistake Debugger',
      score: selectedFix?.isCorrect ? 500 : 200,
      accuracy: selectedFix?.isCorrect ? 100 : 0,
      xpEarned: selectedFix?.isCorrect ? 160 : 50,
      durationSeconds: 35
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
          maxWidth: '620px',
          borderRadius: '28px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 246, 255, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(20, 30, 65, 0.95) 0%, rgba(12, 18, 42, 0.98) 100%)',
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 65px rgba(0,0,0,0.5)',
          padding: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bug size={24} color="#ef4444" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
              🐛 Fix the Mistake Debugger
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#0f172a' : '#ffffff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Incorrect Code/Equation Display */}
        <div style={{
          padding: '16px',
          borderRadius: '16px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            ⚠️ Flawed Kinematic Equation
          </span>
          <code style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fca5a5' }}>
            s = ut + (1/2) a t³
          </code>
        </div>

        <p style={{ fontSize: '0.9rem', color: isLight ? '#475569' : '#cbd5e1', marginBottom: '16px' }}>
          Identify the exact mathematical error in the displacement formula above:
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {options.map((opt, idx) => (
            <button
              key={idx}
              disabled={showExplanation}
              onClick={() => handleSelect(opt)}
              style={{
                padding: '14px 16px',
                borderRadius: '16px',
                background: selectedFix === opt
                  ? (opt.isCorrect ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)')
                  : (isLight ? '#ffffff' : 'rgba(255,255,255,0.08)'),
                border: selectedFix === opt
                  ? (opt.isCorrect ? '2px solid #10b981' : '2px solid #ef4444')
                  : '1px solid rgba(255,255,255,0.15)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {/* Sage AI Explanation */}
        {showExplanation && (
          <div style={{
            padding: '16px',
            borderRadius: '18px',
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 800, marginBottom: '6px' }}>
              <Sparkles size={16} /> Sage AI Explanation
            </div>
            <p style={{ fontSize: '0.85rem', color: isLight ? '#334155' : '#e2e8f0', margin: 0, lineHeight: 1.45 }}>
              In the second kinematic equation s = ut + (1/2)at², time t is squared (t²), representing uniform acceleration over time squared. Cubing t violates physical dimensional analysis!
            </p>
          </div>
        )}

        {showExplanation && (
          <button
            onClick={handleFinish}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #10b981 0%, #38bdf8 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Continue to Results
          </button>
        )}
      </div>
    </div>
  );
};
export default FixMistakeGameModal;
