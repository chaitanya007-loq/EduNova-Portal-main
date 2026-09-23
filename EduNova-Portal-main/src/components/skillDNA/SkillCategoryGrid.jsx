import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, TrendingDown, ChevronRight, Activity, BarChart2, CheckCircle2 } from 'lucide-react';

export const SkillCategoryGrid = ({ skills = [], onSelectSkill }) => {
  const [selectedSkillModal, setSelectedSkillModal] = useState(null);

  const getConfidenceBadgeClass = (confidence) => {
    switch (confidence) {
      case 'High': return { bg: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: 'rgba(52, 211, 153, 0.35)' };
      case 'Medium': return { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.35)' };
      case 'Low': return { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.35)' };
      default: return { bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.35)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={20} color="#a855f7" /> Demonstrated Skill Categories
        </h3>
        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
          Calculated from verified practice evidence
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
        {skills.map((item) => {
          const conf = getConfidenceBadgeClass(item.confidence);
          const isTrendUp = (item.trend || '').startsWith('+');

          return (
            <div
              key={item.skill}
              className="glass-card glass-card-hover"
              onClick={() => {
                setSelectedSkillModal(item);
                if (onSelectSkill) onSelectSkill(item);
              }}
              style={{
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderRadius: '18px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0, flex: 1, minWidth: '120px' }}>
                    {item.skill}
                  </h4>
                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: '9999px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: conf.bg,
                      color: conf.color,
                      border: `1px solid ${conf.border}`,
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    {item.confidence === 'Insufficient Data' ? 'No Data' : `${item.confidence} Conf.`}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '8px 0' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8' }}>
                    {item.score}%
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isTrendUp ? '#34d399' : '#fbbf24', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {isTrendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {item.trend} (30d)
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden', margin: '8px 0 12px 0' }}>
                  <div
                    style={{
                      width: `${item.score}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #06b6d4, #6366f1, #a855f7)',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Activity size={13} color="#38bdf8" /> {item.evidenceCount} verified activity logs
                </span>
                <ChevronRight size={14} color="#64748b" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkillModal && (
        <div className="se-modal-overlay" onClick={() => setSelectedSkillModal(null)}>
          <div className="se-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  {selectedSkillModal.skill} Detail
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>
                  Evidence-backed performance breakdown
                </span>
              </div>
              <button onClick={() => setSelectedSkillModal(null)} style={{ color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(5, 8, 20, 0.7)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block' }}>Current Indicator</span>
                  <strong style={{ fontSize: '1.4rem', color: '#38bdf8' }}>{selectedSkillModal.score}%</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block' }}>30-Day Trend</span>
                  <strong style={{ fontSize: '1.1rem', color: '#34d399' }}>{selectedSkillModal.trend}</strong>
                </div>
              </div>

              <div style={{ background: 'rgba(5, 8, 20, 0.5)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '6px' }}>Verified Evidence Signals:</strong>
                <ul style={{ paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.8rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Quiz Accuracy: {selectedSkillModal.quizAccuracy || selectedSkillModal.score}% across practice tests</li>
                  <li>Projects Completed: {selectedSkillModal.projectsCount || 2} interactive lab projects</li>
                  <li>Total Verified Logs: {selectedSkillModal.evidenceCount} activity instances</li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedSkillModal(null)}
                className="se-btn se-btn-primary"
                style={{ width: '100%', marginTop: '8px' }}
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
