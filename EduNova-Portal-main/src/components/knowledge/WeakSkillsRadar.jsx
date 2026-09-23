import React from 'react';
import { AlertTriangle, Award, CheckCircle2, Play, RotateCcw, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const WeakSkillsRadar = ({ weakSkills = [], strongSkills = [], onSelectSkill, onAskSage }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      {/* Weak Skills Card */}
      <div style={{
        padding: '20px',
        borderRadius: '24px',
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 241, 242, 0.88) 100%)' : 'rgba(12, 16, 36, 0.85)',
        border: isLight ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid rgba(244, 63, 94, 0.3)',
        boxShadow: isLight ? '0 16px 40px rgba(255, 205, 210, 0.4)' : '0 10px 30px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(16px)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="#f43f5e" /> Skills That Need Attention
        </h3>

        {weakSkills && weakSkills.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {weakSkills.map(ws => (
              <div key={ws.id} style={{
                padding: '12px',
                borderRadius: '14px',
                background: isLight ? 'rgba(255, 255, 255, 0.9)' : '#050814',
                border: isLight ? '1px solid rgba(244, 63, 94, 0.2)' : '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: isLight ? '0 4px 12px rgba(244, 63, 94, 0.08)' : 'none'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>{ws.name}</h4>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>{ws.category} • {ws.nextRecommendedAction}</span>
                </div>
                <button onClick={() => onSelectSkill(ws.id)} className="se-btn se-btn-secondary" style={{ padding: '5px 10px', fontSize: '0.72rem' }}>
                  Inspect
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '32px 20px',
            textAlign: 'center',
            background: isLight ? 'rgba(254, 242, 242, 0.6)' : 'rgba(5, 8, 20, 0.6)',
            borderRadius: '16px',
            border: isLight ? '1px dashed rgba(244, 63, 94, 0.4)' : '1px dashed rgba(244, 63, 94, 0.3)'
          }}>
            <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 10px auto', display: 'block' }} />
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: '0 0 4px 0' }}>
              No Weak Skills Flagged!
            </h4>
            <p style={{ fontSize: '0.8rem', color: isLight ? '#475569' : '#94a3b8', margin: 0, lineHeight: 1.45 }}>
              All your active skill nodes are currently performing well with solid mastery accuracy.
            </p>
          </div>
        )}
      </div>

      {/* Strong Skills Card */}
      <div style={{
        padding: '20px',
        borderRadius: '24px',
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 253, 244, 0.88) 100%)' : 'rgba(12, 16, 36, 0.85)',
        border: isLight ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(16, 185, 129, 0.3)',
        boxShadow: isLight ? '0 16px 40px rgba(187, 247, 208, 0.4)' : '0 10px 30px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(16px)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} color="#10b981" /> Your Strongest Skills
        </h3>

        {strongSkills && strongSkills.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {strongSkills.map(ss => (
              <div key={ss.id} style={{
                padding: '12px',
                borderRadius: '14px',
                background: isLight ? 'rgba(255, 255, 255, 0.9)' : '#050814',
                border: isLight ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                boxShadow: isLight ? '0 4px 12px rgba(16, 185, 129, 0.08)' : 'none'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>{ss.name}</h4>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>{ss.evidenceCount || 1} evidence records • {ss.trend || '+5% this week'}</span>
                </div>
                <strong style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: 900 }}>{ss.masteryScore}%</strong>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '32px 20px',
            textAlign: 'center',
            background: isLight ? 'rgba(240, 253, 244, 0.6)' : 'rgba(5, 8, 20, 0.6)',
            borderRadius: '16px',
            border: isLight ? '1px dashed rgba(16, 185, 129, 0.4)' : '1px dashed rgba(16, 185, 129, 0.3)'
          }}>
            <Award size={32} color={isLight ? '#059669' : '#34d399'} style={{ margin: '0 auto 10px auto', display: 'block' }} />
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: '0 0 4px 0' }}>
              No Strong Skills Mastered Yet
            </h4>
            <p style={{ fontSize: '0.8rem', color: isLight ? '#475569' : '#94a3b8', margin: 0, lineHeight: 1.45 }}>
              Complete diagnostic assessments or practice quizzes to raise your skill mastery scores above 80%!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeakSkillsRadar;
