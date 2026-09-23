import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import { Card } from '../common/Card';

export const PostCard = ({ post }) => {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(post.bookmarked);

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes(upvotes - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(upvotes + 1);
      setHasUpvoted(true);
    }
  };

  return (
    <Card hoverEffect style={{ marginBottom: '16px' }}>
      {/* Author Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={post.author.avatar}
            alt={post.author.name}
            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{post.author.name}</h4>
              <span className="cyber-badge" style={{ fontSize: '0.7rem' }}>{post.author.badge}</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{post.timeAgo}</span>
          </div>
        </div>

        <button onClick={() => setIsBookmarked(!isBookmarked)} style={{ color: isBookmarked ? '#f59e0b' : 'var(--text-muted)' }}>
          <Bookmark size={18} fill={isBookmarked ? '#f59e0b' : 'none'} />
        </button>
      </div>

      {/* Title & Body */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
        {post.title}
      </h3>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
        {post.content}
      </p>

      {/* Tags List */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {post.tags.map((t) => (
          <span key={t} style={{
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-accent)',
            fontSize: '0.75rem'
          }}>
            #{t}
          </span>
        ))}
      </div>

      {/* Actions Toolbar */}
      <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem', color: 'var(--text-muted)', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={handleUpvote} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasUpvoted ? '#6366f1' : 'inherit' }}>
          <ThumbsUp size={16} fill={hasUpvoted ? '#6366f1' : 'none'} /> {upvotes} Upvotes
        </button>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MessageSquare size={16} /> {post.repliesCount} Replies
        </span>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit' }}>
          <Share2 size={16} /> Share
        </button>
      </div>
    </Card>
  );
};
