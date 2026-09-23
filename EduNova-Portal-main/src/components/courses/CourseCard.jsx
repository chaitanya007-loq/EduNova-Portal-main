import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, BookOpen, PlayCircle, Target, Shield, AlertCircle, Sparkles, FlaskConical, FileText, Brain } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';
import { useTheme } from '../../context/ThemeContext';
import { curriculumService } from '../../services/curriculumService';

export const CourseCard = ({ course, onOpenPreview, onToggleFavorite }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isFavorite, setIsFavorite] = useState(() => course.favorite ?? curriculumService.isFavorite(course.id));

  useEffect(() => {
    setIsFavorite(course.favorite ?? curriculumService.isFavorite(course.id));
  }, [course.id, course.favorite]);

  useEffect(() => {
    const handleFavUpdate = (e) => {
      if (e.detail?.subjectId === course.id || !e.detail?.subjectId) {
        setIsFavorite(curriculumService.isFavorite(course.id));
      }
    };
    window.addEventListener('edunova_favorites_updated', handleFavUpdate);
    return () => window.removeEventListener('edunova_favorites_updated', handleFavUpdate);
  }, [course.id]);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    const newState = curriculumService.toggleFavorite(course.id);
    setIsFavorite(newState);
    if (onToggleFavorite) {
      onToggleFavorite(course.id);
    }
  };

  const title = course.name || course.title;
  const progress = course.progress || 0;
  const targetScore = course.targetScore || 90;
  const syllabusCoverage = course.syllabusCoverage || Math.min(100, Math.max(50, progress + 10));
  const chaptersCount = course.chaptersCount || (course.modules ? course.modules.length : 12);
  const questionsCount = course.questionsCount || 240;
  const flashcardsCount = course.flashcardsCount || 65;
  const notesCount = course.notesCount || 16;
  const brandColor = course.color || '#06b6d4';

  return (
    <div
      style={{
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderRadius: '24px',
        border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        padding: 0,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35), inset 0 1.5px 2px rgba(255, 255, 255, 0.9)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)',
        position: 'relative'
      }}
      className="subject-card-hover"
    >
      {/* 16:9 Image Container with Gradient Overlay */}
      <div style={{ position: 'relative', height: '170px', width: '100%', overflow: 'hidden' }}>
        <img
          src={course.image || course.thumbnail}
          alt={title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isLight ? 'linear-gradient(to top, rgba(235, 244, 255, 0.95) 0%, rgba(255, 255, 255, 0.1) 60%, transparent 100%)' : 'linear-gradient(to top, rgba(12, 16, 36, 1) 0%, rgba(12, 16, 36, 0.35) 60%, transparent 100%)'
        }} />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          zIndex: 2
        }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '999px',
            background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            color: isLight ? '#0284c7' : '#38bdf8',
            border: isLight ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(6, 182, 212, 0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {course.category}
          </span>

          {/* Favorite Toggle Button */}
          <button
            onClick={handleFavoriteClick}
            title={isFavorite ? 'Remove Favorite' : 'Save Subject'}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: isFavorite ? 'rgba(251, 191, 36, 0.25)' : (isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.85)'),
              backdropFilter: 'blur(8px)',
              border: isFavorite ? '1.5px solid #fbbf24' : (isLight ? '1.5px solid rgba(6, 182, 212, 0.4)' : '1.5px solid rgba(255, 255, 255, 0.3)'),
              color: isFavorite ? '#fbbf24' : (isLight ? '#18345F' : '#ffffff'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: isFavorite ? '0 0 16px rgba(251, 191, 36, 0.5)' : 'none'
            }}
          >
            <Star size={16} fill={isFavorite ? '#fbbf24' : 'transparent'} color={isFavorite ? '#fbbf24' : (isLight ? '#18345F' : '#ffffff')} />
          </button>
        </div>

        {/* Immersive / Sage Ready Pill */}
        <div style={{ position: 'absolute', bottom: '10px', left: '12px', display: 'flex', gap: '6px', zIndex: 2 }}>
          {course.hasInteractiveLab && (
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.25)', color: isLight ? '#d97706' : '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.5)', padding: '2px 8px', borderRadius: '4px' }}>
              🥽 IMMERSIVE READY
            </span>
          )}
          {course.aiEnabled && (
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(168, 85, 247, 0.25)', color: isLight ? '#7c3aed' : '#c084fc', border: '1px solid rgba(168, 85, 247, 0.5)', padding: '2px 8px', borderRadius: '4px' }}>
              ✨ SAGE READY
            </span>
          )}
        </div>
      </div>

      {/* Card Content Section */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '14px' }}>
        <div>
          {/* Syllabus Coverage Pill */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: isLight ? '#059669' : '#34d399', fontWeight: 800, marginBottom: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(52, 211, 153, 0.12)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
              ✓ {syllabusCoverage}% Syllabus Covered
            </span>
            <span style={{ color: isLight ? '#52668a' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
              Target: <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>{targetScore}%</strong>
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', marginBottom: '6px', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
            {course.icon ? `${course.icon} ` : ''}{title}
          </h3>

          <p style={{ fontSize: '0.82rem', color: isLight ? '#334155' : 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '36px' }}>
            {course.shortDescription || course.description}
          </p>

          {/* Academic Material Counts Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '4px',
            background: isLight ? 'rgba(240, 246, 255, 0.75)' : 'rgba(15, 23, 42, 0.7)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            border: isLight ? '1px solid rgba(200, 218, 240, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
            fontSize: '0.72rem',
            color: isLight ? '#52668a' : 'var(--text-muted)',
            marginBottom: '14px'
          }}>
            <div>
              <strong style={{ display: 'block', color: isLight ? '#18345F' : '#ffffff', fontSize: '0.85rem' }}>{chaptersCount}</strong>
              Chapters
            </div>
            <div>
              <strong style={{ display: 'block', color: isLight ? '#18345F' : '#ffffff', fontSize: '0.85rem' }}>{questionsCount}</strong>
              Questions
            </div>
            <div>
              <strong style={{ display: 'block', color: isLight ? '#18345F' : '#ffffff', fontSize: '0.85rem' }}>{flashcardsCount}</strong>
              Flashcards
            </div>
            <div>
              <strong style={{ display: 'block', color: isLight ? '#18345F' : '#ffffff', fontSize: '0.85rem' }}>{notesCount}</strong>
              Notes
            </div>
          </div>

          {/* Topic Focus Indicators */}
          {(course.currentTopic || course.weakTopic) && (
            <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px', background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(0, 0, 0, 0.2)', padding: '8px 10px', borderRadius: '6px', border: isLight ? '1px solid rgba(200, 218, 240, 0.7)' : 'none' }}>
              {course.currentTopic && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: isLight ? '#18345F' : '#ffffff' }}>
                  <span style={{ color: isLight ? '#52668a' : 'var(--text-muted)' }}>Current Topic:</span>
                  <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>{course.currentTopic}</strong>
                </div>
              )}
              {course.weakTopic && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: isLight ? '#e11d48' : '#fb7185' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> Weak Topic:
                  </span>
                  <strong style={{ textDecoration: 'underline' }}>{course.weakTopic}</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar & Actions */}
        <div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', color: isLight ? '#52668a' : 'var(--text-secondary)' }}>
              <span>Course Progress</span>
              <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>{progress}%</strong>
            </div>
            <ProgressBar progress={progress} color={brandColor} height={6} />
          </div>

          {/* Card Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate(`/subjects/${course.id}`)}
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)'
              }}
            >
              <PlayCircle size={15} /> Continue Learning
            </button>
            <button
              onClick={() => {
                if (onOpenPreview) onOpenPreview(course);
                else navigate(`/subjects/${course.id}`);
              }}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                background: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.06)',
                border: isLight ? '1px solid rgba(190, 210, 235, 0.9)' : '1px solid var(--border-color)',
                color: isLight ? '#18345F' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              Open Subject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
