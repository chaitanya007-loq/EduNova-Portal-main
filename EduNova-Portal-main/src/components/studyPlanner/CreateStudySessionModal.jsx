import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, Tag, Flag, Check, Plus, AlertCircle } from 'lucide-react';
import { subjectService } from '../../services/subjectService';
import { useLearner } from '../../context/LearnerContext';
import { useTheme } from '../../context/ThemeContext';

export const CreateStudySessionModal = ({ isOpen, onClose, onAddSession }) => {
  const { learnerType } = useLearner();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const selectedSubjects = subjectService.getSelectedSubjects(learnerType);

  const [subjectId, setSubjectId] = useState(selectedSubjects[0]?.id || 'sub_math');
  const [chapter, setChapter] = useState('');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('07:00 PM');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [studyType, setStudyType] = useState('Learning');
  const [priority, setPriority] = useState('Medium');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const subjObj = selectedSubjects.find(s => s.id === subjectId) || { name: 'General Studies', color: '#6366f1' };

    const sessionData = {
      subjectId,
      subjectName: subjObj.name,
      subjectColor: subjObj.color || '#6366f1',
      chapter: chapter || subjObj.currentChapter || 'Chapter 1',
      topic: topic || `${subjObj.name} Core Principles`,
      date,
      day,
      startTime,
      durationMinutes: Number(durationMinutes),
      studyType,
      priority,
      notes,
      source: 'manual'
    };

    onAddSession(sessionData);
    onClose();
  };

  const inputBg = isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.8)';
  const inputBorder = isLight ? '1px solid rgba(195, 215, 245, 0.95)' : '1px solid rgba(56, 189, 248, 0.3)';
  const inputColor = isLight ? '#0f172a' : '#ffffff';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: isLight ? 'rgba(15, 23, 42, 0.4)' : 'rgba(5, 8, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 249, 255, 0.95) 100%)' : 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
        border: isLight ? '1.5px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '560px',
        padding: '28px',
        color: isLight ? '#0f172a' : '#ffffff',
        boxShadow: isLight ? '0 25px 60px rgba(64, 100, 160, 0.25)' : '0 25px 60px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '0.74rem', background: isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(6, 182, 212, 0.15)', color: isLight ? '#0284c7' : '#38bdf8', padding: '3px 10px', borderRadius: '10px', fontWeight: 700 }}>
              ● Manual Planner
            </span>
            <h2 style={{ margin: '6px 0 0 0', fontSize: '1.4rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>Create Study Session</h2>
          </div>
          <button onClick={onClose} style={{ background: isLight ? 'rgba(240, 246, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)', border: 'none', color: isLight ? '#64748b' : '#94a3b8', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Subject Dropdown */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#0284c7' : '#38bdf8', display: 'block', marginBottom: '6px' }}>Subject</label>
            <select
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              style={{
                width: '100%',
                background: inputBg,
                border: inputBorder,
                borderRadius: '12px',
                padding: '10px 14px',
                color: inputColor,
                fontSize: '0.88rem',
                outline: 'none'
              }}
            >
              {selectedSubjects.map(s => (
                <option key={s.id} value={s.id} style={{ background: isLight ? '#ffffff' : '#0f172a', color: isLight ? '#0f172a' : '#fff' }}>
                  {s.name} ({s.category || 'Core'})
                </option>
              ))}
            </select>
          </div>

          {/* Chapter & Topic */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#52668a' : '#94a3b8', display: 'block', marginBottom: '6px' }}>Chapter</label>
              <input
                type="text"
                placeholder="e.g. Chapter 4"
                value={chapter}
                onChange={e => setChapter(e.target.value)}
                style={{ width: '100%', background: inputBg, border: inputBorder, borderRadius: '12px', padding: '10px 14px', color: inputColor, fontSize: '0.86rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#52668a' : '#94a3b8', display: 'block', marginBottom: '6px' }}>Topic Title</label>
              <input
                type="text"
                placeholder="e.g. Chemical Reactions"
                value={topic}
                required
                onChange={e => setTopic(e.target.value)}
                style={{ width: '100%', background: inputBg, border: inputBorder, borderRadius: '12px', padding: '10px 14px', color: inputColor, fontSize: '0.86rem', outline: 'none' }}
              />
            </div>
          </div>

          {/* Date & Day */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#52668a' : '#94a3b8', display: 'block', marginBottom: '6px' }}>Day</label>
              <select
                value={day}
                onChange={e => setDay(e.target.value)}
                style={{ width: '100%', background: inputBg, border: inputBorder, borderRadius: '12px', padding: '10px', color: inputColor, fontSize: '0.84rem' }}
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <option key={d} value={d} style={{ background: isLight ? '#ffffff' : '#0f172a', color: isLight ? '#0f172a' : '#fff' }}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#52668a' : '#94a3b8', display: 'block', marginBottom: '6px' }}>Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                placeholder="07:00 PM"
                style={{ width: '100%', background: inputBg, border: inputBorder, borderRadius: '12px', padding: '10px', color: inputColor, fontSize: '0.84rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#52668a' : '#94a3b8', display: 'block', marginBottom: '6px' }}>Duration</label>
              <select
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                style={{ width: '100%', background: inputBg, border: inputBorder, borderRadius: '12px', padding: '10px', color: inputColor, fontSize: '0.84rem' }}
              >
                <option value={30} style={{ background: isLight ? '#ffffff' : '#0f172a', color: isLight ? '#0f172a' : '#fff' }}>30 mins</option>
                <option value={45} style={{ background: isLight ? '#ffffff' : '#0f172a', color: isLight ? '#0f172a' : '#fff' }}>45 mins</option>
                <option value={60} style={{ background: isLight ? '#ffffff' : '#0f172a', color: isLight ? '#0f172a' : '#fff' }}>60 mins (1h)</option>
                <option value={90} style={{ background: isLight ? '#ffffff' : '#0f172a', color: isLight ? '#0f172a' : '#fff' }}>90 mins (1.5h)</option>
                <option value={120} style={{ background: isLight ? '#ffffff' : '#0f172a', color: isLight ? '#0f172a' : '#fff' }}>120 mins (2h)</option>
              </select>
            </div>
          </div>

          {/* Study Type & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#52668a' : '#94a3b8', display: 'block', marginBottom: '6px' }}>Study Type</label>
              <select
                value={studyType}
                onChange={e => setStudyType(e.target.value)}
                style={{ width: '100%', background: inputBg, border: inputBorder, borderRadius: '12px', padding: '10px', color: inputColor, fontSize: '0.84rem' }}
              >
                {['Learning', 'Revision', 'Practice', 'Quiz', 'Mock Test', 'Assignment', 'Flashcards', 'Problem Solving', 'Project', 'Reading'].map(t => (
                  <option key={t} value={t} style={{ background: isLight ? '#ffffff' : '#0f172a', color: isLight ? '#0f172a' : '#fff' }}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#52668a' : '#94a3b8', display: 'block', marginBottom: '6px' }}>Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                style={{ width: '100%', background: inputBg, border: inputBorder, borderRadius: '12px', padding: '10px', color: inputColor, fontSize: '0.84rem' }}
              >
                {['Low', 'Medium', 'High', 'Critical'].map(p => (
                  <option key={p} value={p} style={{ background: isLight ? '#ffffff' : '#0f172a', color: isLight ? '#0f172a' : '#fff' }}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              marginTop: '10px',
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)'
            }}
          >
            ADD TO MY PLAN
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStudySessionModal;

