import React from 'react';
import { KnowledgeConstellation } from '../visualization/KnowledgeConstellation';
import { Network } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const KnowledgeConstellationWidget = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={18} color="#06b6d4" /> Your Knowledge Constellation
          </h3>
          <span style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>
            Interactive node graph: Node size = Mastery, Glow = Activity, Links = Topic relationships
          </span>
        </div>
      </div>

      <KnowledgeConstellation />
    </div>
  );
};
