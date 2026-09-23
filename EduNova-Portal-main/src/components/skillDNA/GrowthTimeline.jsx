import React, { useState } from 'react';
import { Calendar, Activity, CheckCircle2, Award } from 'lucide-react';

export const GrowthTimeline = () => {
  const [timeframe, setTimeframe] = useState('30d');

  const evidenceLogs = [
    { id: '1', title: 'Data Structures Quiz Completed', score: '88%', date: '2026-09-18', category: 'Programming', verified: true },
    { id: '2', title: 'Transit Management Dashboard Lab', score: 'Project Verified', date: '2026-09-16', category: 'UI/UX & React', verified: true },
    { id: '3', title: 'Peer Exchange Mentorship Session', score: '4.9 ★ Rating', date: '2026-09-14', category: 'Communication', verified: true },
    { id: '4', title: 'Quadratic Equations Assessment', score: '72%', date: '2026-09-10', category: 'Mathematics', verified: true }
  ];

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#38bdf8" /> Recent Verified Learning Evidence
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
            Timeline of practice, lab projects, and assessment evidence driving your Skill DNA
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: 'rgba(5, 8, 20, 0.6)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {['7d', '30d', '90d'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                border: 'none',
                background: timeframe === t ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                color: timeframe === t ? '#38bdf8' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {evidenceLogs.map((log) => (
          <div
            key={log.id}
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'rgba(5, 8, 20, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={18} color="#34d399" />
              <div>
                <strong style={{ color: '#fff', fontSize: '0.88rem', display: 'block' }}>{log.title}</strong>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Category: {log.category} • Verified Evidence</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', padding: '3px 10px', borderRadius: '9999px', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                {log.score}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} /> {log.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
