import React, { useState } from 'react';
import { sampleStudyGroups } from '../../data/community';
import { Users, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const StudyGroupsTab = () => {
  const [joinedGroups, setJoinedGroups] = useState(['group_1']);

  const toggleJoin = (groupId) => {
    if (joinedGroups.includes(groupId)) {
      setJoinedGroups(joinedGroups.filter((g) => g !== groupId));
    } else {
      setJoinedGroups([...joinedGroups, groupId]);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      {sampleStudyGroups.map((g) => {
        const isJoined = joinedGroups.includes(g.id);
        return (
          <div
            key={g.id}
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-xl)',
              border: isJoined ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--glass-shadow)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '2rem' }}>{g.avatar}</span>
                <span className="cyber-badge-purple" style={{ fontSize: '0.75rem' }}>
                  <Users size={12} /> {g.membersCount} Members
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                {g.name}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                {g.description}
              </p>

              <div style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>NEXT LIVE SESSION</span>
                <strong style={{ fontSize: '0.88rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> {g.nextSession}
                </strong>
              </div>
            </div>

            <Button
              variant={isJoined ? 'outline' : 'primary'}
              onClick={() => toggleJoin(g.id)}
            >
              {isJoined ? 'Joined ✓ (View Group)' : 'Join Study Group'} <ArrowRight size={16} />
            </Button>
          </div>
        );
      })}
    </div>
  );
};
