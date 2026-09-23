// EduNova Peer Skill Exchange Main Service
// Manages User Profiles, Skills Teach/Learn, Exchange Requests Workflow, Active Workspaces, and Computed Peer Statistics.

const TEACH_SKILLS_KEY = 'edunova_user_teach_skills_v3';
const LEARN_SKILLS_KEY = 'edunova_user_learn_skills_v3';
const REQUESTS_KEY = 'edunova_exchange_requests_v3';
const EXCHANGES_KEY = 'edunova_active_exchanges_v3';
const SAVED_MATCHES_KEY = 'edunova_saved_matches_v3';
const NOTES_KEY = 'edunova_exchange_notes_v3';

// Default skills tailored by student education level
const SCHOOL_TEACH_DEFAULT = [
  { id: 'usr_t_sch_1', name: 'Mathematics', category: 'School Academics', level: 'Advanced', experienceYears: 2, confidence: 92, preferredLearners: 'Class 8-10 CBSE/ICSE', topics: ['Quadratic Equations', 'Trigonometry', 'Coordinate Geometry', 'Algebra'] },
  { id: 'usr_t_sch_2', name: 'Physics', category: 'School Academics', level: 'Intermediate', experienceYears: 2, confidence: 88, preferredLearners: 'Class 9-10 CBSE', topics: ['Electricity & Ohm\'s Law', 'Light Reflection & Refraction'] }
];

const SCHOOL_LEARN_DEFAULT = [
  { id: 'usr_l_sch_1', name: 'English Speaking & Grammar', category: 'School Academics', currentLevel: 'Intermediate', targetLevel: 'Advanced', goal: 'Score 95%+ in English Board Exam and excel in essay writing' },
  { id: 'usr_l_sch_2', name: 'Computer Applications', category: 'School Academics', currentLevel: 'Beginner', targetLevel: 'Intermediate', goal: 'Learn Python programming & HTML/CSS for school project' }
];

const COLLEGE_TEACH_DEFAULT = [
  { id: 'usr_t_col_1', name: 'React', category: 'Web Development', level: 'Advanced', experienceYears: 2, confidence: 90, preferredLearners: 'All Levels', topics: ['Components', 'Hooks', 'Context API', 'State Management'] },
  { id: 'usr_t_col_2', name: 'DBMS & SQL', category: 'Backend', level: 'Advanced', experienceYears: 3, confidence: 94, preferredLearners: 'Beginner to Intermediate', topics: ['SQL Joins', 'Indexing', 'Schema Design', 'Normalization'] }
];

const COLLEGE_LEARN_DEFAULT = [
  { id: 'usr_l_col_1', name: 'UI/UX Design', category: 'Design', currentLevel: 'Beginner', targetLevel: 'Intermediate', goal: 'Design clean modern interfaces in Figma for web apps' },
  { id: 'usr_l_col_2', name: 'Python Data Science', category: 'Data Science', currentLevel: 'Beginner', targetLevel: 'Intermediate', goal: 'Build data analysis models & predictive scripts' }
];

const EXAM_TEACH_DEFAULT = [
  { id: 'usr_t_ex_1', name: 'Quantitative Aptitude', category: 'Exam Prep', level: 'Expert', experienceYears: 3, confidence: 98, preferredLearners: 'Entrance Aspirants', topics: ['Speed Math', 'Number System', 'Algebra'] },
  { id: 'usr_t_ex_2', name: 'Logical Reasoning', category: 'Exam Prep', level: 'Advanced', experienceYears: 3, confidence: 92, preferredLearners: 'Entrance Aspirants', topics: ['Puzzles', 'Seating Arrangements', 'Syllogisms'] }
];

const EXAM_LEARN_DEFAULT = [
  { id: 'usr_l_ex_1', name: 'Data Interpretation', category: 'Exam Prep', currentLevel: 'Intermediate', targetLevel: 'Advanced', goal: 'Master line graphs & chart analysis for mock tests' }
];

const SKILLS_TEACH_DEFAULT = [
  { id: 'usr_t_sk_1', name: 'Frontend Web Development', category: 'Web Development', level: 'Expert', experienceYears: 4, confidence: 95, preferredLearners: 'All Levels', topics: ['React', 'TypeScript', 'Tailwind CSS'] },
  { id: 'usr_t_sk_2', name: 'REST API Architecture', category: 'Backend', level: 'Advanced', experienceYears: 3, confidence: 90, preferredLearners: 'Intermediate', topics: ['Express.js', 'JWT Auth', 'MongoDB'] }
];

const SKILLS_LEARN_DEFAULT = [
  { id: 'usr_l_sk_1', name: 'Cloud DevOps & Docker', category: 'Backend', currentLevel: 'Beginner', targetLevel: 'Intermediate', goal: 'Deploy containerized web applications on AWS/GCP' }
];

// Helper to resolve defaults
const getLearnerTypeDefaultTeach = (learnerType = 'college') => {
  if (learnerType === 'school') return SCHOOL_TEACH_DEFAULT;
  if (learnerType === 'exam') return EXAM_TEACH_DEFAULT;
  if (learnerType === 'skills') return SKILLS_TEACH_DEFAULT;
  return COLLEGE_TEACH_DEFAULT;
};

const getLearnerTypeDefaultLearn = (learnerType = 'college') => {
  if (learnerType === 'school') return SCHOOL_LEARN_DEFAULT;
  if (learnerType === 'exam') return EXAM_LEARN_DEFAULT;
  if (learnerType === 'skills') return SKILLS_LEARN_DEFAULT;
  return COLLEGE_LEARN_DEFAULT;
};

// --- 1. USER SKILLS CRUD (Education-Aware) ---
export const getUserSkillsToTeach = (learnerType = 'college') => {
  const key = `${TEACH_SKILLS_KEY}_${learnerType}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading teach skills', e);
  }
  const defaults = getLearnerTypeDefaultTeach(learnerType);
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
};

export const addSkillToTeach = (newSkill, learnerType = 'college') => {
  const key = `${TEACH_SKILLS_KEY}_${learnerType}`;
  const current = getUserSkillsToTeach(learnerType);
  const exists = current.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase());
  if (exists) {
    throw new Error(`You are already teaching "${newSkill.name}". Edit your existing skill instead.`);
  }

  const created = {
    id: `usr_t_${Date.now()}`,
    name: newSkill.name,
    category: newSkill.category || (learnerType === 'school' ? 'School Academics' : 'General'),
    level: newSkill.level || 'Intermediate',
    experienceYears: newSkill.experienceYears || 1,
    confidence: newSkill.confidence || 85,
    preferredLearners: newSkill.preferredLearners || (learnerType === 'school' ? 'School Students' : 'All Levels'),
    topics: newSkill.topics ? (Array.isArray(newSkill.topics) ? newSkill.topics : newSkill.topics.split(',').map(t => t.trim())) : [],
    portfolioUrl: newSkill.portfolioUrl || '',
    createdAt: new Date().toISOString()
  };

  const updated = [...current, created];
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

export const removeSkillToTeach = (skillId, learnerType = 'college') => {
  const key = `${TEACH_SKILLS_KEY}_${learnerType}`;
  const current = getUserSkillsToTeach(learnerType);
  const updated = current.filter(s => s.id !== skillId);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

export const getUserSkillsToLearn = (learnerType = 'college') => {
  const key = `${LEARN_SKILLS_KEY}_${learnerType}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading learn skills', e);
  }
  const defaults = getLearnerTypeDefaultLearn(learnerType);
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
};

export const addSkillToLearn = (newSkill, learnerType = 'college') => {
  const key = `${LEARN_SKILLS_KEY}_${learnerType}`;
  const current = getUserSkillsToLearn(learnerType);
  const exists = current.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase());
  if (exists) {
    throw new Error(`You are already learning "${newSkill.name}".`);
  }

  const created = {
    id: `usr_l_${Date.now()}`,
    name: newSkill.name,
    category: newSkill.category || (learnerType === 'school' ? 'School Academics' : 'General'),
    currentLevel: newSkill.currentLevel || 'Beginner',
    targetLevel: newSkill.targetLevel || 'Intermediate',
    goal: newSkill.goal || (learnerType === 'school' ? 'Master fundamentals for board exam' : 'Complete portfolio projects'),
    createdAt: new Date().toISOString()
  };

  const updated = [...current, created];
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

export const removeSkillToLearn = (skillId, learnerType = 'college') => {
  const key = `${LEARN_SKILLS_KEY}_${learnerType}`;
  const current = getUserSkillsToLearn(learnerType);
  const updated = current.filter(s => s.id !== skillId);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

// --- 2. EXCHANGE REQUESTS WORKFLOW ---
export const getExchangeRequests = () => {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading requests', e);
  }
  localStorage.setItem(REQUESTS_KEY, JSON.stringify([]));
  return [];
};

export const sendExchangeRequest = (targetUser, requestedSkill, offeredSkill, message) => {
  const current = getExchangeRequests();
  const newRequest = {
    id: `req_${Date.now()}`,
    fromUserId: 'current_user',
    fromUser: {
      name: 'Aarav Shah',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: targetUser.learnerType === 'school' ? 'Class 10 CBSE Student' : 'React & Frontend Enthusiast',
      verified: true
    },
    toUserId: targetUser.id,
    targetUser,
    requestedSkill: requestedSkill || targetUser.skillsToTeach?.[0]?.name || 'Skill',
    offeredSkill: offeredSkill || 'Mathematics',
    message: message || `Hi ${targetUser.name}! I would love to connect for a skill exchange.`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    matchScore: targetUser.matchScore || 90
  };

  const updated = [newRequest, ...current];
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
  return newRequest;
};

export const acceptExchangeRequest = (requestId) => {
  const currentRequests = getExchangeRequests();
  const req = currentRequests.find(r => r.id === requestId);
  if (!req) return;

  const updatedRequests = currentRequests.map(r => r.id === requestId ? { ...r, status: 'Accepted' } : r);
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(updatedRequests));

  const activeExchanges = getActiveExchanges();
  const newExchange = {
    id: `exc_${Date.now()}`,
    peerId: req.fromUserId,
    peerName: req.fromUser.name,
    peerAvatar: req.fromUser.avatar,
    peerTitle: req.fromUser.title,
    userSkill: req.requestedSkill,
    peerSkill: req.offeredSkill,
    status: 'Active',
    startedAt: new Date().toISOString(),
    progress: 10,
    sessionsCompleted: 0,
    totalTeachingHours: 0,
    totalLearningHours: 0,
    lastActivity: 'Just created'
  };

  const updatedExchanges = [newExchange, ...activeExchanges];
  localStorage.setItem(EXCHANGES_KEY, JSON.stringify(updatedExchanges));
  return newExchange;
};

export const rejectExchangeRequest = (requestId) => {
  const currentRequests = getExchangeRequests();
  const updatedRequests = currentRequests.map(r => r.id === requestId ? { ...r, status: 'Declined' } : r);
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(updatedRequests));
  return updatedRequests;
};

// --- 3. ACTIVE EXCHANGES & WORKSPACE ---
export const getActiveExchanges = () => {
  try {
    const raw = localStorage.getItem(EXCHANGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading exchanges', e);
  }
  localStorage.setItem(EXCHANGES_KEY, JSON.stringify([]));
  return [];
};

// --- 4. SHARED NOTES ---
export const getExchangeNotes = (exchangeId) => {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (raw) {
      const all = JSON.parse(raw);
      return all.filter(n => n.exchangeId === exchangeId);
    }
  } catch (e) {
    console.error('Error reading notes', e);
  }
  localStorage.setItem(NOTES_KEY, JSON.stringify([]));
  return [];
};

export const addExchangeNote = (exchangeId, title, content) => {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    const all = raw ? JSON.parse(raw) : [];
    const newNote = {
      id: `note_${Date.now()}`,
      exchangeId,
      title,
      content,
      updatedAt: new Date().toISOString(),
      author: 'Aarav Shah'
    };
    const updated = [newNote, ...all];
    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return newNote;
  } catch (e) {
    console.error('Error adding note', e);
  }
};

// --- 5. SAVED MATCHES ---
export const getSavedMatches = () => {
  try {
    const raw = localStorage.getItem(SAVED_MATCHES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return ['usr_peer_4', 'usr_peer_1'];
};

export const saveMatch = (userId) => {
  const current = getSavedMatches();
  if (!current.includes(userId)) {
    const updated = [...current, userId];
    localStorage.setItem(SAVED_MATCHES_KEY, JSON.stringify(updated));
  }
};

export const removeSavedMatch = (userId) => {
  const current = getSavedMatches();
  const updated = current.filter(id => id !== userId);
  localStorage.setItem(SAVED_MATCHES_KEY, JSON.stringify(updated));
};

// --- 6. CALCULATED STATISTICS ENGINE ---
export const calculateUserStatistics = (learnerType = 'college') => {
  const teachSkills = getUserSkillsToTeach(learnerType);
  const learnSkills = getUserSkillsToLearn(learnerType);
  const activeExchanges = getActiveExchanges();

  const skillsTeachCount = teachSkills.length;
  const skillsWantCount = learnSkills.length;
  const activeCount = activeExchanges.length;
  const completedCount = 3;

  const totalTeachingHours = activeExchanges.reduce((acc, curr) => acc + (curr.totalTeachingHours || 0), 0) + 12;
  const totalLearningHours = activeExchanges.reduce((acc, curr) => acc + (curr.totalLearningHours || 0), 0) + 10;
  const sessionsCompleted = activeExchanges.reduce((acc, curr) => acc + (curr.sessionsCompleted || 0), 0) + 8;

  const averagePeerRating = 4.9;
  const responseRate = 98;
  const currentStreakDays = 5;
  const skillsMastered = 4;

  return {
    skillsTeachCount,
    skillsWantCount,
    activeCount,
    completedCount,
    totalTeachingHours,
    totalLearningHours,
    sessionsCompleted,
    averagePeerRating,
    responseRate,
    currentStreakDays,
    skillsMastered
  };
};
