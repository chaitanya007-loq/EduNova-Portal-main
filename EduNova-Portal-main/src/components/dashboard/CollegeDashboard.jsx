import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDynamicGreeting } from '../../hooks/useDynamicGreeting';
import {
  GraduationCap,
  Rocket,
  ArrowRight,
  Brain,
  Flame,
  Clock,
  Award,
  Repeat,
  Play,
  Zap,
  BookOpen,
  Sparkles,
  Target,
  AlertCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import { analyticsApi, subjectApi } from '../../lib/apiClient';
import { MySubjectsWidget } from './MySubjectsWidget';
import { DashboardNotesWidget } from './widgets/DashboardNotesWidget';

export const CollegeDashboard = ({ learner }) => {
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
            const collegeSubs = (subjectsRes.value.data || []).filter(s => {
              const type = (s.subject?.educationType || s.educationType || '').toLowerCase();
              return !type || type === 'college';
            });
            setSubjects(collegeSubs);
          }
        }
      } catch (err) {
        console.warn('Failed to load college dashboard analytics:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const userName = learner?.name?.split(' ')[0] || 'Learner';
  const dynamicGreeting = useDynamicGreeting(userName);
  const degree = learner?.education?.degree || learner?.degree || 'College';
  const streakDays = overview?.learner?.streakDays ?? learner?.streakDays ?? 0;
  const level = overview?.learner?.level ?? learner?.level ?? 1;
  const xp = overview?.learner?.xp ?? learner?.xp ?? 0;

  const completedHours = overview?.studyHours?.completedHours || 0;
  const overallAccuracy = overview?.assessmentSummary?.overallAccuracy || '0%';
  const weakItems = overview?.revisionRadar?.items || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. WELCOME HERO SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(7, 11, 24, 0.95) 0%, rgba(13, 19, 38, 0.85) 100%)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(34, 211, 238, 0.25)',
        padding: '28px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="cyber-badge-cyan">{degree} Program</span>
            <span className="cyber-badge-amber">🔥 {streakDays} Day Streak</span>
            <span className="cyber-badge-purple">Lvl {level} • {xp} XP</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
            {dynamicGreeting.title}
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem', margin: '6px 0 0' }}>
            {dynamicGreeting.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
          <Button
            size="lg"
            onClick={() => navigate('/my-subjects')}
            style={{
              padding: '12px 24px',
              fontSize: '0.95rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #22D3EE, #8B5CF6)',
              boxShadow: '0 6px 20px rgba(34, 211, 238, 0.4)'
            }}
          >
            <BookOpen size={18} /> My Subjects
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/ai-assistant')}
            style={{ padding: '12px 20px', fontSize: '0.92rem' }}
          >
            <Brain size={18} color="#8B5CF6" /> Consult Sage AI
          </Button>
        </div>
      </div>

      {/* 2. PROGRESS METRICS BAR */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        padding: '20px',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(255, 255, 255, 0.045)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(18px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(34, 211, 238, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={20} color="#22D3EE" />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Enrolled Subjects</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#F8FAFC' }}>{subjects.length} Active</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={20} color="#F59E0B" />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Study Streak</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#F59E0B' }}>{streakDays} Days</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} color="#10B981" />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Study Time</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10B981' }}>{completedHours} hrs</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color="#8B5CF6" />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>XP & Level</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#8B5CF6' }}>Lvl {level} ({xp} XP)</div>
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        {/* Left Column (8 Cols) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }} className="col-span-12">
          
          {/* Active Enrolled College Subjects Widget */}
          <MySubjectsWidget trackType="college" customSubjects={subjects} title="Degree Core Subjects" />
        </div>

        {/* Right Column (4 Cols) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }} className="col-span-12">
          
          {/* Quick Notes & Annotations Widget */}
          <DashboardNotesWidget />

          {/* AI INSIGHTS CARD */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(34, 211, 238, 0.15))',
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(34, 211, 238, 0.35)',
            backdropFilter: 'blur(18px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22D3EE', fontWeight: 800, fontSize: '0.95rem', marginBottom: '14px' }}>
              <Brain size={20} color="#22D3EE" /> Sage AI Intelligence Insights
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem' }}>
              {weakItems.length === 0 ? (
                <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ color: '#94A3B8' }}>Take your first quiz or complete a study session to unlock Sage AI analysis.</span>
                </div>
              ) : (
                weakItems.slice(0, 2).map((item, idx) => (
                  <div key={idx} style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
                    <strong style={{ color: '#F43F5E', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <AlertCircle size={14} /> Weak Area: {item.topic}
                    </strong>
                    <span style={{ color: '#94A3B8' }}>{item.suggestedAction}</span>
                  </div>
                ))
              )}
            </div>

            <Button
              size="sm"
              onClick={() => navigate('/ai-assistant')}
              style={{ width: '100%', marginTop: '16px', background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)' }}
            >
              Ask Sage AI Tutor
            </Button>
          </div>

          {/* EduNova Skill Exchange Widget */}
          <div style={{ background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.12), rgba(139, 92, 246, 0.12))', padding: '20px', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(34, 211, 238, 0.25)', backdropFilter: 'blur(18px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22D3EE', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px' }}>
              <Repeat size={18} /> Peer Skill Exchange
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '12px' }}>
              Exchange knowledge with peers, offer your skills, or request mentorship.
            </p>
            <Button size="sm" onClick={() => navigate('/skill-exchange')} style={{ width: '100%' }}>
              Explore Peer Marketplace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard;

