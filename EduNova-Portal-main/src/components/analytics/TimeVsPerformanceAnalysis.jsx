import React from 'react';
import { ScatterChart, Zap, HelpCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const TimeVsPerformanceAnalysis = ({ relationshipData }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!relationshipData || relationshipData.length === 0) return null;

  return (
    <div style={{
      padding: '20px',
      borderRadius: '24px',
      background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)',
      border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: isLight ? '0 10px 30px rgba(37, 99, 235, 0.06)' : '0 10px 30px rgba(0,0,0,0.4)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#10b981" /> Where Your Time Actually Pays Off
          </h3>
          <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8' }}>
            Relationship between Study Hours (X) vs Performance Mastery (Y)
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {relationshipData.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: '14px',
              borderRadius: '16px',
              background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814',
              border: isLight ? `1.5px solid ${item.color}60` : `1.5px solid ${item.color}40`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                {item.subject}
              </h4>
              <span style={{ padding: '2px 8px', borderRadius: '8px', background: `${item.color}20`, color: item.color, fontSize: '0.72rem', fontWeight: 800 }}>
                {item.hours} hrs → {item.mastery}%
              </span>
            </div>

            <div style={{ height: '6px', background: isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${item.mastery}%`, height: '100%', background: item.color }} />
            </div>

            <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8', fontStyle: 'italic' }}>
              Pattern: {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
