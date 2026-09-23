import React from 'react';
import { EduNovaHeroBanner } from '../common/EduNovaHeroBanner';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Calendar,
  Filter,
  Download,
  Share2,
  Lock,
  RefreshCw,
  CheckCircle,
  GraduationCap,
  BookOpen,
  Target,
  Briefcase,
  TrendingUp
} from 'lucide-react';

export const AnalyticsHeader = ({
  timeRange,
  onTimeRangeChange,
  educationContext,
  onEducationContextChange,
  lastUpdated,
  onExport,
  onOpenPrivacy,
  onOpenChat,
  onRefresh
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const contextLabels = [
    { id: 'school', label: 'School (Class 10 CBSE)', icon: '🏫' },
    { id: 'college', label: 'College (B.Tech CS Sem 5)', icon: '🎓' },
    { id: 'exam', label: 'Exam Prep (CMAT / Boards)', icon: '📝' },
    { id: 'skills', label: 'Skills & Career Path', icon: '💻' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '8px' }}>
      {/* Top Header Title WITH 3D GLASS ORB */}
      <EduNovaHeroBanner
        badge="✦ EduNova Intelligence Platform"
        title="Learning Intelligence Center"
        subtitle="Understand your learning patterns, discover weak areas, measure real progress, and let Sage AI help you improve."
        stats={[
          { label: '84% Score', subtext: 'Learning Health', icon: TrendingUp, color: '#38bdf8', iconBg: 'rgba(56, 189, 248, 0.25)' },
          { label: 'Level 4', subtext: 'XP Rank', icon: Sparkles, color: '#c084fc', iconBg: 'rgba(192, 132, 252, 0.25)' },
          { label: '3', subtext: 'Learning Goals', isPill: true }
        ]}
      />

      {/* Global Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginTop: '-8px' }}>
        <button
          onClick={onOpenChat}
          className="se-btn se-btn-primary"
          style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}
        >
          <Sparkles size={16} /> Ask Sage About My Progress
        </button>

        <button
          onClick={onExport}
          className="se-btn se-btn-secondary"
          style={{ padding: '10px 14px', fontSize: '0.85rem', background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.16)' }}
        >
          <Download size={15} /> Export Report
        </button>

        <button
          onClick={onOpenPrivacy}
          className="se-btn-icon"
          style={{ padding: '10px', background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.16)', color: isLight ? '#475569' : '#94a3b8', cursor: 'pointer' }}
          title="Analytics Privacy Controls"
        >
          <Lock size={16} />
        </button>
      </div>

      {/* Control Filter Bar: Education Selector & Time Range Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', padding: '12px 18px', borderRadius: '18px', background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)', border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(16px)', boxShadow: isLight ? '0 8px 25px rgba(37, 99, 235, 0.06)' : 'none' }}>
        {/* Education Context Select Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#475569' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color={isLight ? '#0284c7' : '#06b6d4'} /> Context:
          </span>
          <select
            value={educationContext}
            onChange={(e) => onEducationContextChange(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814',
              border: isLight ? '1px solid rgba(186, 230, 253, 0.8)' : '1px solid rgba(6, 182, 212, 0.4)',
              color: isLight ? '#0284c7' : '#38bdf8',
              fontSize: '0.82rem',
              fontWeight: 800,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {contextLabels.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>

        {/* Date Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
          {[
            { id: '7d', label: 'This Week' },
            { id: '30d', label: 'This Month' },
            { id: '90d', label: 'This Semester' },
            { id: 'custom', label: 'Custom Range' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => onTimeRangeChange(t.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: timeRange === t.id ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : isLight ? 'rgba(235, 244, 255, 0.8)' : 'rgba(255, 255, 255, 0.08)',
                color: timeRange === t.id ? '#fff' : isLight ? '#475569' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Data Source Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: isLight ? '#64748b' : '#64748b' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          <span>Updated {lastUpdated || 'just now'} • Based on 46 sessions</span>
          <button onClick={onRefresh} style={{ background: 'none', border: 'none', color: isLight ? '#64748b' : '#94a3b8', cursor: 'pointer', padding: '2px' }} title="Refresh analytics">
            <RefreshCw size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
