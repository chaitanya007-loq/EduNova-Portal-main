import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Check, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const FlashcardViewer = ({ cards = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards || cards.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No flashcards available.</div>;
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>
        Card {currentIndex + 1} of {cards.length}
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '240px',
          perspective: '1000px',
          cursor: 'pointer'
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}>
          {/* Front (Question) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(99, 102, 241, 0.18))',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--accent-cyan)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(6, 182, 212, 0.2)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, marginBottom: '8px' }}>
              ❓ Question / Prompt (Click to Flip)
            </span>
            <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
              {currentCard.front}
            </p>
          </div>

          {/* Back (Answer) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(16, 185, 129, 0.2))',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid #10b981',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.2)'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, marginBottom: '8px' }}>
              ✓ Answer / Explanation
            </span>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.45 }}>
              {currentCard.back}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button variant="outline" size="sm" onClick={handlePrev}>
          <ChevronLeft size={16} /> Prev
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsFlipped(!isFlipped)}>
          <RotateCw size={14} /> Flip Card
        </Button>
        <Button variant="outline" size="sm" onClick={handleNext}>
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardViewer;
