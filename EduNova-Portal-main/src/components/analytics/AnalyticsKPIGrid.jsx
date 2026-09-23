import React from 'react';
import {
  TrendingUp,
  Zap,
  Target,
  Clock,
  Award,
  CheckCircle,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AnalyticsKPIGrid = ({ kpiData }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!kpiData || !kpiData.hasData) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)',
        borderRadius: '20px',
        border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isLight ? '0 10px 30px rgba(37, 99, 235, 0.06)' : 'none'
      }}>
        <BookOpen size={32} color={isLight ? '#0284c7' : '#06b6d4'} style={{ margin: '0 auto 10px auto' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff' }}>Not enough data yet</h3>
        <p style={{ color: isLight ? '#475569' : '#94a3b8', fontSize: '0.85rem' }}>Complete your first study session or quiz to unlock live KPIs.</p>
        <button className="se-btn se-btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', marginTop: '10px' }}>
          Start First Learning Session
        </button>
      </div>
    );
  }

  const cards = [
    {
      title: 'Overall Learning Progress',
      value: `${kpiData.overallProgress}%`,
      badge: kpiData.overallProgressChange,
      icon: TrendingUp,
      color: isLight ? '#0284c7' : '#06b6d4'
    },
    {
      title: 'Learning Consistency',
      value: `${kpiData.consistency}%`,
      badge: `${kpiData.consistencyStreak} day streak 🔥`,
      icon: Zap,
      color: isLight ? '#d97706' : '#fbbf24'
    },
    {
      title: 'Quiz Accuracy',
      value: `${kpiData.accuracy}%`,
      badge: kpiData.accuracyChange,
      icon: Target,
      color: '#10b981'
    },
    {
      title: 'Topics Mastered',
      value: `${kpiData.topicsMastered} / ${kpiData.totalTopics}`,
      badge: 'High Mastery',
      icon: CheckCircle,
      color: '#6366f1'
    },
    {
      title: 'Study Hours',
      value: `${kpiData.studyHours} hrs`,
      badge: 'On Target',
      icon: Clock,
      color: isLight ? '#0284c7' : '#38bdf8'
    },
    {
      title: 'XP Earned',
      value: kpiData.xpEarned,
      badge: 'Level Up Near',
      icon: Award,
      color: isLight ? '#7c3aed' : '#a855f7'
    },
    {
      title: 'Exam Readiness',
      value: `${kpiData.examReadiness}%`,
      badge: 'Target 85%',
      icon: Target,
      color: isLight ? '#7c3aed' : '#c084fc'
    },
    {
      title: 'Weak Topics',
      value: `${kpiData.weakTopicsCount} topics`,
      badge: 'Action Needed',
      icon: AlertTriangle,
      color: '#f43f5e'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
      {cards.map((c, i) => {
        const IconComponent = c.icon;
        return (
          <div
            key={i}
            style={{
              padding: '16px',
              borderRadius: '20px',
              background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)',
              border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: isLight ? '0 8px 25px rgba(37, 99, 235, 0.06)' : '0 8px 25px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#475569' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {c.title}
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconComponent size={16} color={c.color} />
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: isLight ? '#18345F' : '#fff', margin: 0, lineHeight: 1.1 }}>
                {c.value}
              </h3>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: c.color, marginTop: '6px', display: 'inline-block' }}>
                {c.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
