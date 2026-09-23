import React from 'react';
import { EduNovaHeroBanner } from '../common/EduNovaHeroBanner';
import { Dna, Zap, ShieldCheck, Play, Route, Activity, Sparkles } from 'lucide-react';

export const SkillDNAHero = ({ skillDNA, onTakeAssessment, onGenerateRoadmap }) => {
  const index = skillDNA?.overallIndex || 74;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
      {/* 1. HERO HEADER WITH 3D GLASS ORB */}
      <EduNovaHeroBanner
        badge="✦ Live AI Learning Profile"
        title="AI Skill DNA Profile"
        subtitle="Your evolving learning intelligence profile — built from what you actually learn, practice, create, and achieve."
        stats={[
          { label: `${index}%`, subtext: 'Progress Index', icon: Activity, color: '#38bdf8', iconBg: 'rgba(56, 189, 248, 0.25)' },
          { label: 'Level 4', subtext: 'XP Rank', icon: Sparkles, color: '#c084fc', iconBg: 'rgba(192, 132, 252, 0.25)' },
          { label: '3', subtext: 'Learning Goals', isPill: true }
        ]}
      />

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap', marginTop: '-8px' }}>
        <button
          onClick={onTakeAssessment}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(6, 182, 212, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          <Play size={16} /> Take Skill Assessment
        </button>

        <button
          onClick={onGenerateRoadmap}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Route size={16} color="#a855f7" /> Generate AI Roadmap
        </button>
      </div>
    </div>
  );
};
