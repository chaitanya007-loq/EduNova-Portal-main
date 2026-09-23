import React, { useState } from 'react';
import { X, ArrowUp, ArrowDown, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SortItGameModal = ({ isOpen, onClose, onFinish }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [items, setItems] = useState([
    { id: 1, text: 'Identify Coefficients a, b, c' },
    { id: 2, text: 'Write Equation in Standard Form ax² + bx + c = 0' },
    { id: 3, text: 'Apply Quadratic Formula x = (-b ± √D) / 2a' },
    { id: 4, text: 'Calculate Discriminant D = b² - 4ac' }
  ]);

  const correctOrder = [2, 1, 4, 3];

  if (!isOpen) return null;

  const moveUp = (index) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setItems(newItems);
  };

  const moveDown = (index) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setItems(newItems);
  };

  const handleSubmit = () => {
    const userOrder = items.map(i => i.id);
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);

    onFinish({
      gameId: 'sort-it',
      gameTitle: '🔀 Sort It Sequence Builder',
      score: isCorrect ? 450 : 200,
      accuracy: isCorrect ? 100 : 50,
      xpEarned: isCorrect ? 150 : 60,
      durationSeconds: 40
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
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 65px rgba(0,0,0,0.5)',
          padding: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
            🔀 Sort It Sequence Builder
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#0f172a' : '#ffffff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: isLight ? '#475569' : '#cbd5e1', marginBottom: '20px' }}>
          Arrange the Quadratic Equation solution steps in correct logical order:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '16px',
                background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                border: isLight ? '1px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                {idx + 1}. {item.text}
              </span>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => moveUp(idx)} disabled={idx === 0} style={{ padding: '6px', borderRadius: '8px', background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer' }}>
                  <ArrowUp size={16} color={isLight ? '#0f172a' : '#ffffff'} />
                </button>
                <button onClick={() => moveDown(idx)} disabled={idx === items.length - 1} style={{ padding: '6px', borderRadius: '8px', background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer' }}>
                  <ArrowDown size={16} color={isLight ? '#0f172a' : '#ffffff'} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)'
          }}
        >
          Submit Sequence
        </button>
      </div>
    </div>
  );
};
export default SortItGameModal;
