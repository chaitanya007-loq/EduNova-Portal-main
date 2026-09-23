import React, { useState } from 'react';
import { Layers, RotateCw, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Zap, HelpCircle } from 'lucide-react';
import { Button } from '../common/Button';

export const SubjectFlashcardsView = ({ subject, topics, onAskSage }) => {
  // Generate high quality default flashcards for the subject if needed
  const defaultDeck = topics.flatMap((t, idx) => [
    {
      id: `card_${t.id}_1`,
      topic: t.name,
      question: `What is the core definition and significance of ${t.name}?`,
      answer: `${t.desc}. It forms the foundational rule evaluated in exam problems and practical applications.`
    },
    {
      id: `card_${t.id}_2`,
      topic: t.name,
      question: `What primary formula or operational rule governs ${t.name}?`,
      answer: `Always verify standard variables, units, and boundary constraints before executing step-by-step evaluation.`
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState({});

  const currentCard = defaultDeck[currentIndex] || defaultDeck[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % defaultDeck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + defaultDeck.length) % defaultDeck.length);
  };

  const toggleMastered = (id) => {
    setMasteredIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const masteredCount = Object.values(masteredIds).filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      
      {/* Deck Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={22} color="var(--accent-cyan)" /> {subject.name} Active Recall Flashcards
          </h3>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Card {currentIndex + 1} of {defaultDeck.length} • {masteredCount} Mastered
          </span>
        </div>

        <Button size="sm" onClick={() => onAskSage(`Generate 10 flashcards for ${subject.name} chapter ${subject.currentChapter || 'Core Topics'}`)}>
          <Sparkles size={14} /> ✨ Generate New Cards
        </Button>
      </div>

      {/* 3D Glass Flashcard Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          background: isFlipped 
            ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(99, 102, 241, 0.18))' 
            : 'var(--glass-bg)',
          border: isFlipped ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '40px 32px',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: 'var(--shadow-xl)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="cyber-badge-cyan" style={{ fontSize: '0.78rem' }}>
            {currentCard.topic}
          </span>
          <span style={{ fontSize: '0.78rem', color: isFlipped ? '#34d399' : 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RotateCw size={12} /> {isFlipped ? 'Answer View (Click to Flip)' : 'Question View (Click to Reveal)'}
          </span>
        </div>

        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          {!isFlipped ? (
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                Question
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                {currentCard.question}
              </h2>
            </div>
          ) : (
            <div>
              <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                Answer & Concept Breakdown
              </span>
              <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {currentCard.answer}
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>Tap anywhere to flip card</span>
          <span style={{ color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Zap size={12} /> +10 XP per flip
          </span>
        </div>
      </div>

      {/* Navigation & Mastery Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" onClick={handlePrev}>
            <ChevronLeft size={16} /> Previous
          </Button>
          <Button variant="secondary" onClick={handleNext}>
            Next <ChevronRight size={16} />
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => toggleMastered(currentCard.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: masteredIds[currentCard.id] ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-tertiary)',
              border: masteredIds[currentCard.id] ? '1px solid #10b981' : '1px solid var(--border-color)',
              color: masteredIds[currentCard.id] ? '#34d399' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle2 size={16} />
            {masteredIds[currentCard.id] ? '✓ Mastered' : 'Mark as Mastered'}
          </button>

          <Button variant="outline" onClick={() => onAskSage(`Explain flashcard question: "${currentCard.question}" in detail`)}>
            Ask Sage AI
          </Button>
        </div>
      </div>

    </div>
  );
};
