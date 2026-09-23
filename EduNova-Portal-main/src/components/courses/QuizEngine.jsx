import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { submitQuizAnswers } from '../../services/quizService';
import { useLearning } from '../../context/LearningContext';

export const QuizEngine = ({ quizData, onFinish }) => {
  const { earnXp } = useLearning();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const questions = quizData.questions;
  const currentQ = questions[currentStep];

  const handleSelect = (optionIdx) => {
    if (submitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentStep]: optionIdx });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    const res = await submitQuizAnswers(quizData.id, selectedAnswers);
    setResult(res);
    setSubmitted(true);
    if (res.passed) {
      earnXp(res.earnedXp);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setResult(null);
    setCurrentStep(0);
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-glow)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      boxShadow: 'var(--glass-shadow)'
    }}>
      {submitted && result ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: result.passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            {result.passed ? <CheckCircle size={36} color="#10b981" /> : <XCircle size={36} color="#f43f5e" />}
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
            {result.passed ? 'Quiz Passed Successfully!' : 'Keep Practicing!'}
          </h3>

          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '12px' }}>
            Score: {result.score}% ({result.correctCount} / {result.totalQuestions} Correct)
          </p>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            {result.passed ? `Awesome job! You unlocked +${result.earnedXp} XP.` : 'Review the concept explanations and try again.'}
          </p>

          <Button onClick={handleRetry}>
            <RotateCcw size={16} /> Retry Quiz Engine
          </Button>
        </div>
      ) : (
        <div>
          {/* Question Header Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Question {currentStep + 1} of {questions.length}
            </span>
            <span className="cyber-badge-amber">Reward: +{quizData.rewardXp} XP</span>
          </div>

          {/* Question Text */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', lineHeight: 1.4 }}>
            {currentQ.question}
          </h3>

          {/* Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentStep] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-tertiary)',
                    border: isSelected ? '2px solid #6366f1' : '1px solid var(--border-color)',
                    color: isSelected ? '#fff' : 'var(--text-primary)',
                    textAlign: 'left',
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: '0.9rem',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {String.fromCharCode(65 + idx)}. {opt}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="ghost"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Previous
            </Button>

            {currentStep < questions.length - 1 ? (
              <Button
                disabled={selectedAnswers[currentStep] === undefined}
                onClick={handleNext}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="primary"
                disabled={selectedAnswers[currentStep] === undefined}
                onClick={handleSubmit}
              >
                Submit Answers
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
