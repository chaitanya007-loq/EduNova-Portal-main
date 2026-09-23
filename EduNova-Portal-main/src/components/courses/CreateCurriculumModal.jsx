import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Trash2 } from 'lucide-react';
import { curriculumService } from '../../services/curriculumService';
import { useTheme } from '../../context/ThemeContext';

export const CreateCurriculumModal = ({ isOpen, onClose, onCurriculumCreated }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [title, setTitle] = useState('');
  const [educationType, setEducationType] = useState('skills');
  const [level, setLevel] = useState('Class 10');
  const [boardOrDegree, setBoardOrDegree] = useState('CBSE Board');
  const [subjects, setSubjects] = useState([
    {
      name: '',
      description: '',
      icon: '📐',
      targetScore: 90
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddSubjectField = () => {
    const icons = ['⚡', '🧪', '📐', '💻', '📊', '🧠', '🧬', '🚀', '🌐'];
    const randomIcon = icons[subjects.length % icons.length];
    setSubjects([
      ...subjects,
      { name: '', description: '', icon: randomIcon, targetScore: 90 }
    ]);
  };

  const handleRemoveSubjectField = (index) => {
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    // Filter out empty subject names
    const validSubjects = subjects.filter(s => s.name.trim() !== '');
    if (validSubjects.length === 0) {
      validSubjects.push({
        name: `${title} Core Module`,
        description: `Fundamental practice and interactive quizzes for ${title}.`,
        icon: '📚',
        targetScore: 90
      });
    }

    const curriculumId = `custom_curriculum_${Date.now()}`;

    // Map into full subject objects
    const createdSubjects = validSubjects.map((sub, idx) => ({
      id: `${curriculumId}_sub_${idx + 1}`,
      name: sub.name,
      category: educationType.toUpperCase(),
      educationType: educationType,
      class: level,
      board: boardOrDegree,
      degree: boardOrDegree,
      medium: 'English',
      description: sub.description || `Master key topics in ${sub.name}.`,
      shortDescription: sub.description || `Master core concepts of ${sub.name}.`,
      icon: sub.icon || '📚',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
      color: idx % 2 === 0 ? '#06b6d4' : '#6366f1',
      chaptersCount: 8,
      questionsCount: 200,
      flashcardsCount: 50,
      notesCount: 15,
      videosCount: 18,
      quizzesCount: 10,
      interactiveCount: 3,
      progress: 0,
      targetScore: Number(sub.targetScore) || 90,
      difficulty: 'Custom Track',
      priority: 'High',
      syllabusCoverage: 0,
      hasInteractiveLab: true,
      aiEnabled: true,
      favorite: true,
      currentTopic: `${sub.name} Fundamentals`,
      weakTopic: `Advanced ${sub.name} Applications`,
      nextActivity: '10 Question Diagnostic Quiz',
      nextRecommendedTopic: `${sub.name} Diagnostic Benchmark`
    }));

    const newCurriculum = {
      id: curriculumId,
      title: title.trim(),
      label: `✨ ${title.trim()}`,
      educationType: educationType,
      level: level,
      boardOrDegree: boardOrDegree,
      subjects: createdSubjects,
      createdAt: new Date().toISOString()
    };

    curriculumService.addCustomCurriculum(newCurriculum);

    setIsSubmitting(false);
    if (onCurriculumCreated) {
      onCurriculumCreated(newCurriculum);
    }
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(8, 12, 28, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '88vh',
          overflowY: 'auto',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 249, 255, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(20, 26, 58, 0.96) 0%, rgba(10, 14, 34, 0.98) 100%)',
          borderRadius: '28px',
          border: isLight ? '1.5px solid rgba(210, 225, 250, 0.95)' : '1.5px solid rgba(99, 102, 241, 0.4)',
          boxShadow: isLight
            ? '0 25px 60px rgba(15, 23, 42, 0.22), 0 0 40px rgba(56, 189, 248, 0.15)'
            : '0 30px 80px rgba(0, 0, 0, 0.75), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
          padding: '32px'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)',
            border: isLight ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.18)',
            color: isLight ? '#475569' : '#ffffff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 700,
            transition: 'all 0.2s ease'
          }}
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)',
            flexShrink: 0
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0, fontFamily: 'var(--font-heading)' }}>
              Create Custom Curriculum
            </h2>
            <span style={{ fontSize: '0.82rem', color: isLight ? '#475569' : '#94a3b8' }}>
              Design a personalized track with custom subjects & AI diagnostic targets
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Curriculum Title */}
          <div>
            <label style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
              Curriculum / Track Title <span style={{ color: '#fb7185' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AI & Robotics FastTrack, Class 12 CBSE Special, GATE CS 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                fontSize: '0.9rem',
                padding: '12px 16px',
                background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.9)',
                color: isLight ? '#0f172a' : '#ffffff',
                border: isLight ? '1px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '12px',
                outline: 'none',
                boxSizing: 'border-box',
                fontWeight: 600
              }}
            />
          </div>

          {/* Education Category & Level */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: isLight ? '#475569' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                Category Type
              </label>
              <select
                value={educationType}
                onChange={(e) => setEducationType(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '0.85rem',
                  padding: '10px 14px',
                  background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.9)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  border: isLight ? '1px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <option value="school">🏫 School Track</option>
                <option value="college">🎓 College Track</option>
                <option value="exam">📝 Exam Prep Track</option>
                <option value="skills">💻 Skills & Career Track</option>
                <option value="custom">✨ Custom Track</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: isLight ? '#475569' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                Level / Target Grade
              </label>
              <input
                type="text"
                placeholder="e.g. Class 10, B.Tech Sem 6, Advanced"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '0.85rem',
                  padding: '10px 14px',
                  background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.9)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  border: isLight ? '1px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontWeight: 600
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: isLight ? '#475569' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                Board / Branch / Exam
              </label>
              <input
                type="text"
                placeholder="e.g. CBSE, Computer Science, GATE"
                value={boardOrDegree}
                onChange={(e) => setBoardOrDegree(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '0.85rem',
                  padding: '10px 14px',
                  background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.9)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  border: isLight ? '1px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontWeight: 600
                }}
              />
            </div>
          </div>

          {/* Dynamic Subjects List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#cbd5e1', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>
                Curriculum Subjects ({subjects.length})
              </label>
              <button
                type="button"
                onClick={handleAddSubjectField}
                style={{
                  background: isLight ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.2)',
                  border: isLight ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(99, 102, 241, 0.4)',
                  color: isLight ? '#4f46e5' : '#a5b4fc',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={14} /> Add Subject
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {subjects.map((sub, index) => (
                <div
                  key={index}
                  style={{
                    background: isLight ? 'rgba(240, 246, 255, 0.7)' : 'rgba(255, 255, 255, 0.04)',
                    border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Icon (e.g. ⚡, 🤖)"
                      value={sub.icon}
                      onChange={(e) => handleSubjectChange(index, 'icon', e.target.value)}
                      style={{
                        width: '52px',
                        textAlign: 'center',
                        fontSize: '1.1rem',
                        padding: '8px',
                        background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.9)',
                        color: isLight ? '#0f172a' : '#ffffff',
                        border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                        borderRadius: '10px'
                      }}
                    />
                    <input
                      type="text"
                      placeholder={`Subject ${index + 1} Name (e.g. Deep Learning)`}
                      value={sub.name}
                      onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                      style={{
                        flex: 1,
                        fontSize: '0.88rem',
                        padding: '8px 14px',
                        background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.9)',
                        color: isLight ? '#0f172a' : '#ffffff',
                        border: isLight ? '1px solid rgba(210, 225, 250, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                        borderRadius: '10px',
                        fontWeight: 600
                      }}
                    />
                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubjectField(index)}
                        style={{
                          background: 'rgba(244, 63, 94, 0.12)',
                          border: '1px solid rgba(244, 63, 94, 0.25)',
                          color: '#e11d48',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Short topic description (e.g. Neural Networks, Transformers & Computer Vision)"
                    value={sub.description}
                    onChange={(e) => handleSubjectChange(index, 'description', e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '0.82rem',
                      padding: '8px 14px',
                      background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.8)',
                      color: isLight ? '#334155' : '#cbd5e1',
                      border: isLight ? '1px solid rgba(210, 225, 250, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '999px',
                background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                border: isLight ? '1px solid rgba(210, 225, 250, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
                color: isLight ? '#475569' : '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              style={{
                padding: '10px 24px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(6, 182, 212, 0.4)'
              }}
            >
              <Sparkles size={16} /> ✨ Create & Activate Curriculum
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
