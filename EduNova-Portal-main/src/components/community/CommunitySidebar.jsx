import React from 'react';
import { Sparkles, TrendingUp, Bookmark, Bot, Users } from 'lucide-react';
import { Button } from '../common/Button';

export const CommunitySidebar = () => {
  const trendingTags = [
    { tag: 'React', posts: 142 },
    { tag: 'DBMS', posts: 98 },
    { tag: 'Physics', posts: 76 },
    { tag: 'AI Agents', posts: 110 },
    { tag: 'WebXR', posts: 64 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Your Community Summary */}
      <div
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '20px',
          boxShadow: 'var(--glass-shadow)'
        }}
      >
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="#06b6d4" /> Your Community Activity
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>FOLLOWING</span>
            <strong style={{ fontSize: '1.1rem', color: '#06b6d4' }}>12 Topics</strong>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>GROUPS</span>
            <strong style={{ fontSize: '1.1rem', color: '#a855f7' }}>4 Active</strong>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>SAVED</span>
            <strong style={{ fontSize: '1.1rem', color: '#f59e0b' }}>18 Items</strong>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>QUESTIONS</span>
            <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>3 Asked</strong>
          </div>
        </div>
      </div>

      {/* 2. Trending Topics */}
      <div
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '20px',
          boxShadow: 'var(--glass-shadow)'
        }}
      >
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="#a855f7" /> Trending Topics
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {trendingTags.map((t) => (
            <div key={t.tag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>#{t.tag}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.posts} posts</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Sage Recommends */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(99, 102, 241, 0.12))',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--accent-cyan)',
          padding: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Bot size={18} color="#06b6d4" />
          <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Sage AI Recommendation</strong>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 12px' }}>
          3 discussions match your current learning goal: <strong>React Hooks & Async Fetching</strong>.
        </p>
        <Button size="sm" style={{ width: '100%' }}>
          Explore Recommended
        </Button>
      </div>
    </div>
  );
};
