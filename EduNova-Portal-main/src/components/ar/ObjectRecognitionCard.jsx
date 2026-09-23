import React, { useState } from 'react';
import { Award, Sparkles, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import { AIVisionReportModal } from './AIVisionReportModal';

export const ObjectRecognitionCard = ({
  objectData,
  onExplore,
  onAskSage,
  xpEarned = 25
}) => {
  const [showReportModal, setShowReportModal] = useState(false);

  if (!objectData) return null;

  const confidencePercent = Math.round((objectData.confidence || 0.96) * 100);

  return (
    <>
      <div style={{
        background: 'rgba(12, 16, 36, 0.92)',
        backdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        padding: '20px 24px',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Glow Ambient Accent Corner */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(6, 182, 212, 0.25)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        {/* Top Metadata Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Category & Confidence Badge Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(6, 182, 212, 0.18)',
                border: '1px solid rgba(6, 182, 212, 0.45)',
                color: '#38bdf8',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                {objectData.category}
              </span>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: '#34d399',
                fontSize: '0.82rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={14} color="#34d399" /> {confidencePercent}% Confidence
              </span>
            </div>

            {/* Object Name */}
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px', margin: 0 }}>
              {objectData.name}
            </h3>
          </div>

          {/* XP Reward Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.18)',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            color: '#fbbf24',
            fontSize: '0.82rem',
            fontWeight: 700
          }}>
            <Award size={16} color="#fbbf24" /> +{xpEarned} XP
          </div>
        </div>

        {/* Description Text */}
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '16px' }}>
          {objectData.description}
        </p>

        {/* Educational Topics Badges List */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            Educational Topics Covered:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {objectData.topics && objectData.topics.map(topic => (
              <span
                key={topic}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                #{topic}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Quick Action Buttons Row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button size="sm" onClick={onExplore}>
            Explore 3D Hotspots <ArrowRight size={14} />
          </Button>

          {/* AI Inspection Report Button */}
          <button
            onClick={() => setShowReportModal(true)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.82rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
            }}
          >
            <FileText size={14} /> AI Vision Report
          </button>

          <Button size="sm" variant="outline" onClick={() => onAskSage && onAskSage(`Explain the full structure of ${objectData.name}.`)}>
            <Sparkles size={14} /> Ask Sage AI
          </Button>
        </div>
      </div>

      {/* AI Vision Inspection Report Modal */}
      <AIVisionReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        objectData={objectData}
        onAskSage={onAskSage}
      />
    </>
  );
};

export default ObjectRecognitionCard;
