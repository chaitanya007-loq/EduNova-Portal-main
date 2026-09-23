import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDynamicAvatar } from '../../utils/avatarUtils';

export const CreatePostModal = ({ isOpen, onClose, onAddPost }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('React, Architecture');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const authorName = user?.name || user?.username || 'EduNova User';
    onAddPost({
      id: `post_${Date.now()}`,
      author: {
        name: authorName,
        avatar: getDynamicAvatar(user, authorName),
        badge: 'Scholar'
      },
      title,
      content,
      tags: tags.split(',').map((t) => t.trim()),
      upvotes: 1,
      repliesCount: 0,
      timeAgo: 'Just now',
      bookmarked: false
    });

    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ask Community or Start Discussion">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
            Question or Topic Title:
          </label>
          <input
            type="text"
            placeholder="e.g. How do you handle async state error recovery in React?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
            Detailed Explanation:
          </label>
          <textarea
            rows={5}
            placeholder="Provide context, code snippets, or specific questions..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', resize: 'vertical' }}
            required
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
            Tags (comma separated):
          </label>
          <input
            type="text"
            placeholder="React, Hooks, WebGL"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <Button type="submit" size="lg">
          <Send size={16} /> Publish Discussion Post
        </Button>
      </form>
    </Modal>
  );
};
