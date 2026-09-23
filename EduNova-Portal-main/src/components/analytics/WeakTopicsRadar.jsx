import React from 'react';
import { AlertTriangle, Award, Play, RotateCcw, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const WeakTopicsRadar = ({ weakTopics, strengths, onAction }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      {/* Weak Topics Card */}
      <div style={{
        padding: '20px',
        borderRadius: '24px',
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)',
        border: isLight ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(244, 63, 94, 0.3)',
        boxShadow: isLight ? '0 10px 30px rgba(244, 63, 94, 0.06)' : '0 10px 30px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#f43f5e" /> Topics That Need Attention
            </h3>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8' }}>
              Identified low-accuracy or overdue practice areas
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {weakTopics.map(wt => (
            <div
              key={wt.id}
              style={{
                padding: '12px 14px',
                borderRadius: '16px',
                background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814',
                border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                    {wt.topic}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#0284c7' : '#38bdf8' }}>{wt.subject} • {wt.attempts} attempts</span>
                </div>
                <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', fontSize: '0.72rem', fontWeight: 800 }}>
                  {wt.accuracy}% accuracy
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <button
                  onClick={() => onAction && onAction('practice', wt)}
                  className="se-btn se-btn-primary"
                  style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                >
                  <Play size={12} /> Practice Now
                </button>
                <button
                  onClick={() => onAction && onAction('revise', wt)}
                  className="se-btn se-btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                >
                  <RotateCcw size={12} /> Revise
                </button>
                <button
                  onClick={() => onAction && onAction('sage', wt)}
                  style={{ padding: '5px 10px', borderRadius: '8px', background: isLight ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.2)', border: '1px solid #c084fc', color: isLight ? '#7c3aed' : '#c084fc', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Sparkles size={12} /> Ask Sage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strongest Areas Card */}
      <div style={{
        padding: '20px',
        borderRadius: '24px',
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)',
        border: isLight ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)',
        boxShadow: isLight ? '0 10px 30px rgba(16, 185, 129, 0.06)' : '0 10px 30px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#10b981" /> Your Strongest Areas
            </h3>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8' }}>
              Top mastered concepts with highest accuracy & consistency
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {strengths.map(st => (
            <div
              key={st.id}
              style={{
                padding: '12px 14px',
                borderRadius: '16px',
                background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814',
                border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                  {st.topic}
                </h4>
                <span style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8' }}>{st.subject} • {st.trend}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>{st.mastery}%</span>
                <span style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#64748b', display: 'block' }}>Mastery</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
