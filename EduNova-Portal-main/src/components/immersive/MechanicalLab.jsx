import React, { useState } from 'react';
import { Settings, Cpu, Layers, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

export const MechanicalLab = () => {
  const [assembledParts, setAssembledParts] = useState([]);
  const parts = [
    { id: 'p1', name: 'Turbine Rotor Unit', icon: Cpu, desc: 'High-speed kinetic energy compression' },
    { id: 'p2', name: 'Electromagnetic Stator', icon: Layers, desc: 'Generates magnetic torque matrix' },
    { id: 'p3', name: 'Quantum Core Microprocessor', icon: Settings, desc: 'Synchronizes frequency vectors' }
  ];

  const handleTogglePart = (id) => {
    if (assembledParts.includes(id)) {
      setAssembledParts(assembledParts.filter((p) => p !== id));
    } else {
      setAssembledParts([...assembledParts, id]);
    }
  };

  const isFullyAssembled = assembledParts.length === parts.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        height: '320px',
        background: '#050811',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Animated Central Engine Assembly Blueprint Visual */}
        <div style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          border: '3px dashed var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          animation: isFullyAssembled ? 'spinSlow 10s linear infinite' : 'none'
        }}>
          {parts.map((p, idx) => {
            const Icon = p.icon;
            const isInstalled = assembledParts.includes(p.id);
            return (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  transform: `rotate(${idx * 120}deg) translate(60px) rotate(-${idx * 120}deg)`,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isInstalled ? '#10b981' : 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s ease'
                }}
              >
                <Icon size={20} color={isInstalled ? '#fff' : 'var(--text-muted)'} />
              </div>
            );
          })}
          <Settings size={44} color={isFullyAssembled ? '#38bdf8' : 'var(--text-muted)'} />
        </div>

        <div style={{ marginTop: '20px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
          Assembly Status:{' '}
          <strong style={{ color: isFullyAssembled ? '#10b981' : '#f59e0b' }}>
            {isFullyAssembled ? 'ENGINE OPERATIONAL (100%)' : `${assembledParts.length} / 3 COMPONENTS FITTED`}
          </strong>
        </div>
      </div>

      {/* Parts Selector List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {parts.map((p) => {
          const isInstalled = assembledParts.includes(p.id);
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              onClick={() => handleTogglePart(p.id)}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: isInstalled ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-tertiary)',
                border: isInstalled ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={18} color={isInstalled ? '#10b981' : '#6366f1'} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</span>
                </div>
                {isInstalled && <CheckCircle size={16} color="#10b981" />}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
