import React, { useState } from 'react';
import { Bot, Send, Sparkles, HelpCircle, Lightbulb, Zap, X } from 'lucide-react';
import { askSageAI } from '../../services/aiService';

export const SageAILabMentor = ({ lab, liveState = {}, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'sage',
      text: `Hello! I am your Sage AI Lab Mentor for "${lab?.title}". I have full visibility into your live simulation parameters. Ask me anything or request a hint!`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText = inputQuery) => {
    const text = queryText.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInputQuery('');
    setLoading(true);

    try {
      // Build contextual prompt with actual simulation values
      const prompt = `You are Sage, the expert AI Lab Mentor for EduNova's Immersive Learning Platform.
Context:
- Lab Title: ${lab?.title}
- Subject: ${lab?.subject}
- Education Level: ${lab?.educationType}
- Live Simulation Parameters & Values: ${JSON.stringify(liveState, null, 2)}

User Question: "${text}"

Guidance:
1. Provide concise, clear, educational answers based strictly on the live simulation values provided.
2. If asked for a hint, guide the student conceptually without giving direct solutions.
3. Keep response around 2-4 sentences. Use markdown bullet points if helpful.`;

      const aiResponse = await askSageAI(prompt);

      setMessages([...newMessages, { sender: 'sage', text: typeof aiResponse === 'string' ? aiResponse : (aiResponse.text || aiResponse.answer || 'Interesting observation! Adjust your parameters and observe how the output vector changes.') }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: 'sage',
          text: `Based on your current simulation state (${JSON.stringify(liveState)}), increasing the primary input parameter directly shifts the output curve. Try running the simulation again!`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'Explain this simulation graph',
    'Why did the result change?',
    'Give me a hint (don\'t spoil answer)',
    'Give me a challenge'
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '16px',
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}
    >
      {/* Mentor Header */}
      <div
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(6, 182, 212, 0.15))',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '8px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.25)',
              color: '#c084fc'
            }}
          >
            <Bot size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Sage AI Lab Mentor
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Simulation Aware • Active</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Message Chat Feed */}
      <div
        style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: '14px',
              background: msg.sender === 'user' ? 'linear-gradient(135deg, #06b6d4, #2563eb)' : 'rgba(30, 41, 59, 0.8)',
              color: '#ffffff',
              border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.86rem',
              lineHeight: 1.45
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', color: '#c084fc', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} className="animate-spin" /> Sage is analyzing simulation state...
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div style={{ padding: '8px 12px', display: 'flex', gap: '6px', overflowX: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              fontSize: '0.74rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.9)'
        }}
      >
        <input
          type="text"
          placeholder="Ask Sage about this simulation..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#ffffff',
            fontSize: '0.86rem',
            outline: 'none'
          }}
        />
        <button
          onClick={() => handleSend()}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default SageAILabMentor;
