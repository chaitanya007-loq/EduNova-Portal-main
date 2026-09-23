import React from 'react';
import { Route, CheckCircle2, Circle, Lock, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LearningRoadmapView = ({ roadmap }) => {
  const navigate = useNavigate();

  if (!roadmap || !roadmap.phases) return null;

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Route size={20} color="#a855f7" /> AI Visual Skill Roadmap
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
            Step-by-step milestone path generated for <em>"{roadmap.targetGoal}"</em>
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', position: 'relative' }}>
        {roadmap.phases.map((phase, idx) => {
          const isCompleted = phase.status === 'completed';
          const isCurrent = phase.status === 'current';

          return (
            <div
              key={phase.phaseNumber}
              style={{
                padding: '18px',
                borderRadius: '18px',
                background: isCurrent
                  ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.18) 0%, rgba(99, 102, 241, 0.15) 100%)'
                  : 'rgba(5, 8, 20, 0.6)',
                border: isCurrent
                  ? '1px solid rgba(6, 182, 212, 0.5)'
                  : isCompleted
                  ? '1px solid rgba(52, 211, 153, 0.35)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: isCompleted ? 'rgba(52, 211, 153, 0.2)' : isCurrent ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      color: isCompleted ? '#34d399' : isCurrent ? '#38bdf8' : '#94a3b8'
                    }}
                  >
                    PHASE {phase.phaseNumber}
                  </span>
                  {isCompleted ? <CheckCircle2 size={18} color="#34d399" /> : isCurrent ? <Circle size={18} color="#38bdf8" fill="#06b6d4" /> : <Lock size={16} color="#64748b" />}
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>
                  {phase.title}
                </h4>

                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                  <Clock size={12} /> {phase.duration}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                  {phase.topics.map((tp, tIdx) => (
                    <span key={tIdx}>• {tp}</span>
                  ))}
                </div>
              </div>

              {isCurrent && (
                <button
                  onClick={() => navigate('/my-subjects')}
                  className="se-btn se-btn-primary"
                  style={{ width: '100%', marginTop: '14px', padding: '8px 12px', fontSize: '0.8rem' }}
                >
                  Start Phase
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
