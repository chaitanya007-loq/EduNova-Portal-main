import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldCheck,
  Clock,
  BookOpen,
  Award,
  Flame,
  Calendar,
  Bell,
  LogOut,
  ArrowLeft,
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  AlertCircle,
  FileText,
  CheckCircle2,
  ExternalLink,
  User,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { EduNovaHeroBanner } from '../../components/common/EduNovaHeroBanner';
import parentCompanionService from '../../services/parentCompanionService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const ParentDashboardPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [data] = useState(parentCompanionService.getParentDashboardData());
  const [selectedSubject, setSelectedSubject] = useState(null);

  const chatEndRef = useRef(null);
  const aiSectionRef = useRef(null);

  const {
    companion,
    childProfile,
    studentName,
    studentUsername,
    classLevel,
    board,
    today,
    subjects,
    assignments,
    testsAndExams,
    revisionRadar,
    consistency,
    weeklySummary,
    sageInsight,
    healthScore
  } = data;

  const parentName = companion?.parentName || user?.name || 'Parent / Guardian';

  // Parent Sage AI Chat State
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${parentName}! I am Parent Sage AI. Ask me anything about ${studentName}'s learning progress, study habits, test prep, or areas where you can offer support!`
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Auto-scroll chat window to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const quickActionPrompts = [
    { label: 'How is my child doing?', text: `How is ${studentName} doing overall?` },
    { label: 'What should I support?', text: `What topics or subjects should I help ${studentName} with?` },
    { label: 'Weekly Summary', text: `Give me a weekly study summary for ${studentName}.` },
    { label: 'Upcoming Tests', text: `What tests or exams are coming up soon?` },
    { label: 'Pending Assignments', text: `Are there any pending assignments due soon?` }
  ];

  const scrollToAiSection = () => {
    aiSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendPrompt = (promptText) => {
    const query = promptText || inputMsg;
    if (!query.trim()) return;

    const userText = query.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');
    setIsAiTyping(true);

    setTimeout(() => {
      let replyText = '';
      const q = userText.toLowerCase();

      if (q.includes('doing') || q.includes('overall') || q.includes('how is')) {
        replyText = `${studentName} is performing strongly with an overall ${healthScore}/100 Learning Health Score!\n\nKey Metrics:\n• Active Study Time (Week): ${weeklySummary.totalTime}\n• Quiz Accuracy: ${today.quizAccuracy}\n• Lessons Completed Today: ${today.lessonsCompleted}\n• Learning Streak: 🔥 ${today.streakDays} Days active`;
      } else if (q.includes('support') || q.includes('help') || q.includes('weak') || q.includes('topic')) {
        const topicsList = revisionRadar.map(r => `• ${r.subject}: ${r.topic} (${r.reason})`).join('\n');
        replyText = `Recommended Support Areas for ${studentName}:\n${topicsList}\n\nParent Advice: A 15–20 minute practice session on Snell's law or map marking over the weekend will help solidify understanding!`;
      } else if (q.includes('weekly') || q.includes('summary') || q.includes('report')) {
        replyText = `Weekly Learning Summary for ${studentName}:\n• Total Study Hours: ${weeklySummary.totalTime}\n• Active Days: ${weeklySummary.activeDays} / 7 Days\n• Sessions Finished: ${weeklySummary.plannedVsCompleted}\n• Primary Focus: ${childProfile.currentFocus}`;
      } else if (q.includes('test') || q.includes('exam') || q.includes('quiz')) {
        const upcomingList = testsAndExams.upcoming.map(t => `• ${t.title} (${t.date}) — ${t.prepProgress}% Prepared`).join('\n');
        const completedList = testsAndExams.completed.map(t => `• ${t.title}: Score ${t.score} (${t.accuracy})`).join('\n');
        replyText = `Upcoming Exams:\n${upcomingList}\n\nRecent Results:\n${completedList}`;
      } else if (q.includes('assignment') || q.includes('homework') || q.includes('due')) {
        const pendList = assignments.pending.map(a => `• ${a.title} (Subject: ${a.subject}, Due: ${a.dueDate})`).join('\n');
        replyText = `Pending Assignments (${assignments.pending.length}):\n${pendList}\n\nCompleted assignments are all scored above 90%.`;
      } else if (q.includes('physics') || q.includes('science') || q.includes('math') || q.includes('social')) {
        const matchedSub = subjects.find(s => q.includes(s.name.toLowerCase()) || q.includes(s.id.toLowerCase()));
        if (matchedSub) {
          replyText = `${studentName}'s performance in ${matchedSub.name}:\n• Overall Progress: ${matchedSub.progress}%\n• Quiz Accuracy: ${matchedSub.accuracy}%\n• Completed Topics: ${matchedSub.topicsCompleted}/${matchedSub.totalTopics}\n• Target Area: ${matchedSub.weakTopic}`;
        } else {
          replyText = `Subject Breakdown for ${studentName}:\n` + subjects.map(s => `• ${s.name}: ${s.progress}% progress (${s.accuracy}% accuracy)`).join('\n');
        }
      } else {
        replyText = `Verified learning overview for ${studentName} (${classLevel} • ${board}):\n• Learning Health: ${healthScore}/100\n• Today's Study Time: ${today.studyTime}\n• Active Streak: 🔥 ${today.streakDays} Days\n• Lessons Done Today: ${today.lessonsCompleted}\n\nYou can ask me specific questions about subject grades, upcoming exams, or study tips!`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: replyText }]);
      setIsAiTyping(false);
    }, 550);
  };

  const handleParentLogout = async () => {
    await logout();
    navigate('/parent-login');
  };

  // Glass Container Common Styling
  const glassCardStyle = {
    background: isLight
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 246, 255, 0.88) 100%)'
      : 'linear-gradient(135deg, rgba(25, 35, 75, 0.75) 0%, rgba(15, 20, 48, 0.88) 100%)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.16)',
    borderRadius: '24px',
    boxShadow: isLight
      ? '0 16px 45px rgba(64, 100, 160, 0.12), inset 0 1.5px 2px rgba(255, 255, 255, 1)'
      : '0 16px 45px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
    transition: 'all 0.25s ease'
  };

  return (
    <div style={{ padding: '24px 0 60px', minHeight: '100vh' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* 1. PARENT PORTAL HEADER BANNER */}
        <EduNovaHeroBanner
          badge={`✦ EduNova Parent Companion • Tracking @${studentUsername}`}
          title={`Good Morning, ${parentName} 👋`}
          subtitle={`Monitoring learning performance, study streak, and academic progress for ${studentName} (${classLevel} • ${board}).`}
          stats={[
            { label: `${healthScore}/100`, subtext: 'Health Score', icon: ShieldCheck, color: '#10b981' },
            { label: today.studyTime, subtext: 'Study Today', icon: Clock, color: '#22d3ee' },
            { label: '3', subtext: 'Learning Goals', isPill: true }
          ]}
        />

        {/* TOP CONTROLS BAR */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '-8px' }}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            style={{
              background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)',
              border: isLight ? '1px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.18)',
              color: isLight ? '#0f172a' : '#ffffff',
              fontWeight: 700
            }}
          >
            <LayoutDashboard size={14} /> Student View
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/parent-login')}
            style={{
              background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)',
              border: isLight ? '1px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.18)',
              color: isLight ? '#0f172a' : '#ffffff',
              fontWeight: 700
            }}
          >
            <ArrowLeft size={14} /> Switch Student
          </Button>

          <Button
            size="sm"
            onClick={handleParentLogout}
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              color: isLight ? '#e11d48' : '#fb7185',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              fontWeight: 700
            }}
          >
            <LogOut size={14} /> Logout
          </Button>
        </div>

        {/* PRIVACY ASSURANCE FIREWALL BANNER */}
        <div style={{
          ...glassCardStyle,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(236, 253, 245, 0.92) 0%, rgba(209, 250, 229, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(6, 78, 59, 0.35) 0%, rgba(4, 47, 38, 0.45) 100%)',
          border: isLight ? '1.5px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(16, 185, 129, 0.3)',
          color: isLight ? '#065f46' : '#a7f3d0'
        }}>
          <ShieldCheck size={22} color="#10b981" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.84rem', lineHeight: 1.4 }}>
            <strong style={{ color: isLight ? '#047857' : '#34d399', fontWeight: 800 }}>Student Privacy Shield Active:</strong> Student private chat history, notes, and peer communications remain 100% private. Parent Dashboard displays educational performance and progress metrics only.
          </span>
        </div>

        {/* 2. CORE KEY METRICS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
          <div style={{ ...glassCardStyle, padding: '20px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#0284c7' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Learning Health
            </span>
            <strong style={{ display: 'block', fontSize: '1.85rem', color: '#10b981', marginTop: '4px', fontWeight: 900 }}>
              {healthScore} <span style={{ fontSize: '1rem', color: isLight ? '#64748b' : '#94a3b8', fontWeight: 700 }}>/ 100</span>
            </strong>
          </div>

          <div style={{ ...glassCardStyle, padding: '20px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#0284c7' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Study Time Today
            </span>
            <strong style={{ display: 'block', fontSize: '1.85rem', color: isLight ? '#0284c7' : '#38bdf8', marginTop: '4px', fontWeight: 900 }}>
              {today.studyTime}
            </strong>
          </div>

          <div style={{ ...glassCardStyle, padding: '20px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#0284c7' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quiz Accuracy
            </span>
            <strong style={{ display: 'block', fontSize: '1.85rem', color: '#10b981', marginTop: '4px', fontWeight: 900 }}>
              {today.quizAccuracy}
            </strong>
          </div>

          <div style={{ ...glassCardStyle, padding: '20px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#0284c7' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Learning Streak
            </span>
            <strong style={{ display: 'block', fontSize: '1.85rem', color: '#f59e0b', marginTop: '4px', fontWeight: 900 }}>
              🔥 {today.streakDays}d
            </strong>
          </div>

          <div style={{ ...glassCardStyle, padding: '20px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#0284c7' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lessons Done
            </span>
            <strong style={{ display: 'block', fontSize: '1.85rem', color: '#a855f7', marginTop: '4px', fontWeight: 900 }}>
              {today.lessonsCompleted}
            </strong>
          </div>
        </div>

        {/* 3. PARENT QUICK ACTION CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <button
            onClick={() => { scrollToAiSection(); handleSendPrompt(`How is ${studentName} doing overall?`); }}
            style={{
              ...glassCardStyle,
              padding: '18px 22px',
              background: isLight
                ? 'linear-gradient(135deg, rgba(224, 242, 254, 0.95), rgba(219, 234, 254, 0.95))'
                : 'linear-gradient(135deg, rgba(14, 116, 144, 0.25), rgba(30, 58, 138, 0.35))',
              border: isLight ? '1.5px solid rgba(2, 132, 199, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div>
              <strong style={{ display: 'block', fontSize: '1.05rem', color: isLight ? '#0369a1' : '#38bdf8', fontWeight: 800 }}>
                ⚡ How Is My Child Doing?
              </strong>
              <span style={{ fontSize: '0.8rem', color: isLight ? '#334155' : '#cbd5e1', marginTop: '2px', display: 'block' }}>
                Instant Parent Sage AI academic report
              </span>
            </div>
            <Sparkles size={24} color={isLight ? '#0284c7' : '#38bdf8'} />
          </button>

          <button
            onClick={() => { scrollToAiSection(); handleSendPrompt(`What should I support for ${studentName}?`); }}
            style={{
              ...glassCardStyle,
              padding: '18px 22px',
              background: isLight
                ? 'linear-gradient(135deg, rgba(209, 250, 229, 0.95), rgba(224, 242, 254, 0.95))'
                : 'linear-gradient(135deg, rgba(6, 95, 70, 0.3), rgba(14, 116, 144, 0.3))',
              border: isLight ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(52, 211, 153, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div>
              <strong style={{ display: 'block', fontSize: '1.05rem', color: isLight ? '#047857' : '#34d399', fontWeight: 800 }}>
                🤝 What Should I Support?
              </strong>
              <span style={{ fontSize: '0.8rem', color: isLight ? '#334155' : '#cbd5e1', marginTop: '2px', display: 'block' }}>
                Targeted guidance for upcoming concepts
              </span>
            </div>
            <HeartHandshake size={24} color={isLight ? '#059669' : '#34d399'} />
          </button>
        </div>

        {/* 4. SAGE INSIGHT BANNER */}
        <div style={{
          ...glassCardStyle,
          padding: '22px 26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '18px',
          flexWrap: 'wrap',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(238, 242, 255, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: isLight ? '1.5px solid rgba(99, 102, 241, 0.35)' : '1px solid rgba(129, 140, 248, 0.3)'
        }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Bot size={20} color={isLight ? '#4f46e5' : '#818cf8'} />
              <strong style={{ color: isLight ? '#3730a3' : '#a5b4fc', fontSize: '1rem', fontWeight: 800 }}>
                Sage AI Daily Insight
              </strong>
            </div>
            <p style={{ fontSize: '0.92rem', color: isLight ? '#1e293b' : '#e2e8f0', margin: 0, lineHeight: 1.55 }}>
              {sageInsight}
            </p>
          </div>
          <Button
            size="sm"
            onClick={scrollToAiSection}
            style={{
              background: isLight ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'linear-gradient(135deg, #38bdf8, #6366f1)',
              color: '#ffffff',
              fontWeight: 800
            }}
          >
            Ask Parent Sage AI
          </Button>
        </div>

        {/* 5. SUBJECT PERFORMANCE & REVISION RADAR */}
        <div style={{ ...glassCardStyle, padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 900,
              color: isLight ? '#0f172a' : '#ffffff',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-heading)'
            }}>
              <BookOpen size={20} color={isLight ? '#0284c7' : '#38bdf8'} /> Subject Progress & Performance
            </h3>
            <span style={{ fontSize: '0.8rem', color: isLight ? '#0284c7' : '#94a3b8', fontWeight: 700 }}>
              Click any subject card to view detailed analytics
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '18px' }}>
            {subjects.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedSubject(sub)}
                style={{
                  padding: '20px',
                  borderRadius: '20px',
                  background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.05)',
                  border: isLight ? '1px solid rgba(210, 225, 245, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: isLight ? '0 8px 25px rgba(64, 100, 160, 0.08)' : '0 8px 25px rgba(0, 0, 0, 0.25)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1.08rem', color: isLight ? '#0f172a' : '#ffffff', fontWeight: 800 }}>
                    {sub.name}
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 800, background: isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '8px' }}>
                    {sub.weekChange}
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: isLight ? '#475569' : '#cbd5e1', marginBottom: '6px' }}>
                    <span>Progress: <strong>{sub.progress}%</strong></span>
                    <span>Accuracy: <strong>{sub.accuracy}%</strong></span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: isLight ? 'rgba(200, 215, 235, 0.5)' : 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${sub.progress}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7, #6366f1, #10b981)', borderRadius: '4px' }} />
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : '#94a3b8', display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <span>Completed: {sub.topicsCompleted}/{sub.totalTopics} topics</span>
                  <span>Study Time: {sub.studyTimeHours}</span>
                </div>
              </div>
            ))}
          </div>

          {/* REVISION ALERTS SECTION */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: isLight ? '1px solid rgba(210, 225, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
            <strong style={{ fontSize: '0.96rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontWeight: 800 }}>
              <AlertCircle size={18} color="#f59e0b" /> Topics Recommended for Revision Support
            </strong>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {revisionRadar.map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '16px',
                    background: isLight ? 'rgba(254, 243, 199, 0.8)' : 'rgba(245, 158, 11, 0.12)',
                    border: isLight ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <strong style={{ display: 'block', color: isLight ? '#92400e' : '#fbbf24', fontSize: '0.92rem', fontWeight: 800 }}>
                    {r.topic}
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: isLight ? '#78350f' : '#cbd5e1', marginTop: '2px', display: 'block' }}>
                    Subject: {r.subject} • {r.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. UPCOMING TESTS & PENDING ASSIGNMENTS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          
          {/* UPCOMING EXAMS */}
          <div style={{ ...glassCardStyle, padding: '24px' }}>
            <strong style={{ fontSize: '1.08rem', color: isLight ? '#0f172a' : '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontWeight: 800 }}>
              <Calendar size={20} color={isLight ? '#0284c7' : '#38bdf8'} /> Upcoming Tests & Exams
            </strong>
            {testsAndExams.upcoming.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)',
                  marginBottom: '12px',
                  border: isLight ? '1px solid rgba(210, 225, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', marginBottom: '6px' }}>
                  <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{t.title}</strong>
                  <span style={{ color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800 }}>{t.date}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subject: {t.subject}</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>{t.prepProgress}% Prepared</span>
                </div>
              </div>
            ))}
          </div>

          {/* PENDING ASSIGNMENTS */}
          <div style={{ ...glassCardStyle, padding: '24px' }}>
            <strong style={{ fontSize: '1.08rem', color: isLight ? '#0f172a' : '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontWeight: 800 }}>
              <FileText size={20} color="#fb7185" /> Pending Assignments ({assignments.pending.length})
            </strong>
            {assignments.pending.map((a) => (
              <div
                key={a.id}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)',
                  marginBottom: '12px',
                  border: isLight ? '1px solid rgba(210, 225, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', marginBottom: '6px' }}>
                  <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{a.title}</strong>
                  <span style={{ color: '#fb7185', fontWeight: 800 }}>{a.dueDate}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subject: {a.subject}</span>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>Priority: {a.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. 7-DAY CONSISTENCY CALENDAR */}
        <div style={{ ...glassCardStyle, padding: '24px' }}>
          <strong style={{ fontSize: '1.08rem', color: isLight ? '#0f172a' : '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontWeight: 800 }}>
            <Clock size={20} color="#10b981" /> 7-Day Study Consistency
          </strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
            {consistency.map((day, idx) => (
              <div
                key={idx}
                style={{
                  background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '14px 8px',
                  borderRadius: '16px',
                  border: isLight ? '1px solid rgba(210, 225, 245, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : '#94a3b8', display: 'block', fontWeight: 700 }}>
                  {day.dayLabel}
                </span>
                <strong style={{ fontSize: '0.92rem', color: day.isActive ? '#10b981' : (isLight ? '#94a3b8' : '#64748b'), display: 'block', margin: '6px 0' }}>
                  {day.minutes > 0 ? `${day.minutes}m` : 'Rest'}
                </strong>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: day.isActive ? '#10b981' : (isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)'), margin: '0 auto' }} />
              </div>
            ))}
          </div>
        </div>

        {/* 8. PARENT SAGE AI ASSISTANT (EMBEDDED) */}
        <div
          ref={aiSectionRef}
          id="parent-sage-ai-section"
          style={{
            ...glassCardStyle,
            padding: '28px',
            border: isLight ? '1.5px solid rgba(2, 132, 199, 0.35)' : '1px solid rgba(56, 189, 248, 0.35)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '16px',
              background: isLight ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.2), rgba(124, 58, 237, 0.2))' : 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={26} color={isLight ? '#0284c7' : '#38bdf8'} />
            </div>
            <div>
              <strong style={{ fontSize: '1.2rem', color: isLight ? '#0f172a' : '#ffffff', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                Parent Sage AI Companion
              </strong>
              <span style={{ fontSize: '0.82rem', color: isLight ? '#475569' : '#94a3b8', display: 'block', marginTop: '2px' }}>
                Ask questions about {studentName}'s studies, homework, or guidance
              </span>
            </div>
          </div>

          {/* Quick Chips */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {quickActionPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(q.text)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)',
                    border: isLight ? '1px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)',
                    color: isLight ? '#0f172a' : '#e2e8f0',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: 700,
                    transition: 'all 0.2s ease'
                  }}
                >
                  ⚡ {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Window */}
          <div style={{
            background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 20, 48, 0.6)',
            borderRadius: '20px',
            border: isLight ? '1px solid rgba(210, 225, 245, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
            padding: '20px',
            minHeight: '220px',
            maxHeight: '340px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '18px'
          }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: m.sender === 'user'
                    ? (isLight ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'linear-gradient(135deg, #4f46e5, #6366f1)')
                    : (isLight ? 'rgba(240, 246, 255, 0.95)' : 'rgba(255, 255, 255, 0.08)'),
                  color: m.sender === 'user' ? '#ffffff' : (isLight ? '#0f172a' : '#ffffff'),
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                  boxShadow: m.sender === 'user' ? '0 4px 15px rgba(2, 132, 199, 0.3)' : 'none'
                }}
              >
                {m.text}
              </div>
            ))}
            {isAiTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isLight ? '#0284c7' : '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>
                <Bot size={18} />
                <span>Parent Sage AI is preparing student report...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder={`Ask Parent Sage AI about ${studentName}'s learning...`}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '16px',
                background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                border: isLight ? '1.5px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <Button
              onClick={() => handleSendPrompt()}
              style={{
                background: isLight ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
                color: '#ffffff',
                fontWeight: 800,
                padding: '0 22px',
                borderRadius: '16px'
              }}
            >
              <Send size={16} /> Send
            </Button>
          </div>
        </div>

        {/* SUBJECT DETAIL MODAL */}
        {selectedSubject && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}>
            <div style={{
              ...glassCardStyle,
              padding: '28px',
              maxWidth: '520px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.25rem', color: isLight ? '#0f172a' : '#ffffff', fontWeight: 900 }}>
                  {selectedSubject.name} Analytics
                </strong>
                <Button size="xs" variant="outline" onClick={() => setSelectedSubject(null)}>Close</Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: isLight ? '#64748b' : '#94a3b8' }}>Overall Progress:</span>
                  <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>{selectedSubject.progress}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: isLight ? '#64748b' : '#94a3b8' }}>Quiz Accuracy:</span>
                  <strong style={{ color: '#10b981' }}>{selectedSubject.accuracy}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: isLight ? '#64748b' : '#94a3b8' }}>Topics Completed:</span>
                  <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{selectedSubject.topicsCompleted} / {selectedSubject.totalTopics}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: isLight ? '#64748b' : '#94a3b8' }}>Study Time:</span>
                  <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{selectedSubject.studyTimeHours}</strong>
                </div>
              </div>

              <div style={{
                background: isLight ? 'rgba(254, 243, 199, 0.8)' : 'rgba(245, 158, 11, 0.12)',
                padding: '14px 18px',
                borderRadius: '16px',
                border: isLight ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <strong style={{ fontSize: '0.86rem', color: isLight ? '#92400e' : '#fbbf24', display: 'block', marginBottom: '4px', fontWeight: 800 }}>
                  Recommended Revision Focus:
                </strong>
                <span style={{ fontSize: '0.84rem', color: isLight ? '#78350f' : '#cbd5e1' }}>
                  {selectedSubject.weakTopic}
                </span>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  setSelectedSubject(null);
                  scrollToAiSection();
                  handleSendPrompt(`Tell me more about ${selectedSubject.name} progress for ${studentName}`);
                }}
                style={{
                  background: isLight ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  color: '#ffffff',
                  fontWeight: 800
                }}
              >
                Ask Parent Sage AI About {selectedSubject.name}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ParentDashboardPage;
