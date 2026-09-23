import { universalSubjects } from '../data/subjects.js';
import { progressService } from './progressService.js';

const FAVORITES_KEY = 'edunova_favorite_subject_ids';
const CUSTOM_CURRICULUMS_KEY = 'edunova_custom_curriculums';

class CurriculumService {
  constructor() {
    this.favorites = this.loadFavorites();
    this.customCurriculums = this.loadCustomCurriculums();
  }

  loadFavorites() {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(this.favorites)));
    } catch (e) {
      console.error('Error saving favorite subjects:', e);
    }
  }

  toggleFavorite(subjectId) {
    if (this.favorites.has(subjectId)) {
      this.favorites.delete(subjectId);
    } else {
      this.favorites.add(subjectId);
    }
    this.saveFavorites();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('edunova_favorites_updated', {
        detail: { subjectId, isFavorite: this.favorites.has(subjectId), favorites: Array.from(this.favorites) }
      }));
    }
    return this.favorites.has(subjectId);
  }

  isFavorite(subjectId) {
    return this.favorites.has(subjectId);
  }

  loadCustomCurriculums() {
    try {
      const saved = localStorage.getItem(CUSTOM_CURRICULUMS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCustomCurriculums(curriculums) {
    try {
      localStorage.setItem(CUSTOM_CURRICULUMS_KEY, JSON.stringify(curriculums));
      this.customCurriculums = curriculums;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('edunova_curriculum_updated'));
      }
    } catch (e) {
      console.error('Error saving custom curriculums:', e);
    }
  }

  addCustomCurriculum(newCurriculum) {
    const current = this.loadCustomCurriculums();
    const updated = [newCurriculum, ...current];
    this.saveCustomCurriculums(updated);
    return newCurriculum;
  }

  getCustomCurriculums() {
    return this.loadCustomCurriculums();
  }

  getCurriculumContextBadge(learnerType, options = {}) {
    const type = (learnerType || 'school').toLowerCase();
    if (type === 'college') {
      return `${options.degree || 'B.Tech'} • ${options.branch || 'Computer Science'} • Semester ${options.semester || 5}`;
    }
    if (type === 'exam') {
      return `${options.exam || 'CMAT'} • Target ${options.targetYear || '2026'}`;
    }
    if (type === 'skills') {
      return `Skills & Career • ${options.domain || 'Software Development'}`;
    }
    return `Class ${options.class || '10'} • ${options.board || 'CBSE'} Board`;
  }

  computeDynamicNodes(baseNodes, userProgress = null) {
    const progressData = userProgress || (typeof window !== 'undefined' ? progressService.getUserProgress() : null);

    const learning = progressData?.learning || 0;
    const practice = progressData?.practice || 0;
    const assignments = progressData?.assignments || 0;
    const completedLessons = progressData?.completedLessons || 0;
    const completedQuizzes = progressData?.completedQuizzes || 0;
    const completedAssignments = progressData?.completedAssignments || 0;

    const totalActivity = completedLessons + completedQuizzes + completedAssignments;
    const overallPct = Math.min(100, Math.round((learning * 0.4) + (practice * 0.4) + (assignments * 0.2)));

    const numNodes = baseNodes.length;

    // Fresh user: All nodes 0% progress, Node 1 is In Progress, Node 2+ Locked
    if (totalActivity === 0 && overallPct === 0) {
      return baseNodes.map((node, idx) => ({
        ...node,
        progress: 0,
        status: idx === 0 ? 'In Progress' : 'Locked',
        recommendedNext: idx === 0
      }));
    }

    // Dynamic progression based on user activity
    const stepPct = 100 / numNodes;
    let recommendedSet = false;

    return baseNodes.map((node, idx) => {
      const startRange = idx * stepPct;
      const endRange = (idx + 1) * stepPct;

      let nodeProgress = 0;
      if (overallPct >= endRange) {
        nodeProgress = 100;
      } else if (overallPct > startRange) {
        nodeProgress = Math.min(100, Math.round(((overallPct - startRange) / stepPct) * 100));
      } else if (idx === 0) {
        nodeProgress = Math.min(100, Math.max(10, totalActivity * 25));
      }

      let status = 'Locked';
      let isRecommended = false;

      if (nodeProgress >= 100) {
        status = 'Mastered';
      } else if (idx === 0 || (idx > 0 && overallPct >= startRange)) {
        status = 'In Progress';
        if (!recommendedSet) {
          isRecommended = true;
          recommendedSet = true;
        }
      }

      return {
        ...node,
        progress: nodeProgress,
        status,
        recommendedNext: isRecommended
      };
    });
  }

  getLearningMapNodes(learnerType, userProgress = null) {
    const type = (learnerType || 'school').toLowerCase();
    let baseNodes = [];

    if (type === 'college') {
      baseNodes = [
        {
          id: 'col_node_1',
          level: 1,
          subject: 'COMPUTER SCIENCE CORE',
          title: 'C++ & Data Structures Fundamentals',
          description: 'Arrays, Linked Lists, Stacks, Queues, and Algorithm Complexity.',
          prerequisites: [],
          xp: 300,
          estimatedHours: 15
        },
        {
          id: 'col_node_2',
          level: 2,
          subject: 'COMPUTER SCIENCE CORE',
          title: 'Object-Oriented Analysis & Java',
          description: 'Inheritance, Polymorphism, Abstraction, Packages, and Exception Handling.',
          prerequisites: ['C++ & Data Structures Fundamentals'],
          xp: 350,
          estimatedHours: 18
        },
        {
          id: 'col_node_3',
          level: 3,
          subject: 'DATABASE MANAGEMENT SYSTEMS',
          title: 'Relational Model, BCNF & SQL Queries',
          description: 'Entity-Relationship Modeling, Normalization (1NF to BCNF), and Complex Joins.',
          prerequisites: ['C++ & Data Structures Fundamentals'],
          xp: 400,
          estimatedHours: 20
        },
        {
          id: 'col_node_4',
          level: 3,
          subject: 'OPERATING SYSTEMS',
          title: 'Process Management & Multithreading',
          description: 'CPU Scheduling, Deadlock Avoidance, Semaphore Locks, and Virtual Memory.',
          prerequisites: ['Object-Oriented Analysis & Java'],
          xp: 450,
          estimatedHours: 22
        },
        {
          id: 'col_node_5',
          level: 4,
          subject: 'COMPUTER NETWORKS',
          title: 'TCP/IP Architecture & Network Security',
          description: 'OSI 7 Layers, Subnetting, Routing Protocols, SSL/TLS, and Packet Analysis.',
          prerequisites: ['Process Management & Multithreading'],
          xp: 400,
          estimatedHours: 16
        },
        {
          id: 'col_node_6',
          level: 5,
          subject: 'ARTIFICIAL INTELLIGENCE',
          title: 'Machine Learning & Deep Neural Networks',
          description: 'Supervised Learning, Backpropagation, Convolutional Nets & LLM Fine-tuning.',
          prerequisites: ['Relational Model, BCNF', 'TCP/IP Architecture'],
          xp: 500,
          estimatedHours: 25
        }
      ];
    } else if (type === 'exam') {
      baseNodes = [
        {
          id: 'exam_node_1',
          level: 1,
          subject: 'QUANTITATIVE APTITUDE',
          title: 'Arithmetic Mastery & Speed Math',
          description: 'Percentages, Profit & Loss, Ratio, Averages, Time & Work shortcuts.',
          prerequisites: [],
          xp: 350,
          estimatedHours: 14
        },
        {
          id: 'exam_node_2',
          level: 2,
          subject: 'LOGICAL REASONING',
          title: 'Analytical Puzzles & Seating Arrangements',
          description: 'Matrix Grids, Circular Arrangements, Syllogisms, and Blood Relations.',
          prerequisites: ['Arithmetic Mastery & Speed Math'],
          xp: 300,
          estimatedHours: 12
        },
        {
          id: 'exam_node_3',
          level: 3,
          subject: 'DATA INTERPRETATION',
          title: 'Caselet Analytics & Complex Charts',
          description: 'Bar Graphs, Pie Charts, Radar Graphs, and Data Sufficiency Sets.',
          prerequisites: ['Analytical Puzzles'],
          xp: 400,
          estimatedHours: 15
        },
        {
          id: 'exam_node_4',
          level: 3,
          subject: 'VERBAL ABILITY',
          title: 'Reading Comprehension & Critical Reasoning',
          description: 'Passage Inference, Para Jumbles, Vocabulary in Context & Grammar Rules.',
          prerequisites: ['Analytical Puzzles'],
          xp: 350,
          estimatedHours: 10
        },
        {
          id: 'exam_node_5',
          level: 4,
          subject: 'INNOVATION & ENTREPRENEURSHIP',
          title: 'Business Aptitude & Startup Strategy',
          description: 'Venture Capital, Product-Market Fit, CMAT Specific Innovation Modules.',
          prerequisites: ['Caselet Analytics'],
          xp: 450,
          estimatedHours: 18
        }
      ];
    } else if (type === 'skills') {
      baseNodes = [
        {
          id: 'skill_node_1',
          level: 1,
          subject: 'FRONTEND DEVELOPMENT',
          title: 'HTML5, CSS3 & Modern JavaScript ES6+',
          description: 'DOM Manipulation, Flexbox/Grid layouts, Promises, Async/Await & Fetch API.',
          prerequisites: [],
          xp: 250,
          estimatedHours: 12
        },
        {
          id: 'skill_node_2',
          level: 2,
          subject: 'FRONTEND ENGINEERING',
          title: 'React 18 State, Hooks & Component Design',
          description: 'JSX, useState, useEffect, Context API, Tailwind/CSS Modules & Performance.',
          prerequisites: ['HTML5, CSS3 & Modern JavaScript'],
          xp: 400,
          estimatedHours: 20
        },
        {
          id: 'skill_node_3',
          level: 3,
          subject: 'BACKEND ARCHITECTURE',
          title: 'Node.js, Express & RESTful API Engine',
          description: 'Middleware Pipeline, JWT Authentication, Error Handling & Route Controllers.',
          prerequisites: ['React 18 State & Hooks'],
          xp: 450,
          estimatedHours: 22
        },
        {
          id: 'skill_node_4',
          level: 4,
          subject: 'DATABASE & ORM LAYER',
          title: 'PostgreSQL Relational DB & Prisma ORM',
          description: 'Schema Migrations, Model Relations, Indexing & Query Performance Optimization.',
          prerequisites: ['Node.js & Express REST API'],
          xp: 400,
          estimatedHours: 16
        },
        {
          id: 'skill_node_5',
          level: 5,
          subject: 'AI & CLOUD DEPLOYMENT',
          title: 'AI Integration, Vector Embeddings & DevOps',
          description: 'OpenAI API, Vector Databases (pgvector), Docker, CI/CD & Vercel/Render Deploy.',
          prerequisites: ['PostgreSQL & Prisma ORM'],
          xp: 600,
          estimatedHours: 30
        }
      ];
    } else {
      // Default School Track (Class 10)
      baseNodes = [
        {
          id: 'sch_node_1',
          level: 1,
          subject: 'MATHEMATICS CLASS 10',
          title: 'Real Numbers & Polynomial Theorems',
          description: 'Euclid Division Algorithm, Fundamental Theorem of Arithmetic, Zeroes of Polynomials.',
          prerequisites: [],
          xp: 200,
          estimatedHours: 8
        },
        {
          id: 'sch_node_2',
          level: 2,
          subject: 'MATHEMATICS CLASS 10',
          title: 'Linear Equations & Quadratic Equations',
          description: 'Graphical & Algebraic Solutions, Discriminant Method & Problem Applications.',
          prerequisites: ['Real Numbers & Polynomial Theorems'],
          xp: 220,
          estimatedHours: 10
        },
        {
          id: 'sch_node_3',
          level: 3,
          subject: 'MATHEMATICS CLASS 10',
          title: 'Trigonometric Ratios & Heights & Distances',
          description: 'Trigonometric Identities, Complementary Angles & Angle of Elevation Problems.',
          prerequisites: ['Linear Equations & Quadratic Equations'],
          xp: 250,
          estimatedHours: 12
        },
        {
          id: 'sch_node_4',
          level: 3,
          subject: 'PHYSICS (SCIENCE)',
          title: 'Light - Reflection, Refraction & Lenses',
          description: 'Spherical Mirrors, Mirror Formula, Refractive Index & Lens Formula calculations.',
          prerequisites: ['Real Numbers & Polynomial Theorems'],
          xp: 240,
          estimatedHours: 10
        },
        {
          id: 'sch_node_5',
          level: 4,
          subject: 'CHEMISTRY (SCIENCE)',
          title: 'Chemical Reactions, Acids, Bases & Salts',
          description: 'Types of Reactions, Redox Balancing, pH Scale & Salts Preparation.',
          prerequisites: ['Physics Light - Reflection & Refraction'],
          xp: 230,
          estimatedHours: 9
        },
        {
          id: 'sch_node_6',
          level: 5,
          subject: 'BIOLOGY (SCIENCE)',
          title: 'Life Processes & Control & Coordination',
          description: 'Nutrition, Respiration, Transportation, Excretion & Nervous System Overview.',
          prerequisites: ['Chemistry Reactions'],
          xp: 280,
          estimatedHours: 14
        }
      ];
    }

    return this.computeDynamicNodes(baseNodes, userProgress);
  }

  getCategoryTabs(learnerType) {
    const type = (learnerType || 'school').toLowerCase();
    if (type === 'college') return ['All', 'Core CS', 'Systems', 'AI & Data', 'Database'];
    if (type === 'exam') return ['All', 'Quantitative Aptitude', 'Logical Reasoning', 'Verbal', 'Data Interpretation'];
    if (type === 'skills') return ['All', 'Frontend', 'Backend', 'AI & ML', 'DevOps'];
    return ['All', 'Mathematics', 'Science', 'English', 'Social Science', 'Computer Applications'];
  }

  getCurriculumSubjects({ learnerType = 'school', options = {}, category = 'All', search = '', sortBy = 'Priority', onlyFavorites = false, customCurriculumId = null, userProgress = null }) {
    // If a custom curriculum is selected, return its subjects!
    if (customCurriculumId) {
      const customCurriculums = this.loadCustomCurriculums();
      const targetCustom = customCurriculums.find(c => c.id === customCurriculumId);
      if (targetCustom && targetCustom.subjects) {
        return targetCustom.subjects;
      }
    }

    const type = (learnerType || 'school').toLowerCase();
    
    // Filter base subjects
    let result = universalSubjects.filter(s => {
      const sType = (s.educationType || 'school').toLowerCase();
      if (sType !== type) return false;

      if (type === 'school' && options.class) {
        if (s.class && String(s.class) !== String(options.class)) return false;
      }

      if (type === 'exam' && options.exam) {
        const selExam = options.exam.toLowerCase();
        const sExam = (s.exam || '').toLowerCase();
        if (sExam) {
          if (selExam.includes('jee') && !sExam.includes('jee')) return false;
          if (selExam.includes('gate') && !sExam.includes('gate')) return false;
          if (selExam.includes('neet') && !sExam.includes('neet')) return false;
          if (selExam.includes('cat') && !selExam.includes('cmat') && !sExam.includes('cat')) return false;
          if (selExam.includes('cmat') && !sExam.includes('cmat')) return false;
          if (selExam.includes('upsc') && !sExam.includes('upsc')) return false;
          if (selExam.includes('bank') && !sExam.includes('bank')) return false;
        }
      }

      return true;
    });

    // Also include subjects from custom curriculums matching this track type
    const customList = this.loadCustomCurriculums();
    customList.forEach(c => {
      if ((c.educationType || 'custom').toLowerCase() === type || type === 'custom') {
        if (c.subjects && Array.isArray(c.subjects)) {
          result = [...result, ...c.subjects];
        }
      }
    });

    // Category filter with smart case-insensitive keyword matching
    if (category && category !== 'All') {
      const catLower = category.toLowerCase();
      result = result.filter(s => {
        const sCat = (s.category || '').toLowerCase();
        const sName = (s.name || '').toLowerCase();
        const sDesc = (s.description || '').toLowerCase();

        // Smart track category keyword aliases
        if (catLower === 'frontend') {
          return sCat.includes('front') || sName.includes('web') || sName.includes('react') || sName.includes('html') || sDesc.includes('frontend') || sDesc.includes('ui');
        }
        if (catLower === 'backend') {
          return sCat.includes('back') || sName.includes('node') || sName.includes('express') || sName.includes('api') || sName.includes('sql') || sDesc.includes('backend');
        }
        if (catLower === 'ai & ml') {
          return sCat.includes('ai') || sName.includes('machine') || sName.includes('python') || sName.includes('deep') || sDesc.includes('learning');
        }
        if (catLower === 'devops') {
          return sCat.includes('devops') || sName.includes('cloud') || sName.includes('docker') || sDesc.includes('deploy');
        }
        if (catLower === 'core cs') {
          return sCat.includes('core') || sName.includes('dsa') || sName.includes('structures') || sName.includes('c++') || sName.includes('java');
        }
        if (catLower === 'systems') {
          return sCat.includes('system') || sName.includes('operating') || sName.includes('network') || sName.includes('architecture');
        }
        if (catLower === 'ai & data') {
          return sCat.includes('data') || sCat.includes('ai') || sName.includes('dbms') || sName.includes('database') || sName.includes('sql');
        }
        if (catLower === 'database') {
          return sCat.includes('data') || sName.includes('dbms') || sName.includes('sql') || sName.includes('database');
        }
        if (catLower === 'quantitative aptitude') {
          return sCat.includes('quant') || sName.includes('arithmetic') || sName.includes('math');
        }
        if (catLower === 'logical reasoning') {
          return sCat.includes('logic') || sName.includes('reasoning') || sName.includes('puzzle');
        }
        if (catLower === 'verbal') {
          return sCat.includes('verbal') || sName.includes('english') || sName.includes('reading');
        }
        if (catLower === 'data interpretation') {
          return sCat.includes('data') || sName.includes('caselet') || sName.includes('chart');
        }

        return sCat.includes(catLower) || sName.includes(catLower) || sDesc.includes(catLower);
      });
    }

    // Search filter
    if (search && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.currentTopic && s.currentTopic.toLowerCase().includes(q))
      );
    }

    // Dynamic user progress evaluation
    const progressData = userProgress || (typeof window !== 'undefined' ? progressService.getUserProgress() : null);
    const totalActivity = (progressData?.completedLessons || 0) + (progressData?.completedQuizzes || 0) + (progressData?.completedAssignments || 0);
    const overallPct = Math.min(100, Math.round(((progressData?.learning || 0) * 0.4) + ((progressData?.practice || 0) * 0.4) + ((progressData?.assignments || 0) * 0.2)));

    // Attach current favorite state & computed dynamic progress to all objects
    result = result.map((s, idx) => {
      let calcProgress = 0;
      if (totalActivity > 0 || overallPct > 0) {
        calcProgress = Math.min(100, Math.max(0, Math.round(overallPct * (0.85 + (idx % 3) * 0.1))));
      }

      return {
        ...s,
        progress: calcProgress,
        favorite: this.isFavorite(s.id)
      };
    });

    // Favorites filter
    if (onlyFavorites) {
      result = result.filter(s => s.favorite);
    }

    return result;
  }

  getPrimaryRecommendation(learnerType) {
    const type = (learnerType || 'school').toLowerCase();
    if (type === 'college') {
      return {
        subjectId: 'col_dbms_sem5',
        recommendation: 'Database Management Systems (DBMS)',
        reason: 'Essential prerequisite for upcoming Systems Architecture & BCNF Normalization quizzes.'
      };
    }
    return {
      subjectId: 'sch_math_10',
      recommendation: 'Mathematics Class 10 (Trigonometry)',
      reason: 'High priority topic for upcoming Board diagnostics.'
    };
  }

  getWhatToLearnNext(learnerType) {
    const type = (learnerType || 'school').toLowerCase();
    if (type === 'college') {
      return {
        title: 'Data Structures & Algorithms (Graph Theory)',
        reason: 'Sage AI identified 65% accuracy in Trees & Graphs. Recommended 20-min interactive practice to reach 90% target benchmark.',
        subjectId: 'col_dsa_sem5',
        subjectName: 'Data Structures & Algorithms'
      };
    } else if (type === 'exam') {
      return {
        title: 'Quantitative Aptitude (Speed Math & DI)',
        reason: 'High yield CMAT & CAT module with 15 diagnostic questions ready for target score improvement.',
        subjectId: 'exam_cmat_quant',
        subjectName: 'Quantitative Aptitude'
      };
    } else if (type === 'skills') {
      return {
        title: 'React 18 Server Components & Hooks',
        reason: 'Master modern frontend patterns with Sage AI code hints and hands-on lab sandbox.',
        subjectId: 'skill_react_full',
        subjectName: 'Full Stack Web Development'
      };
    }
    return {
      title: 'Physics Class 10 (Light - Reflection & Refraction)',
      reason: 'Sage AI scheduled targeted practice based on your recent 72% quiz score in Ray Diagrams.',
      subjectId: 'sch_phy_10',
      subjectName: 'Physics Class 10'
    };
  }
}

export const curriculumService = new CurriculumService();
export default curriculumService;
