import React, { useState, useEffect } from 'react';
import { 
  Calendar, Bot, CheckCircle, Clock, Plus, Sparkles, Play, BookOpen, 
  ArrowRight, Award, Zap, AlertCircle, RefreshCw, Layers, Check, ChevronRight, HelpCircle, Flame, Target, Download, ShieldCheck, User, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { studyPlannerService } from '../../services/studyPlannerService';
import { subjectService } from '../../services/subjectService';
import { useLearner } from '../../context/LearnerContext';
import { useAI } from '../../context/AIContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

import { FocusStudyModal } from '../../components/studyPlanner/FocusStudyModal';
import { SessionDetailModal } from '../../components/studyPlanner/SessionDetailModal';
import { CreateStudySessionModal } from '../../components/studyPlanner/CreateStudySessionModal';
import { SagePlanBuilderModal } from '../../components/studyPlanner/SagePlanBuilderModal';
import { HybridPlanOptimizerModal } from '../../components/studyPlanner/HybridPlanOptimizerModal';
import { WeeklyPlannerCalendar } from '../../components/studyPlanner/WeeklyPlannerCalendar';
import { TodayCommandCenter } from '../../components/studyPlanner/TodayCommandCenter';
import { PlanHealthWidget } from '../../components/studyPlanner/PlanHealthWidget';
import { RevisionRadarWidget } from '../../components/studyPlanner/RevisionRadarWidget';
import { NaturalLanguagePlanModal } from '../../components/studyPlanner/NaturalLanguagePlanModal';
import { StudyPlannerThemeGraphic } from '../../components/studyPlanner/StudyPlannerThemeGraphic';
import { useUserProgress } from '../../hooks/useUserProgress';

export const StudyPlannerPage = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { progress } = useUserProgress();
  const { learner, learnerType } = useLearner();
  const { openAIChat, sendMessage } = useAI();
  const navigate = useNavigate();

  // Core Planner State
  const [plan, setPlan] = useState(() => studyPlannerService.getCurrentPlan());
  const [sessions, setSessions] = useState(() => studyPlannerService.getSessions());
  const [weeklyStats, setWeeklyStats] = useState(() => studyPlannerService.getWeeklyProgress());
  const [plannerMode, setPlannerMode] = useState(() => studyPlannerService.getPlannerMode()); // 'ai' | 'manual' | 'hybrid'
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sageWizardOpen, setSageWizardOpen] = useState(false);
  const [hybridOptimizerOpen, setHybridOptimizerOpen] = useState(false);
  const [naturalLangModalOpen, setNaturalLangModalOpen] = useState(false);

  const [focusModalOpen, setFocusModalOpen] = useState(false);
  const [activeFocusSession, setActiveFocusSession] = useState(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeDetailSession, setActiveDetailSession] = useState(null);

  const [suggestions, setSuggestions] = useState([]);

  // Sync state
  useEffect(() => {
    const subjs = subjectService.getSelectedSubjects(learnerType);
    setSelectedSubjects(subjs);

    const unsubscribe = studyPlannerService.subscribe((updatedPlan, updatedSessions) => {
      setPlan({ ...updatedPlan });
      setSessions([...updatedSessions]);
      setWeeklyStats(studyPlannerService.getWeeklyProgress());
      setPlannerMode(studyPlannerService.getPlannerMode());
    });
    return unsubscribe;
  }, [learnerType]);

  const todaysFocus = studyPlannerService.getTodaysFocusSession();
  const whyReasons = studyPlannerService.getWhySageCreatedPlanReasons();

  const handleModeSwitch = (mode) => {
    setPlannerMode(mode);
    studyPlannerService.setPlannerMode(mode);
    if (mode === 'ai') {
      setSageWizardOpen(true);
    } else if (mode === 'manual') {
      setCreateModalOpen(true);
    } else if (mode === 'hybrid') {
      handleOptimizePlan();
    }
  };

  const handleOpenFocus = (session) => {
    setActiveFocusSession(session);
    setFocusModalOpen(true);
  };

  const handleOpenDetail = (session) => {
    setActiveDetailSession(session);
    setDetailModalOpen(true);
  };

  const handleMarkComplete = (sessionId) => {
    studyPlannerService.completeStudySession(sessionId);
  };

  const handleDeleteSession = (sessionId) => {
    studyPlannerService.deleteSession(sessionId);
  };

  const handleDuplicateSession = (sessionId) => {
    studyPlannerService.duplicateSession(sessionId);
  };

  const handleAddManualSession = (sessionData) => {
    studyPlannerService.addSession(sessionData);
  };

  const handleGenerateAIPlan = async (config) => {
    await studyPlannerService.regeneratePlanWithAI(config);
  };

  const handleOptimizePlan = () => {
    const suggs = studyPlannerService.optimizePlanWithHybridAI();
    setSuggestions(suggs);
    setHybridOptimizerOpen(true);
  };

  const handleExportICal = () => {
    studyPlannerService.exportToICalendar();
  };

  const handleAskSageForFocus = () => {
    if (!todaysFocus) return;
    openAIChat();
    sendMessage(`Explain why ${todaysFocus.topic} in ${todaysFocus.subjectName} is recommended for me today and give me 3 key insights.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#ffffff', width: '100%', paddingBottom: '60px' }}>
      
      {/* 1. HERO BRANDING HEADER (EDUNOVA STUDY COMMAND CENTER 2.0) */}
      <div
        style={{
          position: 'relative',
          borderRadius: '28px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(235, 243, 255, 0.85) 50%, rgba(240, 235, 255, 0.88) 100%)'
            : 'linear-gradient(135deg, #0b0d26 0%, #15103a 50%, #080c1e 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(6, 182, 212, 0.35)',
          boxShadow: isLight
            ? '0 20px 50px rgba(64, 100, 160, 0.10), inset 0 1.5px 2px rgba(255, 255, 255, 1)'
            : '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(6, 182, 212, 0.15)',
          padding: '28px 32px',
          overflow: 'hidden'
        }}
      >
        {/* Dynamic 3D Glass Orb & Glowing Vector Light Trails Theme UI */}
        <StudyPlannerThemeGraphic isLight={isLight} size={200} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', zIndex: 10, position: 'relative' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                padding: '4px 12px',
                borderRadius: '12px',
                background: isLight ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.18)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                color: isLight ? '#0284c7' : '#38bdf8',
                fontWeight: 800
              }}>
                <Sparkles size={14} /> Official EduNova Study Command Center 2.0
              </span>
              <span style={{
                background: isLight ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                color: isLight ? '#4f46e5' : '#a5b4fc',
                fontSize: '0.74rem',
                padding: '4px 12px',
                borderRadius: '12px',
                fontWeight: 700
              }}>
                {learnerType?.toUpperCase() || 'COLLEGE'} TRACK
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 6px 0', letterSpacing: '-0.5px', color: isLight ? '#18345F' : '#ffffff' }}>
              Study Command Center
            </h1>
            <p style={{ color: isLight ? '#0284c7' : '#38bdf8', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px 0' }}>
              "Plan your way. Let Sage optimize when you want."
            </p>
            <p style={{ color: isLight ? '#334155' : '#94a3b8', fontSize: '0.9rem', margin: 0, maxWidth: '640px', lineHeight: 1.45 }}>
              Complete control over your personal schedule with manual planning, data-backed AI schedules, hybrid optimization, Pomodoro focus execution, and spaced repetition.
            </p>
          </div>

          {/* Quick Toolbar Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setCreateModalOpen(true)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)'
              }}
            >
              <Plus size={16} /> + Add Session
            </button>

            <button
              onClick={() => setNaturalLangModalOpen(true)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                background: isLight ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.2)',
                border: isLight ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid rgba(168, 85, 247, 0.4)',
                color: isLight ? '#7e22ce' : '#c084fc',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={16} /> Tell Sage (NLP)
            </button>

            <button
              onClick={handleOptimizePlan}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                background: isLight ? 'rgba(240, 246, 255, 0.95)' : 'rgba(30, 41, 59, 0.85)',
                border: isLight ? '1px solid rgba(2, 132, 199, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
                color: isLight ? '#0284c7' : '#38bdf8',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={16} /> Optimize My Plan
            </button>

            <button
              onClick={handleExportICal}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: isLight ? 'rgba(240, 246, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)',
                border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.15)',
                color: isLight ? '#334155' : '#cbd5e1',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={15} /> Export iCal
            </button>
          </div>
        </div>

        {/* 2. PROMINENT PLANNER MODE SWITCHER & OWNERSHIP PRINCIPLE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginTop: '24px', paddingTop: '18px', borderTop: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isLight ? 'rgba(235, 243, 255, 0.9)' : 'rgba(5, 8, 20, 0.7)', padding: '5px', borderRadius: '14px', border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap', maxWidth: '100%' }}>
            <button
              type="button"
              onClick={() => handleModeSwitch('ai')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                background: plannerMode === 'ai' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
                color: plannerMode === 'ai' ? '#ffffff' : (isLight ? '#475569' : '#cbd5e1'),
                border: plannerMode === 'ai' ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid transparent',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: plannerMode === 'ai' ? '0 0 16px rgba(6, 182, 212, 0.4)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <Bot size={14} color={plannerMode === 'ai' ? '#ffffff' : '#06b6d4'} /> PLAN WITH SAGE AI
            </button>

            <button
              type="button"
              onClick={() => handleModeSwitch('manual')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                background: plannerMode === 'manual' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
                color: plannerMode === 'manual' ? '#ffffff' : (isLight ? '#475569' : '#cbd5e1'),
                border: plannerMode === 'manual' ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid transparent',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: plannerMode === 'manual' ? '0 0 16px rgba(6, 182, 212, 0.4)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <User size={14} color={plannerMode === 'manual' ? '#ffffff' : '#38bdf8'} /> PLAN MYSELF
            </button>

            <button
              type="button"
              onClick={() => handleModeSwitch('hybrid')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                background: plannerMode === 'hybrid' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'transparent',
                color: plannerMode === 'hybrid' ? '#ffffff' : (isLight ? '#475569' : '#cbd5e1'),
                border: plannerMode === 'hybrid' ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid transparent',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: plannerMode === 'hybrid' ? '0 0 16px rgba(168, 85, 247, 0.4)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <Sparkles size={14} color={plannerMode === 'hybrid' ? '#ffffff' : '#a855f7'} /> SAGE + ME (HYBRID)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isLight ? 'rgba(2, 132, 199, 0.1)' : 'rgba(56, 189, 248, 0.1)', padding: '6px 14px', borderRadius: '12px', border: isLight ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid rgba(56, 189, 248, 0.25)', color: isLight ? '#0284c7' : '#38bdf8', fontSize: '0.78rem' }}>
            <ShieldCheck size={16} />
            <span><strong>Plan Ownership:</strong> You are in control. Sage only suggests changes unless you approve them.</span>
          </div>
        </div>
      </div>

      {/* 3. EXAM COUNTDOWN & BUDGET TOP METRICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Exam Countdown Card */}
        <div style={{
          position: 'relative',
          background: isLight 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(240, 246, 255, 0.88) 100%)' 
            : 'linear-gradient(135deg, rgba(15, 20, 48, 0.90) 0%, rgba(10, 14, 36, 0.95) 100%)',
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '24px',
          padding: '24px',
          color: isLight ? '#0f172a' : '#fff',
          backdropFilter: 'blur(20px)',
          boxShadow: isLight 
            ? '0 12px 32px rgba(180, 200, 230, 0.3)' 
            : '0 20px 45px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Glow */}
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '50%', filter: 'blur(24px)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', position: 'relative', zIndex: 2 }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800 }}>TARGET EXAM</span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>CBSE Board Exam 2027</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: isLight ? '#0284c7' : '#06b6d4' }}>164 DAYS</div>
              <span style={{ fontSize: '0.72rem', color: isLight ? '#52668a' : '#94a3b8' }}>Target: {plan.targetScore || '85%'}</span>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center', background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(5, 8, 20, 0.6)', padding: '12px', borderRadius: '14px', border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)', position: 'relative', zIndex: 2 }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: isLight ? '#52668a' : '#94a3b8' }}>SYLLABUS</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8' }}>
                {progress?.learning > 0 ? `${progress.learning}%` : '0%'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: isLight ? '#52668a' : '#94a3b8' }}>PRACTICE</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: isLight ? '#059669' : '#34d399' }}>
                {progress?.practice > 0 ? `${progress.practice}%` : '0%'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: isLight ? '#52668a' : '#94a3b8' }}>REVISION</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: isLight ? '#7e22ce' : '#c084fc' }}>
                {progress?.assignments > 0 ? `${progress.assignments}%` : '0%'}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Study Budget Card */}
        <div style={{
          position: 'relative',
          background: isLight 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(240, 246, 255, 0.88) 100%)' 
            : 'linear-gradient(135deg, rgba(15, 20, 48, 0.90) 0%, rgba(10, 14, 36, 0.95) 100%)',
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '24px',
          padding: '24px',
          color: isLight ? '#0f172a' : '#fff',
          backdropFilter: 'blur(20px)',
          boxShadow: isLight 
            ? '0 12px 32px rgba(180, 200, 230, 0.3)' 
            : '0 20px 45px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Glow */}
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'rgba(52, 211, 153, 0.15)', borderRadius: '50%', filter: 'blur(24px)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', position: 'relative', zIndex: 2 }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800 }}>STUDY BUDGET</span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>Weekly Hours Allocated</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: isLight ? '#059669' : '#34d399' }}>{weeklyStats.completedHours} / {weeklyStats.totalHours}h</div>
              <span style={{ fontSize: '0.72rem', color: isLight ? '#52668a' : '#94a3b8' }}>{weeklyStats.percentage}% Completed</span>
            </div>
          </div>

          <ProgressBar progress={weeklyStats.percentage} color="var(--accent-green)" />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '0.78rem', color: isLight ? '#52668a' : '#94a3b8', position: 'relative', zIndex: 2 }}>
            <span>Remaining: {(weeklyStats.totalHours - weeklyStats.completedHours).toFixed(1)}h</span>
            <button onClick={() => setSageWizardOpen(true)} style={{ background: 'none', border: 'none', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800, cursor: 'pointer' }}>
              Re-budget Hours →
            </button>
          </div>
        </div>

        {/* Study Streak Card */}
        <div style={{
          position: 'relative',
          background: isLight 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(240, 246, 255, 0.88) 100%)' 
            : 'linear-gradient(135deg, rgba(15, 20, 48, 0.90) 0%, rgba(10, 14, 36, 0.95) 100%)',
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '24px',
          padding: '24px',
          color: isLight ? '#0f172a' : '#fff',
          backdropFilter: 'blur(20px)',
          boxShadow: isLight 
            ? '0 12px 32px rgba(180, 200, 230, 0.3)' 
            : '0 20px 45px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Glow */}
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '50%', filter: 'blur(24px)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', position: 'relative', zIndex: 2 }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 800 }}>CONSISTENCY</span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px', color: isLight ? '#0f172a' : '#ffffff' }}>
                <Flame size={20} color="#f59e0b" /> {weeklyStats.streakDays} Day Streak
              </h3>
            </div>
            <span style={{ background: isLight ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.2)', color: isLight ? '#d97706' : '#fbbf24', fontSize: '0.76rem', padding: '4px 10px', borderRadius: '10px', fontWeight: 800 }}>
              +{weeklyStats.earnedXP} XP
            </span>
          </div>

          {/* Weekly Consistency Indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-around', background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(5, 8, 20, 0.6)', padding: '10px', borderRadius: '14px', border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)', position: 'relative', zIndex: 2 }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => {
              const isDayCompleted = sessions.some(s => s.day === d && s.status === 'Completed');
              return (
                <div key={d} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: isLight ? '#52668a' : '#94a3b8' }}>{d}</span>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: isDayCompleted ? '#10b981' : (isLight ? 'rgba(203, 213, 225, 0.5)' : 'rgba(255,255,255,0.1)'), color: isDayCompleted ? '#fff' : (isLight ? '#64748b' : '#fff'), fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {isDayCompleted ? '✓' : '○'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. TODAY'S EXECUTION COMMAND CENTER */}
      <TodayCommandCenter
        weeklyProgress={weeklyStats}
        todaysFocus={todaysFocus}
        onStartSession={handleOpenFocus}
        onAskSage={handleAskSageForFocus}
        onOpenMaterials={handleOpenDetail}
        onWhatShouldIStudyNow={() => studyPlannerService.getWhatShouldIStudyNow()}
      />

      {/* 5. INTERACTIVE VISUAL WEEKLY CALENDAR */}
      <WeeklyPlannerCalendar
        sessions={sessions}
        onSelectSession={handleOpenDetail}
        onCompleteSession={handleMarkComplete}
        onRescheduleSession={(sId, day) => studyPlannerService.rescheduleSession(sId, day)}
        onDeleteSession={handleDeleteSession}
        onDuplicateSession={handleDuplicateSession}
        onAddSessionClick={() => setCreateModalOpen(true)}
      />

      {/* 6. INTELLIGENCE WIDGETS ROW (Plan Health + Revision Radar) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        <PlanHealthWidget onBalancePlan={handleOptimizePlan} />
        <RevisionRadarWidget onStartRevision={(item) => {
          openAIChat();
          sendMessage(`Give me a 15-minute quick revision guide and 3 practice questions on ${item.topic} in ${item.subject}.`);
        }} />
      </div>

      {/* MODALS */}
      <CreateStudySessionModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onAddSession={handleAddManualSession}
      />

      <SagePlanBuilderModal
        isOpen={sageWizardOpen}
        onClose={() => setSageWizardOpen(false)}
        onGenerate={handleGenerateAIPlan}
      />

      <HybridPlanOptimizerModal
        isOpen={hybridOptimizerOpen}
        onClose={() => setHybridOptimizerOpen(false)}
        suggestions={suggestions}
        onAcceptSuggestion={(sug) => {
          if (sug.actionType === 'add_break') {
            studyPlannerService.addSession({
              subjectName: 'Cognitive Break',
              topic: '10-Minute Rest & Hydration',
              durationMinutes: 10,
              studyType: 'Break',
              priority: 'Low',
              source: 'hybrid'
            });
          }
        }}
      />

      <NaturalLanguagePlanModal
        isOpen={naturalLangModalOpen}
        onClose={() => setNaturalLangModalOpen(false)}
        onApplyProposedPlan={() => {
          setSessions([...studyPlannerService.getSessions()]);
        }}
      />

      {activeFocusSession && (
        <FocusStudyModal
          isOpen={focusModalOpen}
          onClose={() => setFocusModalOpen(false)}
          session={activeFocusSession}
          onSessionCompleted={(sId) => {
            handleMarkComplete(sId);
          }}
        />
      )}

      {activeDetailSession && (
        <SessionDetailModal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          session={activeDetailSession}
          onStartFocus={handleOpenFocus}
          onReschedule={(sId, newDay) => {
            studyPlannerService.rescheduleSession(sId, newDay);
            setDetailModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default StudyPlannerPage;
