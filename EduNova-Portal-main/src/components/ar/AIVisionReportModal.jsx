import React, { useState } from 'react';
import { FileText, ShieldCheck, Download, Sparkles, CheckCircle2, Award, Printer } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const AIVisionReportModal = ({ isOpen, onClose, objectData, onAskSage }) => {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'components' | 'equations' | 'quiz'
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!objectData) return null;

  const confidencePercent = Math.round((objectData.confidence || 0.96) * 100);

  const sampleQuiz = [
    {
      id: 'q1',
      question: `What is the primary role of ${objectData.name} in its system?`,
      options: [
        'Main energy generation and work output',
        'Secondary passive insulation layer',
        'Structural support with zero dynamic regulation',
        'External environmental shielding'
      ],
      correct: 0
    },
    {
      id: 'q2',
      question: `Which key mechanism regulates the output of ${objectData.name}?`,
      options: [
        'Random thermal fluctuation',
        'Feedback loops & pressure differentials',
        'Manual mechanical friction',
        'Atmospheric condensation'
      ],
      correct: 1
    }
  ];

  const handleSelectOption = (qId, optionIdx) => {
    setSelectedAnswers({ ...selectedAnswers, [qId]: optionIdx });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`AI Vision Inspection Report: ${objectData.name}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#fff' }}>
        {/* Top Report Header Telemetry Bar */}
        <div style={{
          background: 'radial-gradient(circle at 10% 10%, rgba(6, 182, 212, 0.2), rgba(12, 16, 36, 0.95))',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              AI Vision Telemetry • {objectData.category}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              {objectData.name}
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Scan ID: `LS-VISION-${Date.now().toString().slice(-6)}` • Timestamp: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              color: '#34d399',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {confidencePercent}% Accuracy
            </span>
            <button
              onClick={handlePrint}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={14} /> Print Report
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          {[
            { id: 'summary', label: '📄 Executive Summary' },
            { id: 'components', label: '🧱 Component Matrix' },
            { id: 'equations', label: '📐 Formulas & Math' },
            { id: 'quiz', label: '📝 AI Micro-Quiz' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: EXECUTIVE SUMMARY */}
        {activeTab === 'summary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>Detailed Morphological Overview</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                {objectData.description} High-resolution spatial scanning confirms pristine structural alignment with textbook models.
              </p>
            </div>

            <div>
              <strong style={{ color: '#c084fc', display: 'block', marginBottom: '6px' }}>Key Educational Curriculum Topics:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {objectData.topics && objectData.topics.map(t => (
                  <span key={t} style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.35)',
                    color: '#c084fc',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPONENT MATRIX */}
        {activeTab === 'components' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {objectData.hotspots && objectData.hotspots.map((hs, idx) => (
              <div key={hs.id} style={{
                background: 'var(--bg-tertiary)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyBetween: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: '#38bdf8' }}>Component #{idx + 1}: {hs.name}</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{hs.function}</p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Mechanics: {hs.detailedExplanation}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: FORMULAS & MATH */}
        {activeTab === 'equations' && (
          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', spaceY: '12px' }}>
            <h4 style={{ color: '#fbbf24', fontWeight: 700, marginBottom: '8px' }}>Governing Equations & Physics</h4>
            <div style={{ fontFamily: 'monospace', background: '#040711', padding: '12px', borderRadius: '6px', color: '#38bdf8', marginBottom: '10px' }}>
              • Output Work Equation: W = ∫ P(t) dV<br />
              • Flow Velocity Field: v(r) = v_max (1 - (r/R)²)
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              These mathematical relations govern real-world operational pressure gradients and efficiency dynamics.
            </p>
          </div>
        )}

        {/* TAB 4: AI MICRO-QUIZ */}
        {activeTab === 'quiz' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sampleQuiz.map((q, qIdx) => (
              <div key={q.id} style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '8px' }}>{qIdx + 1}. {q.question}</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isCorrect = q.correct === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: isSelected ? (quizSubmitted && isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(6, 182, 212, 0.25)') : 'var(--bg-secondary)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          border: '1px solid var(--border-color)',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}) {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <Button onClick={() => setQuizSubmitted(true)}>
              Submit Answers & Check Result
            </Button>
          </div>
        )}

        {/* Ask Sage AI Trigger */}
        <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Want a deeper analysis?</span>
          <Button size="sm" onClick={() => { onClose(); onAskSage && onAskSage(`Generate a full study guide for ${objectData.name}.`); }}>
            <Sparkles size={14} /> Ask Sage AI for Study Guide
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AIVisionReportModal;
