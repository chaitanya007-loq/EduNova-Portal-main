import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Bot, Repeat, ArrowRight } from 'lucide-react';
import { Button } from '../../common/Button';
import examTrackService from '../../../services/examTrackService';

export const ErrorIntelligenceWidget = () => {
  const navigate = useNavigate();
  const errors = examTrackService.getErrorIntelligence();

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
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Evidence Classification</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} color="#f43f5e" /> Error Taxonomy & Mistake Intelligence
          </h3>
        </div>

        <Button size="xs" variant="outline" onClick={() => navigate('/ai-assistant')}>
          <Bot size={13} /> Ask Sage AI
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {errors.map((err, idx) => (
          <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: err.color }} />
              <div>
                <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{err.category} ({err.count} mistakes)</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{err.description}</span>
              </div>
            </div>

            <Button size="xs" variant="outline" onClick={() => navigate('/my-subjects')}>
              {err.action} <ArrowRight size={11} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorIntelligenceWidget;
