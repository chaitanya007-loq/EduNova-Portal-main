import React from 'react';
import { sampleMentors, sampleStudyPartners } from '../../data/community';
import { Award, Star, Calendar, UserCheck, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const MentorsTab = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Mentors Section */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <span className="cyber-badge-cyan" style={{ fontSize: '0.78rem' }}>Verified Expert Mentors</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0' }}>
            Find a Mentor for 1-on-1 Guidance
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {sampleMentors.map((m) => (
            <div
              key={m.id}
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)',
                padding: '24px',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <img src={m.avatar} alt={m.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-cyan)' }} />
                <div>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)', display: 'block' }}>{m.name}</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>{m.role}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {m.subjects.map((s) => (
                  <span key={s} className="cyber-badge" style={{ fontSize: '0.75rem' }}>{s}</span>
                ))}
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '16px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rating:</span>
                  <strong style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} fill="#fbbf24" /> {m.rating}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Availability:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{m.availability}</strong>
                </div>
              </div>

              <Button style={{ width: '100%' }}>
                Request Mentorship Session <ArrowRight size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Study Partners AI Matcher */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <span className="cyber-badge-purple" style={{ fontSize: '0.78rem' }}>AI Topic Matchmaker</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0' }}>
            Recommended Study Partners
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {sampleStudyPartners.map((p) => (
            <div
              key={p.id}
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                padding: '24px',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={p.avatar} alt={p.name} style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'block' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.subject} • {p.level}</span>
                  </div>
                </div>

                <span className="cyber-badge-purple" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                  {p.matchScore}% MATCH
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Goal: "{p.goal}"
              </p>

              <Button variant="outline" style={{ width: '100%' }}>
                <UserCheck size={16} /> Connect with {p.name.split(' ')[0]}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
