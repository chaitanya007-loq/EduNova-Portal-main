const prisma = require('../config/db');

/**
 * Auto-seed curriculum catalog for missing combinations
 */
const autoSeedCurriculum = async (params) => {
  const { educationType, board, targetClass, degree, branch, semester, exam, category } = params;
  const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const adminId = adminUser ? adminUser.id : (await prisma.user.findFirst())?.id;
  if (!adminId) return;

  const templates = [];

  if (educationType === 'SCHOOL') {
    const cls = targetClass || '10';
    const brd = board || 'CBSE';
    if (cls === '10' || cls === '9') {
      templates.push(
        { name: 'Mathematics X', category: 'Mathematics', educationType: 'SCHOOL', class: cls, board: brd, topics: ['Real Numbers', 'Polynomials', 'Pair of Linear Equations', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Trigonometry'] },
        { name: 'Science X (Physics & Chemistry)', category: 'Science', educationType: 'SCHOOL', class: cls, board: brd, topics: ['Chemical Reactions', 'Acids, Bases & Salts', 'Metals & Non-Metals', 'Carbon Compounds', 'Light Reflection & Refraction', 'Human Eye & Colourful World', 'Electricity', 'Magnetic Effects of Current'] },
        { name: 'Biology & Life Sciences X', category: 'Science', educationType: 'SCHOOL', class: cls, board: brd, topics: ['Life Processes', 'Control & Coordination', 'How do Organisms Reproduce?', 'Heredity & Evolution', 'Our Environment'] },
        { name: 'English Language & Literature', category: 'Languages', educationType: 'SCHOOL', class: cls, board: brd, topics: ['First Flight Prose', 'Footprints without Feet', 'Grammar & Editing', 'Analytical Writing'] },
        { name: 'Social Science X', category: 'Humanities', educationType: 'SCHOOL', class: cls, board: brd, topics: ['Rise of Nationalism in Europe', 'Resources & Development', 'Power Sharing', 'Development & Economy'] },
        { name: 'Computer Applications', category: 'Computer Science', educationType: 'SCHOOL', class: cls, board: brd, topics: ['Networking & Internet', 'HTML & CSS Basics', 'Cyber Ethics', 'Python Programming'] }
      );
    } else if (cls === '11' || cls === '12') {
      templates.push(
        { name: `Physics ${cls === '12' ? 'XII' : 'XI'}`, category: 'Science', educationType: 'SCHOOL', class: cls, board: brd, topics: ['Electrostatics', 'Current Electricity', 'Magnetic Effects', 'EM Waves', 'Ray Optics', 'Semiconductors'] },
        { name: `Mathematics ${cls === '12' ? 'XII' : 'XI'}`, category: 'Science', educationType: 'SCHOOL', class: cls, board: brd, topics: ['Calculus', 'Matrices & Determinants', 'Vectors & 3D Geometry', 'Probability', 'Relations & Functions'] },
        { name: `Chemistry ${cls === '12' ? 'XII' : 'XI'}`, category: 'Science', educationType: 'SCHOOL', class: cls, board: brd, topics: ['Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Coordination Compounds', 'Organic Reactions'] },
        { name: `Biology ${cls === '12' ? 'XII' : 'XI'}`, category: 'Science', educationType: 'SCHOOL', class: cls, board: brd, topics: ['Genetics', 'Biotechnology', 'Human Health', 'Ecology'] }
      );
    } else {
      templates.push(
        { name: `Mathematics (Class ${cls})`, category: 'Mathematics', educationType: 'SCHOOL', class: cls, board: brd, topics: ['Number System', 'Algebra', 'Geometry', 'Mensuration', 'Data Handling'] },
        { name: `Science (Class ${cls})`, category: 'Science', educationType: 'SCHOOL', class: cls, board: brd, topics: ['Crop Production', 'Microorganisms', 'Synthetic Fibres', 'Materials & Metals', 'Force & Pressure'] },
        { name: `English (Class ${cls})`, category: 'Languages', educationType: 'SCHOOL', class: cls, board: brd, topics: ['Reading Comprehension', 'Grammar', 'Creative Writing', 'Literature Reader'] },
        { name: `Social Studies (Class ${cls})`, category: 'Humanities', educationType: 'SCHOOL', class: cls, board: brd, topics: ['History', 'Geography', 'Civics', 'Economics'] }
      );
    }
  } else if (educationType === 'COLLEGE') {
    const deg = degree || 'B.Tech';
    const br = branch || 'Computer Science';
    const sem = String(semester || '5');
    if (sem === '5' || sem === '6') {
      templates.push(
        { name: 'Database Management Systems (DBMS)', category: 'Computer Science', educationType: 'COLLEGE', degree: deg, branch: br, semester: sem, topics: ['Relational Model & SQL', 'Normalization (1NF-3NF)', 'Indexing & B-Trees', 'ACID Transactions & Concurrency', 'NoSQL & MongoDB'] },
        { name: 'Operating Systems', category: 'Computer Science', educationType: 'COLLEGE', degree: deg, branch: br, semester: sem, topics: ['Process Scheduling & Threads', 'Memory Management & Paging', 'Concurrency & Deadlocks', 'File Systems & Storage'] },
        { name: 'Computer Networks', category: 'Computer Science', educationType: 'COLLEGE', degree: deg, branch: br, semester: sem, topics: ['OSI & TCP/IP Stack', 'Application Layer Protocols', 'Transport Layer & TCP Flow Control', 'Routing Algorithms', 'Network Security'] },
        { name: 'Software Engineering', category: 'Computer Science', educationType: 'COLLEGE', degree: deg, branch: br, semester: sem, topics: ['Agile & Scrum Methodologies', 'System Design & Architecture', 'CI/CD & Testing Strategies', 'Microservices'] }
      );
    } else if (sem === '1' || sem === '2') {
      templates.push(
        { name: 'Engineering Mathematics I', category: 'Mathematics', educationType: 'COLLEGE', degree: deg, branch: br, semester: sem, topics: ['Differential Calculus', 'Integral Calculus', 'Matrices & Eigenvalues', 'Differential Equations'] },
        { name: 'Engineering Physics', category: 'Basic Sciences', educationType: 'COLLEGE', degree: deg, branch: br, semester: sem, topics: ['Quantum Mechanics', 'Wave Optics', 'Electromagnetism', 'Lasers & Fiber Optics'] },
        { name: 'Programming in C', category: 'Computer Science', educationType: 'COLLEGE', degree: deg, branch: br, semester: sem, topics: ['Data Types & Control Flow', 'Functions & Recursion', 'Pointers & Memory', 'Structures & File I/O'] },
        { name: 'Basic Electrical Engineering', category: 'Electrical', educationType: 'COLLEGE', degree: deg, branch: br, semester: sem, topics: ['DC Circuits', 'AC Fundamentals', 'Transformers', 'Electrical Machines'] }
      );
    } else {
      templates.push(
        { name: `Data Structures & Algorithms (${deg})`, category: 'Computer Science', educationType: 'COLLEGE', degree: deg, branch: br, semester: sem, topics: ['Arrays & Hash Tables', 'Linked Lists & Stacks', 'Trees & Binary Search', 'Graph Algorithms', 'Dynamic Programming'] },
        { name: `Object-Oriented Programming (${deg})`, category: 'Computer Science', educationType: 'COLLEGE', degree: deg, branch: br, semester: sem, topics: ['Classes & Objects', 'Inheritance & Polymorphism', 'Encapsulation & Abstraction', 'Exception Handling'] },
        { name: `Web Technologies (${deg})`, category: 'Computer Science', educationType: 'COLLEGE', degree: deg, branch: br, semester: sem, topics: ['HTML5 & CSS3', 'JavaScript Fundamentals', 'DOM Manipulation', 'REST API Integration'] }
      );
    }
  } else if (educationType === 'EXAM') {
    const ex = exam || 'CMAT';
    if (ex.includes('CMAT') || ex.includes('CAT')) {
      templates.push(
        { name: 'Quantitative Techniques & Data Interpretation', category: 'Aptitude', educationType: 'EXAM', exam: ex, topics: ['Arithmetic & Percentages', 'Algebra & Geometry', 'Data Tables & Charts', 'Probability & Modern Math'] },
        { name: 'Logical Reasoning', category: 'Aptitude', educationType: 'EXAM', exam: ex, topics: ['Linear & Circular Arrangements', 'Syllogisms & Logic', 'Coding-Decoding', 'Blood Relations'] },
        { name: 'Language Comprehension', category: 'Verbal', educationType: 'EXAM', exam: ex, topics: ['Reading Comprehension Passages', 'Vocabulary & Synonyms', 'Grammar Correction', 'Para Jumbles'] },
        { name: 'Innovation & Entrepreneurship', category: 'General', educationType: 'EXAM', exam: ex, topics: ['Startup Ecosystem', 'Business Models', 'Funding & VCs', 'Government Schemes'] }
      );
    } else if (ex.includes('JEE')) {
      templates.push(
        { name: 'JEE Physics Mechanics & Waves', category: 'Physics', educationType: 'EXAM', exam: ex, topics: ['Kinematics & Newton Laws', 'Work Energy Power', 'Rotational Motion', 'Gravitation & SHM'] },
        { name: 'JEE Chemistry Physical & Organic', category: 'Chemistry', educationType: 'EXAM', exam: ex, topics: ['Mole Concept', 'Thermodynamics', 'Organic Reaction Mechanisms', 'Chemical Equilibrium'] },
        { name: 'JEE Mathematics Calculus & Algebra', category: 'Mathematics', educationType: 'EXAM', exam: ex, topics: ['Limits & Derivatives', 'Integration', 'Vectors & 3D', 'Complex Numbers'] }
      );
    } else {
      templates.push(
        { name: `${ex} Core Subject Diagnostic`, category: 'Entrance Prep', educationType: 'EXAM', exam: ex, topics: ['Fundamentals & Concepts', 'Advanced Problem Solving', 'Past Year Questions', 'Mock Drills'] }
      );
    }
  } else if (educationType === 'SKILLS') {
    templates.push(
      { name: 'Full-Stack Web Development', category: 'Software Engineering', educationType: 'SKILLS', topics: ['Modern HTML5 & CSS3', 'JavaScript ES6+', 'React 19 & Next.js', 'Node.js REST APIs', 'PostgreSQL & Prisma'] },
      { name: 'Artificial Intelligence & Machine Learning', category: 'Data Science', educationType: 'SKILLS', topics: ['Python Programming', 'Linear Algebra & Statistics', 'Machine Learning Models', 'Deep Learning with PyTorch', 'LLMs & Prompt Engineering'] },
      { name: 'Cloud Computing & DevOps', category: 'Infrastructure', educationType: 'SKILLS', topics: ['Linux System Admin', 'Docker Containers', 'Kubernetes Orchestration', 'AWS Infrastructure', 'CI/CD Pipelines'] },
      { name: 'UI/UX Design & Product Strategy', category: 'Design', educationType: 'SKILLS', topics: ['Figma Prototyping', 'User Research & Personas', 'Design Systems', 'Usability Testing'] }
    );
  }

  for (const t of templates) {
    try {
      const exists = await prisma.subject.findFirst({
        where: { name: t.name, educationType: t.educationType }
      });
      if (!exists) {
        await prisma.subject.create({
          data: {
            name: t.name,
            category: t.category,
            educationType: t.educationType,
            class: t.class || null,
            board: t.board || null,
            degree: t.degree || null,
            branch: t.branch || null,
            semester: t.semester || null,
            exam: t.exam || null,
            createdById: adminId,
            topics: {
              create: (t.topics || []).map((tp, idx) => ({ title: tp, order: idx + 1 }))
            }
          }
        });
      }
    } catch (err) {
      console.warn('Auto seed subject error:', err.message);
    }
  }
};

/**
 * Get all subjects with optional curriculum filters
 */
const getSubjects = async ({ educationType, board, className, class: classAlt, degree, branch, semester, exam, category, search }) => {
  const targetClass = className || classAlt;
  const where = {};

  if (educationType) where.educationType = educationType;
  if (board) where.board = board;
  if (targetClass) where.class = targetClass;
  if (degree) where.degree = degree;
  if (branch) where.branch = branch;
  if (semester) where.semester = String(semester);
  if (exam) where.exam = exam;
  if (category) where.category = { contains: category };
  
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { category: { contains: search } },
    ];
  }

  let subjects = await prisma.subject.findMany({
    where,
    include: {
      topics: { orderBy: { order: 'asc' } },
      _count: { select: { progress: true } },
    },
    orderBy: { name: 'asc' },
  });

  // If 0 subjects found for specific curriculum request, auto-seed and query again
  if (subjects.length === 0 && educationType) {
    await autoSeedCurriculum({ educationType, board, targetClass, degree, branch, semester, exam, category });
    subjects = await prisma.subject.findMany({
      where,
      include: {
        topics: { orderBy: { order: 'asc' } },
        _count: { select: { progress: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  // Fallback if still 0
  if (subjects.length === 0 && educationType) {
    subjects = await prisma.subject.findMany({
      where: { educationType },
      include: {
        topics: { orderBy: { order: 'asc' } },
        _count: { select: { progress: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  return subjects;
};

/**
 * Get single subject with topics
 */
const getSubjectById = async (subjectId) => {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      topics: { orderBy: { order: 'asc' } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { progress: true } },
    },
  });

  if (!subject) throw { status: 404, message: 'Subject not found' };
  return subject;
};

/**
 * Create a subject (Admin/Instructor)
 */
const createSubject = async (data, createdById) => {
  const { name, category, educationType, className, board, topics } = data;

  const subject = await prisma.subject.create({
    data: {
      name,
      category,
      educationType: educationType || 'SCHOOL',
      class: className,
      board,
      createdById,
      ...(topics && topics.length > 0 && {
        topics: {
          create: topics.map((t, i) => ({
            title: t.title,
            order: t.order || i + 1,
          })),
        },
      }),
    },
    include: { topics: true },
  });

  return subject;
};

/**
 * Update a subject
 */
const updateSubject = async (subjectId, data) => {
  const { name, category, educationType, className, board } = data;

  const subject = await prisma.subject.update({
    where: { id: subjectId },
    data: {
      ...(name && { name }),
      ...(category && { category }),
      ...(educationType && { educationType }),
      ...(className !== undefined && { class: className }),
      ...(board !== undefined && { board }),
    },
    include: { topics: { orderBy: { order: 'asc' } } },
  });

  return subject;
};

/**
 * Delete a subject
 */
const deleteSubject = async (subjectId) => {
  await prisma.subject.delete({ where: { id: subjectId } });
  return { message: 'Subject deleted successfully' };
};

/**
 * Add topic to a subject
 */
const addTopic = async (subjectId, { title, order }) => {
  // Get max order if not provided
  if (!order) {
    const maxTopic = await prisma.topic.findFirst({
      where: { subjectId },
      orderBy: { order: 'desc' },
    });
    order = (maxTopic?.order || 0) + 1;
  }

  const topic = await prisma.topic.create({
    data: { subjectId, title, order },
  });

  return topic;
};

/**
 * Delete a topic
 */
const deleteTopic = async (topicId) => {
  await prisma.topic.delete({ where: { id: topicId } });
  return { message: 'Topic deleted successfully' };
};

/**
 * Select/enroll a subject for a student (links to dashboard)
 */
const selectSubject = async (userId, subjectId) => {
  let subject = await prisma.subject.findUnique({ where: { id: subjectId } });

  if (!subject) {
    const idMap = {
      'sch_math_10': 'Mathematics',
      'sch_physics_10': 'Physics',
      'sch_chem_10': 'Chemistry',
      'sch_bio_10': 'Biology',
      'sch_eng_10': 'English',
      'sch_sst_10': 'Social Science',
      'sch_cs_10': 'Computer Applications',
      'col_dbms_sem5': 'Database Management Systems',
      'col_os_sem5': 'Operating Systems',
      'col_cn_sem5': 'Computer Networks',
      'col_dsa_sem5': 'Data Structures',
      'col_web_sem5': 'Web Engineering',
      'col_se_sem5': 'Software Engineering',
      'exm_quant': 'Quantitative',
      'exm_reasoning': 'Logical Reasoning',
      'exm_english': 'Language',
      'exm_gk': 'General Awareness',
      'skl_fullstack': 'Full Stack',
      'skl_uiux': 'UI/UX',
      'skl_backend': 'Backend Systems',
      'skl_devops': 'DevOps'
    };

    const targetKeyword = idMap[subjectId] || subjectId.replace(/^(sch_|col_|exm_|skl_)/, '').replace(/_\d+$/, '');
    
    subject = await prisma.subject.findFirst({
      where: { name: { contains: targetKeyword } }
    });

    if (!subject) {
      subject = await prisma.subject.findFirst();
    }
  }

  if (!subject) {
    return { success: true, message: 'Subject selected locally' };
  }

  // Upsert student subject progress (atomic idempotency)
  const progress = await prisma.studentSubjectProgress.upsert({
    where: { userId_subjectId: { userId, subjectId: subject.id } },
    update: {},
    create: {
      userId,
      subjectId: subject.id,
      progress: 0,
      targetScore: 80,
      syllabusCoverage: 0,
    },
    include: {
      subject: {
        include: { topics: { orderBy: { order: 'asc' } } },
      },
    },
  });

  return progress;
};

/**
 * Update subject progress, syllabus coverage, and weak topics atomically
 */
const updateProgressAndWeakTopics = async (userId, subjectId, data) => {
  const { progress, syllabusCoverage, targetScore, weakTopics } = data;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Update StudentSubjectProgress
    const updatedProgress = await tx.studentSubjectProgress.upsert({
      where: { userId_subjectId: { userId, subjectId } },
      update: {
        ...(progress !== undefined && { progress }),
        ...(syllabusCoverage !== undefined && { syllabusCoverage }),
        ...(targetScore !== undefined && { targetScore }),
      },
      create: {
        userId,
        subjectId,
        progress: progress || 0,
        syllabusCoverage: syllabusCoverage || 0,
        targetScore: targetScore || 80,
      },
      include: { subject: true },
    });

    // 2. If weakTopics provided, update LearnerProfile
    let updatedProfile = null;
    if (weakTopics && Array.isArray(weakTopics)) {
      const currentProfile = await tx.learnerProfile.findUnique({ where: { userId } });
      if (currentProfile) {
        // Merge and deduplicate weak topics
        const mergedWeakTopics = Array.from(new Set([...currentProfile.weakTopics, ...weakTopics]));
        updatedProfile = await tx.learnerProfile.update({
          where: { userId },
          data: { weakTopics: mergedWeakTopics },
        });
      }
    }

    return {
      progress: updatedProgress,
      weakTopics: updatedProfile?.weakTopics,
    };
  });

  return result;
};

/**
 * Get all subjects enrolled by a student
 */
const getEnrolledSubjects = async (userId) => {
  const enrollments = await prisma.studentSubjectProgress.findMany({
    where: { userId },
    include: {
      subject: {
        include: {
          topics: { orderBy: { order: 'asc' } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return enrollments;
};

/**
 * Unenroll / remove subject from dashboard
 */
const unenrollSubject = async (userId, subjectId) => {
  await prisma.studentSubjectProgress.deleteMany({
    where: { userId, subjectId },
  });
  return { message: 'Subject unenrolled successfully' };
};

module.exports = {
  getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject,
  addTopic, deleteTopic, selectSubject, updateProgressAndWeakTopics,
  getEnrolledSubjects, unenrollSubject,
};

