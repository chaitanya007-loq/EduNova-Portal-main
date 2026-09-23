import React from 'react';
import { Target, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const GoalAndTimelineCard = ({ goalData, balanceData, timelineData }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!goalData || !balanceData) return null;

  const cardStyle = {
    padding: '20px',
    borderRadius: '24px',
    background: isLight 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' 
      : 'rgba(12, 16, 36, 0.85)',
    border: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.05)' : '0 10px 30px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(16px)'
  };

  const innerBoxStyle = {
    padding: '16px',
    borderRadius: '18px',
    background: isLight ? 'rgba(255, 255, 255, 0.75)' : '#050814',
    border: isLight ? '1px solid rgba(203, 213, 225, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      {/* Learning Goal Progress */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} color="#6366f1" /> Learning Goals & Pace
        </h3>

        <div style={{ ...innerBoxStyle, marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : '#94a3b8' }}>Target Score: {goalData.targetScore}%</span>
            <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 800 }}>Pace: {goalData.status}</span>
          </div>

          <div style={{ height: '10px', background: isLight ? 'rgba(203, 213, 225, 0.6)' : 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: `${goalData.currentScore}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: isLight ? '#334155' : '#cbd5e1' }}>
            <span>Current: <strong>{goalData.currentScore}%</strong></span>
            <span>Gap: <strong>{goalData.remaining}% remaining</strong></span>
            <span>Deadline: <strong>{goalData.daysLeft} days left</strong></span>
          </div>
        </div>

        {/* Study Balance Distribution */}
        <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: isLight ? '#475569' : '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
          Learning Balance Breakdown
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {balanceData.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: isLight ? '#334155' : '#e2e8f0', fontWeight: 600 }}>{b.category}</span>
              <span style={{ color: b.color, fontWeight: 800 }}>{b.percentage}% ({b.hours}h)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Productivity Timeline (When do you learn best) */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="#d97706" /> When Do You Learn Best?
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {timelineData.map((t, idx) => (
            <div key={idx} style={{ padding: '10px 12px', borderRadius: '14px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : '#050814', border: isLight ? '1px solid rgba(203, 213, 225, 0.6)' : '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', display: 'block' }}>{t.time}</span>
                <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>{t.sessions} sessions completed</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '0.95rem', color: '#10b981' }}>{t.accuracy}% acc</strong>
                <span style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#64748b', display: 'block' }}>Comp: {t.completionRate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
