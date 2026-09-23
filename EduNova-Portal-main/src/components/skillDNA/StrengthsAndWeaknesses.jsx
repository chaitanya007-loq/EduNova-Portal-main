import React, { useState } from 'react';
import { Award, AlertTriangle, Play, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StrengthsAndWeaknesses = ({ strengths = [], weakAreas = [] }) => {
  const [activeEvidenceModal, setActiveEvidenceModal] = useState(null);
  const navigate = useNavigate();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      
      {/* Top Strengths Panel */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#34d399" /> Top Demonstrated Strengths
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', background: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              Verified Data
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {strengths.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: 'rgba(5, 8, 20, 0.6)',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#fff', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} color="#34d399" /> {item.title}
                  </strong>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34d399' }}>
                    {item.score}% Mastery
                  </span>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '0.78rem', margin: 0, lineHeight: 1.35 }}>
                  {item.evidence}
                </p>

                <button
                  onClick={() => setActiveEvidenceModal(item)}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <HelpCircle size={12} /> Why is this a strength?
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Needs Attention Panel */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#fb7185" /> Needs Attention (Weak Areas)
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#fb7185', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              Target Focus
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {weakAreas.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: 'rgba(5, 8, 20, 0.6)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#fff', fontSize: '0.88rem' }}>
                    {item.topic}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 700 }}>
                    {item.currentPerformance}
                  </span>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: 0, lineHeight: 1.35 }}>
                  {item.mistakePattern}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Last practiced: {item.lastPracticed}</span>
                  <button
                    onClick={() => navigate('/my-subjects')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid rgba(6, 182, 212, 0.35)',
                      color: '#38bdf8',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    <Play size={12} /> Practice Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strength Evidence Modal */}
      {activeEvidenceModal && (
        <div className="se-modal-overlay" onClick={() => setActiveEvidenceModal(null)}>
          <div className="se-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Strength Evidence: {activeEvidenceModal.title}
              </h3>
              <button onClick={() => setActiveEvidenceModal(null)} style={{ color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(5, 8, 20, 0.8)', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5 }}>
              {activeEvidenceModal.evidence}
            </div>
            <button
              onClick={() => setActiveEvidenceModal(null)}
              className="se-btn se-btn-primary"
              style={{ width: '100%', marginTop: '14px' }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
