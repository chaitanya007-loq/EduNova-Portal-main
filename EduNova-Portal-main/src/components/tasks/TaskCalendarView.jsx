import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const TaskCalendarView = ({ tasks = [], onSelectTask }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays, year, month };
  };

  const { firstDay, totalDays, year, month } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const daysGrid = [];
  for (let i = 0; i < firstDay; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push(d);
  }

  const getTasksForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  return (
    <div style={{
      background: isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(15, 23, 42, 0.72)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '32px'
    }}>
      {/* Calendar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalIcon size={22} color="#38bdf8" /> {monthNames[month]} {year}
        </h3>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={prevMonth}
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)',
              border: 'none',
              color: isLight ? '#0f172a' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextMonth}
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)',
              border: 'none',
              color: isLight ? '#0f172a' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday Names */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '12px', textAlign: 'center' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(w => (
          <div key={w} style={{ fontSize: '0.8rem', fontWeight: 800, color: isLight ? '#64748b' : '#94a3b8' }}>
            {w}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {daysGrid.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} style={{ minHeight: '90px', borderRadius: '16px', background: 'transparent' }} />;
          }

          const dayTasks = getTasksForDay(day);
          const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

          return (
            <div
              key={`day-${day}`}
              style={{
                minHeight: '100px',
                borderRadius: '16px',
                padding: '8px',
                background: isToday
                  ? (isLight ? 'rgba(56, 189, 248, 0.12)' : 'rgba(56, 189, 248, 0.18)')
                  : (isLight ? '#ffffff' : 'rgba(255,255,255,0.04)'),
                border: isToday
                  ? '2px solid #38bdf8'
                  : (isLight ? '1px solid rgba(220,230,245,0.8)' : '1px solid rgba(255,255,255,0.08)'),
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: isToday ? 900 : 700, color: isToday ? '#38bdf8' : (isLight ? '#0f172a' : '#ffffff'), marginBottom: '6px' }}>
                {day}
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                {dayTasks.map(t => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask && onSelectTask(t)}
                    style={{
                      padding: '4px 6px',
                      borderRadius: '8px',
                      background: t.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                      border: t.status === 'COMPLETED' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: isLight ? '#0f172a' : '#ffffff',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TaskCalendarView;
