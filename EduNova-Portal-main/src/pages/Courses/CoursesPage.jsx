import React, { useState, useEffect } from 'react';
import { useLearner } from '../../context/LearnerContext';
import { curriculumService } from '../../services/curriculumService';
import { CurriculumSelector } from '../../components/courses/CurriculumSelector';
import { CourseCard } from '../../components/courses/CourseCard';
import { LearningMapView } from '../../components/courses/LearningMapView';
import { SubjectContentPreviewModal } from '../../components/courses/SubjectContentPreviewModal';
import { Search, Filter, Sparkles, Target, ArrowRight, BookOpen, Star, RefreshCw, Layers, Grid, Map, Brain, Bot, Play } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { useAI } from '../../context/AIContext';
import { EduNovaHeroBanner } from '../../components/common/EduNovaHeroBanner';
import { useTheme } from '../../context/ThemeContext';
import { useUserProgress } from '../../hooks/useUserProgress';

export const CoursesPage = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { learner, learnerType } = useLearner();
  const navigate = useNavigate();
  const { openAIChat, sendMessage } = useAI();
  const { progress: userProgress } = useUserProgress();

  // Local Selector Options (e.g. class, board, degree, branch, semester, exam, domain)
  const [selectorOptions, setSelectorOptions] = useState({
    class: '10',
    board: 'CBSE',
    medium: 'English',
    degree: 'B.Tech',
    branch: 'Computer Science',
    semester: 5,
    exam: 'CMAT',
    targetYear: '2026',
    domain: 'Software Development'
  });

  const [activeCustomId, setActiveCustomId] = useState(null);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Priority');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'map'
  const [previewSubject, setPreviewSubject] = useState(null);

  // Sync category reset on learner type change
  useEffect(() => {
    setCategory('All');
  }, [learnerType]);

  // Context Badge (e.g., "Class 10 • CBSE" or "B.Tech • Computer Science • Semester 5")
  const contextBadgeText = curriculumService.getCurriculumContextBadge(learnerType, selectorOptions);
  const categoryTabs = curriculumService.getCategoryTabs(learnerType);
  const primaryRecommendation = curriculumService.getPrimaryRecommendation(learnerType);
  const whatToLearnNext = curriculumService.getWhatToLearnNext(learnerType);
  const mapNodes = curriculumService.getLearningMapNodes(learnerType, userProgress);

  // Filtered Subjects List
  const subjects = curriculumService.getCurriculumSubjects({
    learnerType,
    options: selectorOptions,
    category,
    search,
    sortBy,
    onlyFavorites,
    customCurriculumId: activeCustomId,
    userProgress
  });

  // Sync favorites changes dynamically
  useEffect(() => {
    const handleFavUpdate = () => {
      setSelectorOptions(prev => ({ ...prev }));
    };
    window.addEventListener('edunova_favorites_updated', handleFavUpdate);
    return () => window.removeEventListener('edunova_favorites_updated', handleFavUpdate);
  }, []);

  const handleToggleFavorite = (subjectId) => {
    curriculumService.toggleFavorite(subjectId);
    setSelectorOptions(prev => ({ ...prev }));
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. UNIVERSAL PAGE HEADER WITH 3D GLASS ORB */}
      <EduNovaHeroBanner
        badge={`✦ ${contextBadgeText}`}
        title="Explore Your Curriculum"
        subtitle="Discover subjects, courses, materials, practice and immersive learning tailored to your personalized learning path."
        stats={[
          { label: `${subjects.length}`, subtext: 'Curriculum Tracks', icon: BookOpen, color: '#38bdf8', iconBg: 'rgba(56, 189, 248, 0.25)' },
          { label: 'Level 4', subtext: 'Student XP Rank', icon: Star, color: '#fbbf24', iconBg: 'rgba(251, 191, 36, 0.25)' },
          { label: '3', subtext: 'Learning Goals', isPill: true }
        ]}
      />

      {/* 2. COMPACT CURRICULUM SELECTOR */}
      <CurriculumSelector
        options={selectorOptions}
        onChangeOptions={setSelectorOptions}
        activeCustomId={activeCustomId}
        onSelectCustomCurriculum={setActiveCustomId}
      />

      {/* 3. DUAL SECTION: 🎯 RECOMMENDED FOR YOU & ✨ WHAT SHOULD I LEARN NEXT? */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* 🎯 RECOMMENDED FOR YOU */}
        {primaryRecommendation ? (
          <div style={{
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
            borderRadius: '24px',
            backdropFilter: 'blur(28px)',
            border: isLight ? '1.5px solid rgba(99, 102, 241, 0.4)' : '1.5px solid rgba(99, 102, 241, 0.5)',
            boxShadow: isLight ? '0 16px 40px rgba(99, 102, 241, 0.15), inset 0 1.5px 2px rgba(255, 255, 255, 0.9)' : '0 20px 50px rgba(99, 102, 241, 0.25), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: isLight ? '#4f46e5' : '#818cf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Target size={18} /> 🎯 RECOMMENDED FOR YOU
              </span>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: isLight ? '#18345F' : '#ffffff', margin: '0 0 6px 0' }}>
                {primaryRecommendation.recommendation}
              </h3>
              <p style={{ fontSize: '0.85rem', color: isLight ? '#334155' : '#94a3b8', margin: '0 0 16px 0', lineHeight: 1.5, background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(0,0,0,0.25)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #6366f1' }}>
                {primaryRecommendation.reason}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(`/subjects/${primaryRecommendation.subjectId}`)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Play size={14} /> Continue Topic
              </button>
              <button
                onClick={() => navigate(`/subjects/${primaryRecommendation.subjectId}`)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.08)',
                  border: isLight ? '1px solid rgba(190, 210, 235, 0.9)' : '1px solid var(--border-color)',
                  color: isLight ? '#18345F' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                View Materials
              </button>
            </div>
          </div>
        ) : null}

        {/* ✨ WHAT SHOULD I LEARN NEXT? */}
        {whatToLearnNext ? (
          <div style={{
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
            borderRadius: '24px',
            backdropFilter: 'blur(28px)',
            border: isLight ? '1.5px solid rgba(168, 85, 247, 0.4)' : '1.5px solid rgba(168, 85, 247, 0.5)',
            boxShadow: isLight ? '0 16px 40px rgba(168, 85, 247, 0.15), inset 0 1.5px 2px rgba(255, 255, 255, 0.9)' : '0 20px 50px rgba(168, 85, 247, 0.25), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: isLight ? '#7c3aed' : '#c084fc', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={18} /> ✨ WHAT SHOULD I LEARN NEXT?
              </span>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: isLight ? '#18345F' : '#ffffff', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
                {whatToLearnNext.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: isLight ? '#18345F' : '#cbd5e1', lineHeight: 1.55, margin: '0 0 16px 0', background: isLight ? 'rgba(243, 232, 255, 0.75)' : 'rgba(255, 255, 255, 0.06)', padding: '12px 14px', borderRadius: '12px', borderLeft: '3px solid #a855f7', border: isLight ? '1px solid rgba(216, 180, 254, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)' }}>
                {whatToLearnNext.reason}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  openAIChat();
                  sendMessage(`Explain what I should learn next for ${whatToLearnNext.subjectName} and start a 5-question test.`);
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.35)'
                }}
              >
                <Bot size={15} /> Start AI Recommended Lesson
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* 4. COMPACT SUBJECT COMPARISON PROGRESS BAR ("MY LEARNING") */}
      <div style={{
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
        backdropFilter: 'blur(28px)',
        borderRadius: '24px',
        border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35), inset 0 1.5px 2px rgba(255, 255, 255, 0.9)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)',
        padding: '20px 24px'
      }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="#06b6d4" /> MY LEARNING TELEMETRY OVERVIEW
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {subjects.slice(0, 4).map(s => (
            <div key={s.id} style={{ background: isLight ? 'rgba(240, 246, 255, 0.75)' : 'rgba(15, 23, 42, 0.8)', padding: '10px 14px', borderRadius: '10px', border: isLight ? '1px solid rgba(200, 218, 240, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: isLight ? '#18345F' : '#ffffff' }}>{s.icon} {s.name}</span>
                <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>{s.progress}%</strong>
              </div>
              <ProgressBar progress={s.progress} color={s.color || '#06b6d4'} height={5} />
            </div>
          ))}
        </div>
      </div>

      {/* 5. SEARCH, FILTER TABS, SORT & VIEW SWITCHER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
        backdropFilter: 'blur(28px)',
        padding: '16px 22px',
        borderRadius: '24px',
        border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35), inset 0 1.5px 2px rgba(255, 255, 255, 0.9)' : '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)'
      }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flex: 1,
          minWidth: '240px',
          background: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <Search size={16} color="#06b6d4" />
          <input
            type="text"
            placeholder="Search subjects, chapters, topics, courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', color: isLight ? '#18345F' : '#ffffff', width: '100%', outline: 'none', fontSize: '0.88rem', padding: 0 }}
          />
        </div>

        {/* Dynamic Category Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {categoryTabs.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: category === cat ? (isLight ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))' : 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(99, 102, 241, 0.25))') : (isLight ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.05)'),
                color: category === cat ? (isLight ? '#0284c7' : '#ffffff') : (isLight ? '#52668a' : 'var(--text-secondary)'),
                border: category === cat ? '1px solid #06b6d4' : (isLight ? '1px solid rgba(200, 218, 240, 0.6)' : '1px solid transparent'),
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}

          {/* Favorites Filter Button */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: onlyFavorites ? (isLight ? 'rgba(245, 158, 11, 0.15)' : 'rgba(251, 191, 36, 0.2)') : (isLight ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.05)'),
              color: onlyFavorites ? (isLight ? '#d97706' : '#fbbf24') : (isLight ? '#52668a' : 'var(--text-secondary)'),
              border: onlyFavorites ? '1px solid #fbbf24' : (isLight ? '1px solid rgba(200, 218, 240, 0.6)' : '1px solid transparent'),
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Star size={13} fill={onlyFavorites ? (isLight ? '#d97706' : '#fbbf24') : 'transparent'} /> Saved
          </button>
        </div>

        {/* Sort & View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.9)',
              color: isLight ? '#18345F' : '#ffffff',
              border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.14)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Priority">Sort: Priority</option>
            <option value="Progress">Sort: Highest Progress</option>
            <option value="Needs Attention">Sort: Needs Attention</option>
            <option value="Alphabetical">Sort: Alphabetical</option>
            <option value="Favorites First">Sort: Favorites First</option>
          </select>

          {/* Cards / Learning Map View Switcher */}
          <div style={{ display: 'flex', background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.9)', padding: '3px', borderRadius: 'var(--radius-md)', border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)' }}>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: viewMode === 'cards' ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'transparent',
                color: viewMode === 'cards' ? '#ffffff' : (isLight ? '#52668a' : '#ffffff'),
                border: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Grid size={14} /> Cards
            </button>
            <button
              onClick={() => setViewMode('map')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: viewMode === 'map' ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'transparent',
                color: viewMode === 'map' ? '#ffffff' : (isLight ? '#52668a' : '#ffffff'),
                border: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Map size={14} /> Learning Map
            </button>
          </div>
        </div>
      </div>

      {/* 6. SUBJECT CARDS GRID OR LEARNING MAP VIEW */}
      {viewMode === 'map' ? (
        <LearningMapView nodes={mapNodes} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '22px' }}>
          {subjects.map((s) => (
            <CourseCard
              key={s.id}
              course={s}
              onOpenPreview={(subj) => setPreviewSubject(subj)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {subjects.length === 0 && (
        <div style={{
          background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'rgba(12, 16, 36, 0.8)',
          borderRadius: 'var(--radius-xl)',
          border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : 'none',
          padding: '48px 24px',
          textAlign: 'center'
        }}>
          <BookOpen size={44} color="#06b6d4" style={{ marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff' }}>No matching curriculum subjects found</h3>
          <p style={{ color: isLight ? '#52668a' : 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', maxWidth: '460px', margin: '0 auto 20px' }}>
            Try adjusting your search query, filter tabs, or track selector options above.
          </p>
          <button
            onClick={() => { setSearch(''); setCategory('All'); setOnlyFavorites(false); }}
            style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #06b6d4, #6366f1)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 7. SUBJECT CONTENT PREVIEW MODAL */}
      <SubjectContentPreviewModal
        subject={previewSubject}
        isOpen={Boolean(previewSubject)}
        onClose={() => setPreviewSubject(null)}
      />
    </div>
  );
};

export default CoursesPage;
