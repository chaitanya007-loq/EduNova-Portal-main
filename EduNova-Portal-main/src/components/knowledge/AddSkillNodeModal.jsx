import React, { useState } from 'react';
import { PlusCircle, X, Sparkles, Network, CheckCircle2, Sliders } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AddSkillNodeModal = ({ isOpen, onClose, onAddNode, existingNodes = [], categories = [] }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[1] || 'Core');
  const [masteryScore, setMasteryScore] = useState(50);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [prerequisiteId, setPrerequisiteId] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddNode({
      name: name.trim(),
      category: category || 'Core',
      masteryScore: Number(masteryScore),
      difficulty,
      prerequisiteId: prerequisiteId || null,
      description: description.trim() || `Mastery & practice node for ${name.trim()}`
    });

    // Reset Form
    setName('');
    setMasteryScore(50);
    setDescription('');
    setPrerequisiteId('');
    onClose();
  };

  const getStatusFromScore = (score) => {
    if (score >= 80) return { label: 'MASTERED', color: '#10b981' };
    if (score >= 50) return { label: 'ACTIVE', color: isLight ? '#0284c7' : '#38bdf8' };
    return { label: 'NEEDS_REVIEW', color: '#d97706' };
  };

  const currentStatus = getStatusFromScore(masteryScore);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(5, 8, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 249, 255, 0.95) 100%)'
            : 'radial-gradient(circle at top left, #0f172a 0%, #050814 100%)',
          border: isLight ? '1.5px solid rgba(6, 182, 212, 0.5)' : '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '24px',
          padding: '26px',
          color: isLight ? '#0f172a' : '#ffffff',
          boxShadow: isLight ? '0 25px 60px rgba(100, 130, 200, 0.25)' : '0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: isLight ? '#64748b' : '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ padding: '10px', borderRadius: '14px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)' }}>
            <Network size={22} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
              Add New Constellation Node
            </h3>
            <p style={{ margin: 0, color: isLight ? '#0284c7' : '#38bdf8', fontSize: '0.8rem', fontWeight: 600 }}>
              Add a custom skill or topic node to your knowledge map
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Skill Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', marginBottom: '6px' }}>
              Skill / Topic Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Organic Chemistry, Quantum Physics, React Hooks..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                background: isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.7)',
                border: isLight ? '1px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isLight ? '#0f172a' : '#fff',
                fontSize: '0.86rem',
                fontWeight: 600,
                outline: 'none'
              }}
            />
          </div>

          {/* Category & Difficulty Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', marginBottom: '6px' }}>
                Subject / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: isLight ? '#ffffff' : '#0f172a',
                  border: isLight ? '1px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: isLight ? '#0f172a' : '#fff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', marginBottom: '6px' }}>
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: isLight ? '#ffffff' : '#0f172a',
                  border: isLight ? '1px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: isLight ? '#0f172a' : '#fff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Mastery Score Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1' }}>
                Current Mastery Score: <strong style={{ color: currentStatus.color }}>{masteryScore}%</strong>
              </label>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px', background: `${currentStatus.color}22`, color: currentStatus.color, border: `1px solid ${currentStatus.color}44` }}>
                {currentStatus.label}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={masteryScore}
              onChange={(e) => setMasteryScore(e.target.value)}
              style={{ width: '100%', accentColor: currentStatus.color, cursor: 'pointer' }}
            />
          </div>

          {/* Prerequisite Node Link */}
          {existingNodes.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', marginBottom: '6px' }}>
                Prerequisite Node (Connect Link)
              </label>
              <select
                value={prerequisiteId}
                onChange={(e) => setPrerequisiteId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: isLight ? '#ffffff' : '#0f172a',
                  border: isLight ? '1px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: isLight ? '#0f172a' : '#fff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value="">None (Independent Node)</option>
                {existingNodes.map(node => (
                  <option key={node.id} value={node.id}>🔗 Connects after: {node.name} ({node.masteryScore}%)</option>
                ))}
              </select>
            </div>
          )}

          {/* Description / Summary */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#334155' : '#cbd5e1', marginBottom: '6px' }}>
              Description / Learning Goal
            </label>
            <textarea
              placeholder="Key concepts, topics, or formulas included in this node..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                background: isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.7)',
                border: isLight ? '1px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isLight ? '#0f172a' : '#fff',
                fontSize: '0.84rem',
                fontWeight: 600,
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            style={{
              marginTop: '6px',
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)'
            }}
          >
            <Sparkles size={16} /> Add Node to Constellation
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSkillNodeModal;
