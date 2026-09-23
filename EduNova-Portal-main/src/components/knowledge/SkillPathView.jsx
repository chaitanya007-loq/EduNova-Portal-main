import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  GitBranch,
  Layers,
  Link2,
  ShieldAlert,
  PlayCircle,
  ChevronDown,
  ChevronRight,
  Award,
  TrendingUp,
  Compass,
  AlertCircle,
  PlusCircle,
  Zap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SkillPathView = ({ nodes = [], onSelectSkill, viewMode = 'path' }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const masteredCount = nodes.filter(n => n.status === 'MASTERED' || n.masteryScore >= 80).length;
  const activeCount = nodes.filter(n => n.status === 'ACTIVE' || n.status === 'STRONG').length;
  const lockedCount = nodes.filter(n => n.status === 'LOCKED').length;
  const totalMastery = nodes.reduce((acc, n) => acc + (n.masteryScore || 0), 0);
  const pathCompletionPct = nodes.length > 0 ? Math.round(totalMastery / nodes.length) : 0;

  // Render View 1: 🛣️ Step-by-Step Learning Path Roadmap
  if (viewMode === 'path') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Roadmap Summary Card */}
        <div style={{
          padding: '20px 24px',
          borderRadius: '24px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 246, 255, 0.92) 100%)'
            : 'linear-gradient(135deg, rgba(12, 16, 36, 0.95), rgba(20, 24, 56, 0.85))',
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : '0 10px 30px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.2rem' }}>🛣️</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                Step-by-Step Sequential Learning Roadmap
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: isLight ? '#52668a' : '#94a3b8', margin: 0, fontWeight: isLight ? 600 : 400 }}>
              Master prerequisite foundations before unlocking advanced specializations.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: isLight ? '#52668a' : '#94a3b8', fontWeight: 800 }}>PATH COMPLETION</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isLight ? '#0284c7' : '#38bdf8' }}>{pathCompletionPct}%</div>
            </div>

            <div style={{ width: '120px', height: '10px', background: isLight ? 'rgba(200, 218, 240, 0.8)' : 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${pathCompletionPct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>

        {nodes.length === 0 ? (
          <div style={{
            padding: '40px 24px',
            textAlign: 'center',
            borderRadius: '20px',
            background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(12, 16, 36, 0.85)',
            border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.3)' : 'none',
            color: isLight ? '#52668a' : '#94a3b8'
          }}>
            <Sparkles size={36} color="#06b6d4" style={{ marginBottom: '10px' }} />
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>
              0 Nodes in Sequential Path
            </h4>
            <p style={{ fontSize: '0.84rem', margin: '6px 0 0 0' }}>
              Add your first skill node or switch dashboard profile at top left to populate your roadmap.
            </p>
          </div>
        ) : (
          /* Vertical Timeline Steps */
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '20px' }}>
            {/* Vertical Connecting Line */}
            <div style={{
              position: 'absolute',
              left: '37px',
              top: '30px',
              bottom: '30px',
              width: '4px',
              background: isLight
                ? 'linear-gradient(180deg, #10b981 0%, #0284c7 50%, rgba(200,218,240,0.8) 100%)'
                : 'linear-gradient(180deg, #10b981 0%, #6366f1 50%, rgba(255,255,255,0.1) 100%)',
              borderRadius: '2px',
              zIndex: 0
            }} />

            {nodes.map((s, idx) => {
              const isMastered = s.status === 'MASTERED' || s.masteryScore >= 80;
              const isActive = s.status === 'ACTIVE' || s.status === 'STRONG';
              const isNeedsReview = s.status === 'NEEDS_REVIEW';
              const isLocked = s.status === 'LOCKED';

              return (
                <div
                  key={s.id}
                  onClick={() => onSelectSkill(s.id)}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '20px 24px',
                    borderRadius: '20px',
                    background: isLight
                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(245, 249, 255, 0.92) 100%)'
                      : 'rgba(12, 16, 36, 0.9)',
                    border: isMastered
                      ? (isLight ? '1.5px solid #10b981' : '1.5px solid rgba(16, 185, 129, 0.6)')
                      : isActive
                      ? (isLight ? '1.5px solid #0284c7' : '1.5px solid rgba(99, 102, 241, 0.6)')
                      : isNeedsReview
                      ? (isLight ? '1.5px solid #d97706' : '1.5px solid rgba(245, 158, 11, 0.6)')
                      : (isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.1)'),
                    boxShadow: isLight ? '0 12px 32px rgba(180, 200, 230, 0.35)' : '0 8px 24px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(16px)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    transition: 'all 0.2s ease',
                    transform: hoveredNodeId === s.id ? 'translateX(6px)' : 'none'
                  }}
                  onMouseEnter={() => setHoveredNodeId(s.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    {/* Step Number Circle */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isMastered
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : isActive
                        ? 'linear-gradient(135deg, #0284c7, #2563eb)'
                        : isNeedsReview
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : (isLight ? 'rgba(200, 218, 240, 0.8)' : 'rgba(255,255,255,0.08)'),
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      boxShadow: isMastered || isActive ? '0 0 16px rgba(2,132,199,0.3)' : 'none',
                      flexShrink: 0
                    }}>
                      {isMastered ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={18} /> : idx + 1}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                          {s.name}
                        </h4>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          background: isMastered
                            ? (isLight ? 'rgba(209, 250, 229, 0.9)' : 'rgba(16, 185, 129, 0.15)')
                            : isActive
                            ? (isLight ? 'rgba(224, 242, 254, 0.9)' : 'rgba(99, 102, 241, 0.15)')
                            : (isLight ? 'rgba(240, 246, 255, 0.8)' : 'rgba(255,255,255,0.08)'),
                          color: isMastered
                            ? (isLight ? '#047857' : '#34d399')
                            : isActive
                            ? (isLight ? '#0284c7' : '#818cf8')
                            : (isLight ? '#52668a' : '#94a3b8')
                        }}>
                          {s.category}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.8rem', color: isLight ? '#334155' : '#94a3b8', margin: '4px 0 0 0', maxWidth: '650px', lineHeight: 1.4, fontWeight: isLight ? 500 : 400 }}>
                        {s.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', marginTop: '10px', fontSize: '0.75rem', color: isLight ? '#475569' : '#cbd5e1', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} color="#06b6d4" /> Est: {s.estimatedTimeToMaster || '6h'}
                        </span>
                        <span>•</span>
                        <span>Difficulty: <strong style={{ color: isLight ? '#0f172a' : '#fff' }}>{s.difficulty || 'Intermediate'}</strong></span>
                        {s.nextRecommendedAction && (
                          <>
                            <span>•</span>
                            <span style={{ color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800 }}>
                              👉 {s.nextRecommendedAction}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score & Action Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: isMastered ? (isLight ? '#047857' : '#34d399') : isActive ? (isLight ? '#0284c7' : '#38bdf8') : (isLight ? '#64748b' : '#64748b') }}>
                        {isLocked ? 'LOCKED' : `${s.masteryScore}%`}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: isLight ? '#52668a' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                        {s.status || 'UNLOCKED'}
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectSkill(s.id); }}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '12px',
                        background: isMastered
                          ? (isLight ? 'rgba(209, 250, 229, 0.9)' : 'rgba(16, 185, 129, 0.15)')
                          : 'linear-gradient(135deg, #0284c7, #2563eb)',
                        border: 'none',
                        color: isMastered ? (isLight ? '#047857' : '#fff') : '#fff',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      View Node <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Render View 2: 🌲 Hierarchical Skill Tree View
  if (viewMode === 'tree') {
    // Group nodes by category
    const categoriesMap = {};
    nodes.forEach(n => {
      const cat = n.category || 'Core';
      if (!categoriesMap[cat]) categoriesMap[cat] = [];
      categoriesMap[cat].push(n);
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Tree Summary Header */}
        <div style={{
          padding: '20px 24px',
          borderRadius: '24px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(245, 240, 255, 0.92) 100%)'
            : 'linear-gradient(135deg, rgba(12, 16, 36, 0.95), rgba(30, 27, 75, 0.85))',
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(168, 85, 247, 0.3)',
          boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : '0 10px 30px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.2rem' }}>🌲</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                Hierarchical Skill Tree & Category Branches
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: isLight ? '#52668a' : '#94a3b8', margin: 0, fontWeight: isLight ? 600 : 400 }}>
              Structured domain tree branches sorted from foundational roots to advanced leaf skills.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ padding: '6px 14px', borderRadius: '12px', background: isLight ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.08)', color: isLight ? '#7c3aed' : '#c084fc', fontSize: '0.8rem', fontWeight: 800 }}>
              {Object.keys(categoriesMap).length} Tree Branches
            </span>
          </div>
        </div>

        {/* Category Tree Branches */}
        {Object.entries(categoriesMap).map(([category, catNodes]) => {
          const isCollapsed = expandedCategories[category];
          const catMastered = catNodes.filter(n => n.status === 'MASTERED' || n.masteryScore >= 80).length;
          const catAvg = Math.round(catNodes.reduce((acc, n) => acc + (n.masteryScore || 0), 0) / catNodes.length);

          return (
            <div
              key={category}
              style={{
                borderRadius: '20px',
                background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(245, 249, 255, 0.92))' : 'rgba(12, 16, 36, 0.85)',
                border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
                overflow: 'hidden',
                boxShadow: isLight ? '0 12px 32px rgba(180, 200, 230, 0.3)' : 'none',
                backdropFilter: 'blur(16px)'
              }}
            >
              {/* Category Branch Header */}
              <div
                onClick={() => toggleCategory(category)}
                style={{
                  padding: '16px 22px',
                  background: isLight ? 'rgba(240, 246, 255, 0.9)' : 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  cursor: 'pointer',
                  borderBottom: isCollapsed ? 'none' : (isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.08)')
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isCollapsed ? <ChevronRight size={18} color={isLight ? '#52668a' : '#94a3b8'} /> : <ChevronDown size={18} color={isLight ? '#52668a' : '#94a3b8'} />}
                  <GitBranch size={18} color={isLight ? '#7c3aed' : '#a855f7'} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                    {category} Branch
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: isLight ? '#52668a' : '#94a3b8', fontWeight: isLight ? 600 : 400 }}>
                    ({catNodes.length} skills • {catMastered} Mastered)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: isLight ? '#7c3aed' : '#a855f7' }}>{catAvg}% Avg</div>
                  </div>
                  <div style={{ width: '80px', height: '6px', background: isLight ? 'rgba(200, 218, 240, 0.8)' : 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${catAvg}%`, height: '100%', background: '#a855f7', borderRadius: '9999px' }} />
                  </div>
                </div>
              </div>

              {/* Sub-Tree Nodes */}
              {!isCollapsed && (
                <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                  {catNodes.map((s) => {
                    const isMastered = s.status === 'MASTERED' || s.masteryScore >= 80;
                    const isActive = s.status === 'ACTIVE' || s.status === 'STRONG';

                    return (
                      <div
                        key={s.id}
                        onClick={() => onSelectSkill(s.id)}
                        style={{
                          padding: '16px',
                          borderRadius: '16px',
                          background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814',
                          border: isMastered ? '1.5px solid #10b981' : (isActive ? '1.5px solid #0284c7' : (isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255,255,255,0.1)')),
                          boxShadow: isLight ? '0 4px 12px rgba(180, 200, 230, 0.25)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h5 style={{ fontSize: '0.98rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                              {s.name}
                            </h5>
                            <span style={{ fontSize: '0.72rem', color: isLight ? '#52668a' : '#94a3b8' }}>
                              Difficulty: {s.difficulty}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.95rem', fontWeight: 900, color: isMastered ? '#059669' : (isActive ? '#0284c7' : '#64748b') }}>
                            {s.masteryScore}%
                          </span>
                        </div>

                        {/* Mastery Progress */}
                        <div style={{ width: '100%', height: '5px', background: isLight ? 'rgba(200, 218, 240, 0.8)' : 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ width: `${s.masteryScore}%`, height: '100%', background: isMastered ? '#10b981' : '#0284c7' }} />
                        </div>

                        {/* Prerequisites Chips */}
                        {s.prerequisites && s.prerequisites.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                            <Link2 size={12} color={isLight ? '#52668a' : '#94a3b8'} />
                            <span style={{ fontSize: '0.68rem', color: isLight ? '#52668a' : '#94a3b8' }}>Requires:</span>
                            {s.prerequisites.map(pr => (
                              <span key={pr} style={{ padding: '2px 6px', borderRadius: '4px', background: isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(99,102,241,0.15)', color: isLight ? '#0284c7' : '#818cf8', fontSize: '0.65rem', fontWeight: 700 }}>
                                {pr}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Render View 3: 🔗 Prerequisite Dependency Graph Matrix
  if (viewMode === 'dependency') {
    const foundations = nodes.filter(n => (n.prerequisites || []).length === 0 || n.status === 'MASTERED');
    const activeTargets = nodes.filter(n => (n.status === 'ACTIVE' || n.status === 'STRONG' || n.status === 'AVAILABLE') && (n.prerequisites || []).length > 0);
    const lockedNodes = nodes.filter(n => n.status === 'LOCKED' || (n.masteryScore < 30 && (n.prerequisites || []).length > 0));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Dependency Matrix Header */}
        <div style={{
          padding: '20px 24px',
          borderRadius: '24px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 246, 255, 0.92) 100%)'
            : 'linear-gradient(135deg, rgba(12, 16, 36, 0.95), rgba(15, 23, 42, 0.85))',
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : '0 10px 30px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.2rem' }}>🔗</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                Prerequisite Dependency & Unlock Matrix
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: isLight ? '#52668a' : '#94a3b8', margin: 0, fontWeight: isLight ? 600 : 400 }}>
              Clear 3-stage breakdown of foundational prerequisites, active target skills, and locked dependencies.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ padding: '6px 12px', borderRadius: '10px', background: isLight ? 'rgba(209, 250, 229, 0.9)' : 'rgba(16, 185, 129, 0.15)', color: isLight ? '#047857' : '#34d399', fontSize: '0.78rem', fontWeight: 800 }}>
              {foundations.length} Unlocked
            </span>
            <span style={{ padding: '6px 12px', borderRadius: '10px', background: isLight ? 'rgba(224, 242, 254, 0.9)' : 'rgba(99, 102, 241, 0.15)', color: isLight ? '#0284c7' : '#818cf8', fontSize: '0.78rem', fontWeight: 800 }}>
              {activeTargets.length} In-Progress
            </span>
            <span style={{ padding: '6px 12px', borderRadius: '10px', background: isLight ? 'rgba(254, 226, 226, 0.9)' : 'rgba(239, 68, 68, 0.15)', color: isLight ? '#be123c' : '#f87171', fontSize: '0.78rem', fontWeight: 800 }}>
              {lockedNodes.length} Blocked
            </span>
          </div>
        </div>

        {/* 3-Column Kanban Prerequisite Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Column 1: Unlocked Foundations */}
          <div style={{ padding: '20px', borderRadius: '20px', background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 253, 244, 0.9))' : 'rgba(12, 16, 36, 0.85)', border: isLight ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: isLight ? '0 12px 32px rgba(187, 247, 208, 0.35)' : 'none', backdropFilter: 'blur(16px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', borderBottom: isLight ? '1px solid rgba(200, 218, 240, 0.7)' : '1px solid rgba(255,255,255,0.08)' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                1. Unlocked Foundations ({foundations.length})
              </h4>
            </div>

            {foundations.map(s => (
              <div
                key={s.id}
                onClick={() => onSelectSkill(s.id)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814',
                  border: isLight ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                  boxShadow: isLight ? '0 4px 12px rgba(16, 185, 129, 0.1)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h5 style={{ fontSize: '0.92rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>{s.name}</h5>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#52668a' : '#94a3b8' }}>{s.category} • Ready Prerequisite</span>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#10b981' }}>{s.masteryScore}%</span>
              </div>
            ))}
          </div>

          {/* Column 2: Active Targets */}
          <div style={{ padding: '20px', borderRadius: '20px', background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 249, 255, 0.9))' : 'rgba(12, 16, 36, 0.85)', border: isLight ? '1.5px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: isLight ? '0 12px 32px rgba(180, 200, 230, 0.35)' : 'none', backdropFilter: 'blur(16px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', borderBottom: isLight ? '1px solid rgba(200, 218, 240, 0.7)' : '1px solid rgba(255,255,255,0.08)' }}>
              <PlayCircle size={18} color="#06b6d4" />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                2. Active Targets ({activeTargets.length})
              </h4>
            </div>

            {activeTargets.map(s => (
              <div
                key={s.id}
                onClick={() => onSelectSkill(s.id)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814',
                  border: isLight ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(99, 102, 241, 0.5)',
                  boxShadow: isLight ? '0 4px 12px rgba(6, 182, 212, 0.1)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5 style={{ fontSize: '0.92rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>{s.name}</h5>
                  <span style={{ fontSize: '0.9rem', fontWeight: 900, color: isLight ? '#0284c7' : '#38bdf8' }}>{s.masteryScore}%</span>
                </div>
                {s.prerequisites && s.prerequisites.length > 0 && (
                  <div style={{ fontSize: '0.7rem', color: isLight ? '#0284c7' : '#818cf8', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: isLight ? 700 : 400 }}>
                    <Link2 size={12} /> Unlocked by: {s.prerequisites.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Column 3: Locked Dependencies */}
          <div style={{ padding: '20px', borderRadius: '20px', background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 241, 242, 0.9))' : 'rgba(12, 16, 36, 0.85)', border: isLight ? '1.5px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: isLight ? '0 12px 32px rgba(254, 226, 226, 0.35)' : 'none', backdropFilter: 'blur(16px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', borderBottom: isLight ? '1px solid rgba(200, 218, 240, 0.7)' : '1px solid rgba(255,255,255,0.08)' }}>
              <Lock size={18} color="#ef4444" />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>
                3. Locked Blockers ({lockedNodes.length})
              </h4>
            </div>

            {lockedNodes.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: isLight ? '#52668a' : '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>
                🎉 No locked blockers! All skills are currently accessible.
              </div>
            ) : (
              lockedNodes.map(s => (
                <div
                  key={s.id}
                  onClick={() => onSelectSkill(s.id)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    boxShadow: isLight ? '0 4px 12px rgba(239, 68, 68, 0.08)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ fontSize: '0.92rem', fontWeight: 800, color: isLight ? '#0f172a' : '#cbd5e1', margin: 0 }}>{s.name}</h5>
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#ef4444' }}>LOCKED 🔒</span>
                  </div>

                  {s.prerequisites && s.prerequisites.length > 0 && (
                    <div style={{ padding: '4px 8px', borderRadius: '6px', background: isLight ? 'rgba(254, 226, 226, 0.8)' : 'rgba(239, 68, 68, 0.1)', color: isLight ? '#be123c' : '#f87171', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <AlertCircle size={12} /> Requires: {s.prerequisites.join(', ')}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SkillPathView;
