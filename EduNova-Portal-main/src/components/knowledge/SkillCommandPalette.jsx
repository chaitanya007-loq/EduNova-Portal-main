import React, { useState } from 'react';
import { Search, Command, X, Sparkles, MapPin, Layers, Award } from 'lucide-react';
import { CONSTELLATION_SKILLS } from '../../data/skillCategories';

export const SkillCommandPalette = ({ isOpen, onClose, onSelectSkill, onViewModeChange }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = CONSTELLATION_SKILLS.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'rgba(5, 8, 20, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', paddingTop: '100px', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '560px', height: 'fit-content', borderRadius: '24px', background: '#0c1024', border: '1px solid #06b6d4', boxShadow: '0 20px 60px rgba(0,0,0,0.9)', overflow: 'hidden', color: '#fff' }}>
        {/* Search Bar Input */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={18} color="#06b6d4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a skill, subject, or command..."
            autoFocus
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none' }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Actions */}
        <div style={{ padding: '12px 16px', background: 'rgba(5, 8, 20, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          <button onClick={() => { onViewModeChange('constellation'); onClose(); }} style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer' }}>
            🌌 Constellation View
          </button>
          <button onClick={() => { onViewModeChange('career'); onClose(); }} style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#a855f7', fontSize: '0.75rem', cursor: 'pointer' }}>
            🎯 Career Map View
          </button>
          <button onClick={() => { onViewModeChange('path'); onClose(); }} style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#10b981', fontSize: '0.75rem', cursor: 'pointer' }}>
            🛣️ Learning Path View
          </button>
        </div>

        {/* Filtered Skills List */}
        <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '0.85rem' }}>No skills match your search query.</div>
          ) : (
            filtered.map(s => (
              <div
                key={s.id}
                onClick={() => { onSelectSkill(s.id); onClose(); }}
                style={{ padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.15s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>{s.name}</span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>{s.category}</span>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#06b6d4' }}>{s.masteryScore}%</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
