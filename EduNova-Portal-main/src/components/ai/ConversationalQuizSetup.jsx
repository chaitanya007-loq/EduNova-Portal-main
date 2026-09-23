import React, { useState, useEffect } from 'react';
import { Sparkles, Check, ArrowRight, RefreshCw, Zap, Edit3, ShieldAlert } from 'lucide-react';
import { subjectService } from '../../services/subjectService';
import { getTopicsForSubject } from '../../data/topics';
import { getStoredLearnerProfile } from '../../data/learners';

export const ConversationalQuizSetup = ({ initialConfig = {}, onStartQuiz, onCancel }) => {
  const profile = getStoredLearnerProfile() || {};
  const activeStudentSubjects = subjectService.getSelectedSubjects();

  // Wizard state
  const [step, setStep] = useState(initialConfig.subjectName ? (initialConfig.count ? 'topic' : 'count') : 'subject');
  
  const [selectedSubject, setSelectedSubject] = useState(
    initialConfig.subjectName || (activeStudentSubjects[0] ? activeStudentSubjects[0].name : 'Mathematics')
  );
  const [subjectId, setSubjectId] = useState(
    initialConfig.subjectId || (activeStudentSubjects[0] ? activeStudentSubjects[0].id : 'sub_math')
  );
  
  const [questionCount, setQuestionCount] = useState(initialConfig.count || 10);
  const [customCountInput, setCustomCountInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customError, setCustomError] = useState('');

  const [selectedTopic, setSelectedTopic] = useState(initialConfig.topicName || 'All Topics');
  const [difficulty, setDifficulty] = useState(initialConfig.difficulty || 'Mixed');
  const [questionType, setQuestionType] = useState(initialConfig.questionType || 'MCQ');
  const [mode, setMode] = useState(initialConfig.mode || 'Practice');

  // Available topics for selected subject
  const availableTopics = getTopicsForSubject(subjectId);

  const handleSelectSubject = (subj) => {
    setSelectedSubject(subj.name);
    setSubjectId(subj.id);
    if (initialConfig.count) {
      setStep('topic');
    } else {
      setStep('count');
    }
  };

  const handleSelectCount = (countVal) => {
    setQuestionCount(countVal);
    setShowCustomInput(false);
    setStep('topic');
  };

  const handleCustomCountSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(customCountInput, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 50) {
      setCustomError('Please enter a valid number of questions between 1 and 50.');
      return;
    }
    setCustomError('');
    setQuestionCount(parsed);
    setShowCustomInput(false);
    setStep('topic');
  };

  const handleSelectTopic = (topName) => {
    setSelectedTopic(topName);
    setStep('difficulty');
  };

  const handleSelectDifficulty = (diffVal) => {
    setDifficulty(diffVal);
    setStep('type');
  };

  const handleSelectType = (typeVal) => {
    setQuestionType(typeVal);
    setStep('mode');
  };

  const handleSelectMode = (modeVal) => {
    setMode(modeVal);
    setStep('summary');
  };

  const handleStartQuizClick = () => {
    if (onStartQuiz) {
      onStartQuiz({
        subjectName: selectedSubject,
        subjectId,
        topicName: selectedTopic,
        count: questionCount,
        difficulty,
        questionType,
        mode
      });
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
      border: '1.5px solid rgba(6, 182, 212, 0.4)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      maxWidth: '640px',
      width: '100%',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Wizard Step Indicator Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem' }}>
          <Sparkles size={16} /> Sage AI Quiz Setup Wizard
        </div>
        <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
          Step {step === 'subject' ? '1/6' : step === 'count' ? '2/6' : step === 'topic' ? '3/6' : step === 'difficulty' ? '4/6' : step === 'type' ? '5/6' : step === 'mode' ? '6/6' : 'Ready'}
        </span>
      </div>

      {/* STEP 1: SUBJECT SELECTION */}
      {step === 'subject' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: 0, color: '#f8fafc', fontSize: '0.92rem', fontWeight: 600 }}>
            Sure! Let's set up your quiz. 🎯 Which subject would you like to practice?
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {activeStudentSubjects.map((subj) => (
              <button
                key={subj.id}
                onClick={() => handleSelectSubject(subj)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedSubject === subj.name ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255, 255, 255, 0.08)',
                  border: selectedSubject === subj.name ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{subj.icon || '📚'}</span> {subj.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: QUESTION COUNT SELECTION */}
      {step === 'count' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: 0, color: '#f8fafc', fontSize: '0.92rem', fontWeight: 600 }}>
            How many questions would you like for <strong style={{ color: '#38bdf8' }}>{selectedSubject}</strong>?
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[5, 10, 15, 20, 25, 30].map((num) => (
              <button
                key={num}
                onClick={() => handleSelectCount(num)}
                style={{
                  flex: '1 1 70px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: questionCount === num && !showCustomInput ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(255, 255, 255, 0.08)',
                  border: questionCount === num && !showCustomInput ? '1.5px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                [{num}]
              </button>
            ))}
            <button
              onClick={() => setShowCustomInput(true)}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: showCustomInput ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: showCustomInput ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.14)',
                color: '#38bdf8',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              [Custom Number]
            </button>
          </div>

          {showCustomInput && (
            <form onSubmit={handleCustomCountSubmit} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input
                type="number"
                placeholder="Enter 1 to 50"
                value={customCountInput}
                onChange={(e) => setCustomCountInput(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: '#fff' }}
              />
              <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', background: '#06b6d4', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Confirm
              </button>
            </form>
          )}
          {customError && <div style={{ color: '#fb7185', fontSize: '0.78rem' }}>{customError}</div>}
        </div>
      )}

      {/* STEP 3: TOPIC SELECTION */}
      {step === 'topic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: 0, color: '#f8fafc', fontSize: '0.92rem', fontWeight: 600 }}>
            Which topic would you like to practice in <strong style={{ color: '#38bdf8' }}>{selectedSubject}</strong>?
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => handleSelectTopic('All Topics')}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                background: selectedTopic === 'All Topics' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.08)',
                border: selectedTopic === 'All Topics' ? '1.5px solid #34d399' : '1px solid rgba(255, 255, 255, 0.14)',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🌐 [All Topics]
            </button>
            {availableTopics.map((top) => (
              <button
                key={top.id || top.name}
                onClick={() => handleSelectTopic(top.name)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedTopic === top.name ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255, 255, 255, 0.08)',
                  border: selectedTopic === top.name ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                [{top.name}]
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: DIFFICULTY SELECTION */}
      {step === 'difficulty' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: 0, color: '#f8fafc', fontSize: '0.92rem', fontWeight: 600 }}>
            What difficulty level would you like?
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Easy', 'Medium', 'Hard', 'Mixed'].map((diff) => (
              <button
                key={diff}
                onClick={() => handleSelectDifficulty(diff)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: difficulty === diff ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.08)',
                  border: difficulty === diff ? '1.5px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                [{diff}]
              </button>
            ))}
            <button
              onClick={() => handleSelectDifficulty('Mixed')}
              style={{
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#94a3b8',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: QUESTION TYPE */}
      {step === 'type' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: 0, color: '#f8fafc', fontSize: '0.92rem', fontWeight: 600 }}>
            What type of questions do you prefer?
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['MCQ', 'True / False', 'Short Answer', 'Mixed'].map((tVal) => (
              <button
                key={tVal}
                onClick={() => handleSelectType(tVal)}
                style={{
                  flex: '1 1 120px',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: questionType === tVal ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255, 255, 255, 0.08)',
                  border: questionType === tVal ? '1.5px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                [{tVal}]
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 6: MODE SELECTION */}
      {step === 'mode' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: 0, color: '#f8fafc', fontSize: '0.92rem', fontWeight: 600 }}>
            Select Quiz Mode:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => handleSelectMode('Practice')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: mode === 'Practice' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.08)',
                border: mode === 'Practice' ? '1.5px solid #34d399' : '1px solid rgba(255, 255, 255, 0.14)',
                color: '#fff',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <strong style={{ display: 'block', fontSize: '0.88rem' }}>[Practice]</strong>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Immediate feedback & explanation per answer.</span>
            </button>

            <button
              onClick={() => handleSelectMode('Exam Simulation')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: mode === 'Exam Simulation' ? 'linear-gradient(135deg, #f43f5e, #be123c)' : 'rgba(255, 255, 255, 0.08)',
                border: mode === 'Exam Simulation' ? '1.5px solid #fb7185' : '1px solid rgba(255, 255, 255, 0.14)',
                color: '#fff',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <strong style={{ display: 'block', fontSize: '0.88rem' }}>[Exam Simulation]</strong>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>No answer reveals until final submission.</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: CONFIRMATION SUMMARY CARD */}
      {step === 'summary' && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1.5px solid #38bdf8',
          borderRadius: 'var(--radius-lg)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎯 Quiz Ready
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.85rem', color: '#e2e8f0', background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px' }}>
            <div><strong>Subject:</strong> {selectedSubject}</div>
            <div><strong>Topic:</strong> {selectedTopic}</div>
            <div><strong>Questions:</strong> {questionCount}</div>
            <div><strong>Difficulty:</strong> {difficulty}</div>
            <div><strong>Type:</strong> {questionType}</div>
            <div><strong>Mode:</strong> {mode}</div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              onClick={handleStartQuizClick}
              style={{
                flex: 2,
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)'
              }}
            >
              <Zap size={18} /> [Start Quiz]
            </button>

            <button
              onClick={() => setStep('subject')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                fontWeight: 600,
                fontSize: '0.85rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Edit3 size={15} /> [Edit Setup]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
