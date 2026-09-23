import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Calendar, AlertCircle, Plus } from 'lucide-react';
import { Button } from '../../common/Button';
import homeworkTestService from '../../../services/homeworkTestService';

export const HomeworkTrackerWidget = () => {
  const navigate = useNavigate();
  const [homework, setHomework] = useState(homeworkTestService.getHomework());

  const handleToggle = (id) => {
    const updated = homeworkTestService.toggleHomeworkStatus(id);
    setHomework(updated);
  };

  return (
    <div style={{
      background: 'var(--glass-bg)',
      padding: '24px',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color="#06b6d4" /> Homework & Assignments
        </h3>
        <Button size="xs" variant="outline" onClick={() => navigate('/study-planner')}>
          <Plus size={12} /> Add Task
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {homework.map((item) => {
          const isDone = item.status === 'Completed';
          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              style={{
                background: 'var(--bg-secondary)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  border: isDone ? 'none' : '2px solid var(--text-muted)',
                  background: isDone ? '#10b981' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 900
                }}>
                  {isDone && '✓'}
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: isDone ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {item.title}
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {item.subject} • Due {item.dueDate}
                  </span>
                </div>
              </div>

              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                background: item.priority === 'High' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                color: item.priority === 'High' ? '#f43f5e' : '#818cf8'
              }}>
                {item.priority}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeworkTrackerWidget;
