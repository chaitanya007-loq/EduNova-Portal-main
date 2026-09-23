import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, Clock, Tag, Sparkles, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const CreateTaskModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [subject, setSubject] = useState(initialData?.subject || 'Physics (Science)');
  const [topic, setTopic] = useState(initialData?.topic || '');
  const [type, setType] = useState(initialData?.type || 'Study');
  const [priority, setPriority] = useState(initialData?.priority || 'MEDIUM');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || new Date().toISOString().split('T')[0]);
  const [estimatedDuration, setEstimatedDuration] = useState(initialData?.estimatedDuration || 30);
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'Medium');
  const [isImportant, setIsImportant] = useState(initialData?.isImportant || false);
  const [notes, setNotes] = useState(initialData?.notes || '');
  
  // Subtasks list
  const [subtasks, setSubtasks] = useState(initialData?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([...subtasks, { id: `st-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description,
      subject,
      topic,
      type,
      priority,
      dueDate,
      estimatedDuration,
      difficulty,
      isImportant,
      notes,
      subtasks
    });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 22, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
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
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
        borderRadius: '28px',
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 246, 255, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(20, 30, 65, 0.95) 0%, rgba(12, 18, 42, 0.98) 100%)',
        border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 65px rgba(0,0,0,0.5)',
        padding: '28px 32px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ✦ EduNova Task Planner
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '4px 0 0 0' }}>
              {initialData ? 'Edit Learning Task' : 'Create New Learning Task'}
            </h2>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Solve Quadratic Equations Problem Set 4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '16px',
                background: isLight ? '#ffffff' : 'rgba(255,255,255,0.08)',
                border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.15)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Subject & Topic */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: isLight ? '#ffffff' : 'rgba(255,255,255,0.08)',
                  border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.15)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="Physics (Science)" style={{ background: '#0f172a' }}>Physics (Science)</option>
                <option value="Mathematics" style={{ background: '#0f172a' }}>Mathematics</option>
                <option value="Chemistry" style={{ background: '#0f172a' }}>Chemistry</option>
                <option value="Database Systems" style={{ background: '#0f172a' }}>Database Systems</option>
                <option value="Web Development" style={{ background: '#0f172a' }}>Web Development</option>
                <option value="General" style={{ background: '#0f172a' }}>General</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Topic / Chapter
              </label>
              <input
                type="text"
                placeholder="e.g. Kinematics"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: isLight ? '#ffffff' : 'rgba(255,255,255,0.08)',
                  border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.15)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Type & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Task Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: isLight ? '#ffffff' : 'rgba(255,255,255,0.08)',
                  border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.15)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="Study" style={{ background: '#0f172a' }}>📖 Study</option>
                <option value="Assignment" style={{ background: '#0f172a' }}>📝 Assignment</option>
                <option value="Revision" style={{ background: '#0f172a' }}>⚡ Revision</option>
                <option value="Practice" style={{ background: '#0f172a' }}>🧪 Practice</option>
                <option value="Exam Preparation" style={{ background: '#0f172a' }}>🎯 Exam Prep</option>
                <option value="Project" style={{ background: '#0f172a' }}>💻 Project</option>
                <option value="Quiz" style={{ background: '#0f172a' }}>❓ Quiz</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: isLight ? '#ffffff' : 'rgba(255,255,255,0.08)',
                  border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.15)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="LOW" style={{ background: '#0f172a' }}>🟢 Low Priority</option>
                <option value="MEDIUM" style={{ background: '#0f172a' }}>🟡 Medium Priority</option>
                <option value="HIGH" style={{ background: '#0f172a' }}>🟠 High Priority</option>
                <option value="URGENT" style={{ background: '#0f172a' }}>🔴 Urgent Priority</option>
              </select>
            </div>
          </div>

          {/* Due Date & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: isLight ? '#ffffff' : 'rgba(255,255,255,0.08)',
                  border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.15)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Est. Duration (Minutes)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: isLight ? '#ffffff' : 'rgba(255,255,255,0.08)',
                  border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.15)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Subtasks Builder */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', display: 'block', marginBottom: '6px' }}>
              Subtasks Checklist
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Add subtask step..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '14px',
                  background: isLight ? '#ffffff' : 'rgba(255,255,255,0.06)',
                  border: isLight ? '1px solid rgba(200,220,240,0.9)' : '1px solid rgba(255,255,255,0.12)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                style={{
                  padding: '10px 16px',
                  borderRadius: '14px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                + Add
              </button>
            </div>

            {subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {subtasks.map((st) => (
                  <div key={st.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '12px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.85rem', color: isLight ? '#0f172a' : '#ffffff' }}>• {st.title}</span>
                    <button type="button" onClick={() => handleRemoveSubtask(st.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
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
              type="submit"
              style={{
                padding: '12px 28px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
                color: '#ffffff',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)'
              }}
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateTaskModal;
