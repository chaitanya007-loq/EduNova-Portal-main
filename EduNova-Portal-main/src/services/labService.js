/**
 * Lab Service for EduNova Immersive Learning Platform.
 * Contains catalog metadata for School, College, Exam Prep, and Skills domain labs.
 * Handles dynamic content filtering, search, and subject visual identities.
 */

export const SUBJECT_THEMES = {
  Physics: { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(15, 23, 42, 0.6))' },
  Chemistry: { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(15, 23, 42, 0.6))' },
  Biology: { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.6))' },
  Mathematics: { primary: '#6366f1', glow: 'rgba(99, 102, 241, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(15, 23, 42, 0.6))' },
  'Computer Science': { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(15, 23, 42, 0.6))' },
  'Data Structures': { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(15, 23, 42, 0.6))' },
  'Operating Systems': { primary: '#ec4899', glow: 'rgba(236, 72, 153, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(15, 23, 42, 0.6))' },
  DBMS: { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.6))' },
  'Computer Networks': { primary: '#14b8a6', glow: 'rgba(20, 184, 166, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(15, 23, 42, 0.6))' },
  'Full Stack Development': { primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(15, 23, 42, 0.6))' },
  'AI / ML': { primary: '#d946ef', glow: 'rgba(217, 70, 239, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(217, 70, 239, 0.15), rgba(15, 23, 42, 0.6))' },
  Cybersecurity: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(15, 23, 42, 0.6))' },
  Business: { primary: '#eab308', glow: 'rgba(234, 179, 8, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(15, 23, 42, 0.6))' },
  default: { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.25)', bgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(15, 23, 42, 0.6))' }
};

export const LAB_CATALOG = [
  // --- SCHOOL LABS ---
  {
    id: 'projectile-motion-lab',
    title: 'Projectile Trajectory & Kinematics',
    subtitle: 'Simulate launch velocity, angle, gravity & air resistance vectors.',
    educationType: 'school',
    classLevel: 'Class 10 / 11',
    board: 'CBSE / ICSE',
    subject: 'Physics',
    category: 'Science Lab',
    difficulty: 'Intermediate',
    duration: '15 mins',
    has3D: true,
    hasAI: true,
    hasXR: true,
    simType: 'physics_projectile',
    skillsGained: ['Kinematics', 'Vector Analysis', 'Gravitational Dynamics'],
    description: 'Explore two-dimensional motion under gravity. Adjust launch angles, mass, and drag to observe velocity vectors and orbital parabolas in real time.',
    learningObjectives: [
      'Understand how angle affects maximum horizontal range',
      'Analyze vertical vs horizontal components of velocity',
      'Observe terminal velocity under air resistance'
    ]
  },
  {
    id: 'optics-lens-lab',
    title: 'Light Refraction & Convex Lens Explorer',
    subtitle: 'Trace focal planes, principal axes, and real vs virtual image formation.',
    educationType: 'school',
    classLevel: 'Class 10',
    board: 'CBSE',
    subject: 'Physics',
    category: 'Science Lab',
    difficulty: 'Beginner',
    duration: '12 mins',
    has3D: true,
    hasAI: true,
    hasXR: false,
    simType: 'physics_optics',
    skillsGained: ['Optics', 'Ray Tracing', 'Lens Formula'],
    description: 'Interactively move light rays through convex and concave lenses. Calculate focal length using the lens formula 1/f = 1/v - 1/u with instant feedback.',
    learningObjectives: [
      'Verify the lens formula with dynamic object distances',
      'Identify virtual vs real inverted images',
      'Observe chromatic and focal dispersion'
    ]
  },
  {
    id: 'electric-circuits-lab',
    title: 'Ohm’s Law & DC Circuit Analyzer',
    subtitle: 'Build series and parallel resistor circuits with dynamic meters.',
    educationType: 'school',
    classLevel: 'Class 10',
    board: 'CBSE',
    subject: 'Physics',
    category: 'Science Lab',
    difficulty: 'Beginner',
    duration: '15 mins',
    has3D: false,
    hasAI: true,
    hasXR: false,
    simType: 'physics_circuit',
    skillsGained: ['Circuit Analysis', 'Ohm\'s Law', 'Equivalent Resistance'],
    description: 'Connect resistors, ammeters, and voltmeters. Manipulate voltage and resistance to observe live current flow and thermal dissipation graphs.',
    learningObjectives: [
      'Prove V = I * R experimentally',
      'Compare current split in parallel vs series circuits',
      'Calculate power dissipation P = I²R'
    ]
  },
  {
    id: 'chemistry-titration-lab',
    title: 'Acid-Base Titration & pH Curve Explorer',
    subtitle: 'Drop burette titrants into analyte to observe color indicators & equivalence points.',
    educationType: 'school',
    classLevel: 'Class 10 / 12',
    board: 'CBSE',
    subject: 'Chemistry',
    category: 'Science Lab',
    difficulty: 'Intermediate',
    duration: '20 mins',
    has3D: true,
    hasAI: true,
    hasXR: true,
    simType: 'chemistry_titration',
    skillsGained: ['Stoichiometry', 'pH Calculation', 'Volumetric Analysis'],
    description: 'Perform precise acid-base neutralizations using phenolphthalein. Record pH curves and derive unknown acid concentration.',
    learningObjectives: [
      'Locate the steep inflection point on pH graphs',
      'Calculate molarity using N1V1 = N2V2',
      'Understand buffer action and indicator transition intervals'
    ]
  },
  {
    id: 'biology-heart-3d',
    title: '3D Human Cardiac Vascular Explorer',
    subtitle: 'Interactive 3D anatomical heart with cross-section vascular pump simulation.',
    educationType: 'school',
    classLevel: 'Class 10',
    board: 'CBSE',
    subject: 'Biology',
    category: 'Science Lab',
    difficulty: 'Beginner',
    duration: '15 mins',
    has3D: true,
    hasAI: true,
    hasXR: true,
    simType: 'biology_3d_heart',
    skillsGained: ['Anatomy', 'Cardiovascular System', 'Hemodynamics'],
    description: 'Rotate, dissect, and inspect the human heart in 3D. Trace oxygenated vs deoxygenated blood circulation through atria, ventricles, and aorta.',
    learningObjectives: [
      'Identify 4 heart chambers and valve mechanics',
      'Differentiate pulmonary vs systemic circulation pathways',
      'Observe systolic and diastolic cardiac cycles'
    ]
  },
  {
    id: 'calculus-derivative-lab',
    title: 'Calculus Derivative & Tangent Line Explorer',
    subtitle: 'Visualize secant lines approaching tangent slopes in real time.',
    educationType: 'school',
    classLevel: 'Class 11 / 12',
    board: 'CBSE',
    subject: 'Mathematics',
    category: 'Mathematics Lab',
    difficulty: 'Intermediate',
    duration: '15 mins',
    has3D: false,
    hasAI: true,
    hasXR: false,
    simType: 'math_calculus',
    skillsGained: ['Calculus', 'Rate of Change', 'Graphical Intuition'],
    description: 'Drag points along polynomial curves f(x) to see real-time tangent slope f\'(x) calculation and area integration under the curve.',
    learningObjectives: [
      'Understand the limit definition of derivative dy/dx',
      'Locate local maxima, minima, and inflection points',
      'Connect derivative graphs with original functions'
    ]
  },

  // --- COLLEGE / UNIVERSITY LABS ---
  {
    id: 'cs-data-structures-trees',
    title: 'Binary Tree & AVL Rotation Visualizer',
    subtitle: 'Insert, balance, traverse, and analyze node rotations in real time.',
    educationType: 'college',
    degree: 'B.Tech',
    branch: 'Computer Science',
    semester: 3,
    subject: 'Data Structures',
    category: 'Data Structures Lab',
    difficulty: 'Advanced',
    duration: '25 mins',
    has3D: true,
    hasAI: true,
    hasXR: false,
    simType: 'cs_tree_visualizer',
    skillsGained: ['Tree Traversal', 'AVL Balancing', 'Complexity Analysis'],
    description: 'Interactively build BSTs and self-balancing AVL trees. Perform Left/Right single and double rotations with step-by-step memory pointer animation.',
    learningObjectives: [
      'Master O(log N) lookup vs degenerate tree behavior',
      'Execute tree traversals: Inorder, Preorder, Postorder, BFS',
      'Understand balance factors and rotation triggers'
    ]
  },
  {
    id: 'cs-sorting-algorithms',
    title: 'Algorithm Visualizer & Sorting Playground',
    subtitle: 'Benchmark QuickSort, MergeSort, HeapSort & BubbleSort side by side.',
    educationType: 'college',
    degree: 'B.Tech',
    branch: 'Computer Science',
    semester: 3,
    subject: 'Data Structures',
    category: 'Data Structures Lab',
    difficulty: 'Intermediate',
    duration: '15 mins',
    has3D: false,
    hasAI: true,
    hasXR: false,
    simType: 'cs_sorting_visualizer',
    skillsGained: ['Algorithmic Thinking', 'Time Complexity', 'Sorting Benchmarks'],
    description: 'Watch array element swaps and recursion trees in action. Compare comparisons vs swap counts across randomized, sorted, and reversed datasets.',
    learningObjectives: [
      'Contrast O(N²) quadratic vs O(N log N) divide-and-conquer algorithms',
      'Analyze worst-case pivot selections in QuickSort',
      'Evaluate spatial overhead of MergeSort'
    ]
  },
  {
    id: 'os-cpu-scheduling',
    title: 'CPU Scheduling & Gantt Chart Simulator',
    subtitle: 'Simulate FCFS, Shortest Job First, Round Robin & Priority Scheduling.',
    educationType: 'college',
    degree: 'B.Tech',
    branch: 'Computer Science',
    semester: 5,
    subject: 'Operating Systems',
    category: 'Operating Systems Lab',
    difficulty: 'Advanced',
    duration: '25 mins',
    has3D: false,
    hasAI: true,
    hasXR: false,
    simType: 'os_cpu_scheduling',
    skillsGained: ['Process Management', 'Scheduling Algorithms', 'Throughput Optimization'],
    description: 'Configure process arrival times and burst times. Generate dynamic Gantt charts, computing average waiting time and turnaround time.',
    learningObjectives: [
      'Observe process starvation in Priority Scheduling',
      'Analyze context switch overhead in Round Robin time-quantum selection',
      'Compare preemptive vs non-preemptive scheduling strategies'
    ]
  },
  {
    id: 'dbms-sql-relational',
    title: 'Relational Database & Query Plan Visualizer',
    subtitle: 'Build ER diagrams, execute SQL joins, and analyze index B-Trees.',
    educationType: 'college',
    degree: 'B.Tech',
    branch: 'Computer Science',
    semester: 4,
    subject: 'DBMS',
    category: 'DBMS Lab',
    difficulty: 'Intermediate',
    duration: '20 mins',
    has3D: false,
    hasAI: true,
    hasXR: false,
    simType: 'dbms_query_lab',
    skillsGained: ['SQL Optimization', 'Indexing Strategies', 'Normalization'],
    description: 'Execute SQL queries over schema tables. Inspect query execution plans, sequential scans vs B-Tree index lookups, and normalization levels (1NF to 3NF).',
    learningObjectives: [
      'Write optimized INNER, LEFT, and FULL OUTER joins',
      'Understand how indexes improve lookup speed while impacting writes',
      'Detect normalization anomalies and functional dependencies'
    ]
  },
  {
    id: 'networks-tcp-packet',
    title: 'TCP/IP Packet Routing & OSI Model Inspector',
    subtitle: 'Trace packet headers, subnet masking, and handshake flows across routers.',
    educationType: 'college',
    degree: 'B.Tech',
    branch: 'Computer Science',
    semester: 5,
    subject: 'Computer Networks',
    category: 'Computer Networks Lab',
    difficulty: 'Advanced',
    duration: '20 mins',
    has3D: true,
    hasAI: true,
    hasXR: false,
    simType: 'network_packet_lab',
    skillsGained: ['Subnetting', 'TCP 3-Way Handshake', 'Packet Routing'],
    description: 'Simulate client-server packet transmissions. Inspect MAC headers, IP routing tables, port bindings, and TCP SYN-ACK handshake states.',
    learningObjectives: [
      'Calculate subnet masks and CIDR network boundaries',
      'Follow packet encapsulation down the 7 OSI layers',
      'Simulate packet loss and TCP retransmission timeouts'
    ]
  },
  {
    id: 'mech-v8-engine',
    title: 'Mechanical V8 Engine & Thermodynamics Lab',
    subtitle: 'Explore 4-stroke Otto combustion cycles, piston kinematics & torque graphs.',
    educationType: 'college',
    degree: 'B.Tech',
    branch: 'Mechanical Engineering',
    semester: 4,
    subject: 'Mechanical Engineering',
    category: 'Mechanical Engineering Lab',
    difficulty: 'Advanced',
    duration: '20 mins',
    has3D: true,
    hasAI: true,
    hasXR: true,
    simType: 'mechanical_engine',
    skillsGained: ['Thermodynamics', 'Kinematics', 'Combustion Analysis'],
    description: 'Dissect an internal combustion V8 engine in 3D. Control RPM, fuel intake, and ignition timing while viewing live P-V pressure diagrams.',
    learningObjectives: [
      'Identify Intake, Compression, Power, and Exhaust strokes',
      'Analyze thermal efficiency under varying compression ratios',
      'Observe crankshaft balance and valve timing'
    ]
  },

  // --- EXAM PREPARATION LABS ---
  {
    id: 'exam-jee-physics-projectile',
    title: 'JEE Physics: Advanced Kinematics & Collisions',
    subtitle: 'Solve target trajectory challenges under strict time pressure.',
    educationType: 'exam',
    examTarget: 'JEE Main / Advanced',
    subject: 'Physics',
    category: 'Exam Simulation Studio',
    difficulty: 'Expert',
    duration: '10 mins',
    has3D: true,
    hasAI: true,
    hasXR: false,
    simType: 'physics_projectile',
    skillsGained: ['JEE Numerical Solving', 'Trajectory Calculations', 'Precision Calibration'],
    description: 'Given target coordinates and wind vectors, calculate the exact launch angle and initial velocity required to hit the bulls-eye on the first attempt.',
    learningObjectives: [
      'Solve JEE level kinematics problems under time pressure',
      'Develop visual intuition for trajectory intersections',
      'Eliminate calculation errors in multi-variable equations'
    ]
  },
  {
    id: 'exam-neet-biology-anatomy',
    title: 'NEET Biology: 3D Organ & Cell Structure Challenge',
    subtitle: 'High-speed anatomical identification and physiological function quiz.',
    educationType: 'exam',
    examTarget: 'NEET UG',
    subject: 'Biology',
    category: 'Exam Simulation Studio',
    difficulty: 'Advanced',
    duration: '10 mins',
    has3D: true,
    hasAI: true,
    hasXR: true,
    simType: 'biology_3d_heart',
    skillsGained: ['Anatomical Recognition', 'NEET Speed Accuracy', 'Physiology'],
    description: 'Rapidly identify heart valves, coronary arteries, and electrical conduction pathways under NEET exam timers with instant error analysis.',
    learningObjectives: [
      'Memorize NEET high-yield anatomical diagrams',
      'Understand cardiac impulse conduction (SA node to Purkinje fibers)',
      'Achieve 95%+ speed accuracy on anatomy questions'
    ]
  },

  // --- SKILLS & CAREER LABS ---
  {
    id: 'skills-fullstack-api',
    title: 'Full Stack REST API Architecture & Flow Simulator',
    subtitle: 'Build client HTTP requests, backend controllers, database queries & response payloads.',
    educationType: 'skills',
    domain: 'Full Stack Development',
    subject: 'Full Stack Development',
    category: 'Interactive Skill Studio',
    difficulty: 'Intermediate',
    duration: '20 mins',
    has3D: false,
    hasAI: true,
    hasXR: false,
    simType: 'skills_api_studio',
    skillsGained: ['REST API Design', 'HTTP Status Codes', 'JSON Payloads', 'Authentication Flow'],
    description: 'Construct GET, POST, PUT, DELETE requests. Inspect headers, JWT bearer tokens, database query latency, and JSON response bodies.',
    learningObjectives: [
      'Design clean RESTful endpoints following standard conventions',
      'Debug CORS errors, 401 Unauthorized, and 500 Internal Server errors',
      'Simulate asynchronous fetch flows and state mutations'
    ]
  },
  {
    id: 'skills-ai-neural-net',
    title: 'Neural Network Layer & Gradient Descent Visualizer',
    subtitle: 'Tweak learning rates, weights, activation functions & observe loss convergence curves.',
    educationType: 'skills',
    domain: 'AI / ML',
    subject: 'AI / ML',
    category: 'Interactive Skill Studio',
    difficulty: 'Advanced',
    duration: '25 mins',
    has3D: true,
    hasAI: true,
    hasXR: false,
    simType: 'skills_ai_playground',
    skillsGained: ['Neural Networks', 'Gradient Descent', 'Hyperparameter Tuning'],
    description: 'Build a multi-layer perceptron. Adjust learning rates, ReLU/Sigmoid activation functions, and watch weight matrices update during backpropagation.',
    learningObjectives: [
      'Understand how gradient descent minimizes loss functions',
      'Detect overfitting vs underfitting in decision boundary graphs',
      'Fine-tune learning rate hyperparameters to avoid exploding gradients'
    ]
  }
];

/**
 * Filter lab library catalog based on education context, selected subject, search query, etc.
 */
export const getFilteredLabs = (context, filters = {}) => {
  let list = [...LAB_CATALOG];

  // Education Type filter
  if (context && context.educationType) {
    const activeType = context.educationType.toLowerCase();
    list = list.filter((lab) => lab.educationType === activeType);
  }

  // Subject filter
  if (filters.subject && filters.subject !== 'All') {
    list = list.filter((lab) => lab.subject.toLowerCase() === filters.subject.toLowerCase());
  }

  // Category filter
  if (filters.category && filters.category !== 'All') {
    list = list.filter((lab) => lab.category.toLowerCase() === filters.category.toLowerCase());
  }

  // Difficulty filter
  if (filters.difficulty && filters.difficulty !== 'All') {
    list = list.filter((lab) => lab.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
  }

  // Search Query
  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    list = list.filter(
      (lab) =>
        lab.title.toLowerCase().includes(q) ||
        lab.subtitle.toLowerCase().includes(q) ||
        lab.subject.toLowerCase().includes(q) ||
        lab.skillsGained.some((s) => s.toLowerCase().includes(q))
    );
  }

  return list;
};

/**
 * Get Lab by ID
 */
export const getLabById = (labId) => {
  return LAB_CATALOG.find((lab) => lab.id === labId) || LAB_CATALOG[0];
};

/**
 * Get visual theme colors for a subject
 */
export const getSubjectTheme = (subject) => {
  return SUBJECT_THEMES[subject] || SUBJECT_THEMES.default;
};

export default {
  LAB_CATALOG,
  SUBJECT_THEMES,
  getFilteredLabs,
  getLabById,
  getSubjectTheme
};
