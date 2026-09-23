import React from 'react';
import { skillDnaMetrics } from '../../data/skills';
import { ProgressBar } from '../common/ProgressBar';
import { Card } from '../common/Card';
import { Dna, TrendingUp } from 'lucide-react';

export const SkillDnaChart = () => {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Dna size={22} color="#a855f7" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI Skill DNA Profile</h3>
        </div>
        <span className="cyber-badge-cyan">
          <TrendingUp size={12} /> Adaptive Metric
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {skillDnaMetrics.map((m) => (
          <div key={m.subject}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600 }}>{m.subject}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>{m.score}%</span>
                <span style={{ color: '#34d399', fontSize: '0.78rem' }}>{m.growth}</span>
              </div>
            </div>
            <ProgressBar progress={m.score} height={8} />
          </div>
        ))}
      </div>
    </Card>
  );
};
