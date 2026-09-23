import React, { useState } from 'react';
import { Send, Repeat, GraduationCap, X } from 'lucide-react';

export const RequestExchangeModal = ({ isOpen, onClose, candidate, onSendRequest }) => {
  const [exchangeType, setExchangeType] = useState('Skill Swap');
  const [mySkillOffered, setMySkillOffered] = useState('React');
  const [frequency, setFrequency] = useState('Weekly');
  const [duration, setDuration] = useState('60 min');
  const [messageText, setMessageText] = useState('');

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestedSkill = candidate.skillsToTeach?.[0]?.name || 'UI/UX Design';
    const msg = messageText || `Hi ${candidate.name}! I noticed our strong skill match. I would love to exchange ${mySkillOffered} for ${requestedSkill}.`;

    if (onSendRequest) {
      onSendRequest(candidate, requestedSkill, mySkillOffered, msg);
    }
  };

  return (
    <div className="se-modal-overlay">
      <div className="se-modal-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Request Skill Exchange</h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>Connecting with {candidate.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Exchange Type Selector */}
          <div>
            <label className="se-form-label">
              Select Exchange Type:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setExchangeType('Skill Swap')}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  background: exchangeType === 'Skill Swap' ? 'rgba(6, 182, 212, 0.18)' : '#050814',
                  border: exchangeType === 'Skill Swap' ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.14)',
                  color: exchangeType === 'Skill Swap' ? '#38bdf8' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Repeat size={16} /> 2-Way Skill Swap
              </button>

              <button
                type="button"
                onClick={() => setExchangeType('Mentoring')}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  background: exchangeType === 'Mentoring' ? 'rgba(168, 85, 247, 0.18)' : '#050814',
                  border: exchangeType === 'Mentoring' ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.14)',
                  color: exchangeType === 'Mentoring' ? '#c084fc' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <GraduationCap size={16} /> 1-Way Mentoring
              </button>
            </div>
          </div>

          {/* Skill Pair Overview */}
          <div style={{ padding: '14px', borderRadius: '14px', background: '#050814', border: '1px solid rgba(255, 255, 255, 0.12)', fontSize: '0.85rem' }}>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8' }}>You teach:</span> <strong style={{ color: '#38bdf8' }}>{mySkillOffered}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>{candidate.name} teaches:</span> <strong style={{ color: '#c084fc' }}>{candidate.skillsToTeach?.[0]?.name || 'UI/UX Design'}</strong>
            </div>
          </div>

          {/* Frequency & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="se-form-label">Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="se-form-select">
                <option value="Weekly">Weekly (1 Session/wk)</option>
                <option value="Twice a week">Twice a week (2 Sessions/wk)</option>
                <option value="Once">One-time Intensive Session</option>
              </select>
            </div>

            <div>
              <label className="se-form-label">Session Duration</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="se-form-select">
                <option value="30 min">30 Minutes</option>
                <option value="60 min">60 Minutes (Recommended)</option>
                <option value="90 min">90 Minutes</option>
              </select>
            </div>
          </div>

          {/* Intro Message */}
          <div>
            <label className="se-form-label">
              Introductory Message:
            </label>
            <textarea
              rows={3}
              placeholder={`Hi ${candidate.name}! I would love to connect for a ${exchangeType.toLowerCase()} session...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="se-form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <button type="button" onClick={onClose} className="se-btn se-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="se-btn se-btn-primary">
              <Send size={14} /> Send Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestExchangeModal;
