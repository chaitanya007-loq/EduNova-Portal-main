import React, { useState, useEffect } from 'react';
import { Video, Mic, ScreenShare, Clock, X, Send, Sparkles, FileText, CheckCircle } from 'lucide-react';
import { getMessagesForConversation, sendChatMessage } from '../../services/chatService';

export const ExchangeSessionModeModal = ({ isOpen, onClose, conversation }) => {
  const [seconds, setSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState('notes');
  const [notesText, setNotesText] = useState('### Live Session Agenda:\n1. Review React Hooks & State\n2. Figma Component Variants');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen && !sessionCompleted) {
      timer = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, sessionCompleted]);

  useEffect(() => {
    if (conversation?.id) {
      setMessages(getMessagesForConversation(conversation.id));
    }
  }, [conversation]);

  if (!isOpen || !conversation) return null;

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = sendChatMessage({
      conversationId: conversation.id,
      text: chatInput.trim()
    });
    if (msg) setMessages(prev => [...prev, msg]);
    setChatInput('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(5, 8, 20, 0.96)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Session Status Bar */}
      <div
        style={{
          padding: '14px 24px',
          background: 'rgba(12, 16, 36, 0.95)',
          borderBottom: '1px solid rgba(6, 182, 212, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', border: '1px solid #f43f5e', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            ● LIVE SESSION MODE
          </span>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            {conversation.title || 'Peer Skill Exchange Session'}
          </h2>
        </div>

        {/* Center Live Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid #06b6d4', color: '#38bdf8', fontWeight: 800, fontSize: '1rem' }}>
          <Clock size={16} />
          {formatTimer(seconds)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setSessionCompleted(true)}
            className="se-btn se-btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            <CheckCircle size={16} /> Complete Session
          </button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Split Screen Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Side: Real-Time Chat Stream */}
        <div style={{ width: '420px', borderRight: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', background: '#050814' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8' }}>
            Session Chat Feed
          </div>

          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map(m => (
              <div key={m.id} style={{ padding: '10px 14px', borderRadius: '14px', background: m.senderId === 'current_user' ? '#06b6d4' : 'rgba(255,255,255,0.06)', color: m.senderId === 'current_user' ? '#050814' : '#fff', fontSize: '0.85rem' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.8, display: 'block', marginBottom: '2px', fontWeight: 700 }}>{m.senderName}</span>
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask or reply in live session..."
              className="se-form-input"
              style={{ flex: 1, fontSize: '0.85rem' }}
            />
            <button type="submit" className="se-btn se-btn-primary" style={{ padding: '8px 14px' }}>
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* Right Side: Interactive Learning Workspace & Notes */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <button onClick={() => setActiveTab('notes')} className={`se-btn ${activeTab === 'notes' ? 'se-btn-primary' : 'se-btn-secondary'}`}>
              <FileText size={16} /> Live Scratchpad Notes
            </button>
            <button onClick={() => setActiveTab('whiteboard')} className={`se-btn ${activeTab === 'whiteboard' ? 'se-btn-purple' : 'se-btn-secondary'}`}>
              <Sparkles size={16} /> Sage AI Live Code Assistant
            </button>
          </div>

          {activeTab === 'notes' && (
            <textarea
              value={notesText}
              onChange={e => setNotesText(e.target.value)}
              className="se-form-textarea"
              style={{ flex: 1, minHeight: '400px', fontSize: '0.95rem', fontFamily: 'monospace', lineHeight: 1.6 }}
            />
          )}

          {activeTab === 'whiteboard' && (
            <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6, 182, 212, 0.3)', flex: 1 }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles color="#38bdf8" /> Sage AI Session Assistant
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                Sage is listening to your live session. Type any coding syntax question or concept query in the session chat to get instant learning cards!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
