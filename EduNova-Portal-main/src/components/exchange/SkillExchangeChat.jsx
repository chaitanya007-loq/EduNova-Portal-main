import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { getExchangeMessages, sendExchangeMessage } from '../../services/skillExchangeService';

export const SkillExchangeChat = ({ exchangeId, partnerName }) => {
  const [messages, setMessages] = useState(() => getExchangeMessages(exchangeId));
  const [text, setText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const updated = sendExchangeMessage(exchangeId, text.trim());
    setMessages(updated);
    setText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '360px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      {/* Chat Header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-color)', background: 'rgba(12, 16, 36, 0.6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MessageSquare size={16} color="#06b6d4" />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
          Exchange Chat with {partnerName}
        </span>
      </div>

      {/* Messages List */}
      <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((m) => {
          const isMe = m.sender === 'me';
          return (
            <div
              key={m.id}
              style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: isMe ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'var(--bg-elevated)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  lineHeight: 1.4
                }}
              >
                {m.text}
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', padding: '0 4px' }}>
                {m.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Send Input */}
      <form onSubmit={handleSend} style={{ padding: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, fontSize: '0.85rem' }}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          style={{
            padding: '0 14px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: text.trim() ? 1 : 0.5,
            cursor: text.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};

export default SkillExchangeChat;
