import React, { useState } from 'react';
import { Sparkles, Bot, Send, CheckCircle2, FileText, Lightbulb, Zap } from 'lucide-react';

export const AIExchangeAssistant = ({ activeExchange, onApplyAgenda }) => {
  const [queryInput, setQueryInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'sage',
      text: "Hello! I am Sage Match Assistant. I can generate meeting agendas, summarize completed sessions, suggest mentor questions, or explain your peer compatibility."
    }
  ]);
  const [generatedAgenda, setGeneratedAgenda] = useState(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    const userText = queryInput;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setQueryInput('');

    // Process intent
    setTimeout(() => {
      let reply = "Sage AI: Based on your current exchange goals, I recommend focusing on state patterns and component architecture in your upcoming session.";
      if (userText.toLowerCase().includes('mentor')) {
        reply = "Here are 3 great questions for your mentor:\n1. How do you structure large component folders in production?\n2. What design system tokens save the most time in Figma?\n3. How do you handle asynchronous data loading gracefully?";
      } else if (userText.toLowerCase().includes('agenda')) {
        reply = "Generating a structured 60-minute agenda based on your React ↔ UI/UX exchange progress...";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'sage', text: reply }]);
    }, 600);
  };

  const handleGenerateAgenda = () => {
    const agendaText = `🎯 **60-Minute Peer Learning Agenda**\n\n- **00–10 min**: Review previous concept (React Hooks & State)\n- **10–30 min**: Deep dive into new concept (Figma Auto Layout v5)\n- **30–45 min**: Hands-on practical exercise\n- **45–55 min**: Q&A and code review\n- **55–60 min**: Action items & next session goals`;
    setGeneratedAgenda(agendaText);
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 backdrop-blur-xl shadow-2xl flex flex-col h-[500px]">
      {/* Assistant Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Sage Match Assistant
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400">Context-aware peer learning AI tutor</p>
          </div>
        </div>

        <button
          onClick={handleGenerateAgenda}
          className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          ✨ Generate Agenda
        </button>
      </div>

      {/* Generated Agenda Banner */}
      {generatedAgenda && (
        <div className="mb-4 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs space-y-2">
          <div className="flex justify-between items-center font-bold text-purple-300">
            <span>AI Session Agenda Generated</span>
            <button
              onClick={() => {
                if (onApplyAgenda) onApplyAgenda(generatedAgenda);
                setGeneratedAgenda(null);
              }}
              className="px-2.5 py-1 rounded-lg bg-purple-500 text-slate-950 text-[11px] font-bold"
            >
              Apply to Meeting
            </button>
          </div>
          <div className="whitespace-pre-line text-[11px] leading-relaxed opacity-90">{generatedAgenda}</div>
        </div>
      )}

      {/* Message Chat History */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3.5 rounded-2xl max-w-[85%] text-xs ${
              m.sender === 'user'
                ? 'ml-auto bg-cyan-500 text-slate-950 font-medium rounded-br-none'
                : 'bg-slate-800/80 border border-slate-700/70 text-slate-200 rounded-bl-none'
            }`}
          >
            <div className="whitespace-pre-line leading-relaxed">{m.text}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-slate-800">
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder='Ask Sage: "Suggest questions for mentor" or "Create agenda"'
          className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
        />
        <button type="submit" className="p-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
