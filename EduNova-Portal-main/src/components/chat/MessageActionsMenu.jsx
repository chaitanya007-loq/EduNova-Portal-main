import React, { useState } from 'react';
import {
  Reply,
  Sparkles,
  FileText,
  HelpCircle,
  Calendar,
  Pin,
  Copy,
  MoreVertical
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const REACTION_EMOJIS = ['👍', '❤️', '🔥'];

export const MessageActionsMenu = ({
  message,
  onReply,
  onReact,
  onPin,
  onAskSage,
  onSaveNote,
  onCreateQuiz,
  onAddToStudyPlan,
  onCopy
}) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  if (!message) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '-34px',
        right: message.senderId === 'current_user' ? '8px' : 'auto',
        left: message.senderId === 'current_user' ? 'auto' : '8px',
        background: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 52, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isLight ? '1.5px solid rgba(200, 220, 240, 0.95)' : '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: '9999px',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: isLight ? '0 8px 25px rgba(64, 100, 160, 0.16)' : '0 8px 25px rgba(0, 0, 0, 0.6)',
        zIndex: 50
      }}
    >
      {/* Top 3 Emojis */}
      <div style={{ display: 'flex', gap: '2px', borderRight: isLight ? '1px solid rgba(200, 215, 240, 0.9)' : '1px solid rgba(255,255,255,0.14)', paddingRight: '6px' }}>
        {REACTION_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onReact(message.id, emoji)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.95rem',
              cursor: 'pointer',
              padding: '2px 4px',
              borderRadius: '6px',
              lineHeight: 1
            }}
            title={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Reply Action */}
      <button
        onClick={() => onReply(message)}
        style={{
          padding: '4px 8px',
          fontSize: '0.74rem',
          background: 'transparent',
          color: isLight ? '#0f172a' : '#cbd5e1',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: 700
        }}
        title="Reply"
      >
        <Reply size={13} color={isLight ? '#0284c7' : '#38bdf8'} /> Reply
      </button>

      {/* Ask Sage AI Action */}
      <button
        onClick={() => onAskSage(message)}
        style={{
          padding: '4px 8px',
          borderRadius: '9999px',
          background: isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(56, 189, 248, 0.18)',
          border: isLight ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid rgba(56, 189, 248, 0.35)',
          color: isLight ? '#0284c7' : '#38bdf8',
          fontSize: '0.74rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
        title="Ask Sage AI"
      >
        <Sparkles size={12} color={isLight ? '#0284c7' : '#38bdf8'} /> Sage
      </button>

      {/* More Actions Toggle */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          style={{
            padding: '4px',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            color: isLight ? '#64748b' : '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="More Actions"
        >
          <MoreVertical size={14} />
        </button>

        {/* Floating Dropdown for secondary actions */}
        {showMoreMenu && (
          <div
            style={{
              position: 'absolute',
              top: '28px',
              right: '0',
              background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              border: isLight ? '1.5px solid rgba(200, 220, 240, 0.95)' : '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '16px',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              minWidth: '150px',
              zIndex: 60
            }}
          >
            <button
              onClick={() => { onSaveNote(message); setShowMoreMenu(false); }}
              style={{ padding: '8px 12px', fontSize: '0.78rem', background: 'transparent', color: isLight ? '#0f172a' : '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '10px', textAlign: 'left', fontWeight: 700 }}
            >
              <FileText size={14} color="#c084fc" /> Save Note
            </button>
            <button
              onClick={() => { onCreateQuiz(message); setShowMoreMenu(false); }}
              style={{ padding: '8px 12px', fontSize: '0.78rem', background: 'transparent', color: isLight ? '#0f172a' : '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '10px', textAlign: 'left', fontWeight: 700 }}
            >
              <HelpCircle size={14} color="#fbbf24" /> Create Quiz
            </button>
            <button
              onClick={() => { onAddToStudyPlan(message); setShowMoreMenu(false); }}
              style={{ padding: '8px 12px', fontSize: '0.78rem', background: 'transparent', color: isLight ? '#0f172a' : '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '10px', textAlign: 'left', fontWeight: 700 }}
            >
              <Calendar size={14} color="#10b981" /> Study Plan
            </button>
            <button
              onClick={() => { onPin(message.id); setShowMoreMenu(false); }}
              style={{ padding: '8px 12px', fontSize: '0.78rem', background: 'transparent', color: isLight ? '#0f172a' : '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '10px', textAlign: 'left', fontWeight: 700 }}
            >
              <Pin size={14} color={message.isPinned ? "#f43f5e" : "#38bdf8"} /> {message.isPinned ? 'Unpin' : 'Pin'}
            </button>
            <button
              onClick={() => { onCopy(message.text); setShowMoreMenu(false); }}
              style={{ padding: '8px 12px', fontSize: '0.78rem', background: 'transparent', color: isLight ? '#0f172a' : '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '10px', textAlign: 'left', fontWeight: 700 }}
            >
              <Copy size={14} color="#94a3b8" /> Copy Text
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageActionsMenu;
