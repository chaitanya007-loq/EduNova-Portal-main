import React from 'react';
import { quickActionService } from '../../services/ai/quickActionService';
import { useAI } from '../../context/AIContext';

export const SuggestedPrompts = ({ onSelect }) => {
  const { activeContext } = useAI() || {};
  const dynamicActions = quickActionService.getDynamicQuickActions({
    activeSubject: activeContext?.subjectName,
    activeTopic: activeContext?.topicName
  });

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '10px 16px',
      borderTop: '1px solid var(--border-color)',
      background: 'rgba(12, 16, 36, 0.6)'
    }}>
      {dynamicActions.map((act) => (
        <button
          key={act.id || act.text}
          onClick={() => onSelect(act.text)}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#06b6d4';
            e.currentTarget.style.color = '#38bdf8';
            e.currentTarget.style.background = 'rgba(6, 182, 212, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'var(--bg-tertiary)';
          }}
        >
          <span>{act.icon || '✨'}</span> {act.text}
        </button>
      ))}
    </div>
  );
};
