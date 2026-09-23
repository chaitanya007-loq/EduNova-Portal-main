export const sampleCommunityPosts = [
  {
    id: 'post_1',
    author: {
      name: 'Sarah Connor',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      badge: 'Pro Student',
      verified: true
    },
    title: 'How do you structure custom React hooks for clean async API pagination & error handling?',
    content: 'I am building an immersive course filter and want to isolate retry logic inside a custom hook. What patterns do you recommend for aborting stale requests with AbortController and keeping loading states predictable?',
    subject: 'React',
    topic: 'Hooks & Async Data Fetching',
    difficulty: 'Intermediate',
    qualityStatus: 'Well Structured',
    tags: ['React', 'Hooks', 'AsyncJS', 'Frontend'],
    upvotes: 42,
    repliesCount: 14,
    views: 310,
    timeAgo: '2 hours ago',
    bookmarked: false,
    acceptedAnswerId: 'ans_1',
    acceptedAnswer: {
      id: 'ans_1',
      author: 'Kenji Sato (Mentor)',
      content: 'Use an AbortController ref inside useEffect cleanup: `useEffect(() => { const controller = new AbortController(); fetchData({ signal: controller.signal }); return () => controller.abort(); }, [query])`. This guarantees stale responses are discarded.',
      upvotes: 28,
      verified: true
    }
  },
  {
    id: 'post_2',
    author: {
      name: 'Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badge: 'Mentor',
      verified: true
    },
    title: 'Tips for mastering 3D WebGL Canvas orbital gravity simulations in browser!',
    content: 'Here is a quick breakdown of calculating gravitational attraction acceleration vector components F = G * (m1 * m2) / r^2 directly inside HTML5 Canvas requestAnimationFrame loop.',
    subject: 'Physics',
    topic: 'Gravitational Orbits',
    difficulty: 'Advanced',
    qualityStatus: 'Expert-Level',
    tags: ['Physics', 'Canvas', 'WebGL', 'Math'],
    upvotes: 89,
    repliesCount: 28,
    views: 890,
    timeAgo: '5 hours ago',
    bookmarked: true,
    acceptedAnswerId: null
  },
  {
    id: 'post_3',
    author: {
      name: 'Aisha Patel',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha%20Patel',
      badge: 'DBMS Specialist',
      verified: true
    },
    title: 'B-Tree Index vs Hash Index in PostgreSQL: When to choose which for high-frequency queries?',
    content: 'When optimizing SQL queries for read-heavy workloads, B-Trees support range scans (`WHERE age > 25`), whereas Hash indexes are purely O(1) equality lookup. Here are production bench test numbers.',
    subject: 'DBMS',
    topic: 'Index Optimization',
    difficulty: 'Intermediate',
    qualityStatus: 'Clear',
    tags: ['DBMS', 'SQL', 'PostgreSQL', 'Performance'],
    upvotes: 64,
    repliesCount: 19,
    views: 450,
    timeAgo: '1 day ago',
    bookmarked: false,
    acceptedAnswerId: null
  }
];

export const sampleStudyGroups = [
  {
    id: 'group_1',
    name: 'React Advanced Architecture Lab',
    membersCount: 38,
    subject: 'React',
    currentTopic: 'Performance Optimization & Micro-frontends',
    nextSession: 'Tomorrow • 7:00 PM',
    description: 'Weekly hands-on group studying React 19 concurrent rendering, server components, and state management benchmarks.',
    avatar: '⚛️'
  },
  {
    id: 'group_2',
    name: 'Quantum Physics & Orbits Syndicate',
    membersCount: 24,
    subject: 'Physics',
    currentTopic: 'Gravitational Vector Fields',
    nextSession: 'Saturday • 5:00 PM',
    description: 'Collaborative study squad solving physics problem sets and building 3D WebXR canvas experiments.',
    avatar: '🪐'
  },
  {
    id: 'group_3',
    name: 'DBMS & SQL Performance Mastermind',
    membersCount: 45,
    subject: 'DBMS',
    currentTopic: 'B-Tree Indexing & Transaction Isolation',
    nextSession: 'Sunday • 8:00 PM',
    description: 'Deep-diving into database engine internals, ACID compliance, and query plan optimization.',
    avatar: '💾'
  }
];

export const sampleMentors = [
  {
    id: 'men_1',
    name: 'Dr. Elena Rostova',
    role: 'Physics & WebXR Professor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    subjects: ['Physics', 'WebXR', 'Mathematics'],
    experience: '8+ Years Teaching',
    rating: 4.95,
    sessionsCompleted: 142,
    availability: 'Mon, Wed, Fri (6 - 9 PM)'
  },
  {
    id: 'men_2',
    name: 'Kenji Sato',
    role: 'Senior React Architect',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    subjects: ['React', 'JavaScript', 'System Design'],
    experience: '6+ Years Industry',
    rating: 4.9,
    sessionsCompleted: 98,
    availability: 'Tue, Thu, Sat (7 - 10 PM)'
  }
];

export const sampleStudyPartners = [
  {
    id: 'part_1',
    name: 'David Kim',
    matchScore: 95,
    subject: 'React',
    level: 'Intermediate',
    goal: 'Building React custom hooks & portfolio projects',
    availability: '7:00 PM - 9:00 PM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'part_2',
    name: 'Priya Sharma',
    matchScore: 91,
    subject: 'DBMS',
    level: 'Advanced',
    goal: 'SQL query tuning & exam preparation',
    availability: '5:00 PM - 7:00 PM',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  }
];

export const sampleProjects = [
  {
    id: 'proj_1',
    title: 'EduNova WebXR Human Heart 3D Inspector',
    creator: 'Sophia Al-Mansoor',
    techStack: ['React', 'Three.js', 'WebXR', 'AI Vision'],
    description: 'Interactive volumetric 3D heart model with real-time chamber audio and component inspection hotspots.',
    demoUrl: '#',
    githubUrl: '#',
    upvotes: 76
  },
  {
    id: 'proj_2',
    title: 'B-Tree Query Visualizer Tool',
    creator: 'Aisha Patel',
    techStack: ['React', 'SQL', 'Canvas', 'Tailwind'],
    description: 'Visual step-by-step tree rebalancing visualizer for insertion and deletion algorithms.',
    demoUrl: '#',
    githubUrl: '#',
    upvotes: 54
  }
];

export const sampleResources = [
  {
    id: 'res_1',
    title: 'React 19 Custom Hooks & AbortController Cheat Sheet',
    type: 'PDF Guide',
    subject: 'React',
    author: 'Kenji Sato',
    downloadsCount: 340
  },
  {
    id: 'res_2',
    title: 'DBMS SQL Query Performance & Indexing Cheat Sheet',
    type: 'Formula Sheet',
    subject: 'DBMS',
    author: 'Aisha Patel',
    downloadsCount: 510
  }
];
