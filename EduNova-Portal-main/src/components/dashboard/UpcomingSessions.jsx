import React from 'react';
import { Calendar, Video, Users } from 'lucide-react';
import { Card } from '../common/Card';

export const UpcomingSessions = () => {
  const sessions = [
    {
      id: 's1',
      title: 'Peer Skill Exchange: React vs Figma Tokens',
      partner: 'Maya Lin',
      time: 'Today at 4:00 PM',
      type: '1-on-1 Swap'
    },
    {
      id: 's2',
      title: 'Immersive Physics Lab: Orbital Gravity Workshop',
      partner: 'Sage AI Cohort',
      time: 'Tomorrow at 6:30 PM',
      type: 'Interactive Simulation'
    }
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Upcoming Sessions</h3>
        <Calendar size={18} color="var(--text-muted)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sessions.map((s) => (
          <div
            key={s.id}
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{s.type}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.time}</span>
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>{s.title}</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} /> Partner: {s.partner}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
