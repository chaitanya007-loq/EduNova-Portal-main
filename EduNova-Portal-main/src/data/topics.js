// EduNova Subject Topics & Chapters Hierarchy

export const SUBJECT_TOPICS = {
  // Mathematics (School Class 10)
  'sub_sch_math': [
    { id: 'top_math_alg', name: 'Algebra & Polynomials', desc: 'Discriminant, Nature of Roots & Factorization', difficulty: 'Medium', completed: true },
    { id: 'top_math_quad', name: 'Quadratic Equations', desc: 'Solving by Formula & Discriminant Analysis', difficulty: 'Hard', completed: false, isCurrent: true },
    { id: 'top_math_trig', name: 'Trigonometric Identities', desc: 'Sin, Cos, Tan Identities & Heights & Distances', difficulty: 'Hard', completed: false, isWeak: true },
    { id: 'top_math_geom', name: 'Coordinate Geometry & Triangles', desc: 'Distance Formula, Section Formula & Similar Triangles', difficulty: 'Medium', completed: false },
    { id: 'top_math_stat', name: 'Statistics & Probability', desc: 'Mean, Median, Mode & Event Probabilities', difficulty: 'Easy', completed: false }
  ],

  // Physics (School Class 10)
  'sub_sch_physics': [
    { id: 'top_phy_elec', name: 'Electric Current & Ohm\'s Law', desc: 'Potential Difference, Resistance & Heating Effect', difficulty: 'Medium', completed: true },
    { id: 'top_phy_mag', name: 'Magnetic Effects of Electric Current', desc: 'Magnetic Field Lines, Solenoids & Electromagnetic Induction', difficulty: 'Hard', completed: false },
    { id: 'top_phy_light', name: 'Light: Reflection & Refraction', desc: 'Spherical Mirrors, Lenses, Ray Diagrams & Refractive Index', difficulty: 'Hard', completed: false, isCurrent: true, isWeak: true },
    { id: 'top_phy_eye', name: 'Human Eye & Colourful World', desc: 'Prism Dispersion, Atmospheric Refraction & Tyndall Effect', difficulty: 'Easy', completed: false }
  ],

  // Chemistry (School Class 10)
  'sub_sch_chem': [
    { id: 'top_chem_eq', name: 'Chemical Reactions & Equations', desc: 'Balancing Equations, Combination & Redox Reactions', difficulty: 'Medium', completed: true, isCurrent: true },
    { id: 'top_chem_acid', name: 'Acids, Bases & Salts', desc: 'pH Scale, Indicators & Salts Preparation', difficulty: 'Medium', completed: true },
    { id: 'top_chem_metal', name: 'Metals & Non-Metals', desc: 'Reactivity Series, Ionic Bonds & Metallurgy', difficulty: 'Hard', completed: false },
    { id: 'top_chem_carbon', name: 'Carbon & Its Compounds', desc: 'Covalent Bonding, Homologous Series & Functional Groups', difficulty: 'Hard', completed: false, isWeak: true }
  ],

  // DBMS (College B.Tech CSE)
  'sub_col_dbms': [
    { id: 'top_dbms_er', name: 'Relational Model & ER Diagrams', desc: 'Entities, Relationships, Keys & ER-to-Relational Mapping', difficulty: 'Medium', completed: true },
    { id: 'top_dbms_sql', name: 'SQL Relational Algebra & Joins', desc: 'INNER, LEFT, RIGHT, FULL Joins, Group By & Subqueries', difficulty: 'Hard', completed: false, isCurrent: true },
    { id: 'top_dbms_norm', name: 'Database Normalization & BCNF', desc: 'Functional Dependencies, 1NF, 2NF, 3NF & BCNF', difficulty: 'Hard', completed: false, isWeak: true },
    { id: 'top_dbms_tx', name: 'Transactions & Concurrency Control', desc: 'ACID Properties, Two-Phase Locking & Serializability', difficulty: 'Hard', completed: false }
  ],

  // Operating Systems (College B.Tech CSE)
  'sub_col_os': [
    { id: 'top_os_proc', name: 'Process Management & System Calls', desc: 'PCB, Process States, Fork System Calls & Context Switching', difficulty: 'Medium', completed: true },
    { id: 'top_os_sched', name: 'CPU Process Scheduling Algorithms', desc: 'FCFS, SJF, Priority & Round-Robin Scheduling', difficulty: 'Hard', completed: false, isCurrent: true },
    { id: 'top_os_sync', name: 'Process Synchronization & Semaphores', desc: 'Critical Section, Mutex, Semaphores & Dining Philosophers', difficulty: 'Hard', completed: false, isWeak: true },
    { id: 'top_os_vm', name: 'Virtual Memory & Page Replacement', desc: 'Paging, TLB Cache, LRU & FIFO Page Replacement', difficulty: 'Hard', completed: false }
  ],

  // React.js (Skills & Career)
  'sub_skl_react': [
    { id: 'top_react_found', name: 'React 19 Core & Virtual DOM', desc: 'JSX, Components, Props & Reconciliation Algorithm', difficulty: 'Easy', completed: true },
    { id: 'top_react_hooks', name: 'Custom Hooks & Context API', desc: 'useState, useEffect, useMemo, useCallback & Context State', difficulty: 'Medium', completed: false, isCurrent: true, isWeak: true },
    { id: 'top_react_rsc', name: 'React Server Components & Next.js', desc: 'Server Actions, Streaming SSR & Hydration Architecture', difficulty: 'Hard', completed: false },
    { id: 'top_react_perf', name: 'Performance & Spatial WebGL', desc: 'Profilers, Code Splitting & Three.js Canvas Integrations', difficulty: 'Hard', completed: false }
  ],

  // Quant & DI (Exam Prep CMAT)
  'sub_exm_quant': [
    { id: 'top_quant_speed', name: 'Speed Calculation & Percentages', desc: 'Vedic Math Short-cuts, Ratios & Profit-Loss Calculations', difficulty: 'Medium', completed: true },
    { id: 'top_quant_di', name: 'Data Interpretation Line & Bar Graphs', desc: 'Multi-line Graphs, Cumulative Tables & Percentage Growth', difficulty: 'Hard', completed: false, isCurrent: true },
    { id: 'top_quant_prob', name: 'Permutations, Combinations & Probability', desc: 'Arrangements, Selections & Event Probability Formulas', difficulty: 'Hard', completed: false, isWeak: true }
  ]
};

export const getTopicsForSubject = (subjectId) => {
  return SUBJECT_TOPICS[subjectId] || [
    { id: `${subjectId}_t1`, name: 'Foundations & Concepts', desc: 'Core theory and fundamental principles', difficulty: 'Medium', completed: true },
    { id: `${subjectId}_t2`, name: 'Core Applications', desc: 'Practical problem solving and examples', difficulty: 'Medium', completed: false, isCurrent: true },
    { id: `${subjectId}_t3`, name: 'Advanced Mastery', desc: 'Complex scenarios and exam-level synthesis', difficulty: 'Hard', completed: false, isWeak: true }
  ];
};
