import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Clock, AlertTriangle, Brain, BarChart2, BookOpen, Flame, Award } from 'lucide-react';
import { Button } from '../common/Button';
import { analyticsApi, subjectApi } from '../../lib/apiClient';
import { MySubjectsWidget } from './MySubjectsWidget';
import { DashboardNotesWidget } from './widgets/DashboardNotesWidget';

export const ExamDashboard = ({ learner }) => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [overviewRes, subjectsRes] = await Promise.allSettled([
          analyticsApi.getOverview(),
          subjectApi.getEnrolledSubjects(),
        ]);

        if (isMounted) {
          if (overviewRes.status === 'fulfilled' && overviewRes.value?.success) {
            setOverview(overviewRes.value.data);
          }
          if (subjectsRes.status === 'fulfilled' && subjectsRes.value?.success) {
            const examSubs = (subjectsRes.value.data || []).filter(s => {
              const type = (s.subject?.educationType || s.educationType || '').toLowerCase();
              return !type || type === 'exam';
            });
            setSubjects(examSubs);
          }
        }
      } catch (err) {
        console.warn('Failed to load exam dashboard analytics:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const userName = learner?.name?.split(' ')[0] || 'Learner';
  const streakDays = overview?.learner?.streakDays ?? learner?.streakDays ?? 0;
  const level = overview?.learner?.level ?? learner?.level ?? 1;
  const xp = overview?.learner?.xp ?? learner?.xp ?? 0;

  const completedHours = overview?.studyHours?.completedHours || 0;
  const overallAccuracy = overview?.assessmentSummary?.overallAccuracy || '0%';
  const weakItems = overview?.revisionRadar?.items || [];
  const subjectMastery = overview?.assessmentSummary?.subjectMastery || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Exam Countdown Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(99, 102, 241, 0.15))',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        padding: '28px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        backdropFilter: 'blur(18px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="cyber-badge-amber">Competitive Exam Track</span>
            <span className="cyber-badge-cyan">🔥 {streakDays} Day Streak</span>
            <span className="cyber-badge-purple">Lvl {level} • {xp} XP</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Welcome back, {userName} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', margin: '4px 0 0' }}>
            Targeted preparation for competitive exam success.
          </p>
        </div>

        <Button onClick={() => navigate('/ai-assistant')}>
          Consult AI Exam Coach <Brain size={16} />
        </Button>
      </div>

      {/* 2. Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* Left Column (8 Cols) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }} className="col-span-12">
          
          {/* Subject Performance & Accuracy Widget */}
          <MySubjectsWidget trackType="exam" customSubjects={subjects} title="Exam Subject Performance" />
        </div>

        {/* Right Column (4 Cols) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }} className="col-span-12">
          
          {/* Quick Notes & Annotations Widget */}
          <DashboardNotesWidget />

          {/* Weak Topics Identification */}
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '20px', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(245, 158, 11, 0.3)', backdropFilter: 'blur(18px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px' }}>
              <AlertTriangle size={18} /> High Error Rate Topics
            </div>
            {weakItems.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 12px' }}>
                No weak topics detected yet! Complete practice quizzes to identify error patterns.
              </p>
            ) : (
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-primary)', paddingLeft: '18px', margin: '0 0 12px' }}>
                {weakItems.slice(0, 3).map((item, idx) => (
                  <li key={idx}>{item.topic} ({item.recentAccuracy} accuracy)</li>
                ))}
              </ul>
            )}
            <Button size="sm" onClick={() => navigate('/ai-assistant')} style={{ width: '100%' }}>
              Review Weak Topics with Sage
            </Button>
          </div>

          {/* AI Exam Coach Insight */}
          <div style={{ background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.12), rgba(139, 92, 246, 0.12))', padding: '20px', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(34, 211, 238, 0.25)', backdropFilter: 'blur(18px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22D3EE', fontWeight: 800, fontSize: '0.88rem', marginBottom: '8px' }}>
              <Brain size={18} /> Sage Exam Coach
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              "Consistent practice in your weak areas will directly improve your accuracy and exam speed."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDashboard;

