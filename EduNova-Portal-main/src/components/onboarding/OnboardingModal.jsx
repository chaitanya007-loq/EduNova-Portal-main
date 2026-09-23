import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ArrowRight, ArrowLeft, School, GraduationCap, Laptop, BookOpenCheck, X } from 'lucide-react';
import { useLearner } from '../../context/LearnerContext';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/userService';
import { SCHOOL_BOARDS, SCHOOL_CLASSES } from '../../data/schoolCurriculum';
import { COLLEGE_DEGREES, COLLEGE_BRANCHES, COLLEGE_SEMESTERS } from '../../data/collegeCurriculum';
import { EXAM_TYPES } from '../../data/examData';

export const OnboardingModal = ({ isOpen, onClose }) => {
  const { updateLearnerType } = useLearner();
  const { updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('college');

  // Step 2 Form States
  // School
  const [board, setBoard] = useState('CBSE');
  const [schoolClass, setSchoolClass] = useState('Class 10');
  const [schoolSubjects, setSchoolSubjects] = useState(['Mathematics', 'Science', 'English']);

  // College
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science & Engineering (CSE)');
  const [year, setYear] = useState('2nd Year');
  const [semester, setSemester] = useState('Semester 4');
  const [collegeSubjects, setCollegeSubjects] = useState(['DBMS', 'Operating Systems', 'Computer Networks']);

  // Skills
  const [skillTech, setSkillTech] = useState(['React.js', 'JavaScript']);
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [skillGoal, setSkillGoal] = useState('Build projects');

  // Exam
  const [examName, setExamName] = useState('CMAT 2026 Entrance Examination');
  const [targetScore, setTargetScore] = useState('95+ Percentile');
  const [studyHours, setStudyHours] = useState('3-4 Hours');

  if (!isOpen) return null;

  const handleFinish = async () => {
    let extra = {};

    if (selectedType === 'school') {
      extra = {
        education: {
          board,
          class: schoolClass,
          subjects: schoolSubjects
        }
      };
    } else if (selectedType === 'college') {
      extra = {
        education: {
          degree,
          branch,
          year,
          semester,
          subjects: collegeSubjects.map(s => ({ name: s, progress: 65 }))
        }
      };
    } else if (selectedType === 'skills') {
      extra = {
        currentSkill: skillTech.join(' & '),
        skillLevel,
        careerGoal: skillGoal
      };
    } else if (selectedType === 'exam') {
      extra = {
        examDetails: {
          examName,
          targetPercentile: targetScore,
          dailyTargetHours: studyHours
        }
      };
    }

    if (updateUser) {
      updateUser({
        learnerType: selectedType.toUpperCase(),
        ...(extra?.education?.board && { board: extra.education.board }),
        ...(extra?.education?.degree && { degree: extra.education.degree }),
      });
    }

    updateLearnerType(selectedType, extra);

    try {
      await updateUserProfile({
        learnerType: selectedType.toUpperCase(),
        board: extra?.education?.board || undefined,
        degree: extra?.education?.degree || undefined,
        education: extra?.education || undefined
      });
    } catch (e) {
      console.warn('Backend learner type notice:', e.message);
    }

    if (onClose) onClose();
  };

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '680px',
          width: '100%',
          padding: '36px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          position: 'relative'
        }}
      >
        {onClose && (
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        )}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="cyber-badge-cyan" style={{ marginBottom: '10px', fontSize: '0.8rem' }}>
            <Sparkles size={14} /> Personalization Engine
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Let's personalize your EduNova.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Tell us a little about what you're learning so we can build your learning experience.
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '30px' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: step >= 1 ? 'var(--accent-cyan)' : 'var(--bg-tertiary)' }} />
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: step >= 2 ? 'var(--accent-cyan)' : 'var(--bg-tertiary)' }} />
        </div>

        {/* STEP 1: Select Learner Type */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)', textAlign: 'center' }}>
              What type of learner are you?
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '30px' }}>
              {[
                { id: 'school', title: '🏫 School Student', desc: 'Class 6 - 12 (CBSE, ICSE, State Board)', icon: School, color: '#06b6d4' },
                { id: 'college', title: '🎓 College Student', desc: 'B.Tech, BCA, B.Sc, BBA, MCA Degree', icon: GraduationCap, color: '#6366f1' },
                { id: 'skills', title: '💻 Skill / Career Learner', desc: 'React, AI/ML, Web Dev, Projects & Jobs', icon: Laptop, color: '#a855f7' },
                { id: 'exam', title: '📝 Exam Preparation', desc: 'CMAT, JEE, NEET, GATE, Entrance Exams', icon: BookOpenCheck, color: '#f59e0b' }
              ].map((card) => {
                const isSelected = selectedType === card.id;
                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedType(card.id)}
                    style={{
                      padding: '20px',
                      borderRadius: 'var(--radius-lg)',
                      background: isSelected ? 'var(--glass-bg-hover)' : 'var(--glass-bg)',
                      border: isSelected ? `2px solid ${card.color}` : '1px solid var(--border-color)',
                      boxShadow: isSelected ? `0 0 20px ${card.color}40` : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      {card.title}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.98rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Continue to Details <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: Dynamic Form Based on Selection */}
        {step === 2 && (
          <div>
            {/* SCHOOL FORM */}
            {selectedType === 'school' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Select Board</label>
                  <select value={board} onChange={(e) => setBoard(e.target.value)} style={{ width: '100%' }}>
                    {SCHOOL_BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Select Class / Standard</label>
                  <select value={schoolClass} onChange={(e) => setSchoolClass(e.target.value)} style={{ width: '100%' }}>
                    {SCHOOL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>Select Subjects (Multiple)</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Mathematics', 'Science', 'English', 'Social Science', 'Computer Science', 'Physics', 'Chemistry', 'Biology'].map(sub => {
                      const sel = schoolSubjects.includes(sub);
                      return (
                        <span
                          key={sub}
                          onClick={() => toggleSelection(sub, schoolSubjects, setSchoolSubjects)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: sel ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-tertiary)',
                            color: sel ? '#38bdf8' : 'var(--text-secondary)',
                            border: sel ? '1px solid #06b6d4' : '1px solid var(--border-color)'
                          }}
                        >
                          {sel ? '✓ ' : '+ '}{sub}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* COLLEGE FORM */}
            {selectedType === 'college' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Degree</label>
                    <select value={degree} onChange={(e) => setDegree(e.target.value)} style={{ width: '100%' }}>
                      {COLLEGE_DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Semester</label>
                    <select value={semester} onChange={(e) => setSemester(e.target.value)} style={{ width: '100%' }}>
                      {COLLEGE_SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Branch / Specialization</label>
                  <select value={branch} onChange={(e) => setBranch(e.target.value)} style={{ width: '100%' }}>
                    {COLLEGE_BRANCHES.map(br => <option key={br} value={br}>{br}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>Current Semester Subjects</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['DBMS', 'Operating Systems', 'Computer Networks', 'Software Engineering', 'Data Structures', 'Web Dev', 'AI'].map(sub => {
                      const sel = collegeSubjects.includes(sub);
                      return (
                        <span
                          key={sub}
                          onClick={() => toggleSelection(sub, collegeSubjects, setCollegeSubjects)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: sel ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-tertiary)',
                            color: sel ? '#818cf8' : 'var(--text-secondary)',
                            border: sel ? '1px solid #6366f1' : '1px solid var(--border-color)'
                          }}
                        >
                          {sel ? '✓ ' : '+ '}{sub}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SKILLS FORM */}
            {selectedType === 'skills' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>What do you want to learn?</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['React', 'JavaScript', 'Python', 'AI & Machine Learning', 'Data Science', 'UI/UX Design', 'Cloud & DevOps'].map(sk => {
                      const sel = skillTech.includes(sk);
                      return (
                        <span
                          key={sk}
                          onClick={() => toggleSelection(sk, skillTech, setSkillTech)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: sel ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-tertiary)',
                            color: sel ? '#c084fc' : 'var(--text-secondary)',
                            border: sel ? '1px solid #a855f7' : '1px solid var(--border-color)'
                          }}
                        >
                          {sel ? '✓ ' : '+ '}{sk}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Current Skill Level</label>
                  <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} style={{ width: '100%' }}>
                    <option value="Beginner">Beginner (Starting from scratch)</option>
                    <option value="Intermediate">Intermediate (Know fundamentals)</option>
                    <option value="Advanced">Advanced (Looking to build production apps)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Primary Goal</label>
                  <input
                    type="text"
                    value={skillGoal}
                    onChange={(e) => setSkillGoal(e.target.value)}
                    placeholder="e.g. Build projects, Get an internship, Full Stack Developer"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}

            {/* EXAM FORM */}
            {selectedType === 'exam' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Target Exam</label>
                  <select value={examName} onChange={(e) => setExamName(e.target.value)} style={{ width: '100%' }}>
                    {EXAM_TYPES.map(ex => <option key={ex.id} value={ex.name}>{ex.name}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Target Score / Percentile</label>
                    <input type="text" value={targetScore} onChange={(e) => setTargetScore(e.target.value)} placeholder="e.g. 95+ Percentile" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>Daily Study Hours</label>
                    <select value={studyHours} onChange={(e) => setStudyHours(e.target.value)} style={{ width: '100%' }}>
                      <option value="2-3 Hours">2-3 Hours</option>
                      <option value="3-4 Hours">3-4 Hours</option>
                      <option value="5+ Hours">5+ Hours</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <button
                onClick={handleFinish}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)'
                }}
              >
                Save & Build Dashboard <Check size={18} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
