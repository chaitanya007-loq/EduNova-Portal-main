import React, { useState } from 'react';
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, Volume2, VolumeX, Code, Sparkles, HelpCircle, AlertTriangle, RefreshCw, BookOpen } from 'lucide-react';
import { InteractiveQuiz } from '../subjects/InteractiveQuiz';
import { QuizConfigurator } from './QuizConfigurator';
import { ConversationalQuizSetup } from './ConversationalQuizSetup';
import { notesService } from '../../services/notesService';

import { useTheme } from '../../context/ThemeContext';

export const ChatMessage = ({ message, onPromptSelect }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isSage = message.sender === 'sage';
  const [copied, setCopied] = useState(false);
  const [savedAsNote, setSavedAsNote] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rated, setRated] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAsNote = async () => {
    try {
      const cleanTitle = (message.text || 'Sage AI Note').replace(/[#*`$\\]/g, '').trim().slice(0, 40) + '...';
      await notesService.createNote({
        title: `Sage AI Note: ${cleanTitle}`,
        content: message.text || '',
        type: 'AI_NOTE',
        source: 'SAGE_AI',
        tags: ['#sage-ai', '#saved-response']
      });
      setSavedAsNote(true);
      setTimeout(() => setSavedAsNote(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const cleanText = (message.text || '').replace(/[#*`$\\]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Format inline bold text **...**
  const formatInlineBold = (str) => {
    const boldColor = isLight ? '#18345F' : '#ffffff';
    return str.replace(/\*\*(.*?)\*\*/g, `<strong style="color: ${boldColor}; font-weight: 800;">$1</strong>`);
  };

  // Markdown Formatter
  const renderFormattedContent = (content) => {
    if (!content) return null;

    // Code block detection ```
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', text: content.substring(lastIndex, match.index) });
      }
      parts.push({ type: 'code', lang: match[1] || 'code', code: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) {
      parts.push({ type: 'text', text: content.substring(lastIndex) });
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {parts.map((part, pIdx) => {
          if (part.type === 'code') {
            return (
              <div key={pIdx} style={{ background: '#090d16', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden', margin: '6px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                    <Code size={12} color="#06b6d4" /> {part.lang}
                  </span>
                  <button
                    onClick={() => handleCopyCode(part.code)}
                    style={{ background: 'none', border: 'none', color: codeCopied ? '#34d399' : '#94a3b8', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {codeCopied ? <Check size={12} /> : <Copy size={12} />}
                    {codeCopied ? 'Copied' : 'Copy Code'}
                  </button>
                </div>
                <pre style={{ margin: 0, padding: '12px', fontSize: '0.85rem', fontFamily: 'Fira Code, monospace', color: '#e2e8f0', overflowX: 'auto', lineHeight: 1.5 }}>
                  <code>{part.code}</code>
                </pre>
              </div>
            );
          }

          const textLines = part.text.split('\n');
          return (
            <div key={pIdx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {textLines.map((line, lIdx) => {
                const trimmed = line.trim();
                if (!trimmed) return null;

                // Headings ###
                if (trimmed.startsWith('###')) {
                  const headingText = trimmed.replace(/^###\s*/, '').replace(/\*\*/g, '');
                  return (
                    <h3 key={lIdx} style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', margin: '8px 0 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={16} /> {headingText}
                    </h3>
                  );
                }

                // Bullet points
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  const bulletText = trimmed.substring(2);
                  return (
                    <div key={lIdx} style={{ display: 'flex', gap: '8px', paddingLeft: '8px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      <span style={{ color: '#06b6d4' }}>•</span>
                      <span dangerouslySetInnerHTML={{ __html: formatInlineBold(bulletText) }} />
                    </div>
                  );
                }

                // Numbered list
                if (/^\d+\.\s/.test(trimmed)) {
                  return (
                    <div key={lIdx} style={{ paddingLeft: '4px', fontSize: '0.88rem', color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: formatInlineBold(trimmed) }} />
                  );
                }

                return (
                  <p key={lIdx} style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: formatInlineBold(trimmed) }} />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isSage ? 'flex-start' : 'flex-end',
      marginBottom: '10px'
    }}>
      <div style={{ display: 'flex', gap: '10px', maxWidth: isSage ? '94%' : '85%', flexDirection: isSage ? 'row' : 'row-reverse', width: '100%' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: isSage ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isSage ? '0 0 12px rgba(99, 102, 241, 0.5)' : 'none',
          marginTop: '2px'
        }}>
          {isSage ? <Bot size={17} color="#fff" /> : <User size={17} color="var(--text-secondary)" />}
        </div>

        <div style={{
          padding: message.type === 'quiz' ? '0' : '14px 18px',
          borderRadius: isSage ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
          background: message.isError 
            ? 'rgba(244, 63, 94, 0.12)'
            : isSage 
              ? (message.type === 'quiz' ? 'transparent' : (isLight ? 'rgba(255, 255, 255, 0.92)' : 'var(--bg-tertiary)'))
              : 'linear-gradient(135deg, #06b6d4, #6366f1)',
          color: isSage ? (isLight ? '#18345F' : 'var(--text-primary)') : '#ffffff',
          fontSize: '0.88rem',
          lineHeight: 1.55,
          border: message.isError 
            ? '1px solid rgba(244, 63, 94, 0.4)' 
            : (isSage && message.type !== 'quiz' ? (isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid var(--border-color)') : 'none'),
          boxShadow: message.type === 'quiz' ? 'none' : (isLight ? '0 4px 16px rgba(180, 200, 230, 0.35)' : '0 4px 14px rgba(0, 0, 0, 0.25)'),
          width: '100%'
        }}>
          {/* Error Message View */}
          {message.isError ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185', fontWeight: 800, fontSize: '0.92rem' }}>
                <AlertTriangle size={18} /> Sage AI Connection Notice
              </div>
              <p style={{ margin: 0, color: '#f8fafc', fontSize: '0.88rem' }}>
                {message.text}
              </p>
              <button
                onClick={() => onPromptSelect && onPromptSelect('Retry last request')}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '4px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  background: 'rgba(244, 63, 94, 0.2)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  color: '#fb7185',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={13} /> Retry
              </button>
            </div>
          ) : (message.type === 'quiz_setup' || message.type === 'quiz_config') ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {message.text && (
                <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '4px' }}>
                  {renderFormattedContent(message.text)}
                </div>
              )}
              <ConversationalQuizSetup 
                initialConfig={message.setupConfig || {}}
                onStartQuiz={(config) => {
                  if (onPromptSelect) {
                    onPromptSelect(`Give me a ${config.count} question ${config.difficulty} ${config.questionType} quiz on ${config.topicName} in ${config.subjectName} mode ${config.mode}`);
                  }
                }}
              />
            </div>
          ) : message.type === 'quiz' && message.quizData ? (
            /* Render Interactive Quiz Engine Component Directly inside Chat! */
            <InteractiveQuiz 
              quiz={message.quizData} 
              subjectName={message.quizData.subjectName}
              onReconfigure={(prevQuiz) => {
                if (onPromptSelect) {
                  onPromptSelect(`Create a quiz for ${prevQuiz.subjectName || 'Subject'}`);
                }
              }}
            />
          ) : isSage ? (
            renderFormattedContent(message.text)
          ) : (
            <div>{message.text}</div>
          )}

          {/* Suggested Action Chips */}
          {isSage && !message.isError && message.type !== 'quiz' && message.suggestedActions && message.suggestedActions.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
              {message.suggestedActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => onPromptSelect(action)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ {action}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isSage && !message.isError && message.type !== 'quiz' && (
        <div style={{ display: 'flex', gap: '14px', marginLeft: '42px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <button onClick={handleTextToSpeech} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: isSpeaking ? '#38bdf8' : 'inherit', cursor: 'pointer' }}>
            {isSpeaking ? <VolumeX size={13} color="#f43f5e" /> : <Volume2 size={13} />} {isSpeaking ? 'Stop Voice' : 'Listen'}
          </button>
          <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />} Copy
          </button>
          <button onClick={handleSaveAsNote} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: savedAsNote ? '#10b981' : '#38bdf8', cursor: 'pointer', fontWeight: 700 }}>
            {savedAsNote ? <Check size={13} color="#10b981" /> : <BookOpen size={13} color="#38bdf8" />} {savedAsNote ? 'Saved as Note!' : 'Save as Note'}
          </button>
          <button onClick={() => setRated('up')} style={{ background: 'none', border: 'none', color: rated === 'up' ? '#10b981' : 'inherit', cursor: 'pointer' }}>
            <ThumbsUp size={13} /> Helpful
          </button>
          <button onClick={() => setRated('down')} style={{ background: 'none', border: 'none', color: rated === 'down' ? '#f43f5e' : 'inherit', cursor: 'pointer' }}>
            <ThumbsDown size={13} />
          </button>
        </div>
      )}
    </div>
  );
};
