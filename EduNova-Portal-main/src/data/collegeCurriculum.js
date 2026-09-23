// EduNova College Curriculum Hierarchy Data (Degree ➔ Branch ➔ Year ➔ Semester ➔ Subject ➔ Module)

export const COLLEGE_DEGREES = ['B.Tech', 'BCA', 'B.Sc Computer Science', 'BBA', 'MCA', 'M.Tech'];

export const COLLEGE_BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication (ECE)',
  'Mechanical Engineering',
  'Civil Engineering'
];

export const COLLEGE_SEMESTERS = [
  'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
  'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
];

export const COLLEGE_SEMESTER_DATA = {
  'Semester 4': [
    {
      id: 'col_sub_dbms',
      code: 'CS401',
      name: 'Database Management Systems (DBMS)',
      progress: 72,
      instructor: 'Prof. Rajesh K.',
      color: '#06b6d4',
      modules: [
        { name: 'Relational Model & ER Diagrams', completed: true },
        { name: 'SQL Queries, Joins & Subqueries', completed: true },
        { name: 'Normalization (1NF, 2NF, 3NF, BCNF)', completed: false },
        { name: 'Transaction Management & ACID', completed: false }
      ]
    },
    {
      id: 'col_sub_os',
      code: 'CS402',
      name: 'Operating Systems',
      progress: 64,
      instructor: 'Dr. Ananya Roy',
      color: '#6366f1',
      modules: [
        { name: 'Process Synchronization & Semaphores', completed: true },
        { name: 'CPU Scheduling Algorithms', completed: true },
        { name: 'Memory Management & Paging', completed: false },
        { name: 'File System Architecture', completed: false }
      ]
    },
    {
      id: 'col_sub_cn',
      code: 'CS403',
      name: 'Computer Networks',
      progress: 58,
      instructor: 'Prof. Vikram Malhotra',
      color: '#a855f7',
      modules: [
        { name: 'OSI & TCP/IP Model Layers', completed: true },
        { name: 'Data Link Layer & Sliding Window', completed: true },
        { name: 'IP Addressing & Subnetting', completed: false },
        { name: 'Routing Protocols (RIP, OSPF)', completed: false }
      ]
    },
    {
      id: 'col_sub_se',
      code: 'CS404',
      name: 'Software Engineering & Agile',
      progress: 81,
      instructor: 'Prof. Meera Joshi',
      color: '#10b981',
      modules: [
        { name: 'Agile Scrum Framework', completed: true },
        { name: 'UML Use Cases & Sequence Diagrams', completed: true },
        { name: 'Software Testing & Automation', completed: true }
      ]
    }
  ]
};
