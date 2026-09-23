import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Target, Sparkles, Plus, Check } from 'lucide-react';
import { useLearner } from '../../context/LearnerContext';
import { useTheme } from '../../context/ThemeContext';
import { curriculumService } from '../../services/curriculumService';
import { CreateCurriculumModal } from './CreateCurriculumModal';

export const CurriculumSelector = ({ options, onChangeOptions, activeCustomId, onSelectCustomCurriculum }) => {
  const { learnerType, updateLearnerType } = useLearner();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [customCurriculums, setCustomCurriculums] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load custom curriculums & listen for updates
  useEffect(() => {
    const loadCurriculums = () => {
      setCustomCurriculums(curriculumService.getCustomCurriculums());
    };
    loadCurriculums();

    window.addEventListener('edunova_curriculum_updated', loadCurriculums);
    return () => {
      window.removeEventListener('edunova_curriculum_updated', loadCurriculums);
    };
  }, []);

  const handleTrackChange = (newType) => {
    if (onSelectCustomCurriculum) {
      onSelectCustomCurriculum(null);
    }
    updateLearnerType(newType);
  };

  const handleCustomCurriculumSelect = (customCurr) => {
    if (onSelectCustomCurriculum) {
      onSelectCustomCurriculum(customCurr.id);
    }
    // Update learner type to match custom curriculum education type
    if (customCurr.educationType) {
      updateLearnerType(customCurr.educationType);
    }
  };

  const handleCurriculumCreated = (newCurriculum) => {
    setCustomCurriculums(curriculumService.getCustomCurriculums());
    if (onSelectCustomCurriculum) {
      onSelectCustomCurriculum(newCurriculum.id);
    }
  };

  // Base track list matching user's active dashboard track
  const baseTracks = [
    { id: 'school', label: '🏫 School', desc: 'CBSE / ICSE' },
    { id: 'college', label: '🎓 College', desc: 'Degree & Semesters' },
    { id: 'exam', label: '📝 Exam Prep', desc: 'CMAT / GATE / JEE' },
    { id: 'skills', label: '💻 Skills & Career', desc: 'Full Stack & AI' }
  ];

  // Only display the track pill matching the active dashboard track
  const activeTrack = baseTracks.find(t => t.id === learnerType) || baseTracks[0];
  const baseTracksToDisplay = [activeTrack];

  return (
    <div style={{
      background: isLight ? 'rgba(255, 255, 255, 0.82)' : 'rgba(12, 16, 36, 0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRadius: 'var(--radius-xl)',
      border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      boxShadow: isLight ? '0 10px 30px rgba(100, 130, 200, 0.12)' : '0 10px 30px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Top Track Switcher Pills Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={16} color="#06b6d4" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isLight ? '#18345F' : '#ffffff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Education Path Selector
          </span>

          {/* Active Dashboard Track Badge */}
          <span style={{
            fontSize: '0.72rem',
            padding: '3px 10px',
            borderRadius: '999px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#0284c7',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            🎯 Active Dashboard Track: {
              learnerType === 'college'
                ? `College (${options?.degree || 'B.Tech'}${options?.branch ? ' • ' + options.branch : ''})`
                : learnerType === 'exam'
                ? `Exam Prep (${options?.exam || 'JEE Main & Advanced'})`
                : learnerType === 'skills'
                ? `Skills & Career (${options?.domain || 'Software Development'})`
                : `School (Class ${options?.class || '10'}${options?.board ? ' • ' + options.board : ''})`
            }
          </span>
        </div>

        {/* Track Switcher Pills Row + Create Curriculum Button */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {baseTracksToDisplay.map(track => {
            const isSelected = !activeCustomId && learnerType === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handleTrackChange(track.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: isSelected ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : (isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(255, 255, 255, 0.05)'),
                  color: isSelected ? '#ffffff' : (isLight ? '#5D7192' : 'var(--text-secondary)'),
                  border: isSelected ? 'none' : (isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid var(--border-color)'),
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(6, 182, 212, 0.35)' : 'none'
                }}
              >
                {track.label}
              </button>
            );
          })}

          {/* Dynamic User Custom Curriculums */}
          {customCurriculums.map(c => {
            const isSelected = activeCustomId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleCustomCurriculumSelect(c)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: isSelected ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'rgba(236, 72, 153, 0.12)',
                  color: isSelected ? '#ffffff' : '#f472b6',
                  border: isSelected ? 'none' : '1px solid rgba(236, 72, 153, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(236, 72, 153, 0.4)' : 'none'
                }}
              >
                {c.label || `✨ ${c.title}`}
              </button>
            );
          })}

          {/* + Create Curriculum Action Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(6, 182, 212, 0.25))',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.2)'
            }}
          >
            <Plus size={14} /> Create Curriculum
          </button>
        </div>
      </div>

      {/* Dynamic Sub-Option Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        paddingTop: '12px',
        borderTop: isLight ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* SCHOOL TRACK SELECTORS */}
        {!activeCustomId && learnerType === 'school' && (
          <>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Education</label>
              <select value="School" disabled style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(235, 243, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.12)', borderRadius: '8px' }}>
                <option>School</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Class</label>
              <select
                value={options.class || '10'}
                onChange={(e) => onChangeOptions({ ...options, class: e.target.value })}
                style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.14)', borderRadius: '8px', cursor: 'pointer' }}
              >
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Board</label>
              <select
                value={options.board || 'CBSE'}
                onChange={(e) => onChangeOptions({ ...options, board: e.target.value })}
                style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.14)', borderRadius: '8px', cursor: 'pointer' }}
              >
                <option value="CBSE">CBSE Board</option>
                <option value="ICSE">ICSE Board</option>
                <option value="State Board">State Board</option>
                <option value="IB">IB International</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Medium</label>
              <select
                value={options.medium || 'English'}
                onChange={(e) => onChangeOptions({ ...options, medium: e.target.value })}
                style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.14)', borderRadius: '8px', cursor: 'pointer' }}
              >
                <option value="English">English Medium</option>
                <option value="Hindi">Hindi Medium</option>
              </select>
            </div>
          </>
        )}

        {/* COLLEGE TRACK SELECTORS */}
        {!activeCustomId && learnerType === 'college' && (
          <>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Education</label>
              <select value="College" disabled style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(235, 243, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.12)', borderRadius: '8px' }}>
                <option>College / University</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Degree</label>
              <select
                value={options.degree || 'B.Tech'}
                onChange={(e) => onChangeOptions({ ...options, degree: e.target.value })}
                style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.14)', borderRadius: '8px', cursor: 'pointer' }}
              >
                <option value="B.Tech">B.Tech</option>
                <option value="BCA">BCA</option>
                <option value="BBA">BBA</option>
                <option value="B.Sc">B.Sc Computer Science</option>
                <option value="MBA">MBA</option>
                <option value="M.Tech">M.Tech</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Branch</label>
              <select
                value={options.branch || 'Computer Science'}
                onChange={(e) => onChangeOptions({ ...options, branch: e.target.value })}
                style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.14)', borderRadius: '8px', cursor: 'pointer' }}
              >
                <option value="Computer Science">Computer Science & Eng</option>
                <option value="Information Technology">Information Tech</option>
                <option value="Electronics">Electronics & Comm</option>
                <option value="Finance">Finance & Accounting</option>
                <option value="Marketing">Marketing & Analytics</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Semester</label>
              <select
                value={options.semester || 5}
                onChange={(e) => onChangeOptions({ ...options, semester: Number(e.target.value) })}
                style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.14)', borderRadius: '8px', cursor: 'pointer' }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* EXAM TRACK SELECTORS */}
        {!activeCustomId && learnerType === 'exam' && (
          <>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Category</label>
              <select value="Exam Preparation" disabled style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(235, 243, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.12)', borderRadius: '8px' }}>
                <option>Exam Preparation</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Exam</label>
              <select
                value={options.exam || 'CMAT'}
                onChange={(e) => onChangeOptions({ ...options, exam: e.target.value })}
                style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.14)', borderRadius: '8px', cursor: 'pointer' }}
              >
                <option value="CMAT">CMAT</option>
                <option value="CAT">CAT</option>
                <option value="GATE">GATE Computer Science</option>
                <option value="JEE">JEE Main & Advanced</option>
                <option value="NEET">NEET Medical</option>
                <option value="UPSC">UPSC Civil Services</option>
                <option value="Banking">Banking PO & Clerk</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Target Year</label>
              <select
                value={options.targetYear || '2026'}
                onChange={(e) => onChangeOptions({ ...options, targetYear: e.target.value })}
                style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.14)', borderRadius: '8px', cursor: 'pointer' }}
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
          </>
        )}

        {/* SKILLS TRACK SELECTORS */}
        {!activeCustomId && learnerType === 'skills' && (
          <>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Category</label>
              <select value="Skills & Career" disabled style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(235, 243, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.12)', borderRadius: '8px' }}>
                <option>Skills & Career</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Domain</label>
              <select
                value={options.domain || 'Software Development'}
                onChange={(e) => onChangeOptions({ ...options, domain: e.target.value })}
                style={{ width: '100%', fontSize: '0.82rem', padding: '6px 10px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)', color: isLight ? '#18345F' : '#fff', border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255,255,255,0.14)', borderRadius: '8px', cursor: 'pointer' }}
              >
                <option value="Software Development">Full Stack Development</option>
                <option value="Web Development">Frontend & Web Engineering</option>
                <option value="Data Science">Data Science & AI</option>
                <option value="AI / ML">Machine Learning & LLMs</option>
                <option value="UI/UX Design">UI/UX & Product Design</option>
                <option value="Cloud Computing">Cloud & DevOps</option>
              </select>
            </div>
          </>
        )}

        {/* CUSTOM CURRICULUM BANNER */}
        {activeCustomId && (
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '10px 14px', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#f472b6', fontWeight: 700 }}>
              ✨ Custom Curriculum Selected — Showing personalized subjects dynamically created by you.
            </span>
            <button
              onClick={() => onSelectCustomCurriculum && onSelectCustomCurriculum(null)}
              style={{ background: 'none', border: 'none', color: isLight ? '#18345F' : '#ffffff', fontSize: '0.78rem', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Reset to Track Defaults
            </button>
          </div>
        )}
      </div>

      {/* CREATE CURRICULUM MODAL */}
      <CreateCurriculumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCurriculumCreated={handleCurriculumCreated}
      />
    </div>
  );
};

export default CurriculumSelector;
