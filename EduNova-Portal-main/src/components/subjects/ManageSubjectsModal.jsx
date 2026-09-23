import React, { useState, useEffect } from 'react';
import { X, Settings, Trash2, Save, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ManageSubjectsModal = ({
  isOpen,
  onClose,
  selectedSubjects = [],
  onUpdateConfig,
  onRemoveSubject,
  onOpenSelector
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [editingId, setEditingId] = useState(null);
  const [targetScore, setTargetScore] = useState(90);
  const [weeklyGoal, setWeeklyGoal] = useState(4);
  const [priority, setPriority] = useState('High');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStartEdit = (subj) => {
    setEditingId(subj.id);
    setTargetScore(subj.targetScore || subj.defaultTargetScore || 90);
    setWeeklyGoal(subj.weeklyGoal || subj.defaultWeeklyGoal || 4);
    setPriority(subj.priority || subj.defaultPriority || 'High');
  };

  const handleSave = (subjId) => {
    if (onUpdateConfig) {
      onUpdateConfig(subjId, {
        targetScore: Number(targetScore),
        defaultTargetScore: Number(targetScore),
        weeklyGoal: Number(weeklyGoal),
        defaultWeeklyGoal: Number(weeklyGoal),
        priority: priority,
        defaultPriority: priority
      });
    }
    setEditingId(null);
  };

  const handleRemove = (subjId) => {
    if (editingId === subjId) {
      setEditingId(null);
    }
    if (onRemoveSubject) {
      onRemoveSubject(subjId);
    }
  };

  const getPriorityColor = (pLevel) => {
    if (pLevel === 'High') return isLight ? '#0284c7' : '#38bdf8';
    if (pLevel === 'Medium') return isLight ? '#d97706' : '#fbbf24';
    return isLight ? '#059669' : '#34d399';
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(5, 8, 20, 0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div
        style={{
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 249, 255, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(20, 28, 58, 0.96) 0%, rgba(14, 18, 42, 0.98) 100%)',
          border: isLight ? '1.5px solid rgba(210, 225, 250, 0.95)' : '1.5px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '28px',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '28px',
          boxShadow: isLight
            ? '0 25px 60px rgba(15, 23, 42, 0.22), 0 0 40px rgba(56, 189, 248, 0.15)'
            : '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(99, 102, 241, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: isLight ? 'rgba(56, 189, 248, 0.15)' : 'rgba(56, 189, 248, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isLight ? '#0284c7' : '#38bdf8'
              }}
            >
              <Settings size={22} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  margin: 0,
                  color: isLight ? '#0f172a' : '#ffffff',
                  letterSpacing: '-0.01em'
                }}
              >
                Manage Selected Subjects
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)',
              border: isLight ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isLight ? '#475569' : '#cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: isLight ? '#475569' : '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
          Set your study priorities, target scores, and weekly hours for each subject.
        </p>

        {/* Selected Subjects List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {selectedSubjects.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '30px 20px',
                background: isLight ? 'rgba(240, 246, 255, 0.6)' : 'rgba(255, 255, 255, 0.04)',
                borderRadius: '20px',
                border: isLight ? '1px dashed rgba(210, 225, 250, 0.9)' : '1px dashed rgba(255, 255, 255, 0.15)',
                color: isLight ? '#64748b' : '#94a3b8',
                fontSize: '0.9rem'
              }}
            >
              No subjects currently selected. Click "+ Add More Subjects" below to choose your active curriculum.
            </div>
          ) : (
            selectedSubjects.map((subj) => {
              const isEditing = editingId === subj.id;
              const currentPriority = subj.priority || subj.defaultPriority || 'High';
              const currentTarget = subj.targetScore || subj.defaultTargetScore || 90;
              const currentWeekly = subj.weeklyGoal || subj.defaultWeeklyGoal || 4;

              return (
                <div
                  key={subj.id}
                  style={{
                    background: isLight
                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(243, 247, 255, 0.85) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '20px',
                    border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: isLight ? '0 4px 14px rgba(100, 130, 200, 0.08)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{subj.icon || '📚'}</span>
                      <div>
                        <strong
                          style={{
                            fontSize: '1rem',
                            color: isLight ? '#0f172a' : '#ffffff',
                            display: 'block',
                            fontWeight: 800
                          }}
                        >
                          {subj.name}
                        </strong>
                        <span style={{ fontSize: '0.82rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                          Priority:{' '}
                          <span style={{ color: getPriorityColor(currentPriority), fontWeight: 800 }}>
                            {currentPriority}
                          </span>{' '}
                          • Target: <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{currentTarget}%</strong> • Goal:{' '}
                          <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{currentWeekly}h/wk</strong>
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {!isEditing ? (
                        <button
                          onClick={() => handleStartEdit(subj)}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '999px',
                            background: isLight ? 'rgba(238, 242, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)',
                            border: isLight ? '1px solid rgba(199, 210, 254, 0.9)' : '1px solid rgba(255, 255, 255, 0.18)',
                            color: isLight ? '#1e40af' : '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Configure
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSave(subj.id)}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '999px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.84rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                          }}
                        >
                          <Save size={14} /> Save
                        </button>
                      )}

                      <button
                        onClick={() => handleRemove(subj.id)}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: 'rgba(244, 63, 94, 0.12)',
                          border: '1px solid rgba(244, 63, 94, 0.25)',
                          color: '#e11d48',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        title="Remove Subject"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Inline Editing Controls */}
                  {isEditing && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: '12px',
                        paddingTop: '12px',
                        borderTop: isLight ? '1px solid rgba(210, 225, 250, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)'
                      }}
                    >
                      <div>
                        <label style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                          Priority
                        </label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          style={{
                            width: '100%',
                            fontSize: '0.84rem',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.9)',
                            border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.2)',
                            color: isLight ? '#0f172a' : '#ffffff',
                            outline: 'none',
                            fontWeight: 600
                          }}
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                          Target Score %
                        </label>
                        <input
                          type="number"
                          min="50"
                          max="100"
                          value={targetScore}
                          onChange={(e) => setTargetScore(e.target.value)}
                          style={{
                            width: '100%',
                            fontSize: '0.84rem',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.9)',
                            border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.2)',
                            color: isLight ? '#0f172a' : '#ffffff',
                            outline: 'none',
                            fontWeight: 600
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.76rem', color: isLight ? '#64748b' : '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                          Weekly Goal (hrs)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="40"
                          value={weeklyGoal}
                          onChange={(e) => setWeeklyGoal(e.target.value)}
                          style={{
                            width: '100%',
                            fontSize: '0.84rem',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.9)',
                            border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.2)',
                            color: isLight ? '#0f172a' : '#ffffff',
                            outline: 'none',
                            fontWeight: 600
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
            paddingTop: '16px',
            borderTop: isLight ? '1px solid rgba(210, 225, 250, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <button
            onClick={onOpenSelector}
            style={{
              padding: '10px 22px',
              borderRadius: '999px',
              background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
              border: isLight ? '1.5px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(255, 255, 255, 0.2)',
              color: isLight ? '#0f172a' : '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: isLight ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={16} /> Add More Subjects
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '10px 28px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageSubjectsModal;

