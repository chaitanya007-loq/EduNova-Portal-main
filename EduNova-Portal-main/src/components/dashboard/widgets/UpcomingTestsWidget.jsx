import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../common/Button';
import homeworkTestService from '../../../services/homeworkTestService';

export const UpcomingTestsWidget = () => {
  const navigate = useNavigate();
  const tests = homeworkTestService.getUpcomingTests();

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
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Calendar size={18} color="#f59e0b" /> Upcoming Tests & Exams
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tests.map((test) => (
          <div
            key={test.id}
            style={{
              background: 'var(--bg-secondary)',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="cyber-badge-cyan" style={{ fontSize: '0.7rem' }}>{test.subject}</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                  {test.topic}
                </h4>
              </div>
              <span style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#f59e0b',
                fontWeight: 800,
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '999px'
              }}>
                Exam in {test.daysRemaining} days
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Preparation Readiness</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>{test.prepProgress}%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${test.prepProgress}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #06b6d4)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <Button size="xs" onClick={() => navigate('/courses')}>
                Study Now <ArrowRight size={12} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTestsWidget;
