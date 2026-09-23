import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle, Plus } from 'lucide-react';
import { studyPlannerService } from '../../services/studyPlannerService';

export const AddToPlannerModal = ({ isOpen, onClose, skillObj }) => {
  const [sessionDate, setSessionDate] = useState('Today');
  const [duration, setDuration] = useState('45 mins');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !skillObj) return null;

  const skillName = skillObj.name || skillObj.topic || 'Skill Session';

  const handleSave = () => {
    try {
      studyPlannerService.addSession({
        subjectName: skillObj.category || 'Knowledge Constellation',
        topicName: skillName,
        date: sessionDate === 'Tomorrow' 
          ? new Date(Date.now() + 86400000).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        duration: duration,
        reason: `Scheduled from Knowledge Constellation for ${skillName}`
      });
    } catch (e) {
      console.warn('Unable to persist session to planner:', e);
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(5, 8, 20, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '440px', borderRadius: '24px', background: '#0c1024', border: '1.5px solid #6366f1', padding: '24px', color: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#6366f1" /> Schedule Session in Planner
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {!isSaved ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Topic / Skill</label>
              <input type="text" value={skillName} disabled style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', background: '#050814', border: '1px solid rgba(255,255,255,0.14)', color: '#38bdf8', fontWeight: 800, outline: 'none' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Scheduled Date</label>
              <select value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', background: '#050814', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', outline: 'none' }}>
                <option value="Today">Today (Evening Session)</option>
                <option value="Tomorrow">Tomorrow Morning</option>
                <option value="In 2 Days">In 2 Days</option>
                <option value="Weekend">This Weekend</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Target Duration</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', background: '#050814', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', outline: 'none' }}>
                <option value="30 mins">30 mins (Quick Sprint)</option>
                <option value="45 mins">45 mins (Standard Focus)</option>
                <option value="60 mins">60 mins (Deep Work)</option>
              </select>
            </div>

            <button onClick={handleSave} className="se-btn se-btn-primary" style={{ padding: '12px', justifyContent: 'center', marginTop: '6px' }}>
              <Plus size={16} /> Confirm & Add to Study Plan
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={44} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Added to Study Plan!</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>"{skillName}" has been scheduled for {sessionDate} ({duration}).</p>
          </div>
        )}
      </div>
    </div>
  );
};
