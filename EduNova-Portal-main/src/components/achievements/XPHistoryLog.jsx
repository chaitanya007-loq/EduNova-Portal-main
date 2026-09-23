import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { Zap, Clock, Filter } from 'lucide-react';

export const XPHistoryLog = () => {
  const { xpTransactions } = useLearning();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Learning', 'Quiz', 'Streak', 'Skills'];

  const filteredTxs = filter === 'All'
    ? xpTransactions
    : xpTransactions.filter((tx) => tx.category === filter);

  return (
    <div
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        padding: '24px',
        boxShadow: 'var(--glass-shadow)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="cyber-badge-cyan" style={{ fontSize: '0.78rem' }}>XP Activity Log</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0' }}>
            Recent XP Transactions
          </h3>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: filter === c ? 'var(--accent-cyan)' : 'var(--bg-secondary)',
                border: filter === c ? 'none' : '1px solid var(--border-color)',
                color: filter === c ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredTxs.map((tx) => (
          <div
            key={tx.id}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
                <Zap size={16} />
              </div>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>{tx.title}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.category} • {tx.timeAgo}</span>
              </div>
            </div>

            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>
              +{tx.xp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
