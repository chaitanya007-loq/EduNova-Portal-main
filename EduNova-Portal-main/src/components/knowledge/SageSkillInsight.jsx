import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SageSkillInsight = ({ insightText, onStartRecommended }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div style={{
      padding: '18px 22px',
      borderRadius: '20px',
      background: isLight ? 'linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(224, 231, 255, 0.9))' : 'rgba(99, 102, 241, 0.12)',
      border: isLight ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(99, 102, 241, 0.35)',
      boxShadow: isLight ? '0 12px 30px rgba(99, 102, 241, 0.15)' : 'none',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ padding: '8px', borderRadius: '12px', background: '#6366f1', color: '#fff', flexShrink: 0 }}>
          <Sparkles size={18} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#4f46e5' : '#818cf8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '2px' }}>
            Sage AI Constellation Insight
          </span>
          <p style={{ fontSize: '0.85rem', color: isLight ? '#1e1b4b' : '#e2e8f0', margin: 0, lineHeight: 1.45, fontWeight: isLight ? 600 : 400 }}>
            "{insightText}"
          </p>
        </div>
      </div>

      <button onClick={onStartRecommended} className="se-btn se-btn-primary" style={{ padding: '8px 14px', fontSize: '0.78rem', flexShrink: 0 }}>
        Start Recommended Skill <ArrowRight size={14} />
      </button>
    </div>
  );
};
