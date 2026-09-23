import React, { useState } from 'react';
import { Layers, X, Sparkles, RotateCw, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { notesService } from '../../services/notesService';
import { useTheme } from '../../context/ThemeContext';

export const NoteFlashcardModal = ({
  note = null,
  isOpen = false,
  onClose
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [flashcardData, setFlashcardData] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!note) return;
    try {
      setLoading(true);
      setFlashcardData(null);
      setCurrentIdx(0);
      setIsFlipped(false);

      const res = await notesService.createFlashcardsFromNote(note.id, { count });
      setFlashcardData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !note) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 22, 0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        background: isLight ? '#ffffff' : 'linear-gradient(135deg, rgba(18, 26, 56, 0.98) 0%, rgba(10, 15, 38, 0.98) 100%)',
        border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1.5px solid rgba(168, 85, 247, 0.4)',
        borderRadius: '28px',
        boxShadow: '0 30px 80px rgba(168, 85, 247, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* HEADER */}
        <div style={{
          padding: '20px 28px',
          borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isLight ? 'rgba(248, 250, 252, 0.9)' : 'rgba(255, 255, 255, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                🎴 Flashcard Deck: {note.title}
              </h2>
              <span style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : '#cbd5e1' }}>
                Sage AI extracts key concepts for quick revision.
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
              border: 'none',
              color: isLight ? '#0f172a' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
          {!flashcardData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Number of Flashcards
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[5, 10, 15, 20].map(cnt => (
                    <button
                      key={cnt}
                      onClick={() => setCount(cnt)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        background: count === cnt ? 'linear-gradient(135deg, #a855f7, #ec4899)' : (isLight ? '#f1f5f9' : 'rgba(255,255,255,0.06)'),
                        color: count === cnt ? '#ffffff' : (isLight ? '#0f172a' : '#cbd5e1'),
                        border: count === cnt ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer'
                      }}
                    >
                      {cnt} Cards
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  padding: '14px 28px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginTop: '10px',
                  boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)'
                }}
              >
                <Sparkles size={18} /> {loading ? 'Sage is extracting flashcards...' : 'Extract Flashcard Deck'}
              </button>
            </div>
          ) : (
            /* FLIPPABLE CARD CONTAINER */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', marginBottom: '14px' }}>
                Card {currentIdx + 1} of {flashcardData.cards.length} • Click card to flip
              </div>

              {/* 3D FLIP CARD */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                style={{
                  width: '100%',
                  height: '240px',
                  borderRadius: '24px',
                  background: isFlipped
                    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))'
                    : 'linear-gradient(135deg, rgba(56, 189, 248, 0.18), rgba(99, 102, 241, 0.18))',
                  border: isFlipped
                    ? '1.5px solid rgba(236, 72, 153, 0.6)'
                    : '1.5px solid rgba(56, 189, 248, 0.6)',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  transition: 'transform 0.4s ease, border-color 0.4s ease'
                }}
              >
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: isFlipped ? '#ec4899' : '#38bdf8', textTransform: 'uppercase', marginBottom: '12px' }}>
                  {isFlipped ? 'ANSWER / DEFINITION' : 'QUESTION / CONCEPT'}
                </span>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', lineHeight: 1.5, margin: 0 }}>
                  {isFlipped
                    ? flashcardData.cards[currentIdx]?.back
                    : flashcardData.cards[currentIdx]?.front}
                </h3>

                <span style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RotateCw size={13} /> Click to flip
                </span>
              </div>

              {/* CARD NAVIGATION CONTROLS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '24px' }}>
                <button
                  disabled={currentIdx === 0}
                  onClick={() => { setCurrentIdx(prev => prev - 1); setIsFlipped(false); }}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: isLight ? '#0f172a' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentIdx === 0 ? 0.5 : 1
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Flip Card
                </button>

                <button
                  disabled={currentIdx === flashcardData.cards.length - 1}
                  onClick={() => { setCurrentIdx(prev => prev + 1); setIsFlipped(false); }}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: isLight ? '#0f172a' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: currentIdx === flashcardData.cards.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: currentIdx === flashcardData.cards.length - 1 ? 0.5 : 1
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteFlashcardModal;
