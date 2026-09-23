import React, { useState } from 'react';
import { Compass, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';

export const AncientHistorySim = () => {
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const timelineEvents = [
    {
      year: '2560 BCE',
      title: 'Construction of the Great Pyramid of Giza',
      location: 'Ancient Egypt',
      artifact: 'Golden Capstone Blueprint & Quarry Sled Mechanics',
      details: 'Architectural marvel involving precisely aligned limestone blocks, internal grand galleries, and stellar orientation.'
    },
    {
      year: '432 BCE',
      title: 'Golden Age of Athens & Parthenon',
      location: 'Greece',
      artifact: 'Marble Frieze Sculptures & Ionic Columns',
      details: 'Peak of democratic philosophy, classic theatre, geometry, and sacred proportional architecture under Pericles.'
    },
    {
      year: '210 BCE',
      title: 'Terracotta Army of Emperor Qin Shi Huang',
      location: 'Ancient China',
      artifact: 'Life-sized Clay Warriors & Bronze Chariots',
      details: 'Over 8,000 unique clay soldiers buried to safeguard the first unified Emperor in the afterlife.'
    }
  ];

  const current = timelineEvents[activeEventIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Timeline Steps Selector */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {timelineEvents.map((ev, idx) => (
          <button
            key={idx}
            onClick={() => setActiveEventIndex(idx)}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              background: idx === activeEventIndex ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--bg-tertiary)',
              color: idx === activeEventIndex ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              fontWeight: 600,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap'
            }}
          >
            🏛️ {ev.year} — {ev.location}
          </button>
        ))}
      </div>

      {/* 360 Artifact Inspector Card */}
      <div style={{
        background: '#050811',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '28px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        alignItems: 'center'
      }}>
        <div style={{
          height: '220px',
          borderRadius: 'var(--radius-md)',
          background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.25), transparent 70%)',
          border: '1px dashed var(--border-glow)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '20px'
        }}>
          <Compass size={48} className="animate-spin-slow" color="#38bdf8" />
          <span style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Interactive 360° Artifact Inspection Node
          </span>
          <strong style={{ color: '#fff', marginTop: '4px' }}>{current.artifact}</strong>
        </div>

        <div>
          <span className="cyber-badge-amber" style={{ marginBottom: '10px' }}>
            <Clock size={12} /> Timeline Node: {current.year}
          </span>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '8px', marginBottom: '8px' }}>
            {current.title}
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
            {current.details}
          </p>

          <Button
            size="sm"
            onClick={() => setActiveEventIndex((prev) => (prev + 1) % timelineEvents.length)}
          >
            Explore Next Historical Event <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};
