import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../../common/Button';
import skillsTrackService from '../../../services/skillsTrackService';

export const SkillRoadmapWidget = () => {
  const navigate = useNavigate();
  const roadmap = skillsTrackService.getSkillRoadmap();

  return (
    <div style={{
      background: 'var(--glass-bg)',
      padding: '24px',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Career Path</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="#06b6d4" /> Interactive Skill Roadmap — {roadmap.targetRole}
          </h3>
        </div>

        <Button size="xs" onClick={() => navigate('/learning-path')}>
          Full Roadmap <ArrowRight size={12} />
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {roadmap.nodes.map((node) => {
          const isDone = node.status === 'Completed';
          const isCurr = node.status === 'In Progress';
          const isNext = node.status === 'Next';

          return (
            <div
              key={node.id}
              onClick={() => navigate('/courses')}
              style={{
                background: 'var(--bg-secondary)',
                padding: '14px',
                borderRadius: 'var(--radius-lg)',
                border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : isCurr ? '1px solid var(--border-glow)' : '1px solid var(--border-color)',
                cursor: 'pointer',
                opacity: node.status === 'Locked' ? 0.6 : 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>{node.icon}</span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: isDone ? 'rgba(16, 185, 129, 0.2)' : isCurr ? 'rgba(6, 182, 212, 0.2)' : isNext ? 'rgba(245, 158, 11, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                  color: isDone ? '#10b981' : isCurr ? '#06b6d4' : isNext ? '#f59e0b' : 'var(--text-muted)'
                }}>
                  {node.status}
                </span>
              </div>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{node.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>+{node.xp} XP Multiplier</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillRoadmapWidget;
