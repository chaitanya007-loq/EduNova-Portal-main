import React, { useState } from 'react';
import { X, Sparkles, Send, Check, ArrowRight } from 'lucide-react';
import { studyPlannerService } from '../../services/studyPlannerService';

export const NaturalLanguagePlanModal = ({ isOpen, onClose, onApplyProposedPlan }) => {
  const [promptInput, setPromptInput] = useState('');
  const [proposedPlan, setProposedPlan] = useState(null);
  const [isParsing, setIsParsing] = useState(false);

  if (!isOpen) return null;

  const handleParse = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsParsing(true);
    setTimeout(() => {
      const parsed = studyPlannerService.parseNaturalLanguagePlan(promptInput);
      setProposedPlan(parsed);
      setIsParsing(false);
    }, 600);
  };

  const handleConfirmPlan = () => {
    if (proposedPlan && onApplyProposedPlan) {
      proposedPlan.forEach(s => studyPlannerService.addSession(s));
      onApplyProposedPlan();
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 20, 0.88)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '560px',
        padding: '28px',
        color: '#ffffff',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700 }}>NATURAL LANGUAGE AI PLANNER</span>
              <h2 style={{ margin: '2px 0 0 0', fontSize: '1.3rem', fontWeight: 900 }}>Tell Sage What You Want To Study</h2>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#94a3b8', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleParse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <textarea
            rows={3}
            value={promptInput}
            onChange={e => setPromptInput(e.target.value)}
            placeholder='e.g. "I have 2 hours tonight. I want to revise Chemistry and practice Maths problems."'
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '14px',
              padding: '14px',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              resize: 'none'
            }}
          />

          <button
            type="submit"
            disabled={isParsing || !promptInput.trim()}
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Send size={16} /> Generate Proposed Schedule
          </button>
        </form>

        {/* PROPOSED PLAN PREVIEW */}
        {proposedPlan && (
          <div style={{ marginTop: '20px', background: 'rgba(5, 8, 20, 0.7)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '16px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#34d399', marginBottom: '10px' }}>
              ✓ PROPOSED PLAN
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {proposedPlan.map((p, idx) => (
                <div key={idx} style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#fff' }}>{p.startTime} - {p.endTime}</strong>
                    <div style={{ color: '#38bdf8' }}>{p.subjectName}: {p.topic}</div>
                  </div>
                  <span style={{ fontSize: '0.74rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>{p.studyType}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirmPlan}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                color: '#fff',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              ADD TO MY PLAN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NaturalLanguagePlanModal;
