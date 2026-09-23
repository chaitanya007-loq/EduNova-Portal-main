import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const MeetingCalendarView = ({ meetings = [], onOpenScheduler, onJoinMeeting }) => {
  const [viewMode, setViewMode] = useState('Month'); // 'Month' | 'Week' | 'Day'
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  return (
    <div style={{
      borderRadius: '24px',
      background: isLight
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 246, 255, 0.92) 100%)'
        : 'rgba(12, 16, 36, 0.95)',
      border: isLight
        ? '1.5px solid rgba(226, 232, 240, 0.9)'
        : '1px solid rgba(255, 255, 255, 0.14)',
      padding: '24px',
      boxShadow: isLight
        ? '0 16px 40px rgba(0, 0, 0, 0.06)'
        : '0 16px 40px rgba(0,0,0,0.5)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Calendar Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justify: 'space-between',
        gap: '16px',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: isLight
          ? '1px solid rgba(226, 232, 240, 0.8)'
          : '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '10px',
            borderRadius: '16px',
            background: isLight ? 'rgba(2, 132, 199, 0.1)' : 'rgba(6, 182, 212, 0.12)',
            border: isLight ? '1px solid rgba(2, 132, 199, 0.25)' : '1px solid rgba(6, 182, 212, 0.3)',
            color: isLight ? '#0284c7' : '#38bdf8'
          }}>
            <CalendarIcon size={22} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: isLight ? '#0f172a' : '#ffffff',
              margin: 0
            }}>Peer Learning Schedule</h3>
            <p style={{
              fontSize: '0.8rem',
              color: isLight ? '#475569' : '#94a3b8',
              margin: '4px 0 0 0'
            }}>View upcoming sessions and schedule mutually available slots</p>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: isLight ? '#f1f5f9' : '#050814',
          padding: '4px',
          borderRadius: '14px',
          border: isLight ? '1px solid rgba(203, 213, 225, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          {['Month', 'Week', 'Day'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: viewMode === mode ? (isLight ? '#0284c7' : '#06b6d4') : 'transparent',
                color: viewMode === mode ? '#ffffff' : (isLight ? '#475569' : '#94a3b8')
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Meetings List / Grid */}
      {meetings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          border: isLight ? '1px dashed rgba(203, 213, 225, 0.9)' : '1px dashed rgba(255, 255, 255, 0.14)',
          borderRadius: '20px',
          background: isLight ? 'rgba(248, 250, 252, 0.6)' : 'transparent',
          color: isLight ? '#475569' : '#94a3b8'
        }}>
          <Clock size={40} color={isLight ? '#0284c7' : '#64748b'} style={{ margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: isLight ? '#0f172a' : '#e2e8f0', margin: 0 }}>No upcoming meetings scheduled</h4>
          <p style={{ fontSize: '0.8rem', color: isLight ? '#475569' : '#94a3b8', maxWidth: '360px', margin: '6px auto 0 auto' }}>
            Connect with a compatible peer and schedule a mutually available session.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {meetings.map((m) => (
            <div
              key={m.id}
              style={{
                padding: '20px',
                borderRadius: '20px',
                background: isLight ? '#ffffff' : '#050814',
                border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: isLight ? '0 4px 14px rgba(0,0,0,0.04)' : '0 8px 24px rgba(0,0,0,0.3)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="se-tag-cyan" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                    {m.type || '1-to-1 Learning'}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: isLight ? '#64748b' : '#94a3b8', fontWeight: 600 }}>{m.date}</span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 12px 0', lineHeight: 1.3 }}>
                  {m.title}
                </h4>

                {/* Participant Avatar & Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <img
                    src={m.participantAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
                    alt={m.participantName}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: isLight ? '1px solid rgba(203, 213, 225, 0.8)' : '1px solid rgba(255, 255, 255, 0.2)', flexShrink: 0 }}
                  />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', display: 'block' }}>{m.participantName}</span>
                    <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>Peer Educator</span>
                  </div>
                </div>

                {/* Time & Duration */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '12px', background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.05)', border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.78rem', color: isLight ? '#334155' : '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color={isLight ? '#0284c7' : '#38bdf8'} />
                    <span>{m.startTime} – {m.endTime}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>{m.duration || 60} min</span>
                </div>
              </div>

              {/* Join Button */}
              <div style={{ paddingTop: '10px', borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                <button
                  onClick={() => onJoinMeeting(m)}
                  className="se-btn se-btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.82rem' }}
                >
                  <Video size={16} />
                  Join Meeting Workspace
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
