import React from 'react';
import { Bot, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

export const RecommendationCard = () => {
  const navigate = useNavigate();

  return (
    <Card style={{
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
      border: '1px solid var(--border-glow)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{
          padding: '6px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)'
        }}>
          <Bot size={18} color="#fff" />
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>SAGE AI ADAPTIVE RECOMMENDATION</span>
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
        Reinforce Async Edge Cases Before Full-Stack APIs
      </h3>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
        Sage detected you completed 78% of React 19 architecture. Try the 5-minute interactive quiz or launch the Algorithm Visualizer lab to master async data flows.
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Button size="sm" variant="primary" onClick={() => navigate('/learning-path')}>
          View Adaptive Learning Path <ArrowRight size={14} />
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate('/immersive-lab')}>
          Launch Immersive Lab
        </Button>
      </div>
    </Card>
  );
};
