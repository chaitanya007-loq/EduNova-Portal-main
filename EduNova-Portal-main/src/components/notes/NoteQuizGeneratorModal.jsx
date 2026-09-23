import React, { useState } from 'react';
import { HelpCircle, X, Sparkles, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { notesService } from '../../services/notesService';
import { useTheme } from '../../context/ThemeContext';

export const NoteQuizGeneratorModal = ({
  note = null,
  isOpen = false,
  onClose
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);

  // Interactive Quiz Attempt State
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!note) return;
    try {
      setLoading(true);
      setQuizData(null);
      setCurrentIdx(0);
      setSelectedAnswers({});
      setShowResults(false);

      const res = await notesService.createQuizFromNote(note.id, {
        questionCount,
        difficulty
      });
      setQuizData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx, optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qIdx]: optionIdx
    }));
  };

  const calculateScore = () => {
    if (!quizData || !Array.isArray(quizData.questions)) return 0;
    let correct = 0;
    quizData.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctOptionIndex) {
        correct++;
      }
    });
    return correct;
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
        maxWidth: '820px',
        maxHeight: '90vh',
        background: isLight ? '#ffffff' : 'linear-gradient(135deg, rgba(18, 26, 56, 0.98) 0%, rgba(10, 15, 38, 0.98) 100%)',
        border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1.5px solid rgba(56, 189, 248, 0.4)',
        borderRadius: '28px',
        boxShadow: '0 30px 80px rgba(56, 189, 248, 0.25)',
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
              background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HelpCircle size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                🧠 Convert Note to Quiz: {note.title}
              </h2>
              <span style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : '#cbd5e1' }}>
                Sage AI extracts key concepts from your note into interactive diagnostic questions.
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
          {!quizData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Number of Questions
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[5, 10, 15, 20, 25, 30].map(cnt => (
                    <button
                      key={cnt}
                      onClick={() => setQuestionCount(cnt)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        background: questionCount === cnt ? 'linear-gradient(135deg, #38bdf8, #6366f1)' : (isLight ? '#f1f5f9' : 'rgba(255,255,255,0.06)'),
                        color: questionCount === cnt ? '#ffffff' : (isLight ? '#0f172a' : '#cbd5e1'),
                        border: questionCount === cnt ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer'
                      }}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Difficulty Level
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { id: 'EASY', label: 'Easy' },
                    { id: 'INTERMEDIATE', label: 'Medium' },
                    { id: 'HARD', label: 'Hard' },
                    { id: 'ADAPTIVE', label: 'Adaptive' }
                  ].map(d => (
                    <button
                      key={d.id}
                      onClick={() => setDifficulty(d.id)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        background: difficulty === d.id ? 'linear-gradient(135deg, #38bdf8, #6366f1)' : (isLight ? '#f1f5f9' : 'rgba(255,255,255,0.06)'),
                        color: difficulty === d.id ? '#ffffff' : (isLight ? '#0f172a' : '#cbd5e1'),
                        border: difficulty === d.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer'
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={loading}
                style={{
                  padding: '14px 28px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
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
                  boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)'
                }}
              >
                <Sparkles size={18} /> {loading ? 'Sage is generating questions...' : 'Generate Quiz Assessment'}
              </button>
            </div>
          ) : showResults ? (
            /* QUIZ RESULTS VIEW */
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
              }}>
                <Trophy size={32} color="#ffffff" />
              </div>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 8px 0' }}>
                Quiz Completed!
              </h3>
              <p style={{ fontSize: '1.1rem', color: '#38bdf8', fontWeight: 800, marginBottom: '24px' }}>
                You scored {calculateScore()} out of {quizData.questions.length} (
                {Math.round((calculateScore() / quizData.questions.length) * 100)}%)
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                <button
                  onClick={() => { setQuizData(null); setShowResults(false); }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    background: 'rgba(255,255,255,0.1)',
                    color: isLight ? '#0f172a' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={15} style={{ marginRight: '6px' }} /> Retry Quiz
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: '12px 26px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* QUESTION RUNNER VIEW */
            <div>
              {quizData.questions && quizData.questions[currentIdx] && (() => {
                const q = quizData.questions[currentIdx];
                return (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                        Question {currentIdx + 1} of {quizData.questions.length}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#cbd5e1' }}>
                        Difficulty: {quizData.difficulty}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', lineHeight: 1.5, marginBottom: '20px' }}>
                      {q.questionText}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[currentIdx] === oIdx;
                        return (
                          <div
                            key={oIdx}
                            onClick={() => handleSelectOption(currentIdx, oIdx)}
                            style={{
                              padding: '14px 18px',
                              borderRadius: '16px',
                              background: isSelected
                                ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(99, 102, 241, 0.25))'
                                : (isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.05)'),
                              border: isSelected
                                ? '1.5px solid rgba(56, 189, 248, 0.7)'
                                : (isLight ? '1px solid rgba(200,220,240,0.8)' : '1px solid rgba(255,255,255,0.1)'),
                              color: isLight ? '#0f172a' : '#ffffff',
                              fontWeight: isSelected ? 800 : 600,
                              fontSize: '0.92rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {isSelected && <CheckCircle2 size={18} color="#38bdf8" />}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        disabled={currentIdx === 0}
                        onClick={() => setCurrentIdx(prev => prev - 1)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '9999px',
                          background: 'transparent',
                          border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.2)',
                          color: isLight ? '#0f172a' : '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                          opacity: currentIdx === 0 ? 0.5 : 1
                        }}
                      >
                        Previous
                      </button>

                      {currentIdx < quizData.questions.length - 1 ? (
                        <button
                          onClick={() => setCurrentIdx(prev => prev + 1)}
                          style={{
                            padding: '10px 22px',
                            borderRadius: '9999px',
                            background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.86rem',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          Next Question <ArrowRight size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowResults(true)}
                          style={{
                            padding: '10px 24px',
                            borderRadius: '9999px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
                          }}
                        >
                          Submit Quiz
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteQuizGeneratorModal;
