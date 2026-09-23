import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Calendar,
  CheckSquare,
  FileText,
  Folder,
  Star,
  Users,
  Clock,
  Plus,
  Send,
  Sparkles,
  BookOpen,
  Video
} from 'lucide-react';
import { getExchangeNotes, addExchangeNote } from '../../services/skillExchangeService';
import { getExchangeGoals, toggleMilestoneCompletion, addExchangeGoal } from '../../services/exchangeGoalService';
import { getExchangeMessages, sendExchangeMessage } from '../../services/messageService';
import { AIExchangeAssistant } from './AIExchangeAssistant';

export const ActiveExchangeWorkspace = ({ exchange, onScheduleMeeting, onOpenMeetingRoom }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'messages' | 'meetings' | 'goals' | 'notes' | 'resources' | 'assistant'

  const [notes, setNotes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalMilestones, setNewGoalMilestones] = useState('');
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  useEffect(() => {
    if (exchange?.id) {
      setNotes(getExchangeNotes(exchange.id));
      setGoals(getExchangeGoals(exchange.id));
      setMessages(getExchangeMessages(exchange.id));
    }
  }, [exchange]);

  if (!exchange) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = sendExchangeMessage(exchange.id, chatInput);
    if (msg) setMessages(prev => [...prev, msg]);
    setChatInput('');
  };

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    const created = addExchangeNote(exchange.id, newNoteTitle, newNoteContent);
    if (created) setNotes(prev => [created, ...prev]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  const handleToggleMilestone = (goalId, milestoneId) => {
    const updatedGoals = toggleMilestoneCompletion(exchange.id, goalId, milestoneId);
    if (updatedGoals) setGoals(updatedGoals);
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    const milestonesList = newGoalMilestones.split('\n').filter(m => m.trim().length > 0);
    const created = addExchangeGoal(exchange.id, newGoalTitle, exchange.userSkill || 'General', milestonesList);
    if (created) setGoals(prev => [...prev, created]);
    setNewGoalTitle('');
    setNewGoalMilestones('');
    setIsAddingGoal(false);
  };

  return (
    <div style={{ borderRadius: '24px', background: 'rgba(12, 16, 36, 0.95)', border: '1px solid rgba(255, 255, 255, 0.14)', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', marginBottom: '32px' }}>
      {/* Workspace Top Banner */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', background: 'linear-gradient(135deg, #050814 0%, #0c1024 100%)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={exchange.peerAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
            alt={exchange.peerName}
            style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover', border: '2px solid rgba(6, 182, 212, 0.5)', shrink: 0 }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {exchange.userSkill} ↔ {exchange.peerSkill} Exchange
              </h2>
              <span className="se-tag-cyan" style={{ padding: '2px 8px', fontSize: '0.68rem' }}>
                Active
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Peer Partner: <strong style={{ color: '#38bdf8' }}>{exchange.peerName}</strong> ({exchange.peerTitle})
            </p>
          </div>
        </div>

        <div>
          <button
            onClick={() => onScheduleMeeting(exchange)}
            className="se-btn se-btn-primary"
          >
            <Calendar size={16} />
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', background: '#050814', padding: '8px', gap: '6px' }}>
        {[
          { id: 'overview', label: 'Overview', icon: BookOpen },
          { id: 'messages', label: 'Chat', icon: MessageSquare },
          { id: 'meetings', label: 'Meetings', icon: Calendar },
          { id: 'goals', label: 'Goals & Milestones', icon: CheckSquare },
          { id: 'notes', label: 'Shared Notes', icon: FileText },
          { id: 'resources', label: 'Resources', icon: Folder },
          { id: 'assistant', label: 'Sage Assistant', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: isActive ? '1px solid #06b6d4' : '1px solid transparent',
                background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8'
              }}
            >
              <Icon size={16} color={isActive ? '#38bdf8' : '#94a3b8'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div style={{ padding: '24px' }}>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: '16px', background: '#050814', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Total Teaching Hours</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{exchange.totalTeachingHours || 4.5} hrs</span>
              </div>
              <div style={{ padding: '16px', borderRadius: '16px', background: '#050814', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Total Learning Hours</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{exchange.totalLearningHours || 4.5} hrs</span>
              </div>
              <div style={{ padding: '16px', borderRadius: '16px', background: '#050814', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Sessions Completed</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>{exchange.sessionsCompleted || 3} Sessions</span>
              </div>
            </div>

            {/* Next Scheduled Meeting Banner */}
            {exchange.nextMeeting && (
              <div style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Upcoming Scheduled Meeting
                  </span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>{exchange.nextMeeting.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '4px 0 0 0' }}>{exchange.nextMeeting.date} at {exchange.nextMeeting.time}</p>
                </div>
                <button
                  onClick={() => onOpenMeetingRoom(exchange.nextMeeting)}
                  className="se-btn se-btn-primary"
                >
                  <Video size={16} />
                  Join Room
                </button>
              </div>
            )}
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '380px' }}>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px', marginBottom: '16px' }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    maxWidth: '80%',
                    fontSize: '0.85rem',
                    alignSelf: m.senderId === 'current_user' ? 'flex-end' : 'flex-start',
                    background: m.senderId === 'current_user' ? '#06b6d4' : '#050814',
                    color: m.senderId === 'current_user' ? '#050814' : '#ffffff',
                    border: m.senderId === 'current_user' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', opacity: 0.8, marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800 }}>{m.senderName}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p style={{ margin: 0, lineHeight: 1.4 }}>{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="se-form-input"
                style={{ flex: 1 }}
              />
              <button type="submit" className="se-btn se-btn-primary" style={{ padding: '12px 20px' }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        {/* GOALS TAB */}
        {activeTab === 'goals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0 }}>Milestone Goals</h3>
              <button
                onClick={() => setIsAddingGoal(!isAddingGoal)}
                className="se-btn se-btn-purple"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <Plus size={14} /> Add Goal
              </button>
            </div>

            {isAddingGoal && (
              <form onSubmit={handleCreateGoal} style={{ padding: '16px', borderRadius: '16px', background: '#050814', border: '1px solid rgba(168, 85, 247, 0.3)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="Goal Title (e.g. Master React Context API)"
                  className="se-form-input"
                />
                <textarea
                  rows={3}
                  value={newGoalMilestones}
                  onChange={(e) => setNewGoalMilestones(e.target.value)}
                  placeholder="Enter milestones (one per line)"
                  className="se-form-textarea"
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="button" onClick={() => setIsAddingGoal(false)} className="se-btn se-btn-secondary" style={{ padding: '6px 12px' }}>Cancel</button>
                  <button type="submit" className="se-btn se-btn-purple" style={{ padding: '6px 14px' }}>Save Goal</button>
                </div>
              </form>
            )}

            {goals.map((g) => (
              <div key={g.id} style={{ padding: '16px', borderRadius: '16px', background: '#050814', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0 }}>{g.title}</h4>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>{g.progress}% Completed</span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#06b6d4', width: `${g.progress}%`, transition: 'all 0.3s ease' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
                  {g.milestones.map((m) => (
                    <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={m.completed}
                        onChange={() => handleToggleMilestone(g.id, m.id)}
                        style={{ width: '16px', height: '16px', accentColor: '#06b6d4' }}
                      />
                      <span style={{ textDecoration: m.completed ? 'line-through' : 'none', opacity: m.completed ? 0.6 : 1 }}>{m.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0 }}>Collaborative Notes</h3>
              <button
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="se-btn se-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <Plus size={14} /> Add Note
              </button>
            </div>

            {isAddingNote && (
              <form onSubmit={handleCreateNote} style={{ padding: '16px', borderRadius: '16px', background: '#050814', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Note Title..."
                  className="se-form-input"
                />
                <textarea
                  rows={4}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Note content..."
                  className="se-form-textarea"
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="button" onClick={() => setIsAddingNote(false)} className="se-btn se-btn-secondary" style={{ padding: '6px 12px' }}>Cancel</button>
                  <button type="submit" className="se-btn se-btn-primary" style={{ padding: '6px 14px' }}>Save Note</button>
                </div>
              </form>
            )}

            {notes.map((n) => (
              <div key={n.id} style={{ padding: '16px', borderRadius: '16px', background: '#050814', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0 }}>{n.title}</h4>
                <div style={{ whitespace: 'pre-line', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '12px' }}>
                  {n.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ASSISTANT TAB */}
        {activeTab === 'assistant' && (
          <AIExchangeAssistant activeExchange={exchange} />
        )}
      </div>
    </div>
  );
};
