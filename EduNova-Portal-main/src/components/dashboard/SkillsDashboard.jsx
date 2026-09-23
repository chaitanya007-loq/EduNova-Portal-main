import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Rocket, ArrowRight, Brain, Sparkles, BookOpen, Flame, Clock, Award } from 'lucide-react';
import { Button } from '../common/Button';
import { analyticsApi, subjectApi } from '../../lib/apiClient';
import { MySubjectsWidget } from './MySubjectsWidget';
import { DashboardNotesWidget } from './widgets/DashboardNotesWidget';

export const SkillsDashboard = ({ learner }) => {
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
            const skillsSubs = (subjectsRes.value.data || []).filter(s => {
              const type = (s.subject?.educationType || s.educationType || '').toLowerCase();
              return !type || type === 'skills';
            });
            setSubjects(skillsSubs);
          }
        }
      } catch (err) {
        console.warn('Failed to load skills dashboard analytics:', err.message);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(34, 211, 238, 0.15))',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
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
            <span className="cyber-badge-cyan">Skills Track</span>
            <span className="cyber-badge-amber">🔥 {streakDays} Day Streak</span>
            <span className="cyber-badge-purple">Lvl {level} • {xp} XP</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Welcome back, {userName} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', margin: '4px 0 0' }}>
            Master tech, design, and practical industry skills.
          </p>
        </div>

        <Button onClick={() => navigate('/skill-exchange')}>
          Explore Peer Skill Swap <Sparkles size={16} />
        </Button>
      </div>

      {/* 2. Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* Left Column (8 Cols) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }} className="col-span-12">
          
          {/* Active Skill Tracks Widget */}
          <MySubjectsWidget trackType="skills" customSubjects={subjects} title="My Skill Tracks" />
        </div>

        {/* Right Column (4 Cols) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }} className="col-span-12">
          
          {/* Quick Notes & Annotations Widget */}
          <DashboardNotesWidget />

          {/* AI Mentor Insight */}
          <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(34, 211, 238, 0.12))', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(139, 92, 246, 0.25)', backdropFilter: 'blur(18px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6', fontWeight: 800, fontSize: '0.92rem', marginBottom: '8px' }}>
              <Brain size={18} /> Sage AI Skill Mentor
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '14px' }}>
              Ask Sage AI to evaluate your code, generate practice exercises, or create a custom skill roadmap.
            </p>
            <Button size="sm" onClick={() => navigate('/ai-assistant')} style={{ width: '100%' }}>
              Consult Sage AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsDashboard;

