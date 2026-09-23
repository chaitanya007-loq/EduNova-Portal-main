import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LessonViewer } from '../../components/courses/LessonViewer';
import { QuizEngine } from '../../components/courses/QuizEngine';
import { getQuizForCourse } from '../../services/quizService';
import { getCourseById } from '../../services/courseService';
import { ArrowLeft, BookOpen, Brain, CheckCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [activeTab, setActiveTab] = useState('lesson');

  useEffect(() => {
    getQuizForCourse(id || 'crs_1').then(setQuizData);
  }, [id]);

  const activeModule = {
    id: 'm1',
    title: 'Module 1: Advanced State & Custom Hooks Architecture',
    duration: '2.5 Hours'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <button
        onClick={() => navigate(`/courses/${id || 'crs_1'}`)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.88rem' }}
      >
        <ArrowLeft size={16} /> Back to Course Overview
      </button>

      {/* Tabs Toolbar */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setActiveTab('lesson')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'lesson' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--bg-secondary)',
            color: activeTab === 'lesson' ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            fontWeight: 600,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <BookOpen size={18} /> Interactive Lesson Player
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'quiz' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--bg-secondary)',
            color: activeTab === 'quiz' ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            fontWeight: 600,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Brain size={18} /> Knowledge Check Quiz Engine
        </button>
      </div>

      {activeTab === 'lesson' ? (
        <LessonViewer moduleData={activeModule} onCompleteModule={() => setActiveTab('quiz')} />
      ) : (
        quizData && <QuizEngine quizData={quizData} />
      )}
    </div>
  );
};
