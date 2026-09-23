import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Share2,
  CheckCircle2,
  Bot,
  Eye,
  ShieldCheck,
  Zap,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Button } from '../common/Button';
import { useLearning } from '../../context/LearningContext';

export const PostCardEnhanced = ({ post, onTurnIntoQuiz, onTurnIntoNotes }) => {
  const { earnXp } = useLearning();
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(post.bookmarked || false);
  const [showSageDrawer, setShowSageDrawer] = useState(false);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
      earnXp(10, 'Community Contribution Upvote', 'Community');
    } else {
      setUpvotes((prev) => prev - 1);
      setHasUpvoted(false);
    }
  };

  return (
    <div
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: 'var(--glass-shadow)',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={post.author.avatar}
            alt={post.author.name}
            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-glow)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{post.author.name}</strong>
              {post.author.verified && <ShieldCheck size={16} color="#06b6d4" />}
              <span className="cyber-badge" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>{post.author.badge}</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {post.subject} • {post.topic} • {post.timeAgo}
            </span>
          </div>
        </div>

        {/* Quality & Difficulty Badges */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {post.qualityStatus && (
            <span className="cyber-badge-cyan" style={{ fontSize: '0.75rem' }}>
              ✨ {post.qualityStatus}
            </span>
          )}
          <span className="cyber-badge-purple" style={{ fontSize: '0.75rem' }}>
            {post.difficulty}
          </span>
        </div>
      </div>

      {/* Post Title & Content */}
      <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.45 }}>
        {post.title}
      </h3>
      <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
        {post.content}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
        {post.tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 700
            }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Verified / Accepted Answer Highlight */}
      {post.acceptedAnswer && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> ACCEPTED VERIFIED ANSWER
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>By {post.acceptedAnswer.author}</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
            "{post.acceptedAnswer.content}"
          </p>
        </div>
      )}

      {/* Action Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleUpvote}
            style={{
              background: hasUpvoted ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-secondary)',
              border: hasUpvoted ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
              color: hasUpvoted ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ThumbsUp size={15} /> {upvotes}
          </button>

          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={15} /> {post.repliesCount} Replies
          </span>

          <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Eye size={15} /> {post.views} Views
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setShowSageDrawer(!showSageDrawer)}
            style={{
              background: showSageDrawer ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-secondary)',
              border: '1px solid var(--accent-secondary)',
              color: '#c084fc',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Bot size={15} /> Ask Sage AI
          </button>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: bookmarked ? '#f59e0b' : 'var(--text-muted)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            <Bookmark size={16} fill={bookmarked ? '#f59e0b' : 'none'} />
          </button>
        </div>
      </div>

      {/* Sage AI Action Drawer */}
      {showSageDrawer && (
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed var(--border-glow)', background: 'rgba(168, 85, 247, 0.08)', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Bot size={18} color="#c084fc" />
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Sage AI Discussion Actions</strong>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button size="sm" variant="outline" onClick={() => onTurnIntoQuiz(post)}>
              <Sparkles size={14} /> Turn into Quiz
            </Button>
            <Button size="sm" variant="outline" onClick={() => onTurnIntoNotes(post)}>
              <BookOpen size={14} /> Create Notes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
