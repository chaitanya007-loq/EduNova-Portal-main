import React, { useState } from 'react';
import { Play, CheckCircle, FileText, Bot } from 'lucide-react';
import { Button } from '../common/Button';
import { useAI } from '../../context/AIContext';

export const LessonViewer = ({ moduleData, onCompleteModule }) => {
  const { openAIChat, sendMessage } = useAI();

  const handleAskSage = () => {
    openAIChat();
    sendMessage(`Explain the key concepts of module: "${moduleData.title}" simply.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Video / Interactive Lesson Player Shell */}
      <div style={{
        height: '360px',
        background: '#040711',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-glow)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
        position: 'relative'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
          cursor: 'pointer',
          marginBottom: '16px'
        }}>
          <Play size={32} color="#fff" fill="#fff" style={{ marginLeft: '4px' }} />
        </div>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>{moduleData.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Duration: {moduleData.duration}</p>
      </div>

      {/* Lesson Control Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <Button variant="secondary" onClick={handleAskSage}>
          <Bot size={18} /> Ask Sage AI to Summarize Lesson
        </Button>

        <Button onClick={() => onCompleteModule(moduleData.id)}>
          <CheckCircle size={18} /> Mark Module Completed
        </Button>
      </div>
    </div>
  );
};
