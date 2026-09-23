import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '../../common/Button';
import collegeTrackService from '../../../services/collegeTrackService';

export const CareerReadinessWidget = () => {
  const navigate = useNavigate();
  const career = collegeTrackService.getCareerReadiness();

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
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Evidence-Based Criteria</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="#06b6d4" /> Career Readiness — {career.targetRole}
          </h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>{career.overallScore}%</span>
          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verified Readiness</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {career.evidenceCriteria.map((item, idx) => (
          <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{item.category}</strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.evidence}</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
              {item.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerReadinessWidget;
