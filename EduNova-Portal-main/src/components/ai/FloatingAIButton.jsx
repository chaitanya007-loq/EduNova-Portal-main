import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { ChatMessage } from './ChatMessage';
import { SuggestedPrompts } from './SuggestedPrompts';

export const FloatingAIButton = () => {
  const { isOpen, toggleAIChat, messages, sendMessage, isTyping, resetChat } = useAI();
  const [inputText, setInputText] = useState('');

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
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={toggleAIChat}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(99, 102, 241, 0.6)',
          zIndex: 9999,
          transition: 'transform 0.2s ease',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }}
        aria-label="Open Sage AI Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={28} className="animate-pulse-glow" />}
      </button>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="floating-ai-window glass-panel">
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={18} color="#fff" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Sage AI Assistant</h4>
                <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} /> Online
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={resetChat} title="Clear Chat" style={{ color: 'var(--text-muted)' }}>
                <RefreshCw size={16} />
              </button>
              <button onClick={toggleAIChat} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onPromptSelect={handlePromptSelect} />
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Bot size={16} color="#6366f1" />
                <span>Sage AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Preset Suggestions */}
          <SuggestedPrompts onSelect={handlePromptSelect} />

          {/* Input Footer */}
          <form onSubmit={handleSend} style={{ padding: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Ask Sage anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.88rem' }}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: inputText.trim() ? 1 : 0.5
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
