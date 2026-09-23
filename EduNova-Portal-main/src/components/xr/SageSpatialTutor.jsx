import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, CheckCircle2, XCircle, Send, Bot, User, RefreshCw, Award, HelpCircle, BookOpen, Layers, Zap } from 'lucide-react';
import { askSageAI } from '../../services/aiService';
import { useTheme } from '../../context/ThemeContext';

const SageQuizCard = ({ quizData, onRewardXP, isLight }) => {
  const questions = quizData?.questions || [];
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId, optionId) => {
    if (submitted) return;
    setSelected(prev => ({ ...prev, [qId]: optionId }));
  };

  const getScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (selected[q.id] === q.correctOptionId) score++;
    });
    return score;
  };

  return (
    <div style={{
      background: isLight
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 249, 255, 0.95) 100%)'
        : 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
      border: isLight ? '1px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(56, 189, 248, 0.4)',
      borderRadius: '16px',
      padding: '16px',
      marginTop: '8px',
      boxShadow: isLight ? '0 6px 20px rgba(100, 130, 200, 0.12)' : '0 10px 30px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800, fontSize: '0.86rem', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color={isLight ? '#0284c7' : '#38bdf8'} />
          <span>🎯 {quizData.topicName || quizData.subjectName || 'Model Quiz'}</span>
        </div>
        <span style={{ fontSize: '0.74rem', background: 'rgba(56, 189, 248, 0.15)', color: '#0284c7', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 700 }}>
          {questions.length} Questions
        </span>
      </div>

      {questions.map((q, idx) => {
        const userChoice = selected[q.id];
        const isCorrect = userChoice === q.correctOptionId;

        return (
          <div key={q.id || idx} style={{ marginBottom: '14px', background: isLight ? 'rgba(240, 246, 255, 0.75)' : 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '12px', border: isLight ? '1px solid rgba(210, 225, 250, 0.8)' : '1px solid rgba(255, 255, 255, 0.06)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.84rem', fontWeight: 700, color: isLight ? '#0f172a' : '#f8fafc', lineHeight: 1.4 }}>
              Q{idx + 1}. {q.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {q.options?.map(opt => {
                const isOptSelected = userChoice === opt.id;
                let bg = isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.8)';
                let border = isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.1)';
                let textColor = isLight ? '#0f172a' : '#cbd5e1';

                if (submitted) {
                  if (opt.id === q.correctOptionId) {
                    bg = 'rgba(16, 185, 129, 0.2)';
                    border = '1px solid #10b981';
                    textColor = '#059669';
                  } else if (isOptSelected && !isCorrect) {
                    bg = 'rgba(244, 63, 94, 0.2)';
                    border = '1px solid #f43f5e';
                    textColor = '#e11d48';
                  }
                } else if (isOptSelected) {
                  bg = 'rgba(56, 189, 248, 0.2)';
                  border = '1px solid #06b6d4';
                  textColor = '#0284c7';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(q.id, opt.id)}
                    style={{
                      padding: '7px 10px',
                      borderRadius: '8px',
                      background: bg,
                      border: border,
                      color: textColor,
                      fontSize: '0.8rem',
                      textAlign: 'left',
                      cursor: submitted ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                      fontWeight: isOptSelected ? 700 : 500
                    }}
                  >
                    <span><strong>{opt.id}.</strong> {opt.text}</span>
                    {submitted && opt.id === q.correctOptionId && <CheckCircle2 size={14} color="#059669" />}
                    {submitted && isOptSelected && !isCorrect && <XCircle size={14} color="#e11d48" />}
                  </button>
                );
              })}
            </div>

            {submitted && q.explanation && (
              <div style={{ marginTop: '8px', fontSize: '0.76rem', color: isLight ? '#334155' : '#94a3b8', fontStyle: 'italic', background: 'rgba(56, 189, 248, 0.1)', padding: '6px 10px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                💡 <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          onClick={() => {
            setSubmitted(true);
            if (onRewardXP) onRewardXP(20, 'Practice Quiz');
          }}
          disabled={Object.keys(selected).length === 0}
          style={{
            width: '100%',
            padding: '9px',
            borderRadius: '10px',
            background: Object.keys(selected).length === 0 ? (isLight ? 'rgba(200, 218, 240, 0.5)' : 'rgba(30, 41, 59, 0.5)') : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: '#fff',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: Object.keys(selected).length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: Object.keys(selected).length > 0 ? '0 4px 15px rgba(6, 182, 212, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          Submit Quiz Answers
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.15)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', marginTop: '8px' }}>
          <div style={{ color: '#059669', fontWeight: 800, fontSize: '0.84rem' }}>
            🎉 Score: {getScore()} / {questions.length} Correct (+20 XP)
          </div>
          <button
            onClick={() => { setSubmitted(false); setSelected({}); }}
            style={{ background: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)', border: 'none', color: isLight ? '#0f172a' : '#fff', fontSize: '0.74rem', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
          >
            Retry Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export const SageSpatialTutor = ({ model, activeHotspot, context, onRewardXP }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);

  const quickActions = [
    { label: 'Explain This', icon: Sparkles, prompt: `Explain the ${activeHotspot ? activeHotspot.name : model?.name || 'concept'} clearly and concisely.` },
    { label: 'Why Is This Important?', icon: HelpCircle, prompt: `Why is ${activeHotspot ? activeHotspot.name : model?.name || 'this structure'} important in real-world applications?` },
    { label: 'Give Me a Quiz', icon: Award, prompt: `Give me 3 practice MCQs on ${activeHotspot ? activeHotspot.name : model?.name || 'this topic'} with answers hidden.` },
    { label: 'Show Me an Example', icon: BookOpen, prompt: `Give me a concrete step-by-step real world example of ${activeHotspot ? activeHotspot.name : model?.name || 'this concept'}.` },
    { label: 'Compare', icon: Layers, prompt: `Compare ${activeHotspot ? activeHotspot.name : model?.name} with its primary alternative or counterpart.` },
    { label: 'Summarize', icon: Zap, prompt: `Summarize the main function of ${model?.name} in 3 bullet points.` }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (customPrompt = null) => {
    const query = customPrompt || userInput;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setUserInput('');
    setLoading(true);

    try {
      const response = await askSageAI(query, messages, {
        subjectId: context?.subject || model?.category || 'Biology',
        topicId: activeHotspot ? activeHotspot.name : (model?.name || model?.topic || 'Human Heart 3D Anatomy'),
        currentTopic: activeHotspot ? activeHotspot.name : (model?.name || model?.topic || 'Human Heart 3D Anatomy'),
        currentSubject: model?.category || 'Biology'
      });

      const aiText = typeof response === 'object' && response.text ? response.text : String(response);
      
      let parsedQuiz = null;
      if (response && response.type === 'quiz' && response.data) {
        parsedQuiz = response.data;
      } else {
        try {
          const raw = aiText.trim();
          if (raw.startsWith('{') && (raw.includes('"quizId"') || raw.includes('"questions"'))) {
            parsedQuiz = JSON.parse(raw);
          }
        } catch (e) {
          // Plain text response
        }
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'sage',
        text: parsedQuiz ? '' : aiText,
        quizData: parsedQuiz,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMsg]);
      if (onRewardXP) onRewardXP(15, 'Spatial Inquiry');
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'sage', text: "Sage is retrieving model details right now. Please try asking again.", isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 246, 255, 0.9) 100%)'
          : 'rgba(15, 23, 42, 0.88)',
        border: isLight ? '1.5px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '20px',
        padding: '18px',
        color: isLight ? '#0f172a' : '#ffffff',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        height: '100%',
        boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : '0 20px 40px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: isLight ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
              Sage AI Spatial Tutor
            </h3>
            <p style={{ margin: 0, color: isLight ? '#0284c7' : '#38bdf8', fontSize: '0.76rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
              Active: {activeHotspot ? activeHotspot.name : model?.name || 'Overview Mode'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Prompt Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {quickActions.map((qa, idx) => {
          const IconComp = qa.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(qa.prompt)}
              disabled={loading}
              style={{
                background: isLight ? 'rgba(238, 242, 255, 0.9)' : 'rgba(30, 41, 59, 0.85)',
                border: isLight ? '1px solid rgba(199, 210, 254, 0.9)' : '1px solid rgba(56, 189, 248, 0.25)',
                color: isLight ? '#1e40af' : '#38bdf8',
                padding: '6px 11px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {IconComp && <IconComp size={12} color={isLight ? '#1e40af' : '#38bdf8'} />}
              {qa.label}
            </button>
          );
        })}
      </div>

      {/* Conversation Thread */}
      <div
        style={{
          flex: 1,
          minHeight: '380px',
          maxHeight: '480px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(5, 8, 20, 0.65)',
          padding: '14px',
          borderRadius: '14px',
          border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        {messages.length === 0 ? (
          <div style={{ color: isLight ? '#475569' : '#94a3b8', fontSize: '0.84rem', textAlign: 'center', marginTop: '60px', padding: '0 20px', lineHeight: 1.5 }}>
            <Bot size={36} color={isLight ? '#0284c7' : '#38bdf8'} style={{ marginBottom: '10px', opacity: 0.9 }} />
            <br />
            Select a hotspot or click a quick action above to ask <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>Sage AI</strong> about <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>{model?.name || 'this model'}</strong>.
          </div>
        ) : (
          messages.map(m => (
            <div
              key={m.id}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                background: m.sender === 'user'
                  ? 'linear-gradient(135deg, #06b6d4, #6366f1)'
                  : (isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.95)'),
                padding: '12px 15px',
                borderRadius: '14px',
                color: m.sender === 'user' ? '#ffffff' : (isLight ? '#0f172a' : '#ffffff'),
                maxWidth: '92%',
                fontSize: '0.84rem',
                lineHeight: 1.5,
                border: m.sender === 'user'
                  ? 'none'
                  : (isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(56, 189, 248, 0.25)'),
                boxShadow: isLight ? '0 4px 14px rgba(100, 130, 200, 0.1)' : '0 4px 15px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: m.sender === 'user' ? '#e0e7ff' : (isLight ? '#5D7192' : '#94a3b8'), marginBottom: '6px', fontWeight: 700 }}>
                {m.sender === 'user' ? 'You' : 'Sage AI'} • {m.time}
              </div>
              {m.quizData ? (
                <SageQuizCard quizData={m.quizData} onRewardXP={onRewardXP} isLight={isLight} />
              ) : (
                <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontSize: '0.8rem', fontStyle: 'italic', background: 'rgba(56, 189, 248, 0.12)', padding: '8px 12px', borderRadius: '10px', width: 'fit-content', fontWeight: 600 }}>
            <RefreshCw size={14} className="spin" /> Sage is retrieving model context...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Custom Inquiry Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Ask Sage anything about this model..."
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          style={{
            flex: 1,
            background: isLight ? '#ffffff' : 'rgba(5, 8, 20, 0.8)',
            border: isLight ? '1px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: isLight ? '#0f172a' : '#fff',
            fontSize: '0.84rem',
            outline: 'none',
            fontWeight: 600
          }}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !userInput.trim()}
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: '#fff',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.84rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)'
          }}
        >
          <Send size={14} /> Ask
        </button>
      </div>
    </div>
  );
};

export default SageSpatialTutor;
