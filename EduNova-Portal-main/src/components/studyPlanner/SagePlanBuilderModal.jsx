import React, { useState } from 'react';
import { X, Sparkles, Check, Calendar, Clock, Target, ArrowRight, ArrowLeft, RefreshCw, Zap } from 'lucide-react';
import { subjectService } from '../../services/subjectService';
import { useLearner } from '../../context/LearnerContext';
import { useTheme } from '../../context/ThemeContext';

export const SagePlanBuilderModal = ({ isOpen, onClose, onGenerate }) => {
  const { learnerType } = useLearner();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const allSubjs = subjectService.getSelectedSubjects(learnerType);

  const [step, setStep] = useState(1);

  // Form State
  const [goal, setGoal] = useState('Board Exam');
  const [customGoal, setCustomGoal] = useState('');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState(allSubjs.map(s => s.id));
  const [targetScore, setTargetScore] = useState('85%');
  const [examDate, setExamDate] = useState('2027-03-15');
  const [availableHours, setAvailableHours] = useState(8);
  const [selectedDays, setSelectedDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [preferredTime, setPreferredTime] = useState('Evening (7:00 PM - 9:00 PM)');
  const [studyStyle, setStudyStyle] = useState('Balanced');
  const [difficulty, setDifficulty] = useState('Adaptive');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const calculateDaysRemaining = () => {
    try {
      const target = new Date(examDate).getTime();
      const now = new Date().getTime();
      const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    } catch (e) {
      return 164;
    }
  };

  const handleSelectAllSubjs = () => setSelectedSubjectIds(allSubjs.map(s => s.id));
  const handleClearAllSubjs = () => setSelectedSubjectIds([]);

  const toggleSubject = (id) => {
    setSelectedSubjectIds(prev =>
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const toggleDay = (d) => {
    setSelectedDays(prev =>
      prev.includes(d) ? prev.filter(day => day !== d) : [...prev, d]
    );
  };

  const handleFinalGenerate = async () => {
    setIsGenerating(true);
    const config = {
      goal: goal === 'Custom Goal' ? customGoal || 'Custom Target' : goal,
      selectedSubjectIds,
      targetScore,
      examDate,
      availableHours,
      studyDays: selectedDays,
      preferredTime,
      studyStyle,
      difficulty
    };

    await onGenerate(config);
    setIsGenerating(false);
    onClose();
  };

  const totalSteps = 8;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: isLight ? 'rgba(15, 23, 42, 0.4)' : 'rgba(5, 8, 20, 0.88)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 249, 255, 0.95) 100%)' : 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
        border: isLight ? '1.5px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(56, 189, 248, 0.4)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '640px',
        padding: '30px',
        color: isLight ? '#0f172a' : '#ffffff',
        boxShadow: isLight ? '0 25px 60px rgba(64, 100, 160, 0.25)' : '0 25px 60px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800 }}>STEP {step} OF {totalSteps}</span>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900 }}>Create Your AI Study Plan</h2>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#94a3b8', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Step 1: Goal */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#f8fafc' }}>Step 1 — What is your primary learning goal?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {['Board Exam', 'Entrance Exam', 'Semester Exam', 'Improve Subject', 'Finish Syllabus', 'Revision', 'Daily Practice', 'Custom Goal'].map(g => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: goal === g ? 'rgba(6, 182, 212, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                    border: goal === g ? '2px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: goal === g ? '#38bdf8' : '#cbd5e1',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
            {goal === 'Custom Goal' && (
              <input
                type="text"
                placeholder="Enter custom goal..."
                value={customGoal}
                onChange={e => setCustomGoal(e.target.value)}
                style={{ width: '100%', marginTop: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '12px', padding: '10px 14px', color: '#fff' }}
              />
            )}
          </div>
        )}

        {/* Step 2: Subjects */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Step 2 — Select Subjects</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleSelectAllSubjs} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Select All</button>
                <span style={{ color: '#64748b' }}>•</span>
                <button onClick={handleClearAllSubjs} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Clear All</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {allSubjs.map(s => {
                const isSel = selectedSubjectIds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleSubject(s.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: isSel ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                      border: isSel ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isSel ? '#38bdf8' : '#cbd5e1' }}>{s.name}</span>
                    <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: isSel ? '2px solid #06b6d4' : '2px solid #64748b', background: isSel ? '#06b6d4' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isSel && <Check size={14} color="#fff" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Target Score */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>Step 3 — Target Milestone</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {['80%', '85%', '90%', '95%+', 'Complete Syllabus', 'Master Weak Topics'].map(t => (
                <button
                  key={t}
                  onClick={() => setTargetScore(t)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: targetScore === t ? 'rgba(6, 182, 212, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                    border: targetScore === t ? '2px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: targetScore === t ? '#38bdf8' : '#cbd5e1',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Exam Date */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>Step 4 — Exam / Target Date</h3>
            <input
              type="date"
              value={examDate}
              onChange={e => setExamDate(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '14px', padding: '12px 16px', color: '#fff', fontSize: '1rem', outline: 'none' }}
            />
            <div style={{ marginTop: '16px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '14px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ color: '#38bdf8', fontSize: '1.3rem', fontWeight: 900 }}>⏱ {calculateDaysRemaining()} Days Remaining</div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>Sage will structure your workload to finish revision 14 days before exam day.</div>
            </div>
          </div>
        )}

        {/* Step 5: Available Time & Days */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>Step 5 — Weekly Available Hours & Days</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.84rem', color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Hours Per Week: <strong>{availableHours} Hours</strong>
              </label>
              <input
                type="range"
                min={4}
                max={25}
                value={availableHours}
                onChange={e => setAvailableHours(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#06b6d4' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.84rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Study Days:</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => {
                  const isSel = selectedDays.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => toggleDay(d)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: isSel ? 'rgba(6, 182, 212, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                        border: isSel ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: isSel ? '#38bdf8' : '#94a3b8',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {d.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Preferred Time */}
        {step === 6 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>Step 6 — Preferred Study Time</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {['Morning (6 AM - 9 AM)', 'Afternoon (1 PM - 4 PM)', 'Evening (7 PM - 9 PM)', 'Night (9 PM - 11 PM)'].map(t => (
                <button
                  key={t}
                  onClick={() => setPreferredTime(t)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: preferredTime === t ? 'rgba(6, 182, 212, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                    border: preferredTime === t ? '2px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: preferredTime === t ? '#38bdf8' : '#cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Study Style */}
        {step === 7 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>Step 7 — Study Style Preference</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {['Focused Deep Study', 'Short Sessions', 'Pomodoro', 'Balanced', 'Revision Heavy', 'Practice Heavy'].map(st => (
                <button
                  key={st}
                  onClick={() => setStudyStyle(st)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: studyStyle === st ? 'rgba(6, 182, 212, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                    border: studyStyle === st ? '2px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: studyStyle === st ? '#38bdf8' : '#cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Difficulty & Generate */}
        {step === 8 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>Step 8 — Pacing & Difficulty</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {['Adaptive', 'Easy', 'Medium', 'Hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: difficulty === d ? 'rgba(6, 182, 212, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                    border: difficulty === d ? '2px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: difficulty === d ? '#38bdf8' : '#cbd5e1',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < totalSteps ? (
            <button onClick={() => setStep(step + 1)} style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleFinalGenerate} disabled={isGenerating} style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}>
              {isGenerating ? <RefreshCw className="spin" size={16} /> : <Zap size={16} />} GENERATE AI PLAN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SagePlanBuilderModal;
