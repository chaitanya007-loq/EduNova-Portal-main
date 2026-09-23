import React, { useState } from 'react';
import { BookOpen, PlayCircle, CheckCircle2, FileText, Sparkles, Clock, Zap, ChevronRight, Video, Bot } from 'lucide-react';
import { Button } from '../common/Button';

export const SubjectLessonsView = ({ subject, topics, onAskSage, onSelectMaterial }) => {
  const [completedLessons, setCompletedLessons] = useState(() => {
    const initial = {};
    topics.forEach((t, idx) => {
      if (t.completed || idx === 0) initial[t.id] = true;
    });
    return initial;
  });

  const toggleLesson = (id) => {
    setCompletedLessons(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / (topics.length || 1)) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Lesson Progress Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.15))',
        border: '1px solid var(--accent-cyan)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <BookOpen size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {subject.name} Interactive Lessons & Lectures
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Master core chapter lessons through structured video modules, concept breakdowns, and Sage AI tutoring.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Course Completion</span>
            <strong style={{ fontSize: '1.3rem', color: '#34d399', fontWeight: 900 }}>{progressPercent}%</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
              {completedCount} / {topics.length} Lessons Finished
            </span>
          </div>
          <Button onClick={() => onAskSage(`Create a 7-day lesson study plan for ${subject.name}`)}>
            <Sparkles size={16} /> 7-Day Study Plan
          </Button>
        </div>
      </div>

      {/* Lessons List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {topics.map((topic, index) => {
          const isDone = !!completedLessons[topic.id];

          return (
            <div
              key={topic.id}
              style={{
                background: isDone ? 'rgba(15, 23, 42, 0.6)' : 'var(--glass-bg)',
                border: topic.isCurrent ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px 24px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <button
                    onClick={() => toggleLesson(topic.id)}
                    style={{
                      background: isDone ? '#10b981' : 'var(--bg-tertiary)',
                      border: isDone ? 'none' : '1px solid var(--border-color)',
                      color: isDone ? '#fff' : 'var(--text-muted)',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      marginTop: '2px'
                    }}
                    title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                  >
                    {isDone ? '✓' : index + 1}
                  </button>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span className="cyber-badge-cyan" style={{ fontSize: '0.72rem' }}>Lesson {index + 1}</span>
                      {topic.isCurrent && <span className="cyber-badge-amber" style={{ fontSize: '0.72rem' }}>Current Focus</span>}
                      {topic.isWeak && <span className="cyber-badge-rose" style={{ fontSize: '0.72rem' }}>Weak Concept</span>}
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {(index + 1) * 15 + 10} mins
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 6px' }}>
                      {topic.name}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '650px' }}>
                      {topic.desc}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={isDone ? 'outline' : 'primary'}
                  onClick={() => toggleLesson(topic.id)}
                >
                  {isDone ? '✓ Completed' : 'Mark Complete'}
                </Button>
              </div>

              {/* Lesson Materials & Quick Actions Bar */}
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Video size={14} color="#38bdf8" /> Video Lecture Available
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={14} color="#34d399" /> Study Notes & Formulas
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={14} color="#fbbf24" /> +50 XP
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onAskSage(`Give me a complete video script and breakdown for lesson "${topic.name}" in ${subject.name}`)}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <PlayCircle size={14} color="#38bdf8" /> Video Lesson
                  </button>

                  <button
                    onClick={() => onAskSage(`Explain lesson "${topic.name}" step-by-step with real-world examples`)}
                    style={{
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      color: '#38bdf8',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <Bot size={14} /> Explain with Sage AI
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
