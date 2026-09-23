import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Play, Sparkles, Box, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getEducationContext } from '../../services/educationContextService';
import { getFilteredLabs, getSubjectTheme } from '../../services/labService';
import { getLabProgress } from '../../services/labProgressService';

export const ImmersiveLabWidget = ({ educationType }) => {
  const navigate = useNavigate();
  const context = getEducationContext();

  if (educationType) {
    context.educationType = educationType;
  }

  const labs = getFilteredLabs(context);
  const progress = getLabProgress();
  const completedLabs = progress.completedLabs || [];

  const topLabs = labs.slice(0, 2);

  return (
    <div
      style={{
        padding: '24px',
        borderRadius: '20px',
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.2)',
              color: '#38bdf8'
            }}
          >
            <FlaskConical size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff', fontWeight: 700 }}>
              Immersive Learning Lab
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Mode: {context.educationType?.toUpperCase()}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/labs')}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            fontWeight: 600,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          Explore All <ArrowRight size={14} />
        </button>
      </div>

      {/* Recommended Lab Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        {topLabs.map((lab) => {
          const theme = getSubjectTheme(lab.subject);
          const isDone = completedLabs.includes(lab.id);
          return (
            <div
              key={lab.id}
              onClick={() => navigate('/labs')}
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: `1px solid ${theme.primary}30`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: theme.primary,
                    textTransform: 'uppercase'
                  }}
                >
                  {lab.subject}
                </span>
                <h4 style={{ margin: '4px 0 2px 0', fontSize: '0.94rem', color: '#ffffff', fontWeight: 700 }}>
                  {lab.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.3 }}>
                  {lab.subtitle}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{lab.duration}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isDone ? <CheckCircle2 size={14} color="#34d399" /> : <Play size={12} fill="#38bdf8" />} Launch
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImmersiveLabWidget;
