import React, { useState } from 'react';
import {
  CheckCircle,
  Star,
  Clock,
  Globe,
  Repeat,
  Sparkles,
  Heart,
  Send,
  Eye,
  GraduationCap
} from 'lucide-react';
import { WhyMatchModal } from './WhyMatchModal';

export const SkillExchangeCard = ({
  candidate,
  isSaved,
  onSaveToggle,
  onRequestExchange,
  onViewProfile
}) => {
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);

  if (!candidate) return null;

  const teachList = candidate.skillsToTeach || [];
  const learnList = candidate.skillsToLearn || [];

  return (
    <>
      <div className="se-match-card">
        <div>
          {/* Top Info */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="se-card-avatar"
                />
                {candidate.verified && (
                  <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#06b6d4', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                    <CheckCircle size={12} color="#050814" strokeWidth={3} />
                  </div>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 className="se-card-name">{candidate.name}</h3>
                  {candidate.isMentor && (
                    <span className="se-tag-purple" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                      🎓 Mentor
                    </span>
                  )}
                </div>
                <p className="se-card-title">{candidate.education || candidate.title}</p>
              </div>
            </div>

            {/* Match Score */}
            <button
              onClick={() => setIsWhyModalOpen(true)}
              className="se-match-score-badge"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} color="#38bdf8" />
                <span>{candidate.matchScore}% Match</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 400 }}>Why match?</span>
            </button>
          </div>

          {/* Reciprocal Swap Highlight */}
          {candidate.isReciprocalSwap && (
            <div style={{ padding: '8px 12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.78rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Repeat size={14} color="#34d399" />
              <span><strong>Skill Swap:</strong> Perfect 2-way match!</span>
            </div>
          )}

          {/* Bio */}
          <p className="se-card-bio">
            "{candidate.bio}"
          </p>

          {/* Skills Teaches / Wants */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Teaches:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {teachList.map((st, i) => (
                  <span key={i} className="se-tag-cyan">
                    {typeof st === 'string' ? st : st.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Wants to Learn:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {learnList.map((sl, i) => (
                  <span key={i} className="se-tag-purple">
                    {typeof sl === 'string' ? sl : sl.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="se-card-meta-grid">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#38bdf8" />
              <span>{candidate.availability}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} color="#c084fc" />
              <span>{(candidate.languages || ['English']).join(', ')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} color="#fbbf24" />
              <span>{candidate.rating || 4.9} ({candidate.completedExchanges || 5} exchanges)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={14} color="#34d399" />
              <span>{candidate.experience}</span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            onClick={() => onSaveToggle(candidate.id)}
            className="se-btn se-btn-secondary"
            style={{ padding: '8px 12px' }}
          >
            <Heart size={16} color={isSaved ? '#f43f5e' : '#94a3b8'} fill={isSaved ? '#f43f5e' : 'none'} />
          </button>

          <button
            onClick={() => onViewProfile(candidate)}
            className="se-btn se-btn-secondary"
            style={{ padding: '8px 12px' }}
            title="View Profile"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={() => onRequestExchange(candidate)}
            className="se-btn se-btn-primary"
            style={{ flex: 1, padding: '10px 14px' }}
          >
            <Send size={14} />
            Request Exchange
          </button>
        </div>
      </div>

      <WhyMatchModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        candidate={candidate}
      />
    </>
  );
};
