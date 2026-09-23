import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Circle, Sparkles, Send, BookOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const FocusModeModal = ({ isOpen, onClose, task, onCompleteTask }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const initialSeconds = (task?.estimatedDuration || 25) * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  // Sage AI drawer state
  const [sageQuery, setSageQuery] = useState('');
  const [sageMessages, setSageMessages] = useState([
    { sender: 'sage', text: `Hi! I'm Sage AI. I'm here while you focus on "${task?.title || 'your task'}". Ask me any doubts!` }
  ]);

  // Scratchpad notes
  const [notes, setNotes] = useState(task?.notes || '');

  // Subtasks local state
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);

  useEffect(() => {
    if (task) {
      setSecondsLeft((task.estimatedDuration || 25) * 60);
      setSubtasks(task.subtasks || []);
    }
  }, [task]);

  useEffect(() => {
    let timer = null;
    if (isActive && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, secondsLeft]);

  if (!isOpen || !task) return null;

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleSubtask = (stId) => {
    setSubtasks(subtasks.map(s => s.id === stId ? { ...s, completed: !s.completed } : s));
  };

  const handleAskSage = (e) => {
    e.preventDefault();
    if (!sageQuery.trim()) return;

    const q = sageQuery;
    setSageMessages(prev => [...prev, { sender: 'user', text: q }]);
    setSageQuery('');

    setTimeout(() => {
      setSageMessages(prev => [
        ...prev,
        {
          sender: 'sage',
          text: `Great question regarding "${task.subject}"! For ${q}, recall that key principles involve breaking down vector components and applying conservation equations.`
        }
      ]);
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: isLight ? 'rgba(240, 246, 255, 0.98)' : 'rgba(5, 8, 22, 0.96)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 32px'
    }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ padding: '4px 14px', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', fontWeight: 800, fontSize: '0.8rem' }}>
            ⏱️ FOCUS MODE ACTIVE
          </span>
          <span style={{ fontSize: '0.9rem', color: isLight ? '#475569' : '#cbd5e1', fontWeight: 700 }}>
            {task.subject} • {task.topic || 'General Topic'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => { onCompleteTask(task.id); onClose(); }}
            style={{
              padding: '10px 22px',
              borderRadius: '9999px',
              background: '#10b981',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
            }}
          >
            ✓ Complete Task
          </button>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
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
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Grid: Timer on Left, Task Checklist & Sage AI on Right */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', minHeight: 0 }}>
        {/* Left Column: Huge Pomodoro Timer Display */}
        <div style={{
          background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.75)',
          borderRadius: '32px',
          border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', textAlign: 'center', margin: '0 0 16px 0' }}>
            {task.title}
          </h1>

          {/* Countdown Clock Ring */}
          <div style={{
            position: 'relative',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: isLight
              ? 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)'
              : 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '4px solid #38bdf8',
            boxShadow: '0 0 45px rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px'
          }}>
            <span style={{ fontSize: '4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', fontFamily: 'monospace', letterSpacing: '-2px' }}>
              {formatTime(secondsLeft)}
            </span>
          </div>

          {/* Timer Controls */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setIsActive(!isActive)}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(56, 189, 248, 0.4)'
              }}
            >
              {isActive ? <Pause size={28} /> : <Play size={28} fill="#ffffff" style={{ marginLeft: '4px' }} />}
            </button>

            <button
              onClick={() => { setIsActive(false); setSecondsLeft(initialSeconds); }}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)',
                color: isLight ? '#0f172a' : '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        {/* Right Column: Subtasks & Sage AI Assistant */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 0 }}>
          {/* Subtasks Checklist */}
          <div style={{
            background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.75)',
            borderRadius: '24px',
            border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
            padding: '20px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 12px 0' }}>
              Subtask Checklist
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1 }}>
              {subtasks.length === 0 ? (
                <span style={{ fontSize: '0.85rem', color: isLight ? '#64748b' : '#94a3b8' }}>No subtasks created for this task.</span>
              ) : (
                subtasks.map(s => (
                  <div
                    key={s.id}
                    onClick={() => toggleSubtask(s.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      background: isLight ? '#ffffff' : 'rgba(255,255,255,0.06)',
                      cursor: 'pointer'
                    }}
                  >
                    {s.completed ? <CheckCircle2 size={18} color="#10b981" /> : <Circle size={18} color="#94a3b8" />}
                    <span style={{ fontSize: '0.9rem', color: isLight ? '#0f172a' : '#ffffff', textDecoration: s.completed ? 'line-through' : 'none' }}>
                      {s.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sage AI Focus Companion */}
          <div style={{
            background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.75)',
            borderRadius: '24px',
            border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
            padding: '20px',
            height: '240px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Sparkles size={16} color="#c084fc" />
              <strong style={{ fontSize: '0.92rem', color: isLight ? '#0f172a' : '#ffffff' }}>Sage AI Focus Assistant</strong>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              {sageMessages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    padding: '8px 12px',
                    borderRadius: '14px',
                    background: m.sender === 'user' ? '#0284c7' : (isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)'),
                    color: m.sender === 'user' ? '#ffffff' : (isLight ? '#0f172a' : '#ffffff'),
                    fontSize: '0.82rem',
                    maxWidth: '85%'
                  }}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleAskSage} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Ask Sage a doubt..."
                value={sageQuery}
                onChange={(e) => setSageQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  background: isLight ? '#ffffff' : 'rgba(255,255,255,0.08)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.15)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button type="submit" style={{ padding: '8px 14px', borderRadius: '9999px', background: '#38bdf8', color: '#ffffff', border: 'none', cursor: 'pointer' }}>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FocusModeModal;
