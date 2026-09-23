import React from 'react';
import { RotateCcw, Target } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const RevisionRadar = ({ revisionData, examData, onReviseTopic }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

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
    padding: '12px 14px',
    borderRadius: '16px',
    background: isLight ? 'rgba(255, 255, 255, 0.75)' : '#050814',
    border: isLight ? '1px solid rgba(203, 213, 225, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      {/* Revision Radar */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RotateCcw size={18} color="#a855f7" /> Revision Radar
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {revisionData.map(r => (
            <div
              key={r.id}
              style={{
                ...innerBoxStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: 0 }}>
                  {r.topic}
                </h4>
                <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                  {r.subject} • Last studied {r.lastStudied}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ padding: '3px 8px', borderRadius: '8px', background: r.status === 'Overdue' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(6, 182, 212, 0.2)', color: r.status === 'Overdue' ? '#f43f5e' : (isLight ? '#0284c7' : '#38bdf8'), fontSize: '0.7rem', fontWeight: 800 }}>
                  {r.status}
                </span>
                <button
                  onClick={() => onReviseTopic && onReviseTopic(r)}
                  className="se-btn se-btn-primary"
                  style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                >
                  Revise Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Readiness */}
      <div style={{ ...cardStyle, border: isLight ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(6, 182, 212, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="#06b6d4" /> Exam Readiness Center
          </h3>
          <span style={{ fontSize: '0.75rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800 }}>
            {examData.examName}
          </span>
        </div>

        {/* Readiness Meter */}
        <div style={{ ...innerBoxStyle, padding: '14px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8' }}>Overall Exam Readiness</span>
            <h4 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#06b6d4', margin: 0 }}>{examData.overallReadiness}%</h4>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: isLight ? '#334155' : '#cbd5e1' }}>
            <div>Syllabus: <strong>{examData.breakdown.syllabusCoverage}%</strong></div>
            <div>Practice: <strong>{examData.breakdown.practiceCoverage}%</strong></div>
            <div>Revision: <strong>{examData.breakdown.revisionCoverage}%</strong></div>
          </div>
        </div>

        {/* Sectional Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {examData.sections.map((sec, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ color: isLight ? '#334155' : '#e2e8f0', fontWeight: 700 }}>{sec.name}</span>
              <span style={{ color: isLight ? '#0284c7' : '#06b6d4', fontWeight: 800 }}>{sec.readiness}% ({sec.coverage})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
