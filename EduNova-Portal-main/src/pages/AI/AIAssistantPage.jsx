import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  RefreshCw,
  Sparkles,
  Route,
  Calendar,
  BookOpen,
  FlaskConical,
  Target,
  BrainCircuit,
  User,
  MessageSquare,
  HelpCircle,
  Zap,
  CheckCircle2,
  Clock,
  ChevronRight,
  Lightbulb,
  FileText,
  Code
} from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { useLearner } from '../../context/LearnerContext';
import { useTheme } from '../../context/ThemeContext';
import { ChatMessage } from '../../components/ai/ChatMessage';
import { SuggestedPrompts } from '../../components/ai/SuggestedPrompts';
import { Card } from '../../components/common/Card';
import { useNavigate } from 'react-router-dom';
import { EduNovaHeroBanner } from '../../components/common/EduNovaHeroBanner';

export const AIAssistantPage = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { messages, sendMessage, isTyping, resetChat } = useAI();
  const { learner, learnerType } = useLearner();
  const [inputText, setInputText] = useState('');
  const [activeSessionId, setActiveSessionId] = useState('s1');
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  const historyTopics = [
    { id: 's1', title: 'React Virtual DOM & Reconciliation', time: 'Active Now', category: 'Frontend' },
    { id: 's2', title: 'DBMS 3NF Normalization Rules', time: 'Yesterday', category: 'Database' },
    { id: 's3', title: 'Async JavaScript & Event Loop', time: '3 days ago', category: 'JavaScript' },
    { id: 's4', title: 'Matrix Algebra Gradient Descent', time: 'Sep 12', category: 'Mathematics' }
  ];

  const quickActionBtns = [
    { label: 'Explain this', prompt: 'Explain this concept clearly and concisely with key definitions.' },
    { label: 'Give me an example', prompt: 'Provide a real-world concrete code or visual example.' },
    { label: 'Quiz me', prompt: 'Create a 3-question practice quiz on this topic.' },
    { label: 'Give me practice questions', prompt: 'Give me 3 conceptual practice questions with step-by-step solutions.' },
    { label: 'Simplify it', prompt: 'Simplify this concept for a beginner using an intuitive analogy.' },
    { label: 'Show me step-by-step', prompt: 'Break down the solution step-by-step with clear numbered stages.' }
  ];

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    const t1 = setTimeout(scrollToBottom, 50);
    const t2 = setTimeout(scrollToBottom, 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handlePromptSelect = (promptText) => {
    sendMessage(promptText);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>

      {/* Header Bar WITH 3D GLASS ORB */}
      <EduNovaHeroBanner
        badge="✦ Neural Tutoring Engine"
        title="Sage AI Teaching Assistant"
        subtitle="Your intelligent 24/7 learning system — concept breakdowns, examples, quizzes, and personalized study guidance."
        stats={[
          { label: 'Online 24/7', subtext: 'Neural Assistant', icon: Bot, color: '#38bdf8', iconBg: 'rgba(56, 189, 248, 0.25)' },
          { label: 'Level 4', subtext: 'XP Rank', icon: Sparkles, color: '#c084fc', iconBg: 'rgba(192, 132, 252, 0.25)' },
          { label: '3', subtext: 'Learning Goals', isPill: true }
        ]}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
        <button
          onClick={resetChat}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            color: 'var(--text-secondary)',
            fontSize: '0.84rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} /> Clear Session
        </button>
      </div>

      {/* 3-PANEL SAAS AI LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px minmax(0, 1fr) 300px', gap: '20px', alignItems: 'start' }} className="ai-layout-grid">

        {/* LEFT PANEL: History & Topics Navigation */}
        <div style={{
          background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'var(--glass-bg)',
          borderRadius: 'var(--radius-xl)',
          border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid var(--border-color)',
          boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : 'none',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isLight ? '#18345F' : '#fff', fontWeight: 800, fontSize: '0.9rem', paddingBottom: '8px', borderBottom: isLight ? '1px solid rgba(200, 218, 240, 0.6)' : '1px solid var(--border-color)' }}>
            <MessageSquare size={16} color="#06b6d4" /> Recent Topics
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {historyTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setActiveSessionId(topic.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: activeSessionId === topic.id ? (isLight ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))' : 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))') : (isLight ? 'rgba(240, 246, 255, 0.75)' : 'var(--bg-secondary)'),
                  border: activeSessionId === topic.id ? '1px solid rgba(6, 182, 212, 0.5)' : (isLight ? '1px solid rgba(200, 218, 240, 0.6)' : '1px solid var(--border-color)'),
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: activeSessionId === topic.id ? (isLight ? '#0284c7' : '#fff') : (isLight ? '#18345F' : 'var(--text-secondary)'), display: 'block' }}>
                  {topic.title}
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: isLight ? '#52668a' : 'var(--text-muted)', marginTop: '4px' }}>
                  <span>{topic.category}</span>
                  <span>{topic.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER PANEL: Main Conversation Area & Form */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-xl)', border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid var(--border-color)', background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'var(--glass-bg)', overflow: 'hidden', boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : 'var(--glass-shadow)', backdropFilter: 'blur(20px)' }}>

          {/* Messages Feed Container */}
          <div
            ref={chatContainerRef}
            style={{
              height: '480px',
              maxHeight: '54vh',
              minHeight: '360px',
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              background: isLight ? 'rgba(240, 246, 255, 0.6)' : 'rgba(5, 8, 20, 0.5)'
            }}
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onPromptSelect={handlePromptSelect} />
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: isLight ? '#0284c7' : '#38bdf8', fontSize: '0.85rem', padding: '12px 16px', background: isLight ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.12)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 182, 212, 0.3)', width: 'fit-content' }}>
                <Bot size={18} className="animate-spin-slow" />
                <span>Sage AI is formulating your personalized explanation...</span>
              </div>
            )}
          </div>

          {/* Quick Actions Buttons Row */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            padding: '10px 16px',
            background: isLight ? 'rgba(230, 240, 255, 0.8)' : 'var(--bg-tertiary)',
            borderTop: isLight ? '1px solid rgba(200, 218, 240, 0.7)' : '1px solid var(--border-color)',
            borderBottom: isLight ? '1px solid rgba(200, 218, 240, 0.7)' : '1px solid var(--border-color)'
          }}>
            {quickActionBtns.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptSelect(btn.prompt)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  background: isLight ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.12)',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  color: isLight ? '#0284c7' : '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                ⚡ {btn.label}
              </button>
            ))}
          </div>

          {/* Form Input Area */}
          <form onSubmit={handleSend} style={{ padding: '16px', display: 'flex', gap: '12px', background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'var(--bg-secondary)', flexShrink: 0 }}>
            <input
              type="text"
              placeholder="Ask Sage AI to explain a topic, generate a quiz, or give step-by-step practice..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', fontSize: '0.92rem', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.8)', color: isLight ? '#18345F' : '#ffffff', border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.15)' }}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              style={{
                padding: '0 24px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: inputText.trim() ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'var(--bg-tertiary)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                opacity: inputText.trim() ? 1 : 0.5,
                border: 'none',
                boxShadow: inputText.trim() ? '0 4px 15px rgba(6, 182, 212, 0.3)' : 'none'
              }}
            >
              <Send size={16} /> Send
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Contextual Learning Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Contextual Learning Panel Card */}
          <div style={{
            background: 'var(--glass-bg)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '20px',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <User size={18} color="#a855f7" /> Contextual Learning Panel
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.74rem' }}>Current Course:</span>
                <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Full-Stack Web Engineering</strong>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.74rem' }}>Current Topic:</span>
                <strong style={{ color: '#38bdf8', fontSize: '0.9rem' }}>React Hooks & State Hydration</strong>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>Learning Progress:</span>
                  <strong style={{ color: '#34d399', fontSize: '0.8rem' }}>78%</strong>
                </div>
                <div style={{ height: '5px', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', background: '#10b981' }} />
                </div>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
                <span style={{ color: '#fb7185', fontWeight: 800, fontSize: '0.76rem', display: 'block', marginBottom: '4px' }}>
                  Target Weak Areas:
                </span>
                <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', margin: 0, fontSize: '0.78rem' }}>
                  <li>DBMS Normalization (3NF)</li>
                  <li>Async Promise Error Recovery</li>
                </ul>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.76rem', display: 'block', marginBottom: '4px' }}>
                  Recommended Practice:
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Express Middleware & REST API Security Diagnostic</span>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                <span style={{ color: '#c084fc', fontWeight: 800, fontSize: '0.76rem', display: 'block', marginBottom: '4px' }}>
                  Study Goal:
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Full Stack Developer Career Path (64% Ready)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIAssistantPage;
