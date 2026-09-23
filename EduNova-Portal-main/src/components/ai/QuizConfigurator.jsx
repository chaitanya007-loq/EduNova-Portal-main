import React, { useState } from 'react';
import { HelpCircle, Sparkles, Zap, BookOpen, Layers, Award } from 'lucide-react';
import { getStoredLearnerProfile } from '../../data/learners';

export const QuizConfigurator = ({ onGenerate, activeSubject }) => {
  const profile = getStoredLearnerProfile() || {};
  const isSchool = profile.learnerType === 'school' || (profile.title && profile.title.toLowerCase().includes('class'));

  // Default subject list per track
  const schoolSubjects = ['Science & Physics', 'Mathematics', 'Chemistry', 'Biology', 'English Grammar', 'Social Science'];
  const collegeSubjects = ['Database Management (DBMS)', 'Operating Systems', 'Data Structures & Algorithms', 'Object-Oriented Java', 'Web Development', 'Computer Networks'];
  const examSubjects = ['Quantitative Technique', 'Logical Reasoning', 'Language Comprehension', 'Innovation & Entrepreneurship'];

  const subjectOptions = isSchool ? schoolSubjects : (profile.learnerType === 'exam' ? examSubjects : collegeSubjects);

  const [selectedSubject, setSelectedSubject] = useState(activeSubject || subjectOptions[0]);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('Medium');
  const countOptions = [5, 10, 15, 20, 25, 30];

  const handleStartQuiz = () => {
    if (onGenerate) {
      onGenerate({
        subjectName: selectedSubject,
        count: questionCount,
        difficulty
      });
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
      border: '1.5px solid rgba(6, 182, 212, 0.4)',
      borderRadius: 'var(--radius-xl)',
      padding: '22px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      maxWidth: '680px',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> Sage AI Quiz Configurator
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
            Customize Practice Quiz
          </h3>
        </div>
        <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)', fontWeight: 600 }}>
          {isSchool ? '🏫 School Track' : '🎓 College Track'}
        </span>
      </div>

      {/* 1. Select Subject / Topic */}
      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
          1. Select Subject or Topic:
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {subjectOptions.map((subj) => {
            const isSelected = selectedSubject === subj;
            return (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255, 255, 255, 0.06)',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: isSelected ? '#ffffff' : '#cbd5e1',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(6, 182, 212, 0.3)' : 'none'
                }}
              >
                {subj}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Select Number of Questions (5, 10, 15, 20, 25, 30) */}
      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
          2. How Many Questions Do You Want?
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {countOptions.map((num) => {
            const isSelected = questionCount === num;
            return (
              <button
                key={num}
                onClick={() => setQuestionCount(num)}
                style={{
                  flex: '1 1 70px',
                  minWidth: '60px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(255, 255, 255, 0.06)',
                  border: isSelected ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: isSelected ? '#ffffff' : '#e2e8f0',
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 800 : 600,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(168, 85, 247, 0.35)' : 'none'
                }}
              >
                {num} Qs
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Select Difficulty */}
      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
          3. Difficulty Level:
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['Easy', 'Medium', 'Hard'].map((diff) => {
            const isSelected = difficulty === diff;
            let activeBg = 'linear-gradient(135deg, #10b981, #059669)';
            if (diff === 'Medium') activeBg = 'linear-gradient(135deg, #f59e0b, #d97706)';
            if (diff === 'Hard') activeBg = 'linear-gradient(135deg, #ef4444, #dc2626)';

            return (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? activeBg : 'rgba(255, 255, 255, 0.06)',
                  border: isSelected ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate Quiz Action Button */}
      <button
        onClick={handleStartQuiz}
        style={{
          width: '100%',
          padding: '13px 20px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
          border: 'none',
          color: '#ffffff',
          fontSize: '0.98rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(6, 182, 212, 0.4)',
          transition: 'all 0.2s ease',
          marginTop: '6px'
        }}
      >
        <Zap size={18} /> Generate {questionCount} Question {selectedSubject} Quiz
      </button>
    </div>
  );
};
