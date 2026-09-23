import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp, TrendingDown, ArrowRight, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SubjectPerformanceMatrix = ({ subjectsData }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!subjectsData || subjectsData.length === 0) return null;

  return (
    <div style={{
      padding: '20px',
      borderRadius: '24px',
      background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)',
      border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: isLight ? '0 10px 30px rgba(37, 99, 235, 0.06)' : '0 10px 30px rgba(0,0,0,0.4)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="#6366f1" /> Subject Performance Matrix
          </h3>
          <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8' }}>
            Multi-dimensional evaluation: Mastery, Accuracy, Study Time & Trends
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        {subjectsData.map((s) => (
          <div
            key={s.id}
            onClick={() => navigate(`/subjects/${s.id}`)}
            style={{
              padding: '16px',
              borderRadius: '18px',
              background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814',
              border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#06b6d4'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = isLight ? 'rgba(226, 232, 240, 0.9)' : 'rgba(255, 255, 255, 0.1)'}
          >
            {/* Title Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                  {s.name}
                </h4>
                <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#64748b' }}>{s.code}</span>
              </div>
              <span style={{ padding: '3px 8px', borderRadius: '8px', background: s.isUp ? 'rgba(34, 197, 94, 0.15)' : 'rgba(244, 63, 94, 0.15)', color: s.isUp ? '#22c55e' : '#f43f5e', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                {s.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {s.trend}
              </span>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px', borderRadius: '12px', background: isLight ? 'rgba(240, 246, 255, 0.75)' : 'rgba(12, 16, 36, 0.8)', border: isLight ? '1px solid rgba(186, 230, 253, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: isLight ? '#475569' : '#94a3b8', display: 'block' }}>Mastery</span>
                <strong style={{ fontSize: '1rem', color: isLight ? '#0284c7' : '#38bdf8' }}>{s.mastery}%</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: isLight ? '#475569' : '#94a3b8', display: 'block' }}>Accuracy</span>
                <strong style={{ fontSize: '1rem', color: '#10b981' }}>{s.accuracy}%</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: isLight ? '#475569' : '#94a3b8', display: 'block' }}>Study Time</span>
                <strong style={{ fontSize: '0.9rem', color: isLight ? '#1e293b' : '#cbd5e1' }}>{s.studyHours}h</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: isLight ? '#475569' : '#94a3b8', display: 'block' }}>Last Activity</span>
                <strong style={{ fontSize: '0.78rem', color: isLight ? '#7c3aed' : '#a855f7' }}>{s.lastActivity}</strong>
              </div>
            </div>

            {/* Weak Topic Alert */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: isLight ? '#d97706' : '#fbbf24' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <AlertTriangle size={13} color={isLight ? '#d97706' : '#fbbf24'} style={{ flexShrink: 0 }} /> Focus: {s.weakTopic}
              </span>
              <ArrowRight size={14} color="#06b6d4" style={{ flexShrink: 0 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
