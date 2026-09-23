import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Award,
  CheckCircle,
  Play,
  RotateCcw,
  BookOpen,
  FileText,
  Video,
  Layers,
  HelpCircle,
  Calendar,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SkillDetailsDrawer = ({
  skill,
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  onAskSage,
  onStartPractice,
  onAddToPlanner
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!isOpen || !skill) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'evidence', label: `Evidence (${skill.evidenceCount || 0})` },
    { id: 'practice', label: 'Practice' },
    { id: 'resources', label: 'Resources' },
    { id: 'path', label: 'Path' },
    { id: 'advice', label: 'AI Advice' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: isLight ? 'rgba(15, 23, 42, 0.35)' : 'rgba(5, 8, 20, 0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justify: 'flex-end'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          background: isLight ? 'linear-gradient(180deg, #ffffff 0%, #f5f9ff 100%)' : '#080c1e',
          borderLeft: isLight ? '1.5px solid rgba(200, 218, 240, 0.9)' : '1.5px solid rgba(6, 182, 212, 0.4)',
          boxShadow: isLight ? '-12px 0 50px rgba(180, 200, 230, 0.5)' : '-12px 0 50px rgba(0,0,0,0.85)',
          display: 'flex',
          flexDirection: 'column',
          color: isLight ? '#0f172a' : '#fff',
          overflow: 'hidden'
        }}
      >
        {/* Top Drawer Title Header */}
        <div style={{ padding: '16px 20px', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)', background: isLight ? '#f8fafc' : '#050814', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`cyber-badge-${skill.status === 'MASTERED' ? 'emerald' : (skill.status === 'ACTIVE' ? 'cyan' : 'amber')}`}>
                {skill.status}
              </span>
              <span style={{ fontSize: '0.75rem', color: isLight ? '#52668a' : '#94a3b8' }}>Category: <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>{skill.category}</strong></span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff', margin: '4px 0 0 0' }}>
              {skill.name}
            </h2>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#64748b' : '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Drawer Tabs Bar */}
        <div style={{ display: 'flex', background: isLight ? 'rgba(241, 245, 249, 0.9)' : 'rgba(12, 16, 36, 0.9)', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)', padding: '6px 12px', gap: '4px', overflowX: 'auto' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === t.id ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'transparent',
                color: activeTab === t.id ? '#fff' : (isLight ? '#52668a' : '#94a3b8'),
                whiteSpace: 'nowrap'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Mastery Score Gauge */}
              <div style={{ padding: '16px', borderRadius: '18px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814', border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: isLight ? '0 4px 12px rgba(180, 200, 230, 0.2)' : 'none' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: isLight ? '#52668a' : '#94a3b8', display: 'block' }}>Mastery Score</span>
                  <h3 style={{ fontSize: '2rem', fontWeight: 900, color: isLight ? '#0284c7' : '#38bdf8', margin: 0 }}>{skill.masteryScore}%</h3>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>{skill.trend}</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.78rem', color: isLight ? '#334155' : '#cbd5e1' }}>
                  <div>Confidence: <strong style={{ color: '#d97706' }}>{skill.confidence}</strong></div>
                  <div>Evidence: <strong>{skill.evidenceCount} activities</strong></div>
                  <div>Last Practiced: <strong>{skill.lastPracticedAt}</strong></div>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.88rem', color: isLight ? '#334155' : '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                {skill.description}
              </p>

              {/* WHY THIS SCORE */}
              <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(240, 249, 255, 0.9)' : 'rgba(12, 16, 36, 0.8)', border: isLight ? '1px solid rgba(6, 182, 212, 0.25)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0284c7' : '#06b6d4', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Why This Score? (Evidence Breakdown)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem', color: isLight ? '#334155' : '#cbd5e1' }}>
                  <div>Quiz accuracy: <strong style={{ color: '#10b981' }}>84%</strong></div>
                  <div>Advanced Qs: <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>71%</strong></div>
                  <div>Consistency: <strong style={{ color: '#a855f7' }}>89%</strong></div>
                  <div>Wrong-answer recovery: <strong style={{ color: '#d97706' }}>76%</strong></div>
                </div>
              </div>

              {/* WHY THIS SKILL MATTERS */}
              <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(238, 242, 255, 0.95)' : 'rgba(99, 102, 241, 0.12)', border: isLight ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#4f46e5' : '#818cf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Why This Skill Matters
                </h4>
                <p style={{ fontSize: '0.82rem', color: isLight ? '#1e1b4b' : '#e2e8f0', margin: 0, lineHeight: 1.45, fontWeight: isLight ? 600 : 400 }}>
                  <strong>{skill.name}</strong> is a key topic in your <strong>{skill.category}</strong> learning track. Mastering this node unlocks advanced concepts, increases target examination readiness, and improves overall domain mastery.
                </p>
              </div>
            </>
          )}

          {/* TAB 2: EVIDENCE */}
          {activeTab === 'evidence' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8', textTransform: 'uppercase', margin: 0 }}>
                Learning Evidence Log ({skill.evidence?.length || 0} Records)
              </h4>
              {skill.evidence && skill.evidence.length > 0 ? (
                skill.evidence.map((ev, i) => (
                  <div key={i} style={{ padding: '12px', borderRadius: '14px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814', border: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', display: 'block' }}>{ev.title}</span>
                      <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>Type: {ev.type} • {ev.date}</span>
                    </div>
                    <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.78rem', fontWeight: 800 }}>
                      {ev.score}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: isLight ? '#64748b' : '#94a3b8' }}>
                  <FileText size={32} color="#64748b" style={{ margin: '0 auto 8px auto' }} />
                  <p style={{ fontSize: '0.85rem' }}>No evidence records registered yet for this skill.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRACTICE */}
          {activeTab === 'practice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '16px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814', border: '1px solid rgba(6, 182, 212, 0.35)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: '0 0 6px 0' }}>3-Question Diagnostic Assessment</h4>
                <p style={{ fontSize: '0.8rem', color: isLight ? '#52668a' : '#94a3b8', margin: '0 0 12px 0' }}>Test your understanding of {skill.name} and improve your mastery score.</p>
                <button onClick={() => onStartPractice(skill)} className="se-btn se-btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                  <Play size={14} /> Start Diagnostic Assessment
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: RESOURCES */}
          {activeTab === 'resources' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '14px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814', border: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} color={isLight ? '#0284c7' : '#38bdf8'} />
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', display: 'block' }}>{skill.name} Summary Notes</span>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>Concise cheat sheet & study guide</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PATH */}
          {activeTab === 'path' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#4f46e5' : '#818cf8', textTransform: 'uppercase', margin: 0 }}>Prerequisite Chain</h4>
              <div style={{ padding: '12px', borderRadius: '14px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814', border: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255,255,255,0.1)', fontSize: '0.82rem', color: isLight ? '#334155' : '#cbd5e1' }}>
                {skill.prerequisites && skill.prerequisites.length > 0 ? (
                  skill.prerequisites.map((p, idx) => (
                    <div key={idx} style={{ margin: '4px 0', color: '#10b981', fontWeight: 700 }}>
                      ✓ Prerequisite Requirement: {p} (100% Completed)
                    </div>
                  ))
                ) : (
                  <div style={{ color: isLight ? '#64748b' : '#94a3b8', fontStyle: 'italic', marginBottom: '6px' }}>
                    No prerequisite dependencies required for this node.
                  </div>
                )}
                <div style={{ color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800, marginTop: '6px' }}>➔ {skill.name} ({skill.masteryScore}% Current Mastery)</div>
              </div>
            </div>
          )}

          {/* TAB 6: AI ADVICE */}
          {activeTab === 'advice' && (
            <div style={{ padding: '16px', borderRadius: '18px', background: isLight ? 'rgba(224, 242, 254, 0.9)' : 'rgba(6, 182, 212, 0.12)', border: isLight ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid rgba(6, 182, 212, 0.3)' }}>
              <strong style={{ color: isLight ? '#0284c7' : '#38bdf8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> Sage AI Advice for {skill.name}:
              </strong>
              <p style={{ fontSize: '0.85rem', color: isLight ? '#0f172a' : '#e2e8f0', margin: '8px 0 14px 0', lineHeight: 1.45, fontWeight: isLight ? 600 : 400 }}>
                "Your current mastery of <strong>{skill.name}</strong> is <strong>{skill.masteryScore}%</strong> ({skill.confidence || 'Medium'} Confidence). Completing a quick 10-minute diagnostic session in {skill.category} will help boost your score."
              </p>
              <button onClick={() => onAskSage(skill)} style={{ padding: '8px 14px', borderRadius: '10px', background: '#06b6d4', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
                Ask Sage AI Question
              </button>
            </div>
          )}
        </div>

        {/* Drawer Action Footer Buttons */}
        <div style={{ padding: '16px', borderTop: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)', background: isLight ? '#f8fafc' : '#050814', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button onClick={() => onStartPractice(skill)} className="se-btn se-btn-primary" style={{ flex: 1, padding: '10px', fontSize: '0.8rem', justifyContent: 'center' }}>
            <Play size={14} /> Practice Skill
          </button>
          <button onClick={() => onAddToPlanner(skill)} className="se-btn se-btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.8rem', justifyContent: 'center' }}>
            <Calendar size={14} /> Add to Study Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillDetailsDrawer;
