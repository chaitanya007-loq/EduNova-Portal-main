// EduNova Sage AI — Dynamic Quiz Generator Engine & Duplicate Question Prevention

const HASH_STORAGE_KEY = 'edunova_question_history';

/**
 * Deterministic text normalization for exact/near duplicate question hashing
 */
export function normalizeTextForHash(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Retrieve learner question history from storage
 */
export function getQuestionHistory() {
  try {
    const saved = localStorage.getItem(HASH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Save newly used question hashes to learner question history
 */
export function recordQuestionHistory(questions, userId = 'usr_guest', subjectId = 'general', topicId = 'general', quizId = '') {
  try {
    const existing = getQuestionHistory();
    const newEntries = questions.map(q => ({
      userId,
      questionHash: normalizeTextForHash(q.question),
      subjectId,
      topicId,
      questionText: q.question,
      difficulty: q.difficulty || 'Medium',
      correctOption: q.correctOptionId || 'A',
      createdAt: new Date().toISOString(),
      quizId
    }));
    const updated = [...newEntries, ...existing].slice(0, 500);
    localStorage.setItem(HASH_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving question history:', e);
  }
}

/**
 * Fisher-Yates Shuffle Algorithm for randomizing question sequence & options
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Dynamic Math & Science Question Factories with randomized parameters
 */
function generateDynamicOhmQuestion() {
  const v = Math.floor(Math.random() * 8 + 2) * 6; // e.g., 12, 18, 24, 30, 36, 48 V
  const r = Math.floor(Math.random() * 5 + 2) * 2; // e.g., 4, 6, 8, 10, 12 Ω
  const i = (v / r).toFixed(1);
  const correctVal = `${i} A`;
  
  const options = shuffleArray([
    { id: 'A', text: correctVal },
    { id: 'B', text: `${(v * r).toFixed(1)} A` },
    { id: 'C', text: `${(v + r).toFixed(1)} A` },
    { id: 'D', text: `${(r / v).toFixed(2)} A` }
  ]);

  const correctOption = options.find(o => o.text === correctVal);

  return {
    id: `dyn_ohm_${Date.now()}_${Math.random()}`,
    type: 'MCQ',
    question: `A conductor has a potential difference of V = ${v} V across its ends and resistance R = ${r} Ω. Using Ohm's Law (V = IR), calculate the current (I) flowing through it.`,
    options: options.map(o => ({ id: o.id, text: o.text })),
    correctOptionId: correctOption.id,
    explanation: `Current I = V / R = ${v} V / ${r} Ω = ${correctVal}.`
  };
}

function generateDynamicMirrorQuestion() {
  const radius = Math.floor(Math.random() * 6 + 3) * 10;
  const focal = radius / 2;
  const correctVal = `-${focal} cm`;

  const options = shuffleArray([
    { id: 'A', text: correctVal },
    { id: 'B', text: `+${focal} cm` },
    { id: 'C', text: `-${radius} cm` },
    { id: 'D', text: `+${radius * 2} cm` }
  ]);

  const correctOption = options.find(o => o.text === correctVal);

  return {
    id: `dyn_mirr_${Date.now()}_${Math.random()}`,
    type: 'MCQ',
    question: `A spherical concave mirror has a radius of curvature R = ${radius} cm. What is its focal length (f) according to Cartesian sign convention?`,
    options: options.map(o => ({ id: o.id, text: o.text })),
    correctOptionId: correctOption.id,
    explanation: `Focal length f = R / 2 = ${radius} / 2 = ${focal} cm. For concave mirrors, f is negative (-${focal} cm).`
  };
}

function generateDynamicQuadraticQuestion() {
  const a = 1;
  const b = (Math.floor(Math.random() * 4) + 2) * 2;
  const c = Math.floor(Math.random() * 5) + 1;
  const dVal = b * b - 4 * a * c;
  const correctVal = `D = ${dVal}`;

  const options = shuffleArray([
    { id: 'A', text: correctVal },
    { id: 'B', text: `D = ${dVal + 12}` },
    { id: 'C', text: `D = ${dVal - 8}` },
    { id: 'D', text: `D = ${b * b + 4 * a * c}` }
  ]);

  const correctOption = options.find(o => o.text === correctVal);

  return {
    id: `dyn_quad_${Date.now()}_${Math.random()}`,
    type: 'MCQ',
    question: `What is the discriminant value D (b² - 4ac) for the quadratic equation x² + ${b}x + ${c} = 0?`,
    options: options.map(o => ({ id: o.id, text: o.text })),
    correctOptionId: correctOption.id,
    explanation: `Discriminant D = b² - 4ac = (${b})² - 4(1)(${c}) = ${b * b} - ${4 * c} = ${dVal}.`
  };
}

// Heart Anatomy Specific Question Pool
const HEART_ANATOMY_QUESTION_POOL = [
  {
    question: "Which heart chamber pumps oxygenated blood through the aorta into systemic circulation?",
    type: "MCQ",
    options: ["Left Ventricle", "Right Ventricle", "Right Atrium", "Left Atrium"],
    correctIdx: 0,
    explanation: "The left ventricle has the thickest muscular wall and generates high systolic pressure (~120 mmHg) to pump blood into the aorta."
  },
  {
    question: "Which blood vessel carries deoxygenated blood from the right ventricle of the heart to the lungs?",
    type: "MCQ",
    options: ["Pulmonary Artery", "Aorta", "Pulmonary Vein", "Superior Vena Cava"],
    correctIdx: 0,
    explanation: "The Pulmonary Artery carries deoxygenated blood from the right ventricle into the pulmonary circulation for oxygenation."
  },
  {
    question: "The Right Atrium receives deoxygenated blood returning from the body via which major veins?",
    type: "MCQ",
    options: ["Superior and Inferior Vena Cava", "Pulmonary Veins", "Carotid Arteries", "Coronary Artery"],
    correctIdx: 0,
    explanation: "The Vena Cava vessels collect deoxygenated venous blood from systemic circulation and empty it into the Right Atrium."
  },
  {
    question: "Which valve prevents the backflow of blood from the left ventricle into the left atrium during contraction?",
    type: "MCQ",
    options: ["Bicuspid (Mitral) Valve", "Tricuspid Valve", "Aortic Semilunar Valve", "Pulmonary Valve"],
    correctIdx: 0,
    explanation: "The Bicuspid (Mitral) valve separates the left atrium and left ventricle, closing during ventricular systole to prevent regurgitation."
  }
];

// CPU Pipeline Specific Question Pool
const CPU_PIPELINE_QUESTION_POOL = [
  {
    question: "In a 5-stage RISC CPU pipeline, which stage is responsible for decoding instruction opcodes and reading register operands?",
    type: "MCQ",
    options: ["ID (Instruction Decode)", "IF (Instruction Fetch)", "EX (Execute)", "WB (Write Back)"],
    correctIdx: 0,
    explanation: "The Instruction Decode (ID) stage decodes opcode bits and reads source operands from the CPU register file."
  },
  {
    question: "Which hardware component inside the EX stage performs arithmetic and logical calculations?",
    type: "MCQ",
    options: ["Arithmetic Logic Unit (ALU)", "Program Counter (PC)", "Instruction Cache", "Write Buffer"],
    correctIdx: 0,
    explanation: "The ALU core computes operations such as addition, subtraction, AND, OR, and branch address comparisons."
  }
];

// Master Question Pools
const SCHOOL_QUESTION_POOL = [
  ...HEART_ANATOMY_QUESTION_POOL,
  {
    question: "Which gas is liberated when dilute Hydrochloric Acid (HCl) reacts with active Zinc metal?",
    type: "MCQ",
    options: ["Hydrogen Gas (H₂)", "Oxygen Gas (O₂)", "Carbon Dioxide (CO₂)", "Nitrogen Gas (N₂)"],
    correctIdx: 0,
    explanation: "Metals react with acids to form a salt and release Hydrogen gas (which burns with a pop sound)."
  },
  {
    question: "According to Cartesian sign convention, the focal length of a convex mirror is always positive.",
    type: "True / False",
    options: ["True", "False"],
    correctIdx: 0,
    explanation: "True. Convex mirror focal point lies behind the mirror (+ direction)."
  },
  {
    question: "What is the value of the fundamental trigonometric identity sin²θ + cos²θ?",
    type: "MCQ",
    options: ["1", "0", "2", "tan θ"],
    correctIdx: 0,
    explanation: "sin²θ + cos²θ = 1 is the fundamental Pythagorean identity in trigonometry."
  },
  {
    question: "In an electrical circuit, Ammeters are always connected in parallel across components.",
    type: "True / False",
    options: ["True", "False"],
    correctIdx: 1,
    explanation: "False. Ammeters have low resistance and must be connected in series to measure total current."
  },
  {
    question: "Which organelle is known as the powerhouse of the eukaryotic cell?",
    type: "MCQ",
    options: ["Mitochondria", "Ribosome", "Golgi Apparatus", "Endoplasmic Reticulum"],
    correctIdx: 0,
    explanation: "Mitochondria produce ATP through cellular respiration, powering cellular processes."
  }
];

const COLLEGE_QUESTION_POOL = [
  ...CPU_PIPELINE_QUESTION_POOL,
  {
    question: "Which data structure operates strictly on a Last-In, First-Out (LIFO) order?",
    type: "MCQ",
    options: ["Stack", "Queue", "Array", "Linked List"],
    correctIdx: 0,
    explanation: "A Stack processes the most recently pushed item first (LIFO)."
  },
  {
    question: "In relational DBMS, a primary key allows NULL values.",
    type: "True / False",
    options: ["True", "False"],
    correctIdx: 1,
    explanation: "False. Primary keys strictly enforce Entity Integrity (NO NULL values)."
  },
  {
    question: "What is the worst-case time complexity of Binary Search on a sorted array of size n?",
    type: "MCQ",
    options: ["O(log n)", "O(n)", "O(n^2)", "O(1)"],
    correctIdx: 0,
    explanation: "Binary Search continuously halves the search space, giving logarithmic time complexity O(log n)."
  },
  {
    question: "What does Atomicity guarantee in DBMS ACID properties?",
    type: "MCQ",
    options: [
      "All operations in a transaction complete fully or roll back completely",
      "Transactions execute at maximum network throughput",
      "Data is stored in indivisible atomic units",
      "No locks are acquired during queries"
    ],
    correctIdx: 0,
    explanation: "Atomicity ensures an all-or-nothing execution for database transactions."
  }
];

/**
 * Validate question quality before accepting it
 */
function validateQuestion(q) {
  if (!q.question || typeof q.question !== 'string' || q.question.trim().length < 8) return false;
  if (q.type === 'MCQ' && (!q.options || q.options.length !== 4)) return false;
  if (q.type === 'True / False' && (!q.options || q.options.length !== 2)) return false;
  if (!q.correctOptionId) return false;
  
  // Check unique option text
  if (q.options) {
    const texts = q.options.map(o => o.text.trim().toLowerCase());
    const unique = new Set(texts);
    if (unique.size !== texts.length) return false;
  }

  return true;
}

/**
 * Generate Dynamic Randomized Quiz with exact specifications & Hash Duplicate Prevention
 */
export function generateDynamicQuiz({ 
  subjectName = 'Curriculum', 
  topicName = 'All Topics',
  count = 10, 
  difficulty = 'Mixed', 
  questionType = 'Mixed',
  mode = 'Practice',
  isSchool = true 
}) {
  const reqCount = Math.min(Math.max(parseInt(count, 10) || 5, 5), 30);
  const masterPool = isSchool ? SCHOOL_QUESTION_POOL : COLLEGE_QUESTION_POOL;

  // Retrieve learner history hashes
  const history = getQuestionHistory();
  const historyHashes = new Set(history.map(h => h.questionHash));

  const candidatePool = shuffleArray(masterPool);
  const generatedQuestions = [];

  // Add 1-3 dynamic parameterized questions if applicable
  if (isSchool) {
    const dynOhm = generateDynamicOhmQuestion();
    if (!historyHashes.has(normalizeTextForHash(dynOhm.question))) generatedQuestions.push(dynOhm);

    const dynMirr = generateDynamicMirrorQuestion();
    if (!historyHashes.has(normalizeTextForHash(dynMirr.question))) generatedQuestions.push(dynMirr);

    const dynQuad = generateDynamicQuadraticQuestion();
    if (!historyHashes.has(normalizeTextForHash(dynQuad.question))) generatedQuestions.push(dynQuad);
  }

  // Populate remaining questions from candidate pool with duplicate check
  for (let i = 0; i < candidatePool.length && generatedQuestions.length < reqCount; i++) {
    const raw = candidatePool[i];
    const hash = normalizeTextForHash(raw.question);

    // REJECT if identical question has been used in recent history!
    if (historyHashes.has(hash)) continue;

    // Filter by question type if requested
    if (questionType === 'MCQ' && raw.type === 'True / False') continue;
    if (questionType === 'True / False' && raw.type !== 'True / False') continue;

    const rawOptions = raw.options.map((txt, idx) => ({ text: txt, isCorrect: idx === raw.correctIdx }));
    const shuffledOpts = shuffleArray(rawOptions);
    
    const letters = ['A', 'B', 'C', 'D'];
    const optionsObj = shuffledOpts.map((opt, idx) => ({
      id: letters[idx],
      text: opt.text,
      isCorrect: opt.isCorrect
    }));

    const correctOption = optionsObj.find(o => o.isCorrect);

    const formattedQ = {
      id: `q_dyn_${Date.now()}_${i}_${Math.random()}`,
      type: raw.type || 'MCQ',
      question: raw.question,
      options: optionsObj.map(o => ({ id: o.id, text: o.text })),
      correctOptionId: correctOption ? correctOption.id : 'A',
      explanation: raw.explanation,
      difficulty: difficulty === 'Mixed' ? (i % 2 === 0 ? 'Medium' : 'Hard') : difficulty
    };

    if (validateQuestion(formattedQ)) {
      generatedQuestions.push(formattedQ);
    }
  }

  // Final shuffle & slice
  const finalQuestions = shuffleArray(generatedQuestions).slice(0, reqCount);

  const quizObj = {
    quizId: `quiz_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    subjectName,
    topicName: topicName || 'All Topics',
    difficulty,
    questionType,
    mode,
    questions: finalQuestions
  };

  // Record question hashes to prevent future duplicates!
  recordQuestionHistory(finalQuestions, 'usr_active', subjectName, topicName, quizObj.quizId);

  return quizObj;
}
