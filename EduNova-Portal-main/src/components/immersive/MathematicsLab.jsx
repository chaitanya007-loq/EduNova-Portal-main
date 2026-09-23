import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, FunctionSquare, Compass, BarChart2, Activity } from 'lucide-react';
import '../../styles/glassmorphism.css';

const PRESET_FUNCTIONS = [
  { id: 'sine', name: 'f(x) = sin(x)', formula: (x) => Math.sin(x), derivative: (x) => Math.cos(x), desc: 'Trigonometric sine wave oscillating between -1 and +1' },
  { id: 'quadratic', name: 'f(x) = 0.5x² - 2', formula: (x) => 0.5 * x * x - 2, derivative: (x) => x, desc: 'Parabolic quadratic curve with minimum at (0, -2)' },
  { id: 'cubic', name: 'f(x) = 0.1x³ - x', formula: (x) => 0.1 * Math.pow(x, 3) - x, derivative: (x) => 0.3 * x * x - 1, desc: 'Cubic polynomial showing local maximum and minimum points' },
  { id: 'gaussian', name: 'f(x) = 3e^(-x²)', formula: (x) => 3 * Math.exp(-x * x), derivative: (x) => -6 * x * Math.exp(-x * x), desc: 'Gaussian bell curve representing normal probability distribution' }
];

const MathematicsLab = () => {
  const canvasRef = useRef(null);
  const [selectedFunc, setSelectedFunc] = useState(PRESET_FUNCTIONS[0]);
  const [tangentX, setTangentX] = useState(1.0);
  const [showTangent, setShowTangent] = useState(true);
  const [showIntegral, setShowIntegral] = useState(false);
  const [integralRange, setIntegralRange] = useState({ a: -2.0, b: 2.0 });
  const [gridScale, setGridScale] = useState(40); // pixels per math unit
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation loop for dynamic tangent sliding
  useEffect(() => {
    let animFrame;
    if (isAnimating) {
      let step = 0.05;
      animFrame = requestAnimationFrame(function animate() {
        setTangentX(prev => {
          let next = prev + step;
          if (next > 4.5 || next < -4.5) {
            step = -step;
          }
          return next;
        });
        animFrame = requestAnimationFrame(animate);
      });
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isAnimating]);

  // Render plot on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#080d19';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid lines & axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let x = originX % gridScale; x < width; x += gridScale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = originY % gridScale; y < height; y += gridScale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Main Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    // X axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    // Y axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis labels & Ticks
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    for (let x = -10; x <= 10; x += 1) {
      if (x === 0) continue;
      const px = originX + x * gridScale;
      if (px > 0 && px < width) {
        ctx.fillText(x.toString(), px - 5, originY + 16);
      }
    }
    for (let y = -10; y <= 10; y += 1) {
      if (y === 0) continue;
      const py = originY - y * gridScale;
      if (py > 0 && py < height) {
        ctx.fillText(y.toString(), originX + 8, py + 4);
      }
    }

    // Helper functions for math -> screen coords conversion
    const toPxX = (x) => originX + x * gridScale;
    const toPxY = (y) => originY - y * gridScale;

    // Draw Integral Area Shading if enabled
    if (showIntegral) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.beginPath();
      const startPx = toPxX(integralRange.a);
      const endPx = toPxX(integralRange.b);
      ctx.moveTo(startPx, originY);

      for (let px = startPx; px <= endPx; px += 2) {
        const mathX = (px - originX) / gridScale;
        const mathY = selectedFunc.formula(mathX);
        const py = toPxY(mathY);
        ctx.lineTo(px, py);
      }

      ctx.lineTo(endPx, originY);
      ctx.closePath();
      ctx.fill();

      // Border lines for integral region
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(startPx, originY);
      ctx.lineTo(startPx, toPxY(selectedFunc.formula(integralRange.a)));
      ctx.moveTo(endPx, originY);
      ctx.lineTo(endPx, toPxY(selectedFunc.formula(integralRange.b)));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Main Function Curve f(x)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;

    for (let px = 0; px <= width; px += 2) {
      const mathX = (px - originX) / gridScale;
      const mathY = selectedFunc.formula(mathX);
      const py = toPxY(mathY);

      if (py >= -100 && py <= height + 100) {
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();

    // Draw Tangent Line at x = tangentX if enabled
    if (showTangent) {
      const yVal = selectedFunc.formula(tangentX);
      const slope = selectedFunc.derivative(tangentX);

      // Point on curve
      const ptX = toPxX(tangentX);
      const ptY = toPxY(yVal);

      // Tangent line end points (extending 3 math units in each direction)
      const x1 = tangentX - 3;
      const y1 = yVal - slope * 3;
      const x2 = tangentX + 3;
      const y2 = yVal + slope * 3;

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(toPxX(x1), toPxY(y1));
      ctx.lineTo(toPxX(x2), toPxY(y2));
      ctx.stroke();

      // Draw tangent point glow & dot
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(ptX, ptY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset glow

      // Slope triangle indicator
      const dxMath = 1.0;
      const dyMath = slope;
      const dxPx = dxMath * gridScale;
      const dyPx = -dyMath * gridScale;

      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(ptX, ptY);
      ctx.lineTo(ptX + dxPx, ptY);
      ctx.lineTo(ptX + dxPx, ptY + dyPx);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [selectedFunc, tangentX, showTangent, showIntegral, integralRange, gridScale]);

  // Numerical integration estimate (Trapezoidal Rule)
  const calculateIntegralArea = () => {
    const n = 100;
    const h = (integralRange.b - integralRange.a) / n;
    let sum = 0.5 * (selectedFunc.formula(integralRange.a) + selectedFunc.formula(integralRange.b));
    for (let i = 1; i < n; i++) {
      sum += selectedFunc.formula(integralRange.a + i * h);
    }
    return (sum * h).toFixed(3);
  };

  const currentSlope = selectedFunc.derivative(tangentX).toFixed(3);
  const currentY = selectedFunc.formula(tangentX).toFixed(3);

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden text-white border border-cyan-500/20 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FunctionSquare className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Calculus & Function Dynamics Lab
            </h2>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Real-time derivative tangent vectors, instantaneous rate of change & definite integration bounds.
          </p>
        </div>

        {/* Function Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_FUNCTIONS.map(fn => (
            <button
              key={fn.id}
              onClick={() => setSelectedFunc(fn)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFunc.id === fn.id
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400'
                  : 'bg-slate-800/60 text-gray-400 border border-slate-700 hover:text-white'
              }`}
            >
              {fn.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Canvas Display */}
        <div className="lg:col-span-3 bg-slate-950/80 rounded-xl p-4 border border-cyan-500/10 flex flex-col items-center justify-center relative">
          <canvas
            ref={canvasRef}
            width={720}
            height={420}
            className="w-full h-auto max-h-[440px] rounded-lg cursor-crosshair border border-slate-800"
          />

          {/* Floating Canvas Overlay Legend */}
          <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-800 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
              <span className="text-gray-300 font-mono">{selectedFunc.name}</span>
            </div>
            {showTangent && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-rose-500 inline-block"></span>
                <span className="text-rose-400 font-mono">Tangent m = dy/dx = {currentSlope}</span>
              </div>
            )}
            {showIntegral && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500/30 border border-blue-400 inline-block rounded-xs"></span>
                <span className="text-blue-300 font-mono">Area ∫ = {calculateIntegralArea()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Math Telemetry & Controls Panel */}
        <div className="space-y-4">
          {/* Active Function Card */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-cyan-500/20">
            <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
              <Compass className="w-4 h-4" /> Selected Model
            </h3>
            <p className="text-xs text-gray-300 mt-2 font-mono bg-slate-950 p-2 rounded border border-slate-800">
              {selectedFunc.desc}
            </p>
          </div>

          {/* Calculus Controls */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-400" /> Tangent Line (Derivative)
              </span>
              <input
                type="checkbox"
                checked={showTangent}
                onChange={(e) => setShowTangent(e.target.checked)}
                className="accent-rose-500 cursor-pointer w-4 h-4"
              />
            </div>

            {showTangent && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <span>Evaluation Point x:</span>
                  <span className="text-rose-400 font-bold">{tangentX.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-4.5"
                  max="4.5"
                  step="0.05"
                  value={tangentX}
                  onChange={(e) => setTangentX(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />

                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isAnimating
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                  }`}
                >
                  {isAnimating ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  {isAnimating ? 'Pause Sweep' : 'Auto-Sweep Tangent'}
                </button>

                {/* Derivatives Readout */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Position y = f({tangentX.toFixed(2)}):</span>
                    <span className="text-cyan-300">{currentY}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Slope f'({tangentX.toFixed(2)}):</span>
                    <span className="text-rose-400">{currentSlope}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Definite Integration Panel */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-blue-400" /> Area Integration ∫ f(x)dx
              </span>
              <input
                type="checkbox"
                checked={showIntegral}
                onChange={(e) => setShowIntegral(e.target.checked)}
                className="accent-blue-500 cursor-pointer w-4 h-4"
              />
            </div>

            {showIntegral && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div>
                    <label className="text-gray-400 block mb-1">Lower Bound a:</label>
                    <input
                      type="number"
                      step="0.5"
                      value={integralRange.a}
                      onChange={(e) => setIntegralRange({ ...integralRange, a: parseFloat(e.target.value) || -2 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-center text-blue-300"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Upper Bound b:</label>
                    <input
                      type="number"
                      step="0.5"
                      value={integralRange.b}
                      onChange={(e) => setIntegralRange({ ...integralRange, b: parseFloat(e.target.value) || 2 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-center text-blue-300"
                    />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-lg text-center font-mono">
                  <div className="text-gray-400 text-[11px]">Definite Integral Area:</div>
                  <div className="text-blue-400 text-base font-bold mt-0.5">{calculateIntegralArea()}</div>
                </div>
              </div>
            )}
          </div>

          {/* Grid Scale Zoom */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-gray-400">Grid Scale (px/unit):</span>
            <input
              type="range"
              min="20"
              max="70"
              value={gridScale}
              onChange={(e) => setGridScale(parseInt(e.target.value))}
              className="w-24 accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathematicsLab;
