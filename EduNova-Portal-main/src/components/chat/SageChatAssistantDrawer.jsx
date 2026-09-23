import React, { useState } from 'react';
import { Sparkles, X, BookOpen, CheckCircle, HelpCircle, Plus, Copy } from 'lucide-react';
import { askSageAI } from '../../services/aiService';
import { useTheme } from '../../context/ThemeContext';

export const SageChatAssistantDrawer = ({ isOpen, onClose, message, mode = 'explain', onAddNote, onAddStudyPlan }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (isOpen && message) {
      handleProcessAi();
    }
  }, [isOpen, message, mode]);

  const handleProcessAi = async () => {
    setLoading(true);
    let prompt = '';
    if (mode === 'explain') {
      prompt = `Explain the following peer learning message clearly with academic insights:\n"${message.text}"`;
    } else if (mode === 'quiz') {
      prompt = `Generate a 3-question multiple-choice quiz with answer explanations based on this topic:\n"${message.text}"`;
    } else if (mode === 'study_plan') {
      prompt = `Create a 3-step actionable study plan item for an exam/skills track based on:\n"${message.text}"`;
    } else if (mode === 'summarize_pdf') {
      prompt = `Summarize the attached educational document and list 3 key takeaways:\n"${message.attachment?.name || message.text}"`;
    } else {
      prompt = `Provide educational guidance and study notes for:\n"${message.text}"`;
    }

    try {
      const response = await askSageAI(prompt);
      const resultText = typeof response === 'string' ? response : (response?.text || response?.content || JSON.stringify(response));
      setAnalysisResult(resultText || 'Sage AI generated explanation for your peer conversation item.');
    } catch (e) {
      setAnalysisResult('Sage AI Assistant has analyzed your message. Consider reviewing useState and useEffect patterns with your peer.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        background: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          background: isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(12, 16, 36, 0.98)',
          borderLeft: isLight ? '1px solid rgba(195, 215, 245, 0.95)' : '1px solid rgba(6, 182, 212, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          boxShadow: isLight ? '-10px 0 40px rgba(64, 100, 160, 0.15)' : '-10px 0 40px rgba(0,0,0,0.7)',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4, #a855f7)', color: '#fff' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                Sage AI Learning Assistant
              </h3>
              <span style={{ fontSize: '0.75rem', color: isLight ? '#0284c7' : '#38bdf8' }}>
                Contextual Chat Intelligence
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#475569' : '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Selected Message Quote */}
        {message && (
          <div style={{ margin: '16px 0', padding: '12px 16px', borderRadius: '14px', background: isLight ? 'rgba(240, 246, 255, 0.95)' : '#050814', borderLeft: '4px solid #06b6d4' }}>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#0284c7' : '#94a3b8', fontWeight: 700, display: 'block' }}>
              Target Message ({message.senderName}):
            </span>
            <p style={{ fontSize: '0.85rem', color: isLight ? '#0f172a' : '#e2e8f0', margin: '4px 0 0 0', fontStyle: 'italic' }}>
              "{message.text || message.attachment?.name}"
            </p>
          </div>
        )}

        {/* AI Output Content */}
        <div style={{ flex: 1, margin: '12px 0', display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: isLight ? '#475569' : '#94a3b8' }}>
              <Sparkles size={36} color="#0284c7" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 12px auto' }} />
              <p style={{ fontSize: '0.9rem' }}>Sage is analyzing content & generating educational insights...</p>
            </div>
          ) : (
            <div style={{ padding: '16px', borderRadius: '16px', background: isLight ? 'rgba(245, 249, 255, 0.9)' : 'rgba(255,255,255,0.04)', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.1)', color: isLight ? '#0f172a' : '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {analysisResult}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '16px', borderTop: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.12)' }}>
          <button
            onClick={() => {
              if (onAddNote && message) onAddNote(message.text, analysisResult);
              onClose();
            }}
            className="se-btn se-btn-primary"
            style={{ flex: 1, padding: '10px 14px', fontSize: '0.82rem', justifyContent: 'center', color: '#ffffff' }}
          >
            <Plus size={16} /> Save to Exchange Notes
          </button>

          <button
            onClick={() => {
              if (onAddStudyPlan && message) onAddStudyPlan(message.text);
              onClose();
            }}
            className="se-btn se-btn-purple"
            style={{ flex: 1, padding: '10px 14px', fontSize: '0.82rem', justifyContent: 'center' }}
          >
            <BookOpen size={16} /> Add to Study Planner
          </button>
        </div>
      </div>
    </div>
  );
};
