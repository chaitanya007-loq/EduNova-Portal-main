import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Play, MoreVertical, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const TaskKanbanBoard = ({ tasks = [], onUpdateStatus, onDeleteTask, onStartFocus }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const columns = [
    { id: 'NOT_STARTED', title: 'Not Started', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.08)' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.08)' },
    { id: 'COMPLETED', title: 'Completed', color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    }}>
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);

        return (
          <div
            key={col.id}
            style={{
              background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: isLight ? '1.5px solid rgba(200, 220, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '24px',
              padding: '20px',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: `2px solid ${col.color}44`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                  {col.title}
                </h3>
              </div>
              <span style={{
                padding: '3px 10px',
                borderRadius: '9999px',
                background: `${col.color}22`,
                color: col.color,
                fontWeight: 900,
                fontSize: '0.8rem'
              }}>
                {colTasks.length}
              </span>
            </div>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {colTasks.length === 0 ? (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.85rem' }}>
                  No tasks in this column
                </div>
              ) : (
                colTasks.map(t => {
                  const completedSub = (t.subtasks || []).filter(s => s.completed).length;
                  const totalSub = (t.subtasks || []).length;

                  return (
                    <div
                      key={t.id}
                      style={{
                        background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.06)',
                        border: isLight ? '1px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '18px',
                        padding: '16px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '8px',
                          background: isLight ? 'rgba(2, 132, 199, 0.1)' : 'rgba(56, 189, 248, 0.15)',
                          color: isLight ? '#0284c7' : '#38bdf8',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          {t.subject}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={() => onDeleteTask(t.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                        {t.title}
                      </h4>

                      {t.topic && (
                        <p style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#cbd5e1', margin: '0 0 12px 0' }}>
                          📌 {t.topic}
                        </p>
                      )}

                      {/* Subtask Progress Bar */}
                      {totalSub > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: isLight ? '#64748b' : '#94a3b8', marginBottom: '4px' }}>
                            <span>Subtasks</span>
                            <span>{completedSub}/{totalSub}</span>
                          </div>
                          <div style={{ width: '100%', height: '5px', borderRadius: '4px', background: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                            <div style={{ width: `${(completedSub/totalSub)*100}%`, height: '100%', background: '#38bdf8' }} />
                          </div>
                        </div>
                      )}

                      {/* Card Footer Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255,255,255,0.08)' }}>
                        <select
                          value={t.status}
                          onChange={(e) => onUpdateStatus(t.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '8px',
                            background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: isLight ? '#334155' : '#cbd5e1',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="NOT_STARTED" style={{ background: '#0f172a' }}>Not Started</option>
                          <option value="IN_PROGRESS" style={{ background: '#0f172a' }}>In Progress</option>
                          <option value="COMPLETED" style={{ background: '#0f172a' }}>Completed</option>
                        </select>

                        {t.status !== 'COMPLETED' && (
                          <button
                            onClick={() => onStartFocus(t)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '9999px',
                              background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Play size={12} fill="#ffffff" /> Focus
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default TaskKanbanBoard;
