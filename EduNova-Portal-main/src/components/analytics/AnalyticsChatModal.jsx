import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { useTheme } from '../../context/ThemeContext';

export const AnalyticsChatModal = ({ isOpen, onClose, analyticsData, initialQuery = '' }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [messages, setMessages] = useState([
    {
      id: 'init_1',
      sender: 'sage',
      text: `Hello! I'm Sage AI, your Learning Intelligence Assistant. I have analyzed your ${analyticsData?.sessionCount || 46} learning sessions and quiz accuracy (${analyticsData?.kpiSummary?.accuracy || 78}%). Ask me anything about your progress!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState(initialQuery);

  if (!isOpen) return null;

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: inputQuery.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const botResponseText = analyticsService.askSageAboutAnalytics(inputQuery, analyticsData);

    const sageMsg = {
      id: `sage_${Date.now()}`,
      sender: 'sage',
      text: botResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, sageMsg]);
    setInputQuery('');
  };

  const sampleQuestions = [
    'Why is my Chemistry score low?',
    'Where am I improving?',
    'What should I study today?',
    'Am I ready for my exam?'
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: isLight ? 'rgba(15, 23, 42, 0.4)' : 'rgba(5, 8, 20, 0.75)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'flex-end' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: isLight 
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(240, 246, 255, 0.96))'
            : '#080c1e',
          borderLeft: isLight ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(6, 182, 212, 0.4)',
          boxShadow: isLight ? '-10px 0 40px rgba(0, 0, 0, 0.15)' : '-10px 0 40px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)', background: isLight ? 'rgba(255, 255, 255, 0.85)' : '#050814', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: 0 }}>Sage AI Analytics Tutor</h3>
              <span style={{ fontSize: '0.72rem', color: isLight ? '#059669' : '#34d399', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isLight ? '#059669' : '#34d399' }} /> Analytics Pipeline Connected
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#64748b' : '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Suggested Prompts */}
        <div style={{ padding: '10px 16px', background: isLight ? 'rgba(235, 244, 255, 0.6)' : 'rgba(12, 16, 36, 0.6)', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => { setInputQuery(sq); }}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)',
                border: isLight ? '1px solid rgba(203, 213, 225, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isLight ? '#0284c7' : '#38bdf8',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Chat Feed */}
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map(m => {
            const isMe = m.sender === 'user';
            return (
              <div key={m.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: isMe 
                      ? 'linear-gradient(135deg, #06b6d4, #6366f1)' 
                      : (isLight ? 'rgba(255, 255, 255, 0.9)' : '#050814'),
                    border: isMe ? 'none' : (isLight ? '1px solid rgba(203, 213, 225, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)'),
                    color: isMe ? '#fff' : (isLight ? '#18345F' : '#fff'),
                    fontSize: '0.85rem',
                    lineHeight: 1.45,
                    boxShadow: isLight && !isMe ? '0 2px 10px rgba(0, 0, 0, 0.03)' : 'none'
                  }}
                >
                  {m.text}
                </div>
                <span style={{ fontSize: '0.65rem', color: isLight ? '#64748b' : '#64748b', marginTop: '2px', display: 'block', textAlign: isMe ? 'right' : 'left' }}>
                  {m.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* Input Composer */}
        <div style={{ padding: '14px', borderTop: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)', background: isLight ? 'rgba(255, 255, 255, 0.85)' : '#050814' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Sage about your scores, weak topics, or progress..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                background: isLight ? '#fff' : '#0c1024',
                border: isLight ? '1px solid rgba(203, 213, 225, 0.8)' : '1px solid rgba(255, 255, 255, 0.16)',
                color: isLight ? '#18345F' : '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button type="submit" className="se-btn se-btn-primary" style={{ padding: '10px 16px' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
