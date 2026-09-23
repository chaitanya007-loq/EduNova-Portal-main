export const learnerCourses = {
  school: [
    {
      id: 'sch_1',
      title: 'Class 10 Mathematics: Quadratic Equations & Trigonometry',
      category: 'Mathematics',
      instructor: 'Mr. Rajesh Sharma (Senior CBSE Faculty)',
      rating: 4.9,
      studentsEnrolled: 18400,
      duration: '16 Hours',
      difficulty: 'Class 10 CBSE',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      description: 'Comprehensive Class 10 CBSE Board syllabus covering Discriminants, Quadratic Roots, Height & Distances, and Trigonometric Identities with step-by-step solved examples.',
      progress: 78,
      modules: [
        { id: 'm1', title: 'Module 1: Standard Form & Factorization', duration: '3.0 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Quadratic Formula & Discriminant Analysis', duration: '3.5 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Introduction to Trigonometric Ratios', duration: '4.5 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Heights & Distances Word Problems', duration: '5.0 hrs', completed: false }
      ],
      prerequisites: ['Class 9 Linear Equations']
    },
    {
      id: 'sch_2',
      title: 'Class 10 Physics: Electricity, Magnetic Effects & Light',
      category: 'Science',
      instructor: 'Dr. Anita Roy (Ph.D. Physics Education)',
      rating: 4.95,
      studentsEnrolled: 21000,
      duration: '18 Hours',
      difficulty: 'Class 10 CBSE',
      thumbnail: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&auto=format&fit=crop&q=80',
      description: 'Master Ohm\'s Law, Series & Parallel Circuits, Reflection at Spherical Mirrors, Refraction through Prisms, and Magnetic Effects with 3D interactive AR simulations.',
      progress: 72,
      modules: [
        { id: 'm1', title: 'Module 1: Electric Current, Potential & Ohm\'s Law', duration: '4.0 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Resistance & Heating Effects of Current', duration: '4.5 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Spherical Mirrors & Mirror Formula', duration: '4.5 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Refraction, Lenses & Dispersion of Light', duration: '5.0 hrs', completed: false }
      ],
      prerequisites: ['Basic Physics Concepts']
    },
    {
      id: 'sch_3',
      title: 'Class 10 Chemistry: Chemical Reactions & Carbon Compounds',
      category: 'Science',
      instructor: 'Prof. Suresh Kumar',
      rating: 4.88,
      studentsEnrolled: 15600,
      duration: '14 Hours',
      difficulty: 'Class 10 CBSE',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80',
      description: 'Understand Balancing Chemical Equations, Types of Reactions, Acids, Bases & Salts, and Covalent Bonding in Carbon Compounds with practical lab demos.',
      progress: 65,
      modules: [
        { id: 'm1', title: 'Module 1: Chemical Equations & Balancing', duration: '3.0 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Acids, Bases, pH & Indicator Tests', duration: '3.5 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Metals & Non-Metals Reactivity Series', duration: '3.5 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Carbon & Covalent Bonding', duration: '4.0 hrs', completed: false }
      ],
      prerequisites: ['Atomic Structure']
    },
    {
      id: 'sch_4',
      title: 'Class 10 Biology: Life Processes & Control Coordination',
      category: 'Science',
      instructor: 'Dr. Meera Menon',
      rating: 4.92,
      studentsEnrolled: 17200,
      duration: '15 Hours',
      difficulty: 'Class 10 CBSE',
      thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&auto=format&fit=crop&q=80',
      description: 'Explore Human Nutrition, Respiration, Double Circulation, Excretion in Nephrons, and Reflex Arcs in Neural System with 3D anatomical models.',
      progress: 82,
      modules: [
        { id: 'm1', title: 'Module 1: Digestive & Respiratory Systems', duration: '4.0 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Double Circulation & Heart Anatomy', duration: '3.5 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Excretion & Nephron Mechanism', duration: '3.5 hrs', completed: true },
        { id: 'm4', title: 'Module 4: Neuron Anatomy & Reflex Actions', duration: '4.0 hrs', completed: false }
      ],
      prerequisites: ['Cell Biology']
    },
    {
      id: 'sch_5',
      title: 'Class 10 English Literature: First Flight & Grammar Essentials',
      category: 'English',
      instructor: 'Ms. Sarah Jenkins',
      rating: 4.85,
      studentsEnrolled: 14200,
      duration: '12 Hours',
      difficulty: 'Class 10 CBSE',
      thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
      description: 'Master Class 10 English prose summary, poetic devices, analytical paragraph writing, active-passive voice, and reported speech.',
      progress: 45,
      modules: [
        { id: 'm1', title: 'Module 1: A Letter to God & Dust of Snow', duration: '2.5 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Nelson Mandela: Long Walk to Freedom', duration: '3.0 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Tenses, Modals & Reported Speech', duration: '3.5 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Letter Writing & Analytical Paragraphs', duration: '3.0 hrs', completed: false }
      ],
      prerequisites: ['English Reading Skills']
    },
    {
      id: 'sch_6',
      title: 'Class 10 Social Science: Nationalism, Resources & Civics',
      category: 'Social Science',
      instructor: 'Prof. Ramesh Varma',
      rating: 4.79,
      studentsEnrolled: 12800,
      duration: '16 Hours',
      difficulty: 'Class 10 CBSE',
      thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
      description: 'Comprehensive walkthrough of Rise of Nationalism in Europe, Indian Freedom Movement, Forest & Wildlife Resources, and Power Sharing in Democracy.',
      progress: 60,
      modules: [
        { id: 'm1', title: 'Module 1: Rise of Nationalism in Europe', duration: '4.0 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Nationalism in India & Non-Cooperation', duration: '4.0 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Resource Development & Soil Types', duration: '4.0 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Power Sharing & Federalism', duration: '4.0 hrs', completed: false }
      ],
      prerequisites: ['Class 9 History']
    },
    {
      id: 'sch_7',
      title: 'Class 10 Computer Applications: Python & HTML5 Web Development',
      category: 'Computer Applications',
      instructor: 'Dr. Evelyn Vance',
      rating: 4.93,
      studentsEnrolled: 19500,
      duration: '14 Hours',
      difficulty: 'Class 10 CBSE',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      description: 'Learn Cyber Ethics, HTML5 tags, CSS styling rules, and basic Python programming logic for Class 10 CBSE Computer Applications Code 165.',
      progress: 70,
      modules: [
        { id: 'm1', title: 'Module 1: Networking Concepts & Cyber Ethics', duration: '3.0 hrs', completed: true },
        { id: 'm2', title: 'Module 2: HTML5 Headings, Lists & Tables', duration: '3.5 hrs', completed: true },
        { id: 'm3', title: 'Module 3: CSS Styling & Form Design', duration: '3.5 hrs', completed: true },
        { id: 'm4', title: 'Module 4: Python Variables, Loops & Conditionals', duration: '4.0 hrs', completed: false }
      ],
      prerequisites: ['Basic Computer Literacy']
    }
  ],

  college: [
    {
      id: 'col_1',
      title: 'Database Management Systems (DBMS & SQL Architecture)',
      category: 'Core CS',
      instructor: 'Dr. Evelyn Vance',
      rating: 4.9,
      studentsEnrolled: 14200,
      duration: '18 Hours',
      difficulty: 'B.Tech CSE',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
      description: 'Master Relational Algebra, ER Diagrams, Normalization (1NF to BCNF), SQL Joins, Indexing, and ACID Transaction Properties.',
      progress: 72,
      modules: [
        { id: 'm1', title: 'Module 1: Relational Model & ER Diagrams', duration: '4.0 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Advanced SQL Queries & Joins', duration: '4.5 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Database Normalization & BCNF', duration: '4.5 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Transactions & Concurrency Control', duration: '5.0 hrs', completed: false }
      ],
      prerequisites: ['Data Structures']
    },
    {
      id: 'col_2',
      title: 'Operating Systems Architecture & Kernel Internals',
      category: 'Core CS',
      instructor: 'Prof. Marcus Brody',
      rating: 4.85,
      studentsEnrolled: 11800,
      duration: '20 Hours',
      difficulty: 'B.Tech CSE',
      thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
      description: 'Deep dive into Process Scheduling (FCFS, Round Robin), CPU Threads, Mutex Locks, Deadlocks Prevention, Virtual Memory & Paging.',
      progress: 64,
      modules: [
        { id: 'm1', title: 'Module 1: Process Management & System Calls', duration: '4.5 hrs', completed: true },
        { id: 'm2', title: 'Module 2: CPU Scheduling Algorithms', duration: '5.0 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Synchronization & Semaphores', duration: '5.0 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Virtual Memory & Page Replacement', duration: '5.5 hrs', completed: false }
      ],
      prerequisites: ['C Programming']
    },
    {
      id: 'col_3',
      title: 'Computer Networks & TCP/IP Protocol Suite',
      category: 'Core CS',
      instructor: 'Dr. Liam Sterling',
      rating: 4.8,
      studentsEnrolled: 9900,
      duration: '16 Hours',
      difficulty: 'B.Tech CSE',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
      description: 'Understand OSI 7-Layer Architecture, Subnetting, IPv4/IPv6 Routing Protocols (OSPF, BGP), TCP 3-Way Handshake, and Socket Programming.',
      progress: 58,
      modules: [
        { id: 'm1', title: 'Module 1: Physical & Data Link Layer Protocols', duration: '3.5 hrs', completed: true },
        { id: 'm2', title: 'Module 2: IP Addressing & Subnetting', duration: '4.0 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Transport Layer TCP vs UDP', duration: '4.0 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Application Protocols HTTP & DNS', duration: '4.5 hrs', completed: false }
      ],
      prerequisites: ['Basic OS Concepts']
    },
    {
      id: 'col_4',
      title: 'Modern React 19 & Full-Stack Architecture',
      category: 'Web Engineering',
      instructor: 'Dr. Evelyn Vance',
      rating: 4.92,
      studentsEnrolled: 15400,
      duration: '14 Hours',
      difficulty: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
      description: 'Master component design patterns, custom hooks, React Server Components, and state architecture with production projects.',
      progress: 78,
      modules: [
        { id: 'm1', title: 'Module 1: React 19 Foundations', duration: '2.5 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Advanced State & Context API', duration: '3.0 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Asynchronous Data Services', duration: '4.0 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Performance Optimization', duration: '4.5 hrs', completed: false }
      ],
      prerequisites: ['JavaScript ES6+']
    },
    {
      id: 'col_5',
      title: 'AI & Neural Networks Essentials',
      category: 'AI & ML',
      instructor: 'Prof. Marcus Brody',
      rating: 4.88,
      studentsEnrolled: 8900,
      duration: '18 Hours',
      difficulty: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
      description: 'Understand deep learning pipelines, transformer models, LLM prompts, and neural network optimization techniques.',
      progress: 42,
      modules: [
        { id: 'm1', title: 'Module 1: Neural Network Math', duration: '4 hrs', completed: true },
        { id: 'm2', title: 'Module 2: PyTorch & Model Training', duration: '5 hrs', completed: false },
        { id: 'm3', title: 'Module 3: Transformers & Attention', duration: '5 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Fine-Tuning LLMs', duration: '4 hrs', completed: false }
      ],
      prerequisites: ['Linear Algebra', 'Python']
    }
  ],

  skills: [
    {
      id: 'skl_1',
      title: 'Full-Stack Web Development Bootcamp (React + Node.js)',
      category: 'Web Development',
      instructor: 'Sophia Chen',
      rating: 4.96,
      studentsEnrolled: 28400,
      duration: '24 Hours',
      difficulty: 'Career Track',
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80',
      description: 'Build production-ready web apps from scratch with React 19, Node.js Express APIs, PostgreSQL, and modern Tailwind CSS.',
      progress: 85,
      modules: [
        { id: 'm1', title: 'Module 1: Modern JavaScript & Async/Await', duration: '5.0 hrs', completed: true },
        { id: 'm2', title: 'Module 2: React State & Custom Hooks', duration: '6.0 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Express REST API Architecture', duration: '6.5 hrs', completed: true },
        { id: 'm4', title: 'Module 4: Full Stack Capstone Deployment', duration: '6.5 hrs', completed: false }
      ],
      prerequisites: ['HTML & CSS Basics']
    },
    {
      id: 'skl_2',
      title: 'UI/UX Design Systems & Micro-Interactions',
      category: 'UI/UX Design',
      instructor: 'Sophia Chen',
      rating: 4.95,
      studentsEnrolled: 15300,
      duration: '10 Hours',
      difficulty: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80',
      description: 'Build futuristic digital experiences, master glassmorphism typography, dark themes, accessibility, and motion design.',
      progress: 70,
      modules: [
        { id: 'm1', title: 'Module 1: Color Science & Dark Mode', duration: '2 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Figma Design Tokens', duration: '3 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Micro-Animations', duration: '3 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Accessibility Rules', duration: '2 hrs', completed: false }
      ],
      prerequisites: ['None']
    },
    {
      id: 'skl_3',
      title: 'REST APIs, Express & GraphQL Microservices',
      category: 'Backend Engineering',
      instructor: 'Dr. Evelyn Vance',
      rating: 4.9,
      studentsEnrolled: 11200,
      duration: '16 Hours',
      difficulty: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      description: 'Design scalable microservices, JWT authentication, rate limiting, MongoDB Mongoose models, and GraphQL resolvers.',
      progress: 60,
      modules: [
        { id: 'm1', title: 'Module 1: REST API Best Practices & Middleware', duration: '4.0 hrs', completed: true },
        { id: 'm2', title: 'Module 2: JWT Auth & Security Headers', duration: '4.0 hrs', completed: true },
        { id: 'm3', title: 'Module 3: GraphQL Schema & Resolvers', duration: '4.0 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Microservice Message Queues', duration: '4.0 hrs', completed: false }
      ],
      prerequisites: ['Node.js Basics']
    },
    {
      id: 'skl_4',
      title: 'Docker & Kubernetes DevOps Foundations',
      category: 'Cloud & DevOps',
      instructor: 'Prof. Marcus Brody',
      rating: 4.87,
      studentsEnrolled: 9800,
      duration: '14 Hours',
      difficulty: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&auto=format&fit=crop&q=80',
      description: 'Containerize applications using Dockerfiles, multi-stage builds, Docker Compose, and deploy Kubernetes pods on AWS.',
      progress: 35,
      modules: [
        { id: 'm1', title: 'Module 1: Containerization Fundamentals', duration: '3.5 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Docker Compose Multi-Container Setup', duration: '3.5 hrs', completed: false },
        { id: 'm3', title: 'Module 3: Kubernetes Pods & Services', duration: '3.5 hrs', completed: false },
        { id: 'm4', title: 'Module 4: CI/CD Pipelines with GitHub Actions', duration: '3.5 hrs', completed: false }
      ],
      prerequisites: ['Linux Command Line']
    }
  ],

  exam: [
    {
      id: 'exm_1',
      title: 'Quantitative Technique & Data Interpretation Masterclass',
      category: 'Quantitative Aptitude',
      instructor: 'Mr. Arvind Saxena (Quant Expert)',
      rating: 4.94,
      studentsEnrolled: 22100,
      duration: '22 Hours',
      difficulty: 'Competitive Exam',
      thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80',
      description: 'Master Speed Math, Percentages, Profit & Loss, Time Speed Distance, Line Graphs, Pie Charts, and Data Sufficiency with shortcuts.',
      progress: 82,
      modules: [
        { id: 'm1', title: 'Module 1: Speed Calculation & Vedic Math Tricks', duration: '5.0 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Ratio, Proportion & Percentages', duration: '5.5 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Data Interpretation Line & Bar Graphs', duration: '5.5 hrs', completed: true },
        { id: 'm4', title: 'Module 4: Permutations & Probability', duration: '6.0 hrs', completed: false }
      ],
      prerequisites: ['High School Mathematics']
    },
    {
      id: 'exm_2',
      title: 'Logical Reasoning & Analytical Syllogisms',
      category: 'Logical Reasoning',
      instructor: 'Ms. Priyadarshini Rao',
      rating: 4.91,
      studentsEnrolled: 19800,
      duration: '18 Hours',
      difficulty: 'Competitive Exam',
      thumbnail: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80',
      description: 'Ace Seating Arrangements, Coding-Decoding, Blood Relations, Syllogisms Venn Diagrams, and Critical Reasoning for national entrance tests.',
      progress: 76,
      modules: [
        { id: 'm1', title: 'Module 1: Linear & Circular Seating Puzzles', duration: '4.5 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Syllogisms & Venn Diagram Rules', duration: '4.5 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Statement Assumptions & Conclusions', duration: '4.5 hrs', completed: false },
        { id: 'm4', title: 'Module 4: Data Arrangement & Matrices', duration: '4.5 hrs', completed: false }
      ],
      prerequisites: ['Analytical Aptitude']
    },
    {
      id: 'exm_3',
      title: 'Verbal Ability & Reading Comprehension Strategies',
      category: 'Verbal Ability',
      instructor: 'Ms. Sarah Jenkins',
      rating: 4.88,
      studentsEnrolled: 16500,
      duration: '15 Hours',
      difficulty: 'Competitive Exam',
      thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
      description: 'Boost speed reading, paragraph jumbles, sentence correction, vocabulary roots, tone identification, and RC accuracy.',
      progress: 88,
      modules: [
        { id: 'm1', title: 'Module 1: RC Passage Skimming Techniques', duration: '3.5 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Para Jumbles & Sentence Completion', duration: '3.5 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Vocabulary Etymology & Root Words', duration: '4.0 hrs', completed: true },
        { id: 'm4', title: 'Module 4: Grammar Error Spotting Rules', duration: '4.0 hrs', completed: false }
      ],
      prerequisites: ['Basic English Grammar']
    },
    {
      id: 'exm_4',
      title: 'Innovation, Entrepreneurship & General Knowledge',
      category: 'General Awareness',
      instructor: 'Prof. Ramesh Varma',
      rating: 4.82,
      studentsEnrolled: 14200,
      duration: '12 Hours',
      difficulty: 'Competitive Exam',
      thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
      description: 'Comprehensive coverage of Start-up Funding stages, Business Terminology, Indian Economy trends, and National Current Affairs.',
      progress: 71,
      modules: [
        { id: 'm1', title: 'Module 1: Startup Lifecycle & Incubators', duration: '3.0 hrs', completed: true },
        { id: 'm2', title: 'Module 2: Financial Terms & Business Models', duration: '3.0 hrs', completed: true },
        { id: 'm3', title: 'Module 3: Current Economic Policies', duration: '3.0 hrs', completed: false },
        { id: 'm4', title: 'Module 4: National & Global Business GK', duration: '3.0 hrs', completed: false }
      ],
      prerequisites: ['General Awareness']
    }
  ]
};

export const sampleCourses = learnerCourses.college;
