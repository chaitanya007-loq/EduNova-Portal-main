import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Zap, CheckCircle2, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const HologramSkillTreeWidget = () => {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState(2); // default selected React 3D node

  const skillNodes = [
    { id: 1, name: 'Core Web Foundations', level: 1, status: 'unlocked', xp: 200, category: 'Frontend', path: '/courses/crs_1' },
    { id: 2, name: '3D WebXR & Canvas', level: 2, status: 'in_progress', xp: 400, category: 'AR/VR Labs', path: '/xr-studio' },
    { id: 3, name: 'AI Computer Vision', level: 3, status: 'unlocked', xp: 600, category: 'AI Vision', path: '/immersive-lab' },
    { id: 4, name: 'Quantum Neural Nets', level: 4, status: 'locked', xp: 800, category: 'Advanced AI', path: '/ai-assistant' },
    { id: 5, name: 'Spatial Mesh Engineering', level: 5, status: 'locked', xp: 1200, category: 'Metaverse', path: '/constellation' }
  ];

  const active = skillNodes.find(n => n.id === selectedNode) || skillNodes[1];

  return (
    <div style={{
      background: 'rgba(12, 16, 36, 0.92)',
      backdropFilter: 'blur(20px)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid rgba(168, 85, 247, 0.35)',
      padding: '24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px'
    }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={20} color="#a855f7" />
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>Holographic Skill Tree</h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 600 }}>Interactive Mastery Nodes</span>
        </div>
        <div className="cyber-badge" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
          <Sparkles size={14} color="#a855f7" /> 5-Node Constellation
        </div>
      </div>

      {/* Nodes Visual Track */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 14px',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative'
      }}>
        {/* Connector Line */}
        <div style={{
          position: 'absolute',
          left: '40px',
          right: '40px',
          top: '50%',
          height: '3px',
          background: 'linear-gradient(90deg, #10b981, #06b6d4, #a855f7, rgba(255,255,255,0.15))',
          zIndex: 1,
          transform: 'translateY(-50%)'
        }} />

        {skillNodes.map((node) => {
          const isSelected = node.id === selectedNode;
          const isUnlocked = node.status === 'unlocked';
          const isInProgress = node.status === 'in_progress';

          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              style={{
                width: isSelected ? '48px' : '38px',
                height: isSelected ? '48px' : '38px',
                borderRadius: '50%',
                background: isUnlocked
                  ? '#10b981'
                  : isInProgress
                  ? 'linear-gradient(135deg, #06b6d4, #6366f1)'
                  : 'rgba(30, 41, 59, 0.9)',
                border: isSelected
                  ? '3px solid #ffffff'
                  : isInProgress
                  ? '2px solid #06b6d4'
                  : '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                zIndex: 2,
                transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: isSelected
                  ? '0 0 20px rgba(168, 85, 247, 0.8)'
                  : isInProgress
                  ? '0 0 12px rgba(6, 182, 212, 0.6)'
                  : 'none'
              }}
            >
              {isUnlocked ? (
                <CheckCircle2 size={18} color="#fff" />
              ) : isInProgress ? (
                <span>L{node.level}</span>
              ) : (
                <Lock size={14} color="var(--text-muted)" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Node Details Box */}
      <div style={{
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(6, 182, 212, 0.15))',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        flexWrap: 'wrap'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>
            {active.category} • Level {active.level}
          </span>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: '2px 0 4px' }}>
            {active.name}
          </h4>
          <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={14} /> +{active.xp} XP Mastery Bounty
          </span>
        </div>

        <Button size="sm" onClick={() => navigate(active.path)}>
          Explore Node <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
};

export default HologramSkillTreeWidget;
