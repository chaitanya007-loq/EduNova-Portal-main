import React from 'react';
import { BarChart2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '../../hooks/useUserProgress';
import { useTheme } from '../../context/ThemeContext';

export const ProgressOverview = ({ compact = false }) => {
  const navigate = useNavigate();
  const { learning, practice, assignments } = useUserProgress();
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const getOffset = (pct) => {
    const safePct = Math.min(100, Math.max(0, Number(pct) || 0));
    return Math.round(138 - (138 * safePct / 100));
  };

  return (
    <div
      style={{
        borderRadius: '24px',
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 246, 255, 0.75) 100%)'
          : 'linear-gradient(135deg, rgba(20, 26, 58, 0.75) 0%, rgba(12, 17, 40, 0.85) 100%)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
        padding: compact ? '16px' : '20px',
        boxShadow: isLight
          ? '0 15px 40px rgba(64, 100, 160, 0.10), inset 0 1.5px 2px rgba(255, 255, 255, 1)'
          : '0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
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
            color: isLight ? '#0284c7' : '#38bdf8',
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
        
        {/* Learning Gauge */}
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
                strokeDashoffset={getOffset(learning)}
                strokeLinecap="round"
                transform="rotate(-90 28 28)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff' }}>
              {learning}%
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', color: isLight ? '#5D7192' : '#94a3b8', fontWeight: 600 }}>Learning</span>
        </div>

        {/* Practice Gauge */}
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
                strokeDashoffset={getOffset(practice)}
                strokeLinecap="round"
                transform="rotate(-90 28 28)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff' }}>
              {practice}%
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', color: isLight ? '#5D7192' : '#94a3b8', fontWeight: 600 }}>Practice</span>
        </div>

        {/* Assignments Gauge */}
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
                strokeDashoffset={getOffset(assignments)}
                strokeLinecap="round"
                transform="rotate(-90 28 28)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff' }}>
              {assignments}%
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', color: isLight ? '#5D7192' : '#94a3b8', fontWeight: 600 }}>Assignments</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;
