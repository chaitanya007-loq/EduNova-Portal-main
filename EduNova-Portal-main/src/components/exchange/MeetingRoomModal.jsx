import React, { useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, ScreenShare, MessageSquare, FileText, Globe, ExternalLink, X, Sparkles } from 'lucide-react';
import { sendExchangeMessage, getExchangeMessages } from '../../services/messageService';

export const MeetingRoomModal = ({ isOpen, onClose, meeting }) => {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'chat' | 'agenda'
  const [seconds, setSeconds] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [notesText, setNotesText] = useState(
    `# Peer Learning Session Notes\nDate: ${new Date().toLocaleDateString()}\nTopic: ${meeting?.title || 'React Hooks & Context'}\n\n- Key Concept 1: Practice core fundamentals\n- Key Concept 2: Code review & live exercise`
  );

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (meeting?.exchangeId) {
      setMessages(getExchangeMessages(meeting.exchangeId));
    }
  }, [meeting]);

  if (!isOpen || !meeting) return null;

  const roomName = `EduNova_SkillExchange_${meeting.id || 'room'}`;
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&userInfo.displayName=${encodeURIComponent('Aarav Shah')}`;

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = sendExchangeMessage(meeting.exchangeId || 'exc_301', chatInput);
    if (msg) setMessages(prev => [...prev, msg]);
    setChatInput('');
  };

  return (
    <div className="se-modal-overlay">
      <div className="se-meeting-modal-box">
        {/* Top Header - Always Visible */}
        <div className="se-meeting-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                alt="Host"
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #050814' }}
              />
              <img
                src={meeting.participantAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
                alt="Peer"
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #050814', marginLeft: '-12px' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>{meeting.title || 'Peer Skill Exchange Room'}</h3>
                <span className="se-tag-cyan" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>Jitsi Live Meeting</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>Host: Aarav Shah & Peer: {meeting.participantName || 'Rahul Sharma'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <div style={{ padding: '6px 12px', borderRadius: '12px', background: '#050814', border: '1px solid rgba(6, 182, 212, 0.4)', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
              {formatTimer(seconds)}
            </div>

            <a
              href={jitsiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="se-btn se-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              <ExternalLink size={14} /> Open Jitsi Fullscreen
            </a>

            <button
              onClick={onClose}
              style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Leave Meeting
            </button>
          </div>
        </div>

        {/* Room Main Body Responsive Grid */}
        <div className="se-meeting-body">
          {/* Main Jitsi Video Conference Stream Stage */}
          <div className="se-meeting-video-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Video size={16} /> Jitsi Meet Video Conference
              </span>
              <button
                onClick={() => setIsVideoActive(!isVideoActive)}
                className="se-btn se-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.72rem' }}
              >
                {isVideoActive ? 'Switch to Stage View' : 'Embed Jitsi Video'}
              </button>
            </div>

            <div className="se-meeting-video-frame">
              {isVideoActive ? (
                <iframe
                  src={jitsiUrl}
                  allow="camera; microphone; display-capture; autoplay; clipboard-write"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="EduNova Peer Learning Video Session"
                />
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Video size={48} color="#06b6d4" style={{ marginBottom: '12px' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Interactive Peer Video Stage</h4>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', maxWidth: '320px', margin: '6px 0 16px 0' }}>
                    Real-time peer video powered by Jitsi Meet open conferencing platform.
                  </p>
                  <button onClick={() => setIsVideoActive(true)} className="se-btn se-btn-primary">
                    Launch Jitsi Video
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Collaborative Tools Area (Notes / Chat / Agenda) */}
          <div className="se-meeting-tools-panel">
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '10px', marginBottom: '12px', gap: '6px' }}>
              <button
                onClick={() => setActiveTab('notes')}
                style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, border: 'none', background: activeTab === 'notes' ? '#06b6d4' : 'transparent', color: activeTab === 'notes' ? '#050814' : '#94a3b8', cursor: 'pointer' }}
              >
                Shared Notes
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, border: 'none', background: activeTab === 'chat' ? '#06b6d4' : 'transparent', color: activeTab === 'chat' ? '#050814' : '#94a3b8', cursor: 'pointer' }}
              >
                Room Chat
              </button>
              <button
                onClick={() => setActiveTab('agenda')}
                style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, border: 'none', background: activeTab === 'agenda' ? '#06b6d4' : 'transparent', color: activeTab === 'agenda' ? '#050814' : '#94a3b8', cursor: 'pointer' }}
              >
                Agenda
              </button>
            </div>

            {activeTab === 'notes' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>Collaborative markdown session notes editable in real time.</p>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="se-form-textarea"
                  style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.82rem', resize: 'none', minHeight: '300px' }}
                />
              </div>
            )}

            {activeTab === 'chat' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', minHeight: '260px' }}>
                  {messages.map((m) => (
                    <div key={m.id} style={{ padding: '10px 12px', borderRadius: '12px', background: '#050814', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#38bdf8', marginBottom: '2px' }}>
                        <span>{m.senderName}</span>
                        <span style={{ color: '#94a3b8' }}>{m.timestamp}</span>
                      </div>
                      <p style={{ margin: 0, color: '#fff' }}>{m.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type in room chat..."
                    className="se-form-input"
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="se-btn se-btn-primary" style={{ padding: '8px 14px' }}>
                    Send
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'agenda' && (
              <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Session Agenda & Goals</h4>
                <div style={{ whitespace: 'pre-line', fontSize: '0.82rem', color: '#cbd5e1', padding: '16px', borderRadius: '14px', background: '#050814', border: '1px solid rgba(255, 255, 255, 0.1)', lineHeight: 1.6 }}>
                  {meeting.agenda || "1. Review concept fundamentals\n2. Q&A and practical coding exercise\n3. Action items & next steps"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
