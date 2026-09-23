import React, { useState } from 'react';
import { X, CheckCircle, XCircle, ArrowRight, Award, Sparkles, RefreshCw } from 'lucide-react';

export const SkillPracticeModal = ({ isOpen, onClose, skillObj, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen || !skillObj) return null;

  const skillName = skillObj.name || skillObj.topic || 'Skill Practice';

  const questions = [
    {
      q: `Which concept is fundamental to mastering ${skillName}?`,
      options: [
        'Declarative state mutation & immutability',
        'Direct DOM manual manipulation',
        'Blocking main thread synchronous loops',
        'Global unhandled promise rejections'
      ],
      correct: 0,
      explanation: 'Declarative immutability ensures predictable state transitions and efficient rendering.'
    },
    {
      q: `How do you handle asynchronous operations in ${skillName}?`,
      options: [
        'Using async/await with try-catch blocks',
        'Using infinite while loops',
        'Using setTimeout with 0ms delay only',
        'Suppressing all error boundary exceptions'
      ],
      correct: 0,
      explanation: 'Async/await with structured error handling handles asynchronous network/IO calls cleanly.'
    },
    {
      q: `What is the recommended architectural pattern for ${skillName}?`,
      options: [
        'Single Responsibility Principle & Modular Components',
        'Monolithic monolithic single-file codebases',
        'Tight coupling between views and network drivers',
        'Global mutable window variables'
      ],
      correct: 0,
      explanation: 'Modular single-responsibility design improves testability and reusability.'
    }
  ];

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questions[currentIdx].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (onComplete) onComplete(score + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(5, 8, 20, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '520px', borderRadius: '24px', background: '#0c1024', border: '1.5px solid #06b6d4', padding: '24px', color: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>Diagnostic Assessment</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', margin: '2px 0 0 0' }}>{skillName}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {!isFinished ? (
          <div>
            {/* Progress indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span>Score: {score}</span>
            </div>

            <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #6366f1)' }} />
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '16px', lineHeight: 1.4 }}>
              {questions[currentIdx].q}
            </h4>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {questions[currentIdx].options.map((opt, idx) => {
                let btnBg = '#050814';
                let btnBorder = '1px solid rgba(255, 255, 255, 0.14)';
                if (isAnswered) {
                  if (idx === questions[currentIdx].correct) {
                    btnBg = 'rgba(34, 197, 94, 0.2)';
                    btnBorder = '1.5px solid #22c55e';
                  } else if (idx === selectedOption) {
                    btnBg = 'rgba(244, 63, 94, 0.2)';
                    btnBorder = '1.5px solid #f43f5e';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '14px',
                      background: btnBg,
                      border: btnBorder,
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: isAnswered ? 'default' : 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid #06b6d4', fontSize: '0.8rem', color: '#e2e8f0', marginBottom: '16px' }}>
                💡 <strong>Explanation:</strong> {questions[currentIdx].explanation}
              </div>
            )}

            {isAnswered && (
              <button onClick={handleNext} className="se-btn se-btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
                {currentIdx + 1 === questions.length ? 'Finish Assessment' : 'Next Question'} <ArrowRight size={16} />
              </button>
            )}
          </div>
        ) : (
          /* Finished State */
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Award size={48} color="#10b981" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: 0 }}>Assessment Complete!</h3>
            <p style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 800, margin: '8px 0 16px 0' }}>
              Your Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
              Your mastery and confidence indicators for {skillName} have been updated in your Knowledge Constellation!
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleRestart} className="se-btn se-btn-secondary" style={{ flex: 1, padding: '10px', justifyContent: 'center' }}>
                <RefreshCw size={14} /> Retry
              </button>
              <button onClick={onClose} className="se-btn se-btn-primary" style={{ flex: 1, padding: '10px', justifyContent: 'center' }}>
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
