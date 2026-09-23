import React, { useState } from 'react';
import { X, Sparkles, Check, Trash2, Edit3, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const HybridPlanOptimizerModal = ({ isOpen, onClose, suggestions, onAcceptSuggestion }) => {
  const [acceptedIds, setAcceptedIds] = useState([]);

  if (!isOpen) return null;

  const handleAccept = (sug) => {
    setAcceptedIds(prev => [...prev, sug.id]);
    if (onAcceptSuggestion) onAcceptSuggestion(sug);
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
        border: '1px solid rgba(168, 85, 247, 0.4)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '580px',
        padding: '28px',
        color: '#ffffff',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                ✦ + ● Sage + Me Optimization
              </span>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '1.3rem', fontWeight: 900 }}>Suggested Improvements</h2>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#94a3b8', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Ownership Notice */}
        <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', color: '#38bdf8', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} />
          <span><strong>You are in control.</strong> Sage only suggests changes unless you approve them.</span>
        </div>

        {/* Suggestions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '320px', overflowY: 'auto' }}>
          {suggestions && suggestions.length > 0 ? (
            suggestions.map(sug => {
              const isDone = acceptedIds.includes(sug.id);
              return (
                <div
                  key={sug.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: isDone ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isDone ? '#34d399' : '#fff' }}>
                      {sug.title}
                    </div>
                    {isDone && <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700 }}>✓ Applied</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45 }}>
                    {sug.description}
                  </p>
                  {!isDone && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button
                        onClick={() => handleAccept(sug)}
                        style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', border: 'none', color: '#fff', fontSize: '0.76rem', fontWeight: 800, padding: '6px 14px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setAcceptedIds(prev => [...prev, sug.id])}
                        style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#cbd5e1', fontSize: '0.76rem', fontWeight: 700, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
              Your study plan looks well-balanced! No pending AI suggestions right now.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.8)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default HybridPlanOptimizerModal;
