// EduNova Competitive Exam Preparation Data (CMAT, JEE, NEET, GATE, CUET)

export const EXAM_TYPES = [
  { id: 'cmat', name: 'CMAT (Common Management Admission Test)', category: 'Management' },
  { id: 'jee', name: 'JEE Main & Advanced', category: 'Engineering' },
  { id: 'neet', name: 'NEET UG', category: 'Medical' },
  { id: 'gate', name: 'GATE (CS / IT)', category: 'Post-Graduate Engineering' },
  { id: 'cuet', name: 'CUET UG', category: 'University Entrance' }
];

export const DEMO_EXAM_SCHEDULE = {
  examName: 'CMAT 2026 Entrance Examination',
  daysRemaining: 42,
  targetScore: '320 / 400 (95+ Percentile)',
  overallProgress: 67,
  subjects: [
    { name: 'Quantitative Technique & Data Interpretation', weight: '25%', accuracy: '84%', score: 82 },
    { name: 'Logical Reasoning', weight: '25%', accuracy: '79%', score: 76 },
    { name: 'Language Comprehension', weight: '25%', accuracy: '91%', score: 88 },
    { name: 'Innovation & Entrepreneurship', weight: '25%', accuracy: '72%', score: 71 }
  ],
  weakTopics: [
    { topic: 'Data Interpretation Line & Bar Graphs', subject: 'Quant & DI', errorRate: '38%' },
    { topic: 'Probability & Combinatorics', subject: 'Quant', errorRate: '32%' },
    { topic: 'Syllogism & Logical Deduction', subject: 'Logical Reasoning', errorRate: '28%' }
  ],
  todayPlan: [
    { title: 'Solve 20 DI Line Graph Questions', duration: '45 mins', status: 'Pending' },
    { title: 'Revise Probability Formulae & Rules', duration: '30 mins', status: 'Completed' },
    { title: 'Take 30-Min Timed Logical Reasoning Quiz', duration: '30 mins', status: 'Pending' }
  ]
};
