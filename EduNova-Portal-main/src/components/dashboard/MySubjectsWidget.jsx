import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { subjectService } from '../../services/subjectService';
import { curriculumService } from '../../services/curriculumService';
import { useTheme } from '../../context/ThemeContext';
import {
  BookOpen,
  ChevronRight,
  Atom,
  FlaskConical,
  Code2,
  Cpu,
  Database,
  Globe,
  Target,
  Brain,
  Layers,
  Server,
  Cloud,
  ArrowRight,
  Dna
} from 'lucide-react';

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

// Robust Icon Renderer to handle Lucide Component, Emoji String, or Fallbacks
const renderSubjectIcon = (iconInput, color, subjectName = '') => {
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

// Track Subject Presets (Matches Image 2 Screen Design)
export const DEFAULT_TRACK_SUBJECTS = {
  school: [
    {
      id: 'math',
      name: 'Mathematics',
      score: 62,
      total: 80,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.25)',
      borderGlow: 'rgba(56, 189, 248, 0.5)',
      icon: SigmaIcon
    },
    {
      id: 'physics',
      name: 'Physics (Science)',
      score: 58,
      total: 80,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.25)',
      borderGlow: 'rgba(245, 158, 11, 0.5)',
      icon: Atom
    },
    {
      id: 'chemistry',
      name: 'Chemistry (Science)',
      score: 52,
      total: 80,
      color: '#34d399',
      bgGlow: 'rgba(52, 211, 153, 0.25)',
      borderGlow: 'rgba(52, 211, 153, 0.5)',
      icon: FlaskConical
    },
    {
      id: 'biology',
      name: 'Biology (Science)',
      score: 66,
      total: 80,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.25)',
      borderGlow: 'rgba(244, 63, 94, 0.5)',
      icon: Dna
    },
    {
      id: 'english',
      name: 'English Language & Literature',
      score: 36,
      total: 80,
      color: '#c084fc',
      bgGlow: 'rgba(192, 132, 252, 0.25)',
      borderGlow: 'rgba(192, 132, 252, 0.5)',
      icon: BookOpen
    },
    {
      id: 'social',
      name: 'Social Science',
      score: 48,
      total: 80,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.25)',
      borderGlow: 'rgba(56, 189, 248, 0.5)',
      icon: Globe
    }
  ],

  college: [
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      score: 72,
      total: 80,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.25)',
      borderGlow: 'rgba(56, 189, 248, 0.5)',
      icon: Code2
    },
    {
      id: 'os',
      name: 'Operating Systems',
      score: 64,
      total: 80,
      color: '#a855f7',
      bgGlow: 'rgba(168, 85, 247, 0.25)',
      borderGlow: 'rgba(168, 85, 247, 0.5)',
      icon: Cpu
    },
    {
      id: 'dbms',
      name: 'Database Management Systems',
      score: 54,
      total: 80,
      color: '#34d399',
      bgGlow: 'rgba(52, 211, 153, 0.25)',
      borderGlow: 'rgba(52, 211, 153, 0.5)',
      icon: Database
    },
    {
      id: 'cn',
      name: 'Computer Networks',
      score: 42,
      total: 80,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.25)',
      borderGlow: 'rgba(245, 158, 11, 0.5)',
      icon: Globe
    },
    {
      id: 'oop',
      name: 'Object-Oriented Programming',
      score: 68,
      total: 80,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.25)',
      borderGlow: 'rgba(244, 63, 94, 0.5)',
      icon: Code2
    },
    {
      id: 'toc',
      name: 'Theory of Computation',
      score: 50,
      total: 80,
      color: '#c084fc',
      bgGlow: 'rgba(192, 132, 252, 0.25)',
      borderGlow: 'rgba(192, 132, 252, 0.5)',
      icon: Brain
    }
  ],

  exam: [
    {
      id: 'quant',
      name: 'Quantitative Aptitude',
      score: 70,
      total: 80,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.25)',
      borderGlow: 'rgba(56, 189, 248, 0.5)',
      icon: Target
    },
    {
      id: 'reasoning',
      name: 'Logical Reasoning & DI',
      score: 62,
      total: 80,
      color: '#a855f7',
      bgGlow: 'rgba(168, 85, 247, 0.25)',
      borderGlow: 'rgba(168, 85, 247, 0.5)',
      icon: Brain
    },
    {
      id: 'verbal',
      name: 'Verbal Ability & Reading',
      score: 50,
      total: 80,
      color: '#34d399',
      bgGlow: 'rgba(52, 211, 153, 0.25)',
      borderGlow: 'rgba(52, 211, 153, 0.5)',
      icon: BookOpen
    },
    {
      id: 'ga',
      name: 'General Awareness',
      score: 44,
      total: 80,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.25)',
      borderGlow: 'rgba(245, 158, 11, 0.5)',
      icon: Globe
    },
    {
      id: 'di_caselets',
      name: 'Data Interpretation',
      score: 58,
      total: 80,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.25)',
      borderGlow: 'rgba(244, 63, 94, 0.5)',
      icon: Target
    },
    {
      id: 'critical',
      name: 'Critical Reasoning',
      score: 52,
      total: 80,
      color: '#c084fc',
      bgGlow: 'rgba(192, 132, 252, 0.25)',
      borderGlow: 'rgba(192, 132, 252, 0.5)',
      icon: Brain
    }
  ],

  skills: [
    {
      id: 'react',
      name: 'React Architecture & Frontend',
      score: 74,
      total: 80,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.25)',
      borderGlow: 'rgba(56, 189, 248, 0.5)',
      icon: Layers
    },
    {
      id: 'node',
      name: 'Node.js & Backend Systems',
      score: 66,
      total: 80,
      color: '#34d399',
      bgGlow: 'rgba(52, 211, 153, 0.25)',
      borderGlow: 'rgba(52, 211, 153, 0.5)',
      icon: Server
    },
    {
      id: 'postgres',
      name: 'PostgreSQL & Databases',
      score: 52,
      total: 80,
      color: '#a855f7',
      bgGlow: 'rgba(168, 85, 247, 0.25)',
      borderGlow: 'rgba(168, 85, 247, 0.5)',
      icon: Database
    },
    {
      id: 'sysdesign',
      name: 'System Design & Microservices',
      score: 40,
      total: 80,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.25)',
      borderGlow: 'rgba(245, 158, 11, 0.5)',
      icon: Cloud
    },
    {
      id: 'devops',
      name: 'Cloud DevOps & Deployment',
      score: 58,
      total: 80,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.25)',
      borderGlow: 'rgba(244, 63, 94, 0.5)',
      icon: Server
    },
    {
      id: 'python_ai',
      name: 'Python & AI/ML Systems',
      score: 62,
      total: 80,
      color: '#c084fc',
      bgGlow: 'rgba(192, 132, 252, 0.25)',
      borderGlow: 'rgba(192, 132, 252, 0.5)',
      icon: Code2
    }
  ]
};

export const MySubjectsWidget = ({
  trackType = 'school',
  customSubjects = null,
  title = 'My Subjects',
  onViewAllClick = null
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  // State trigger for live re-renders
  const [, setUpdateTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setUpdateTick(prev => prev + 1);
    window.addEventListener('edunova_curriculum_updated', handleUpdate);
    window.addEventListener('edunova_subject_updated', handleUpdate);
    return () => {
      window.removeEventListener('edunova_curriculum_updated', handleUpdate);
      window.removeEventListener('edunova_subject_updated', handleUpdate);
    };
  }, []);

  // Fetch live subjects dynamically
  const normalizedTrack = (trackType || 'school').toLowerCase();
  const liveSubjects = subjectService.getSelectedSubjects(normalizedTrack);
  const curriculumSubjects = curriculumService.getCurriculumSubjects({ learnerType: normalizedTrack });

  // Select subjects array based on custom data matching trackType or fallbacks
  const filteredCustomSubjects = (customSubjects && Array.isArray(customSubjects) && customSubjects.length > 0)
    ? customSubjects.filter(sub => {
        const subTrack = (sub.educationType || sub.subject?.educationType || sub.track || '').toLowerCase();
        return !subTrack || subTrack === normalizedTrack;
      })
    : null;

  const rawList = (filteredCustomSubjects && filteredCustomSubjects.length > 0)
    ? filteredCustomSubjects
    : (curriculumSubjects.length > 0 ? curriculumSubjects : (liveSubjects.length > 0 ? liveSubjects : DEFAULT_TRACK_SUBJECTS[normalizedTrack] || DEFAULT_TRACK_SUBJECTS.school));

  const subjectList = rawList.map((sub, idx) => {
    const subData = sub.subject || sub;
    const defaultIconMap = [SigmaIcon, Atom, FlaskConical, Dna, BookOpen, Globe];
    const defaultColorMap = ['#38bdf8', '#f59e0b', '#34d399', '#f43f5e', '#c084fc', '#38bdf8'];
    const defaultBgs = ['rgba(56, 189, 248, 0.25)', 'rgba(245, 158, 11, 0.25)', 'rgba(52, 211, 153, 0.25)', 'rgba(244, 63, 94, 0.25)', 'rgba(192, 132, 252, 0.25)', 'rgba(56, 189, 248, 0.25)'];

    const chosenColor = subData.color || sub.color || defaultColorMap[idx % defaultColorMap.length];
    
    return {
      id: subData.id || subData.name || `sub-${idx}`,
      name: subData.name || sub.name || 'Subject',
      score: typeof sub.score === 'number' ? sub.score : (typeof sub.progress === 'number' ? Math.round((sub.progress / 100) * 80) : 0),
      total: sub.total || 80,
      color: chosenColor,
      bgGlow: sub.bgGlow || defaultBgs[idx % defaultBgs.length],
      borderGlow: sub.borderGlow || chosenColor,
      icon: sub.icon || defaultIconMap[idx % defaultIconMap.length]
    };
  });

  const handleViewAll = () => {
    if (onViewAllClick) {
      onViewAllClick();
    } else {
      navigate('/my-subjects');
    }
  };

  return (
    <div
      style={{
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 246, 255, 0.88) 100%)'
          : 'linear-gradient(135deg, rgba(20, 28, 60, 0.75) 0%, rgba(12, 17, 40, 0.88) 100%)',
        backdropFilter: 'blur(32px) saturate(190%) contrast(105%)',
        WebkitBackdropFilter: 'blur(32px) saturate(190%) contrast(105%)',
        border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '26px',
        padding: '24px 28px',
        boxShadow: isLight
          ? '0 20px 50px rgba(64, 100, 160, 0.12), inset 0 1.5px 2px rgba(255, 255, 255, 1)'
          : '0 25px 60px rgba(0, 0, 0, 0.5), inset 0 1px 1.5px rgba(255, 255, 255, 0.25)',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Top Bar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '14px',
            background: isLight ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.18), rgba(99, 102, 241, 0.18))' : 'linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(139, 92, 246, 0.25))',
            border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(56, 189, 248, 0.25)'
          }}>
            <BookOpen size={20} color={isLight ? '#0284c7' : '#38bdf8'} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0, letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
              {title}
            </h3>
            <span style={{ fontSize: '0.74rem', color: isLight ? '#0284c7' : '#94a3b8', fontWeight: 700, display: 'block', marginTop: '1px' }}>
              Curriculum & Mastery Radar
            </span>
          </div>
        </div>

        <button
          onClick={handleViewAll}
          style={{
            background: isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(255, 255, 255, 0.08)',
            border: isLight ? '1px solid rgba(2, 132, 199, 0.2)' : '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '9999px',
            padding: '8px 16px',
            color: isLight ? '#0284c7' : '#38bdf8',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.background = isLight ? 'rgba(2, 132, 199, 0.15)' : 'rgba(56, 189, 248, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(255, 255, 255, 0.08)';
          }}
        >
          View All <ArrowRight size={14} />
        </button>
      </div>

      {/* Grid of Subject Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px'
      }}>
        {subjectList.map((subject) => {
          const percent = Math.min(100, Math.round((subject.score / subject.total) * 100));

          return (
            <motion.div
              key={subject.id || subject.name}
              whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.2 } }}
              onClick={() => navigate(`/subjects/${subject.id}`)}
              style={{
                background: isLight
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(240, 246, 255, 0.82) 100%)'
                  : 'linear-gradient(135deg, rgba(25, 35, 75, 0.65) 0%, rgba(15, 20, 48, 0.78) 100%)',
                border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '22px',
                padding: '20px',
                cursor: 'pointer',
                backdropFilter: 'blur(20px)',
                boxShadow: isLight
                  ? '0 12px 30px rgba(64, 100, 160, 0.1), inset 0 1.5px 2px rgba(255, 255, 255, 1)'
                  : '0 16px 40px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Card Header Row: Icon Circle + Chevron */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: subject.bgGlow,
                  border: `1.5px solid ${subject.borderGlow}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 20px ${subject.bgGlow}`
                }}>
                  {renderSubjectIcon(subject.icon, subject.color, subject.name)}
                </div>
                <ChevronRight size={18} color={isLight ? '#0284c7' : '#94a3b8'} />
              </div>

              {/* Subject Title */}
              <h4 style={{
                fontSize: '1.08rem',
                fontWeight: 900,
                color: isLight ? '#0f172a' : '#ffffff',
                margin: '0 0 16px 0',
                letterSpacing: '-0.01em',
                lineHeight: 1.25,
                fontFamily: 'var(--font-heading)'
              }}>
                {subject.name}
              </h4>

              {/* Progress Bar & Score */}
              <div>
                <div style={{
                  width: '100%',
                  height: '7px',
                  background: isLight ? 'rgba(200, 218, 240, 0.6)' : 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    width: `${percent}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${subject.color} 0%, #6366f1 50%, #a855f7 100%)`,
                    borderRadius: '9999px',
                    boxShadow: `0 0 12px ${subject.color}`
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 800 }}>
                  <span style={{ color: isLight ? '#475569' : '#94a3b8' }}>
                    {subject.score} / {subject.total} pts
                  </span>
                  <span style={{ color: subject.color, fontWeight: 900 }}>
                    {percent}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MySubjectsWidget;
