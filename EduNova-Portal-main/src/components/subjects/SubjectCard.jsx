import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  AlertCircle,
  Zap,
  PlayCircle,
  Flame,
  Target,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Atom,
  FlaskConical,
  Code2,
  Database,
  Globe,
  Dna,
  Layers,
  Cpu,
  Star
} from 'lucide-react';
import { subjectService } from '../../services/subjectService';
import { curriculumService } from '../../services/curriculumService';
import { useTheme } from '../../context/ThemeContext';

// Sigma Custom Icon Component for Mathematics
const SigmaIcon = ({ size = 20, color = "#38bdf8" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 4H6l7 8-7 8h12" />
  </svg>
);

// Helper to render distinct icons
const renderCardIcon = (iconInput, color, subjectName = '') => {
  if (typeof iconInput === 'function') {
    const IconComp = iconInput;
    try { return <IconComp size={22} color={color} />; } catch (e) {}
  }

  if (typeof iconInput === 'object' && iconInput !== null) {
    const IconComp = iconInput;
    try { return <IconComp size={22} color={color} />; } catch (e) {}
  }

  if (typeof iconInput === 'string' && iconInput.trim()) {
    const trimmed = iconInput.trim();
    if (trimmed.length <= 4) {
      return <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{trimmed}</span>;
    }
  }

  const nameLower = (subjectName || '').toLowerCase();
  if (nameLower.includes('math')) return <SigmaIcon size={22} color={color} />;
  if (nameLower.includes('physic')) return <Atom size={22} color={color} />;
  if (nameLower.includes('chem')) return <FlaskConical size={22} color={color} />;
  if (nameLower.includes('biol') || nameLower.includes('dna')) return <Dna size={22} color={color} />;
  if (nameLower.includes('code') || nameLower.includes('struct') || nameLower.includes('react') || nameLower.includes('dev')) return <Code2 size={22} color={color} />;
  if (nameLower.includes('data') || nameLower.includes('sql') || nameLower.includes('dbms')) return <Database size={22} color={color} />;
  if (nameLower.includes('english') || nameLower.includes('lit')) return <BookOpen size={22} color={color} />;
  if (nameLower.includes('social') || nameLower.includes('histor') || nameLower.includes('geog') || nameLower.includes('world')) return <Globe size={22} color={color} />;

  return <BookOpen size={22} color={color} />;
};

export const SubjectCard = ({ subject, onManage, onReorder, onStartQuiz }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isFavorite, setIsFavorite] = useState(() => subject.favorite ?? curriculumService.isFavorite(subject.id));

  useEffect(() => {
    setIsFavorite(subject.favorite ?? curriculumService.isFavorite(subject.id));
  }, [subject.id, subject.favorite]);

  useEffect(() => {
    const handleFavUpdate = (e) => {
      if (e.detail?.subjectId === subject.id || !e.detail?.subjectId) {
        setIsFavorite(curriculumService.isFavorite(subject.id));
      }
    };
    window.addEventListener('edunova_favorites_updated', handleFavUpdate);
    return () => window.removeEventListener('edunova_favorites_updated', handleFavUpdate);
  }, [subject.id]);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    const newState = curriculumService.toggleFavorite(subject.id);
    setIsFavorite(newState);
  };

  const targetScore = subject.targetScore || subject.defaultTargetScore || 90;
  const currentProgress = typeof subject.progress === 'number' ? subject.progress : (typeof subject.userProgress === 'number' ? subject.userProgress : 0);
  const streak = typeof subject.streak === 'number' ? subject.streak : 0;
  const xp = typeof subject.xp === 'number' ? subject.xp : 0;

  // Quiz Performance Trend Sparkline
  const trend = subjectService.getQuizPerformanceTrend(subject.id);
  const brandColor = subject.color || '#38bdf8';
  const priorityLevel = subject.priority || subject.defaultPriority || (subject.id?.includes('math') || subject.id?.includes('phy') || subject.id?.includes('dsa') ? 'High' : 'Medium');

  const handleQuizClick = (e) => {
    e.stopPropagation();
    if (onStartQuiz) {
      onStartQuiz({
        subjectId: subject.id,
        subjectName: subject.name,
        topicName: subject.nextActivity || subject.currentTopic || `${subject.name} Diagnostic Quiz`
      });
    } else {
      navigate(`/subjects/${subject.id}`);
    }
  };

  return (
    <div
      style={{
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(20, 26, 58, 0.78) 0%, rgba(12, 17, 40, 0.88) 100%)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderRadius: '24px',
        border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35), inset 0 1.5px 2px rgba(255, 255, 255, 0.9)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="glass-card-hover"
    >
      {/* Top Brand Accent Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3.5px',
        background: `linear-gradient(90deg, ${brandColor}, #6366f1, #8b5cf6)`
      }} />

      {/* Main Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Header Row: Glowing Icon + Title + Priority Badge & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          
          {/* Left: Icon + Title info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              flexShrink: 0,
              background: isLight ? 'rgba(230, 240, 255, 0.9)' : `rgba(${parseInt(brandColor.slice(1,3),16) || 56}, ${parseInt(brandColor.slice(3,5),16) || 189}, ${parseInt(brandColor.slice(5,7),16) || 248}, 0.2)`,
              border: `1.5px solid ${brandColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px rgba(${parseInt(brandColor.slice(1,3),16) || 56}, ${parseInt(brandColor.slice(3,5),16) || 189}, ${parseInt(brandColor.slice(5,7),16) || 248}, 0.35)`
            }}>
              {renderCardIcon(subject.icon, brandColor, subject.name)}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: isLight ? '#18345F' : '#ffffff',
                  margin: 0,
                  letterSpacing: '-0.01em',
                  fontFamily: 'var(--font-heading)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {subject.name}
                </h3>
              </div>
              <span style={{ fontSize: '0.76rem', color: isLight ? '#52668a' : '#94a3b8', fontWeight: 600, display: 'block', marginTop: '1px' }}>
                {subject.grade || subject.degree || subject.level || subject.examName || 'Core Curriculum Track'}
              </span>
            </div>
          </div>

          {/* Right: Priority Pill, Favorite Star & Optional Reorder */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '999px',
                whiteSpace: 'nowrap',
                background: priorityLevel === 'High'
                  ? (isLight ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.22)')
                  : (isLight ? 'rgba(6, 182, 212, 0.12)' : 'rgba(56, 189, 248, 0.18)'),
                color: priorityLevel === 'High'
                  ? (isLight ? '#4f46e5' : '#a5b4fc')
                  : (isLight ? '#0284c7' : '#38bdf8'),
                border: priorityLevel === 'High'
                  ? '1px solid rgba(99, 102, 241, 0.35)'
                  : '1px solid rgba(6, 182, 212, 0.35)',
                backdropFilter: 'blur(8px)',
                letterSpacing: '0.3px'
              }}>
                ✦ {priorityLevel} Priority
              </span>

              <button
                onClick={handleFavoriteClick}
                title={isFavorite ? 'Remove Favorite' : 'Save Subject'}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isFavorite ? 'rgba(251, 191, 36, 0.25)' : (isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)'),
                  backdropFilter: 'blur(8px)',
                  border: isFavorite ? '1.5px solid #fbbf24' : (isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.16)'),
                  color: isFavorite ? '#fbbf24' : (isLight ? '#52668a' : '#ffffff'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isFavorite ? '0 0 12px rgba(251, 191, 36, 0.45)' : 'none',
                  flexShrink: 0
                }}
              >
                <Star size={14} fill={isFavorite ? '#fbbf24' : 'transparent'} color={isFavorite ? '#fbbf24' : (isLight ? '#52668a' : '#ffffff')} />
              </button>
            </div>

            {onReorder && (
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); onReorder(subject.id, 'up'); }}
                  title="Move Up Priority"
                  style={{
                    background: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.08)',
                    border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.16)',
                    color: isLight ? '#18345F' : '#ffffff',
                    borderRadius: '6px',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onReorder(subject.id, 'down'); }}
                  title="Move Down Priority"
                  style={{
                    background: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.08)',
                    border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.16)',
                    color: isLight ? '#18345F' : '#ffffff',
                    borderRadius: '6px',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Topic Description / Key Syllabus Outline */}
        <p style={{ fontSize: '0.84rem', color: isLight ? '#334155' : '#cbd5e1', lineHeight: 1.45, margin: 0, minHeight: '38px' }}>
          {subject.description || `${subject.name} core principles, key formula derivations, and problem-solving benchmarks.`}
        </p>

        {/* Progress Bar & Target Score Pill */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
            <span style={{ color: isLight ? '#18345F' : '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={14} color={isLight ? '#0284c7' : '#38bdf8'} /> Progress: <strong style={{ color: isLight ? '#0284c7' : '#38bdf8', fontSize: '0.88rem' }}>{currentProgress}%</strong>
            </span>
            <span style={{
              fontSize: '0.74rem',
              color: currentProgress > 0 ? (isLight ? '#059669' : '#34d399') : (isLight ? '#52668a' : '#cbd5e1'),
              background: currentProgress > 0 ? (isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(52, 211, 153, 0.15)') : (isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)'),
              border: currentProgress > 0 ? (isLight ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(52, 211, 153, 0.35)') : (isLight ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.14)'),
              padding: '2px 10px',
              borderRadius: '999px',
              fontWeight: 700
            }}>
              {currentProgress > 0 ? `${currentProgress}% → ${targetScore}% Target` : `Target: ${targetScore}% (Not Started)`}
            </span>
          </div>
          <div style={{ height: '7px', background: isLight ? 'rgba(218, 230, 245, 0.8)' : 'rgba(15, 23, 42, 0.8)', borderRadius: '999px', overflow: 'hidden', padding: '1px', border: isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{
              width: `${Math.max(2, currentProgress)}%`,
              height: '100%',
              borderRadius: '999px',
              background: `linear-gradient(90deg, ${brandColor}, #6366f1)`
            }} />
          </div>
        </div>

        {/* XP, Streak & Performance Telemetry Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: isLight ? 'rgba(240, 246, 255, 0.75)' : 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          padding: '10px 14px',
          borderRadius: '14px',
          border: isLight ? '1px solid rgba(200, 218, 240, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '0.8rem', color: isLight ? '#d97706' : '#fbbf24', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={14} color={isLight ? '#d97706' : '#fbbf24'} /> {xp} XP
            </span>
            <span style={{ fontSize: '0.8rem', color: isLight ? '#e11d48' : '#fb7185', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flame size={14} color={isLight ? '#e11d48' : '#fb7185'} /> {streak}d streak
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.74rem', color: currentProgress > 0 ? trend.trendColor : (isLight ? '#0284c7' : '#38bdf8'), fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <TrendingUp size={13} color={isLight ? '#0284c7' : '#38bdf8'} /> {currentProgress > 0 ? trend.status : 'Ready to Start'}
            </span>
          </div>
        </div>

        {/* Chapter Diagnostics & Recommended Start Pill Box */}
        <div style={{
          background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(15, 23, 42, 0.85)',
          borderRadius: '16px',
          padding: '12px 14px',
          border: isLight ? '1px solid rgba(200, 218, 240, 0.7)' : '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.82rem'
        }}>
          {subject.weakTopic && currentProgress > 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: isLight ? 'rgba(225, 29, 72, 0.1)' : 'rgba(244, 63, 94, 0.12)',
              border: isLight ? '1px solid rgba(225, 29, 72, 0.25)' : '1px solid rgba(244, 63, 94, 0.3)',
              padding: '6px 10px',
              borderRadius: '8px',
              color: isLight ? '#e11d48' : '#fb7185'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.78rem' }}>
                <AlertCircle size={14} /> Weak Topic:
              </span>
              <strong style={{ fontSize: '0.82rem', fontWeight: 800 }}>{subject.weakTopic}</strong>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.04)',
              border: isLight ? '1px solid rgba(200, 218, 240, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
              padding: '6px 10px',
              borderRadius: '8px',
              color: isLight ? '#475569' : '#cbd5e1'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
                <Sparkles size={14} color={isLight ? '#0284c7' : '#38bdf8'} /> Diagnostics:
              </span>
              <span style={{ fontSize: '0.78rem', color: isLight ? '#18345F' : '#ffffff', fontWeight: 700 }}>Ready for initial quiz</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
            <span style={{ color: isLight ? '#475569' : '#cbd5e1', fontSize: '0.78rem' }}>
              {currentProgress > 0 ? 'Next Activity:' : 'Recommended Start:'}
            </span>
            <button
              onClick={handleQuizClick}
              style={{
                background: 'none',
                border: 'none',
                color: isLight ? '#0284c7' : '#38bdf8',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'right',
                textDecoration: 'none',
                padding: 0
              }}
            >
              {subject.nextActivity || '10 Question Diagnostic Quiz'}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
        <button
          onClick={() => navigate(`/subjects/${subject.id}`)}
          style={{
            flex: 1,
            padding: '11px 16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
            border: 'none',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          <PlayCircle size={15} /> {currentProgress > 0 ? 'Continue Learning' : 'Start Learning'}
        </button>
        <button
          onClick={() => navigate(`/subjects/${subject.id}`)}
          style={{
            padding: '11px 18px',
            borderRadius: '12px',
            background: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.08)',
            border: isLight ? '1px solid rgba(190, 210, 235, 0.9)' : '1px solid rgba(255, 255, 255, 0.18)',
            color: isLight ? '#18345F' : '#ffffff',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Open Hub
        </button>
      </div>

    </div>
  );
};

export default SubjectCard;
