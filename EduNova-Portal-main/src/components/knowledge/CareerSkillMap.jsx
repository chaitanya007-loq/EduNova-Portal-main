import React from 'react';
import { Target, CheckCircle, ArrowRight, AlertCircle, Briefcase } from 'lucide-react';
import { CAREER_GOALS } from '../../data/skillCategories';
import { useTheme } from '../../context/ThemeContext';

export const CareerSkillMap = ({ selectedCareerId, onSelectCareer, careerData, onSelectSkill }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!careerData) return null;

  const { career, coveragePercentage, requiredSkills, mastered, developing, toBuild, skillGapCount } = careerData;

  return (
    <div style={{
      padding: '24px',
      borderRadius: '24px',
      background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 246, 255, 0.9) 100%)' : 'rgba(12, 16, 36, 0.85)',
      border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : '0 10px 30px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Career Selector Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="#06b6d4" /> Career Skill Coverage Map
          </h3>
          <span style={{ fontSize: '0.78rem', color: isLight ? '#52668a' : '#94a3b8' }}>
            Analyze skill readiness for your target professional career goal
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {CAREER_GOALS.map(cg => (
            <button
              key={cg.id}
              onClick={() => onSelectCareer(cg.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: selectedCareerId === cg.id ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : (isLight ? 'rgba(235, 244, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)'),
                color: selectedCareerId === cg.id ? '#fff' : (isLight ? '#475569' : '#94a3b8'),
                whiteSpace: 'nowrap'
              }}
            >
              {cg.icon} {cg.name}
            </button>
          ))}
        </div>
      </div>

      {/* Target Coverage Meter */}
      <div style={{
        padding: '16px',
        borderRadius: '18px',
        background: isLight ? 'linear-gradient(135deg, rgba(240, 249, 255, 0.95), rgba(224, 242, 254, 0.9))' : '#050814',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: isLight ? '#52668a' : '#94a3b8' }}>Target Role: <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>{career.name}</strong></span>
          <h4 style={{ fontSize: '1.6rem', fontWeight: 900, color: isLight ? '#0284c7' : '#38bdf8', margin: '4px 0 0 0' }}>{coveragePercentage}% Coverage</h4>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.78rem', color: isLight ? '#334155' : '#cbd5e1' }}>
          <div>Mastered: <strong style={{ color: '#10b981' }}>{mastered.length} skills</strong></div>
          <div>Developing: <strong style={{ color: '#6366f1' }}>{developing.length} skills</strong></div>
          <div>Skill Gap: <strong style={{ color: '#f43f5e' }}>{skillGapCount} skills remaining</strong></div>
        </div>
      </div>

      {/* Required Skills Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {requiredSkills.map(s => (
          <div
            key={s.id}
            onClick={() => onSelectSkill(s.id)}
            style={{
              padding: '12px 14px',
              borderRadius: '16px',
              background: isLight ? 'rgba(255, 255, 255, 0.92)' : '#050814',
              border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: isLight ? '0 4px 12px rgba(180, 200, 230, 0.25)' : 'none'
            }}
          >
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', display: 'block' }}>{s.name}</span>
              <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>{s.category}</span>
            </div>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: s.masteryScore >= 80 ? 'rgba(16, 185, 129, 0.15)' : (s.masteryScore >= 40 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(244, 63, 94, 0.15)'), color: s.masteryScore >= 80 ? '#10b981' : (s.masteryScore >= 40 ? '#6366f1' : '#f43f5e'), fontSize: '0.75rem', fontWeight: 800 }}>
              {s.masteryScore}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
