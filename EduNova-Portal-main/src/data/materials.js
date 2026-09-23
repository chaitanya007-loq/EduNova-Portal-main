// EduNova Learning Materials Repository (Connected to Selected Subjects & Topics)

export const INITIAL_MATERIALS = [
  // MATHEMATICS MATERIALS
  {
    id: 'mat_math_notes_1',
    subjectId: 'sub_sch_math',
    topicId: 'top_math_quad',
    title: '📘 Quadratic Equations & Discriminant Revision Notes',
    description: 'Complete breakdown of $ax^2 + bx + c = 0$, quadratic formula $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$, and nature of roots.',
    type: 'Notes',
    tags: ['Algebra', 'CBSE Class 10', 'Board Revision'],
    uploadedBy: 'EduNova Academic Board',
    createdAt: '2026-09-10',
    content: `### 📘 Quadratic Equations Core Summary

1. **Standard Form:**
   $$ax^2 + bx + c = 0 \\quad (a \\neq 0)$$

2. **Discriminant ($D$):**
   $$D = b^2 - 4ac$$

3. **Nature of Roots:**
   - If $D > 0$: Two distinct real roots.
   - If $D = 0$: Two equal real roots ($x = -b / 2a$).
   - If $D < 0$: No real roots (imaginary roots).`
  },
  {
    id: 'mat_math_formula_1',
    subjectId: 'sub_sch_math',
    topicId: 'top_math_trig',
    title: '📝 Trigonometry Identities & Angle Formula Sheet',
    description: 'Quick reference sheet for $\\sin^2 \\theta + \\cos^2 \\theta = 1$, $1 + \\tan^2 \\theta = \\sec^2 \\theta$, and standard values ($0^\\circ, 30^\\circ, 45^\\circ, 60^\\circ, 90^\\circ$).',
    type: 'Formula Sheets',
    tags: ['Trigonometry', 'Formulas', 'Quick Reference'],
    uploadedBy: 'Sage AI Tutor',
    createdAt: '2026-09-12',
    content: `### 📝 Essential Trigonometric Formulas

- $\\sin^2 \\theta + \\cos^2 \\theta = 1$
- $1 + \\tan^2 \\theta = \\sec^2 \\theta$
- $1 + \\cot^2 \\theta = \\csc^2 \\theta$
- $\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}$
- $\\sin(90^\\circ - \\theta) = \\cos \\theta$`
  },
  {
    id: 'mat_math_flash_1',
    subjectId: 'sub_sch_math',
    topicId: 'top_math_quad',
    title: '🧠 Quadratic Formula & Roots Flashcards',
    description: '10 interactive flip cards covering discriminant conditions and root calculations.',
    type: 'Flashcards',
    tags: ['Active Recall', 'Flashcards', 'Practice'],
    uploadedBy: 'EduNova System',
    createdAt: '2026-09-14',
    cards: [
      { front: 'What is the quadratic formula?', back: 'x = (-b ± √(b² - 4ac)) / (2a)' },
      { front: 'What condition gives two equal real roots?', back: 'Discriminant D = b² - 4ac = 0' },
      { front: 'If D < 0, what are the roots?', back: 'No real roots exist (complex/imaginary)' },
      { front: 'What is the sum of roots of ax² + bx + c = 0?', back: 'Sum = -b/a' },
      { front: 'What is the product of roots of ax² + bx + c = 0?', back: 'Product = c/a' }
    ]
  },
  {
    id: 'mat_math_mcq_1',
    subjectId: 'sub_sch_math',
    topicId: 'top_math_trig',
    title: '🎯 10 High-Yield Class 10 Trigonometry MCQs',
    description: 'Targeted multiple choice practice questions with detailed explanations.',
    type: 'MCQs',
    tags: ['MCQs', 'Practice Test', 'Board Questions'],
    uploadedBy: 'EduNova Exam Prep Team',
    createdAt: '2026-09-15',
    questionsCount: 10
  },

  // PHYSICS MATERIALS
  {
    id: 'mat_phy_notes_1',
    subjectId: 'sub_sch_physics',
    topicId: 'top_phy_light',
    title: '📘 Light Reflection, Spherical Mirrors & Ray Diagrams Guide',
    description: 'Concave mirror focal length $1/f = 1/v + 1/u$, magnification $m = -v/u$, and lens refraction rules.',
    type: 'Notes',
    tags: ['Physics', 'Optics', 'Ray Diagrams'],
    uploadedBy: 'Dr. Anita Roy',
    createdAt: '2026-09-11',
    content: `### 🔬 Spherical Mirror Rules & Mirror Formula

1. **Mirror Formula:**
   $$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$$

2. **Magnification ($m$):**
   $$m = \\frac{h'}{h} = -\\frac{v}{u}$$

3. **Sign Convention:**
   - Object distance ($u$) is ALWAYS negative.
   - Concave mirror focal length ($f$) is negative.
   - Convex mirror focal length ($f$) is positive.`
  },
  {
    id: 'mat_phy_sim_1',
    subjectId: 'sub_sch_physics',
    topicId: 'top_phy_light',
    title: '📊 Interactive 3D Concave Mirror Ray Diagram Simulator',
    description: 'Manipulate object position in real time and view virtual image formation.',
    type: 'Interactive Simulations',
    tags: ['3D AR', 'Simulation', 'Visual Learning'],
    uploadedBy: 'EduNova XR Studio',
    createdAt: '2026-09-13',
    simulationRoute: '/xr-studio'
  },

  // DBMS MATERIALS (COLLEGE)
  {
    id: 'mat_dbms_notes_1',
    subjectId: 'sub_col_dbms',
    topicId: 'top_dbms_sql',
    title: '📘 Advanced SQL Relational Algebra & Multi-Table Joins Cheat Sheet',
    description: 'INNER JOIN, LEFT OUTER JOIN, RIGHT OUTER JOIN, FULL JOIN, GROUP BY, and HAVING clause syntax with examples.',
    type: 'Cheat Sheets',
    tags: ['SQL', 'DBMS', 'Database Queries'],
    uploadedBy: 'Dr. Evelyn Vance',
    createdAt: '2026-09-08',
    content: `### 🗄️ SQL Join Operations Syntax

\`\`\`sql
-- INNER JOIN
SELECT e.name, d.department_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;

-- LEFT OUTER JOIN
SELECT e.name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;
\`\`\``
  },
  {
    id: 'mat_dbms_flash_1',
    subjectId: 'sub_col_dbms',
    topicId: 'top_dbms_norm',
    title: '🧠 Database Normalization (1NF, 2NF, 3NF, BCNF) Flashcards',
    description: 'Master functional dependency rules and anomaly elimination.',
    type: 'Flashcards',
    tags: ['Normalization', 'BCNF', 'Database Design'],
    uploadedBy: 'Sage AI Tutor',
    createdAt: '2026-09-14',
    cards: [
      { front: 'What is 1NF requirement?', back: 'Atomic values in columns, no repeating groups' },
      { front: 'What is 2NF requirement?', back: 'In 1NF + no partial dependency on candidate key' },
      { front: 'What is 3NF requirement?', back: 'In 2NF + no transitive dependencies' },
      { front: 'What is BCNF rule?', back: 'For every X -> Y, X must be a super key' }
    ]
  },

  // REACT.JS MATERIALS (SKILLS)
  {
    id: 'mat_react_notes_1',
    subjectId: 'sub_skl_react',
    topicId: 'top_react_hooks',
    title: '📘 React 19 Custom Hooks & Context API State Patterns',
    description: 'Building custom hooks, useMemo, useCallback memoization rules, and Context API providers.',
    type: 'Notes',
    tags: ['React', 'Custom Hooks', 'Frontend Architecture'],
    uploadedBy: 'Sophia Chen',
    createdAt: '2026-09-09',
    content: `### ⚛️ Custom Hook Pattern

\`\`\`javascript
export const useFetch = (url) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);
  return data;
};
\`\`\``
  }
];
