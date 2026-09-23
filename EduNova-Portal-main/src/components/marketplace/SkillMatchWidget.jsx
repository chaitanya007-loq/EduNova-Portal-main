import React, { useState } from 'react';
import { Sparkles, ArrowRightLeft, CheckCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { calculateSkillMatchCompatibility } from '../../services/skillService';

export const SkillMatchWidget = () => {
  const [userTeaches, setUserTeaches] = useState('React.js');
  const [userWants, setUserWants] = useState('UI/UX Design');
  const [partnerTeaches, setPartnerTeaches] = useState('UI/UX Design Systems');
  const [partnerWants, setPartnerWants] = useState('React & Frontend Architecture');

  const matchScore = calculateSkillMatchCompatibility(userTeaches, partnerTeaches, userWants, partnerWants);

  return (
    <Card style={{
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(99, 102, 241, 0.12))',
      border: '1px solid var(--border-glow)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Sparkles size={20} color="#06b6d4" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI Skill Swap Compatibility Calculator</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>You Teach</span>
          <p style={{ fontWeight: 700, color: '#38bdf8' }}>{userTeaches}</p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>You Learn</span>
          <p style={{ fontWeight: 700, color: '#a855f7' }}>{userWants}</p>
        </div>

        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          <ArrowRightLeft size={18} />
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Peer Teaches</span>
          <p style={{ fontWeight: 700, color: '#a855f7' }}>{partnerTeaches}</p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>Peer Learns</span>
          <p style={{ fontWeight: 700, color: '#38bdf8' }}>{partnerWants}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Calculated Synergy Score:</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, marginLeft: '8px' }} className="gradient-text-emerald">
            {matchScore}% Compatibility
          </span>
        </div>
        <Button size="sm">Connect with Match</Button>
      </div>
    </Card>
  );
};
