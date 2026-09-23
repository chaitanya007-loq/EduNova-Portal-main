import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, AlertCircle, Glasses, ArrowRight, Brain, Flame, Clock, Award, Target, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { analyticsApi, subjectApi } from '../../lib/apiClient';
import { MySubjectsWidget } from './MySubjectsWidget';
import { DashboardNotesWidget } from './widgets/DashboardNotesWidget';
import { useDynamicGreeting } from '../../hooks/useDynamicGreeting';

export const SchoolDashboard = ({ learner }) => {
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
            const schoolSubs = (subjectsRes.value.data || []).filter(s => {
              const type = (s.subject?.educationType || s.educationType || '').toLowerCase();
              return !type || type === 'school';
            });
            setSubjects(schoolSubs);
          }
        }
      } catch (err) {
        console.warn('Failed to load school dashboard analytics:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const streakDays = overview?.learner?.streakDays ?? learner?.streakDays ?? 0;
  const level = overview?.learner?.level ?? learner?.level ?? 1;
  const xp = overview?.learner?.xp ?? learner?.xp ?? 0;
  const board = learner?.education?.board || learner?.board || 'School';
  const userName = learner?.name?.split(' ')[0] || 'Learner';
  const dynamicGreeting = useDynamicGreeting(userName);

  const completedHours = overview?.studyHours?.completedHours || 0;
  const plannedHours = overview?.studyHours?.plannedHours || 0;
  const overallAccuracy = overview?.assessmentSummary?.overallAccuracy || '0%';
  const weakItems = overview?.revisionRadar?.items || [];
  const curriculum = overview?.curriculumProgress || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.15))',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        padding: '28px 32px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        backdropFilter: 'blur(18px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="cyber-badge-cyan">{board} Education</span>
            <span className="cyber-badge-amber">🔥 {streakDays} Day Streak</span>
            <span className="cyber-badge-purple">Lvl {level} • {xp} XP</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            {dynamicGreeting.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', margin: '4px 0 0' }}>
            {dynamicGreeting.subtitle}
          </p>
        </div>

        <Button onClick={() => navigate('/ai-assistant')}>
          Consult Sage AI Tutor <Brain size={16} />
        </Button>
      </div>

      {/* 2. Key Metrics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        padding: '20px',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(255, 255, 255, 0.045)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(18px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} color="#22D3EE" />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Study Time</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#F8FAFC' }}>{completedHours}h completed</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={20} color="#10B981" />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Quiz Accuracy</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#10B981' }}>{overallAccuracy}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={20} color="#F59E0B" />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Streak</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#F59E0B' }}>{streakDays} Days</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={20} color="#8B5CF6" />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Level & XP</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#8B5CF6' }}>Lvl {level} ({xp} XP)</div>
          </div>
        </div>
      </div>

      {/* 3. Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* Left Column (8 Cols) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }} className="col-span-12">
          
          {/* Enrolled Subjects & Syllabus Progress Widget */}
          <MySubjectsWidget trackType="school" customSubjects={subjects} />

          {/* Interactive AR/VR Immersive Science Modules */}
          <div style={{ background: 'rgba(255, 255, 255, 0.045)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.10)', backdropFilter: 'blur(18px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Glasses size={20} color="#22D3EE" /> 3D AR Interactive Learning Modules
              </h3>
              <Button size="sm" variant="outline" onClick={() => navigate('/xr-studio')}>
                Launch XR Studio
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {[
                { title: '🫀 Human Biology', sub: '3D Anatomical Models', route: '/xr-studio' },
                { title: '🪐 Solar Astronomy', sub: 'Planetary Orbits & Gravity', route: '/immersive-lab' },
                { title: '⚡ Physics Circuits', sub: 'Resistors & Ohm\'s Law', route: '/immersive-lab' }
              ].map(ar => (
                <div
                  key={ar.title}
                  onClick={() => navigate(ar.route)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.98rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{ar.title}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ar.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }} className="col-span-12">
          
          {/* Quick Notes & Annotations Widget */}
          <DashboardNotesWidget />

          {/* Study Goal Progress Widget */}
          <div style={{ background: 'rgba(255, 255, 255, 0.045)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.10)', textAlign: 'center', backdropFilter: 'blur(18px)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Total Study Hours Logged</h4>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {completedHours}h <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>completed</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              {plannedHours > 0 ? `${plannedHours}h planned in your study sessions.` : 'Schedule study sessions to build your daily streak.'}
            </p>
            <Button size="sm" onClick={() => navigate('/study-planner')} style={{ width: '100%', marginTop: '12px' }}>
              Open Study Planner
            </Button>
          </div>

          {/* AI Weak Topics Alert */}
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '20px', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F43F5E', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px' }}>
              <AlertCircle size={18} /> Sage Weak Topic Insights
            </div>
            {weakItems.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                No weak topics flagged yet! Take quizzes to build AI accuracy insights.
              </p>
            ) : (
              <>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                  Sage identified low quiz accuracy in:
                </p>
                <ul style={{ fontSize: '0.82rem', color: 'var(--text-primary)', paddingLeft: '20px', marginBottom: '14px' }}>
                  {weakItems.slice(0, 3).map((item, i) => (
                    <li key={i}>{item.topic} ({item.recentAccuracy})</li>
                  ))}
                </ul>
              </>
            )}
            <Button size="sm" onClick={() => navigate('/ai-assistant')} style={{ width: '100%' }}>
              Practice Weak Topics with Sage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard;

