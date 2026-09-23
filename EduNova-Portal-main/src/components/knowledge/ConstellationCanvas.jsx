import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, PlusCircle, Sparkles, Move } from 'lucide-react';
import { SkillMinimap } from './SkillMinimap';
import { useTheme } from '../../context/ThemeContext';
import { skillGraphService } from '../../services/skillGraphService';

export const ConstellationCanvas = ({
  graphData,
  selectedSkillId,
  onSelectSkill,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitToScreen,
  onOpenAddModal,
  onLoadDefaultCurriculum,
  educationContext = 'college'
}) => {
  // Canvas pan state
  const [isPanDragging, setIsPanDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Node Drag & Move / Swap State
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragNodePos, setDragNodePos] = useState(null); // { x, y }
  const [initialNodePos, setInitialNodePos] = useState(null); // { x, y }
  const [hoverTargetNodeId, setHoverTargetNodeId] = useState(null);

  // Local copy of node positions during drag
  const [localNodes, setLocalNodes] = useState([]);

  const { theme } = useTheme();
  const isLight = theme === 'light';
  const containerRef = useRef(null);

  const { nodes: propNodes = [], links = [] } = graphData || {};

  // Sync propNodes to localNodes when propNodes change (and not dragging)
  useEffect(() => {
    if (!draggedNodeId) {
      setLocalNodes(propNodes);
    }
  }, [propNodes, draggedNodeId]);

  // Convert client MouseEvent coordinates into SVG Canvas coordinates
  const getCanvasCoords = (e) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // ViewBox dimensions: 1000 x 520
    const scaleX = 1000 / rect.width;
    const scaleY = 520 / rect.height;

    const svgX = (mouseX * scaleX - offset.x) / zoomLevel;
    const svgY = (mouseY * scaleY - offset.y) / zoomLevel;

    return {
      x: Math.max(50, Math.min(950, Math.round(svgX))),
      y: Math.max(40, Math.min(480, Math.round(svgY)))
    };
  };

  // Handle Mouse Down on Canvas Background (Pan Canvas)
  const handleCanvasMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.tagName === 'rect') {
      setIsPanDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  // Handle Node Mouse Down (Start Dragging Node)
  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    setDraggedNodeId(node.id);
    setInitialNodePos({ x: node.x, y: node.y });
    setDragNodePos({ x: node.x, y: node.y });
    onSelectSkill(node.id);
  };

  // Handle Mouse Move (Dragging Node or Panning Canvas)
  const handleMouseMove = (e) => {
    if (draggedNodeId) {
      const coords = getCanvasCoords(e);
      setDragNodePos(coords);

      // Update local node position for smooth line connection rendering
      setLocalNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: coords.x, y: coords.y } : n));

      // Check proximity to other nodes for SWAP
      const target = localNodes.find(n => n.id !== draggedNodeId && Math.hypot(n.x - coords.x, n.y - coords.y) < 45);
      if (target) {
        setHoverTargetNodeId(target.id);
      } else {
        setHoverTargetNodeId(null);
      }
    } else if (isPanDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  // Handle Mouse Up (End Dragging Node or Panning Canvas)
  const handleMouseUp = () => {
    if (draggedNodeId && dragNodePos && initialNodePos) {
      let finalNodes = [...localNodes];

      if (hoverTargetNodeId) {
        // SWAP PLACES: Target node takes initial position of dragged node
        const targetNode = finalNodes.find(n => n.id === hoverTargetNodeId);
        if (targetNode) {
          finalNodes = finalNodes.map(n => {
            if (n.id === draggedNodeId) {
              return { ...n, x: targetNode.x, y: targetNode.y };
            }
            if (n.id === hoverTargetNodeId) {
              return { ...n, x: initialNodePos.x, y: initialNodePos.y };
            }
            return n;
          });
        }
      } else {
        // Move dragged node to new canvas position
        finalNodes = finalNodes.map(n => n.id === draggedNodeId ? { ...n, x: dragNodePos.x, y: dragNodePos.y } : n);
      }

      setLocalNodes(finalNodes);
      // Persist updated coordinates to localStorage via service
      skillGraphService.updateNodePositions(educationContext, finalNodes);

      // Reset drag state
      setDraggedNodeId(null);
      setDragNodePos(null);
      setInitialNodePos(null);
      setHoverTargetNodeId(null);
    }

    setIsPanDragging(false);
  };

  const getNodeColor = (status, score) => {
    if (status === 'MASTERED' || score >= 80) return '#10b981';
    if (status === 'STRONG') return '#34d399';
    if (status === 'ACTIVE') return '#6366f1';
    if (status === 'AVAILABLE') return isLight ? '#0284c7' : '#38bdf8';
    if (status === 'NEEDS_REVIEW') return '#d97706';
    return isLight ? '#64748b' : '#475569';
  };

  const activeNodes = localNodes.length > 0 ? localNodes : propNodes;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: 'relative',
        width: '100%',
        height: '520px',
        borderRadius: '24px',
        background: isLight 
          ? 'linear-gradient(135deg, rgba(240, 246, 255, 0.95), rgba(225, 238, 255, 0.9))' 
          : '#040711',
        border: isLight ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(6, 182, 212, 0.35)',
        boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.05)' : '0 20px 60px rgba(0, 0, 0, 0.65)',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: draggedNodeId ? 'grabbing' : (isPanDragging ? 'grabbing' : 'grab')
      }}
    >
      {/* Background Star Particle Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isLight
            ? 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 70%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)'
            : 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 70%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}
      />

      {/* Drag Instruction Banner */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '20px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          border: isLight ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
          color: isLight ? '#0f172a' : '#e2e8f0',
          fontSize: '0.76rem',
          fontWeight: 600,
          pointerEvents: 'none'
        }}
      >
        <Move size={14} color="#06b6d4" />
        <span>Drag & drop nodes to move or swap positions dynamically</span>
      </div>

      {/* SVG Canvas Container */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 520"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="laserGradMastered" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="laserGradActive" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <g transform={`translate(${offset.x}, ${offset.y}) scale(${zoomLevel})`}>
          {/* Links / Connections (Recalculated dynamically) */}
          {links.map((link, idx) => {
            const srcNode = activeNodes.find(n => n.id === link.source);
            const tgtNode = activeNodes.find(n => n.id === link.target);
            if (!srcNode || !tgtNode) return null;

            const isMastered = srcNode.status === 'MASTERED';
            const isActive = srcNode.status === 'ACTIVE' || srcNode.status === 'STRONG';

            return (
              <line
                key={`link_${idx}`}
                x1={srcNode.x}
                y1={srcNode.y}
                x2={tgtNode.x}
                y2={tgtNode.y}
                stroke={isMastered ? 'url(#laserGradMastered)' : (isActive ? 'url(#laserGradActive)' : (isLight ? 'rgba(148, 163, 184, 0.4)' : 'rgba(255, 255, 255, 0.12)'))}
                strokeWidth={isMastered ? '2.5' : (isActive ? '2' : '1.2')}
                strokeDasharray={link.type === 'PREREQUISITE' && !isMastered ? '4 4' : 'none'}
              />
            );
          })}

          {/* Skill Nodes with Drag & Swap */}
          {activeNodes.map((node) => {
            const isSelected = selectedSkillId === node.id;
            const isBeingDragged = draggedNodeId === node.id;
            const isTargetedForSwap = hoverTargetNodeId === node.id;
            const color = getNodeColor(node.status, node.masteryScore);
            const isLocked = node.status === 'LOCKED';

            return (
              <g
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                onClick={(e) => { e.stopPropagation(); onSelectSkill(node.id); }}
                style={{
                  cursor: isBeingDragged ? 'grabbing' : 'grab',
                  transition: isBeingDragged ? 'none' : 'transform 0.2s ease'
                }}
              >
                {/* Target Swap Pulsing Indicator Ring */}
                {isTargetedForSwap && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="38"
                    fill="rgba(6, 182, 212, 0.2)"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    style={{ animation: 'spin 4s linear infinite' }}
                  />
                )}

                {/* Outer Glow Pulse Ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected || isBeingDragged ? 34 : (node.status === 'ACTIVE' ? 26 : 22)}
                  fill="none"
                  stroke={isTargetedForSwap ? '#06b6d4' : color}
                  strokeWidth={isSelected || isBeingDragged ? '3.5' : '2'}
                  opacity={isSelected || isBeingDragged || isTargetedForSwap ? '1' : '0.5'}
                />

                {/* Progress Ring for Active / Developing Skills */}
                {(node.status === 'ACTIVE' || node.status === 'NEEDS_REVIEW') && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="18"
                    fill="none"
                    stroke={isLight ? '#0284c7' : '#38bdf8'}
                    strokeWidth="2.5"
                    strokeDasharray="113"
                    strokeDashoffset={113 - (113 * node.masteryScore) / 100}
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="15"
                  fill={isLocked ? (isLight ? '#cbd5e1' : '#1e293b') : color}
                  stroke={isBeingDragged ? '#38bdf8' : (isSelected ? (isLight ? '#18345F' : '#fff') : 'none')}
                  strokeWidth="2.5"
                  style={{ filter: `drop-shadow(0 0 ${isBeingDragged ? '20px' : isSelected ? '15px' : '8px'} ${color})` }}
                />

                {/* Target Swap Text Badge */}
                {isTargetedForSwap && (
                  <g>
                    <rect
                      x={node.x - 40}
                      y={node.y - 42}
                      width="80"
                      height="20"
                      rx="10"
                      fill="#06b6d4"
                    />
                    <text
                      x={node.x}
                      y={node.y - 28}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="900"
                    >
                      🔄 SWAP POS
                    </text>
                  </g>
                )}

                {/* Node Label Text */}
                <text
                  x={node.x}
                  y={node.y + 36}
                  textAnchor="middle"
                  fill={isTargetedForSwap ? '#06b6d4' : (isSelected ? '#0284c7' : (isLight ? '#18345F' : '#ffffff'))}
                  fontSize="12"
                  fontWeight={isSelected || isBeingDragged ? '900' : '700'}
                >
                  {node.name}
                </text>

                <text
                  x={node.x}
                  y={node.y + 50}
                  textAnchor="middle"
                  fill={color}
                  fontSize="10"
                  fontWeight="800"
                >
                  {isLocked ? 'LOCKED 🔒' : `${node.masteryScore}% Mastered`}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Zero Nodes Empty State Overlay */}
      {activeNodes.length === 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '30px',
          textAlign: 'center',
          zIndex: 10,
          background: isLight ? 'rgba(240, 246, 255, 0.65)' : 'rgba(4, 7, 17, 0.75)',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ padding: '16px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
            <Sparkles size={40} color="#06b6d4" />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
            0 Skill Nodes in Your {educationContext?.toUpperCase() || 'LEARNING'} Constellation
          </h3>
          <p style={{ margin: 0, maxWidth: '480px', color: isLight ? '#475569' : '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5 }}>
            Your knowledge constellation for this dashboard is empty. Add your first skill node or import the recommended dashboard curriculum.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <PlusCircle size={16} /> Add Skill Node
              </button>
            )}
            {onLoadDefaultCurriculum && (
              <button
                onClick={onLoadDefaultCurriculum}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.1)',
                  color: isLight ? '#0f172a' : '#fff',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.2)',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                Load Default Curriculum
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Right Controls Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
          background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          padding: '6px',
          borderRadius: '16px',
          border: isLight ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        <button
          onClick={onZoomIn}
          title="Zoom In"
          style={{
            background: 'transparent',
            border: 'none',
            color: isLight ? '#0f172a' : '#ffffff',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ZoomIn size={16} />
        </button>

        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8', minWidth: '42px', textAlign: 'center' }}>
          {Math.round(zoomLevel * 100)}%
        </span>

        <button
          onClick={onZoomOut}
          title="Zoom Out"
          style={{
            background: 'transparent',
            border: 'none',
            color: isLight ? '#0f172a' : '#ffffff',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ZoomOut size={16} />
        </button>

        <div style={{ width: '1px', height: '18px', background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)' }} />

        <button
          onClick={onResetZoom}
          title="Reset Zoom"
          style={{
            background: 'transparent',
            border: 'none',
            color: isLight ? '#0f172a' : '#ffffff',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={onFitToScreen}
          title="Fit to Screen"
          style={{
            background: 'transparent',
            border: 'none',
            color: isLight ? '#0f172a' : '#ffffff',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Minimap Overlay */}
      <SkillMinimap nodes={activeNodes} selectedSkillId={selectedSkillId} isLight={isLight} />
    </div>
  );
};
