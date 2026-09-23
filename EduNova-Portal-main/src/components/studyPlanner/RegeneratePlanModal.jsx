import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Bot, Sparkles, Check, Clock, Calendar, Target, Sliders } from 'lucide-react';
import { studyPlannerService } from '../../services/studyPlannerService';

export const RegeneratePlanModal = ({ isOpen, onClose, currentPlan, onPlanRegenerated }) => {
  const [goal, setGoal] = useState(currentPlan?.goal || 'B.Tech CSE Semester 4 Core Mastery');
  const [availableHours, setAvailableHours] = useState(currentPlan?.availableHours || 8);
  const [studyDays, setStudyDays] = useState(currentPlan?.studyDays || 5);
  const [preferredTime, setPreferredTime] = useState(currentPlan?.preferredTime || 'Evening (6 PM - 9 PM)');
  const [difficulty, setDifficulty] = useState(currentPlan?.difficulty || 'Intermediate');
  const [targetDate, setTargetDate] = useState(currentPlan?.targetDate || '2026-11-15');

  const [generating, setGenerating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Analyzing your selected subjects...',
    'Checking your progress & weak areas...',
    'Balancing your weekly study time...',
    'Creating your personalized schedule...'
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setStepIndex(0);

    // Step animations
    for (let i = 0; i < steps.length; i++) {
      setStepIndex(i);
      await new Promise(r => setTimeout(r, 450));
    }

    const newPlan = await studyPlannerService.regeneratePlanWithAI({
      goal,
      availableHours: parseInt(availableHours, 10) || 8,
      studyDays: parseInt(studyDays, 10) || 5,
      preferredTime,
      difficulty,
      targetDate
    });

    setGenerating(false);
    onPlanRegenerated(newPlan);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customize AI Study Plan">
      {!generating ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Target size={14} color="var(--accent-primary)" /> Primary Target Goal
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Master Full Stack Development or Score 95% in Boards"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} color="#38bdf8" /> Available Hours / Week
              </label>
              <input
                type="number"
                min="2"
                max="40"
                value={availableHours}
                onChange={(e) => setAvailableHours(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} color="#34d399" /> Study Days / Week
              </label>
              <select
                value={studyDays}
                onChange={(e) => setStudyDays(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                <option value={5}>5 Days (Mon - Fri)</option>
                <option value={7}>7 Days (Mon - Sun)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sliders size={14} color="#f59e0b" /> Preferred Study Slot
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                <option value="Morning (8 AM - 12 PM)">Morning (8 AM - 12 PM)</option>
                <option value="Afternoon (1 PM - 5 PM)">Afternoon (1 PM - 5 PM)</option>
                <option value="Evening (6 PM - 9 PM)">Evening (6 PM - 9 PM)</option>
                <option value="Night (9 PM - 12 AM)">Night (9 PM - 12 AM)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} color="#a855f7" /> Target / Exam Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Bot size={18} /> Generate AI Schedule
            </Button>
          </div>
        </form>
      ) : (
        /* AI Generation Loading Flow */
        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '2px solid rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}
          >
            <Bot size={32} color="#6366f1" className="animate-spin" />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Sage AI</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Synthesizing your personalized academic schedule...
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px', margin: '0 auto', textAlign: 'left' }}>
            {steps.map((text, i) => {
              const isDone = i < stepIndex;
              const isCurrent = i === stepIndex;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.88rem',
                    color: isDone ? '#34d399' : isCurrent ? '#38bdf8' : 'var(--text-muted)'
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: isDone ? 'rgba(52, 211, 153, 0.2)' : isCurrent ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isDone ? <Check size={12} color="#34d399" /> : isCurrent ? <Sparkles size={12} className="animate-spin" /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />}
                  </div>
                  <span>{text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
};
