import React, { useState } from 'react';
import { X, Sparkles, MessageSquare, Plus, FileText, Image as ImageIcon, Code, Bot } from 'lucide-react';
import { Button } from '../common/Button';
import { useLearning } from '../../context/LearningContext';
import { useAuth } from '../../context/AuthContext';
import { getDynamicAvatar } from '../../utils/avatarUtils';

export const CreatePostModalEnhanced = ({ isOpen, onClose, onAddPost }) => {
  const { user } = useAuth();
  const { earnXp } = useLearning();

  const [postType, setPostType] = useState('Question');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('React');
  const [topic, setTopic] = useState('Hooks');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [tagsInput, setTagsInput] = useState('React, Hooks, Async');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const authorName = user?.name || user?.username || 'EduNova User';
    const newPost = {
      id: `post_${Date.now()}`,
      author: {
        name: authorName,
        avatar: getDynamicAvatar(user, authorName),
        badge: 'Pro Student',
        verified: true
      },
      title,
      content,
      subject,
      topic,
      difficulty,
      qualityStatus: 'Clear',
      tags: tagsInput.split(',').map((t) => t.trim()),
      upvotes: 1,
      repliesCount: 0,
      views: 1,
      timeAgo: 'Just now',
      bookmarked: false,
      acceptedAnswerId: null
    };

    onAddPost(newPost);
    earnXp(50, 'Community Question Asked', 'Community');
    onClose();
  };

  const handleSageImprove = () => {
    if (!title) {
      setTitle('How do you handle async state & cancellation tokens cleanly in React?');
    }
    if (!content) {
      setContent('I am implementing custom data fetching hooks and want to avoid memory leaks when components unmount during pending requests.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(3, 6, 18, 0.84)',
        backdropFilter: 'blur(14px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '620px',
          width: '100%',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={24} color="#06b6d4" /> Ask Question or Start Topic
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Select Post Type */}
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>POST TYPE</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Question', 'Discussion', 'Study Note', 'Resource', 'Project', 'Poll'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPostType(t)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: postType === t ? 'var(--accent-cyan)' : 'var(--glass-bg)',
                    border: postType === t ? 'none' : '1px solid var(--border-color)',
                    color: postType === t ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Subject & Difficulty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>SUBJECT</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}
              >
                <option value="React">React</option>
                <option value="Physics">Physics</option>
                <option value="DBMS">DBMS</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>DIFFICULTY</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>QUESTION TITLE</label>
              <button type="button" onClick={handleSageImprove} style={{ background: 'transparent', border: 'none', color: '#c084fc', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Bot size={14} /> Improve with Sage AI
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. How do you handle custom React hook error states?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.95rem' }}
            />
          </div>

          {/* Body Content Input */}
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>DETAILED DESCRIPTION / CODE SNIPPET</label>
            <textarea
              rows={4}
              placeholder="Provide background context, code examples, or error tracebacks..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', lineHeight: 1.5 }}
            />
          </div>

          {/* Tags Input */}
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>TAGS (comma-separated)</label>
            <input
              type="text"
              placeholder="React, Hooks, AsyncJS"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}
            />
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <Button type="button" variant="outline" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button type="submit" style={{ flex: 2 }}>
              Publish Topic (+50 XP) <Sparkles size={16} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
