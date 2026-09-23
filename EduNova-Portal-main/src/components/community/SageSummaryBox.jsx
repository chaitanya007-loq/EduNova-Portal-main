import React from 'react';
import { Bot, Sparkles, BookOpen, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '../common/Button';

export const SageSummaryBox = ({ onTurnQuiz, onTurnNotes }) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.14), rgba(99, 102, 241, 0.14))',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--accent-cyan)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 0 35px rgba(6, 182, 212, 0.18)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <Bot size={22} color="#06b6d4" />
        <span className="cyber-badge-cyan" style={{ fontSize: '0.8rem' }}>🧠 Sage AI Discussion Summary</span>
      </div>

      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
        Key Community Takeaway: React Custom Hooks & AbortController
      </h4>

      <ul style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '20px', margin: '0 0 16px' }}>
        <li>Always instantiate `new AbortController()` inside `useEffect` and invoke `.abort()` in cleanup.</li>
        <li>Pass `signal: controller.signal` into fetch request headers to eliminate race condition bugs.</li>
        <li>Use custom state wrappers to isolate retry logic away from component UI renders.</li>
      </ul>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button size="sm" onClick={onTurnQuiz}>
          <Sparkles size={14} /> Convert Discussion into Quiz (+50 XP)
        </Button>
        <Button size="sm" variant="outline" onClick={onTurnNotes}>
          <BookOpen size={14} /> Generate Revision Notes
        </Button>
      </div>
    </div>
  );
};
