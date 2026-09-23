import React, { useState } from 'react';
import { Search, CheckCircle2, Plus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';

export const SubjectSelector = ({ availableSubjects = [], selectedSubjects = [], onToggleSubject, onDone }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';
  const [search, setSearch] = useState('');

  const selectedIds = new Set((selectedSubjects || []).map(s => s.id));

  const filtered = availableSubjects.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (s.description || '').toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Info Banner */}
      <div style={{
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 246, 255, 0.90) 100%)'
          : 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.15))',
        borderRadius: '24px',
        border: isLight ? '1.5px solid rgba(195, 215, 245, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        padding: '22px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: isLight ? '0 16px 40px rgba(64, 100, 160, 0.12), inset 0 1.5px 2px rgba(255, 255, 255, 1)' : '0 16px 40px rgba(0, 0, 0, 0.4)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={22} color={isLight ? '#0284c7' : '#38bdf8'} /> SELECT YOUR SUBJECTS
          </h2>
          <p style={{ fontSize: '0.9rem', color: isLight ? '#475569' : '#cbd5e1', margin: '6px 0 0', lineHeight: 1.5 }}>
            Choose the subjects you want EduNova to personalize for your active track dashboard and Sage AI tutor.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{
            fontSize: '0.85rem',
            padding: '8px 16px',
            borderRadius: '14px',
            background: isLight ? 'rgba(54, 199, 244, 0.14)' : 'rgba(6, 182, 212, 0.18)',
            border: isLight ? '1px solid rgba(54, 199, 244, 0.4)' : '1px solid rgba(6, 182, 212, 0.4)',
            color: isLight ? '#0284c7' : '#38bdf8',
            fontWeight: 800
          }}>
            {selectedSubjects.length} Subjects Selected
          </span>
          {onDone && (
            <Button
              onClick={onDone}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                color: '#ffffff',
                fontWeight: 800,
                boxShadow: '0 6px 20px rgba(2, 132, 199, 0.3)'
              }}
            >
              Continue to Dashboard <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', width: '100%' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: isLight ? '#0284c7' : '#38bdf8' }} />
        <input
          type="text"
          placeholder="Search subjects by name or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            paddingLeft: '48px',
            height: '46px',
            borderRadius: '16px',
            background: isLight ? '#ffffff' : 'rgba(12, 16, 36, 0.8)',
            border: isLight ? '1px solid rgba(195, 215, 245, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
            color: isLight ? '#0f172a' : '#ffffff',
            fontSize: '0.9rem',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: isLight ? '0 4px 18px rgba(64, 100, 160, 0.08)' : 'none'
          }}
        />
      </div>

      {/* Subject Cards Selection Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px' }}>
        {filtered.map((subject) => {
          const isSelected = selectedIds.has(subject.id);
          const targetScoreVal = subject.targetScore || subject.defaultTargetScore || 85;
          const weeklyGoalVal = subject.weeklyGoal || subject.defaultWeeklyGoal || 4;

          return (
            <div
              key={subject.id}
              onClick={() => onToggleSubject(subject.id)}
              style={{
                background: isSelected
                  ? (isLight ? 'linear-gradient(135deg, rgba(235, 248, 255, 0.98), rgba(240, 245, 255, 0.98))' : 'rgba(6, 182, 212, 0.18)')
                  : (isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(12, 16, 36, 0.75)'),
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                border: isSelected
                  ? (isLight ? '2px solid #0284c7' : '2px solid #06b6d4')
                  : (isLight ? '1px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)'),
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                boxShadow: isSelected
                  ? (isLight ? '0 8px 25px rgba(2, 132, 199, 0.18)' : '0 6px 24px rgba(6, 182, 212, 0.25)')
                  : (isLight ? '0 4px 18px rgba(64, 100, 160, 0.06)' : 'none')
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{subject.icon || '📚'}</span>
                  <div>
                    <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: isSelected ? (isLight ? '#0284c7' : '#38bdf8') : (isLight ? '#0f172a' : '#ffffff'), margin: 0 }}>
                      {subject.name}
                    </h4>
                    <span style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : '#94a3b8', fontWeight: 600 }}>
                      {subject.grade || subject.degree || subject.level || subject.examName || subject.category || 'Subject'}
                    </span>
                  </div>
                </div>

                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isSelected
                    ? 'linear-gradient(135deg, #0284c7, #4f46e5)'
                    : (isLight ? 'rgba(235, 243, 255, 0.95)' : 'rgba(255, 255, 255, 0.08)'),
                  border: isSelected ? 'none' : (isLight ? '1px solid rgba(195, 215, 245, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: isSelected ? '0 3px 10px rgba(2, 132, 199, 0.3)' : 'none',
                  flexShrink: 0
                }}>
                  {isSelected ? <CheckCircle2 size={18} color="#ffffff" /> : <Plus size={16} color={isLight ? '#0284c7' : '#94a3b8'} />}
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: isLight ? '#475569' : '#cbd5e1', lineHeight: 1.5, margin: '8px 0 14px', height: '2.8em', overflow: 'hidden' }}>
                {subject.description || subject.shortDescription || 'Core curriculum track subject for exam and skill preparation.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8', paddingTop: '10px', borderTop: isLight ? '1px solid rgba(210, 225, 250, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span>Target: <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>{targetScoreVal}%</strong></span>
                <span>Goal: <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{weeklyGoalVal}h/wk</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelector;
