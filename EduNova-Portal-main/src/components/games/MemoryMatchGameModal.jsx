import React, { useState } from 'react';
import { X, Layers, CheckCircle2, Trophy } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const MemoryMatchGameModal = ({ isOpen, onClose, onFinish }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const cardsData = [
    { id: 1, text: 'v = u + at', pairId: 'a' },
    { id: 2, text: '1st Kinematic Eq.', pairId: 'a' },
    { id: 3, text: 'F = ma', pairId: 'b' },
    { id: 4, text: 'Newton 2nd Law', pairId: 'b' },
    { id: 5, text: '3NF', pairId: 'c' },
    { id: 6, text: 'No Transitive Dep.', pairId: 'c' }
  ];

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  if (!isOpen) return null;

  const handleCardClick = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.id)) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const card1 = cardsData.find(c => c.id === newFlipped[0]);
      const card2 = cardsData.find(c => c.id === newFlipped[1]);

      if (card1.pairId === card2.pairId) {
        setMatched(prev => [...prev, card1.id, card2.id]);
        setFlipped([]);

        if (matched.length + 2 === cardsData.length) {
          setTimeout(() => {
            onFinish({
              gameId: 'memory-match',
              gameTitle: '🃏 Memory Match Laboratory',
              score: 350,
              accuracy: 100,
              xpEarned: 150,
              durationSeconds: 45
            });
          }, 600);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
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
          maxWidth: '640px',
          borderRadius: '28px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 246, 255, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(20, 30, 65, 0.95) 0%, rgba(12, 18, 42, 0.98) 100%)',
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 65px rgba(0,0,0,0.5)',
          padding: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={24} color="#c084fc" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
              🃏 Memory Match Laboratory
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#0f172a' : '#ffffff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Card Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {cardsData.map(c => {
            const isFlippedCard = flipped.includes(c.id) || matched.includes(c.id);
            return (
              <div
                key={c.id}
                onClick={() => handleCardClick(c)}
                style={{
                  height: '110px',
                  borderRadius: '18px',
                  background: isFlippedCard
                    ? (isLight ? '#38bdf8' : '#312e81')
                    : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'),
                  border: isFlippedCard ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {isFlippedCard ? c.text : '❓'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default MemoryMatchGameModal;
