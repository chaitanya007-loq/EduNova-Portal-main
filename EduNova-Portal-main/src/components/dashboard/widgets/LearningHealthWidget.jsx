import React from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import homeworkTestService from '../../../services/homeworkTestService';

export const LearningHealthWidget = () => {
  const health = homeworkTestService.getLearningHealth();

  return (
    <div style={{
      background: 'var(--glass-bg)',
      padding: '20px 24px',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="#10b981" /> EduNova Learning Health
        </h3>
        <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', padding: '3px 10px', borderRadius: '999px' }}>
          {health.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {health.breakdown.map((item, idx) => (
          <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item.score}%</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningHealthWidget;
