import React, { useState } from 'react';
import { Info, Sparkles, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const ARHotspots = ({ hotspots = [], onSelectHotspot, onAskSage, activeHotspot }) => {
  const [selectedHotspotModal, setSelectedHotspotModal] = useState(null);

  const handleHotspotClick = (hs) => {
    setSelectedHotspotModal(hs);
    if (onSelectHotspot) onSelectHotspot(hs);
  };

  const handleAskSageClick = () => {
    const hs = selectedHotspotModal;
    setSelectedHotspotModal(null);
    if (onAskSage && hs) {
      onAskSage(`Explain the function and structure of ${hs.name} in detail.`, hs);
    }
  };

  return (
    <>
      {/* Interactive Hotspot Node Markers Overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 25 }}>
        {hotspots.map((hs, idx) => {
          // Dynamic screen coordinates mapping for hotspots
          const screenPos = (hs.x !== undefined && hs.y !== undefined)
            ? { top: `${hs.y}%`, left: `${hs.x}%` }
            : ([
                { top: '35%', left: '48%' },
                { top: '58%', left: '40%' },
                { top: '45%', left: '62%' },
                { top: '28%', left: '42%' }
              ][idx] || { top: '50%', left: '50%' });

          const isActive = activeHotspot && activeHotspot.id === hs.id;

          return (
            <div
              key={hs.id || idx}
              onClick={() => handleHotspotClick(hs)}
              style={{
                position: 'absolute',
                top: screenPos.top,
                left: screenPos.left,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {/* Pulsing Hotspot Target Node */}
              <div style={{
                position: 'relative',
                width: isActive ? '28px' : '22px',
                height: isActive ? '28px' : '22px',
                borderRadius: '50%',
                background: isActive ? '#f43f5e' : 'rgba(6, 182, 212, 0.9)',
                border: '2px solid #ffffff',
                boxShadow: isActive ? '0 0 20px #f43f5e' : '0 0 15px #06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                <div style={{
                  position: 'absolute',
                  inset: '-6px',
                  borderRadius: '50%',
                  border: `1.5px solid ${isActive ? '#f43f5e' : '#06b6d4'}`,
                  animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                }} />
              </div>

              {/* Hotspot Label Chip */}
              <div style={{
                background: 'rgba(12, 16, 36, 0.92)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isActive ? '#f43f5e' : 'rgba(6, 182, 212, 0.4)'}`,
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: isActive ? '#fb7185' : '#e2e8f0',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
              }}>
                ● {hs.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Component Detailed Hotspot Inspector Modal */}
      <Modal
        isOpen={!!selectedHotspotModal}
        onClose={() => setSelectedHotspotModal(null)}
        title={selectedHotspotModal ? selectedHotspotModal.name : ''}
      >
        {selectedHotspotModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="cyber-badge-cyan">Interactive Hotspot Component</span>
            </div>

            {/* Function Card */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>
                Primary Function
              </h4>
              <p style={{ color: '#ffffff', fontSize: '0.92rem', fontWeight: 600 }}>
                {selectedHotspotModal.function || selectedHotspotModal.description || 'Core interactive node component.'}
              </p>
            </div>

            {/* Simple Explanation */}
            <div>
              <strong style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Simple Explanation</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px', lineHeight: 1.5 }}>
                {selectedHotspotModal.simpleExplanation || selectedHotspotModal.description || 'Examine component functionality and relationships.'}
              </p>
            </div>

            {/* Detailed Explanation */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', borderLeft: '3px solid #6366f1' }}>
              <strong style={{ color: '#818cf8' }}>Detailed Physiology & Mechanics:</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                {selectedHotspotModal.detailedExplanation || selectedHotspotModal.description || 'Detailed technical specs and operational parameters for this node.'}
              </p>
            </div>

            {/* Related Topics Badges */}
            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Related Curriculum Topics:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {(selectedHotspotModal.relatedTopics || (selectedHotspotModal.importance ? [`${selectedHotspotModal.importance} Priority`] : ['3D Component Node'])).map(t => (
                  <span key={t} style={{
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    color: '#38bdf8'
                  }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Ask Sage AI Trigger Button */}
            <Button onClick={handleAskSageClick}>
              <Sparkles size={16} /> Ask Sage AI About {selectedHotspotModal.name}
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ARHotspots;
