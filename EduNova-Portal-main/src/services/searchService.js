// Search Service for EduNova Platform
// Manages global search indexing, live query matching, and localStorage search history

const HISTORY_STORAGE_KEY = 'edunova_search_history_v1';

// Initial default search history if user is new
const DEFAULT_HISTORY = [
  "Quantum Mechanics 3D",
  "Calculus & Integration",
  "Data Structures & Algorithms",
  "DBMS Normalization"
];

// Popular trending search suggestions
export const POPULAR_SEARCH_SUGGESTIONS = [
  { id: 'sug-1', query: 'Double Slit Quantum Interference', category: '3D XR Lab', icon: 'FlaskConical', path: '/xr-studio' },
  { id: 'sug-2', query: 'Calculus & Definite Integration', category: 'Constellation Skill', icon: 'Sparkles', path: '/constellation' },
  { id: 'sug-3', query: 'Sage AI Study Planner', category: 'AI Companion', icon: 'Bot', path: '/chat' },
  { id: 'sug-4', query: 'Organic Reaction Mechanisms', category: 'Subject Chapter', icon: 'BookOpen', path: '/subjects' },
  { id: 'sug-5', query: 'React 19 Hooks & State', category: 'Skill Exchange', icon: 'Code', path: '/skill-marketplace' },
  { id: 'sug-6', query: 'Physics Formula Notes', category: 'Personal Notes', icon: 'FileText', path: '/subjects' }
];

// Static index of platform pages and features for instant navigation
export const PLATFORM_NAVIGATION_ITEMS = [
  { title: 'Interactive Dashboard', category: 'Page', description: 'Overview of progress, weak skills, and quick actions', path: '/dashboard', icon: 'LayoutDashboard' },
  { title: 'Knowledge Constellation 3D', category: 'Feature', description: 'Interactive skill tree graph and node mastery', path: '/constellation', icon: 'Share2' },
  { title: '3D XR Science Lab Studio', category: 'Feature', description: 'Immersive simulations for physics, chemistry, and biology', path: '/xr-studio', icon: 'FlaskConical' },
  { title: 'Sage AI Learning Assistant', category: 'AI Tool', description: 'Socratic AI tutor, study plan creator, and doubt solver', path: '/chat', icon: 'Bot' },
  { title: 'My Subjects & Syllabus', category: 'Academic', description: 'Class notes, chapters, quizzes, and formula sheets', path: '/subjects', icon: 'BookOpen' },
  { title: 'Skill Barter Marketplace', category: 'Community', description: 'Peer-to-peer skill exchange and mentorship matches', path: '/skill-marketplace', icon: 'Repeat' },
  { title: 'Adaptive Study Planner', category: 'Tool', description: 'AI scheduled revision sessions and exam countdowns', path: '/planner', icon: 'Calendar' },
  { title: 'Analytics & Performance', category: 'Analytics', description: 'Detailed breakdown of speed, accuracy, and skill radar', path: '/analytics', icon: 'BarChart2' }
];

// Indexed topics, skills, and subjects
export const INDEXED_SEARCH_ITEMS = [
  // Subjects & Topics
  { title: 'Mathematics - Calculus & Derivatives', category: 'Subject Topic', path: '/subjects', keyword: 'math calculus derivative limits integration algebra' },
  { title: 'Physics - Quantum Optics & Wave Theory', category: 'Subject Topic', path: '/subjects', keyword: 'physics quantum optics interference laser photons' },
  { title: 'Chemistry - Organic Synthesis & Reaction Kinetics', category: 'Subject Topic', path: '/subjects', keyword: 'chemistry organic reactions benzene IUPAC sn1 sn2' },
  { title: 'Computer Science - Data Structures & Algorithms', category: 'Subject Topic', path: '/subjects', keyword: 'cs data structures trees graphs sorting binary search recursion' },
  { title: 'Database Management Systems (DBMS)', category: 'Subject Topic', path: '/subjects', keyword: 'dbms sql relational database normalization indexing transactions' },
  { title: 'Biology - Molecular Genetics & Cell Biology', category: 'Subject Topic', path: '/subjects', keyword: 'biology dna rna genetics protein synthesis mitosis meiosis' },
  
  // Constellation Nodes
  { title: 'Definite Integration & Area Under Curves', category: 'Constellation Node', path: '/constellation', keyword: 'calculus integral limits area riemann' },
  { title: 'Double Slit Wave Particle Duality', category: 'Constellation Node', path: '/constellation', keyword: 'young double slit interference fringe width physics' },
  { title: 'Database Normalization 1NF to 3NF', category: 'Constellation Node', path: '/constellation', keyword: 'bcnf normalization candidate key functional dependency' },
  { title: 'React 19 Concurrent Rendering', category: 'Constellation Node', path: '/constellation', keyword: 'react hooks useresition useactionstate frontend js' },
  { title: 'Newtonian Fluid Mechanics & Viscosity', category: 'Constellation Node', path: '/constellation', keyword: 'fluid dynamics bernoulli reynolds stress' },

  // XR Labs
  { title: 'Virtual Optics & Interference Lab', category: '3D XR Lab', path: '/xr-studio', keyword: 'xr lab laser light refraction diffraction mirror lens' },
  { title: 'Chemical Reaction 3D Molecular Builder', category: '3D XR Lab', path: '/xr-studio', keyword: 'xr lab molecule bonding valence outer shell atomic' },
  { title: 'Human Heart 3D Anatomical Simulation', category: '3D XR Lab', path: '/xr-studio', keyword: 'xr lab biology cardiovascular atrium ventricle pulse rate' },
  { title: 'Pendulum Harmonic Motion Lab', category: '3D XR Lab', path: '/xr-studio', keyword: 'xr lab oscillation period gravity damped spring' }
];

/**
 * Get stored search history from localStorage
 */
export const getSearchHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!data) {
      return DEFAULT_HISTORY;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : DEFAULT_HISTORY;
  } catch (err) {
    console.error("Error reading search history from localStorage:", err);
    return DEFAULT_HISTORY;
  }
};

/**
 * Add a query to history in localStorage
 */
export const addSearchHistory = (query) => {
  if (!query || typeof query !== 'string' || !query.trim()) return getSearchHistory();
  const trimmed = query.trim();
  try {
    const current = getSearchHistory();
    // Remove if already exists (case-insensitive deduplication)
    const filtered = current.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
    // Prepend new search item and cap at 10 items max
    const updated = [trimmed, ...filtered].slice(0, 10);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error saving search history to localStorage:", err);
    return getSearchHistory();
  }
};

/**
 * Remove a specific item from search history
 */
export const removeSearchHistoryItem = (itemToRemove) => {
  if (!itemToRemove) return getSearchHistory();
  try {
    const current = getSearchHistory();
    const updated = current.filter(item => item.toLowerCase() !== itemToRemove.toLowerCase());
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error removing search history item:", err);
    return getSearchHistory();
  }
};

/**
 * Clear all search history
 */
export const clearSearchHistory = () => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch (err) {
    console.error("Error clearing search history:", err);
    return [];
  }
};

/**
 * Perform live search matching across pages, topics, labs, and skills
 */
export const searchGlobalData = (query) => {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  const results = [];

  // Match platform navigation pages
  PLATFORM_NAVIGATION_ITEMS.forEach(nav => {
    if (nav.title.toLowerCase().includes(q) || nav.description.toLowerCase().includes(q) || nav.category.toLowerCase().includes(q)) {
      results.push({
        type: 'navigation',
        title: nav.title,
        category: nav.category,
        subtitle: nav.description,
        path: nav.path,
        icon: nav.icon
      });
    }
  });

  // Match indexed subjects, skills, and labs
  INDEXED_SEARCH_ITEMS.forEach(item => {
    if (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.keyword && item.keyword.toLowerCase().includes(q))
    ) {
      results.push({
        type: 'content',
        title: item.title,
        category: item.category,
        subtitle: `Explore in ${item.category}`,
        path: item.path,
        icon: item.category.includes('XR') ? 'FlaskConical' : item.category.includes('Node') ? 'Sparkles' : 'BookOpen'
      });
    }
  });

  return results.slice(0, 8); // top 8 relevant results
};
