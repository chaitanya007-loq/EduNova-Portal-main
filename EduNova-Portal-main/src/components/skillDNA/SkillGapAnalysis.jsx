import React from 'react';
import { Target, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const SkillGapAnalysis = ({ gapAnalysis, activeGoal, onSelectGoal }) => {
  const goals = [
    'Become a Full Stack Developer',
    'Master GATE Computer Science',
    'AI & Machine Learning Engineer',
    'Competitive Exam Preparation'
  ];

  if (!gapAnalysis) return null;

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="#06b6d4" /> AI Skill Gap Analysis
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
            Compare demonstrated skills against target career or academic requirements
          </p>
        </div>

        {/* Goal Selector */}
        <select
          value={activeGoal}
          onChange={(e) => onSelectGoal(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: '12px',
            background: '#050814',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: 700,
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {goals.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* Match Percentage Summary Card */}
        <div
          style={{
            padding: '18px',
            borderRadius: '16px',
            background: 'rgba(5, 8, 20, 0.7)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Target Compatibility
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#38bdf8', margin: '4px 0' }}>
              {gapAnalysis.matchPercentage}%
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.8rem', margin: 0, lineHeight: 1.35 }}>
              You have acquired <strong>{gapAnalysis.acquiredSkills.length}</strong> prerequisite skills for <em>"{gapAnalysis.targetGoal}"</em>.
            </p>
          </div>

          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> {gapAnalysis.acquiredSkills.join(' • ')}
            </span>
          </div>
        </div>

        {/* Missing Skills & Priority Gap List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Priority Skill Gaps ({gapAnalysis.missingSkills.length})
          </span>

          {gapAnalysis.missingSkills.map((gap, idx) => (
            <div
              key={idx}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(5, 8, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>{gap.skill}</strong>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Prereq: {gap.prerequisite}</span>
              </div>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  background: gap.priority === 'High' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                  color: gap.priority === 'High' ? '#fb7185' : '#fbbf24',
                  border: `1px solid ${gap.priority === 'High' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(251, 191, 36, 0.4)'}`
                }}
              >
                {gap.priority} Priority
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
