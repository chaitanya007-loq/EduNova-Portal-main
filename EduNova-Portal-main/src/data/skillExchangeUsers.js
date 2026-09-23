// EduNova Skill Exchange Mock Peer User Database & Detailed Profiles (School & College Peers)

export const sampleExchangeUsers = [
  // SCHOOL PEERS (Class 8 - 12)
  {
    id: 'usr_peer_4',
    name: 'Meera Iyer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera%20Iyer',
    learnerType: 'school',
    education: 'Class 10 CBSE',
    institution: 'Delhi Public School',
    semester: 'Class 10',
    title: 'Class 10 CBSE Math & Physics Peer Tutor',
    bio: 'Top performer in Class 10 Board Mathematics & Physics. Looking for peer practice in English Grammar and Essay Writing.',
    skillsToTeach: [
      { id: 'st_7', name: 'Mathematics', category: 'School Academics', level: 'Advanced', experienceYears: 2, confidence: 94, preferredLearners: 'Class 8-10 Students', topics: ['Quadratic Equations', 'Trigonometry', 'Coordinate Geometry', 'Real Numbers'] },
      { id: 'st_8', name: 'Physics', category: 'School Academics', level: 'Intermediate', experienceYears: 2, confidence: 86, preferredLearners: 'Class 9-10 Students', topics: ['Electricity & Ohm\'s Law', 'Light Reflection', 'Magnetic Effects'] }
    ],
    skillsToLearn: [
      { id: 'sl_7', name: 'English Speaking & Grammar', category: 'School Academics', currentLevel: 'Intermediate', targetLevel: 'Advanced', goal: 'Score 95%+ in English Board Exam & essay writing' }
    ],
    experience: 'Intermediate',
    rating: 4.95,
    reviewCount: 11,
    responseRate: 100,
    availability: 'Evenings',
    availableDays: ['Monday', 'Friday', 'Sunday'],
    availableTimeSlots: {
      Monday: ['05:00 PM - 07:00 PM'],
      Friday: ['05:00 PM - 07:00 PM'],
      Sunday: ['04:00 PM - 07:00 PM']
    },
    timezone: 'Asia/Kolkata (IST)',
    languages: ['English', 'Tamil', 'Hindi'],
    learningFormat: 'Study partner',
    isStudyBuddyAvailable: true,
    completedExchanges: 7,
    verified: true,
    teachingHours: 28,
    learningHours: 18,
    reviews: [
      { id: 'rev_5', author: 'Aarav S.', rating: 5, date: 'Aug 2026', comment: 'Meera helped me master Quadratic Equations in 2 sessions!' }
    ]
  },
  {
    id: 'usr_peer_7',
    name: 'Rohan Gupta',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    learnerType: 'school',
    education: 'Class 10 ICSE',
    institution: 'St. Xavier\'s High School',
    semester: 'Class 10',
    title: 'Class 10 Chemistry & Biology Specialist',
    bio: 'Scored 98% in ICSE Science Mocks. Passionate about chemical equations and human anatomy notes.',
    skillsToTeach: [
      { id: 'st_13', name: 'Chemistry', category: 'School Academics', level: 'Advanced', experienceYears: 2, confidence: 96, preferredLearners: 'Class 9-10 ICSE/CBSE', topics: ['Chemical Reactions', 'Acids, Bases & Salts', 'Periodic Classification'] },
      { id: 'st_14', name: 'Biology', category: 'School Academics', level: 'Intermediate', experienceYears: 2, confidence: 90, preferredLearners: 'Class 8-10', topics: ['Life Processes', 'Control & Coordination', 'Genetics Basics'] }
    ],
    skillsToLearn: [
      { id: 'sl_10', name: 'Mathematics', category: 'School Academics', currentLevel: 'Intermediate', targetLevel: 'Advanced', goal: 'Master Trigonometry identities for final board exam' }
    ],
    experience: 'Advanced',
    rating: 4.88,
    reviewCount: 8,
    responseRate: 97,
    availability: 'Weekends',
    availableDays: ['Saturday', 'Sunday'],
    availableTimeSlots: {
      Saturday: ['11:00 AM - 01:00 PM', '04:00 PM - 06:00 PM'],
      Sunday: ['10:00 AM - 12:00 PM']
    },
    timezone: 'Asia/Kolkata (IST)',
    languages: ['English', 'Hindi'],
    learningFormat: 'Study partner',
    isStudyBuddyAvailable: true,
    completedExchanges: 5,
    verified: true,
    teachingHours: 20,
    learningHours: 14,
    reviews: [
      { id: 'rev_8', author: 'Ananya S.', rating: 5, date: 'Jul 2026', comment: 'Rohan makes chemical reactions so easy to memorize!' }
    ]
  },
  {
    id: 'usr_peer_8',
    name: 'Ishita Verma',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    learnerType: 'school',
    education: 'Class 12 CBSE (Science Stream)',
    institution: 'National Public School',
    semester: 'Class 12',
    title: 'Class 12 Physics & Python Programming Mentor',
    bio: 'Scored top marks in CBSE Computer Science. Teaching Python basics and Physics Ray Optics to junior school peers.',
    skillsToTeach: [
      { id: 'st_15', name: 'Computer Applications', category: 'School Academics', level: 'Expert', experienceYears: 3, confidence: 95, preferredLearners: 'Class 6-10', topics: ['Python Basics', 'Loops & Functions', 'HTML & CSS'] },
      { id: 'st_16', name: 'Physics', category: 'School Academics', level: 'Advanced', experienceYears: 2, confidence: 91, preferredLearners: 'Class 9-11', topics: ['Ray Optics', 'Electric Charges & Fields'] }
    ],
    skillsToLearn: [
      { id: 'sl_11', name: 'Mathematics', category: 'School Academics', currentLevel: 'Intermediate', targetLevel: 'Advanced', goal: 'Master Calculus and Integration for CBSE Board Exam' }
    ],
    experience: 'Advanced',
    rating: 4.92,
    reviewCount: 15,
    responseRate: 99,
    availability: 'Evenings',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableTimeSlots: {
      Tuesday: ['06:00 PM - 08:00 PM'],
      Thursday: ['06:00 PM - 08:00 PM'],
      Saturday: ['03:00 PM - 06:00 PM']
    },
    timezone: 'Asia/Kolkata (IST)',
    languages: ['English', 'Hindi'],
    learningFormat: 'Mentoring',
    isMentor: true,
    completedExchanges: 9,
    verified: true,
    teachingHours: 36,
    learningHours: 20,
    reviews: [
      { id: 'rev_9', author: 'Aarav S.', rating: 5, date: 'Aug 2026', comment: 'Ishita explained Python loops so clearly!' }
    ]
  },

  // COLLEGE PEERS (B.Tech / University / Higher Ed)
  {
    id: 'usr_peer_1',
    name: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    learnerType: 'college',
    education: 'B.Tech Computer Science',
    institution: 'VNSGU Institute of Tech',
    semester: '6th Semester',
    title: 'UI/UX Design Specialist & Figma Mentor',
    bio: 'Passionate about design systems, accessibility, and wireframing. Looking to expand into frontend React development.',
    skillsToTeach: [
      { id: 'st_1', name: 'UI/UX Design', category: 'Design', level: 'Advanced', experienceYears: 3, confidence: 92, preferredLearners: 'Beginner to Intermediate', topics: ['Figma', 'Wireframing', 'Design Systems', 'User Research'] },
      { id: 'st_2', name: 'Figma', category: 'Design', level: 'Expert', experienceYears: 4, confidence: 96, preferredLearners: 'All Levels', topics: ['Auto Layout', 'Components', 'Interactive Prototypes', 'Tokens'] }
    ],
    skillsToLearn: [
      { id: 'sl_1', name: 'React', category: 'Web Development', currentLevel: 'Beginner', targetLevel: 'Intermediate', goal: 'Build production frontend interfaces for design projects' },
      { id: 'sl_2', name: 'JavaScript', category: 'Web Development', currentLevel: 'Intermediate', targetLevel: 'Advanced', goal: 'Master ES6+ async/await and state patterns' }
    ],
    experience: 'Advanced',
    rating: 4.9,
    reviewCount: 14,
    responseRate: 98,
    availability: 'Weekends',
    availableDays: ['Saturday', 'Sunday'],
    availableTimeSlots: {
      Saturday: ['10:00 AM - 12:00 PM', '04:00 PM - 07:00 PM', '07:00 PM - 09:00 PM'],
      Sunday: ['11:00 AM - 01:00 PM', '05:00 PM - 08:00 PM']
    },
    timezone: 'Asia/Kolkata (IST)',
    languages: ['English', 'Hindi'],
    learningFormat: '1-to-1',
    isMentor: true,
    mentorBio: '4+ years of hands-on Figma and UX design experience. Guided 12+ students in crafting portfolio-ready UI projects.',
    completedExchanges: 8,
    verified: true,
    teachingHours: 32,
    learningHours: 24,
    reviews: [
      { id: 'rev_1', author: 'Kavya Shah', rating: 5, date: 'Aug 2026', comment: 'Rahul is an incredible Figma tutor! His design system feedback was spot-on.' }
    ]
  },
  {
    id: 'usr_peer_3',
    name: 'Dev Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    learnerType: 'college',
    education: 'B.Tech IT',
    institution: 'SVNIT Surat',
    semester: '5th Semester',
    title: 'Backend Node.js & Cloud Infrastructure Developer',
    bio: 'Skilled in Express, Docker, and RESTful APIs. Seeking 3D WebGL and Three.js visualization mentorship.',
    skillsToTeach: [
      { id: 'st_5', name: 'Node.js', category: 'Backend', level: 'Advanced', experienceYears: 3, confidence: 88, preferredLearners: 'Beginner to Intermediate', topics: ['Express', 'REST APIs', 'JWT Auth', 'MongoDB'] },
      { id: 'st_6', name: 'SQL & DBMS', category: 'Backend', level: 'Advanced', experienceYears: 3, confidence: 90, preferredLearners: 'All Levels', topics: ['PostgreSQL', 'Joins', 'Indexing', 'Schema Design'] }
    ],
    skillsToLearn: [
      { id: 'sl_5', name: '3D WebGL', category: '3D Graphics', currentLevel: 'Beginner', targetLevel: 'Intermediate', goal: 'Build 3D interactive graphics for browser applications' },
      { id: 'sl_6', name: 'UI/UX Design', category: 'Design', currentLevel: 'Beginner', targetLevel: 'Intermediate', goal: 'Improve product usability and layout design' }
    ],
    experience: 'Advanced',
    rating: 4.7,
    reviewCount: 9,
    responseRate: 92,
    availability: 'Flexible',
    availableDays: ['Monday', 'Wednesday', 'Saturday'],
    availableTimeSlots: {
      Monday: ['07:00 PM - 09:00 PM'],
      Wednesday: ['06:00 PM - 09:00 PM'],
      Saturday: ['02:00 PM - 06:00 PM']
    },
    timezone: 'Asia/Kolkata (IST)',
    languages: ['English', 'Gujarati', 'Hindi'],
    learningFormat: 'Project-based',
    isProjectPartnerAvailable: true,
    completedExchanges: 5,
    verified: true,
    teachingHours: 20,
    learningHours: 15,
    reviews: [
      { id: 'rev_4', author: 'Priya N.', rating: 5, date: 'Jun 2026', comment: 'Clear explanations on database indexing and SQL joins!' }
    ]
  },

  // EXAM PREP PEERS
  {
    id: 'usr_peer_5',
    name: 'Siddharth Rao',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    learnerType: 'exam',
    education: 'MBA Aspirant',
    institution: 'IIM Prep Academy',
    semester: 'Final Year Prep',
    title: 'Quantitative Aptitude & Logical Reasoning Coach',
    bio: 'CAT 99.4 Percentile Scorer. Offering high-speed quant tips in exchange for Data Interpretation line graph practice.',
    skillsToTeach: [
      { id: 'st_9', name: 'Quantitative Aptitude', category: 'Exam Prep', level: 'Expert', experienceYears: 3, confidence: 98, preferredLearners: 'Entrance Aspirants', topics: ['Speed Math', 'Number System', 'Algebra', 'Time & Work'] },
      { id: 'st_10', name: 'Logical Reasoning', category: 'Exam Prep', level: 'Advanced', experienceYears: 3, confidence: 92, preferredLearners: 'Entrance Aspirants', topics: ['Puzzles', 'Seating Arrangement', 'Syllogisms'] }
    ],
    skillsToLearn: [
      { id: 'sl_8', name: 'Data Interpretation', category: 'Exam Prep', currentLevel: 'Intermediate', targetLevel: 'Advanced', goal: 'Achieve 95%+ accuracy in complex chart analysis' }
    ],
    experience: 'Expert',
    rating: 4.85,
    reviewCount: 16,
    responseRate: 96,
    availability: 'Weekends',
    availableDays: ['Saturday', 'Sunday'],
    availableTimeSlots: {
      Saturday: ['06:00 PM - 09:00 PM'],
      Sunday: ['03:00 PM - 07:00 PM']
    },
    timezone: 'Asia/Kolkata (IST)',
    languages: ['English', 'Hindi', 'Telugu'],
    learningFormat: '1-to-1',
    isMentor: true,
    completedExchanges: 10,
    verified: true,
    teachingHours: 42,
    learningHours: 22,
    reviews: [
      { id: 'rev_6', author: 'Priya Nair', rating: 5, date: 'Aug 2026', comment: 'His short tricks for speed math saved me so much time in mock tests!' }
    ]
  },

  // SKILLS / CAREER PEERS
  {
    id: 'usr_peer_2',
    name: 'Ananya Roy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    learnerType: 'skills',
    education: 'M.Sc Data Analytics',
    institution: 'IIT Gandhinagar',
    semester: 'Graduated',
    title: 'Python Data Science & Machine Learning Engineer',
    bio: 'Specializing in PyTorch, Pandas data analysis, and predictive models. Eager to master modern React frontend architecture.',
    skillsToTeach: [
      { id: 'st_3', name: 'Python', category: 'Data Science', level: 'Expert', experienceYears: 4, confidence: 95, preferredLearners: 'All Levels', topics: ['Pandas', 'NumPy', 'Scikit-Learn', 'Scripting'] },
      { id: 'st_4', name: 'Machine Learning', category: 'Data Science', level: 'Advanced', experienceYears: 3, confidence: 90, preferredLearners: 'Intermediate', topics: ['Neural Networks', 'PyTorch', 'Model Evaluation', 'Regression'] }
    ],
    skillsToLearn: [
      { id: 'sl_3', name: 'React', category: 'Web Development', currentLevel: 'Beginner', targetLevel: 'Intermediate', goal: 'Build interactive dashboards for ML model predictions' }
    ],
    experience: 'Expert',
    rating: 4.8,
    reviewCount: 19,
    responseRate: 95,
    availability: 'Weekdays',
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    availableTimeSlots: {
      Tuesday: ['06:00 PM - 09:00 PM'],
      Thursday: ['05:00 PM - 08:00 PM'],
      Friday: ['04:00 PM - 07:00 PM']
    },
    timezone: 'Asia/Kolkata (IST)',
    languages: ['English'],
    learningFormat: 'Mentoring',
    isMentor: true,
    completedExchanges: 12,
    verified: true,
    teachingHours: 48,
    learningHours: 30
  }
];
