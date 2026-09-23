import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Play, BookOpen, Bot, Calendar, CheckCircle, Sparkles, FileText, Brain, HelpCircle, Layers, Copy, Check } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { 
  generateNotes, 
  generateSummary, 
  generateFlashcards, 
  generateMCQs, 
  generatePracticeQuestions, 
  generateFormulaSheet,
  generateExplanation,
  generateRevisionPlan 
} from '../../services/aiService';
import { useNavigate } from 'react-router-dom';

export const SessionDetailModal = ({ isOpen, onClose, session, onStartFocus, onMarkComplete, onReschedule }) => {
  const { openAIChat, sendMessage } = useAI();
  const navigate = useNavigate();

  const [activeGenType, setActiveGenType] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !session) return null;

  const handleAskSage = () => {
    onClose();
    openAIChat();
    sendMessage(`Tell me about ${session.topic} in ${session.subjectName} and give me key study tips.`);
  };

  const handleViewMaterials = () => {
    onClose();
    navigate(`/my-subjects`);
  };

  const handleGenerateMaterial = async (typeKey) => {
    setActiveGenType(typeKey);
    setGenLoading(true);
    setGeneratedContent(null);

    let res = null;
    const subj = session.subjectName;
    const top = session.topic;

    try {
      if (typeKey === 'notes') res = await generateNotes(subj, top);
      else if (typeKey === 'summary') res = await generateSummary(subj, top);
      else if (typeKey === 'flashcards') res = await generateFlashcards(subj, top, 5);
      else if (typeKey === 'mcqs') res = await generateMCQs(subj, top, 10);
      else if (typeKey === 'practice') res = await generatePracticeQuestions(subj, top);
      else if (typeKey === 'formula') res = await generateFormulaSheet(subj, top);
      else if (typeKey === 'explain') res = await generateExplanation(subj, top);
      else if (typeKey === 'revision') res = await generateRevisionPlan(subj, [top]);

      setGeneratedContent(res);
    } catch (err) {
      console.error('Material Generation Failed:', err);
      setGeneratedContent({ text: 'Unable to generate material right now. Please try again.' });
    } finally {
      setGenLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${session.subjectName} Study Session`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header Metadata */}
        <div style={{ background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span
              style={{
                background: session.subjectColor || 'var(--accent-primary)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              {session.day} • {session.durationMinutes} mins
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Status: <strong style={{ color: session.status === 'Completed' ? '#34d399' : '#38bdf8' }}>{session.status}</strong>
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>{session.topic}</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
            Focus: {session.focus}
          </p>
        </div>

        {/* Objective & AI Recommendation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Session Objective</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.4 }}>
              {session.objective || `Master fundamental principles of ${session.topic}.`}
            </p>
          </div>

          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a5b4fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bot size={14} /> Sage AI Recommendation
            </span>
            <p style={{ fontSize: '0.85rem', color: '#e0e7ff', marginTop: '4px', lineHeight: 1.4 }}>
              {session.aiRecommendation || `Targeted based on your selected subjects and performance goal.`}
            </p>
          </div>
        </div>

        {/* 6 Included Learning Resources */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={16} color="var(--accent-primary)" /> Included Learning Materials ({session.materials ? session.materials.length : 6})
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {session.materials && session.materials.map((mat, idx) => (
              <div
                key={idx}
                onClick={mat.action === 'ask_sage' ? handleAskSage : handleViewMaterials}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{mat.icon}</span>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{mat.type}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{mat.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1-Click AI Material Generation Bar */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            ✨ Instant Sage AI Material Generator
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { id: 'notes', label: 'Notes', icon: <FileText size={12} /> },
              { id: 'summary', label: 'Summary', icon: <Sparkles size={12} /> },
              { id: 'flashcards', label: 'Flashcards', icon: <Brain size={12} /> },
              { id: 'mcqs', label: '10 MCQs', icon: <HelpCircle size={12} /> },
              { id: 'practice', label: 'Practice Questions', icon: <Layers size={12} /> },
              { id: 'formula', label: 'Formula Sheet', icon: <BookOpen size={12} /> },
              { id: 'explain', label: 'Explain Topic', icon: <Bot size={12} /> },
              { id: 'revision', label: 'Revision Plan', icon: <Calendar size={12} /> }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleGenerateMaterial(btn.id)}
                style={{
                  background: activeGenType === btn.id ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: activeGenType === btn.id ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>

          {/* Generated Material Display Box */}
          {genLoading && (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              <Sparkles className="animate-spin" size={18} style={{ display: 'inline', marginRight: '6px' }} />
              Sage AI is generating your {activeGenType}...
            </div>
          )}

          {!genLoading && generatedContent && (
            <div style={{ marginTop: '12px', background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>Generated {activeGenType?.toUpperCase()}</strong>
                {typeof generatedContent.text === 'string' && (
                  <button
                    onClick={() => handleCopy(generatedContent.text)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copied ? <><Check size={12} color="#34d399" /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                )}
              </div>

              {Array.isArray(generatedContent) ? (
                /* Flashcards list */
                <div style={{ display: 'grid', gap: '8px' }}>
                  {generatedContent.map((fc, i) => (
                    <div key={i} style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem' }}>
                      <strong style={{ color: 'var(--accent-primary)' }}>Q{i+1}: {fc.front}</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>A: {fc.back}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.5, maxHeight: '200px', overflowY: 'auto' }}>
                  {generatedContent.text || JSON.stringify(generatedContent)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
          <Button variant="secondary" onClick={handleAskSage}>
            <Bot size={16} /> Ask Sage
          </Button>

          <Button variant="secondary" onClick={handleViewMaterials}>
            <BookOpen size={16} /> View Materials
          </Button>

          {session.status !== 'Completed' && (
            <Button variant="secondary" onClick={() => onMarkComplete(session.id)}>
              <CheckCircle size={16} /> Mark Complete
            </Button>
          )}

          <Button onClick={() => { onClose(); onStartFocus(session); }}>
            <Play size={16} /> Start Session
          </Button>
        </div>
      </div>
    </Modal>
  );
};
