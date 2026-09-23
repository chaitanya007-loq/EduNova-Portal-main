import React from 'react';
import { SkillMatchWidget } from '../../components/marketplace/SkillMatchWidget';
import { Repeat } from 'lucide-react';

export const SkillSwapMatchPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Repeat size={28} color="#06b6d4" /> AI Skill Swap Compatibility Engine
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Calculate dynamic match compatibility based on offered vs requested skill matrices.
        </p>
      </div>

      <SkillMatchWidget />
    </div>
  );
};
