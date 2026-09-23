import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const PersonalPatternsCard = ({ patternsData }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!patternsData) return null;

  return (
    <div style={{
      padding: '20px',
      borderRadius: '24px',
      background: isLight 
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' 
        : 'rgba(12, 16, 36, 0.85)',
      border: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.05)' : '0 10px 30px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(16px)'
    }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={18} color="#06b6d4" /> Personal Learning Patterns
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {patternsData.map((p, idx) => (
          <div key={idx} style={{ padding: '12px', borderRadius: '14px', background: isLight ? 'rgba(255, 255, 255, 0.75)' : '#050814', border: isLight ? '1px solid rgba(203, 213, 225, 0.6)' : '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>{p.metric}</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8', margin: '4px 0 2px 0' }}>{p.value}</h4>
            <span style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#64748b' }}>{p.period}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
