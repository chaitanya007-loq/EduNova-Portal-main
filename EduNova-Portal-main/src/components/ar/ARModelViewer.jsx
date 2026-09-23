import React, { useState, useEffect, useRef } from 'react';

export const ARModelViewer = ({
  activeObjectData,
  transform = { rotX: 0, rotY: 0, scale: 1 },
  activeHotspot
}) => {
  const canvasRef = useRef(null);
  const customImgRef = useRef(null);

  // Preload custom image if present
  useEffect(() => {
    if (activeObjectData && activeObjectData.isCustomUpload && activeObjectData.customImage) {
      const img = new Image();
      img.src = activeObjectData.customImage;
      img.onload = () => {
        customImgRef.current = img;
      };
    } else {
      customImgRef.current = null;
    }
  }, [activeObjectData]);

  // Render 360° Volumetric 3D Canvas visual representation from all angles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const targetW = parent?.clientWidth || 720;
    const targetH = parent?.clientHeight || 450;
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const width = canvas.width;
    const height = canvas.height;

    const ctx = canvas.getContext('2d');
    let animId;
    let autoAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      autoAngle += 0.012;

      const cx = width / 2;
      const cy = height / 2;
      const currentScale = transform.scale;

      // Combine user drag rotation + auto orbit angle (0° to 360° full yaw)
      const yawDegrees = (transform.rotY + autoAngle * (180 / Math.PI)) % 360;
      const yawRad = (yawDegrees * Math.PI) / 180;
      const pitchRad = ((transform.rotX || 0) * Math.PI) / 180;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(currentScale, currentScale);

      // --- CUSTOM UPLOADED 360° VOLUMETRIC 3D SPATIAL MODEL ---
      if (activeObjectData && activeObjectData.isCustomUpload && customImgRef.current) {
        const img = customImgRef.current;
        const aspect = img.width / img.height;
        const targetH = 190;
        const targetW = targetH * aspect;
        const depthExtrusion = 45;

        const cosYaw = Math.cos(yawRad);
        const sinYaw = Math.sin(yawRad);
        const sinPitch = Math.sin(pitchRad);

        const shadowScaleX = targetW / 2 + Math.abs(sinYaw) * depthExtrusion * 0.8;
        ctx.beginPath();
        ctx.ellipse(0, targetH / 2 + 15, Math.max(30, shadowScaleX), 18, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.22)';
        ctx.shadowBlur = 25; ctx.shadowColor = '#06b6d4';
        ctx.fill(); ctx.shadowBlur = 0;

        const numLayers = 14;
        ctx.save();
        ctx.transform(1, 0, 0, 1 + sinPitch * 0.3, 0, sinPitch * 20);

        for (let l = numLayers; l >= 1; l--) {
          const offsetX = Math.sign(sinYaw) * l * (Math.abs(sinYaw) * depthExtrusion / numLayers);
          const offsetY = l * 0.5;

          ctx.save();
          ctx.translate(offsetX * 0.6, offsetY * 0.3);
          ctx.scale(cosYaw, 1);

          ctx.strokeStyle = `rgba(6, 182, 212, ${0.1 + (l / numLayers) * 0.25})`;
          ctx.lineWidth = 2;
          ctx.strokeRect(-targetW / 2, -targetH / 2, targetW, targetH);
          ctx.restore();
        }

        ctx.save();
        ctx.scale(cosYaw, 1);

        if (cosYaw >= 0) {
          ctx.shadowBlur = 35;
          ctx.shadowColor = '#06b6d4';
          ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
          ctx.shadowBlur = 0;

          const lightGrad = ctx.createLinearGradient(-targetW / 2, -targetH / 2, targetW / 2, targetH / 2);
          lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
          lightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
          lightGrad.addColorStop(1, 'rgba(6, 182, 212, 0.15)');
          ctx.fillStyle = lightGrad;
          ctx.fillRect(-targetW / 2, -targetH / 2, targetW, targetH);
        } else {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.shadowBlur = 30;
          ctx.shadowColor = '#a855f7';
          ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
          ctx.shadowBlur = 0;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
          ctx.fillRect(-targetW / 2, -targetH / 2, targetW, targetH);

          ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-targetW / 2, -targetH / 2, targetW, targetH);
          ctx.restore();
        }

        ctx.restore();
        ctx.restore();

        const currentYawDeg = Math.round((yawDegrees + 360) % 360);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`3D VOLUMETRIC ANGLE: YAW ${currentYawDeg}° | PITCH ${Math.round(transform.rotX || 0)}°`, 0, targetH / 2 + 42);
      }

      // --- BUILT-IN 3D MODELS ---
      else {
        const objectId = activeObjectData ? (activeObjectData.id || activeObjectData.name || '').toLowerCase() : 'human-heart';
        const cosY = Math.cos(yawRad);
        const sinP = Math.sin(pitchRad);

        // 1. HUMAN HEART 3D MODEL
        if (objectId.includes('heart')) {
          ctx.save();
          ctx.transform(cosY, sinP * 0.15, 0, 1 + sinP * 0.1, 0, 0);

          ctx.beginPath();
          ctx.arc(0, -10, 85, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
          ctx.shadowBlur = 30; ctx.shadowColor = '#f43f5e';
          ctx.fill(); ctx.shadowBlur = 0;

          // Aorta Arch
          ctx.beginPath();
          ctx.arc(0, -65, 45, Math.PI * 0.8, Math.PI * 1.9);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 22;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Main Muscle Body
          const heartGrad = ctx.createRadialGradient(-20, -20, 10, 0, 0, 90);
          heartGrad.addColorStop(0, '#fb7185');
          heartGrad.addColorStop(0.5, '#e11d48');
          heartGrad.addColorStop(1, '#881337');

          ctx.beginPath();
          ctx.moveTo(0, -35);
          ctx.bezierCurveTo(-70, -90, -120, 20, 0, 95);
          ctx.bezierCurveTo(120, 20, 70, -90, 0, -35);
          ctx.closePath();
          ctx.fillStyle = heartGrad;
          ctx.shadowBlur = 20; ctx.shadowColor = '#e11d48';
          ctx.fill(); ctx.shadowBlur = 0;

          ctx.restore();
        }

        // 2. 3D BINARY SEARCH TREE & AVL ROTATIONS
        else if (objectId.includes('tree') || objectId.includes('bst')) {
          ctx.save();
          ctx.transform(cosY * 0.95 + 0.05, sinP * 0.1, 0, 1 + sinP * 0.05, 0, 0);

          const nodes = [
            { val: 50, x: 0, y: -125, color: '#06b6d4' },
            { val: 25, x: -125, y: -35, color: '#38bdf8' },
            { val: 75, x: 125, y: -35, color: '#a855f7' },
            { val: 12, x: -175, y: 55, color: '#10b981' },
            { val: 37, x: -75, y: 55, color: '#10b981' },
            { val: 62, x: 75, y: 55, color: '#f59e0b' },
            { val: 87, x: 175, y: 55, color: '#f59e0b' }
          ];

          // Draw Connecting Edges
          ctx.beginPath();
          ctx.moveTo(0, -125); ctx.lineTo(-125, -35);
          ctx.moveTo(0, -125); ctx.lineTo(125, -35);
          ctx.moveTo(-125, -35); ctx.lineTo(-175, 55);
          ctx.moveTo(-125, -35); ctx.lineTo(-75, 55);
          ctx.moveTo(125, -35); ctx.lineTo(75, 55);
          ctx.moveTo(125, -35); ctx.lineTo(175, 55);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3.5;
          ctx.shadowBlur = 10; ctx.shadowColor = '#38bdf8';
          ctx.stroke(); ctx.shadowBlur = 0;

          // Render Nodes
          nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 20, 0, Math.PI * 2);
            ctx.fillStyle = n.color;
            ctx.shadowBlur = 12; ctx.shadowColor = n.color;
            ctx.fill(); ctx.shadowBlur = 0; // Immediate reset!

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(n.val.toString(), n.x, n.y + 4);
          });

          ctx.restore();
        }

        // 3. DATABASE RELATIONAL B-TREE INDEX
        else if (objectId.includes('btree') || objectId.includes('dbms')) {
          ctx.save();
          ctx.transform(cosY, sinP * 0.1, 0, 1 + sinP * 0.05, 0, 0);

          // Root Index Block
          ctx.fillStyle = 'rgba(168, 85, 247, 0.7)';
          ctx.shadowBlur = 15; ctx.shadowColor = '#a855f7';
          ctx.fillRect(-100, -110, 200, 42);
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(-100, -110, 200, 42);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 13px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Root Page [10 | 50 | 90]', 0, -84);

          // Pointer Lines
          ctx.beginPath();
          ctx.moveTo(0, -68); ctx.lineTo(-150, 10);
          ctx.moveTo(0, -68); ctx.lineTo(-50, 10);
          ctx.moveTo(0, -68); ctx.lineTo(50, 10);
          ctx.moveTo(0, -68); ctx.lineTo(150, 10);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = 10; ctx.shadowColor = '#38bdf8';
          ctx.stroke(); ctx.shadowBlur = 0;

          // Leaf Data Pages
          const leafX = [-150, -50, 50, 150];
          leafX.forEach((lx, i) => {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
            ctx.shadowBlur = 12; ctx.shadowColor = '#10b981';
            ctx.fillRect(lx - 38, 10, 76, 48);
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.strokeRect(lx - 38, 10, 76, 48);

            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillText(`Page ${i + 1}`, lx, 38);
          });

          ctx.restore();
        }

        // 4. RISC CPU SUPERSCALAR PIPELINE 3D
        else if (objectId.includes('cpu') || objectId.includes('pipeline')) {
          ctx.save();
          ctx.transform(cosY, sinP * 0.1, 0, 1 + sinP * 0.05, 0, 0);

          const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];
          const boxW = 55;
          const startX = -((stages.length * (boxW + 10)) / 2);

          stages.forEach((st, idx) => {
            const x = startX + idx * (boxW + 10);
            ctx.fillStyle = idx === 2 ? 'rgba(99, 102, 241, 0.85)' : 'rgba(30, 41, 59, 0.9)';
            ctx.shadowBlur = 12; ctx.shadowColor = idx === 2 ? '#38bdf8' : '#6366f1';
            ctx.fillRect(x, -50, boxW, 55);
            ctx.shadowBlur = 0;
            ctx.strokeStyle = idx === 2 ? '#38bdf8' : 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(x, -50, boxW, 55);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(st, x + boxW / 2, -18);
          });

          // ALU Block
          ctx.fillStyle = '#f59e0b';
          ctx.shadowBlur = 15; ctx.shadowColor = '#f59e0b';
          ctx.fillRect(-60, 30, 120, 40);
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(-60, 30, 120, 40);

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 13px Inter, sans-serif';
          ctx.fillText('ALU Core', 0, 54);

          ctx.restore();
        }

        // 5. MICROSERVICES & API GATEWAY
        else if (objectId.includes('microservices') || objectId.includes('gateway') || objectId.includes('system')) {
          ctx.save();
          ctx.transform(cosY, sinP * 0.1, 0, 1 + sinP * 0.05, 0, 0);

          ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
          ctx.shadowBlur = 15; ctx.shadowColor = '#06b6d4';
          ctx.fillRect(-160, -40, 75, 75);
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(-160, -40, 75, 75);

          ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
          ctx.shadowBlur = 15; ctx.shadowColor = '#6366f1';
          ctx.fillRect(-40, -40, 75, 75);
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(-40, -40, 75, 75);

          ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
          ctx.shadowBlur = 15; ctx.shadowColor = '#10b981';
          ctx.fillRect(80, -65, 85, 50);
          ctx.fillRect(80, 15, 85, 50);
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(80, -65, 85, 50);
          ctx.strokeRect(80, 15, 85, 50);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('NGINX LB', -122, 2);
          ctx.fillText('API Gateway', -2, 2);
          ctx.fillText('Redis Cache', 122, -35);
          ctx.fillText('Auth Service', 122, 45);

          ctx.beginPath();
          ctx.moveTo(-85, 0); ctx.lineTo(-40, 0);
          ctx.moveTo(35, 0); ctx.lineTo(80, -40);
          ctx.moveTo(35, 0); ctx.lineTo(80, 40);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.restore();
        }

        // 6. HUMAN BRAIN 3D MODEL
        else if (objectId.includes('brain')) {
          ctx.save();
          ctx.transform(cosY, sinP * 0.15, 0, 1 + sinP * 0.1, 0, 0);

          ctx.beginPath();
          ctx.arc(0, 0, 90, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
          ctx.shadowBlur = 35; ctx.shadowColor = '#a855f7';
          ctx.fill(); ctx.shadowBlur = 0;

          ctx.fillStyle = '#c084fc';
          ctx.beginPath(); ctx.ellipse(-35, -15, 55, 75, -0.2, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(35, -15, 55, 75, 0.2, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = '#7e22ce';
          ctx.beginPath(); ctx.ellipse(0, 50, 45, 30, 0, 0, Math.PI * 2); ctx.fill();

          ctx.restore();
        }

        // 7. ATOM MODEL
        else if (objectId.includes('atom')) {
          ctx.save();
          ctx.transform(cosY, sinP * 0.15, 0, 1 + sinP * 0.1, 0, 0);

          ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.shadowBlur = 25; ctx.shadowColor = '#f59e0b';
          ctx.fill(); ctx.shadowBlur = 0;

          for (let i = 0; i < 3; i++) {
            const rAngle = (yawRad) + (i * Math.PI / 3);
            ctx.save();
            ctx.rotate(rAngle);
            ctx.beginPath(); ctx.ellipse(0, 0, 120, 45, 0, 0, Math.PI * 2);
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5; ctx.stroke();

            const ex = Math.cos(autoAngle * 2.5) * 120;
            const ey = Math.sin(autoAngle * 2.5) * 45;
            ctx.beginPath(); ctx.arc(ex, ey, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff'; ctx.fill();
            ctx.restore();
          }

          ctx.restore();
        }

        // 8. CONVEX LENS & OPTICS
        else if (objectId.includes('lens') || objectId.includes('optics')) {
          ctx.save();
          ctx.transform(cosY, sinP * 0.15, 0, 1 + sinP * 0.1, 0, 0);

          ctx.beginPath();
          ctx.ellipse(0, 0, 28, 100, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
          ctx.shadowBlur = 20; ctx.shadowColor = '#38bdf8';
          ctx.fill(); ctx.shadowBlur = 0;
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-150, -60); ctx.lineTo(0, -60); ctx.lineTo(120, 0);
          ctx.moveTo(-150, 60); ctx.lineTo(0, 60); ctx.lineTo(120, 0);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.beginPath(); ctx.arc(120, 0, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff'; ctx.fill();

          ctx.restore();
        }

        // 9. DEFAULT SPATIAL HOLOGRAM SPHERE WITH ORBITAL RINGS
        else {
          ctx.save();
          ctx.transform(cosY, sinP * 0.15, 0, 1 + sinP * 0.1, 0, 0);

          ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
          ctx.shadowBlur = 25; ctx.shadowColor = '#06b6d4';
          ctx.fill(); ctx.shadowBlur = 0;
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, 110, 35, autoAngle, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.restore();
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeObjectData, transform]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        width={720}
        height={450}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      />
    </div>
  );
};

export default ARModelViewer;
