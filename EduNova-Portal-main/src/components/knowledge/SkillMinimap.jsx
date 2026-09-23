import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const SkillMinimap = ({ nodes = [], selectedSkillId, onSelectNode }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        width: '150px',
        height: '95px',
        borderRadius: '14px',
        background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(5, 8, 20, 0.95)',
        border: isLight ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(6, 182, 212, 0.4)',
        boxShadow: isLight ? '0 8px 25px rgba(180, 200, 230, 0.4)' : '0 8px 25px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)'
      }}
    >
      <div style={{ padding: '4px 8px', fontSize: '0.62rem', fontWeight: 800, color: isLight ? '#0284c7' : '#06b6d4', textTransform: 'uppercase', background: isLight ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.15)', borderBottom: '1px solid rgba(6, 182, 212, 0.2)' }}>
        Mini Map
      </div>

      <svg width="100%" height="70px" viewBox="0 0 1000 520">
        {nodes.map(n => {
          const isSelected = selectedSkillId === n.id;
          return (
            <circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r={isSelected ? 30 : 16}
              fill={isSelected ? '#0284c7' : (n.status === 'MASTERED' ? '#10b981' : (n.status === 'ACTIVE' ? '#6366f1' : (isLight ? '#94a3b8' : '#475569')))}
              onClick={() => onSelectNode(n.id)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}
      </svg>
    </div>
  );
};
