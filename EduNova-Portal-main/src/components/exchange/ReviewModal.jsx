import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Star, Award, CheckCircle } from 'lucide-react';

export const ReviewModal = ({ isOpen, onClose, exchange, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!exchange) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onReviewSubmitted && onReviewSubmitted({ rating, comment });
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Rate & Review Exchange with ${exchange.partner?.name || 'Partner'}`}>
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '24px 10px' }}>
          <CheckCircle size={52} color="#10b981" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Review Transmitted! 🎉</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Thank you for rating your peer exchange. Your review has been added to {exchange.partner?.name}'s EduNova profile.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Star Rating Bar */}
          <div style={{ textAlign: 'center' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
              How was your exchange experience?
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <Star
                    size={28}
                    fill={(hoverRating || rating) >= star ? '#fbbf24' : 'none'}
                    color={(hoverRating || rating) >= star ? '#fbbf24' : 'var(--text-muted)'}
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, marginTop: '4px' }}>
              {rating} Out of 5 Stars
            </div>
          </div>

          {/* Optional Review Text */}
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              Written Feedback / Review (Optional):
            </label>
            <textarea
              rows={3}
              placeholder={`Share your experience learning ${exchange.partnerTeachSkill} with ${exchange.partner?.name}...`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <Button type="submit" size="lg">
            <Award size={16} /> Submit Rating & Complete Exchange
          </Button>
        </form>
      )}
    </Modal>
  );
};

export default ReviewModal;
