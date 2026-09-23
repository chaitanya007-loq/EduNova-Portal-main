import React from 'react';
import { X, Sparkles, CheckCircle } from 'lucide-react';

export const WhyMatchModal = ({ isOpen, onClose, candidate }) => {
  if (!isOpen || !candidate) return null;

  const breakdown = candidate.matchBreakdown || {
    skillCompatibility: 95,
    availability: 90,
    learningGoals: 94,
    experience: 88,
    language: 100
  };

  const factors = [
    { label: 'Skill Compatibility', value: breakdown.skillCompatibility, color: '#06b6d4' },
    { label: 'Schedule Availability', value: breakdown.availability, color: '#a855f7' },
    { label: 'Learning Goals Alignment', value: breakdown.learningGoals, color: '#10b981' },
    { label: 'Experience Level Match', value: breakdown.experience, color: '#3b82f6' },
    { label: 'Language Match', value: breakdown.language, color: '#f59e0b' }
  ];

  return (
    <div className="se-modal-overlay">
      <div className="se-modal-box">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', color: '#38bdf8' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Why This Match?</h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>Transparent AI compatibility breakdown for {candidate.name}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Big Overall Match Score */}
        <div style={{ padding: '16px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Overall Synergy</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#38bdf8' }}>{candidate.matchScore}%</span> Match
            </div>
          </div>
          <div style={{ padding: '8px 14px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#38bdf8', fontWeight: 800, fontSize: '0.78rem' }}>
            {candidate.isReciprocalSwap ? '🔄 Reciprocal Swap' : '✓ Highly Compatible'}
          </div>
        </div>

        {/* Sub-score Progress Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', margin: 0 }}>Score Factors</h4>
          {factors.map((f, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{f.label}</span>
                <span style={{ color: '#ffffff', fontWeight: 800 }}>{f.value}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: f.color, borderRadius: '9999px', width: `${f.value}%`, transition: 'all 0.5s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Qualitative Match Reasons List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Key Match Reasons</h4>
          {(candidate.matchReasons || []).map((reason, idx) => (
            <div key={idx} style={{ padding: '10px 12px', borderRadius: '12px', background: '#050814', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle size={14} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="se-btn se-btn-primary"
          style={{ width: '100%', padding: '12px' }}
        >
          Got it
        </button>
      </div>
    </div>
  );
};
