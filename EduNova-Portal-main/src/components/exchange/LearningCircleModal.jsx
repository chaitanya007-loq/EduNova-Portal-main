import React, { useState } from 'react';
import { X, Users, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const LearningCircleModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [circleName, setCircleName] = useState('React Beginners Mastery Circle');
  const [topic, setTopic] = useState('React & Frontend Architecture');
  const [maxMembers, setMaxMembers] = useState(6);
  const [description, setDescription] = useState('A focused study circle for students mastering React state management, hooks, and component architecture.');
  const [created, setCreated] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    setCreated(true);
  };

  return (
    <div className="se-modal-overlay">
      <div className="se-modal-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: isLight ? 'rgba(147, 51, 234, 0.12)' : 'rgba(168, 85, 247, 0.15)', color: isLight ? '#7e22ce' : '#c084fc' }}>
              <Users size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>Create Learning Circle</h3>
              <p style={{ fontSize: '0.78rem', color: isLight ? '#52668a' : '#94a3b8', margin: 0 }}>Collaborative study group for 4–8 peers</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#64748b' : '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {created ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: '0 0 4px 0' }}>Learning Circle Published!</h4>
            <p style={{ fontSize: '0.82rem', color: isLight ? '#52668a' : '#94a3b8', marginBottom: '24px' }}>Your circle "{circleName}" is now active and accepting peer members.</p>
            <button onClick={onClose} className="se-btn se-btn-purple">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="se-form-label">
                Circle Name
              </label>
              <input
                type="text"
                value={circleName}
                onChange={(e) => setCircleName(e.target.value)}
                className="se-form-input"
              />
            </div>

            <div>
              <label className="se-form-label">
                Primary Skill / Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="se-form-input"
              />
            </div>

            <div>
              <label className="se-form-label">
                Maximum Members
              </label>
              <select
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="se-form-select"
              >
                <option value={4}>4 Students</option>
                <option value={6}>6 Students (Recommended)</option>
                <option value={8}>8 Students</option>
              </select>
            </div>

            <div>
              <label className="se-form-label">
                Circle Goal & Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="se-form-textarea"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)' }}>
              <button type="button" onClick={onClose} className="se-btn se-btn-secondary">
                Cancel
              </button>
              <button type="submit" className="se-btn se-btn-purple">
                Publish Circle
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

