import React from 'react';
import { useLearner } from '../../context/LearnerContext';
import { School, GraduationCap, Laptop, BookOpenCheck, RefreshCw } from 'lucide-react';

export const DemoProfileSwitcher = () => {
  const { learnerType, switchDemoProfile } = useLearner();

  const profiles = [
    { type: 'school', label: '🏫 School (Aarav - Class 10)', icon: School, color: '#06b6d4' },
    { type: 'college', label: '🎓 College (Kavya - B.Tech CSE)', icon: GraduationCap, color: '#6366f1' },
    { type: 'skills', label: '💻 Skills (Rahul - React Developer)', icon: Laptop, color: '#a855f7' },
    { type: 'exam', label: '📝 Exam Prep (Priya - CMAT Aspirant)', icon: BookOpenCheck, color: '#f59e0b' }
  ];

  return (
    <div style={{
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-color)',
      padding: '16px 20px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      boxShadow: 'var(--glass-shadow)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RefreshCw size={16} color="var(--accent-cyan)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Active Learner Profile:
        </span>
        <span className="cyber-badge-cyan" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
          {learnerType}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {profiles.map((p) => {
          const isActive = learnerType === p.type;
          return (
            <button
              key={p.type}
              onClick={() => switchDemoProfile(p.type)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: isActive ? 800 : 500,
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? `linear-gradient(135deg, ${p.color}, #6366f1)` : 'var(--bg-tertiary)',
                border: isActive ? `1px solid ${p.color}` : '1px solid var(--border-color)',
                boxShadow: isActive ? `0 2px 10px ${p.color}40` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
