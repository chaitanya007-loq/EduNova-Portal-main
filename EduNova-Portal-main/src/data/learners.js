export const LEARNER_TYPES = [
  { id: 'school', label: 'School', icon: '🏫', desc: 'CBSE / ICSE Board & Standard' },
  { id: 'college', label: 'College / University', icon: '🎓', desc: 'Degree, Branch & Semesters' },
  { id: 'skills', label: 'Skills & Career', icon: '💻', desc: 'Learning Paths & Projects' },
  { id: 'exam', label: 'Exam Preparation', icon: '📝', desc: 'Competitive Mocks & Analysis' }
];

export const DEMO_LEARNERS = {
  school: {
    id: 'usr_school_aarav',
    name: 'Aarav Sharma',
    username: 'aarav_sharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    learnerType: 'school',
    title: 'Class 10 CBSE Student',
    bio: 'Focusing on Mathematics, Physics & Chemistry for Board Exams.',
    xp: 2450,
    level: 6,
    streakDays: 14,
    education: {
      board: 'CBSE',
      class: 'Class 10',
      subjects: ['Mathematics', 'Science', 'English', 'Social Science', 'Computer Applications']
    },
    goals: ['Score 95%+ in Board Exams', 'Master Physics Formulas'],
    preferences: {
      learningStyle: 'Visual & Interactive',
      dailyStudyHours: 2.5
    },
    weakTopics: ['Quadratic Equations', 'Chemical Reactions & Equations', 'Electric Current Effects'],
    upcomingTests: [
      { subject: 'Science (Physics)', title: 'Light & Optics Test', date: 'Friday, 10:00 AM' },
      { subject: 'Mathematics', title: 'Quadratic Equations Quiz', date: 'Monday, 11:30 AM' }
    ],
    todayLessons: [
      { subject: 'Mathematics', title: 'Quadratic Equations', icon: '📐', progress: 45, topic: 'Discriminant & Roots' },
      { subject: 'Science', title: 'Light: Reflection & Refraction', icon: '🔬', progress: 70, topic: 'Spherical Mirrors' },
      { subject: 'English', title: 'First Flight: Grammar', icon: '📚', progress: 30, topic: 'Tenses & Active Voice' }
    ]
  },

  college: {
    id: 'usr_college_kavya',
    name: 'Kavya Shah',
    username: 'kavyashah_dev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya%20Shah',
    learnerType: 'college',
    title: 'B.Tech CSE Student (2nd Year)',
    bio: 'Pursuing B.Tech Computer Science & Engineering. Passionate about Software Architecture & AI.',
    xp: 4120,
    level: 9,
    streakDays: 21,
    education: {
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      year: '2nd Year',
      semester: 'Semester 4',
      cgpa: 8.85,
      subjects: [
        { name: 'Database Management Systems (DBMS)', progress: 72, code: 'CS401' },
        { name: 'Operating Systems', progress: 64, code: 'CS402' },
        { name: 'Computer Networks', progress: 58, code: 'CS403' },
        { name: 'Software Engineering', progress: 81, code: 'CS404' }
      ]
    },
    skills: [
      { name: 'React.js', level: 78 },
      { name: 'JavaScript ES6+', level: 85 },
      { name: 'Node.js & Express', level: 52 },
      { name: 'SQL & DBMS', level: 74 }
    ],
    activeProjects: [
      { name: 'Transit Management Platform', progress: 78, tech: 'React + Node' },
      { name: 'AI Study Assistant Prototype', progress: 42, tech: 'Python + WebGL' }
    ],
    careerGoal: 'Full Stack Software Engineer',
    careerReadiness: 68,
    assignments: [
      { title: 'DBMS Relational Algebra Assignment', dueDate: 'Tomorrow, 11:59 PM', subject: 'DBMS' },
      { title: 'Operating Systems Process Scheduling Lab', dueDate: 'In 3 days', subject: 'OS' }
    ]
  },

  skills: {
    id: 'usr_skills_rahul',
    name: 'Rahul Verma',
    username: 'rahul_verma_fs',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    learnerType: 'skills',
    title: 'Frontend Developer ➔ Full Stack Specialist',
    bio: 'Building production web applications and advancing backend cloud API capabilities.',
    xp: 5380,
    level: 11,
    streakDays: 34,
    currentSkill: 'React & Node.js Full Stack',
    skillLevel: 'Intermediate',
    careerGoal: 'Full Stack Web Developer at Tech Startup',
    portfolioProjects: [
      { name: 'EduNova 3D Visualizer', status: 'Completed', stars: 12 },
      { name: 'Realtime Code Sandbox', status: 'In Progress', progress: 65 }
    ],
    learningPath: [
      { name: 'JavaScript Deep Dive', status: 'Mastered', progress: 100 },
      { name: 'React Architecture & Hooks', status: 'Mastered', progress: 100 },
      { name: 'REST APIs & GraphQL', status: 'In Progress', progress: 70 },
      { name: 'Node.js & Express Architecture', status: 'Up Next', progress: 25 },
      { name: 'Full Stack Capstone Project', status: 'Locked', progress: 0 }
    ],
    recommendedSkills: ['TypeScript', 'Docker Fundamentals', 'PostgreSQL', 'Tailwind CSS']
  },

  exam: {
    id: 'usr_exam_priya',
    name: 'Priya Nair',
    username: 'priya_nair_gate',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    learnerType: 'exam',
    title: 'CMAT / JEE Aspirant',
    bio: 'Preparing for national competitive entrance examinations with daily mock tests.',
    xp: 3890,
    level: 8,
    streakDays: 18,
    examDetails: {
      examName: 'CMAT / National Entrance',
      targetDate: '2026-11-15',
      daysRemaining: 42,
      targetPercentile: '95+ Percentile',
      currentScorePercentile: '78.5 Percentile',
      dailyTargetHours: 4,
      loggedHoursToday: 2.8
    },
    subjectPerformance: [
      { subject: 'Quantitative Technique', score: 82, accuracy: '84%' },
      { subject: 'Logical Reasoning', score: 76, accuracy: '79%' },
      { subject: 'Language Comprehension', score: 88, accuracy: '91%' },
      { subject: 'Innovation & Entrepreneurship', score: 71, accuracy: '72%' }
    ],
    weakTopics: [
      'Data Interpretation Line Graphs',
      'Probability & Permutations',
      'Critical Reasoning Syllogisms'
    ],
    mockTests: [
      { title: 'Full Length CMAT Mock Test #6', score: '284/400', date: 'Yesterday', percentile: '81.2%' },
      { title: 'Quantitative Aptitude Sectional Mock', score: '78/100', date: '3 days ago', percentile: '84.0%' }
    ]
  }
};

const STORAGE_KEY = 'edunova_active_learner_profile';

export const getStoredLearnerProfile = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading stored learner profile:', e);
  }
  // Clean slate baseline: returns null when not populated
  return null;
};

export const saveLearnerProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving learner profile:', e);
  }
  return profile;
};
