import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, TrendingUp, Clock, Zap } from 'lucide-react';
import { Button } from '../../common/Button';
import examTrackService from '../../../services/examTrackService';

export const MockTestIntelligenceWidget = () => {
  const navigate = useNavigate();
  const mock = examTrackService.getMockTestIntelligence();

  return (
    <div style={{
      background: 'var(--glass-bg)',
      padding: '24px',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} color="#06b6d4" /> Mock Test Performance & Trends
        </h3>
        <Button size="xs" onClick={() => navigate('/courses')}>
          Take Mock Test
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Latest Score</span>
          <strong style={{ display: 'block', fontSize: '1.1rem', color: '#10b981', marginTop: '2px' }}>{mock.recentMockScore}</strong>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Overall Accuracy</span>
          <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>{mock.overallAccuracy}</strong>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Avg Speed / Q</span>
          <strong style={{ display: 'block', fontSize: '1.1rem', color: '#f59e0b', marginTop: '2px' }}>{mock.avgTimePerQuestion}</strong>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Attempt Rate</span>
          <strong style={{ display: 'block', fontSize: '1.1rem', color: '#6366f1', marginTop: '2px' }}>{mock.attemptRate}</strong>
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
          Score Progression Trend
        </span>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', height: '60px', padding: '0 8px' }}>
          {mock.scoreTrend.map((t, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
              <span style={{ fontSize: '0.7rem', color: '#06b6d4', fontWeight: 800 }}>{t.score}</span>
              <div style={{ width: '100%', maxWidth: '28px', height: `${(t.score / 300) * 45}px`, background: 'linear-gradient(to top, #6366f1, #06b6d4)', borderRadius: '4px' }} />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{t.test}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MockTestIntelligenceWidget;
