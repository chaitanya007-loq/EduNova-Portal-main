import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Flame,
  Target,
  ArrowRight,
  ArrowUpRight,
  Play,
  MoreVertical,
  Calendar,
  BarChart2,
  Atom,
  FlaskConical,
  BookMarked,
  ChevronRight,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Dna,
  Users,
  Check,
  Award,
  Zap,
  Brain,
  Layers,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLearner } from '../../context/LearnerContext';
import { useLearning } from '../../context/LearningContext';
import { useSubjects } from '../../hooks/useSubjects';
import { useTheme } from '../../context/ThemeContext';
import { GlobalSearchInput } from '../common/GlobalSearchInput';
import { EduNovaHeroBanner } from '../common/EduNovaHeroBanner';
import { universalSubjects } from '../../data/subjects';
import { SubjectCard } from '../subjects/SubjectCard';
import { InteractiveQuiz } from '../subjects/InteractiveQuiz';
import { CreateCurriculumModal } from '../courses/CreateCurriculumModal';
import { curriculumService } from '../../services/curriculumService';
import { MySubjectsWidget } from './MySubjectsWidget';
import { NotesWidget } from '../notes/NotesWidget';
import { useUserProgress } from '../../hooks/useUserProgress';
import { getDynamicAvatar } from '../../utils/avatarUtils';
import { progressService } from '../../services/progressService';
import { useDynamicGreeting } from '../../hooks/useDynamicGreeting';

export const EduNovaPixelPerfectDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { learner, switchLearnerType, switchDemoProfile } = useLearner() || {};
  const { xp: learningXp, level: learningLevel, streakDays: learningStreak, earnXp } = useLearning() || {};
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  // Dynamic User Progress state (0% baseline for new users, updates as user learns, practices, submits assignments)
  const {
    progress: userProgress,
    learning: dynamicLearning,
    practice: dynamicPractice,
    assignments: dynamicAssignments,
    attendance: dynamicAttendance,
    recordLearning,
    recordAttendance
  } = useUserProgress();

  // State re-render trigger for dynamic subject & curriculum updates
  const [, setCurriculumTick] = useState(0);

  useEffect(() => {
    const handleCurriculumUpdate = () => setCurriculumTick(prev => prev + 1);
    window.addEventListener('edunova_curriculum_updated', handleCurriculumUpdate);
    window.addEventListener('edunova_subject_updated', handleCurriculumUpdate);
    return () => {
      window.removeEventListener('edunova_curriculum_updated', handleCurriculumUpdate);
      window.removeEventListener('edunova_subject_updated', handleCurriculumUpdate);
    };
  }, []);

  // Sync attendance with active streak
  useEffect(() => {
    if (typeof learningStreak === 'number') {
      progressService.recordAttendance(user?.id || user?.email, learningStreak);
    }
  }, [learningStreak, user?.id, user?.email]);

  // Helper for circular gauge SVG strokeDashoffset calculation (r=22 -> circumference ≈ 138)
  const getGaugeOffset = (pct) => {
    const safePct = Math.min(100, Math.max(0, Number(pct) || 0));
    return Math.round(138 - (138 * safePct / 100));
  };

  // Active track state (defaults to student's profile learnerType)
  const initialTrack = (learner?.learnerType || user?.learnerType || 'school').toLowerCase();
  const [activeTrackTab, setActiveTrackTab] = useState(initialTrack);
  const [activeQuizModal, setActiveQuizModal] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
          explanation: 'Conservation and equilibrium laws form the bedrock of fundamental problem-solving.',
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


  // Dynamically filter subjects according to active track tab & custom user curriculums
  const trackSubjects = curriculumService.getCurriculumSubjects({ learnerType: activeTrackTab, userProgress });

  const displaySubjects = trackSubjects.length > 0
    ? trackSubjects
    : (Array.isArray(selectedSubjects) && selectedSubjects.length > 0 ? selectedSubjects : universalSubjects.slice(0, 4));

  const activeSubject = displaySubjects[0] || null;
  const isSubjectInProgress = Boolean(activeSubject && typeof activeSubject.progress === 'number' && activeSubject.progress > 0);

  const trackCourses = {
    school: {
      title: 'Trigonometric Identities',
      subtitle: 'Mathematics • Class 10 CBSE',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80',
      progress: 83,
      lessonsDone: 5,
      totalLessons: 6,
      isContinue: true
    },
    college: {
      title: 'Binary Tree & AVL Rotations',
      subtitle: 'Data Structures • B.Tech CSE',
      image: 'https://images.unsplash.com/photo-1516116211223-4258568e1040?auto=format&fit=crop&w=300&q=80',
      progress: 66,
      lessonsDone: 4,
      totalLessons: 6,
      isContinue: true
    },
    exam: {
      title: 'Data Interpretation & Logical Caselets',
      subtitle: 'Quantitative Aptitude • CMAT 2026',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80',
      progress: 50,
      lessonsDone: 3,
      totalLessons: 6,
      isContinue: true
    },
    skills: {
      title: 'React 19 Server Components & Redux',
      subtitle: 'Full Stack Development',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80',
      progress: 83,
      lessonsDone: 5,
      totalLessons: 6,
      isContinue: true
    }
  };

  const activeCourse = trackCourses[activeTrackTab] || trackCourses.school;

  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  // Header Dropdown Interactive States
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(4);
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      title: 'Sage AI Personalized Hint',
      message: 'Physics: You solved 3 mechanics problems today! Keep going.',
      time: '10 min ago',
      unread: true,
      accent: '#38bdf8'
    },
    {
      id: 2,
      title: 'Upcoming Quiz: Chemistry',
      message: 'Chapter 4 Organic Chemistry quiz starts at 4:00 PM.',
      time: '45 min ago',
      unread: true,
      accent: '#a855f7'
    },
    {
      id: 3,
      title: 'Streak Master Level 4',
      message: 'Congratulations! You unlocked a 7-day learning streak.',
      time: '2 hours ago',
      unread: true,
      accent: '#f59e0b'
    },
    {
      id: 4,
      title: 'Peer Skill Session Invite',
      message: 'Arjun requested a Python code review session.',
      time: '5 hours ago',
      unread: true,
      accent: '#ec4899'
    }
  ]);

  const headerControlsRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerControlsRef.current && !headerControlsRef.current.contains(event.target)) {
        setShowNotificationsMenu(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotificationsList(prev => prev.map(item => ({ ...item, unread: false })));
    setUnreadCount(0);
  };

  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      if (logout) await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    }
  };

  const userName = learner?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Learner';
  const fullName = learner?.name || user?.name || 'EduNova Learner';
  const dynamicGreeting = useDynamicGreeting(userName);
  const userAvatar = getDynamicAvatar(user || learner, fullName);
  const xp = learner?.xp ?? learningXp ?? user?.xp ?? 0;
  const level = learner?.level ?? learningLevel ?? user?.level ?? 1;
  const streak = learner?.streakDays ?? learningStreak ?? user?.streakDays ?? 0;
  const goalsCount = Array.isArray(learner?.goals) ? learner.goals.length : 0;
  const [logNotice, setLogNotice] = useState('');

  const studyMins = userProgress?.studyMinutes || 0;
  const targetMins = 60;
  const dailyTargetPct = Math.min(100, Math.round((studyMins / targetMins) * 100));

  const getLearnerRank = (xpVal) => {
    if (xpVal >= 5000) return 'Top 5% Learner Rank';
    if (xpVal >= 2000) return 'Top 15% Learner Rank';
    if (xpVal >= 500) return 'Silver Learner Rank';
    if (xpVal >= 100) return 'Bronze Learner Rank';
    return 'Starter Learner Rank';
  };

  const handleLogStudySession = async () => {
    try {
      if (earnXp) {
        await earnXp(50, 'Logged Daily Study Session', 'Study');
      }
      if (recordLearning) {
        recordLearning(15);
      }
      if (recordAttendance) {
        recordAttendance(Math.max(1, streak));
      }
      setLogNotice('🎉 +50 XP Earned! 15 Mins Study Session Logged.');
      setTimeout(() => setLogNotice(''), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromptClick = (text) => {
    navigate('/ai-assistant', { state: { initialPrompt: text } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 4px 40px 4px' }}>
      
      {/* DASHBOARD MAIN GRID */}
      <div className="edunova-responsive-dashboard-grid">
        
        {/* LEFT & CENTER COLUMN (MAIN CONTENT) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* A. HERO WELCOME BANNER WITH 3D GLASS ORB */}
          <EduNovaHeroBanner
            title={dynamicGreeting.title}
            subtitle={dynamicGreeting.subtitle}
            stats={[
              { label: `Level ${level}`, subtext: `${xp} / ${level * 500} XP`, icon: BookOpen, color: '#2dd4bf', iconBg: 'rgba(20, 184, 166, 0.25)', progress: Math.min(100, (xp / (level * 500)) * 100) },
              { label: `${streak}`, subtext: 'Day Streak', icon: Flame, color: '#f59e0b', iconBg: 'rgba(245, 158, 11, 0.25)' },
              { label: `${goalsCount}`, subtext: 'Learning Goals', isPill: true }
            ]}
          />

          {/* Quick Action Shortcuts Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            overflowX: 'auto',
            padding: '12px 18px',
            borderRadius: '20px',
            background: isLight ? 'rgba(255, 255, 255, 0.82)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.65) 0%, rgba(18, 25, 60, 0.78) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.20)',
            boxShadow: isLight ? '0 10px 30px rgba(100, 130, 200, 0.12)' : '0 10px 30px rgba(0, 0, 0, 0.35)'
          }}>
            {[
              { label: 'Take AI Quiz', icon: Target, color: '#06b6d4', action: () => handlePromptClick('Generate a 5-question diagnostic quiz') },
              { label: 'Peer Skill Swap', icon: Users, color: '#a855f7', action: () => navigate('/skill-exchange') },
              { label: 'Launch 3D XR Lab', icon: Atom, color: '#38bdf8', action: () => navigate('/xr-studio') },
              { label: 'AI Study Planner', icon: Calendar, color: '#34d399', action: () => navigate('/study-planner') },
              { label: 'Knowledge Map', icon: Dna, color: '#f59e0b', action: () => navigate('/constellation') }
            ].map((act) => {
              const IconComponent = act.icon;
              return (
                <button
                  key={act.label}
                  onClick={act.action}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(255, 255, 255, 0.06)',
                    border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)',
                    color: isLight ? '#18345F' : '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <IconComponent size={15} color={act.color} />
                  {act.label}
                </button>
              );
            })}
          </div>

          {/* My Subjects Widget Matching Reference Design */}
          <MySubjectsWidget trackType={activeTrackTab} customSubjects={displaySubjects} />


          {/* C. TRACK-SPECIFIC COMMAND CENTER CARD ("add more requirement on dashboard") */}
          {activeTrackTab === 'school' && (
            <div style={{
              borderRadius: '24px',
              background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
              backdropFilter: 'blur(28px)',
              border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(34, 211, 238, 0.35)',
              padding: '22px',
              boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(34, 211, 238, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={20} color="#22d3ee" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', margin: 0 }}>
                      CBSE Class 10 Board Exam Command Center
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: isLight ? '#5D7192' : '#94a3b8' }}>Target: 95%+ in Board Examinations 2026</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#e11d48', fontWeight: 800, background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.35)', padding: '4px 12px', borderRadius: '9999px' }}>
                  ⏳ 142 Days Remaining
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>Syllabus Coverage</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem', color: '#0284c7', margin: '4px 0' }}>{(dynamicLearning || 0).toFixed(1)}% Complete</strong>
                  <div style={{ width: '100%', height: '5px', background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, dynamicLearning || 0)}%`, height: '100%', background: '#38bdf8', transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>Daily Bounty Quest</span>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: '#059669', margin: '4px 0' }}>{userProgress?.completedLessons || 0} / 3 Tasks Solved</strong>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8' }}>{userProgress?.completedLessons > 0 ? `+${(userProgress?.completedLessons || 0) * 50} XP Claimed` : 'Complete 1 lesson to claim bonus'}</span>
                </div>

                <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>NCERT Solutions</span>
                  <button onClick={() => navigate('/my-subjects')} style={{ width: '100%', marginTop: '6px', padding: '7px 12px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#4f46e5', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                    📘 Practice NCERT Exemplars
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTrackTab === 'college' && (
            <div style={{
              borderRadius: '24px',
              background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
              backdropFilter: 'blur(28px)',
              border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(168, 85, 247, 0.35)',
              padding: '22px',
              boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Atom size={20} color="#a855f7" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', margin: 0 }}>
                      B.Tech Computer Science – Semester 5 Command Center
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: isLight ? '#5D7192' : '#94a3b8' }}>Target: 8.8 SGPA • Mid-Term Exams Prep</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 800, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', padding: '4px 12px', borderRadius: '9999px' }}>
                  Target: 8.8 SGPA
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>Lab Practicals</span>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: '#7c3aed', margin: '4px 0' }}>{userProgress?.completedQuizzes || 0} / 5 Labs Submitted</strong>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8' }}>{userProgress?.completedQuizzes > 0 ? 'Interactive Labs Logged' : '0 Labs Completed Yet'}</span>
                </div>

                <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>Attendance Tracker</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem', color: '#059669', margin: '4px 0' }}>{(dynamicAttendance || 0).toFixed(1)}% Logged</strong>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8' }}>{dynamicAttendance >= 75 ? 'Safe (Req: 75%)' : 'Log daily attendance'}</span>
                </div>

                <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>Lab Sandbox</span>
                  <button onClick={() => navigate('/xr-studio')} style={{ width: '100%', marginTop: '6px', padding: '7px 12px', borderRadius: '10px', background: 'linear-gradient(135deg, #06b6d4, #6366f1)', color: '#ffffff', fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    ⚡ Launch SQL & Process Simulator
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTrackTab === 'exam' && (
            <div style={{
              borderRadius: '24px',
              background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
              backdropFilter: 'blur(28px)',
              border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(245, 158, 11, 0.35)',
              padding: '22px',
              boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={20} color="#f59e0b" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', margin: 0 }}>
                      CMAT 2026 Target Speed & Accuracy Radar
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: isLight ? '#5D7192' : '#94a3b8' }}>Target: 99.4 Percentile • Speed Drill Engine</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 800, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '4px 12px', borderRadius: '9999px' }}>
                  Goal: 99.4%ile
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>Solving Speed</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem', color: '#d97706', margin: '4px 0' }}>{userProgress?.completedQuizzes > 0 ? '42 sec / Question' : '0 sec (No Quizzes)'}</strong>
                  <span style={{ fontSize: '0.72rem', color: '#059669' }}>{userProgress?.completedQuizzes > 0 ? '⚡ Dynamic drill active' : 'Complete quizzes to test speed'}</span>
                </div>

                <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>Accuracy Rate</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem', color: '#059669', margin: '4px 0' }}>{userProgress?.completedQuizzes > 0 ? `${Math.round(dynamicPractice || 85)}% Overall` : '0.0% Overall'}</strong>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8' }}>{userProgress?.completedQuizzes > 0 ? 'High accuracy in DI & Quant' : 'Take a practice quiz to set score'}</span>
                </div>

                <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>Timed Sectional Test</span>
                  <button onClick={() => navigate('/ai-assistant', { state: { initialPrompt: 'Launch a 15-question timed Quant speed test' } })} style={{ width: '100%', marginTop: '6px', padding: '7px 12px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #ec4899)', color: '#ffffff', fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    🎯 Start 15-Min Mock Test
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTrackTab === 'skills' && (
            <div style={{
              borderRadius: '24px',
              background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
              backdropFilter: 'blur(28px)',
              border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(56, 189, 248, 0.35)',
              padding: '22px',
              boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Dna size={20} color="#38bdf8" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', margin: 0 }}>
                      Full Stack & Skill DNA Career Command Center
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: isLight ? '#5D7192' : '#94a3b8' }}>Industry Readiness Score: 88 / 100</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 800, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', padding: '4px 12px', borderRadius: '9999px' }}>
                  Readiness: 88/100
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>Peer Exchanges</span>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: '#0284c7', margin: '4px 0' }}>2 Active Code Reviews</strong>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8' }}>Python & React Swap</span>
                </div>

                <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>Portfolio Capstone</span>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: '#059669', margin: '4px 0' }}>85% Complete</strong>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8' }}>EduNova React Dashboard</span>
                </div>

                <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800 }}>Skill Swap Hub</span>
                  <button onClick={() => navigate('/skill-exchange')} style={{ width: '100%', marginTop: '6px', padding: '7px 12px', borderRadius: '10px', background: 'linear-gradient(135deg, #a855f7, #38bdf8)', color: '#ffffff', fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    🤝 Join Peer Skill Match
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* D. CONTINUE LEARNING VIDEO CARD */}
          <div style={{
            borderRadius: '24px',
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
            padding: '22px',
            boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: activeCourse.isContinue ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={16} color={activeCourse.isContinue ? '#6366f1' : '#10b981'} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  {activeCourse.isContinue ? 'Continue Learning' : 'Recommended For You'}
                </h3>
              </div>
              <button style={{ background: 'none', border: 'none', color: isLight ? '#5D7192' : '#94a3b8', cursor: 'pointer' }}>
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Video Lesson Banner */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Thumbnail Preview */}
                <div style={{
                  position: 'relative',
                  width: '110px',
                  height: '70px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <img
                    src={activeCourse.image}
                    alt={activeCourse.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 15px rgba(99, 102, 241, 0.6)'
                  }}>
                    <Play size={14} color="#ffffff" style={{ marginLeft: '2px' }} />
                  </div>
                </div>

                <div>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: isLight ? '#18345F' : '#ffffff', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' }} title={activeCourse.title}>
                    {activeCourse.title}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: isLight ? '#5D7192' : '#94a3b8', display: 'block', marginBottom: '10px' }}>{activeCourse.subtitle}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '140px', height: '5px', background: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.max(activeCourse.progress, activeCourse.isContinue ? 15 : 0)}%`, height: '100%', background: activeCourse.isContinue ? '#38bdf8' : '#34d399' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: isLight ? '#5D7192' : '#cbd5e1' }}>{activeCourse.lessonsDone} / {activeCourse.totalLessons} lessons</span>
                  </div>
                </div>
              </div>

              {/* Continue / Start Button */}
              <button
                onClick={() => navigate('/my-subjects')}
                style={{
                  padding: '11px 24px',
                  borderRadius: '9999px',
                  background: activeCourse.isContinue
                    ? 'linear-gradient(90deg, #36C7F4 0%, #4F8CFF 50%, #8B6CFF 100%)'
                    : 'linear-gradient(90deg, #06b6d4 0%, #10b981 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: activeCourse.isContinue
                    ? '0 6px 20px rgba(79, 140, 255, 0.35)'
                    : '0 6px 20px rgba(6, 182, 212, 0.4)'
                }}
              >
                {activeCourse.isContinue ? 'Continue' : 'Start Lesson'} <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* E. MY SMART NOTES DASHBOARD WIDGET */}
          <NotesWidget onOpenCreateModal={() => navigate('/notes')} />

          {/* F. SAGE AI WEAK TOPICS FOCUS RADAR */}
          <div style={{
            borderRadius: '24px',
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
            padding: '22px',
            boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={16} color="#f59e0b" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                    Sage AI Target Focus Radar
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: isLight ? '#5D7192' : '#94a3b8' }}>Targeted revision recommended for peak retention</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/ai-assistant')}
                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Open Sage AI <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {(
                {
                  school: [
                    { topic: 'Trigonometric Applications', subject: 'Mathematics', accuracy: '58%', color: '#fb7185' },
                    { topic: 'Refractive Index & Lens Formula', subject: 'Physics (Science)', accuracy: '64%', color: '#f59e0b' }
                  ],
                  college: [
                    { topic: 'BCNF Normalization & SQL Joins', subject: 'Database Management Systems', accuracy: '58%', color: '#fb7185' },
                    { topic: 'Process Deadlocks & Semaphores', subject: 'Operating Systems', accuracy: '64%', color: '#f59e0b' }
                  ],
                  exam: [
                    { topic: 'Time, Speed & Distance Drills', subject: 'Quantitative Aptitude', accuracy: '58%', color: '#fb7185' },
                    { topic: 'Syllogisms & Analytical Puzzles', subject: 'Logical Reasoning & DI', accuracy: '64%', color: '#f59e0b' }
                  ],
                  skills: [
                    { topic: 'Event Loop & Memory Leaks', subject: 'Node.js & Backend Systems', accuracy: '58%', color: '#fb7185' },
                    { topic: 'Redux Toolkit & State Tuning', subject: 'React Architecture & Frontend', accuracy: '64%', color: '#f59e0b' }
                  ]
                }[activeTrackTab] || [
                  { topic: 'Trigonometric Applications', subject: 'Mathematics', accuracy: '58%', color: '#fb7185' },
                  { topic: 'Refractive Index & Lens Formula', subject: 'Physics (Science)', accuracy: '64%', color: '#f59e0b' }
                ]
              ).map((item) => (
                <div
                  key={item.topic}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '16px',
                    background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.04)',
                    border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: item.color, fontWeight: 800, textTransform: 'uppercase' }}>Focus Required</span>
                      <span style={{ fontSize: '0.78rem', color: isLight ? '#18345F' : '#ffffff', fontWeight: 800, background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '999px' }}>{item.accuracy}</span>
                    </div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: isLight ? '#18345F' : '#ffffff', marginBottom: '2px' }}>{item.topic}</strong>
                    <span style={{ fontSize: '0.75rem', color: isLight ? '#5D7192' : '#94a3b8' }}>{item.subject}</span>
                  </div>

                  <button
                    onClick={() => handlePromptClick(`Generate a diagnostic quiz on ${item.topic} in ${item.subject}`)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '10px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.35)',
                      color: '#6366f1',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ✨ Practice Quiz with Sage AI
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (WIDGETS & SIDE PANELS) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* A. SAGE AI TUTOR CARD */}
          <div style={{
            borderRadius: '24px',
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
            padding: '18px 20px',
            boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} color="#ffffff" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.98rem', color: isLight ? '#18345F' : '#ffffff' }}>Sage AI Tutor</strong>
                  <span style={{ fontSize: '0.72rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} /> Online
                  </span>
                </div>
              </div>
              <ChevronRight size={18} color={isLight ? '#5D7192' : '#94a3b8'} style={{ cursor: 'pointer' }} onClick={() => navigate('/ai-assistant')} />
            </div>

            {/* AI Welcome Speech Bubble */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '16px',
              background: isLight ? 'rgba(235, 243, 255, 0.9)' : 'rgba(255, 255, 255, 0.06)',
              border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.84rem',
              color: isLight ? '#18345F' : '#f1f5f9',
              lineHeight: '1.4'
            }}>
              Hi {userName}! 👋<br />
              What would you like to learn today?
            </div>

            {/* Prompt Quick Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Explain this topic', 'Create study plan', 'Help with homework', 'Explore career options'].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '9999px',
                    background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.06)',
                    border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: isLight ? '#3B5998' : '#cbd5e1',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Sage AI Ask Input with Diagonal Arrow Circle Send */}
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePromptClick(aiPrompt)}
                placeholder="Ask anything..."
                style={{
                  width: '100%',
                  padding: '10px 46px 10px 16px',
                  borderRadius: '9999px',
                  background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)',
                  border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)',
                  color: isLight ? '#18345F' : '#ffffff',
                  fontSize: '0.82rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={() => handlePromptClick(aiPrompt)}
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)'
                }}
              >
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* B. TODAY'S SCHEDULE (MATCHING SCREENSHOT 2) */}
          <div style={{
            borderRadius: '24px',
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
            padding: '20px',
            boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(34, 211, 238, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={16} color="#22d3ee" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  Today's Schedule
                </h3>
              </div>
              <button
                onClick={() => navigate('/study-planner')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                View All <ArrowRight size={12} />
              </button>
            </div>

            {/* Schedule Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(
                {
                  school: [
                    { time: '09:00 AM', title: 'Mathematics – Trigonometry', color: '#38bdf8', status: 'Live Now', action: () => navigate('/my-subjects') },
                    { time: '11:00 AM', title: 'Physics (Science) – Optics', color: '#a855f7', status: 'Upcoming', action: () => handlePromptClick('Give me 5 physics numerical questions') },
                    { time: '02:00 PM', title: 'Study Planner Session', color: '#34d399', status: 'Scheduled', action: () => navigate('/study-planner') },
                    { time: '04:00 PM', title: 'Doubt Solving (Sage AI)', color: '#fbbf24', status: 'AI Session', action: () => navigate('/ai-assistant') }
                  ],
                  college: [
                    { time: '09:00 AM', title: 'Data Structures – AVL Trees', color: '#38bdf8', status: 'Live Now', action: () => navigate('/my-subjects') },
                    { time: '11:00 AM', title: 'Operating Systems – Semaphores', color: '#a855f7', status: 'Upcoming', action: () => handlePromptClick('Explain semaphores in OS') },
                    { time: '02:00 PM', title: 'DBMS SQL Joins Practice', color: '#34d399', status: 'Scheduled', action: () => navigate('/xr-studio') },
                    { time: '04:00 PM', title: 'Computer Networks Lab', color: '#fbbf24', status: 'AI Session', action: () => navigate('/ai-assistant') }
                  ],
                  exam: [
                    { time: '09:00 AM', title: 'Quant Aptitude – Speed Drill', color: '#38bdf8', status: 'Live Now', action: () => navigate('/my-subjects') },
                    { time: '11:00 AM', title: 'Logical Reasoning – Mock Test', color: '#a855f7', status: 'Upcoming', action: () => handlePromptClick('Give 5 logical reasoning questions') },
                    { time: '02:00 PM', title: 'Data Interpretation Caselets', color: '#34d399', status: 'Scheduled', action: () => navigate('/study-planner') },
                    { time: '04:00 PM', title: 'Verbal Ability – RC Practice', color: '#fbbf24', status: 'AI Session', action: () => navigate('/ai-assistant') }
                  ],
                  skills: [
                    { time: '09:00 AM', title: 'React 19 – Hooks & State Lab', color: '#38bdf8', status: 'Live Now', action: () => navigate('/my-subjects') },
                    { time: '11:00 AM', title: 'Node.js – Express Microservices', color: '#a855f7', status: 'Upcoming', action: () => handlePromptClick('How to optimize Express APIs') },
                    { time: '02:00 PM', title: 'PostgreSQL – Query Tuning', color: '#34d399', status: 'Scheduled', action: () => navigate('/xr-studio') },
                    { time: '04:00 PM', title: 'System Design Architecture', color: '#fbbf24', status: 'AI Session', action: () => navigate('/ai-assistant') }
                  ]
                }[activeTrackTab] || [
                  { time: '09:00 AM', title: 'Mathematics – Trigonometry', color: '#38bdf8', status: 'Live Now', action: () => navigate('/my-subjects') },
                  { time: '11:00 AM', title: 'Physics (Science) – Optics', color: '#a855f7', status: 'Upcoming', action: () => handlePromptClick('Give me 5 physics numerical questions') },
                  { time: '02:00 PM', title: 'Study Planner Session', color: '#34d399', status: 'Scheduled', action: () => navigate('/study-planner') },
                  { time: '04:00 PM', title: 'Doubt Solving (Sage AI)', color: '#fbbf24', status: 'AI Session', action: () => navigate('/ai-assistant') }
                ]
              ).map((sch) => (
                <div
                  key={sch.title}
                  onClick={sch.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '14px',
                    background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)',
                    border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isLight ? 'rgba(235, 243, 255, 0.9)' : 'rgba(255, 255, 255, 0.09)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <span style={{ color: isLight ? '#5D7192' : '#94a3b8', fontSize: '0.74rem', width: '65px', fontWeight: 600, flexShrink: 0 }}>{sch.time}</span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: sch.color, flexShrink: 0, boxShadow: `0 0 10px ${sch.color}` }} />
                    <span style={{ color: isLight ? '#18345F' : '#ffffff', fontWeight: 600, fontSize: '0.84rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sch.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '999px', background: `${sch.color}20`, color: isLight ? '#18345F' : sch.color, fontWeight: 700 }}>
                      {sch.status}
                    </span>
                    <ChevronRight size={14} color={isLight ? '#5D7192' : '#94a3b8'} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C. PROGRESS OVERVIEW (4 CIRCULAR SVG GAUGES) */}
          <div style={{
            borderRadius: '24px',
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(20, 26, 58, 0.75) 0%, rgba(12, 17, 40, 0.85) 100%)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
            padding: '20px',
            boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart2 size={16} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  Progress Overview
                </h3>
              </div>
              <button
                onClick={() => navigate('/analytics')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                View Details <ArrowRight size={12} />
              </button>
            </div>

            {/* 3 Circular Ring SVG Gauges Row (Attendance Removed as Requested) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
              
              {/* Ring 1: Dynamic Learning */}
              <div>
                <div style={{ position: 'relative', width: '56px', height: '56px', margin: '0 auto 6px auto' }}>
                  <svg width="56" height="56" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke={isLight ? 'rgba(210, 225, 250, 0.8)' : 'rgba(255,255,255,0.1)'} strokeWidth="5" />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="5"
                      strokeDasharray="138"
                      strokeDashoffset={getGaugeOffset(dynamicLearning)}
                      strokeLinecap="round"
                      transform="rotate(-90 28 28)"
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                  </svg>
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff' }}>
                    {dynamicLearning}%
                  </span>
                </div>
                <span style={{ fontSize: '0.68rem', color: isLight ? '#5D7192' : '#94a3b8' }}>Learning</span>
              </div>

              {/* Ring 2: Dynamic Practice */}
              <div>
                <div style={{ position: 'relative', width: '56px', height: '56px', margin: '0 auto 6px auto' }}>
                  <svg width="56" height="56" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke={isLight ? 'rgba(210, 225, 250, 0.8)' : 'rgba(255,255,255,0.1)'} strokeWidth="5" />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="5"
                      strokeDasharray="138"
                      strokeDashoffset={getGaugeOffset(dynamicPractice)}
                      strokeLinecap="round"
                      transform="rotate(-90 28 28)"
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                  </svg>
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff' }}>
                    {dynamicPractice}%
                  </span>
                </div>
                <span style={{ fontSize: '0.68rem', color: isLight ? '#5D7192' : '#94a3b8' }}>Practice</span>
              </div>

              {/* Ring 3: Dynamic Assignments */}
              <div>
                <div style={{ position: 'relative', width: '56px', height: '56px', margin: '0 auto 6px auto' }}>
                  <svg width="56" height="56" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke={isLight ? 'rgba(210, 225, 250, 0.8)' : 'rgba(255,255,255,0.1)'} strokeWidth="5" />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#fb923c"
                      strokeWidth="5"
                      strokeDasharray="138"
                      strokeDashoffset={getGaugeOffset(dynamicAssignments)}
                      strokeLinecap="round"
                      transform="rotate(-90 28 28)"
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                  </svg>
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff' }}>
                    {dynamicAssignments}%
                  </span>
                </div>
                <span style={{ fontSize: '0.68rem', color: isLight ? '#5D7192' : '#94a3b8' }}>Assignments</span>
              </div>
            </div>
          </div>

          {/* D. UPCOMING HOMEWORK & PRACTICE TASKS (TRACK-SPECIFIC) */}
          <div style={{
            borderRadius: '24px',
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(20, 26, 58, 0.75) 0%, rgba(12, 17, 40, 0.85) 100%)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
            padding: '20px',
            boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={16} color="#ef4444" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  Pending Tasks & Assignments
                </h3>
              </div>
              <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700 }}>
                {
                  { school: '3 Due', college: '4 Due', exam: '2 Due', skills: '3 Due' }[activeTrackTab] || '3 Due'
                }
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(
                {
                  school: [
                    { title: 'Physics Optics Lab Report', due: 'Tomorrow 5 PM', tag: 'High Priority', path: '/xr-studio', color: '#ef4444' },
                    { title: 'Calculus Definite Integration HW', due: 'In 2 days', tag: 'Homework', path: '/my-subjects', color: '#38bdf8' },
                    { title: 'Organic Chemistry Reactions Quiz', due: 'Friday', tag: 'Revision', path: '/ai-assistant', color: '#a855f7' }
                  ],
                  college: [
                    { title: 'Data Structures AVL Tree Code', due: 'Tonight 11:59 PM', tag: 'Urgent', path: '/my-subjects', color: '#ef4444' },
                    { title: 'DBMS 3NF Normalization Case Study', due: 'Tomorrow', tag: 'Project', path: '/my-subjects', color: '#38bdf8' },
                    { title: 'OS Semaphore Synchronization Lab', due: 'In 3 days', tag: 'XR Lab', path: '/xr-studio', color: '#10b981' }
                  ],
                  exam: [
                    { title: 'JEE Physics Mechanics Speed Test', due: 'Today 6 PM', tag: 'Mock Exam', path: '/my-subjects', color: '#ef4444' },
                    { title: 'Quant Aptitude 50-Question Drill', due: 'Tomorrow', tag: 'Practice', path: '/study-planner', color: '#f59e0b' }
                  ],
                  skills: [
                    { title: 'React 19 Custom Hooks Project', due: 'Tomorrow', tag: 'Coding Lab', path: '/my-subjects', color: '#38bdf8' },
                    { title: 'Node.js Express Microservice API', due: 'In 2 days', tag: 'Homework', path: '/my-subjects', color: '#a855f7' },
                    { title: 'System Design Architecture Notes', due: 'Friday', tag: 'Reading', path: '/constellation', color: '#10b981' }
                  ]
                }[activeTrackTab] || [
                  { title: 'Physics Optics Lab Report', due: 'Tomorrow 5 PM', tag: 'High Priority', path: '/xr-studio', color: '#ef4444' },
                  { title: 'Calculus Definite Integration HW', due: 'In 2 days', tag: 'Homework', path: '/my-subjects', color: '#38bdf8' }
                ]
              ).map((task, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(task.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '14px',
                    background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.04)',
                    border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isLight ? 'rgba(235, 243, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.04)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <CheckCircle2 size={16} color={task.color} style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: isLight ? '#18345F' : '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8' }}>
                        {task.due}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '999px', background: `${task.color}20`, color: isLight ? '#18345F' : task.color, fontWeight: 700, flexShrink: 0 }}>
                    {task.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* E. DAILY STUDY STREAK & XP LEADERBOARD CARD */}
          <div style={{
            borderRadius: '24px',
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.75) 0%, rgba(18, 25, 60, 0.85) 100%)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.14)',
            padding: '20px',
            boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={16} color="#f59e0b" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                    Study Streak & XP
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8' }}>
                    {getLearnerRank(xp)}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', padding: '4px 10px', borderRadius: '20px' }}>
                <Flame size={14} color="#f59e0b" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f59e0b' }}>{streak} {streak === 1 ? 'Day' : 'Days'}</span>
              </div>
            </div>

            {/* Daily Goal Bar */}
            <div style={{ background: isLight ? 'rgba(240, 246, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: isLight ? '#18345F' : '#e2e8f0', marginBottom: '6px' }}>
                <span>🎯 Daily Target: {studyMins} / 60 mins</span>
                <span style={{ color: '#10b981', fontWeight: 800 }}>{dailyTargetPct}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: isLight ? 'rgba(200, 215, 240, 0.6)' : 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                <div style={{ width: `${dailyTargetPct}%`, height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {logNotice && (
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', textAlign: 'center', marginBottom: '8px', padding: '4px', background: 'rgba(52, 211, 153, 0.12)', borderRadius: '8px' }}>
                {logNotice}
              </div>
            )}

            <button
              onClick={handleLogStudySession}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              <Zap size={14} /> Log Study Session (+50 XP)
            </button>
          </div>

          {/* F. PEER STUDY BUDDIES & SKILL MATCHES CARD */}
          <div style={{
            borderRadius: '24px',
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.14)',
            padding: '20px',
            boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={16} color="#06b6d4" />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  Active Study Partners
                </h3>
              </div>
              <button
                onClick={() => navigate('/skill-marketplace')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                Find More <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Aarav S.', topic: 'Calculus & Optics', match: '98% Match', color: '#10b981' },
                { name: 'Priya P.', topic: 'React 19 & Node.js', match: '95% Match', color: '#6366f1' },
                { name: 'Rohan G.', topic: 'DBMS & SQL Practice', match: '91% Match', color: '#06b6d4' }
              ].map((peer, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate('/skill-marketplace')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.04)',
                    border: isLight ? '1px solid rgba(220, 230, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.75rem' }}>
                      {peer.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: isLight ? '#18345F' : '#ffffff' }}>
                        {peer.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8' }}>
                        {peer.topic}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: peer.color, fontWeight: 700 }}>
                    {peer.match}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE QUIZ MODAL OVERLAY */}
      {activeQuizModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(8, 12, 28, 0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, rgba(20, 26, 58, 0.95) 0%, rgba(10, 14, 34, 0.98) 100%)',
            borderRadius: '28px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
            padding: '32px'
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

      {/* CREATE CURRICULUM MODAL */}
      <CreateCurriculumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCurriculumCreated={(newCurriculum) => {
          if (newCurriculum && newCurriculum.educationType) {
            setActiveTrackTab(newCurriculum.educationType);
          }
        }}
      />
    </div>
  );
};

export default EduNovaPixelPerfectDashboard;
