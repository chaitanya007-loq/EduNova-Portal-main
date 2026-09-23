import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  BookOpen,
  PlayCircle,
  Bot,
  Zap,
  Award,
  Layers,
  Filter,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAI } from '../../context/AIContext';
import { useTheme } from '../../context/ThemeContext';
import { ProgressBar } from '../common/ProgressBar';

export const LearningMapView = ({ nodes = [] }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();
  const { openAIChat, sendMessage } = useAI();

  const [selectedNode, setSelectedNode] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'In Progress' | 'Mastered' | 'Recommended'

  // Telemetry Calculations
  const totalNodes = nodes.length;
  const masteredCount = nodes.filter(n => n.progress >= 100 || n.status === 'Mastered').length;
  const avgPathProgress = totalNodes > 0
    ? Math.round(nodes.reduce((acc, n) => acc + (n.progress || 0), 0) / totalNodes)
    : 0;
  const totalXP = nodes.reduce((acc, n) => acc + (n.xp || 200), 0);
  const recommendedNode = nodes.find(n => n.recommendedNext || n.status === 'In Progress') || nodes[0];

  const getFilteredNodes = () => {
    if (filterStatus === 'Mastered') return nodes.filter(n => n.progress >= 100 || n.status === 'Mastered');
    if (filterStatus === 'In Progress') return nodes.filter(n => n.progress > 0 && n.progress < 100);
    if (filterStatus === 'Recommended') return nodes.filter(n => n.recommendedNext || n.status === 'In Progress');
    return nodes;
  };

  const filteredNodes = getFilteredNodes();

  const handleStartNodeQuiz = (node, e) => {
    if (e) e.stopPropagation();
    openAIChat();
    sendMessage(`Start a 5-question diagnostic quiz for ${node.title} (${node.subject}).`);
  };

  const handleAskSage = (node, e) => {
    if (e) e.stopPropagation();
    openAIChat();
    sendMessage(`Explain key concepts, formulas, and prerequisites for ${node.title} in ${node.subject}.`);
  };

  return (
    <div style={{
      background: isLight
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 246, 255, 0.9) 100%)'
        : 'linear-gradient(135deg, rgba(20, 28, 58, 0.96) 0%, rgba(12, 16, 36, 0.98) 100%)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      borderRadius: '28px',
      border: isLight ? '1.5px solid rgba(210, 225, 250, 0.95)' : '1.5px solid rgba(6, 182, 212, 0.35)',
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      boxShadow: isLight
        ? '0 20px 50px rgba(100, 130, 200, 0.15), 0 0 30px rgba(56, 189, 248, 0.1)'
        : '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(6, 182, 212, 0.25)',
      position: 'relative'
    }}>
      {/* 1. HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#0284c7',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Layers size={14} /> Interactive Prerequisite Graph
          </span>
          <h2 style={{
            fontSize: '1.55rem',
            fontWeight: 900,
            color: isLight ? '#0f172a' : '#ffffff',
            margin: '8px 0 4px',
            letterSpacing: '-0.01em'
          }}>
            🗺️ Curriculum Learning Map
          </h2>
          <p style={{ color: isLight ? '#475569' : '#cbd5e1', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
            Click any node to inspect prerequisites, completion status, and recommended next steps.
          </p>
        </div>

        {/* Telemetry Snapshot Cards */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.06)',
            border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)',
            padding: '10px 16px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Award size={20} color="#059669" />
            <div>
              <span style={{ fontSize: '0.7rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Mastered</span>
              <strong style={{ fontSize: '0.95rem', color: isLight ? '#0f172a' : '#ffffff', fontWeight: 800 }}>{masteredCount} / {totalNodes} Nodes</strong>
            </div>
          </div>

          <div style={{
            background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.06)',
            border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)',
            padding: '10px 16px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Zap size={20} color="#d97706" />
            <div>
              <span style={{ fontSize: '0.7rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Path Completion</span>
              <strong style={{ fontSize: '0.95rem', color: '#0284c7', fontWeight: 800 }}>{avgPathProgress}% Overall</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. OVERALL PATH PROGRESS BAR & AI RECOMMENDATION BANNER */}
      <div style={{
        background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(15, 23, 42, 0.7)',
        borderRadius: '18px',
        padding: '16px 20px',
        border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
          <span style={{ fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#a855f7" /> Sage AI Path Recommendation
          </span>
          <span style={{ color: isLight ? '#5D7192' : '#cbd5e1', fontWeight: 700 }}>
            Curriculum Potential: <strong style={{ color: '#059669' }}>+{totalXP} XP</strong>
          </span>
        </div>
        <ProgressBar progress={avgPathProgress} color="#38bdf8" height={8} />
        {recommendedNode && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '2px' }}>
            <span style={{ fontSize: '0.82rem', color: isLight ? '#334155' : '#cbd5e1' }}>
              🎯 Recommended Next Focus: <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{recommendedNode.title}</strong> ({recommendedNode.subject})
            </span>
            <button
              onClick={(e) => handleStartNodeQuiz(recommendedNode, e)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.35)'
              }}
            >
              <Zap size={13} /> ⚡ Start Diagnostic Quiz
            </button>
          </div>
        )}
      </div>

      {/* 3. FILTER PILLS BAR */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: isLight ? '#5D7192' : '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Filter size={14} color="#0284c7" /> Filter Graph:
        </span>
        {['All', 'In Progress', 'Mastered', 'Recommended'].map(status => {
          const isActive = filterStatus === status;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: isActive
                  ? 'linear-gradient(135deg, #06b6d4, #6366f1)'
                  : (isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)'),
                color: isActive ? '#ffffff' : (isLight ? '#475569' : '#cbd5e1'),
                border: isActive
                  ? 'none'
                  : (isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)'),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 12px rgba(6, 182, 212, 0.35)' : 'none'
              }}
            >
              {status} {status === 'All' ? `(${nodes.length})` : ''}
            </button>
          );
        })}
      </div>

      {/* 4. VISUAL DEPENDENCY FLOW NODE CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>
        {filteredNodes.map((node, index) => {
          const isSelected = selectedNode?.id === node.id;
          const isCompleted = node.progress >= 100 || node.status === 'Mastered';
          const isInProgress = node.progress > 0 && node.progress < 100;
          const isRecommended = node.recommendedNext;

          return (
            <React.Fragment key={node.id}>
              {index > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '-6px 0' }}>
                  <div style={{
                    width: '3px',
                    height: '24px',
                    background: isLight
                      ? 'linear-gradient(to bottom, #38bdf8, #6366f1)'
                      : 'linear-gradient(to bottom, #06b6d4, #6366f1)',
                    borderRadius: '2px',
                    boxShadow: '0 0 8px rgba(56, 189, 248, 0.4)'
                  }} />
                </div>
              )}

              <div
                onClick={() => setSelectedNode(node)}
                style={{
                  background: isLight
                    ? (isSelected
                        ? 'linear-gradient(135deg, rgba(238, 242, 255, 0.98) 0%, rgba(224, 231, 255, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 249, 255, 0.9) 100%)')
                    : (isSelected
                        ? 'rgba(6, 182, 212, 0.22)'
                        : 'rgba(15, 23, 42, 0.85)'),
                  backdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  border: isSelected
                    ? '2.5px solid #6366f1'
                    : isCompleted
                    ? (isLight ? '1.5px solid rgba(52, 211, 153, 0.8)' : '1.5px solid rgba(52, 211, 153, 0.4)')
                    : isRecommended
                    ? '1.5px solid rgba(168, 85, 247, 0.8)'
                    : (isLight ? '1px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(255, 255, 255, 0.14)'),
                  padding: '18px 22px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isLight
                    ? (isSelected ? '0 10px 30px rgba(99, 102, 241, 0.22)' : '0 4px 16px rgba(100, 130, 200, 0.08)')
                    : (isSelected ? '0 10px 30px rgba(6, 182, 212, 0.35)' : 'none')
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '260px' }}>
                  {/* Status Indicator Icon */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: isCompleted
                      ? (isLight ? 'rgba(52, 211, 153, 0.18)' : 'rgba(52, 211, 153, 0.25)')
                      : isInProgress
                      ? (isLight ? 'rgba(56, 189, 248, 0.18)' : 'rgba(6, 182, 212, 0.25)')
                      : isRecommended
                      ? (isLight ? 'rgba(168, 85, 247, 0.18)' : 'rgba(168, 85, 247, 0.25)')
                      : (isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.06)'),
                    border: isCompleted
                      ? '1px solid #34d399'
                      : isInProgress
                      ? '1px solid #38bdf8'
                      : isRecommended
                      ? '1px solid #a855f7'
                      : (isLight ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.15)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCompleted
                      ? '#059669'
                      : isInProgress
                      ? '#0284c7'
                      : isRecommended
                      ? '#7c3aed'
                      : (isLight ? '#94a3b8' : '#64748b'),
                    flexShrink: 0
                  }}>
                    {isCompleted ? (
                      <CheckCircle2 size={22} />
                    ) : isRecommended ? (
                      <Sparkles size={22} />
                    ) : isInProgress ? (
                      <PlayCircle size={22} />
                    ) : (
                      <Lock size={20} />
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.74rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                        Level {node.level} • {node.subject}
                      </span>
                      {isRecommended && (
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: 'rgba(168, 85, 247, 0.18)', color: '#a855f7', fontWeight: 800, border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                          ✨ Recommended Next
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '2px 0 4px', letterSpacing: '-0.01em' }}>
                      {node.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                      <span style={{
                        color: isCompleted ? '#059669' : isInProgress ? '#0284c7' : (isLight ? '#64748b' : '#94a3b8'),
                        fontWeight: 800
                      }}>
                        {node.status} ({node.progress}%)
                      </span>
                      {node.prerequisites && node.prerequisites.length > 0 && (
                        <span style={{ color: isLight ? '#5D7192' : '#94a3b8', fontWeight: 600 }}>
                          Requires: {node.prerequisites.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={(e) => handleStartNodeQuiz(node, e)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '999px',
                      background: isLight ? 'rgba(238, 242, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)',
                      border: isLight ? '1px solid rgba(199, 210, 254, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                      color: isLight ? '#1e40af' : '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <Zap size={13} color="#0284c7" /> Quiz Me
                  </button>

                  <button
                    onClick={(e) => handleAskSage(node, e)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '999px',
                      background: 'rgba(168, 85, 247, 0.14)',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      color: '#a855f7',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <Bot size={13} /> Ask Sage
                  </button>

                  <button
                    onClick={() => setSelectedNode(node)}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
                      border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.14)',
                      color: isLight ? '#0f172a' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Inspect Node Details"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* 5. NODE DETAILS INSPECTOR DRAWER / MODAL */}
      {selectedNode && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(5, 8, 20, 0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '620px',
            background: isLight
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 249, 255, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(20, 28, 58, 0.96) 0%, rgba(14, 18, 42, 0.98) 100%)',
            border: isLight ? '1.5px solid rgba(210, 225, 250, 0.95)' : '1.5px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '28px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            boxShadow: isLight ? '0 25px 60px rgba(15, 23, 42, 0.22)' : '0 30px 80px rgba(0, 0, 0, 0.75)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                  Level {selectedNode.level} • {selectedNode.subject}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '2px 0 0' }}>
                  {selectedNode.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                style={{
                  background: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)',
                  border: isLight ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isLight ? '#475569' : '#cbd5e1',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: isLight ? '#334155' : '#cbd5e1', margin: 0, lineHeight: 1.55 }}>
              {selectedNode.description || 'Master core concepts and complete interactive diagnostic benchmarks to increase curriculum XP.'}
            </p>

            <div style={{
              background: isLight ? 'rgba(240, 246, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)',
              padding: '14px 16px',
              borderRadius: '16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              textAlign: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Status</span>
                <strong style={{ fontSize: '0.88rem', color: '#059669', fontWeight: 800 }}>{selectedNode.status}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Progress</span>
                <strong style={{ fontSize: '0.88rem', color: '#0284c7', fontWeight: 800 }}>{selectedNode.progress}%</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>XP Reward</span>
                <strong style={{ fontSize: '0.88rem', color: '#d97706', fontWeight: 800 }}>+{selectedNode.xp || 200} XP</strong>
              </div>
            </div>

            {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
              <div>
                <span style={{ fontSize: '0.78rem', color: isLight ? '#5D7192' : '#cbd5e1', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Prerequisites Required:
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedNode.prerequisites.map((p, i) => (
                    <span key={i} style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: '8px', background: isLight ? 'rgba(56, 189, 248, 0.15)' : 'rgba(56, 189, 248, 0.2)', color: '#0284c7', fontWeight: 700, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={(e) => {
                  setSelectedNode(null);
                  handleStartNodeQuiz(selectedNode, e);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(6, 182, 212, 0.4)'
                }}
              >
                <Zap size={14} /> Start Diagnostic Quiz
              </button>

              <button
                onClick={(e) => {
                  setSelectedNode(null);
                  handleAskSage(selectedNode, e);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '999px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  color: '#a855f7',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Bot size={14} /> Ask Sage AI Tutor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningMapView;

