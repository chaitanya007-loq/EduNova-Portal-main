import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const PlanMyDayModal = ({ isOpen, onClose, onAcceptPlan }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [proposedSchedule, setProposedSchedule] = useState([
    {
      time: '09:00 AM – 09:45 AM',
      title: 'Physics Trajectory Equations & Vector Review',
      subject: 'Physics (Science)',
      type: 'Study',
      priority: 'HIGH'
    },
    {
      time: '10:00 AM – 11:00 AM',
      title: 'Mathematics Quadratic Assignment Problem Set 4B',
      subject: 'Mathematics',
      type: 'Assignment',
      priority: 'URGENT'
    },
    {
      time: '02:00 PM – 02:40 PM',
      title: 'SQL Normalization Lab Practice Sprint',
      subject: 'Database Systems',
      type: 'Practice',
      priority: 'MEDIUM'
    },
    {
      time: '05:00 PM – 05:30 PM',
      title: 'Game Center Daily Challenge & Formula Rush',
      subject: 'Physics',
      type: 'Quiz',
      priority: 'MEDIUM'
    }
  ]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 22, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          borderRadius: '28px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 246, 255, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(20, 30, 65, 0.95) 0%, rgba(12, 18, 42, 0.98) 100%)',
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 65px rgba(0,0,0,0.5)',
          padding: '28px 32px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} color="#c084fc" />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c084fc', letterSpacing: '0.05em' }}>
                ✨ SAGE AI DAILY SCHEDULE GENERATOR
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                Proposed Optimal Daily Schedule
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)',
              border: 'none',
              color: isLight ? '#0f172a' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: isLight ? '#475569' : '#cbd5e1', marginBottom: '20px', lineHeight: 1.5 }}>
          Sage AI analyzed your upcoming due dates, weak topics, and active goals to craft this balanced daily schedule. You are in full control — confirm to add these sessions to your task planner.
        </p>

        {/* Schedule Slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {proposedSchedule.map((slot, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '16px',
                background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.06)',
                border: isLight ? '1px solid rgba(200, 220, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ padding: '6px 12px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 800, fontSize: '0.78rem' }}>
                  {slot.time}
                </div>
                <div>
                  <strong style={{ fontSize: '0.92rem', color: isLight ? '#0f172a' : '#ffffff', display: 'block' }}>
                    {slot.title}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                    {slot.subject} • {slot.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 20px',
              borderRadius: '9999px',
              background: 'transparent',
              border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.2)',
              color: isLight ? '#475569' : '#cbd5e1',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onAcceptPlan(proposedSchedule); onClose(); }}
            style={{
              padding: '12px 28px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={18} /> Accept All Proposed Tasks
          </button>
        </div>
      </div>
    </div>
  );
};
export default PlanMyDayModal;
