import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Send, CheckCircle } from 'lucide-react';

export const ExchangeModal = ({ isOpen, onClose, exchange }) => {
  const [messageText, setMessageText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!exchange) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Request Skill Swap with ${exchange.user.name}`}>
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '30px 10px' }}>
          <CheckCircle size={56} color="#10b981" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Exchange Request Transmitted!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            {exchange.user.name} will be notified via the EduNova Skill Exchange hub.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Offered Skill:</span> <strong>{exchange.teaches}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Desired Skill:</span> <strong>{exchange.wantsToLearn}</strong>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
              Introductory Message:
            </label>
            <textarea
              rows={4}
              placeholder={`Hi ${exchange.user.name}, I would love to mentor you on React in exchange for UI design systems practice!`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{ width: '100%', resize: 'vertical' }}
              required
            />
          </div>

          <Button type="submit" size="lg">
            <Send size={16} /> Send Exchange Offer
          </Button>
        </form>
      )}
    </Modal>
  );
};
