import React from 'react';

export const ProgressBar = ({ progress = 0, color = 'linear-gradient(90deg, #6366f1, #a855f7)', height = 8 }) => {
  return (
    <div style={{
      width: '100%',
      height: `${height}px`,
      background: 'var(--bg-tertiary)',
      borderRadius: 'var(--radius-full)',
      overflow: 'hidden'
    }}>
      <div
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
          height: '100%',
          background: color,
          transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          borderRadius: 'var(--radius-full)'
        }}
      />
    </div>
  );
};
