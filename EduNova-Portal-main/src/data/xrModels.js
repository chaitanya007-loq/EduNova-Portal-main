/**
 * EduNova Educational 3D & XR Model Registry
 * Reusable multi-domain model configurations for School, College, Exam Prep, and Skills & Career.
 */

export const XR_MODELS = [
  // ==================== SCHOOL MODELS ====================
  {
    id: 'human-heart',
    name: 'Human Heart 3D Anatomy',
    category: 'Biology',
    educationTypes: ['school'],
    subjects: ['Biology', 'Anatomy & Physiology'],
    topic: 'Circulatory System',
    description: 'Muscular four-chambered pump supplying oxygenated blood through systemic and pulmonary circulation.',
    hasExplodedView: true,
    hasXrayView: true,
    hotspots: [
      { id: 'aorta', name: 'Aorta', description: 'Main systemic artery delivering oxygenated blood at 120 mmHg.', x: 50, y: 22, importance: 'High' },
      { id: 'left-ventricle', name: 'Left Ventricle', description: 'Thick muscular chamber pumping blood into the aorta.', x: 62, y: 58, importance: 'High' },
      { id: 'right-atrium', name: 'Right Atrium', description: 'Receives deoxygenated venous blood from Vena Cava.', x: 32, y: 44, importance: 'Medium' },
      { id: 'pulmonary-artery', name: 'Pulmonary Artery', description: 'Carries deoxygenated blood from right ventricle to lungs.', x: 40, y: 28, importance: 'High' }
    ]
  },
  {
    id: 'convex-lens-optics',
    name: 'Convex Lens & Optics Ray Tracing',
    category: 'Physics',
    educationTypes: ['school', 'exam'],
    subjects: ['Physics'],
    topic: 'Light - Refraction & Lenses',
    description: 'Converging optical lens demonstrating real vs virtual image formation and focal point geometry.',
    hasExplodedView: false,
    hasXrayView: true,
    hotspots: [
      { id: 'optical-center', name: 'Optical Center (O)', description: 'Central point of lens where rays pass un-deviated.', x: 50, y: 50, importance: 'High' },
      { id: 'focal-point', name: 'Principal Focus (F)', description: 'Point where parallel incident light rays converge.', x: 72, y: 50, importance: 'High' }
    ]
  },
  {
    id: 'atom-bohr-model',
    name: 'Bohr Carbon Atom & Orbital Shells',
    category: 'Chemistry',
    educationTypes: ['school', 'college'],
    subjects: ['Chemistry'],
    topic: 'Structure of Atom',
    description: 'Quantum atomic model featuring nucleus with 6 protons/neutrons and K & L electron shells.',
    hasExplodedView: true,
    hasXrayView: true,
    hotspots: [
      { id: 'nucleus', name: 'Atomic Nucleus', description: 'Dense core containing protons and neutrons bound by strong nuclear force.', x: 50, y: 50, importance: 'High' },
      { id: 'electron-cloud', name: 'Valence Electron Shell', description: 'Outer energy shell containing 4 valence electrons forming chemical bonds.', x: 78, y: 35, importance: 'High' }
    ]
  },

  // ==================== COLLEGE / UNIVERSITY MODELS ====================
  {
    id: 'binary-search-tree',
    name: '3D Binary Search Tree & AVL Rotations',
    category: 'Computer Science',
    educationTypes: ['college', 'skills'],
    subjects: ['Data Structures & Algorithms'],
    topic: 'Trees & Balanced Search Graphs',
    description: 'Hierarchical node tree structure demonstrating BST insertion, search O(log N), and AVL rotation balances.',
    hasExplodedView: true,
    hasXrayView: false,
    hotspots: [
      { id: 'root-node', name: 'Root Node (50)', description: 'Topmost parent node from which all branch traversals originate.', x: 50, y: 15, importance: 'High' },
      { id: 'left-subtree', name: 'Left Subtree (< 50)', description: 'Contains keys strictly smaller than root (25, 12, 37).', x: 30, y: 38, importance: 'High' },
      { id: 'right-subtree', name: 'Right Subtree (> 50)', description: 'Contains keys strictly larger than root (75, 62, 87).', x: 70, y: 38, importance: 'High' }
    ]
  },
  {
    id: 'dbms-btree-architecture',
    name: 'Database Relational B-Tree Index',
    category: 'Computer Science',
    educationTypes: ['college', 'skills'],
    subjects: ['Database Management Systems'],
    topic: 'Indexing & B-Tree Execution',
    description: 'Multi-level index hierarchy reducing disk IO cost from O(N) sequential scan to O(log N).',
    hasExplodedView: true,
    hasXrayView: true,
    hotspots: [
      { id: 'index-root', name: 'Root Index Page', description: 'In-memory index page routing query execution pointers.', x: 50, y: 20, importance: 'High' },
      { id: 'leaf-pages', name: 'Leaf Data Pages', description: 'Clustered storage block pages containing actual table rows.', x: 30, y: 70, importance: 'High' }
    ]
  },
  {
    id: 'cpu-pipeline-arch',
    name: 'RISC CPU Superscalar Pipeline 3D',
    category: 'Computer Science',
    educationTypes: ['college'],
    subjects: ['Computer Architecture'],
    topic: 'CPU Pipelining & ALU Instruction Flow',
    description: 'Instruction pipeline stages: Fetch (IF), Decode (ID), Execute (EX), Memory (MEM), Writeback (WB).',
    hasExplodedView: true,
    hasXrayView: true,
    hotspots: [
      { id: 'alu-core', name: 'Arithmetic Logic Unit (ALU)', description: 'High-speed execution core performing integer and logic computations.', x: 48, y: 45, importance: 'High' },
      { id: 'l1-cache', name: 'L1 Data Cache', description: 'Ultra-fast SRAM buffer providing 1-cycle latency instruction data access.', x: 72, y: 30, importance: 'High' }
    ]
  },

  // ==================== SKILLS & CAREER MODELS ====================
  {
    id: 'microservices-system-design',
    name: 'Microservices & API Gateway Architecture',
    category: 'Software Engineering',
    educationTypes: ['skills', 'college'],
    subjects: ['System Design', 'Cloud & DevOps'],
    topic: 'Distributed Systems & Load Balancers',
    description: 'Scalable cloud infrastructure featuring API Gateway, Redis In-Memory Cache, Load Balancer, and Microservices.',
    hasExplodedView: true,
    hasXrayView: false,
    hotspots: [
      { id: 'api-gateway', name: 'API Gateway', description: 'Single ingress router managing auth, rate limiting, and SSL termination.', x: 30, y: 35, importance: 'High' },
      { id: 'redis-cache', name: 'Redis Cache Cluster', description: 'RAM caching layer storing hot session data with sub-2ms latency.', x: 55, y: 35, importance: 'High' }
    ]
  }
];

export const getModelsByContext = (context = {}) => {
  const { educationType = 'school', subject = '' } = context;

  let filtered = XR_MODELS.filter(m => m.educationTypes.includes(educationType));
  if (filtered.length === 0) {
    filtered = XR_MODELS.filter(m => educationType === 'school' ? true : m.id !== 'human-heart');
  }

  // Explicitly ensure human-heart is ONLY shown for school students
  if (educationType !== 'school') {
    filtered = filtered.filter(m => m.id !== 'human-heart');
  }

  if (subject) {
    const matched = filtered.filter(m => m.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase())));
    if (matched.length > 0) return matched;
  }

  return filtered;
};

export default {
  XR_MODELS,
  getModelsByContext
};
