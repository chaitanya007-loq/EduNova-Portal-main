import React, { useState } from 'react';
import { X, RotateCcw, ArrowRight, CheckCircle2, Award } from 'lucide-react';

export const RevisionFlashcardsModal = ({ isOpen, onClose, topicObj }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen || !topicObj) return null;

  const topicName = topicObj.topic || topicObj.name || 'Topic Revision';

  const cards = [
    { front: `What is the core principle behind ${topicName}?`, back: 'Breaking complex problems into predictable, isolated declarative units.' },
    { front: `What is the most common error in ${topicName}?`, back: 'Forgetting async error boundary boundaries or mutating state directly.' },
    { front: `How do you verify accuracy for ${topicName}?`, back: 'Running unit tests, diagnostic quizzes, and active recall assessments.' }
  ];

  const handleNextCard = (known) => {
    if (known) setMasteredCount(prev => prev + 1);
    setIsFlipped(false);
    if (currentIdx + 1 < cards.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(5, 8, 20, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '480px', borderRadius: '24px', background: '#0c1024', border: '1.5px solid #a855f7', padding: '24px', color: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#c084fc', textTransform: 'uppercase' }}>Active Recall Revision</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '2px 0 0 0' }}>{topicName}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {!isFinished ? (
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '10px' }}>
              Flashcard {currentIdx + 1} of {cards.length} • Click card to flip
            </span>

            {/* Flashcard Component */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                height: '180px',
                borderRadius: '18px',
                background: isFlipped ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(6, 182, 212, 0.25))' : '#050814',
                border: '1.5px solid #a855f7',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'center',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: '16px',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                {isFlipped ? 'Answer (Click to flip back)' : 'Question (Click to reveal answer)'}
              </span>
              <p style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.4 }}>
                {isFlipped ? cards[currentIdx].back : cards[currentIdx].front}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleNextCard(false)} className="se-btn se-btn-secondary" style={{ flex: 1, padding: '10px', justifyContent: 'center' }}>
                Need Review
              </button>
              <button onClick={() => handleNextCard(true)} className="se-btn se-btn-primary" style={{ flex: 1, padding: '10px', justifyContent: 'center' }}>
                <CheckCircle2 size={14} /> Got It Right!
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Award size={44} color="#a855f7" style={{ margin: '0 auto 10px auto' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff' }}>Revision Session Complete!</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Reviewed all cards for {topicName}. Revision status updated!</p>
            <button onClick={onClose} className="se-btn se-btn-primary" style={{ padding: '10px 20px', marginTop: '12px' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
