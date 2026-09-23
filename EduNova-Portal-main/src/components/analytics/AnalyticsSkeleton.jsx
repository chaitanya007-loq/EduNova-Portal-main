import React from 'react';

export const AnalyticsSkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
      {/* Skeleton Header */}
      <div style={{ height: '80px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.05)', animation: 'pulse 1.5s infinite' }} />

      {/* Skeleton KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} style={{ height: '90px', borderRadius: '18px', background: 'rgba(255, 255, 255, 0.05)', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>

      {/* Skeleton Health & Charts */}
      <div style={{ height: '260px', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.05)', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '220px', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.05)', animation: 'pulse 1.5s infinite' }} />
    </div>
  );
};
