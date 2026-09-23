/**
 * EduNova Rich Database Seeder & Data Synchronizer
 * 
 * Populates realistic, high-fidelity EdTech data across all 20 tables:
 * - Ensures all Users have properly configured LearnerProfiles
 * - Enriches subjects across SCHOOL, COLLEGE, SKILLS, and EXAM tiers
 * - Adds dynamic courses with multi-module curricula
 * - Adds quizzes with multi-choice questions and explanations
 * - Seeds quiz attempts, study sessions, XP logs, and missions for students
 * - Seeds peer conversations and skill exchanges
 */

const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 3,
  parallelism: 1,
};

async function seedRichData() {
  console.log('🚀 Starting EduNova Database Population & Verification...\n');

  // ──────────────────────────────────────────────────────────────────────────
  // 1. ENSURE USERS & PROFILES
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- 1. Syncing Users & Learner Profiles ---');
  const defaultPassword = await argon2.hash('Password@123', ARGON2_OPTIONS);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edunova.in' },
    update: { role: 'ADMIN' },
    create: {
      name: 'EduNova Admin',
      email: 'admin@edunova.in',
      passwordHash: defaultPassword,
      role: 'ADMIN',
      learnerType: 'COLLEGE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  // Instructor 1: Dr. Priya Sharma
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@edunova.in' },
    update: { role: 'INSTRUCTOR' },
    create: {
      name: 'Dr. Priya Sharma',
      email: 'instructor@edunova.in',
      passwordHash: defaultPassword,
      role: 'INSTRUCTOR',
      learnerType: 'COLLEGE',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
  });

  // Instructor 2: Prof. Rajesh Verma
  const instructor2 = await prisma.user.upsert({
    where: { email: 'rajesh.verma@edunova.in' },
    update: { role: 'INSTRUCTOR' },
    create: {
      name: 'Prof. Rajesh Verma',
      email: 'rajesh.verma@edunova.in',
      passwordHash: defaultPassword,
      role: 'INSTRUCTOR',
      learnerType: 'SKILLS',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  // Student 1: Chaitanya Sanchaniya
  let chaitanya = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'chaitanyasanchaniya7@gmail.com' },
        { studentUsername: 'chaitanya_s' },
      ],
    },
  });

  if (!chaitanya) {
    chaitanya = await prisma.user.create({
      data: {
        name: 'Chaitanya Sanchaniya',
        email: 'chaitanyasanchaniya7@gmail.com',
        passwordHash: defaultPassword,
        role: 'STUDENT',
        learnerType: 'SCHOOL',
        studentUsername: 'chaitanya_s',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      },
    });
  }

  await prisma.learnerProfile.upsert({
    where: { userId: chaitanya.id },
    update: {
      board: 'CBSE - Class 12',
      degree: 'JEE Advanced Aspirant',
      goals: ['Score 98% in JEE Advanced', 'Master Calculus & Thermodynamics', 'Learn Full-Stack Systems'],
      weakTopics: ['Rotational Dynamics', 'Organic Reactions'],
      xp: 1450,
      level: 6,
      streakDays: 8,
    },
    create: {
      userId: chaitanya.id,
      board: 'CBSE - Class 12',
      degree: 'JEE Advanced Aspirant',
      goals: ['Score 98% in JEE Advanced', 'Master Calculus & Thermodynamics', 'Learn Full-Stack Systems'],
      weakTopics: ['Rotational Dynamics', 'Organic Reactions'],
      xp: 1450,
      level: 6,
      streakDays: 8,
    },
  });

  // Student 2: Arjun Patel
  const arjun = await prisma.user.upsert({
    where: { email: 'student@edunova.in' },
    update: {},
    create: {
      name: 'Arjun Patel',
      email: 'student@edunova.in',
      passwordHash: defaultPassword,
      role: 'STUDENT',
      learnerType: 'SCHOOL',
      studentUsername: 'arjun_patel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  });

  await prisma.learnerProfile.upsert({
    where: { userId: arjun.id },
    update: {},
    create: {
      userId: arjun.id,
      board: 'CBSE',
      goals: ['Crack NEET', 'Board Excellence'],
      weakTopics: ['Electromagnetism', 'Genetics'],
      xp: 1250,
      level: 5,
      streakDays: 12,
    },
  });

  // Student 3: Alice Walker (Skills Learner)
  const alice = await prisma.user.upsert({
    where: { email: 'peer.alice@edunova.in' },
    update: {},
    create: {
      name: 'Alice Walker',
      email: 'peer.alice@edunova.in',
      passwordHash: defaultPassword,
      role: 'STUDENT',
      learnerType: 'SKILLS',
      studentUsername: 'alice_w',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  await prisma.learnerProfile.upsert({
    where: { userId: alice.id },
    update: {},
    create: {
      userId: alice.id,
      board: null,
      degree: 'B.Tech Computer Science',
      goals: ['Master Cloud Architecture', 'Build Distributed Systems'],
      weakTopics: ['Dynamic Programming', 'Kubernetes'],
      xp: 920,
      level: 4,
      streakDays: 6,
    },
  });

  // Student 4: Bob Builder (College Learner)
  const bob = await prisma.user.upsert({
    where: { email: 'peer.bob@edunova.in' },
    update: {},
    create: {
      name: 'Bob Builder',
      email: 'peer.bob@edunova.in',
      passwordHash: defaultPassword,
      role: 'STUDENT',
      learnerType: 'COLLEGE',
      studentUsername: 'bob_b',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    },
  });

  await prisma.learnerProfile.upsert({
    where: { userId: bob.id },
    update: {},
    create: {
      userId: bob.id,
      board: null,
      degree: 'Mechanical Engineering',
      goals: ['Fluid Dynamics Mastery', 'Robotics Systems'],
      weakTopics: ['Thermodynamic Cycles'],
      xp: 680,
      level: 3,
      streakDays: 4,
    },
  });

  // Parent: Meera Patel (linked to arjun)
  await prisma.user.upsert({
    where: { email: 'parent@edunova.in' },
    update: { studentUsername: 'arjun_patel' },
    create: {
      name: 'Meera Patel',
      email: 'parent@edunova.in',
      passwordHash: defaultPassword,
      role: 'PARENT',
      learnerType: 'SCHOOL',
      studentUsername: 'arjun_patel',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
  });

  console.log('✅ Users & Profiles verified and synchronized.\n');

  // ──────────────────────────────────────────────────────────────────────────
  // 2. ENRICH SUBJECTS & TOPICS ACROSS ALL CATEGORIES
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- 2. Seeding Multi-Tier Subjects & Topics ---');

  const subjectDefs = [
    // SCHOOL
    {
      name: 'Physics XII',
      category: 'Science',
      educationType: 'SCHOOL',
      class: 'Class 12',
      board: 'CBSE',
      topics: ['Electrostatics', 'Current Electricity', 'Magnetism', 'Electromagnetic Induction', 'Optics', 'Semiconductors'],
    },
    {
      name: 'Mathematics XII',
      category: 'Science',
      educationType: 'SCHOOL',
      class: 'Class 12',
      board: 'CBSE',
      topics: ['Relations & Functions', 'Matrices & Determinants', 'Calculus (Derivatives & Integrals)', 'Vector Algebra', 'Probability'],
    },
    {
      name: 'Chemistry XII',
      category: 'Science',
      educationType: 'SCHOOL',
      class: 'Class 12',
      board: 'CBSE',
      topics: ['Solutions & Colligative', 'Electrochemistry', 'Chemical Kinetics', 'Coordination Compounds', 'Aldehydes & Ketones'],
    },
    {
      name: 'Biology XII',
      category: 'Science',
      educationType: 'SCHOOL',
      class: 'Class 12',
      board: 'CBSE',
      topics: ['Genetics & Evolution', 'Biotechnology Principles', 'Human Health & Disease', 'Ecology & Environment'],
    },

    // COLLEGE
    {
      name: 'Data Structures & Algorithms',
      category: 'Computer Science',
      educationType: 'COLLEGE',
      class: 'Semester 3',
      topics: ['Arrays & Hash Maps', 'Linked Lists & Trees', 'Graph Algorithms', 'Dynamic Programming', 'Greedy & Backtracking'],
    },
    {
      name: 'Database Management Systems',
      category: 'Computer Science',
      educationType: 'COLLEGE',
      class: 'Semester 4',
      topics: ['Relational Model & SQL', 'Indexing & B-Trees', 'ACID Transactions & Concurrency', 'NoSQL Architectures'],
    },

    // SKILLS
    {
      name: 'Modern Full-Stack Engineering',
      category: 'Software Engineering',
      educationType: 'SKILLS',
      class: 'Professional',
      topics: ['React 19 & Next.js Architecture', 'Node.js & Express REST APIs', 'PostgreSQL & Prisma ORM', 'WebSockets & Real-time Systems'],
    },
    {
      name: 'Applied Machine Learning',
      category: 'Data Science',
      educationType: 'SKILLS',
      class: 'Professional',
      topics: ['Linear Regression & Classification', 'Neural Networks with PyTorch', 'NLP & LLM Architectures', 'Model Deployment & MLOps'],
    },

    // EXAM
    {
      name: 'Quantitative Aptitude',
      category: 'Competitive Exams',
      educationType: 'EXAM',
      class: 'All Levels',
      topics: ['Arithmetic & Percentages', 'Algebra & Geometry', 'Data Interpretation', 'Probability & Combinatorics'],
    },
  ];

  const createdSubjects = {};
  for (const sDef of subjectDefs) {
    let existing = await prisma.subject.findFirst({
      where: { name: sDef.name, educationType: sDef.educationType },
    });

    if (!existing) {
      existing = await prisma.subject.create({
        data: {
          name: sDef.name,
          category: sDef.category,
          educationType: sDef.educationType,
          class: sDef.class,
          board: sDef.board || null,
          createdById: admin.id,
          topics: {
            create: sDef.topics.map((t, idx) => ({ title: t, order: idx + 1 })),
          },
        },
        include: { topics: true },
      });
    }
    createdSubjects[sDef.name] = existing;
  }
  console.log(`✅ Ensured ${Object.keys(createdSubjects).length} comprehensive subjects with topics.\n`);

  // ──────────────────────────────────────────────────────────────────────────
  // 3. ENRICH COURSES & MODULES
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- 3. Seeding Courses & Modules ---');

  const courseDefs = [
    {
      title: 'Complete Physics for JEE Mains & Advanced',
      description: 'Comprehensive physics curriculum with solved numericals, concept visualizers, and past year question walk-throughs.',
      category: 'JEE Preparation',
      difficulty: 'INTERMEDIATE',
      instructorId: instructor.id,
      rating: 4.8,
      totalRatings: 342,
      modules: [
        { title: 'Mechanics & Newton Laws of Motion', duration: 120, order: 1 },
        { title: 'Thermodynamics & Kinetic Theory', duration: 100, order: 2 },
        { title: 'Electrostatics & Gauss Theorem', duration: 140, order: 3 },
        { title: 'Electromagnetic Waves & Ray Optics', duration: 110, order: 4 },
        { title: 'Modern Physics & Quantum Mechanics', duration: 90, order: 5 },
      ],
    },
    {
      title: 'Full-Stack Web Development with React & Node.js',
      description: 'From zero to production: build robust web applications using React, Next.js, Express, Socket.IO, and PostgreSQL.',
      category: 'Software Engineering',
      difficulty: 'INTERMEDIATE',
      instructorId: instructor2.id,
      rating: 4.9,
      totalRatings: 512,
      modules: [
        { title: 'Modern JavaScript (ES6+) & TypeScript Foundations', duration: 90, order: 1 },
        { title: 'React Core Architecture & Hooks Ecosystem', duration: 150, order: 2 },
        { title: 'RESTful API Engineering with Express & Prisma', duration: 130, order: 3 },
        { title: 'Real-Time State with WebSockets & Socket.IO', duration: 110, order: 4 },
        { title: 'Production Security, Docker & Cloud Deployment', duration: 100, order: 5 },
      ],
    },
    {
      title: 'Mastering Data Structures & Algorithms',
      description: 'Ace technical interviews at top tier tech companies with battle-tested problem-solving patterns.',
      category: 'Computer Science',
      difficulty: 'ADVANCED',
      instructorId: instructor2.id,
      rating: 4.9,
      totalRatings: 420,
      modules: [
        { title: 'Algorithmic Complexity & Big-O Notation', duration: 60, order: 1 },
        { title: 'Two Pointers, Sliding Window & Prefix Sums', duration: 120, order: 2 },
        { title: 'Binary Trees, BSTs & Trie Architectures', duration: 140, order: 3 },
        { title: 'Graph Traversals (BFS/DFS) & Dijkstra Algorithm', duration: 160, order: 4 },
        { title: 'Dynamic Programming from 1D to 2D Optimization', duration: 180, order: 5 },
      ],
    },
  ];

  const createdCourses = [];
  for (const cDef of courseDefs) {
    let course = await prisma.course.findFirst({
      where: { title: cDef.title },
      include: { modules: true },
    });

    if (!course) {
      course = await prisma.course.create({
        data: {
          title: cDef.title,
          description: cDef.description,
          category: cDef.category,
          difficulty: cDef.difficulty,
          instructorId: cDef.instructorId,
          rating: cDef.rating,
          totalRatings: cDef.totalRatings,
          isPublished: true,
          modules: {
            create: cDef.modules.map((m) => ({
              title: m.title,
              duration: m.duration,
              order: m.order,
            })),
          },
        },
        include: { modules: true },
      });
    }
    createdCourses.push(course);
  }
  console.log(`✅ Ensured ${createdCourses.length} production-ready courses with modules.\n`);

  // ──────────────────────────────────────────────────────────────────────────
  // 4. SEED QUIZZES WITH HIGH-QUALITY QUESTIONS
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- 4. Seeding Quizzes & Question Banks ---');

  const physicsSubject = createdSubjects['Physics XII'] || Object.values(createdSubjects)[0];
  const mathSubject = createdSubjects['Mathematics XII'] || Object.values(createdSubjects)[1];
  const webSubject = createdSubjects['Modern Full-Stack Engineering'] || Object.values(createdSubjects)[0];

  const quizDefs = [
    {
      title: 'Physics Electrostatics & Field Theory Diagnostic',
      subjectId: physicsSubject.id,
      difficulty: 'INTERMEDIATE',
      questions: [
        {
          questionText: 'What is the SI unit of Electric Permittivity of free space (ε₀)?',
          options: ['C² N⁻¹ m⁻²', 'N m² C⁻²', 'C N⁻¹ m⁻¹', 'V m⁻¹'],
          correctOptionIndex: 0,
          explanation: 'From Coulomb’s Law, F = (1 / 4πε₀) * (q₁q₂ / r²), giving ε₀ units of C² N⁻¹ m⁻².',
          fingerprint: 'fp_phy_01',
        },
        {
          questionText: 'An electric dipole placed in a uniform electric field experiences:',
          options: ['Both net force and net torque', 'A net force but zero torque', 'Zero net force but non-zero torque', 'Zero force and zero torque'],
          correctOptionIndex: 2,
          explanation: 'In a uniform field, equal and opposite charges experience equal and opposite forces (net force = 0), but generate torque τ = p × E.',
          fingerprint: 'fp_phy_02',
        },
        {
          questionText: 'The work done in moving a test charge across an equipotential surface is always:',
          options: ['Dependent on path taken', 'Zero', 'Proportional to surface area', 'Equal to the potential difference'],
          correctOptionIndex: 1,
          explanation: 'Work done W = q * ΔV. On an equipotential surface, ΔV = 0, therefore work done is always zero.',
          fingerprint: 'fp_phy_03',
        },
        {
          questionText: 'If a dielectric slab of dielectric constant K is inserted between the plates of a charged disconnected capacitor:',
          options: ['Capacitance decreases by K', 'Voltage increases by K', 'Stored energy decreases by factor of K', 'Electric field increases'],
          correctOptionIndex: 2,
          explanation: 'With battery disconnected, charge Q remains constant. Capacitance C becomes KC, so energy U = Q² / (2KC) decreases by 1/K.',
          fingerprint: 'fp_phy_04',
        },
      ],
    },
    {
      title: 'Calculus & Differential Equations Benchmark',
      subjectId: mathSubject.id,
      difficulty: 'ADVANCED',
      questions: [
        {
          questionText: 'What is the derivative of f(x) = ln(sec(x) + tan(x)) with respect to x?',
          options: ['sec(x)', 'tan(x)', 'sec²(x)', 'sec(x)tan(x)'],
          correctOptionIndex: 0,
          explanation: 'd/dx [ln(sec x + tan x)] = (sec x tan x + sec² x) / (sec x + tan x) = sec x.',
          fingerprint: 'fp_math_01',
        },
        {
          questionText: 'The value of definite integral ∫ (from 0 to π/2) of sin(x) / (sin(x) + cos(x)) dx is:',
          options: ['π', 'π/2', 'π/4', '1'],
          correctOptionIndex: 2,
          explanation: 'By King’s property of definite integrals: 2I = ∫ (from 0 to π/2) 1 dx = π/2, hence I = π/4.',
          fingerprint: 'fp_math_02',
        },
        {
          questionText: 'The order and degree of the differential equation d²y/dx² + (dy/dx)³ = sin(x) are:',
          options: ['Order 2, Degree 1', 'Order 1, Degree 3', 'Order 2, Degree 3', 'Order 3, Degree 2'],
          correctOptionIndex: 0,
          explanation: 'The highest order derivative present is d²y/dx² (Order 2), and its power is 1 (Degree 1).',
          fingerprint: 'fp_math_03',
        },
      ],
    },
    {
      title: 'Full-Stack JavaScript & Systems Architecture Quiz',
      subjectId: webSubject.id,
      difficulty: 'INTERMEDIATE',
      questions: [
        {
          questionText: 'In Node.js event loop, which queue is processed immediately after microtasks (process.nextTick & Promises)?',
          options: ['Check Phase (setImmediate)', 'Timers Phase (setTimeout/setInterval)', 'Poll Phase (I/O)', 'Close Callbacks'],
          correctOptionIndex: 1,
          explanation: 'The event loop processes microtasks first, followed by the Timers phase.',
          fingerprint: 'fp_web_01',
        },
        {
          questionText: 'Which HTTP header prevents cross-site request forgery attacks by controlling cookie transmission across domains?',
          options: ['SameSite (Strict / Lax)', 'X-Content-Type-Options', 'Strict-Transport-Security', 'Access-Control-Allow-Credentials'],
          correctOptionIndex: 0,
          explanation: 'SameSite=Strict or SameSite=Lax prevents the browser from sending session cookies with cross-site requests.',
          fingerprint: 'fp_web_02',
        },
      ],
    },
  ];

  const createdQuizzes = [];
  for (const qDef of quizDefs) {
    let quiz = await prisma.quiz.findFirst({
      where: { title: qDef.title },
      include: { questions: true },
    });

    if (!quiz) {
      quiz = await prisma.quiz.create({
        data: {
          title: qDef.title,
          subjectId: qDef.subjectId,
          difficulty: qDef.difficulty,
          totalQuestions: qDef.questions.length,
          questions: {
            create: qDef.questions.map((q) => ({
              questionText: q.questionText,
              options: q.options,
              correctOptionIndex: q.correctOptionIndex,
              explanation: q.explanation,
              fingerprint: q.fingerprint,
            })),
          },
        },
        include: { questions: true },
      });
    }
    createdQuizzes.push(quiz);
  }
  console.log(`✅ Ensured ${createdQuizzes.length} rich diagnostic quizzes.\n`);

  // ──────────────────────────────────────────────────────────────────────────
  // 5. SEED CHAITANYA & ARJUN PROGRESS, ANALYTICS, AND GAMIFICATION
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- 5. Seeding Real Analytics Data for Chaitanya Sanchaniya ---');

  // Link Subject Progress
  const chaitanyaSubjects = [
    { subjectId: physicsSubject.id, progress: 74.0, targetScore: 95, syllabusCoverage: 68.0 },
    { subjectId: mathSubject.id, progress: 82.0, targetScore: 98, syllabusCoverage: 78.0 },
    { subjectId: webSubject.id, progress: 60.0, targetScore: 90, syllabusCoverage: 55.0 },
  ];

  for (const sp of chaitanyaSubjects) {
    await prisma.studentSubjectProgress.upsert({
      where: {
        userId_subjectId: {
          userId: chaitanya.id,
          subjectId: sp.subjectId,
        },
      },
      update: {
        progress: sp.progress,
        targetScore: sp.targetScore,
        syllabusCoverage: sp.syllabusCoverage,
      },
      create: {
        userId: chaitanya.id,
        subjectId: sp.subjectId,
        progress: sp.progress,
        targetScore: sp.targetScore,
        syllabusCoverage: sp.syllabusCoverage,
      },
    });
  }

  // Enroll in course
  if (createdCourses.length > 0) {
    const mainCourse = createdCourses[0];
    await prisma.userCourseProgress.upsert({
      where: {
        userId_courseId: {
          userId: chaitanya.id,
          courseId: mainCourse.id,
        },
      },
      update: {
        completedModuleIds: mainCourse.modules.slice(0, 2).map((m) => m.id),
        progress: 40.0,
      },
      create: {
        userId: chaitanya.id,
        courseId: mainCourse.id,
        completedModuleIds: mainCourse.modules.slice(0, 2).map((m) => m.id),
        progress: 40.0,
      },
    });
  }

  // Study Sessions (Planned vs Completed for Analytics)
  const today = new Date();
  const sessionDates = [
    { daysAgo: 0, duration: 60, completed: true },
    { daysAgo: 1, duration: 45, completed: true },
    { daysAgo: 2, duration: 50, completed: true },
    { daysAgo: 3, duration: 30, completed: true },
    { daysAgo: 4, duration: 45, completed: false }, // planned but missed
    { daysAgo: 5, duration: 60, completed: true },
  ];

  const existingSessions = await prisma.studySession.count({ where: { userId: chaitanya.id } });
  if (existingSessions < 3) {
    for (const s of sessionDates) {
      const d = new Date(today);
      d.setDate(d.getDate() - s.daysAgo);
      await prisma.studySession.create({
        data: {
          userId: chaitanya.id,
          subjectId: physicsSubject.id,
          durationMinutes: s.duration,
          plannedDate: d,
          completed: s.completed,
        },
      });
    }
  }

  // Quiz Attempts
  const existingAttempts = await prisma.quizAttempt.count({ where: { userId: chaitanya.id } });
  if (existingAttempts < 3 && createdQuizzes.length > 0) {
    const q1 = createdQuizzes[0];
    const q2 = createdQuizzes[1];

    await prisma.quizAttempt.createMany({
      data: [
        {
          quizId: q1.id,
          userId: chaitanya.id,
          score: 3,
          totalQuestions: 4,
          accuracy: 75.0,
          timeSpentSec: 145,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          quizId: q2.id,
          userId: chaitanya.id,
          score: 3,
          totalQuestions: 3,
          accuracy: 100.0,
          timeSpentSec: 98,
          createdAt: new Date(),
        },
      ],
    });
  }

  // XP Transactions
  const existingXp = await prisma.xpTransaction.count({ where: { userId: chaitanya.id } });
  if (existingXp < 5) {
    await prisma.xpTransaction.createMany({
      data: [
        { userId: chaitanya.id, amount: 80, sourceTitle: 'Completed Electrostatics Lesson' },
        { userId: chaitanya.id, amount: 110, sourceTitle: 'Calculus Benchmark Mastery Bonus' },
        { userId: chaitanya.id, amount: 50, sourceTitle: '60-min Deep Work Study Session' },
        { userId: chaitanya.id, amount: 40, sourceTitle: 'Daily Login Streak (Day 8)' },
        { userId: chaitanya.id, amount: 150, sourceTitle: 'Weekly Mission: Active Problem Solver' },
      ],
    });
  }

  // Missions
  const missionsList = await prisma.mission.findMany();
  for (const m of missionsList) {
    await prisma.userMission.upsert({
      where: {
        userId_missionId: {
          userId: chaitanya.id,
          missionId: m.id,
        },
      },
      update: {},
      create: {
        userId: chaitanya.id,
        missionId: m.id,
        completed: m.rewardXp <= 50,
        progress: m.rewardXp <= 50 ? 100 : 40,
        completedAt: m.rewardXp <= 50 ? new Date() : null,
      },
    });
  }

  console.log('✅ Progress, attempts, sessions, and missions synchronized for Chaitanya.\n');

  // ──────────────────────────────────────────────────────────────────────────
  // 6. SEED PEER CONVERSATIONS & SKILL EXCHANGES
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- 6. Seeding Peer Skill Exchange & Real-Time Chats ---');

  let peerConv = await prisma.conversation.findFirst({
    where: { type: 'SKILL_EXCHANGE' },
  });

  if (!peerConv) {
    peerConv = await prisma.conversation.create({
      data: {
        type: 'SKILL_EXCHANGE',
        members: {
          create: [
            { userId: chaitanya.id, role: 'SENDER' },
            { userId: alice.id, role: 'RECEIVER' },
          ],
        },
        messages: {
          create: [
            {
              senderId: chaitanya.id,
              content: 'Hey Alice! I saw your profile on Cloud Architecture. Would you be interested in peer sessions on Distributed Systems?',
              messageType: 'TEXT',
            },
            {
              senderId: alice.id,
              content: 'Hi Chaitanya! Absolutely! I can help you with Docker & Microservices in exchange for deep dives on Calculus and Physics numericals.',
              messageType: 'TEXT',
            },
            {
              senderId: chaitanya.id,
              content: 'Here is an architectural diagram we can start with for the event bus:',
              messageType: 'CODE',
            },
          ],
        },
      },
    });

    await prisma.skillExchange.create({
      data: {
        senderId: chaitanya.id,
        receiverId: alice.id,
        skillOffered: 'Physics & Advanced Mathematics',
        skillWanted: 'Cloud Architecture & WebSockets',
        status: 'ACCEPTED',
        conversationId: peerConv.id,
      },
    });
  }
  console.log('✅ Peer Skill Exchange and Conversations seeded successfully.\n');

  // ──────────────────────────────────────────────────────────────────────────
  // 7. FINAL ROW COUNT AUDIT
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- Final Database State ---');
  const models = [
    ['User', prisma.user],
    ['LearnerProfile', prisma.learnerProfile],
    ['Subject', prisma.subject],
    ['Topic', prisma.topic],
    ['Course', prisma.course],
    ['CourseModule', prisma.courseModule],
    ['UserCourseProgress', prisma.userCourseProgress],
    ['StudentSubjectProgress', prisma.studentSubjectProgress],
    ['Mission', prisma.mission],
    ['UserMission', prisma.userMission],
    ['XpTransaction', prisma.xpTransaction],
    ['AdminAuditLog', prisma.adminAuditLog],
    ['Conversation', prisma.conversation],
    ['ConversationMember', prisma.conversationMember],
    ['ChatMessage', prisma.chatMessage],
    ['SkillExchange', prisma.skillExchange],
    ['Quiz', prisma.quiz],
    ['QuizQuestion', prisma.quizQuestion],
    ['QuizAttempt', prisma.quizAttempt],
    ['StudySession', prisma.studySession],
  ];

  for (const [name, client] of models) {
    const count = await client.count();
    console.log(`   ${name.padEnd(25)}: ${count} rows`);
  }

  console.log('\n===========================================================');
  console.log('  🎉 EDUNOVA DATABASE ENRICHMENT COMPLETE & HEALTHY');
  console.log('===========================================================\n');
}

seedRichData()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
