import React from 'react';
import { Sparkles, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const LearningHealthCard = ({ healthData }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!healthData) return null;

  const { score, breakdown, insight } = healthData;

  const getHealthColor = (val) => {
    if (val >= 80) return '#10b981';
    if (val >= 65) return isLight ? '#0284c7' : '#06b6d4';
    if (val >= 50) return isLight ? '#d97706' : '#fbbf24';
    return '#f43f5e';
  };

  const metrics = [
    { label: 'Consistency', value: breakdown.consistency, color: isLight ? '#d97706' : '#fbbf24' },
    { label: 'Accuracy', value: breakdown.accuracy, color: '#10b981' },
    { label: 'Mastery', value: breakdown.mastery, color: '#6366f1' },
    { label: 'Revision', value: breakdown.revision, color: isLight ? '#7c3aed' : '#a855f7' },
    { label: 'Study Balance', value: breakdown.studyBalance, color: isLight ? '#0284c7' : '#06b6d4' }
  ];

  const mainColor = getHealthColor(score);

  return (
    <div
      style={{
        padding: '24px',
        borderRadius: '24px',
        background: isLight 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' 
          : 'linear-gradient(135deg, rgba(8, 12, 28, 0.95), rgba(15, 23, 42, 0.95))',
        border: isLight ? `1.5px solid ${mainColor}50` : `1.5px solid ${mainColor}40`,
        boxShadow: isLight ? '0 12px 35px rgba(37, 99, 235, 0.08)' : `0 12px 40px ${mainColor}15`,
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 280px) 1fr',
        gap: '24px',
        alignItems: 'center'
      }}
    >
      {/* Left Radial Gauge Display */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="80" cy="80" r="68" stroke={isLight ? 'rgba(203, 213, 225, 0.5)' : 'rgba(255, 255, 255, 0.08)'} strokeWidth="12" fill="none" />
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke={mainColor}
              strokeWidth="12"
              fill="none"
              strokeDasharray="427"
              strokeDashoffset={427 - (427 * score) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>

          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 900, color: isLight ? '#18345F' : '#fff', lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#475569' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>/ 100</span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: '12px 0 2px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={18} color={mainColor} /> AI Learning Health
        </h3>
        <span style={{ fontSize: '0.75rem', color: mainColor, fontWeight: 700 }}>
          {score >= 75 ? 'Optimal Progress Zone' : 'Steady Growth Needed'}
        </span>
      </div>

      {/* Right Progress Rings & Sage AI Insight */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Sub-Metric Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {metrics.map((m, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ color: isLight ? '#1e293b' : '#cbd5e1', fontWeight: 700 }}>{m.label}</span>
                <span style={{ color: m.color, fontWeight: 800 }}>{m.value} / 100</span>
              </div>
              <div style={{ height: '7px', background: isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${m.value}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${m.color}88, ${m.color})`,
                    borderRadius: '4px',
                    transition: 'width 0.8s ease'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Sage AI Insight Box */}
        <div style={{ padding: '12px 16px', borderRadius: '16px', background: isLight ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.1)', border: isLight ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ padding: '6px', borderRadius: '10px', background: '#06b6d4', color: '#ffffff', marginTop: '2px', flexShrink: 0 }}>
            <Sparkles size={16} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '2px' }}>
              Sage AI Health Insight
            </span>
            <p style={{ fontSize: '0.82rem', color: isLight ? '#1e293b' : '#e2e8f0', margin: 0, lineHeight: 1.45 }}>
              "{insight}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningHealthCard;
