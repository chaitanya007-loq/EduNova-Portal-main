import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Repeat, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../common/Button';
import homeworkTestService from '../../../services/homeworkTestService';

export const RevisionRadarWidget = () => {
  const navigate = useNavigate();
  const radar = homeworkTestService.getRevisionRadar();

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
          <Repeat size={18} color="#a855f7" /> Spaced Revision Radar
        </h3>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Spaced Repetition Active
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {radar.map((item) => (
          <div
            key={item.id}
            style={{
              background: 'var(--bg-secondary)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.subject}</strong>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: item.category === 'Due Today' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                  color: item.category === 'Due Today' ? '#f43f5e' : '#c084fc'
                }}>
                  {item.category}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                {item.topic} • Last studied {item.lastStudied}
              </p>
            </div>

            <Button size="xs" variant="outline" onClick={() => navigate('/my-subjects')}>
              Revise <ArrowRight size={12} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevisionRadarWidget;
