import React, { useState, useEffect, useRef } from 'react';
import { FlaskConical, RotateCcw, Play, CheckCircle, Zap } from 'lucide-react';
import { Button } from '../common/Button';

export const ChemistryLab = () => {
  const [molecule, setMolecule] = useState('h2o'); // 'h2o', 'co2', 'ch4', 'glucose'
  const canvasRef = useRef(null);

  const moleculeData = {
    h2o: { name: 'Water (H₂O)', geometry: 'Bent (104.5°)', bonds: 'Polar Covalent', desc: 'Polar universal solvent molecule with hydrogen bonding capacity.' },
    co2: { name: 'Carbon Dioxide (CO₂)', geometry: 'Linear (180°)', bonds: 'Double Covalent', desc: 'Linear non-polar molecule produced via cellular respiration & combustion.' },
    ch4: { name: 'Methane (CH₄)', geometry: 'Tetrahedral (109.5°)', bonds: 'Non-polar Covalent', desc: 'Simple hydrocarbon alkane with symmetric tetrahedral symmetry.' },
    glucose: { name: 'Glucose (C₆H₁₂O₆)', geometry: 'Hexose Pyranose Ring', bonds: 'Covalent Glycosidic', desc: 'Primary monosaccharide energy source synthesized in photosynthesis.' }
  };

  const current = moleculeData[molecule];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.02;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.save();
      ctx.translate(cx, cy);

      if (molecule === 'h2o') {
        // Oxygen Core Node (Red)
        ctx.beginPath();
        ctx.arc(0, -10, 36, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.shadowBlur = 20; ctx.shadowColor = '#f43f5e';
        ctx.fill(); ctx.shadowBlur = 0;

        // Hydrogen Atom 1
        const h1x = Math.cos(angle + 0.9) * 90;
        const h1y = Math.sin(angle + 0.9) * 70 + 40;

        // Hydrogen Atom 2
        const h2x = Math.cos(angle - 0.9) * 90;
        const h2y = Math.sin(angle - 0.9) * 70 + 40;

        // Covalent Bonds
        ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(h1x, h1y); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(h2x, h2y); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.stroke();

        // Hydrogen Nodes (White)
        ctx.beginPath(); ctx.arc(h1x, h1y, 22, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
        ctx.beginPath(); ctx.arc(h2x, h2y, 22, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('O (δ-)', 0, -6);
        ctx.fillStyle = '#0f172a';
        ctx.fillText('H (δ+)', h1x, h1y + 4);
        ctx.fillText('H (δ+)', h2x, h2y + 4);
      }

      else if (molecule === 'co2') {
        const xOffset = Math.sin(angle) * 20;

        // Carbon Center Node (Grey/Black)
        ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2); ctx.fillStyle = '#64748b'; ctx.fill();

        // Double Bonds
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-32, -8); ctx.lineTo(-110 + xOffset, -8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-32, 8); ctx.lineTo(-110 + xOffset, 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(32, -8); ctx.lineTo(110 + xOffset, -8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(32, 8); ctx.lineTo(110 + xOffset, 8); ctx.stroke();

        // Oxygen 1
        ctx.beginPath(); ctx.arc(-110 + xOffset, 0, 28, 0, Math.PI * 2); ctx.fillStyle = '#f43f5e'; ctx.fill();
        // Oxygen 2
        ctx.beginPath(); ctx.arc(110 + xOffset, 0, 28, 0, Math.PI * 2); ctx.fillStyle = '#f43f5e'; ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('C', 0, 4);
        ctx.fillText('O', -110 + xOffset, 4);
        ctx.fillText('O', 110 + xOffset, 4);
      }

      else if (molecule === 'ch4') {
        // Carbon Center
        ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fillStyle = '#6366f1'; ctx.fill();

        // 4 Tetrahedral Bonds
        for (let i = 0; i < 4; i++) {
          const bAngle = angle + (i * Math.PI / 2);
          const hx = Math.cos(bAngle) * 95;
          const hy = Math.sin(bAngle) * 95;

          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(hx, hy); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.stroke();
          ctx.beginPath(); ctx.arc(hx, hy, 20, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 11px "Space Grotesk", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('H', hx, hy + 4);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('C', 0, 4);
      }

      ctx.restore();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${current.name} • ${current.geometry}`, cx, cy + 155);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [molecule]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Molecule Selector Chips */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
        {Object.keys(moleculeData).map((mKey) => (
          <button
            key={mKey}
            onClick={() => setMolecule(mKey)}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              background: molecule === mKey ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--bg-secondary)',
              color: molecule === mKey ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            🧪 {moleculeData[mKey].name}
          </button>
        ))}
      </div>

      {/* Main Canvas Viewport */}
      <div className="canvas-container" style={{ height: '400px', borderRadius: 'var(--radius-xl)' }}>
        <canvas ref={canvasRef} width={850} height={400} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Molecule Data Sheet */}
      <div style={{ background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
        <h4 style={{ fontWeight: 700, marginBottom: '6px', color: '#38bdf8' }}>{current.name} Specs</h4>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{current.desc}</p>
        <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          <span>Geometry: <strong style={{ color: '#ffffff' }}>{current.geometry}</strong></span>
          <span>Bond Type: <strong style={{ color: '#10b981' }}>{current.bonds}</strong></span>
        </div>
      </div>
    </div>
  );
};
