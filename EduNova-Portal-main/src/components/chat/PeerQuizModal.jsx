import React, { useState } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, XCircle, ArrowRight, Award, Zap, X, Send } from 'lucide-react';
import { generateQuiz } from '../../services/aiService';
import { useTheme } from '../../context/ThemeContext';

const DEFAULT_QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'What is the primary purpose of the React useEffect cleanup function?',
    options: [
      'To force re-render the component on state update',
      'To unsubscribe from subscriptions, clear timers, and prevent memory leaks',
      'To initialize global Redux state values',
      'To fetch initial API data before DOM mounts'
    ],
    answerIndex: 1,
    explanation: 'The cleanup function returned by useEffect runs before the component unmounts or before re-executing the effect, clearing timers and event listeners.'
  },
  {
    id: 'q2',
    question: 'Which Hook should be used to memorize expensive computed calculations in React?',
    options: [
      'useCallback',
      'useMemo',
      'useRef',
      'useContext'
    ],
    answerIndex: 1,
    explanation: 'useMemo returns a memoized value and only recalculates it when one of its dependencies has changed.'
  },
  {
    id: 'q3',
    question: 'What happens if you omit the dependency array in useEffect(() => {})?',
    options: [
      'The effect runs only once when component mounts',
      'The effect runs after every single render',
      'The effect never executes',
      'React throws a runtime SyntaxError'
    ],
    answerIndex: 1,
    explanation: 'Without a dependency array, useEffect executes after initial mount and after every subsequent component render.'
  }
];

export const PeerQuizModal = ({ isOpen, onClose, partnerName = 'Peer', onShareQuizToChat }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [questions, setQuestions] = useState(DEFAULT_QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loadingAi, setLoadingAi] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('React Hooks & Context');

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // Prevent re-answering
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: idx }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate final score
      let finalScore = 0;
      questions.forEach((q, i) => {
        if (selectedAnswers[i] === q.answerIndex) finalScore += 1;
      });
      setScore(finalScore);
      setIsSubmitted(true);
    }
  };

  const handleGenerateAiQuiz = async () => {
    setLoadingAi(true);
    try {
      const generated = await generateQuiz('Web Development', selectedTopic, 'Medium', 3);
      if (generated && generated.questions && generated.questions.length > 0) {
        const formatted = generated.questions.map((q, idx) => ({
          id: `q_ai_${idx}`,
          question: q.question,
          options: q.options,
          answerIndex: q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : 0,
          explanation: q.explanation || 'Review topic fundamentals for deeper mastery.'
        }));
        setQuestions(formatted);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setIsSubmitted(false);
      }
    } catch (e) {
      // fallback to default
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSendToChat = () => {
    if (onShareQuizToChat) {
      onShareQuizToChat({
        quizTitle: `${selectedTopic} Peer Challenge`,
        score: isSubmitted ? `${score}/${questions.length}` : 'Quiz Challenge',
        questions
      });
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(12, 16, 36, 0.98)',
          border: isLight ? '1px solid rgba(195, 215, 245, 0.95)' : '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: '24px',
          boxShadow: isLight ? '0 20px 60px rgba(64, 100, 160, 0.2)' : '0 20px 60px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
            background: isLight ? 'linear-gradient(135deg, rgba(235, 248, 255, 0.95), rgba(245, 240, 255, 0.95))' : 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(168, 85, 247, 0.15))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4, #a855f7)', color: '#fff' }}>
              <HelpCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Peer Learning Quiz Mode
                <span style={{ padding: '2px 8px', borderRadius: '10px', background: isLight ? 'rgba(54, 199, 244, 0.15)' : 'rgba(6, 182, 212, 0.2)', color: isLight ? '#0284c7' : '#38bdf8', fontSize: '0.7rem', fontWeight: 800 }}>
                  Interactive
                </span>
              </h3>
              <span style={{ fontSize: '0.75rem', color: isLight ? '#475569' : '#94a3b8' }}>
                Play live with {partnerName} or test your mastery
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#475569' : '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Topic Selector & AI Generator Bar */}
        <div style={{ padding: '12px 20px', background: isLight ? 'rgba(240, 246, 255, 0.95)' : '#050814', borderBottom: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="se-form-select"
            style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto', flex: 1, background: isLight ? '#ffffff' : '#050814', color: isLight ? '#0f172a' : '#fff', border: isLight ? '1px solid rgba(195, 215, 245, 0.95)' : '1px solid rgba(255,255,255,0.16)' }}
          >
            <option value="React Hooks & Context">React Hooks & Context</option>
            <option value="Python Data Structures">Python Data Structures</option>
            <option value="UI/UX & Figma Auto-Layout">UI/UX & Figma Auto-Layout</option>
            <option value="Physics & Electricity">Physics & Electricity</option>
            <option value="Quantitative Aptitude">Quantitative Aptitude</option>
          </select>

          <button
            onClick={handleGenerateAiQuiz}
            disabled={loadingAi}
            className="se-btn se-btn-purple"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            <Sparkles size={14} /> {loadingAi ? 'Generating...' : 'AI Fresh Quiz'}
          </button>
        </div>

        {/* Main Quiz Body */}
        <div style={{ padding: '24px', minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
          {!isSubmitted ? (
            <>
              {/* Question Progress Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800 }}>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={14} /> +20 XP per correct answer
                </span>
              </div>

              {/* Progress Line Bar */}
              <div style={{ width: '100%', height: '6px', borderRadius: '4px', background: isLight ? 'rgba(210, 225, 250, 0.9)' : 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ height: '100%', width: `${((currentIndex + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg, #06b6d4, #a855f7)', transition: 'width 0.3s ease' }} />
              </div>

              {/* Question Text */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                {currentQ.question}
              </h4>

              {/* Options Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentIndex] === idx;
                  const isCorrect = idx === currentQ.answerIndex;
                  const hasAnswered = selectedAnswers[currentIndex] !== undefined;

                  let optionBg = isLight ? '#ffffff' : '#050814';
                  let optionBorder = isLight ? '1px solid rgba(195, 215, 245, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)';
                  let optionColor = isLight ? '#0f172a' : '#e2e8f0';

                  if (hasAnswered) {
                    if (isCorrect) {
                      optionBg = isLight ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.15)';
                      optionBorder = '1px solid #22c55e';
                      optionColor = isLight ? '#15803d' : '#4ade80';
                    } else if (isSelected) {
                      optionBg = isLight ? 'rgba(244, 63, 94, 0.12)' : 'rgba(244, 63, 94, 0.15)';
                      optionBorder = '1px solid #f43f5e';
                      optionColor = isLight ? '#b91c1c' : '#fca5a5';
                    }
                  } else if (isSelected) {
                    optionBg = 'rgba(6, 182, 212, 0.2)';
                    optionBorder = '1px solid #06b6d4';
                    optionColor = '#38bdf8';
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '14px',
                        background: optionBg,
                        border: optionBorder,
                        color: optionColor,
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        cursor: hasAnswered ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{opt}</span>
                      {hasAnswered && isCorrect && <CheckCircle2 size={18} color="#22c55e" />}
                      {hasAnswered && isSelected && !isCorrect && <XCircle size={18} color="#f43f5e" />}
                    </div>
                  );
                })}
              </div>

              {/* Answer Explanation Banner */}
              {selectedAnswers[currentIndex] !== undefined && (
                <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', borderLeft: '4px solid #06b6d4', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '20px' }}>
                  <strong style={{ color: '#38bdf8' }}>Explanation:</strong> {currentQ.explanation}
                </div>
              )}

              {/* Next Question Button */}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentIndex] === undefined}
                  className="se-btn se-btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.85rem', opacity: selectedAnswers[currentIndex] !== undefined ? 1 : 0.5 }}
                >
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'View Quiz Score'} <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : (
            /* FINAL SCORE CARD */
            <div style={{ textAlign: 'center', padding: '24px 0', margin: 'auto 0' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 10px 30px rgba(6,182,212,0.4)' }}>
                <Award size={36} color="#fff" />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Quiz Challenge Completed!
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '6px 0 20px 0' }}>
                Topic: <strong style={{ color: '#38bdf8' }}>{selectedTopic}</strong>
              </p>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', padding: '16px 32px', borderRadius: '20px', background: '#050814', border: '1px solid rgba(6, 182, 212, 0.4)', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8' }}>{score} / {questions.length}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Correct Answers</span>
                </div>
                <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fbbf24' }}>+{score * 20} XP</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>XP Earned</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={handleSendToChat}
                  className="se-btn se-btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  <Send size={15} /> Share Quiz Results to Chat
                </button>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentIndex(0);
                    setSelectedAnswers({});
                  }}
                  className="se-btn se-btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.85rem' }}
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
