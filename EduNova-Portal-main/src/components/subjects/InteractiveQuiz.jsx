import React, { useState } from 'react';
import { CheckCircle2, XCircle, Trophy, RefreshCw, Bot, HelpCircle, ArrowRight, ArrowLeft, Sparkles, Check, Zap, Lightbulb, RotateCcw } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { quizService } from '../../services/quizService';
import { useLearning } from '../../context/LearningContext';
import { useAuth } from '../../context/AuthContext';

export const InteractiveQuiz = ({ quiz, onReset, onReconfigure, subjectName }) => {
  const { user } = useAuth() || {};
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionId }
  const [answeredQuestions, setAnsweredQuestions] = useState({}); // { [questionId]: boolean }
  const [submitted, setSubmitted] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  const { openAIChat, sendMessage } = useAI();
  const learningState = useLearning() || {};

  if (!quiz || !quiz.questions || quiz.questions.length === 0) return null;

  const currentQ = quiz.questions[currentQuestionIndex];
  const mode = quiz.mode || 'Practice';
  const totalQuestions = quiz.questions.length;

  const getCorrectOptionKey = (q) => {
    if (q.correctOptionId !== undefined) return q.correctOptionId;
    if (q.correctAnswer !== undefined) return q.correctAnswer;
    return 'A';
  };

  const handleSelectOption = (questionId, optionId) => {
    if (answeredQuestions[questionId] && mode === 'Practice') return;
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  // Submit individual answer in Practice mode
  const handleSubmitCurrentAnswer = () => {
    if (!currentQ || selectedAnswers[currentQ.id] === undefined) return;
    setAnsweredQuestions(prev => ({ ...prev, [currentQ.id]: true }));
  };

  // Next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleFinalSubmitQuiz();
    }
  };

  // Final submit quiz
  const handleFinalSubmitQuiz = () => {
    let correctCount = 0;
    const weakTopicsList = [];
    const strongTopicsList = [];

    quiz.questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const correctKey = getCorrectOptionKey(q);
      const isCorrect = selected !== undefined && (selected === correctKey || String(selected) === String(correctKey));

      if (isCorrect) {
        correctCount++;
        if (q.topic) strongTopicsList.push(q.topic);
      } else {
        if (q.topic) weakTopicsList.push(q.topic);
      }
    });

    const scorePct = Math.round((correctCount / totalQuestions) * 100);
    setSubmitted(true);

    if (scorePct >= 60) {
      if (typeof learningState.earnXp === 'function') {
        learningState.earnXp(120);
      } else if (typeof learningState.addXp === 'function') {
        learningState.addXp(120);
      }
    }

    quizService.recordQuizResult(quiz.subjectId || 'sub_general', quiz.topicName || 'General', correctCount, totalQuestions, selectedAnswers, user?.id || user?.email);
  };

  // Calculate final score details
  let correctCount = 0;
  quiz.questions.forEach((q) => {
    const selected = selectedAnswers[q.id];
    const correctKey = getCorrectOptionKey(q);
    if (selected !== undefined && (selected === correctKey || String(selected) === String(correctKey))) {
      correctCount++;
    }
  });
  const scorePct = Math.round((correctCount / totalQuestions) * 100);

  // Ask Sage about wrong answer
  const handleExplainWrongWithSage = (q) => {
    const userSelected = selectedAnswers[q.id];
    const correctKey = getCorrectOptionKey(q);
    openAIChat();
    sendMessage(`Explain why option ${userSelected} is incorrect and why option ${correctKey} is correct for question: "${q.question}" in topic "${quiz.topicName || 'General'}".`);
  };

  // Options normalization
  const optionLetters = ['A', 'B', 'C', 'D'];
  const rawOptions = Array.isArray(currentQ?.options) ? currentQ.options : [];
  const normalizedOptions = rawOptions.map((opt, oIdx) => {
    if (typeof opt === 'object' && opt !== null) {
      return { key: opt.id || optionLetters[oIdx], text: opt.text || opt.label || '' };
    }
    return { key: oIdx, letter: optionLetters[oIdx], text: String(opt) };
  });

  const selectedKey = selectedAnswers[currentQ?.id];
  const correctKey = currentQ ? getCorrectOptionKey(currentQ) : 'A';
  const isCurrentAnswered = answeredQuestions[currentQ?.id];
  const isCurrentCorrect = selectedKey !== undefined && (selectedKey === correctKey || String(selectedKey) === String(correctKey));

  // 1. REVIEW MODE SCREEN
  if (isReviewMode) {
    const reviewQ = quiz.questions[reviewIndex];
    const reviewSelectedKey = selectedAnswers[reviewQ.id];
    const reviewCorrectKey = getCorrectOptionKey(reviewQ);
    const isReviewCorrect = reviewSelectedKey !== undefined && (reviewSelectedKey === reviewCorrectKey || String(reviewSelectedKey) === String(reviewCorrectKey));

    const reviewOpts = Array.isArray(reviewQ.options) ? reviewQ.options.map((opt, oIdx) => ({
      key: typeof opt === 'object' ? opt.id : oIdx,
      letter: optionLetters[oIdx],
      text: typeof opt === 'object' ? opt.text : String(opt)
    })) : [];

    return (
      <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(255, 255, 255, 0.12)', borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            📋 Answer Review — Question {reviewIndex + 1} of {totalQuestions}
          </h3>
          <button onClick={() => setIsReviewMode(false)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Back to Results
          </button>
        </div>

        <div style={{ background: isReviewCorrect ? 'rgba(52, 211, 153, 0.1)' : 'rgba(244, 63, 94, 0.1)', border: isReviewCorrect ? '1px solid #34d399' : '1px solid #f43f5e', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: isReviewCorrect ? '#34d399' : '#fb7185', marginBottom: '6px' }}>
            {isReviewCorrect ? '🟢 Correct Answer' : '🔴 Incorrect Answer'}
          </div>
          <p style={{ color: '#fff', fontWeight: 700, margin: '0 0 12px' }}>{reviewQ.question}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {reviewOpts.map((opt, oIdx) => {
              const isSelected = reviewSelectedKey !== undefined && (reviewSelectedKey === opt.key || String(reviewSelectedKey) === String(opt.key));
              const isCorrect = (reviewCorrectKey === opt.key || String(reviewCorrectKey) === String(opt.key));

              let bg = 'rgba(255, 255, 255, 0.04)';
              let border = '1px solid rgba(255, 255, 255, 0.1)';
              let textColor = '#e2e8f0';

              if (isCorrect) {
                bg = 'rgba(52, 211, 153, 0.2)';
                border = '1.5px solid #34d399';
                textColor = '#34d399';
              } else if (isSelected && !isCorrect) {
                bg = 'rgba(244, 63, 94, 0.2)';
                border = '1.5px solid #f43f5e';
                textColor = '#fb7185';
              }

              return (
                <div key={oIdx} style={{ padding: '10px 14px', borderRadius: '8px', background: bg, border, color: textColor, fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><strong>{opt.letter}.</strong> {opt.text}</span>
                  {isCorrect && <CheckCircle2 size={16} color="#34d399" />}
                  {isSelected && !isCorrect && <XCircle size={16} color="#f43f5e" />}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.82rem', color: '#94a3b8' }}>
            <strong>Explanation:</strong> {reviewQ.explanation}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <button disabled={reviewIndex === 0} onClick={() => setReviewIndex(prev => prev - 1)} style={{ padding: '8px 16px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: reviewIndex === 0 ? 'not-allowed' : 'pointer' }}>
            <ArrowLeft size={16} /> Previous
          </button>
          <button disabled={reviewIndex === totalQuestions - 1} onClick={() => setReviewIndex(prev => prev + 1)} style={{ padding: '8px 16px', borderRadius: '6px', background: '#06b6d4', color: '#fff', border: 'none', cursor: reviewIndex === totalQuestions - 1 ? 'not-allowed' : 'pointer' }}>
            Next <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // 2. FINAL QUIZ COMPLETION SUMMARY SCREEN (Part 5)
  if (submitted) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
        border: scorePct >= 60 ? '1.5px solid #34d399' : '1.5px solid #f43f5e',
        borderRadius: 'var(--radius-xl)',
        padding: '26px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: scorePct >= 60 ? 'rgba(52, 211, 153, 0.2)' : 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={28} color={scorePct >= 60 ? '#34d399' : '#fb7185'} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              🎉 Quiz Complete
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '2px 0 0' }}>
              {quiz.subjectName || subjectName} — {quiz.topicName}
            </p>
          </div>
        </div>

        {/* Score & Accuracy Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block' }}>Score</span>
            <strong style={{ fontSize: '1.25rem', color: '#fff' }}>{correctCount} / {totalQuestions}</strong>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block' }}>Accuracy</span>
            <strong style={{ fontSize: '1.25rem', color: scorePct >= 60 ? '#34d399' : '#fb7185' }}>{scorePct}%</strong>
          </div>
          <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
            <span style={{ color: '#34d399', fontSize: '0.75rem', display: 'block' }}>Correct</span>
            <strong style={{ fontSize: '1.25rem', color: '#34d399' }}>{correctCount}</strong>
          </div>
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
            <span style={{ color: '#fb7185', fontSize: '0.75rem', display: 'block' }}>Incorrect</span>
            <strong style={{ fontSize: '1.25rem', color: '#fb7185' }}>{totalQuestions - correctCount}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
          <button
            onClick={() => { setIsReviewMode(true); setReviewIndex(0); }}
            style={{ flex: 1, minWidth: '130px', padding: '11px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            📋 [Review Answers]
          </button>

          <button
            onClick={() => {
              openAIChat();
              sendMessage(`Give me a 10-question practice quiz focused on weak areas in ${quiz.subjectName}.`);
            }}
            style={{ flex: 1, minWidth: '130px', padding: '11px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', border: '1px solid rgba(6, 182, 212, 0.3)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            🔍 [Practice Weak Areas]
          </button>

          <button
            onClick={() => {
              if (onReconfigure) {
                onReconfigure(quiz);
              } else {
                openAIChat();
                sendMessage(`Create a new quiz for ${quiz.subjectName}`);
              }
            }}
            style={{ flex: 1, minWidth: '130px', padding: '11px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #06b6d4, #6366f1)', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            ⚡ [Take Another Quiz]
          </button>
        </div>
      </div>
    );
  }

  // 3. ACTIVE INTERACTIVE QUIZ CARD (Parts 3 & 4)
  return (
    <div style={{
      background: 'var(--glass-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      padding: '22px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px'
    }}>
      {/* Quiz Progress & Topic Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>
            {quiz.subjectName || subjectName} — {quiz.topicName}
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: '#0284c7', background: 'rgba(2, 132, 199, 0.12)', border: '1px solid rgba(2, 132, 199, 0.3)', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
            {mode} Mode
          </span>
        </div>
      </div>

      {/* Question Text */}
      <strong style={{ fontSize: '1.02rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
        {currentQ.question}
      </strong>

      {/* Options Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {normalizedOptions.map((optObj, oIdx) => {
          const optionValueKey = optObj.key;
          const isThisSelected = selectedKey !== undefined && (selectedKey === optionValueKey || String(selectedKey) === String(optionValueKey));
          const isThisCorrect = (correctKey === optionValueKey || String(correctKey) === String(optionValueKey));

          let btnBg = 'var(--bg-tertiary)';
          let btnBorder = '1px solid var(--border-color)';
          let textColor = 'var(--text-primary)';

          if (isThisSelected) {
            btnBg = 'rgba(2, 132, 199, 0.18)';
            btnBorder = '1.5px solid #0284c7';
            textColor = '#0284c7';
          }

          // In Practice Mode AFTER answer submission, reveal green/red visual states!
          if (isCurrentAnswered && mode === 'Practice') {
            if (isThisCorrect) {
              btnBg = 'rgba(52, 211, 153, 0.22)';
              btnBorder = '1.5px solid #10b981';
              textColor = '#059669';
            } else if (isThisSelected && !isThisCorrect) {
              btnBg = 'rgba(244, 63, 94, 0.22)';
              btnBorder = '1.5px solid #f43f5e';
              textColor = '#e11d48';
            }
          }

          return (
            <button
              key={oIdx}
              onClick={() => handleSelectOption(currentQ.id, optionValueKey)}
              disabled={isCurrentAnswered && mode === 'Practice'}
              style={{
                padding: '13px 18px',
                borderRadius: 'var(--radius-md)',
                background: btnBg,
                border: btnBorder,
                color: textColor,
                fontSize: '0.9rem',
                fontWeight: isThisSelected ? 700 : 500,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: (isCurrentAnswered && mode === 'Practice') ? 'default' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '6px', background: isThisSelected ? '#0284c7' : 'var(--bg-secondary)', color: isThisSelected ? '#ffffff' : 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {optObj.letter || optionLetters[oIdx]}
                </span>
                <span>{optObj.text}</span>
              </div>

              {isCurrentAnswered && mode === 'Practice' && isThisCorrect && <CheckCircle2 size={18} color="#10b981" />}
              {isCurrentAnswered && mode === 'Practice' && isThisSelected && !isThisCorrect && <XCircle size={18} color="#f43f5e" />}
            </button>
          );
        })}
      </div>

      {/* Immediate Explanation Card (Practice Mode after submit) */}
      {isCurrentAnswered && mode === 'Practice' && (
        <div style={{
          background: isCurrentCorrect ? 'rgba(52, 211, 153, 0.1)' : 'rgba(244, 63, 94, 0.1)',
          borderLeft: isCurrentCorrect ? '3px solid #10b981' : '3px solid #f43f5e',
          padding: '14px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <strong style={{ color: isCurrentCorrect ? '#059669' : '#e11d48' }}>
            {isCurrentCorrect ? '🟢 Correct!' : '🔴 Incorrect'}
          </strong>
          <span>{currentQ.explanation}</span>
        </div>
      )}

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <button
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          style={{ padding: '9px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.82rem', fontWeight: 600, cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQuestionIndex === 0 ? 0.4 : 1 }}
        >
          <ArrowLeft size={15} /> Previous
        </button>

        {mode === 'Practice' && !isCurrentAnswered ? (
          <button
            onClick={handleSubmitCurrentAnswer}
            disabled={selectedKey === undefined}
            style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', background: selectedKey !== undefined ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--bg-tertiary)', color: selectedKey !== undefined ? '#ffffff' : 'var(--text-secondary)', border: 'none', fontWeight: 800, fontSize: '0.88rem', cursor: selectedKey !== undefined ? 'pointer' : 'not-allowed' }}
          >
            <Check size={16} /> [Submit Answer]
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            disabled={selectedKey === undefined && mode === 'Exam Simulation'}
            style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Finish & View Score' : 'Next Question'} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default InteractiveQuiz;
