import React from 'react';
import { Repeat, Star, Clock, MapPin, Check } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const SkillCard = ({ exchange, onRequestExchange }) => {
  return (
    <Card hoverEffect style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* User Profile Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={exchange.user.avatar}
              alt={exchange.user.name}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
            />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{exchange.user.name}</h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{exchange.user.title}</span>
            </div>
          </div>
          <span className="cyber-badge-emerald">
            <Star size={12} fill="#34d399" /> {exchange.user.rating} ({exchange.user.reviewsCount})
          </span>
        </div>

        {/* Skill Swap Breakdown */}
        <div style={{
          background: 'var(--bg-tertiary)',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Teaches:</span>
            <p style={{ color: '#38bdf8', fontWeight: 700 }}>{exchange.teaches}</p>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Wants to Learn:</span>
            <p style={{ color: '#a855f7', fontWeight: 700 }}>{exchange.wantsToLearn}</p>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
          {exchange.description}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          <span><Clock size={12} /> {exchange.availability}</span>
          <span style={{ color: '#10b981', fontWeight: 700 }}>{exchange.compatibilityMatch}% Match</span>
        </div>

        <Button style={{ width: '100%' }} onClick={() => onRequestExchange(exchange)}>
          <Repeat size={16} /> Request Skill Swap
        </Button>
      </div>
    </Card>
  );
};
