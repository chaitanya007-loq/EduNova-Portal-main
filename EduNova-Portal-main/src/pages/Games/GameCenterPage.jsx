import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Zap,
  Layers,
  Puzzle,
  ArrowUp,
  Bug,
  Sword,
  Flame,
  Trophy,
  Award,
  Sparkles,
  Play,
  RotateCcw,
  CheckSquare,
  History,
  FlaskConical
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { EduNovaHeroBanner } from '../../components/common/EduNovaHeroBanner';
import { gameService } from '../../services/gameService';
import { taskService } from '../../services/taskService';

import { DailyChallengeModal } from '../../components/games/DailyChallengeModal';
import { RapidFireGameModal } from '../../components/games/RapidFireGameModal';
import { MemoryMatchGameModal } from '../../components/games/MemoryMatchGameModal';
import { ConceptMatchGameModal } from '../../components/games/ConceptMatchGameModal';
import { SortItGameModal } from '../../components/games/SortItGameModal';
import { FixMistakeGameModal } from '../../components/games/FixMistakeGameModal';
import { BossBattleGameModal } from '../../components/games/BossBattleGameModal';
import { FormulaRushGameModal } from '../../components/games/FormulaRushGameModal';
import { LabSimulatorGameModal } from '../../components/games/LabSimulatorGameModal';
import { GameResultModal } from '../../components/games/GameResultModal';

export const GameCenterPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';
  const { user } = useAuth() || {};

  const [activeTrack, setActiveTrack] = useState('SCHOOL');
  const [bests, setBests] = useState({ highScore: 0, highestAccuracy: 0, totalGames: 0, currentStreak: 1 });
  const [history, setHistory] = useState([]);

  // Active game modal state
  const [activeGameModal, setActiveGameModal] = useState(null); // 'DAILY' | 'RAPID' | 'MEMORY' | 'CONCEPT' | 'SORT' | 'FIX' | 'BOSS'
  const [activeResult, setActiveResult] = useState(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = () => {
    setBests(gameService.getPersonalBests());
    setHistory(gameService.getResults());
  };

  const handleGameFinish = (result) => {
    setActiveGameModal(null);
    const saved = gameService.saveGameResult(result);
    setActiveResult(saved);
    setIsResultOpen(true);
    loadGameData();
  };

  const getGameModalKey = (gameId) => {
    if (!gameId) return 'RAPID';
    const id = gameId.toLowerCase();
    if (id.includes('daily')) return 'DAILY';
    if (id.includes('rapid')) return 'RAPID';
    if (id.includes('memory')) return 'MEMORY';
    if (id.includes('concept')) return 'CONCEPT';
    if (id.includes('sort')) return 'SORT';
    if (id.includes('fix')) return 'FIX';
    if (id.includes('boss')) return 'BOSS';
    if (id.includes('formula')) return 'FORMULA';
    if (id.includes('lab')) return 'LAB';
    return 'RAPID';
  };

  const handleCreateTaskFromGame = (res) => {
    taskService.createTask({
      title: `Revision Task: ${res.gameTitle || 'Subject Practice'}`,
      subject: res.subject || 'Physics',
      type: 'Revision',
      priority: 'HIGH',
      dueDate: new Date().toISOString().split('T')[0],
      notes: `Created from Game Center result. Accuracy achieved: ${res.accuracy}%.`
    });
    navigate('/tasks');
  };

  const gameEngines = [
    {
      id: 'RAPID',
      title: 'Rapid Fire Sprint',
      subtitle: '60-second high-speed conceptual question sprint with dynamic combo multiplier.',
      icon: Zap,
      color: '#38bdf8',
      badge: '⚡ SPEED ENGINE'
    },
    {
      id: 'FORMULA',
      title: 'Formula Rush Blitz',
      subtitle: '30-second high-intensity formula matching sprint for physics, math & chemistry.',
      icon: Flame,
      color: '#f59e0b',
      badge: '🏎️ BLITZ ENGINE'
    },
    {
      id: 'MEMORY',
      title: 'Memory Match Laboratory',
      subtitle: 'Card flip pairing engine for key formulas, terms, and definitions.',
      icon: Layers,
      color: '#c084fc',
      badge: '🃏 MEMORY ENGINE'
    },
    {
      id: 'CONCEPT',
      title: 'Concept Match Challenge',
      subtitle: 'Interactive drag-and-drop matching of theoretical concepts to real-world examples.',
      icon: Puzzle,
      color: '#10b981',
      badge: '🧩 MATCH ENGINE'
    },
    {
      id: 'SORT',
      title: 'Sort It Sequence Builder',
      subtitle: 'Arrange algorithm steps, mathematical derivations, and historical timelines in order.',
      icon: ArrowUp,
      color: '#fbbf24',
      badge: '🔀 SEQUENCE ENGINE'
    },
    {
      id: 'FIX',
      title: 'Fix the Mistake Debugger',
      subtitle: 'Spot and correct flawed equations, code snippets, and chemical reactions with Sage AI.',
      icon: Bug,
      color: '#ef4444',
      badge: '🐛 DEBUGGER ENGINE'
    },
    {
      id: 'LAB',
      title: 'Virtual Optics & Trajectory Lab',
      subtitle: 'Interactive virtual lab experiment simulator for physics trajectory & optics calculations.',
      icon: FlaskConical,
      color: '#2dd4bf',
      badge: '🧪 LAB SIMULATOR'
    },
    {
      id: 'BOSS',
      title: 'Subject Boss Battle',
      subtitle: 'Multi-stage epic boss battle with adaptive difficulty and stage progression.',
      icon: Sword,
      color: '#ec4899',
      badge: '⚔️ BOSS BATTLE'
    }
  ];

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* 1. HERO GLASS BANNER */}
      <div style={{ marginBottom: '28px' }}>
        <EduNovaHeroBanner
          badge="✦ EduNova Gamified Learning Engine"
          title="🎮 Learning Game Center"
          subtitle="Don't just study it. Play it. Practice it. Master it. Transform your study sessions into dynamic learning challenges."
          actions={
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setActiveGameModal('DAILY')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  background: isLight
                    ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                    : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  letterSpacing: '-0.01em'
                }}
              >
                <Flame size={16} color="#ffffff" fill="rgba(255, 255, 255, 0.25)" />
                <span>Play Daily Challenge</span>
              </button>
            </div>
          }
          stats={[
            { label: bests.totalGames, subtext: 'Games Completed', icon: Gamepad2, color: '#38bdf8', iconBg: 'rgba(56, 189, 248, 0.2)' },
            { label: `${bests.highestAccuracy}%`, subtext: 'Highest Accuracy', icon: Trophy, color: '#10b981', iconBg: 'rgba(16, 185, 129, 0.2)' },
            { label: bests.highScore, subtext: 'High Score', icon: Award, color: '#c084fc', iconBg: 'rgba(192, 132, 252, 0.2)' },
            { label: `${bests.currentStreak} Days`, subtext: 'Active Streak', icon: Flame, color: '#f59e0b', iconBg: 'rgba(245, 158, 11, 0.2)' }
          ]}
        />
      </div>

      {/* 3. GAME ENGINES GRID */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '20px' }}>
        🎮 Reusable Learning Game Engines
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        {gameEngines.map(g => {
          const Icon = g.icon;
          return (
            <div
              key={g.id}
              style={{
                background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.06)' : '0 20px 45px rgba(0,0,0,0.4)',
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: `${g.color}22`, border: `1px solid ${g.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} color={g.color} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: g.color, background: `${g.color}15`, padding: '4px 10px', borderRadius: '9999px' }}>
                    {g.badge}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 8px 0' }}>
                  {g.title}
                </h4>

                <p style={{ color: isLight ? '#475569' : '#cbd5e1', fontSize: '0.88rem', margin: '0 0 20px 0', lineHeight: 1.45 }}>
                  {g.subtitle}
                </p>
              </div>

              <button
                onClick={() => setActiveGameModal(g.id)}
                style={{
                  width: '100%',
                  padding: '11px 18px',
                  borderRadius: '12px',
                  background: isLight
                    ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
                    : 'rgba(56, 189, 248, 0.12)',
                  border: isLight ? 'none' : '1px solid rgba(56, 189, 248, 0.32)',
                  color: isLight ? '#ffffff' : '#38bdf8',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: isLight
                    ? '0 6px 18px rgba(56, 189, 248, 0.25)'
                    : '0 4px 14px rgba(56, 189, 248, 0.12)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Play size={14} fill={isLight ? '#ffffff' : '#38bdf8'} /> Launch Game
              </button>
            </div>
          );
        })}
      </div>

      {/* 4. GAME HISTORY */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <History size={22} color="#38bdf8" /> Recent Game History
      </h3>

      <div style={{
        background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(28px)',
        border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '24px',
        padding: '20px 24px'
      }}>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: isLight ? '#64748b' : '#94a3b8' }}>
            No game records yet. Play your first game above!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.slice(0, 5).map(h => (
              <div
                key={h.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: isLight ? '#ffffff' : 'rgba(255,255,255,0.04)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.92rem', color: isLight ? '#0f172a' : '#ffffff', display: 'block' }}>
                    {h.gameTitle}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                    {h.subject} • Accuracy: {h.accuracy}%
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#38bdf8', display: 'block' }}>{h.score} pts</strong>
                  <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 800 }}>+{h.xpEarned} XP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GAME MODALS */}
      <DailyChallengeModal
        isOpen={activeGameModal === 'DAILY'}
        onClose={() => setActiveGameModal(null)}
        onFinish={handleGameFinish}
      />

      <RapidFireGameModal
        isOpen={activeGameModal === 'RAPID'}
        onClose={() => setActiveGameModal(null)}
        onFinish={handleGameFinish}
      />

      <MemoryMatchGameModal
        isOpen={activeGameModal === 'MEMORY'}
        onClose={() => setActiveGameModal(null)}
        onFinish={handleGameFinish}
      />

      <ConceptMatchGameModal
        isOpen={activeGameModal === 'CONCEPT'}
        onClose={() => setActiveGameModal(null)}
        onFinish={handleGameFinish}
      />

      <SortItGameModal
        isOpen={activeGameModal === 'SORT'}
        onClose={() => setActiveGameModal(null)}
        onFinish={handleGameFinish}
      />

      <FixMistakeGameModal
        isOpen={activeGameModal === 'FIX'}
        onClose={() => setActiveGameModal(null)}
        onFinish={handleGameFinish}
      />

      <BossBattleGameModal
        isOpen={activeGameModal === 'BOSS'}
        onClose={() => setActiveGameModal(null)}
        onFinish={handleGameFinish}
      />

      <FormulaRushGameModal
        isOpen={activeGameModal === 'FORMULA'}
        onClose={() => setActiveGameModal(null)}
        onFinish={handleGameFinish}
      />

      <LabSimulatorGameModal
        isOpen={activeGameModal === 'LAB'}
        onClose={() => setActiveGameModal(null)}
        onFinish={handleGameFinish}
      />

      <GameResultModal
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        result={activeResult}
        onRetry={() => {
          setIsResultOpen(false);
          setActiveGameModal(getGameModalKey(activeResult?.gameId));
        }}
        onCreateTask={handleCreateTaskFromGame}
      />
    </div>
  );
};
export default GameCenterPage;
