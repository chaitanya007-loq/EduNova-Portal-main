import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLearner } from '../../context/LearnerContext';
import { learnerApi, subjectApi } from '../../lib/apiClient';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Rocket,
  Target,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Search,
  User,
  Mail,
  Phone,
  AtSign,
  Building,
  School,
  Award,
  Layers,
  Calendar,
  Clock,
  Briefcase,
  HelpCircle
} from 'lucide-react';
import { LEARNER_TYPES } from '../../data/learners';

export const OnboardingPage = () => {
  const { user, updateUser, hydrateSession } = useAuth();
  const { updateLearnerType } = useLearner();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Basic Info
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.studentUsername || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Step 2: Education Type
  const [selectedType, setSelectedType] = useState(user?.learnerType?.toLowerCase() || 'school');

  // Step 3: Smart Conditional Questions
  // School
  const [schoolName, setSchoolName] = useState('');
  const [board, setBoard] = useState('CBSE');
  const [standard, setStandard] = useState('10');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [skipGrade, setSkipGrade] = useState(true);
  const [currentGrade, setCurrentGrade] = useState('');

  // College
  const [collegeName, setCollegeName] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science');
  const [collegeYear, setCollegeYear] = useState('2nd Year');
  const [semester, setSemester] = useState(3);
  const [currentCgpa, setCurrentCgpa] = useState('');
  const [targetCgpa, setTargetCgpa] = useState('9.0');

  // Skills
  const [primarySkill, setPrimarySkill] = useState('Web Development');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [careerGoal, setCareerGoal] = useState('Full Stack Engineer');
  const [learningStyle, setLearningStyle] = useState('Interactive Labs & Projects');
  const [weeklyHours, setWeeklyHours] = useState('10');

  // Exam
  const [examName, setExamName] = useState('JEE Mains');
  const [targetExamDate, setTargetExamDate] = useState('2027-04-15');
  const [attemptYear, setAttemptYear] = useState('First Attempt');
  const [prepLevel, setPrepLevel] = useState('Midway through syllabus');
  const [targetScore, setTargetScore] = useState('98 Percentile');

  // Step 4: Subject Selection
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  // Sync user values if user loads asynchronously
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || '');
      if (!username) setUsername(user.studentUsername || '');
      if (!email) setEmail(user.email || '');
      if (!phone) setPhone(user.phone || '');
      if (user.learnerType) setSelectedType(user.learnerType.toLowerCase());
    }
  }, [user]);

  // Fetch subjects dynamically from database on Step 4 matching exact academic context
  useEffect(() => {
    if (step === 4) {
      const fetchSubjects = async () => {
        setSubjectsLoading(true);
        try {
          const params = {
            educationType: selectedType.toUpperCase(),
          };
          if (selectedType === 'school') {
            params.class = standard;
            params.board = board;
          } else if (selectedType === 'college') {
            params.degree = degree;
            params.branch = branch;
            params.semester = String(semester);
          } else if (selectedType === 'skills') {
            params.category = primarySkill;
          } else if (selectedType === 'exam') {
            params.exam = examName;
          }

          const res = await subjectApi.getSubjects(params);
          const list = res.data || [];
          setAvailableSubjects(list);
          // Pre-select first 3 subjects if none selected
          if (list.length > 0 && selectedSubjectIds.length === 0) {
            setSelectedSubjectIds(list.slice(0, 3).map(s => s.id));
          }
        } catch (err) {
          console.warn('Could not fetch subjects:', err.message);
        } finally {
          setSubjectsLoading(false);
        }
      };
      fetchSubjects();
    }
  }, [step, selectedType, standard, board, degree, branch, semester, primarySkill, examName]);

  const toggleSubject = (id) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!name.trim()) return setError('Full Name is required.');
      if (!username.trim()) return setError('Username is required.');
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    setError('');

    // Build academicDetails payload based on selected education type
    let academicDetails = {};
    if (selectedType === 'school') {
      academicDetails = {
        schoolName: schoolName.trim(),
        board,
        class: standard,
        academicYear,
        grade: skipGrade ? 'Not available yet' : currentGrade,
      };
    } else if (selectedType === 'college') {
      academicDetails = {
        collegeName: collegeName.trim(),
        degree,
        branch,
        collegeYear,
        semester: Number(semester),
        cgpa: Number(semester) === 1 ? 'Not available yet (Semester 1)' : currentCgpa || 'N/A',
        targetCgpa,
      };
    } else if (selectedType === 'skills') {
      academicDetails = {
        primarySkill,
        skillLevel,
        careerGoal,
        learningStyle,
        weeklyHours,
      };
    } else if (selectedType === 'exam') {
      academicDetails = {
        examName,
        targetExamDate,
        attemptYear,
        prepLevel,
        targetScore,
        weeklyHours,
      };
    }

    const payload = {
      learnerType: selectedType.toUpperCase(),
      board: selectedType === 'school' ? board : null,
      degree: selectedType === 'college' ? degree : null,
      academicDetails,
      subjectIds: selectedSubjectIds,
      goals: [
        selectedType === 'school' ? `Ace ${board} Class ${standard}` :
        selectedType === 'college' ? `Master ${branch} & Maintain ${targetCgpa} CGPA` :
        selectedType === 'skills' ? `Career Goal: ${careerGoal}` :
        `Crack ${examName} Exam`
      ],
    };

    try {
      const res = await learnerApi.completeOnboarding(payload);
      if (res && res.success) {
        // Update user state in context
        updateUser({
          name,
          studentUsername: username,
          learnerType: selectedType.toUpperCase(),
          learnerProfile: {
            ...user?.learnerProfile,
            onboardingCompleted: true,
            board: payload.board,
            degree: payload.degree,
            academicDetails,
          },
        });

        updateLearnerType(selectedType, { name, username });
        await hydrateSession();
        navigate('/dashboard');
      } else {
        throw new Error(res?.message || 'Onboarding completion failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save onboarding data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = availableSubjects.filter(
    (s) =>
      s.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(subjectSearch.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '40px 16px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Step Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Step {step} of 5
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {step === 1 && 'Basic Identity'}
              {step === 2 && 'Learning Track'}
              {step === 3 && 'Academic Details'}
              {step === 4 && 'Subject Selection'}
              {step === 5 && 'Finalizing Profile'}
            </span>
          </div>
          <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(step / 5) * 100}%`,
                background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
                transition: 'width 0.4s ease',
                borderRadius: '999px',
              }}
            />
          </div>
        </div>

        <Card hoverEffect={false} style={{ padding: '36px 30px', position: 'relative' }}>
          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '20px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              {error}
            </div>
          )}

          {/* STEP 1: BASIC INFORMATION */}
          {step === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px' }}>
                  Welcome to <span className="gradient-text-animated">EduNova</span>
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Let's confirm your profile details to personalize your workspace.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                    Full Name <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      style={{ width: '100%', paddingLeft: '40px', paddingTop: '12px', paddingBottom: '12px', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                    Student Username <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <AtSign size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="alex_mercer"
                      style={{ width: '100%', paddingLeft: '40px', paddingTop: '12px', paddingBottom: '12px', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@edunova.io"
                        style={{ width: '100%', paddingLeft: '40px', paddingTop: '12px', paddingBottom: '12px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
                      Mobile Phone Number <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(Optional)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        style={{ width: '100%', paddingLeft: '40px', paddingTop: '12px', paddingBottom: '12px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT LEARNER TYPE / TRACK */}
          {step === 2 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px' }}>
                  Select Your <span className="gradient-text-animated">Education Track</span>
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  This choice configures your curriculum, AI tutor context, and study planner.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {LEARNER_TYPES.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      style={{
                        padding: '18px 20px',
                        borderRadius: 'var(--radius-lg)',
                        border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.25 ease',
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1.8rem' }}>{type.icon}</span>
                        <div>
                          <strong style={{ fontSize: '1rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)', display: 'block' }}>
                            {type.label}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{type.badge}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                        {type.desc}
                      </p>
                      {isSelected && (
                        <CheckCircle2 size={20} color="var(--accent-cyan)" style={{ position: 'absolute', top: '16px', right: '16px' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: SMART CONDITIONAL QUESTIONS */}
          {step === 3 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px' }}>
                  {selectedType === 'school' && 'School Academic Profile'}
                  {selectedType === 'college' && 'University Program Details'}
                  {selectedType === 'skills' && 'Skills & Career Ambition'}
                  {selectedType === 'exam' && 'Target Exam Blueprint'}
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Provide specific details for your {selectedType.toUpperCase()} learning track.
                </p>
              </div>

              {/* A. SCHOOL PANEL */}
              {selectedType === 'school' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                      School Name <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <School size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="e.g. St. Xavier's High School"
                        style={{ width: '100%', paddingLeft: '40px', paddingTop: '12px', paddingBottom: '12px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Education Board
                      </label>
                      <select
                        value={board}
                        onChange={(e) => setBoard(e.target.value)}
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      >
                        <option value="CBSE">CBSE Board</option>
                        <option value="ICSE">ICSE Board</option>
                        <option value="State Board">State Board</option>
                        <option value="IB">IB / International Baccalaureate</option>
                        <option value="Cambridge">Cambridge IGCSE</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Class / Standard
                      </label>
                      <select
                        value={standard}
                        onChange={(e) => setStandard(e.target.value)}
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      >
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                      Current Grade / Percentage
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        <input
                          type="checkbox"
                          checked={skipGrade}
                          onChange={(e) => setSkipGrade(e.target.checked)}
                          style={{ accentColor: 'var(--accent-cyan)', width: '16px', height: '16px' }}
                        />
                        I don't have my current grade yet / Skip for now
                      </label>
                    </div>
                    {!skipGrade && (
                      <input
                        type="text"
                        value={currentGrade}
                        onChange={(e) => setCurrentGrade(e.target.value)}
                        placeholder="e.g. 88% or A Grade"
                        style={{ width: '100%', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* B. COLLEGE PANEL */}
              {selectedType === 'college' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                      College / University Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="e.g. National Institute of Technology"
                        style={{ width: '100%', paddingLeft: '40px', paddingTop: '12px', paddingBottom: '12px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Degree / Program
                      </label>
                      <select
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      >
                        <option value="B.Tech">B.Tech / B.E.</option>
                        <option value="BCA">BCA</option>
                        <option value="B.Sc">B.Sc Computer Science</option>
                        <option value="B.Com">B.Com</option>
                        <option value="MBA">MBA / PGDM</option>
                        <option value="M.Tech">M.Tech / M.Sc</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Branch / Specialization
                      </label>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="e.g. Computer Science"
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Current Semester
                      </label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value))}
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      >
                        <option value={1}>Semester 1 (Freshman)</option>
                        <option value={2}>Semester 2</option>
                        <option value={3}>Semester 3</option>
                        <option value={4}>Semester 4</option>
                        <option value={5}>Semester 5</option>
                        <option value={6}>Semester 6</option>
                        <option value={7}>Semester 7</option>
                        <option value={8}>Semester 8</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Target CGPA
                      </label>
                      <input
                        type="text"
                        value={targetCgpa}
                        onChange={(e) => setTargetCgpa(e.target.value)}
                        placeholder="e.g. 9.0 / 10"
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* CONDITIONAL CGPA LOGIC */}
                  {Number(semester) === 1 ? (
                    <div style={{ padding: '12px 16px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--accent-cyan)', fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>
                      ℹ️ <strong>Semester 1 Student:</strong> CGPA result not available yet. Current CGPA field is automatically skipped.
                    </div>
                  ) : (
                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Current CGPA / Percentage
                      </label>
                      <input
                        type="text"
                        value={currentCgpa}
                        onChange={(e) => setCurrentCgpa(e.target.value)}
                        placeholder="e.g. 8.45 CGPA"
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* C. SKILLS & CAREER PANEL */}
              {selectedType === 'skills' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Primary Skill Domain
                      </label>
                      <select
                        value={primarySkill}
                        onChange={(e) => setPrimarySkill(e.target.value)}
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      >
                        <option value="Web Development">Full-Stack Web Development</option>
                        <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
                        <option value="Data Science">Data Science & Analytics</option>
                        <option value="UI/UX Design">UI/UX Design & Product</option>
                        <option value="Cloud Computing">Cloud & DevOps</option>
                        <option value="Cyber Security">Cyber Security</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Current Skill Level
                      </label>
                      <select
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(e.target.value)}
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      >
                        <option value="Beginner">Beginner (Starting from Scratch)</option>
                        <option value="Intermediate">Intermediate (Have basic projects)</option>
                        <option value="Advanced">Advanced (Job ready)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                      Career Goal / Target Role
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Briefcase size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        value={careerGoal}
                        onChange={(e) => setCareerGoal(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer at Top Tech"
                        style={{ width: '100%', paddingLeft: '40px', paddingTop: '12px', paddingBottom: '12px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Preferred Learning Style
                      </label>
                      <select
                        value={learningStyle}
                        onChange={(e) => setLearningStyle(e.target.value)}
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      >
                        <option value="Interactive Labs & Projects">Interactive Labs & Projects</option>
                        <option value="Video Guided Paths">Video Guided Paths</option>
                        <option value="Peer Skill Swap">Peer Skill Exchange</option>
                        <option value="3D AR/VR Simulations">3D AR/VR Immersive Simulations</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Target Weekly Commitment
                      </label>
                      <select
                        value={weeklyHours}
                        onChange={(e) => setWeeklyHours(e.target.value)}
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      >
                        <option value="5">5 Hours / Week</option>
                        <option value="10">10 Hours / Week</option>
                        <option value="15">15 Hours / Week</option>
                        <option value="20">20+ Hours / Week</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* D. EXAM PREP PANEL */}
              {selectedType === 'exam' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Target Entrance Exam
                      </label>
                      <select
                        value={examName}
                        onChange={(e) => setExamName(e.target.value)}
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      >
                        <option value="JEE Mains">JEE Mains & Advanced</option>
                        <option value="NEET">NEET Medical</option>
                        <option value="GATE">GATE Engineering</option>
                        <option value="CAT">CAT / CMAT MBA Entrance</option>
                        <option value="UPSC">UPSC Civil Services</option>
                        <option value="GRE">GRE / GMAT</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Target Exam Date
                      </label>
                      <input
                        type="date"
                        value={targetExamDate}
                        onChange={(e) => setTargetExamDate(e.target.value)}
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Target Score / Percentile
                      </label>
                      <input
                        type="text"
                        value={targetScore}
                        onChange={(e) => setTargetScore(e.target.value)}
                        placeholder="e.g. 99 Percentile or 650+ Marks"
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                        Preparation Stage
                      </label>
                      <select
                        value={prepLevel}
                        onChange={(e) => setPrepLevel(e.target.value)}
                        style={{ width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', boxSizing: 'border-box' }}
                      >
                        <option value="Just starting out">Just starting out</option>
                        <option value="Midway through syllabus">Midway through syllabus</option>
                        <option value="Revision & Mock Tests">Revision & Mock Tests</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: DYNAMIC SUBJECT SELECTION FROM DATABASE */}
          {step === 4 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px' }}>
                  Select Your <span className="gradient-text-animated">Subjects</span>
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  These subjects will build your personalized dashboard, AI tutor context, and study planner.
                </p>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '18px' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  placeholder="Search subjects by name or category..."
                  style={{ width: '100%', paddingLeft: '40px', paddingTop: '10px', paddingBottom: '10px', boxSizing: 'border-box' }}
                />
              </div>

              {subjectsLoading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading subjects from database...
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                  {filteredSubjects.map((sub) => {
                    const isSelected = selectedSubjectIds.includes(sub.id);
                    return (
                      <div
                        key={sub.id}
                        onClick={() => toggleSubject(sub.id)}
                        style={{
                          padding: '14px',
                          borderRadius: 'var(--radius-lg)',
                          border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                          background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <strong style={{ fontSize: '0.9rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                              {sub.name}
                            </strong>
                            {isSelected && <CheckCircle2 size={16} color="var(--accent-cyan)" />}
                          </div>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>
                            {sub.category || 'General Subject'} • {sub.topics?.length || 0} Topics
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: FINALIZING & REVIEW */}
          {step === 5 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.15)', border: '2px solid var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Sparkles size={32} color="var(--accent-cyan)" />
              </div>

              <h2 style={{ fontSize: '1.85rem', fontWeight: 900, marginBottom: '8px' }}>
                Ready to Generate Your <span className="gradient-text-animated">Personalized Dashboard</span>
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 28px' }}>
                We are configuring your subjects, Sage AI context, and learning progression engine.
              </p>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'left', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Student Identity</span>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{name} (@{username})</p>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Selected Learning Track</span>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>{selectedType.toUpperCase()}</p>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Enrolled Subjects ({selectedSubjectIds.length})</span>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {availableSubjects.filter(s => selectedSubjectIds.includes(s.id)).map(s => s.name).join(', ') || 'General Curriculum'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Navigation Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <Button type="button" size="lg" onClick={handleNext}>
                Continue <ArrowRight size={16} />
              </Button>
            ) : (
              <Button type="button" size="lg" disabled={loading} onClick={handleFinishOnboarding}>
                {loading ? 'Creating Your Dashboard...' : 'Enter EduNova Dashboard 🚀'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
