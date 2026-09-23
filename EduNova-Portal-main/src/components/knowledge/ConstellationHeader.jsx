import React from 'react';
import { EduNovaHeroBanner } from '../common/EduNovaHeroBanner';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Network,
  Search,
  Filter,
  Command,
  PlusCircle,
  Layers,
  MapPin,
  Compass,
  Cpu
} from 'lucide-react';

export const ConstellationHeader = ({
  viewMode,
  onViewModeChange,
  educationContext,
  onEducationContextChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onOpenCommandPalette,
  onOpenSageChat,
  onOpenAddModal
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const contextLabels = [
    { id: 'school', label: '🏫 School Dashboard (K-12)', icon: '🏫' },
    { id: 'college', label: '🎓 College Dashboard (B.Tech CS)', icon: '🎓' },
    { id: 'exam', label: '📝 Exam Prep Dashboard (GATE / CAT)', icon: '📝' },
    { id: 'skills', label: '💻 Industry Skills (Full-Stack)', icon: '💻' }
  ];

  const viewModes = [
    { id: 'constellation', label: '🌌 Constellation' },
    { id: 'path', label: '🛣️ Learning Path' },
    { id: 'tree', label: '🌲 Skill Tree' },
    { id: 'dependency', label: '🔗 Dependency Graph' },
    { id: 'career', label: '🎯 Career Map' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Title WITH 3D GLASS ORB */}
      <EduNovaHeroBanner
        badge="✦ Knowledge Constellation 2.0"
        title="Knowledge Constellation"
        subtitle="Your learning universe — explore mastered skills, active abilities, prerequisites and your next path to mastery."
        stats={[
          { label: '34 Skills', subtext: 'Discovered', icon: Network, color: '#38bdf8', iconBg: 'rgba(56, 189, 248, 0.25)' },
          { label: 'Level 4', subtext: 'Mastery Rank', icon: Sparkles, color: '#c084fc', iconBg: 'rgba(192, 132, 252, 0.25)' },
          { label: '3', subtext: 'Learning Goals', isPill: true }
        ]}
      />

      {/* Global Action Triggers */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginTop: '-8px' }}>
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            style={{
              padding: '9px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)'
            }}
          >
            <PlusCircle size={15} /> Add Skill Node
          </button>
        )}

        <button
          onClick={onOpenCommandPalette}
          style={{
            padding: '8px 14px',
            borderRadius: '12px',
            background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(12, 16, 36, 0.9)',
            border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(6, 182, 212, 0.35)',
            color: isLight ? '#0284c7' : '#38bdf8',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Command size={14} /> Quick Search <span style={{ padding: '2px 6px', borderRadius: '6px', background: isLight ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.1)', fontSize: '0.68rem', color: isLight ? '#0284c7' : '#fff' }}>Ctrl+K</span>
        </button>

        <button
          onClick={onOpenSageChat}
          className="se-btn se-btn-primary"
          style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}
        >
          <Sparkles size={15} /> Ask Sage AI
        </button>
      </div>

      {/* Control Filter Bar: View Modes, Context Selector & Search */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '14px',
        padding: '12px 18px',
        borderRadius: '20px',
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'rgba(12, 16, 36, 0.85)',
        border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : 'none',
        backdropFilter: 'blur(16px)'
      }}>
        {/* Education Badge Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#52668a' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Dashboard Profile:</span>
          <select
            value={educationContext}
            onChange={(e) => onEducationContextChange(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '10px', background: isLight ? 'rgba(255, 255, 255, 0.9)' : '#050814', border: '1px solid #06b6d4', color: isLight ? '#0284c7' : '#38bdf8', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', outline: 'none' }}
          >
            {contextLabels.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          {viewModes.map(vm => (
            <button
              key={vm.id}
              onClick={() => onViewModeChange(vm.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: viewMode === vm.id ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : (isLight ? 'rgba(240, 246, 255, 0.8)' : 'rgba(255, 255, 255, 0.08)'),
                color: viewMode === vm.id ? '#fff' : (isLight ? '#52668a' : '#94a3b8'),
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {vm.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={14} color={isLight ? '#0284c7' : '#94a3b8'} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search skills, topics..."
            style={{ width: '100%', padding: '7px 10px 7px 32px', borderRadius: '10px', background: isLight ? 'rgba(255, 255, 255, 0.9)' : '#050814', border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255,255,255,0.14)', color: isLight ? '#18345F' : '#fff', fontSize: '0.8rem', outline: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConstellationHeader;
