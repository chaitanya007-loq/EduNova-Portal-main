/**
 * EduNova College Track & Semester Command Center Service
 * Manages college semester subjects, credits, project tracking, and evidence-based career readiness.
 */

const STORAGE_KEY_PROJECTS = 'edunova_college_projects';

const SEED_PROJECTS = [
  { id: 'proj_101', name: 'EduNova 3D Visualizer Lab', subject: 'Web Development & Graphics', technology: 'React + Three.js + WebGL', team: 'Aarav, Priya', deadline: '2026-10-15', progress: 75, status: 'Development' },
  { id: 'proj_102', name: 'Distributed OS CPU Scheduler Engine', subject: 'Operating Systems', technology: 'C++17 + POSIX Threads', team: 'Aarav (Solo)', deadline: '2026-09-30', progress: 90, status: 'Testing' },
  { id: 'proj_103', name: 'AI Learner Knowledge Graph API', subject: 'AI / ML Studio', technology: 'Python + FastAPI + PyTorch', team: 'Aarav, Rohan, Sneha', deadline: '2026-11-05', progress: 30, status: 'Planning' }
];

export const getSemesterData = () => {
  return {
    semesterNumber: 5,
    degree: 'B.Tech Computer Science & Engineering',
    activeSubjectsCount: 6,
    totalCredits: 24,
    completedModulesCount: 18,
    assignmentsDueCount: 3,
    projectsInProgressCount: 2,
    internalExamDaysRemaining: 12,
    subjects: [
      { name: 'Data Structures & Algorithms', credits: 4, progress: 84, grade: 'A+' },
      { name: 'Operating Systems', credits: 4, progress: 78, grade: 'A' },
      { name: 'Database Management Systems', credits: 4, progress: 88, grade: 'A+' },
      { name: 'Computer Networks', credits: 3, progress: 70, grade: 'B+' },
      { name: 'Web Development Studio', credits: 4, progress: 92, grade: 'O' },
      { name: 'AI & Machine Learning Essentials', credits: 5, progress: 76, grade: 'A' }
    ]
  };
};

export const getCollegeProjects = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not load projects', e);
  }
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(SEED_PROJECTS));
  return SEED_PROJECTS;
};

export const saveCollegeProjects = (projects) => {
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  window.dispatchEvent(new CustomEvent('edunova:projects_updated'));
  return projects;
};

export const getCareerReadiness = () => {
  return {
    targetRole: 'Full Stack & Systems Engineer',
    overallScore: 82,
    evidenceCriteria: [
      { category: 'Data Structures & Algorithms', level: 'Advanced', evidence: 'Verified via 42 Quiz Attempts & BST Lab' },
      { category: 'Frontend Systems (React/CSS)', level: 'Expert', evidence: '3 Projects Built & Peer Review Score 4.9/5' },
      { category: 'Database & SQL Optimization', level: 'Intermediate', evidence: 'DBMS Course 88% Complete' },
      { category: 'Backend REST API & Node.js', level: 'Intermediate', evidence: 'Express.js Module Completed' }
    ],
    skillsToDevelop: ['Docker & Containerization', 'Redis Caching & System Architecture'],
    recommendedProjects: ['Build a Real-time Redis Message Queue', 'Deploy Microservice API to Cloud']
  };
};

export default {
  getSemesterData,
  getCollegeProjects,
  saveCollegeProjects,
  getCareerReadiness
};
