import React from 'react';
import { Target, AlertTriangle, Sparkles, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AccuracyIntelligence = ({ accuracyData, onAskSageError }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!accuracyData) return null;

  const { overallAccuracy, firstAttemptAccuracy, afterRevisionAccuracy, repeatedErrorRate, difficultyBreakdown, errorPatterns } = accuracyData;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      {/* Accuracy Intelligence */}
      <div style={{
        padding: '20px',
        borderRadius: '24px',
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)',
        border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isLight ? '0 10px 30px rgba(37, 99, 235, 0.06)' : '0 10px 30px rgba(0,0,0,0.4)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} color="#10b981" /> Accuracy Intelligence
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814', border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8' }}>Overall Accuracy</span>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981', margin: 0 }}>{overallAccuracy}%</h4>
          </div>

          <div style={{ padding: '12px', borderRadius: '14px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814', border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8' }}>After Revision</span>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0284c7' : '#38bdf8', margin: 0 }}>{afterRevisionAccuracy}%</h4>
          </div>

          <div style={{ padding: '12px', borderRadius: '14px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814', border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8' }}>First Attempt</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: isLight ? '#0f172a' : '#e2e8f0', margin: 0 }}>{firstAttemptAccuracy}%</h4>
          </div>

          <div style={{ padding: '12px', borderRadius: '14px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814', border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8' }}>Repeated Errors</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f43f5e', margin: 0 }}>{repeatedErrorRate}%</h4>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: isLight ? '#475569' : '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
          Question Difficulty Breakdown
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {difficultyBreakdown.map((d) => (
            <div key={d.level} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: isLight ? '#1e293b' : '#cbd5e1', fontWeight: 700, width: '60px' }}>{d.level}</span>
              <div style={{ flex: 1, height: '6px', background: isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(255,255,255,0.08)', borderRadius: '3px', margin: '0 10px', overflow: 'hidden' }}>
                <div style={{ width: `${d.accuracy}%`, height: '100%', background: d.level === 'Easy' ? '#10b981' : d.level === 'Medium' ? '#38bdf8' : '#a855f7' }} />
              </div>
              <span style={{ color: isLight ? '#0f172a' : '#fff', fontWeight: 800 }}>{d.accuracy}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Pattern Analysis */}
      <div style={{
        padding: '20px',
        borderRadius: '24px',
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)',
        border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isLight ? '0 10px 30px rgba(37, 99, 235, 0.06)' : '0 10px 30px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color={isLight ? '#d97706' : '#fbbf24'} /> Why Are You Losing Marks?
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {errorPatterns.map((ep, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: '12px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814', border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', marginBottom: '4px' }}>
                  <span>{ep.category}</span>
                  <span style={{ color: ep.color }}>{ep.percentage}% ({ep.count} Qs)</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8', margin: 0 }}>{ep.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onAskSageError}
          className="se-btn se-btn-purple"
          style={{ width: '100%', padding: '10px', fontSize: '0.8rem', justifyContent: 'center', marginTop: '16px' }}
        >
          <Sparkles size={14} /> Ask Sage to Analyze Error Patterns
        </button>
      </div>
    </div>
  );
};
