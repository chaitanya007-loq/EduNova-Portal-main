import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle, AlertCircle, Plus, Edit3, Trash2, Copy, Play, Sparkles, ChevronLeft, ChevronRight, User, Bot, Layers
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const WeeklyPlannerCalendar = ({ 
  sessions, 
  onSelectSession, 
  onCompleteSession, 
  onRescheduleSession, 
  onDeleteSession, 
  onDuplicateSession,
  onAddSessionClick 
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [viewMode, setViewMode] = useState('WEEK'); // 'DAY' | 'WEEK' | 'MONTH' | 'LIST'
  const [hoveredSessionId, setHoveredSessionId] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    { name: 'Morning', label: '7:00 AM - 12:00 PM' },
    { name: 'Afternoon', label: '12:00 PM - 5:00 PM' },
    { name: 'Evening', label: '5:00 PM - 9:00 PM' },
    { name: 'Night', label: '9:00 PM - 11:30 PM' }
  ];

  const renderSourceBadge = (source) => {
    if (source === 'manual') {
      return <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 800, background: 'rgba(56, 189, 248, 0.15)', padding: '1px 6px', borderRadius: '6px' }}>● You</span>;
    }
    if (source === 'hybrid') {
      return <span style={{ fontSize: '0.68rem', color: '#c084fc', fontWeight: 800, background: 'rgba(168, 85, 247, 0.15)', padding: '1px 6px', borderRadius: '6px' }}>✦ + ● Hybrid</span>;
    }
    return <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 800, background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '6px' }}>✦ Sage</span>;
  };

  const renderPriorityBadge = (priority) => {
    let color = '#94a3b8';
    let bg = 'rgba(148, 163, 184, 0.15)';
    if (priority === 'Critical') { color = '#f43f5e'; bg = 'rgba(244, 63, 94, 0.2)'; }
    if (priority === 'High') { color = '#f59e0b'; bg = 'rgba(245, 158, 11, 0.2)'; }
    if (priority === 'Medium') { color = '#38bdf8'; bg = 'rgba(56, 189, 248, 0.2)'; }

    return (
      <span style={{ fontSize: '0.68rem', color, background: bg, padding: '1px 6px', borderRadius: '6px', fontWeight: 800 }}>
        {priority}
      </span>
    );
  };

  return (
    <div style={{
      background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(15, 23, 42, 0.88)',
      border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '24px',
      padding: '24px',
      color: isLight ? '#18345F' : '#ffffff',
      backdropFilter: 'blur(20px)',
      boxShadow: isLight ? '0 15px 35px rgba(37, 99, 235, 0.08)' : '0 20px 40px rgba(0, 0, 0, 0.5)'
    }}>
      {/* View Switcher Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
            <Calendar size={18} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: isLight ? '#18345F' : '#ffffff' }}>Interactive Study Calendar</h3>
            <p style={{ margin: 0, color: isLight ? '#475569' : '#94a3b8', fontSize: '0.78rem' }}>Drag, edit, reschedule, or complete sessions</p>
          </div>
        </div>

        {/* DAY / WEEK / MONTH / LIST Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: isLight ? 'rgba(235, 244, 255, 0.8)' : 'rgba(5, 8, 20, 0.7)', padding: '4px', borderRadius: '12px', border: isLight ? '1px solid rgba(186, 230, 253, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
          {['DAY', 'WEEK', 'MONTH', 'LIST'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: viewMode === mode ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
                color: viewMode === mode ? '#ffffff' : isLight ? '#64748b' : '#94a3b8',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.76rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* WEEK VIEW (Default) */}
      {viewMode === 'WEEK' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '10px', overflowX: 'auto' }}>
          {daysOfWeek.map(day => {
            const daySessions = sessions.filter(s => s.day === day);
            return (
              <div
                key={day}
                style={{
                  background: isLight ? 'rgba(240, 246, 255, 0.75)' : 'rgba(5, 8, 20, 0.6)',
                  border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '16px',
                  padding: '12px',
                  minHeight: '340px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: isLight ? '1px solid rgba(203, 213, 225, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: isLight ? '#1e293b' : '#f8fafc' }}>{day.slice(0, 3)}</span>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 700 }}>{daySessions.length} sess</span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {daySessions.map(s => {
                    const isHovered = hoveredSessionId === s.id;
                    const isCompleted = s.status === 'Completed';
                    const isInProgress = s.status === 'In Progress';

                    return (
                      <div
                        key={s.id}
                        onMouseEnter={() => setHoveredSessionId(s.id)}
                        onMouseLeave={() => setHoveredSessionId(null)}
                        onClick={() => onSelectSession(s)}
                        style={{
                          background: isCompleted 
                            ? (isLight ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.12)')
                            : isInProgress 
                            ? (isLight ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.18)')
                            : (isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 41, 59, 0.8)'),
                          border: isCompleted 
                            ? '1px solid #10b981' 
                            : isInProgress 
                            ? '1px solid #06b6d4' 
                            : isLight ? '1px solid rgba(203, 213, 225, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          position: 'relative',
                          boxShadow: isHovered ? (isLight ? '0 6px 20px rgba(37, 99, 235, 0.15)' : '0 6px 20px rgba(0, 0, 0, 0.4)') : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          {renderSourceBadge(s.source)}
                          {renderPriorityBadge(s.priority)}
                        </div>

                        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: isLight ? '#0f172a' : '#fff', margin: '2px 0' }}>
                          {s.subjectName}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: isLight ? '#475569' : '#94a3b8', lineHeight: 1.3 }}>
                          {s.topic}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.7rem', color: isLight ? '#64748b' : '#64748b' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock size={11} /> {s.startTime}
                          </span>
                          <span>{s.durationMinutes}m</span>
                        </div>

                        {/* Hover Quick Actions */}
                        {isHovered && (
                          <div
                            onClick={e => e.stopPropagation()}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: isLight ? 'rgba(240, 246, 255, 0.96)' : 'rgba(15, 23, 42, 0.95)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '4px'
                            }}
                          >
                            {!isCompleted && (
                              <button
                                onClick={() => onCompleteSession(s.id)}
                                title="Mark Complete"
                                style={{ background: '#10b981', border: 'none', color: '#fff', padding: '5px', borderRadius: '6px', cursor: 'pointer' }}
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => onSelectSession(s)}
                              title="Edit Session"
                              style={{ background: '#06b6d4', border: 'none', color: '#fff', padding: '5px', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => onDuplicateSession(s.id)}
                              title="Duplicate"
                              style={{ background: '#6366f1', border: 'none', color: '#fff', padding: '5px', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => onDeleteSession(s.id)}
                              title="Delete"
                              style={{ background: '#f43f5e', border: 'none', color: '#fff', padding: '5px', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={onAddSessionClick}
                  style={{
                    width: '100%',
                    padding: '6px',
                    borderRadius: '8px',
                    background: isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.05)',
                    border: isLight ? '1px dashed rgba(148, 163, 184, 0.4)' : '1px dashed rgba(255, 255, 255, 0.2)',
                    color: isLight ? '#0369a1' : '#94a3b8',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={12} /> Add Session
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* DAY VIEW TIMELINE */}
      {viewMode === 'DAY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isLight ? 'rgba(240, 246, 255, 0.8)' : 'rgba(5, 8, 20, 0.6)', padding: '12px 16px', borderRadius: '14px', border: isLight ? '1px solid rgba(186, 230, 253, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8' }}>Today's Hourly Execution Timeline</span>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8' }}>Monday • {sessions.filter(s => s.day === 'Monday').length} Sessions Scheduled</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {timeSlots.map(slot => {
              const slotSessions = sessions.filter(s => s.day === 'Monday' && (s.slot === slot.name || (slot.name === 'Evening' && s.startTime?.includes('PM'))));
              return (
                <div key={slot.name} style={{ background: isLight ? 'rgba(240, 246, 255, 0.6)' : 'rgba(5, 8, 20, 0.5)', border: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isLight ? '#7c3aed' : '#c084fc' }}>{slot.name.toUpperCase()} ({slot.label})</span>
                    <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#64748b' }}>{slotSessions.length} items</span>
                  </div>

                  {slotSessions.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {slotSessions.map(s => (
                        <div
                          key={s.id}
                          onClick={() => onSelectSession(s)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: s.status === 'Completed' ? (isLight ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.15)') : (isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 41, 59, 0.8)'),
                            border: s.status === 'Completed' ? '1px solid #10b981' : isLight ? '1px solid rgba(186, 230, 253, 0.8)' : '1px solid rgba(56, 189, 248, 0.3)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            cursor: 'pointer'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: isLight ? '#0f172a' : '#fff' }}>{s.subjectName}</span>
                              {renderSourceBadge(s.source)}
                              {renderPriorityBadge(s.priority)}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: isLight ? '#334155' : '#cbd5e1' }}>{s.topic}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '0.8rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 700 }}>{s.startTime} ({s.durationMinutes}m)</span>
                            {s.status !== 'Completed' && (
                              <button
                                onClick={e => { e.stopPropagation(); onCompleteSession(s.id); }}
                                style={{ background: '#10b981', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700 }}
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#64748b', fontStyle: 'italic' }}>No sessions scheduled in this time window.</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MONTH VIEW GRID (Full 35-cell Month Calendar) */}
      {viewMode === 'MONTH' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isLight ? 'rgba(240, 246, 255, 0.8)' : 'rgba(5, 8, 20, 0.6)', padding: '12px 16px', borderRadius: '14px', border: isLight ? '1px solid rgba(186, 230, 253, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8' }}>September 2026 Academic Month Calendar</span>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8' }}>31 Days • {sessions.length} Scheduled Study Sessions</span>
          </div>

          {/* Month Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontWeight: 800, fontSize: '0.76rem', color: isLight ? '#475569' : '#64748b' }}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(h => <div key={h}>{h}</div>)}
          </div>

          {/* 35-Cell Month Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {Array.from({ length: 35 }).map((_, idx) => {
              const dayNum = idx - 1; // Sept 1 starts on Tuesday
              const isValidDay = dayNum >= 1 && dayNum <= 30;
              const isToday = dayNum === 19;
              
              // Map sessions to days
              const matchedSessions = isValidDay ? sessions.filter((s, sIdx) => (dayNum % 7 === sIdx % 7) || (sIdx === 0 && dayNum === 19)) : [];

              return (
                <div
                  key={idx}
                  style={{
                    background: isToday ? (isLight ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.15)') : isValidDay ? (isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(5, 8, 20, 0.6)') : (isLight ? 'rgba(226, 232, 240, 0.3)' : 'rgba(15, 23, 42, 0.3)'),
                    border: isToday ? '2px solid #06b6d4' : isValidDay ? (isLight ? '1px solid rgba(203, 213, 225, 0.8)' : '1px solid rgba(255, 255, 255, 0.06)') : '1px solid rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    minHeight: '80px',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: isValidDay ? 1 : 0.4
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: isToday ? '#0284c7' : isLight ? '#1e293b' : '#94a3b8' }}>
                      {isValidDay ? dayNum : ''}
                    </span>
                    {isToday && <span style={{ fontSize: '0.62rem', background: '#06b6d4', color: '#fff', padding: '1px 4px', borderRadius: '4px', fontWeight: 900 }}>TODAY</span>}
                  </div>

                  {isValidDay && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {matchedSessions.slice(0, 2).map((mSess, mIdx) => (
                        <div
                          key={mIdx}
                          onClick={() => onSelectSession(mSess)}
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            padding: '2px 4px',
                            borderRadius: '4px',
                            background: mSess.subjectColor || '#6366f1',
                            color: '#ffffff',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                          }}
                        >
                          {mSess.subjectName} ({mSess.durationMinutes}m)
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIST VIEW (Grouped Agenda View) */}
      {viewMode === 'LIST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isLight ? 'rgba(240, 246, 255, 0.8)' : 'rgba(5, 8, 20, 0.6)', padding: '12px 16px', borderRadius: '14px', border: isLight ? '1px solid rgba(186, 230, 253, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8' }}>Detailed Study Agenda & Status Grouping</span>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8' }}>Total: {sessions.length} Sessions</span>
          </div>

          {['In Progress', 'Upcoming', 'Completed'].map(statusGroup => {
            const groupSessions = sessions.filter(s => s.status === statusGroup || (statusGroup === 'Upcoming' && s.status === 'Rescheduled'));
            if (groupSessions.length === 0) return null;

            return (
              <div key={statusGroup} style={{ background: isLight ? 'rgba(240, 246, 255, 0.6)' : 'rgba(5, 8, 20, 0.5)', border: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '16px' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: statusGroup === 'Completed' ? '#059669' : statusGroup === 'In Progress' ? '#0284c7' : '#7c3aed', marginBottom: '12px' }}>
                  {statusGroup === 'Completed' ? '✓ COMPLETED SESSIONS' : statusGroup === 'In Progress' ? '⚡ IN PROGRESS SESSION' : '📅 UPCOMING & RESCHEDULED SESSIONS'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {groupSessions.map(s => (
                    <div
                      key={s.id}
                      onClick={() => onSelectSession(s)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: '14px',
                        background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 41, 59, 0.8)',
                        border: isLight ? '1px solid rgba(203, 213, 225, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '4px', height: '38px', borderRadius: '4px', background: s.subjectColor || '#06b6d4' }} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: isLight ? '#0f172a' : '#fff' }}>{s.subjectName}</span>
                            {renderSourceBadge(s.source)}
                            <span style={{ fontSize: '0.72rem', background: isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '6px', color: isLight ? '#334155' : '#cbd5e1' }}>{s.studyType || 'Learning'}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '2px' }}>{s.topic} • {s.day}, {s.startTime}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8' }}>{s.durationMinutes} mins</span>
                        {renderPriorityBadge(s.priority)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WeeklyPlannerCalendar;
