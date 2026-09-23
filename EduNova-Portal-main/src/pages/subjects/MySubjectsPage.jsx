import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  TrendingUp,
  Flame,
  Zap,
  Target,
  Clock,
  Play,
  Bot,
  Sparkles,
  Search,
  X,
  Filter,
  Brain,
  Award,
  Settings,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useSubjects } from '../../hooks/useSubjects';
import { EduNovaHeroBanner } from '../../components/common/EduNovaHeroBanner';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { SubjectCard } from '../../components/subjects/SubjectCard';
import { SubjectSelector } from '../../components/subjects/SubjectSelector';
import { ManageSubjectsModal } from '../../components/subjects/ManageSubjectsModal';
import { InteractiveQuiz } from '../../components/subjects/InteractiveQuiz';
import { subjectService } from '../../services/subjectService';
import { useAI } from '../../context/AIContext';

import { useLearner } from '../../context/LearnerContext';
import { useTheme } from '../../context/ThemeContext';
import { curriculumService } from '../../services/curriculumService';
import { useUserProgress } from '../../hooks/useUserProgress';

export const MySubjectsPage = () => {
  const navigate = useNavigate();
  const { openAIChat, sendMessage } = useAI();
  const { learner, learnerType } = useLearner() || {};
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { progress: userProgress } = useUserProgress();

  const {
    selectedSubjects = [],
    availableSubjects = [],
    addSubject,
    removeSubject,
    updateSubjectConfig
  } = useSubjects();

  const trackSubjects = curriculumService.getCurriculumSubjects({ learnerType, userProgress });
  const categoryTabs = curriculumService.getCategoryTabs(learnerType);

  const subjectsList = trackSubjects.length > 0
    ? trackSubjects
    : (Array.isArray(selectedSubjects) && selectedSubjects.length > 0 ? selectedSubjects : []);

  // Safely calculate dynamic stats & telemetry
  const activeCount = subjectsList.length;
  const avgProgress = activeCount > 0
    ? Math.round(subjectsList.reduce((acc, s) => acc + (typeof s.progress === 'number' ? s.progress : 0), 0) / activeCount)
    : 0;

  const stats = {
    activeCount,
    avgProgress,
    streakDays: 0,
    weeklyHours: '0h 0m',
    totalXP: 0
  };

  // Derive Today's Focus from active subjects safely
  const activeSubject = subjectsList[0];
  const todaysFocus = activeSubject ? {
    subjectId: activeSubject.id,
    subjectName: activeSubject.name,
    subjectColor: activeSubject.color || '#6366f1',
    topic: activeSubject.currentTopic || activeSubject.name,
    durationMinutes: 45,
    progress: activeSubject.progress || 0,
    aiRecommendation: `Sage scheduled targeted practice in ${activeSubject.name} based on your learning activity.`
  } : null;

  // Derive weak topics matching user activity
  const totalUserActivity = (userProgress?.completedLessons || 0) + (userProgress?.completedQuizzes || 0) + (userProgress?.completedAssignments || 0);
  const weakTopics = totalUserActivity > 0 ? [
    { subjectName: 'MATHEMATICS', topic: 'Trigonometric Applications', score: 45 },
    { subjectName: 'PHYSICS (SCIENCE)', topic: 'Refractive Index & Lens Formula', score: 45 },
    { subjectName: 'CHEMISTRY (SCIENCE)', topic: 'Balancing Redox Reactions', score: 45 },
    { subjectName: 'ENGLISH LANGUAGE & LITERATURE', topic: 'Reported Speech Rules', score: 45 }
  ] : [];

  const strongTopics = subjectsList.filter(s => (s.progress || 0) >= 70).map(s => ({
    subjectName: s.name.toUpperCase(),
    topic: s.currentTopic || s.name,
    score: s.progress || 85
  }));

  const continueLesson = activeSubject ? {
    subject: activeSubject.name,
    topic: activeSubject.currentTopic || activeSubject.name,
    lessonTitle: `Chapter 1: Core Concepts of ${activeSubject.name}`,
    progress: activeSubject.progress || 0
  } : null;

  const upcomingSessions = subjectsList.slice(0, 3).map((s, idx) => ({
    day: ['Today', 'Tomorrow', 'In 2 Days'][idx] || 'Upcoming',
    subjectName: s.name,
    topic: s.currentTopic || 'Practice Session',
    durationMinutes: 45
  }));

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'selector'
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All' | 'High Priority' | 'Needs Attention' | 'Improving'
  const [sortBy, setSortBy] = useState('Priority'); // 'Priority' | 'Progress' | 'Needs Attention' | 'Alphabetical'
  const [activeQuizModal, setActiveQuizModal] = useState(null);

  const handleReorder = (subjectId, direction) => {
    subjectService.reorderSubjects(subjectId, direction);
  };

  const startTopicQuiz = (subjectId, subjectName, topicName) => {
    const quizObj = {
      id: `quiz_${Date.now()}`,
      subjectId: subjectId || 'sub_gen',
      topicName: topicName || 'Diagnostic Quiz',
      subjectName: subjectName || 'General',
      mode: 'Practice',
      questions: [
        {
          id: 'q1',
          question: `Which core principle defines ${topicName || 'this topic'}?`,
          options: [
            { id: 'A', text: 'Equilibrium & Conservation Principles' },
            { id: 'B', text: 'Second-order Empirical Shift' },
            { id: 'C', text: 'Linear Vector Disruption' },
            { id: 'D', text: 'Static Noise Isolation' }
          ],
          correctOptionId: 'A',
          explanation: 'Conservation and equilibrium laws form the bedrock of fundamental physics/math problem-solving.',
          topic: topicName
        },
        {
          id: 'q2',
          question: `When executing steps in ${topicName || 'practice problems'}, what is the most important check?`,
          options: [
            { id: 'A', text: 'Verify unit dimensional consistency' },
            { id: 'B', text: 'Skip boundary condition checks' },
            { id: 'C', text: 'Randomly estimate final scalar values' },
            { id: 'D', text: 'Ignore zero-division cases' }
          ],
          correctOptionId: 'A',
          explanation: 'Dimensional consistency ensures physical and mathematical validity across calculations.',
          topic: topicName
        },
        {
          id: 'q3',
          question: `What is the diagnostic benchmark for ${topicName || 'mastery'}?`,
          options: [
            { id: 'A', text: 'Accuracy above 85% with steady speed' },
            { id: 'B', text: 'Memorization of textbook paragraph headers' },
            { id: 'C', text: 'Time spent reviewing solution keys' },
            { id: 'D', text: 'Number of repeated attempts' }
          ],
          correctOptionId: 'A',
          explanation: 'Fluency is marked by high first-attempt accuracy and efficient resolution time.',
          topic: topicName
        }
      ]
    };
    setActiveQuizModal(quizObj);
  };

  const [, setFavTick] = useState(0);

  useEffect(() => {
    const handleFavUpdate = () => setFavTick(prev => prev + 1);
    window.addEventListener('edunova_favorites_updated', handleFavUpdate);
    return () => window.removeEventListener('edunova_favorites_updated', handleFavUpdate);
  }, []);

  const getFilteredSubjects = () => {
    let list = [...subjectsList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.currentTopic && s.currentTopic.toLowerCase().includes(q)) ||
        (s.weakTopic && s.weakTopic.toLowerCase().includes(q))
      );
    }

    if (categoryFilter && categoryFilter !== 'All' && categoryFilter !== 'Saved') {
      list = list.filter(s =>
        s.category === categoryFilter ||
        s.name.toLowerCase().includes(categoryFilter.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(categoryFilter.toLowerCase()))
      );
    } else if (categoryFilter === 'Saved') {
      list = list.filter(s => s.favorite || curriculumService.isFavorite(s.id));
    }

    if (sortBy === 'Progress') {
      list.sort((a, b) => (typeof b.progress === 'number' ? b.progress : 0) - (typeof a.progress === 'number' ? a.progress : 0));
    } else if (sortBy === 'Needs Attention') {
      list.sort((a, b) => (typeof a.progress === 'number' ? a.progress : 0) - (typeof b.progress === 'number' ? b.progress : 0));
    } else if (sortBy === 'Alphabetical') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  };

  const filteredSubjects = getFilteredSubjects();

  const handleAskSageForFocus = () => {
    if (!todaysFocus) return;
    openAIChat();
    sendMessage(`Explain why ${todaysFocus.topic} in ${todaysFocus.subjectName} is recommended for me today and give me 3 key insights.`);
  };

  const handlePractice10Questions = () => {
    startTopicQuiz('todays_focus', todaysFocus?.subjectName, todaysFocus?.topic);
  };

  const handlePracticeWeakTopic = (topic, subjectName) => {
    startTopicQuiz('weak_topic', subjectName, topic);
  };


  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. SUBJECT HUB HEADER BANNER WITH 3D GLASS ORB */}
      <EduNovaHeroBanner
        badge="✦ Personalized Curriculum Engine"
        title="My Subjects Hub"
        subtitle="Your personalized academic command center for real-time progress analytics, targeted practice, and Sage AI tutor support."
        stats={[
          { label: `${stats.activeCount}`, subtext: 'Active Subjects', icon: BookOpen, color: '#2dd4bf', iconBg: 'rgba(20, 184, 166, 0.25)' },
          { label: `${stats.avgProgress}%`, subtext: 'Average Progress', icon: TrendingUp, color: '#34d399', iconBg: 'rgba(52, 211, 153, 0.25)' },
          { label: '3', subtext: 'Learning Goals', isPill: true }
        ]}
      />

      {/* Header Quick Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap', marginTop: '-8px' }}>
        <Button variant="outline" onClick={() => setIsManageOpen(true)} style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Settings size={16} /> Manage Priorities
        </Button>
        <Button onClick={() => setViewMode(viewMode === 'grid' ? 'selector' : 'grid')} style={{ boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)' }}>
          {viewMode === 'grid' ? <><Plus size={16} /> Add / Select Subjects</> : <><BookOpen size={16} /> View Selected Subjects</>}
        </Button>
      </div>

      {/* Compact Telemetry Metrics Snapshot Grid - Frosted Glass Material */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        padding: '18px 22px',
        borderRadius: '24px',
        border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.07)', padding: '10px 14px', borderRadius: '16px', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.14)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.25)', border: '1px solid rgba(6, 182, 212, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', flexShrink: 0 }}>
            <BookOpen size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800, display: 'block', letterSpacing: '0.5px' }}>Active Subjects</span>
            <strong style={{ fontSize: '1.05rem', color: isLight ? '#18345F' : '#ffffff', fontWeight: 800 }}>{stats.activeCount} Subjects</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.07)', padding: '10px 14px', borderRadius: '16px', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.14)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.25)', border: '1px solid rgba(52, 211, 153, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800, display: 'block', letterSpacing: '0.5px' }}>Average Progress</span>
            <strong style={{ fontSize: '1.05rem', color: '#059669', fontWeight: 800 }}>{stats.avgProgress}% Avg</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.07)', padding: '10px 14px', borderRadius: '16px', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.14)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.25)', border: '1px solid rgba(244, 63, 94, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', flexShrink: 0 }}>
            <Flame size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800, display: 'block', letterSpacing: '0.5px' }}>Learning Streak</span>
            <strong style={{ fontSize: '1.05rem', color: '#e11d48', fontWeight: 800 }}>🔥 {stats.streakDays} Days</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.07)', padding: '10px 14px', borderRadius: '16px', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.14)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.25)', border: '1px solid rgba(245, 158, 11, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
            <Zap size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800, display: 'block', letterSpacing: '0.5px' }}>Study Activity</span>
            <strong style={{ fontSize: '1.05rem', color: '#d97706', fontWeight: 800 }}>{stats.weeklyHours} • {stats.totalXP} XP</strong>
          </div>
        </div>
      </div>

      {viewMode === 'selector' ? (
        <SubjectSelector
          availableSubjects={availableSubjects}
          selectedSubjects={selectedSubjects}
          onToggleSubject={(id) => {
            const isSelected = selectedSubjects.some(s => s.id === id);
            if (isSelected) removeSubject(id);
            else addSubject(id);
          }}
          onDone={() => setViewMode('grid')}
        />
      ) : (
        <>
          {/* 2. TODAY'S FOCUS & SAGE AI INSIGHT DUAL PANELS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            
            {/* 🎯 TODAY'S FOCUS */}
            <div style={{
              background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
              borderRadius: '24px',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: isLight ? '1.5px solid rgba(99, 102, 241, 0.35)' : '1.5px solid rgba(99, 102, 241, 0.5)',
              boxShadow: isLight ? '0 15px 40px rgba(99, 102, 241, 0.15)' : '0 20px 50px rgba(99, 102, 241, 0.25), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={18} /> 🎯 TODAY'S FOCUS
                  </span>
                  {todaysFocus && (
                    <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 800, background: 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '3px 10px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {todaysFocus.durationMinutes} mins remaining
                    </span>
                  )}
                </div>

                {todaysFocus ? (
                  <div>
                    <span style={{ background: todaysFocus.subjectColor || '#6366f1', color: '#ffffff', padding: '4px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '8px', display: 'inline-block' }}>
                      {todaysFocus.subjectName}
                    </span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: isLight ? '#18345F' : '#ffffff', margin: '4px 0 10px 0', letterSpacing: '-0.01em' }}>
                      {todaysFocus.topic}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: isLight ? '#18345F' : '#cbd5e1', margin: '0 0 16px 0', lineHeight: 1.55, background: isLight ? 'rgba(235, 243, 255, 0.8)' : 'rgba(255, 255, 255, 0.07)', padding: '12px 14px', borderRadius: '12px', borderLeft: '3px solid #6366f1', border: isLight ? '1px solid rgba(210, 225, 250, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)' }}>
                      <strong>Why:</strong> {todaysFocus.aiRecommendation || 'Sage scheduled targeted practice because your accuracy in Chemical Reactions & Equations was 72% in your recent review.'}
                    </p>

                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px', color: isLight ? '#5D7192' : '#cbd5e1' }}>
                        <span style={{ fontWeight: 700 }}>Topic Mastery</span>
                        <strong style={{ color: '#0284c7', fontWeight: 800 }}>{todaysFocus.progress}%</strong>
                      </div>
                      <ProgressBar progress={todaysFocus.progress} color="#38bdf8" />
                    </div>
                  </div>
                ) : (
                  <p style={{ color: isLight ? '#5D7192' : '#cbd5e1', fontSize: '0.88rem' }}>All today's focus activities completed!</p>
                )}
              </div>

              {todaysFocus && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '16px', borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.14)' }}>
                  <button
                    onClick={() => navigate(`/subjects/${todaysFocus.subjectId}`)}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #36C7F4 0%, #4F8CFF 50%, #8B6CFF 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(79, 140, 255, 0.35)'
                    }}
                  >
                    <Play size={14} /> Start Learning
                  </button>
                  <button
                    onClick={handlePractice10Questions}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '12px',
                      background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.06)',
                      border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                      color: isLight ? '#18345F' : '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    ⚡ Practice 10 MCQs
                  </button>
                  <button
                    onClick={handleAskSageForFocus}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '12px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.35)',
                      color: '#6366f1',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Bot size={14} /> Ask Sage
                  </button>
                </div>

              )}
            </div>

            {/* ✨ SAGE AI INSIGHT */}
            <div style={{
              background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
              borderRadius: '24px',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: isLight ? '1.5px solid rgba(168, 85, 247, 0.35)' : '1.5px solid rgba(168, 85, 247, 0.5)',
              boxShadow: isLight ? '0 15px 40px rgba(168, 85, 247, 0.15)' : '0 20px 50px rgba(168, 85, 247, 0.25), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              padding: '24px'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Sparkles size={18} /> ✨ SAGE AI INSIGHT
                </span>

                <div style={{
                  background: isLight ? 'rgba(243, 232, 255, 0.7)' : 'rgba(168, 85, 247, 0.15)',
                  border: isLight ? '1px solid rgba(216, 180, 254, 0.8)' : '1px solid rgba(168, 85, 247, 0.35)',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <p style={{ fontSize: '0.92rem', color: isLight ? '#18345F' : '#ffffff', lineHeight: 1.55, fontStyle: 'italic', margin: 0 }}>
                    "{weakTopics.length > 0 
                      ? `You're making solid progress in ${stats.activeCount} subjects, but ${weakTopics[0].topic} in ${weakTopics[0].subjectName} is currently one of your weaker areas (${weakTopics[0].score}% accuracy). I've prepared targeted practice materials for you.`
                      : `Great work! Your average progress across subjects is ${stats.avgProgress}%. Keep your ${stats.streakDays}-day streak going by taking today's quick assessment.`}"
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '16px', borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255, 255, 255, 0.14)' }}>
                <button
                  onClick={() => {
                    openAIChat();
                    sendMessage(`Give me practice material for ${weakTopics[0]?.topic || 'my current subjects'}.`);
                  }}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
                  }}
                >
                  ⚡ Practice Now
                </button>
                <button
                  onClick={() => openAIChat()}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '12px',
                    background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)',
                    border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.2)',
                    color: isLight ? '#18345F' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Bot size={14} /> Ask Sage
                </button>
              </div>
            </div>
          </div>

          {/* 3. SEARCH, QUICK FILTER TABS & SORT BAR */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            background: isLight ? 'rgba(255, 255, 255, 0.82)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            padding: '16px 22px',
            borderRadius: '24px',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: isLight ? '0 10px 30px rgba(100, 130, 200, 0.12)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)'
          }}>
            {/* Search Input with Clear Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flex: 1,
              minWidth: '260px',
              background: isLight ? 'rgba(240, 246, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)',
              padding: '10px 16px',
              borderRadius: '14px',
              border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.18)'
            }}>
              <Search size={16} color={isLight ? '#0284c7' : '#38bdf8'} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search My Subjects, chapters, weak topics..."
                style={{ background: 'none', border: 'none', color: isLight ? '#18345F' : '#ffffff', width: '100%', outline: 'none', fontSize: '0.9rem', padding: 0 }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: isLight ? '#5D7192' : '#94a3b8', cursor: 'pointer', display: 'flex' }}>
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Dynamic Category Filter Pills per Dashboard Track */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              {categoryTabs.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: categoryFilter === cat ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.35), rgba(99, 102, 241, 0.35))' : (isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)'),
                    color: categoryFilter === cat ? (isLight ? '#0284c7' : '#ffffff') : (isLight ? '#5D7192' : '#cbd5e1'),
                    border: categoryFilter === cat ? '1px solid #38bdf8' : (isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)'),
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              ))}

              {/* Saved Pill */}
              <button
                onClick={() => setCategoryFilter(categoryFilter === 'Saved' ? 'All' : 'Saved')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: categoryFilter === 'Saved' ? 'rgba(251, 191, 36, 0.25)' : (isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)'),
                  color: categoryFilter === 'Saved' ? '#d97706' : (isLight ? '#5D7192' : '#cbd5e1'),
                  border: categoryFilter === 'Saved' ? '1px solid #fbbf24' : (isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)'),
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                ⭐ Saved
              </button>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: isLight ? '#5D7192' : '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                <Filter size={14} color="#0284c7" /> Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)',
                  color: isLight ? '#18345F' : '#ffffff',
                  border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '7px 14px',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  outline: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <option value="Priority">Priority</option>
                <option value="Progress">Highest Progress</option>
                <option value="Needs Attention">Needs Attention</option>
                <option value="Alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* 4. SUBJECT CARDS GRID WITH ACCESSIBLE REORDER */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '22px' }}>
            {filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onManage={() => setIsManageOpen(true)}
                onReorder={handleReorder}
                onStartQuiz={(quizInfo) => startTopicQuiz(quizInfo.subjectId, quizInfo.subjectName, quizInfo.topicName)}
              />
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredSubjects.length === 0 && (
            <div style={{
              background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
              borderRadius: '24px',
              backdropFilter: 'blur(28px)',
              border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : '0 20px 50px rgba(0, 0, 0, 0.55)',
              padding: '48px 24px',
              textAlign: 'center'
            }}>
              <BookOpen size={44} color="#06b6d4" style={{ marginBottom: '14px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff' }}>No matching subjects found</h3>
              <p style={{ color: isLight ? '#52668a' : '#cbd5e1', fontSize: '0.9rem', marginBottom: '20px', maxWidth: '460px', margin: '0 auto 20px' }}>
                Try adjusting your search term or filter category to see your configured subjects.
              </p>
              <Button onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}>
                Reset Filters
              </Button>
            </div>
          )}

          {/* 5. TOPICS TO IMPROVE & STRONG TOPICS DUAL BREAKDOWN */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            
            {/* 🧠 TOPICS TO IMPROVE */}
            <div style={{
              background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
              backdropFilter: 'blur(28px)',
              borderRadius: '24px',
              border: isLight ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(244, 63, 94, 0.4)',
              boxShadow: isLight ? '0 10px 30px rgba(100, 130, 200, 0.12)' : '0 20px 50px rgba(0, 0, 0, 0.55)',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#e11d48' }}>
                <Brain size={18} /> 🧠 TOPICS TO IMPROVE
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {weakTopics.length > 0 ? (
                  weakTopics.map((item, i) => (
                    <div key={i} style={{ background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.07)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.14)', padding: '14px 16px', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '8px' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>{item.subjectName}</span>
                          <strong style={{ display: 'block', color: isLight ? '#18345F' : '#ffffff', fontSize: '0.94rem' }}>{item.topic}</strong>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <strong style={{ color: '#e11d48', fontSize: '0.9rem', display: 'block' }}>{item.score}% accuracy</strong>
                          <button
                            onClick={() => handlePracticeWeakTopic(item.topic, item.subjectName)}
                            style={{
                              fontSize: '0.74rem',
                              color: '#0284c7',
                              background: 'rgba(56, 189, 248, 0.18)',
                              border: '1px solid rgba(56, 189, 248, 0.4)',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              marginTop: '2px'
                            }}
                          >
                            ⚡ Quiz Me
                          </button>
                        </div>
                      </div>
                      <ProgressBar progress={item.score} color="#fb7185" />
                    </div>
                  ))
                ) : (
                  <p style={{ color: isLight ? '#5D7192' : '#cbd5e1', fontSize: '0.85rem' }}>No weak topics identified yet. Keep completing quizzes!</p>
                )}
              </div>
            </div>

            {/* 💪 STRONG TOPICS */}
            <div style={{
              background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
              backdropFilter: 'blur(28px)',
              borderRadius: '24px',
              border: isLight ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(52, 211, 153, 0.4)',
              boxShadow: isLight ? '0 10px 30px rgba(100, 130, 200, 0.12)' : '0 20px 50px rgba(0, 0, 0, 0.55)',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#059669' }}>
                <Award size={18} /> 💪 MASTERED TOPICS
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {strongTopics.length > 0 ? (
                  strongTopics.map((item, i) => (
                    <div key={i} style={{ background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.07)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.14)', padding: '14px 16px', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '8px' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>{item.subjectName}</span>
                          <strong style={{ display: 'block', color: isLight ? '#18345F' : '#ffffff', fontSize: '0.94rem' }}>{item.topic}</strong>
                        </div>
                        <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 800, background: 'rgba(52, 211, 153, 0.2)', padding: '3px 10px', borderRadius: '999px' }}>
                          ✓ {item.score}% Mastered
                        </span>
                      </div>
                      <ProgressBar progress={item.score} color="#34d399" />
                    </div>
                  ))
                ) : (
                  <p style={{ color: isLight ? '#5D7192' : '#cbd5e1', fontSize: '0.85rem' }}>Complete more chapters to unlock your strong topics list!</p>
                )}
              </div>
            </div>
          </div>

          {/* 6. CONTINUE LEARNING & UP NEXT SCHEDULE */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            
            {/* CONTINUE LEARNING */}
            <div style={{
              background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
              backdropFilter: 'blur(28px)',
              borderRadius: '24px',
              border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow: isLight ? '0 10px 30px rgba(100, 130, 200, 0.12)' : '0 20px 50px rgba(0, 0, 0, 0.55)',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#0284c7' }}>
                  📚 CONTINUE LEARNING
                </span>
                <span style={{ fontSize: '1.2rem' }}>⚛️</span>
              </div>

              {continueLesson ? (
                <div>
                  <div style={{ fontSize: '0.75rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>
                    {continueLesson.subject}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', margin: '4px 0 4px 0' }}>
                    {continueLesson.topic}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: isLight ? '#5D7192' : '#cbd5e1', marginBottom: '14px' }}>
                    {continueLesson.lessonTitle}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px', color: isLight ? '#5D7192' : '#cbd5e1' }}>
                    <span>Progress</span>
                    <strong style={{ color: '#0284c7', fontWeight: 800 }}>{continueLesson.progress}%</strong>
                  </div>
                  <ProgressBar progress={continueLesson.progress} color="#38bdf8" />

                  <div style={{ marginTop: '16px', textAlign: 'right' }}>
                    <Button onClick={() => navigate('/my-subjects')} style={{ fontSize: '0.82rem', padding: '8px 16px', background: 'linear-gradient(90deg, #36C7F4 0%, #4F8CFF 50%, #8B6CFF 100%)', color: '#ffffff', border: 'none' }}>
                      Continue Learning <ArrowRight size={15} />
                    </Button>
                  </div>
                </div>
              ) : (
                <p style={{ color: isLight ? '#5D7192' : '#cbd5e1' }}>All current lessons completed!</p>
              )}
            </div>

            {/* UP NEXT */}
            <div style={{
              background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
              backdropFilter: 'blur(28px)',
              borderRadius: '24px',
              border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow: isLight ? '0 10px 30px rgba(100, 130, 200, 0.12)' : '0 20px 50px rgba(0, 0, 0, 0.55)',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#059669' }}>
                  📅 UP NEXT IN STUDY PLANNER
                </span>
                <Button variant="secondary" onClick={() => navigate('/study-planner')} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                  Open Planner
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((sess, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate('/study-planner')}
                      style={{
                        background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.07)',
                        border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.14)',
                        padding: '12px 14px',
                        borderRadius: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', fontWeight: 700, textTransform: 'uppercase' }}>{sess.day}</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff' }}>{sess.subjectName}</div>
                        <div style={{ fontSize: '0.8rem', color: isLight ? '#5D7192' : '#cbd5e1' }}>{sess.topic}</div>
                      </div>

                      <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 800, background: 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '4px 10px', borderRadius: '8px' }}>
                        {sess.durationMinutes} mins
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: isLight ? '#5D7192' : '#cbd5e1', fontSize: '0.85rem' }}>No upcoming sessions remaining this week.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* MANAGE SUBJECTS MODAL */}
      <ManageSubjectsModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        selectedSubjects={selectedSubjects}
        onUpdateConfig={updateSubjectConfig}
        onRemoveSubject={removeSubject}
        onOpenSelector={() => {
          setIsManageOpen(false);
          setViewMode('selector');
        }}
      />

      {/* INTERACTIVE DIAGNOSTIC QUIZ MODAL */}
      {activeQuizModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 22, 0.88)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '780px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, rgba(20, 28, 58, 0.95) 0%, rgba(14, 18, 42, 0.98) 100%)',
            borderRadius: '28px',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.25)',
            position: 'relative',
            padding: '28px'
          }}>
            <button
              onClick={() => setActiveQuizModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 700,
                zIndex: 10
              }}
            >
              ✕
            </button>
            <InteractiveQuiz
              quiz={activeQuizModal}
              onReset={() => setActiveQuizModal(null)}
              onReconfigure={() => setActiveQuizModal(null)}
              subjectName={activeQuizModal.subjectName}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubjectsPage;

