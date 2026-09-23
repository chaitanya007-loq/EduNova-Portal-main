import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Play, Bot, Clock, Target, ArrowRight } from 'lucide-react';
import { Button } from '../../common/Button';
import { getNextBestAction } from '../../../services/dashboardContextService';

export const NextBestActionWidget = () => {
  const navigate = useNavigate();
  const action = getNextBestAction();

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-glow)',
      padding: '22px 26px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '999px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Target size={12} /> NEXT BEST ACTION
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> {action.estimatedTime}
          </span>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
          AI Context Verified
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
            {action.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0 0 12px' }}>
            <strong style={{ color: 'var(--accent-amber)' }}>Reason:</strong> {action.reason}
          </p>

          <div style={{
            background: 'rgba(8, 12, 30, 0.6)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--accent-cyan)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Bot size={16} color="var(--accent-cyan)" />
            <span>{action.sageTip}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', alignSelf: 'center' }}>
          <Button variant="outline" size="sm" onClick={() => navigate('/ai-assistant')}>
            <Bot size={14} /> Ask Sage
          </Button>
          <Button size="sm" onClick={() => navigate(`/subjects/${action.subjectId || 'physics'}`)}>
            {action.actionText} <Play size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NextBestActionWidget;
