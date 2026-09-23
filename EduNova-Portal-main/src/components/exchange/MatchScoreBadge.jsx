import React from 'react';

export const MatchScoreBadge = ({ score = 90 }) => {
  let color = '#06b6d4'; // Cyan
  let bg = 'rgba(6, 182, 212, 0.15)';
  let glow = 'rgba(6, 182, 212, 0.4)';

  if (score >= 90) {
    color = '#10b981'; // Emerald
    bg = 'rgba(16, 185, 129, 0.18)';
    glow = 'rgba(16, 185, 129, 0.5)';
  } else if (score >= 75) {
    color = '#06b6d4'; // Cyan
    bg = 'rgba(6, 182, 212, 0.18)';
    glow = 'rgba(6, 182, 212, 0.4)';
  } else {
    color = '#a855f7'; // Purple
    bg = 'rgba(168, 85, 247, 0.18)';
    glow = 'rgba(168, 85, 247, 0.4)';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 14px',
        borderRadius: 'var(--radius-md)',
        background: bg,
        border: `1px solid ${color}`,
        boxShadow: `0 0 16px ${glow}`,
        textAlign: 'center'
      }}
    >
      <span style={{ fontSize: '1.05rem', fontWeight: 900, color, lineHeight: 1 }}>
        {score}%
      </span>
      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '2px' }}>
        EduNova Match
      </span>
    </div>
  );
};

export default MatchScoreBadge;
