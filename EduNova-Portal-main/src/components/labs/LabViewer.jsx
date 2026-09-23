import React, { useState, useEffect, useRef } from 'react';
import {
  X, Play, RotateCcw, Sparkles, BookOpen, Sliders, Activity, HelpCircle,
  CheckCircle2, Box, Save, Bot, FileText, ChevronRight, ChevronLeft, ArrowLeft,
  Zap, Award, Info, Code, Database, Server, Layers, Cpu, Compass
} from 'lucide-react';
import { getSubjectTheme } from '../../services/labService';
import {
  calculateProjectileState,
  calculateOpticsState,
  calculateCircuitState,
  generateSortingSteps,
  calculateCPUScheduling,
  simulateAPIRequest,
  calculateTitrationState,
  calculateHeartState,
  calculateCalculusState,
  calculateTreeState,
  calculateDBMSState,
  calculateNeuralNetState
} from '../../services/labSimulationService';
import { recordLabAttempt } from '../../services/labProgressService';
import SageAILabMentor from './SageAILabMentor';
import Lab3DViewer from './Lab3DViewer';

// Import specialized interactive simulator components for full 3D/visual fallback
import { GravitySimulator } from '../immersive/GravitySimulator';
import { ChemistryLab } from '../immersive/ChemistryLab';
import { BiologyDiagrams } from '../immersive/BiologyDiagrams';
import MathematicsLab from '../immersive/MathematicsLab';
import { MechanicalLab } from '../immersive/MechanicalLab';
import { AncientHistorySim } from '../immersive/AncientHistorySim';
import { AlgorithmVisualizer } from '../immersive/AlgorithmVisualizer';

export const LabViewer = ({ lab, onClose, onAttemptRecorded }) => {
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | '3d' | 'mentor' | 'full_interactive'
  const [mode, setMode] = useState('sandbox'); // 'sandbox' | 'guided'

  // Dynamic Parameter States tailored to the specific lab
  const [param1, setParam1] = useState(
    lab?.simType === 'physics_optics' ? 15 :
    lab?.simType === 'physics_circuit' ? 10 :
    lab?.simType === 'chemistry_titration' ? 18 :
    lab?.simType === 'biology_3d_heart' ? 72 :
    lab?.simType === 'math_calculus' ? 2 :
    lab?.simType?.includes('tree') ? 9 :
    lab?.simType?.includes('sorting') ? 8 :
    lab?.simType?.includes('dbms') ? 3000 : 30
  );
  const [param2, setParam2] = useState(
    lab?.simType === 'physics_optics' ? 30 :
    lab?.simType === 'physics_circuit' ? 12 :
    lab?.simType === 'chemistry_titration' ? 0.5 :
    lab?.simType === 'biology_3d_heart' ? 70 :
    lab?.simType?.includes('tree') ? 98 :
    lab?.simType?.includes('dbms') ? 3 : 45
  );
  const [userPrediction, setUserPrediction] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const theme = getSubjectTheme(lab?.subject);
  const canvasRef = useRef(null);

  // Dedicated Parameter Labels, Ranges, and Governing Formulas for EVERY lab topic
  const getParamConfig = () => {
    const st = lab?.simType || '';
    if (st.includes('projectile')) {
      return {
        p1Label: 'Launch Velocity v₀ (m/s)', p1Min: 5, p1Max: 100,
        p2Label: 'Launch Angle θ (°)', p2Min: 5, p2Max: 85,
        formula: 'Range R = (v₀² · sin(2θ)) / g  |  Max Height H = (v₀ · sin(θ))² / (2g)'
      };
    } else if (st.includes('optics')) {
      return {
        p1Label: 'Focal Length f (cm)', p1Min: 5, p1Max: 40,
        p2Label: 'Object Distance u (cm)', p2Min: 10, p2Max: 80,
        formula: 'Lens Formula: 1/f = 1/v - 1/u  |  Magnification m = v / u'
      };
    } else if (st.includes('circuit')) {
      return {
        p1Label: 'Resistance R1 (Ω)', p1Min: 1, p1Max: 100,
        p2Label: 'Supply Voltage V (Volts)', p2Min: 1, p2Max: 48,
        formula: 'Ohm’s Law: V = I · R  |  Current I = V / (R1 + R2)  |  Power P = V · I'
      };
    } else if (st.includes('titration')) {
      return {
        p1Label: 'Titrant NaOH Volume (mL)', p1Min: 1, p1Max: 40,
        p2Label: 'Acid HCl Molarity (M)', p1Min: 0.1, p2Max: 2.0,
        formula: 'Volumetric Analysis: N₁V₁ = N₂V₂  |  pH Inflection Point at Equivalence'
      };
    } else if (st.includes('heart')) {
      return {
        p1Label: 'Heart Rate (BPM)', p1Min: 40, p1Max: 180,
        p2Label: 'Stroke Volume (mL)', p2Min: 30, p2Max: 120,
        formula: 'Cardiac Output (L/min) = Heart Rate × Stroke Volume / 1000'
      };
    } else if (st.includes('calculus')) {
      return {
        p1Label: 'Tangent Evaluation Point x', p1Min: -5, p1Max: 5,
        p2Label: 'Delta Step Δx', p1Min: 0.01, p2Max: 2.0,
        formula: 'Derivative dy/dx = lim(Δx→0) [f(x+Δx) - f(x)] / Δx  |  Tangent Line Slope'
      };
    } else if (st.includes('tree')) {
      return {
        p1Label: 'Tree Nodes Count N', p1Min: 3, p1Max: 15,
        p2Label: 'Insert Key Value K', p2Min: 10, p2Max: 99,
        formula: 'AVL Tree Height H = ⌈log₂(N+1)⌉  |  Balance Factor = Height(Left) - Height(Right)'
      };
    } else if (st.includes('sorting')) {
      return {
        p1Label: 'Array Size (N Elements)', p1Min: 4, p1Max: 16,
        p2Label: 'Animation Speed Delay (ms)', p2Min: 10, p2Max: 100,
        formula: 'Complexity Benchmark: QuickSort O(N log N) vs BubbleSort O(N²)'
      };
    } else if (st.includes('cpu')) {
      return {
        p1Label: 'Process P1 Burst Time (ms)', p1Min: 2, p1Max: 25,
        p2Label: 'Process P2 Burst Time (ms)', p2Min: 2, p2Max: 25,
        formula: 'Gantt Schedule: Turnaround = Completion - Arrival  |  Waiting = Turnaround - Burst'
      };
    } else if (st.includes('dbms')) {
      return {
        p1Label: 'Table Record Count N', p1Min: 500, p1Max: 10000,
        p2Label: 'B-Tree Index Depth', p1Min: 1, p2Max: 5,
        formula: 'Query Cost: Seq Scan O(N) vs B-Tree Index Scan O(log N + Depth)'
      };
    } else if (st.includes('network') || st.includes('packet')) {
      return {
        p1Label: 'Packet Payload Size (Bytes)', p1Min: 64, p1Max: 1500,
        p2Label: 'Network Subnet / TTL', p2Min: 8, p2Max: 30,
        formula: 'TCP 3-Way Handshake: SYN → SYN-ACK → ACK  |  CIDR Subnetting'
      };
    } else if (st.includes('engine') || st.includes('mech')) {
      return {
        p1Label: 'Engine Speed (RPM)', p1Min: 800, p1Max: 7000,
        p2Label: 'Compression Ratio', p2Min: 8, p2Max: 14,
        formula: 'Otto Cycle Efficiency: η = 1 - (1 / r^(γ-1))  |  P-V Diagram'
      };
    } else if (st.includes('api')) {
      return {
        p1Label: 'Payload Data Size (KB)', p1Min: 1, p1Max: 100,
        p2Label: 'Network Latency Delay (ms)', p2Min: 10, p2Max: 500,
        formula: 'HTTP Protocol: Client Request → Router → Auth Middleware → Controller → 200 OK'
      };
    } else if (st.includes('ai') || st.includes('playground')) {
      return {
        p1Label: 'Learning Rate α', p1Min: 0.01, p1Max: 0.5,
        p2Label: 'Training Epochs Count', p2Min: 1, p2Max: 50,
        formula: 'Gradient Descent: W = W - α · ∇L(W)  |  Loss Minimization'
      };
    } else {
      return {
        p1Label: 'Primary Parameter 1', p1Min: 5, p1Max: 100,
        p2Label: 'Secondary Parameter 2', p2Min: 5, p2Max: 100,
        formula: 'Dynamic Simulation Parametric Optimization Model'
      };
    }
  };

  const paramConfig = getParamConfig();

  // Derive Specialized Simulation Outputs for EVERY lab
  const getSimState = () => {
    const st = lab?.simType || '';
    if (st.includes('projectile')) {
      return calculateProjectileState({ velocity: param1, angle: param2, gravity: 9.8, airResistance: 0 });
    } else if (st.includes('optics')) {
      return calculateOpticsState({ focalLength: param1, objectDistance: param2, objectHeight: 5 });
    } else if (st.includes('circuit')) {
      return calculateCircuitState({ voltage: param2, resistance1: param1, resistance2: 20, circuitType: 'series' });
    } else if (st.includes('titration')) {
      return calculateTitrationState({ titrantVolume: param1, molarity: param2 });
    } else if (st.includes('heart')) {
      return calculateHeartState({ heartRate: param1, strokeVolume: param2 });
    } else if (st.includes('calculus')) {
      return calculateCalculusState({ pointX: param1, stepDx: param2 });
    } else if (st.includes('tree')) {
      return calculateTreeState({ nodeCount: Math.max(3, Math.floor(param1)), insertVal: param2 });
    } else if (st.includes('sorting')) {
      return generateSortingSteps([45, 12, 89, 34, 67, 23, 90, 56, 18, 77, 61, 95, 30, 82, 40, 68].slice(0, Math.min(16, Math.max(4, Math.floor(param1)))));
    } else if (st.includes('cpu')) {
      return calculateCPUScheduling([
        { id: 'P1', arrival: 0, burst: Math.max(2, Math.floor(param1)), priority: 2 },
        { id: 'P2', arrival: 1, burst: Math.max(2, Math.floor(param2)), priority: 1 },
        { id: 'P3', arrival: 2, burst: 8, priority: 3 }
      ]);
    } else if (st.includes('dbms')) {
      return calculateDBMSState({ recordCount: param1, indexDepth: Math.max(1, Math.floor(param2)) });
    } else if (st.includes('api')) {
      return simulateAPIRequest({ method: param1 > 50 ? 'POST' : 'GET', endpoint: '/api/v1/students', payload: { name: 'Aarav', branch: 'CSE' } });
    } else if (st.includes('ai') || st.includes('playground')) {
      return calculateNeuralNetState({ learningRate: param1 / 100, epochs: Math.max(1, Math.floor(param2)) });
    } else {
      return calculateProjectileState({ velocity: param1, angle: param2 });
    }
  };

  const simState = getSimState();

  // Render 100% Dynamic Canvas Graphics Tailor-Made for Every Lab Topic
  useEffect(() => {
    if (activeTab !== 'simulation') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 340);

    ctx.clearRect(0, 0, width, height);

    const st = lab?.simType || '';

    if (st.includes('projectile')) {
      // 1. Dynamic Physics Trajectory
      const points = simState.points || [];
      const scaleX = width / Math.max(80, simState.maxRange * 1.15);
      const scaleY = height / Math.max(40, simState.maxHeight * 1.5);

      ctx.beginPath();
      ctx.moveTo(0, height - 30);
      ctx.lineTo(width, height - 30);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      points.forEach((p, idx) => {
        const cx = p.x * scaleX;
        const cy = height - 30 - p.y * scaleY;
        if (idx === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      const midPoint = points[Math.floor(points.length / 2)];
      if (midPoint) {
        ctx.beginPath();
        ctx.arc(midPoint.x * scaleX, height - 30 - midPoint.y * scaleY, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#a855f7';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

    } else if (st.includes('optics')) {
      // 2. Dynamic Physics Lens Optics
      const cx = width / 2;
      const cy = height / 2;

      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy - 90);
      ctx.lineTo(cx, cy + 90);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 5;
      ctx.stroke();

      const objX = cx - param2 * 3.5;
      ctx.beginPath();
      ctx.moveTo(objX, cy);
      ctx.lineTo(objX, cy - 50);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(objX, cy - 50, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();

      // Refracted Rays
      const focalX = cx + param1 * 3.5;
      ctx.beginPath();
      ctx.moveTo(objX, cy - 50);
      ctx.lineTo(cx, cy - 50);
      ctx.lineTo(focalX + 100, cy + 50);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (typeof simState.imageDistance === 'number' && simState.imageDistance > 0) {
        const imgX = cx + simState.imageDistance * 3.5;
        const imgH = 50 * (simState.magnification || 1);
        ctx.beginPath();
        ctx.moveTo(imgX, cy);
        ctx.lineTo(imgX, cy - imgH);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }

    } else if (st.includes('circuit')) {
      // 3. Dynamic DC Circuit Schematic
      const cx = width / 2;
      const cy = height / 2;

      ctx.beginPath();
      ctx.rect(60, 40, width - 120, height - 80);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#050814';
      ctx.fillRect(cx - 40, 30, 80, 20);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cx - 40, 30, 80, 20);

      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`R1 = ${param1} Ω`, cx - 30, 45);

      ctx.fillStyle = '#10b981';
      ctx.fillText(`Current I = ${simState.totalCurrent || 0} A`, cx - 40, cy);
      ctx.fillText(`Power P = ${simState.power || 0} W`, cx - 40, cy + 20);

    } else if (st.includes('tree')) {
      // 4. ACCURATE & DYNAMIC BINARY SEARCH TREE / AVL GRAPH
      // Responds dynamically to param1 (Tree Nodes Count N) & param2 (Search / Insert Key K)
      const targetCount = Math.min(15, Math.max(3, Math.floor(param1)));
      const targetKey = Math.floor(param2);

      const cx = width / 2;

      // Master candidate tree topology (Up to 15 nodes in standard balanced BST order)
      const masterNodes = [
        { val: 50, parentVal: null,  xOffset: 0,    level: 0, color: '#3b82f6' }, // Level 0 (Root)
        { val: 25, parentVal: 50,    xOffset: -120, level: 1, color: '#06b6d4' }, // Level 1 (Left)
        { val: 75, parentVal: 50,    xOffset: 120,  level: 1, color: '#a855f7' }, // Level 1 (Right)
        { val: 12, parentVal: 25,    xOffset: -175, level: 2, color: '#10b981' }, // Level 2 (Left-Left)
        { val: 37, parentVal: 25,    xOffset: -65,  level: 2, color: '#10b981' }, // Level 2 (Left-Right)
        { val: 62, parentVal: 75,    xOffset: 65,   level: 2, color: '#f59e0b' }, // Level 2 (Right-Left)
        { val: 87, parentVal: 75,    xOffset: 175,  level: 2, color: '#f59e0b' }, // Level 2 (Right-Right)
        { val: 6,  parentVal: 12,    xOffset: -200, level: 3, color: '#64748b' }, // Level 3
        { val: 18, parentVal: 12,    xOffset: -148, level: 3, color: '#64748b' },
        { val: 30, parentVal: 37,    xOffset: -90,  level: 3, color: '#64748b' },
        { val: 43, parentVal: 37,    xOffset: -40,  level: 3, color: '#64748b' },
        { val: 56, parentVal: 62,    xOffset: 40,   level: 3, color: '#64748b' },
        { val: 68, parentVal: 62,    xOffset: 90,   level: 3, color: '#64748b' },
        { val: 81, parentVal: 87,    xOffset: 148,  level: 3, color: '#64748b' },
        { val: 93, parentVal: 87,    xOffset: 200,  level: 3, color: '#64748b' }
      ];

      // Slice exact N active nodes as requested by param1 slider
      const activeNodes = masterNodes.slice(0, targetCount).map(node => ({
        ...node,
        x: cx + node.xOffset,
        y: 40 + node.level * 58
      }));

      const activeValMap = new Map(activeNodes.map(n => [n.val, n]));

      // 1. Draw Connecting Branch Edges between Active Nodes
      activeNodes.forEach(node => {
        if (node.parentVal !== null && activeValMap.has(node.parentVal)) {
          const parent = activeValMap.get(node.parentVal);
          ctx.beginPath();
          ctx.moveTo(parent.x, parent.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      });

      // 2. Determine target key match or locate exact BST insertion parent
      let keyMatchedNode = activeValMap.get(targetKey) || null;
      let insertedNewNode = null;

      if (!keyMatchedNode) {
        // Traverse BST down from root to find correct parent for targetKey
        let curr = activeNodes[0];
        let parentForNew = curr;

        while (curr) {
          parentForNew = curr;
          const nextVal = targetKey < curr.val
            ? activeNodes.find(n => n.parentVal === curr.val && n.val < curr.val)
            : activeNodes.find(n => n.parentVal === curr.val && n.val > curr.val);
          if (!nextVal) break;
          curr = nextVal;
        }

        if (parentForNew) {
          const isLeft = targetKey < parentForNew.val;
          const newX = Math.max(20, Math.min(width - 20, parentForNew.x + (isLeft ? -35 : 35)));
          const newY = Math.min(height - 35, parentForNew.y + 55);

          insertedNewNode = {
            val: targetKey,
            parent: parentForNew,
            x: newX,
            y: newY
          };

          // Draw Glowing Edge to New Node
          ctx.beginPath();
          ctx.moveTo(parentForNew.x, parentForNew.y);
          ctx.lineTo(newX, newY);
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 3. Render Active Tree Nodes
      activeNodes.forEach(node => {
        const isMatched = keyMatchedNode && keyMatchedNode.val === node.val;
        const radius = node.level === 0 ? 20 : node.level === 1 ? 18 : 16;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

        if (isMatched) {
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 18;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Matched Badge
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.fillText(`★ MATCHED KEY (${targetKey})`, node.x - 45, node.y - radius - 6);
        } else {
          ctx.fillStyle = node.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.fillStyle = isMatched ? '#0f172a' : '#ffffff';
        ctx.font = `bold ${radius > 17 ? 12 : 11}px Inter, sans-serif`;
        const txtWidth = ctx.measureText(node.val.toString()).width;
        ctx.fillText(node.val.toString(), node.x - txtWidth / 2, node.y + 4);
      });

      // 4. Render Inserted New Key Node (if targetKey is not in active tree)
      if (insertedNewNode) {
        ctx.beginPath();
        ctx.arc(insertedNewNode.x, insertedNewNode.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Inter, sans-serif';
        const txtW = ctx.measureText(insertedNewNode.val.toString()).width;
        ctx.fillText(insertedNewNode.val.toString(), insertedNewNode.x - txtW / 2, insertedNewNode.y + 4);

        // Insertion Label
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 10px Inter, sans-serif';
        const labelX = insertedNewNode.x > cx ? insertedNewNode.x - 70 : insertedNewNode.x + 22;
        ctx.fillText(`+ Inserted Key ${targetKey}`, labelX, insertedNewNode.y + 4);
      }

      // 5. Canvas HUD Overlay
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(10, 10, 175, 50);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, 175, 50);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`Nodes N: ${activeNodes.length} / 15`, 18, 28);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`Target Key K: ${targetKey}`, 18, 44);

    } else if (st.includes('dbms')) {
      // 5. DYNAMIC DBMS RELATIONAL INDEX B-TREE & COST GRAPH (Responds dynamically to param1 & param2!)
      const recordCount = param1;
      const indexDepth = Math.max(1, Math.floor(param2));
      const seqIO = recordCount;
      const btreeIO = Math.ceil(Math.log2(recordCount)) + indexDepth;
      const boost = (seqIO / btreeIO).toFixed(1);

      const cx = width / 2;

      // Sequential Scan Bar (Red Gradient)
      const seqBarH = Math.min(180, (recordCount / 10000) * 180 + 30);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(60, height - 30 - seqBarH, 120, seqBarH);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, height - 30 - seqBarH, 120, seqBarH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText('Full Table Scan', 70, height - 35 - seqBarH);
      ctx.fillStyle = '#fca5a5';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`Disk I/O: ${seqIO} Reads`, 70, height - 15 - seqBarH);

      // B-Tree Index Scan Bar (Green Gradient)
      const btreeBarH = Math.max(30, (btreeIO / 30) * 100);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.fillRect(width - 180, height - 30 - btreeBarH, 120, btreeBarH);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.strokeRect(width - 180, height - 30 - btreeBarH, 120, btreeBarH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText('B-Tree Index Scan', width - 170, height - 35 - btreeBarH);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`Index I/O: ${btreeIO} Reads`, width - 170, height - 15 - btreeBarH);

      // B-Tree Tree Depth Diagram in Middle
      ctx.beginPath();
      ctx.arc(cx, 60, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8'; ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px Inter, sans-serif'; ctx.fillText('Root', cx - 12, 64);

      for (let d = 1; d <= Math.min(3, indexDepth); d++) {
        const py = 60 + d * 45;
        const spread = 40 * d;
        ctx.beginPath(); ctx.arc(cx - spread, py, 14, 0, Math.PI * 2); ctx.fillStyle = '#a855f7'; ctx.fill();
        ctx.beginPath(); ctx.arc(cx + spread, py, 14, 0, Math.PI * 2); ctx.fillStyle = '#a855f7'; ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.fillText(`L${d}`, cx - spread - 6, py + 4); ctx.fillText(`L${d}`, cx + spread - 6, py + 4);
      }

      // Performance Multiplier Pill
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`⚡ Speedup: ${boost}x Faster Query Execution`, cx - 110, height - 40);

    } else if (st.includes('titration')) {
      // 6. Dynamic Chemistry Titration Flask
      const cx = width / 3;
      const cy = height / 2;

      ctx.beginPath();
      ctx.moveTo(cx - 15, cy - 40);
      ctx.lineTo(cx + 15, cy - 40);
      ctx.lineTo(cx + 45, cy + 60);
      ctx.lineTo(cx - 45, cy + 60);
      ctx.closePath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      const isMagenta = simState.pH >= 7.5;
      ctx.fillStyle = isMagenta ? 'rgba(236, 72, 153, 0.75)' : 'rgba(56, 189, 248, 0.25)';
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(width - 140, 40, 100, height - 80);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(width - 140, 40, 100, height - 80);

      ctx.fillStyle = isMagenta ? '#ec4899' : '#38bdf8';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText(`pH = ${simState.pH}`, width - 125, 75);

    } else if (st.includes('heart')) {
      // 7. Dynamic Biology Heart Pulse
      const cx = width / 2;
      const cy = height / 2;

      ctx.beginPath();
      ctx.arc(cx - 20, cy, 50, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(225, 29, 72, 0.8)';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx + 25, cy - 15, 35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(37, 99, 235, 0.8)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Cardiac Output: ${simState.cardiacOutput}`, cx - 60, cy + 80);

    } else if (st.includes('calculus')) {
      // 8. Dynamic Calculus Derivative Tangent
      const cx = width / 2;
      const cy = height / 2 + 40;

      ctx.beginPath();
      ctx.moveTo(40, cy); ctx.lineTo(width - 40, cy);
      ctx.moveTo(cx, 30); ctx.lineTo(cx, height - 30);
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.5; ctx.stroke();

      ctx.beginPath();
      for (let x = -8; x <= 8; x += 0.2) {
        const px = cx + x * 20;
        const py = cy - (x * x) * 3;
        if (x === -8) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 3; ctx.stroke();

      const tx = cx + param1 * 20;
      const ty = cy - (param1 * param1) * 3;
      ctx.beginPath(); ctx.arc(tx, ty, 6, 0, Math.PI * 2); ctx.fillStyle = '#f59e0b'; ctx.fill();

    } else if (st.includes('cpu')) {
      // 9. Dynamic CPU Gantt Chart
      const gantt = simState.gantt || [];
      const totalDuration = gantt.reduce((acc, g) => Math.max(acc, g.end), 1);
      const scale = (width - 80) / totalDuration;

      let startX = 40;
      const colors = ['#06b6d4', '#a855f7', '#10b981', '#f59e0b'];

      gantt.forEach((g, idx) => {
        const barW = (g.end - g.start) * scale;
        ctx.fillStyle = colors[idx % colors.length];
        ctx.fillRect(startX, height / 2 - 30, barW, 60);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(startX, height / 2 - 30, barW, 60);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillText(g.id, startX + barW / 3, height / 2 + 5);

        startX += barW;
      });

    } else if (st.includes('api')) {
      // 10. Dynamic REST API Architecture
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.fillRect(40, cy - 40, 90, 80);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, cy - 40, 90, 80);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('Client App', 50, cy + 5);

      ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.fillRect(cx - 45, cy - 40, 90, 80);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 45, cy - 40, 90, 80);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('API Controller', cx - 40, cy + 5);

      ctx.beginPath();
      ctx.moveTo(130, cy); ctx.lineTo(cx - 45, cy);
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3; ctx.stroke();

    } else if (st.includes('sorting')) {
      // 11. DYNAMIC ARRAY SORTING BARS (Responds dynamically to array size param1!)
      const arr = simState.initialArray || [45, 12, 89, 34, 67, 23, 90, 56];
      const barWidth = width / arr.length - 12;

      arr.forEach((val, i) => {
        const barHeight = (val / 100) * (height - 60);
        const bx = i * (barWidth + 12) + 12;
        const by = height - 30 - barHeight;

        // Gradient colors for array bars
        ctx.fillStyle = i % 2 === 0 ? '#6366f1' : '#a855f7';
        ctx.fillRect(bx, by, barWidth, barHeight);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(val.toString(), bx + barWidth / 4, by - 8);
      });

    } else {
      // 12. Fallback Mathematical Parametric Wave
      ctx.beginPath();
      for (let x = 0; x < width; x += 5) {
        const y = height / 2 + Math.sin(x * 0.05 + param1 * 0.1) * param2 * 1.2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

  }, [activeTab, param1, param2, lab]);

  // Record experiment attempt
  const handleSaveExperiment = () => {
    const res = recordLabAttempt({
      labId: lab.id,
      labTitle: lab.title,
      subject: lab.subject,
      parameters: { [paramConfig.p1Label]: param1, [paramConfig.p2Label]: param2 },
      results: simState,
      score: 95,
      notes: `Successfully executed ${lab.title} in ${mode} mode.`
    });

    setIsSaved(true);
    if (onAttemptRecorded) onAttemptRecorded(res);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(5, 8, 20, 0.96)',
        backdropFilter: 'blur(24px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Top Sticky Header Bar with High Visibility Back Button */}
      <div
        style={{
          padding: '16px 28px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: `1px solid ${theme.primary}50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Prominent Glowing Back Button */}
          <button
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(37, 99, 235, 0.25))',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              color: '#38bdf8',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
            }}
          >
            <ArrowLeft size={20} /> Back to Lab Library
          </button>

          <span
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: `${theme.primary}25`,
              color: theme.primary,
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          >
            {lab?.subject}
          </span>

          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontWeight: 700 }}>
              {lab?.title}
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Level: {lab?.educationType?.toUpperCase()} • {lab?.difficulty}
            </span>
          </div>
        </div>

        {/* Tab & Viewport Control Switchers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.8)', padding: '4px', borderRadius: '12px' }}>
            <button
              onClick={() => setActiveTab('simulation')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: activeTab === 'simulation' ? 'linear-gradient(135deg, #06b6d4, #2563eb)' : 'transparent',
                color: activeTab === 'simulation' ? '#ffffff' : '#94a3b8',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Interactive Canvas
            </button>
            <button
              onClick={() => setActiveTab('full_interactive')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: activeTab === 'full_interactive' ? 'linear-gradient(135deg, #06b6d4, #2563eb)' : 'transparent',
                color: activeTab === 'full_interactive' ? '#ffffff' : '#94a3b8',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              3D Simulator Engine
            </button>
            <button
              onClick={() => setActiveTab('mentor')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: activeTab === 'mentor' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'transparent',
                color: activeTab === 'mentor' ? '#ffffff' : '#94a3b8',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Bot size={14} /> Sage AI
            </button>
          </div>

          <button
            onClick={onClose}
            title="Exit Activity"
            style={{
              padding: '8px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Laboratory Workspace Grid */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: activeTab === 'mentor' ? '1fr 380px' : '360px 1fr',
          gap: '20px',
          padding: '24px',
          overflow: 'hidden'
        }}
      >
        {/* Left Side: Parameters & Experiment Controls */}
        <div
          style={{
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '18px',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Left Panel Action Header with Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#38bdf8',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#ffffff' }}>
                  Parameters
                </span>
              </div>

              <button
                onClick={() => setMode(mode === 'sandbox' ? 'guided' : 'sandbox')}
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: mode === 'sandbox' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                  color: mode === 'sandbox' ? '#34d399' : '#38bdf8',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {mode === 'sandbox' ? 'Sandbox Mode' : 'Guided Mode'}
              </button>
            </div>

            {/* Slider Parameter 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '8px' }}>
                <span>{paramConfig.p1Label}:</span>
                <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>{param1}</strong>
              </div>
              <input
                type="range"
                min={paramConfig.p1Min}
                max={paramConfig.p1Max}
                value={param1}
                onChange={(e) => {
                  setParam1(Number(e.target.value));
                  setIsSaved(false);
                }}
                style={{ width: '100%', accentColor: '#06b6d4', height: '6px', borderRadius: '3px' }}
              />
            </div>

            {/* Slider Parameter 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '8px' }}>
                <span>{paramConfig.p2Label}:</span>
                <strong style={{ color: '#c084fc', fontSize: '1rem' }}>{param2}</strong>
              </div>
              <input
                type="range"
                min={paramConfig.p2Min}
                max={paramConfig.p2Max}
                value={param2}
                onChange={(e) => {
                  setParam2(Number(e.target.value));
                  setIsSaved(false);
                }}
                style={{ width: '100%', accentColor: '#a855f7', height: '6px', borderRadius: '3px' }}
              />
            </div>

            {/* Governing Equation Box */}
            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(8, 13, 36, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontSize: '0.78rem',
                color: '#94a3b8',
                lineHeight: 1.45
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', marginBottom: '4px', textTransform: 'uppercase' }}>
                Governing Equation:
              </div>
              <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{paramConfig.formula}</span>
            </div>
          </div>

          {/* Record to Notebook Action Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleSaveExperiment}
              disabled={isSaved}
              style={{
                padding: '14px',
                borderRadius: '14px',
                background: isSaved ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #06b6d4, #2563eb)',
                color: isSaved ? '#34d399' : '#ffffff',
                border: isSaved ? '1px solid rgba(16, 185, 129, 0.4)' : 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isSaved ? 'default' : 'pointer',
                boxShadow: isSaved ? 'none' : '0 4px 18px rgba(6, 182, 212, 0.4)'
              }}
            >
              <Save size={16} /> {isSaved ? 'Recorded to Notebook!' : 'Record Results to Notebook'}
            </button>
          </div>
        </div>

        {/* Right Side: Visual Canvas Viewport / Full Interactive Engine / Sage AI */}
        <div
          style={{
            position: 'relative',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px'
          }}
        >
          {activeTab === 'simulation' && (
            <>
              {/* Top Viewport Header Bar with Back Button & Dynamic Metric Cards */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                  zIndex: 5,
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <button
                  onClick={onClose}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowLeft size={16} /> Back to All Labs
                </button>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {Object.entries(simState)
                    .filter(([k]) => typeof simState[k] === 'number' || typeof simState[k] === 'string')
                    .slice(0, 5)
                    .map(([key, val], idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          background: 'rgba(8, 13, 36, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'capitalize' }}>{key}</span>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>{val.toString()}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Dynamic 2D Canvas Diagram */}
              <div style={{ flex: 1, position: 'relative', minHeight: '280px' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
              </div>
            </>
          )}

          {activeTab === 'full_interactive' && (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {lab?.simType?.includes('projectile') && <GravitySimulator />}
              {lab?.simType?.includes('chemistry') && <ChemistryLab />}
              {lab?.simType?.includes('biology') && <BiologyDiagrams />}
              {lab?.simType?.includes('math') && <MathematicsLab />}
              {lab?.simType?.includes('sorting') && <AlgorithmVisualizer />}
              {lab?.simType?.includes('engine') && <MechanicalLab />}
              {!lab?.simType?.includes('projectile') &&
               !lab?.simType?.includes('chemistry') &&
               !lab?.simType?.includes('biology') &&
               !lab?.simType?.includes('math') &&
               !lab?.simType?.includes('sorting') &&
               !lab?.simType?.includes('engine') && (
                <Lab3DViewer modelType={lab?.simType} title={`${lab?.title} (3D Object Engine)`} />
              )}
            </div>
          )}

          {activeTab === 'mentor' && <SageAILabMentor lab={lab} liveState={simState} />}
        </div>
      </div>
    </div>
  );
};

export default LabViewer;
