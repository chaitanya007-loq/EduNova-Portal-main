import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';
import { skillDNAService } from '../../services/skillDNAService';
import { useTheme } from '../../context/ThemeContext';

// Utility helper to shuffle an array
const shuffleArray = (arr) => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// MCQ Constructor with Randomized Option Placement
const createMCQ = (id, questionText, correctText, wrongTexts, explanationText) => {
  const distractors = wrongTexts.slice(0, 3);
  while (distractors.length < 3) {
    distractors.push(`Secondary auxiliary component for ${id}`);
  }

  const rawOptions = [
    { isCorrect: true, text: correctText },
    { isCorrect: false, text: distractors[0] },
    { isCorrect: false, text: distractors[1] },
    { isCorrect: false, text: distractors[2] }
  ];

  const shuffled = shuffleArray(rawOptions);
  const optionLetters = ['A', 'B', 'C', 'D'];

  let correctId = 'A';
  const options = shuffled.map((opt, idx) => {
    const letter = optionLetters[idx];
    if (opt.isCorrect) correctId = letter;
    return { id: letter, text: opt.text };
  });

  return {
    id,
    question: questionText,
    options,
    correctOptionId: correctId,
    explanation: explanationText
  };
};

export const XRQuizMode = ({ model, onRewardXP }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Adaptive');
  const [quizStarted, setQuizStarted] = useState(false);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Generate dynamic, randomized, model-specific questions up to target questionCount
  const generateQuestions = (targetCount) => {
    const modelName = model?.name || '3D Spatial Concept';
    const category = model?.category || 'General';
    const topic = model?.topic || 'Core Theory';
    const hotspots = model?.hotspots || [];

    const generated = [];

    // 1. Hotspot Primary Function Questions
    hotspots.forEach((h, idx) => {
      const wrongPool = [
        `Secondary auxiliary structure storing temporary energy for ${h.name}.`,
        `Acts as a static structural anchor with zero dynamic data flow.`,
        `Performs global system reset on unhandled external exceptions.`,
        `Absorbs external thermal radiation and dampens frequency response.`,
        `Executes background garbage collection during idle clock cycles.`
      ];

      generated.push(
        createMCQ(
          `hs_func_${idx}`,
          `What is the primary function of the ${h.name} in ${modelName}?`,
          h.description || h.function || `${h.name} operational component.`,
          shuffleArray(wrongPool),
          `The ${h.name} is designed for: ${h.description || h.function}`
        )
      );
    });

    // 2. Reverse Hotspot Questions (Identify component by function)
    hotspots.forEach((h, idx) => {
      const wrongNames = hotspots.filter(other => other.id !== h.id).map(other => other.name);
      wrongNames.push('Global System Bus', 'Static Memory Layer', 'Thermal Buffer');

      generated.push(
        createMCQ(
          `hs_rev_${idx}`,
          `Which structural component in ${modelName} is responsible for: "${h.description || h.function}"?`,
          h.name,
          shuffleArray(wrongNames),
          `The component corresponding to this function is ${h.name}.`
        )
      );
    });

    // 3. Domain & Topic Conceptual Questions
    if (modelName.toLowerCase().includes('tree') || modelName.toLowerCase().includes('bst')) {
      generated.push(
        createMCQ(
          'concept_bst_1',
          `What is the worst-case time complexity of searching an element in an UNBALANCED Binary Search Tree?`,
          'O(N) linear time when degenerated into a single chain',
          ['O(1) constant time lookup', 'O(log N) logarithmic time', 'O(N^2) quadratic search time'],
          'Unbalanced BSTs can degenerate into a single chain (linked list), causing worst-case search time to become O(N).'
        ),
        createMCQ(
          'concept_bst_2',
          `Why are AVL tree balance rotations (LL, RR, LR, RL) performed during node operations?`,
          'To maintain a strict height balance factor between -1 and +1 and guarantee O(log N) lookup',
          ['To reduce physical RAM allocation by 50%', 'To encrypt stored node integer keys', 'To sort node values in descending alphabetical order'],
          'AVL rotations rebalance subtrees whenever the height difference between left and right subtrees exceeds 1.'
        ),
        createMCQ(
          'concept_bst_3',
          `In an in-order traversal (Left -> Root -> Right) of a Binary Search Tree, in what sequence are node keys visited?`,
          'Strictly sorted ascending order',
          ['Strictly sorted descending order', 'Random level-order sequence', 'Reverse post-order sequence'],
          'In-order traversal visits the left subtree, then root, then right subtree, producing a strictly ascending sorted order.'
        ),
        createMCQ(
          'concept_bst_4',
          `What key invariant must hold true for EVERY node N in a valid Binary Search Tree?`,
          'All keys in N\'s left subtree are < N, and all keys in N\'s right subtree are > N',
          ['N must have exactly two child nodes at all times', 'N\'s left child must be odd and right child must be even', 'Parent nodes must always be smaller than leaf nodes'],
          'The fundamental BST invariant requires left subtree keys < root key < right subtree keys.'
        )
      );
    } else if (modelName.toLowerCase().includes('btree') || modelName.toLowerCase().includes('dbms')) {
      generated.push(
        createMCQ(
          'concept_btree_1',
          `Why are B-Trees preferred over Binary Search Trees for disk-based database indexing?`,
          'B-Trees have high fan-out per node, minimizing disk I/O seek operations for large datasets',
          ['B-Trees do not require any memory allocation', 'Binary Search Trees cannot store string data', 'B-Trees execute operations in O(1) space regardless of dataset size'],
          'Disk reads are slow; B-Trees maximize keys per disk block (high fan-out) to reduce tree height and disk I/O.'
        ),
        createMCQ(
          'concept_btree_2',
          `In a B+ Tree index, where are actual record pointers or table row data stored?`,
          'Exclusively in the leaf nodes, connected via a doubly linked list for range queries',
          ['Distributed equally across root and internal nodes', 'In a separate unsorted stack buffer', 'In the primary CPU L1 cache'],
          'B+ Trees store all actual data pointers in leaf pages, facilitating fast range sequential scans.'
        )
      );
    } else if (modelName.toLowerCase().includes('cpu') || modelName.toLowerCase().includes('pipeline')) {
      generated.push(
        createMCQ(
          'concept_cpu_1',
          `What is a "Pipeline Data Hazard" in a RISC CPU architecture?`,
          'When an instruction depends on the output of a preceding instruction that has not yet completed writeback',
          ['When the CPU power supply voltage drops below threshold', 'When L1 cache RAM experiences physical parity bit errors', 'When instructions are fetched out of program memory order'],
          'Data hazards occur when instruction dependencies prevent execution in subsequent pipeline clock cycles.'
        ),
        createMCQ(
          'concept_cpu_2',
          `What is the primary role of the Arithmetic Logic Unit (ALU) during the EX (Execute) pipeline stage?`,
          'Performing arithmetic computations (add, sub) and logical evaluations (AND, OR, CMP)',
          ['Fetching instruction opcode bytes from external main DRAM', 'Decoding instruction registers into control signals', 'Writing back final results into memory address space'],
          'The ALU executes arithmetic logic operations on operand values fetched during decode stage.'
        )
      );
    } else if (modelName.toLowerCase().includes('microservices') || modelName.toLowerCase().includes('system')) {
      generated.push(
        createMCQ(
          'concept_ms_1',
          `What is the primary benefit of deploying an API Gateway in front of microservices?`,
          'Centralized routing, rate limiting, authentication, and SSL termination across services',
          ['Replacing relational database storage with in-memory files', 'Automatically writing microservice source code', 'Eliminating network latency between client and server'],
          'API Gateways act as a unified entry point managing security, rate limiting, and request routing.'
        ),
        createMCQ(
          'concept_ms_2',
          `How does an In-Memory Redis Cache Cluster improve microservice architecture scalability?`,
          'By caching frequent query responses in RAM, providing sub-2ms latency and shielding databases',
          ['By storing permanent database table backups on secondary tape drives', 'By compressing HTTP request headers automatically', 'By compiling JavaScript files to native machine code'],
          'Caching hot data in Redis RAM drastically speeds up read requests and prevents database bottlenecks.'
        )
      );
    }

    // 4. Fill remaining requested question count with procedural conceptual MCQs
    let poolIdx = 0;
    while (generated.length < targetCount) {
      poolIdx++;
      const qText = `Question ${generated.length + 1} (${difficulty}): Which principle is fundamental when evaluating ${modelName} in ${topic}?`;
      const correctAns = `Optimizing structural performance, correctness invariants, and resource efficiency in ${category}.`;
      const wrongAns = [
        `Ignoring edge-case input parameters and assuming static environment states.`,
        `Bypassing error checking to increase raw throughput at the expense of integrity.`,
        `Hardcoding static memory limits regardless of workload volume.`
      ];

      generated.push(
        createMCQ(
          `gen_fill_${poolIdx}`,
          qText,
          correctAns,
          wrongAns,
          `Understanding structural properties ensures robust design and optimal performance.`
        )
      );
    }

    // Return exact requested question count, with shuffled question order
    return shuffleArray(generated).slice(0, targetCount);
  };

  const handleStartQuiz = () => {
    const qList = generateQuestions(questionCount);
    setQuestions(qList);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;
    setIsSubmitted(true);

    const q = questions[currentIdx];
    if (selectedOption === q.correctOptionId) {
      setScore(prev => prev + 1);
      if (onRewardXP) onRewardXP(15, 'Correct Quiz Answer');
    } else {
      // Log wrong answer to skillDNAService for misconception pattern learning
      const selectedObj = q.options.find(o => o.id === selectedOption);
      const correctObj = q.options.find(o => o.id === q.correctOptionId);
      skillDNAService.logWrongAnswer({
        question: q.question,
        subject: model?.category,
        topic: model?.topic,
        selectedAnswer: selectedObj ? selectedObj.text : selectedOption,
        correctAnswer: correctObj ? correctObj.text : q.correctOptionId
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      skillDNAService.addEvidence(model?.category || 'Problem Solving', {
        score: Math.round((score / questions.length) * 100),
        description: `Completed ${questions.length}-question quiz on ${model?.name}`
      });
      if (onRewardXP) onRewardXP(40, 'XR Quiz Completed');
    }
  };

  if (!quizStarted) {
    return (
      <div
        style={{
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(245, 249, 255, 0.9) 100%)'
            : 'rgba(15, 23, 42, 0.85)',
          border: isLight ? '1.5px solid rgba(56, 189, 248, 0.45)' : '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '20px',
          padding: '20px',
          color: isLight ? '#0f172a' : '#ffffff',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={20} color={isLight ? '#0284c7' : '#38bdf8'} />
          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8' }}>
            Adaptive Spatial Quiz Configurator
          </h4>
        </div>

        {/* Count Selection */}
        <div>
          <label style={{ fontSize: '0.8rem', color: isLight ? '#334155' : '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            Number of Questions:
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[5, 10, 15, 20, 25, 30].map(cnt => (
              <button
                key={cnt}
                onClick={() => setQuestionCount(cnt)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: questionCount === cnt
                    ? 'linear-gradient(135deg, #0284c7, #2563eb)'
                    : (isLight ? 'rgba(238, 242, 255, 0.95)' : 'rgba(30, 41, 59, 0.6)'),
                  color: questionCount === cnt ? '#ffffff' : (isLight ? '#1e40af' : '#ffffff'),
                  border: questionCount === cnt ? 'none' : (isLight ? '1px solid rgba(199, 210, 254, 0.9)' : 'none'),
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label style={{ fontSize: '0.8rem', color: isLight ? '#334155' : '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            Difficulty Level:
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['Adaptive', 'Easy', 'Medium', 'Hard'].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: difficulty === d
                    ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                    : (isLight ? 'rgba(238, 242, 255, 0.95)' : 'rgba(30, 41, 59, 0.6)'),
                  color: difficulty === d ? '#ffffff' : (isLight ? '#1e40af' : '#ffffff'),
                  border: difficulty === d ? 'none' : (isLight ? '1px solid rgba(199, 210, 254, 0.9)' : 'none'),
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStartQuiz}
          style={{
            marginTop: '8px',
            padding: '12px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            color: '#fff',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)'
          }}
        >
          Start Dynamic Quiz
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div
      style={{
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(245, 249, 255, 0.9) 100%)'
          : 'rgba(15, 23, 42, 0.85)',
        border: isLight ? '1.5px solid rgba(56, 189, 248, 0.45)' : '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '20px',
        padding: '20px',
        color: isLight ? '#0f172a' : '#ffffff',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : 'none'
      }}
    >
      {!quizFinished ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800 }}>
              Question {currentIdx + 1} of {questions.length} ({difficulty})
            </span>
            <span style={{ fontSize: '0.78rem', color: isLight ? '#059669' : '#10b981', fontWeight: 800 }}>Score: {score}</span>
          </div>

          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', lineHeight: 1.4 }}>
            {currentQ?.question}
          </div>

          {/* Option choices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentQ?.options.map(opt => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = opt.id === currentQ.correctOptionId;

              let bg = isLight ? 'rgba(240, 246, 255, 0.95)' : 'rgba(30, 41, 59, 0.7)';
              let border = isLight ? '1px solid rgba(199, 210, 254, 0.9)' : '1px solid rgba(255, 255, 255, 0.1)';
              let color = isLight ? '#0f172a' : '#ffffff';

              if (isSubmitted) {
                if (isCorrect) {
                  bg = isLight ? 'rgba(209, 250, 229, 0.95)' : 'rgba(16, 185, 129, 0.2)';
                  border = '1.5px solid #10b981';
                  color = isLight ? '#047857' : '#10b981';
                } else if (isSelected && !isCorrect) {
                  bg = isLight ? 'rgba(254, 226, 226, 0.95)' : 'rgba(244, 63, 94, 0.2)';
                  border = '1.5px solid #f43f5e';
                  color = isLight ? '#be123c' : '#f43f5e';
                }
              } else if (isSelected) {
                bg = isLight ? 'rgba(224, 242, 254, 0.95)' : 'rgba(56, 189, 248, 0.2)';
                border = '1.5px solid #0284c7';
                color = '#0284c7';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => !isSubmitted && setSelectedOption(opt.id)}
                  disabled={isSubmitted}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: bg,
                    border: border,
                    color: color,
                    textAlign: 'left',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: isSubmitted ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(255,255,255,0.1)',
                    color: isLight ? '#0284c7' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.74rem',
                    fontWeight: 800
                  }}>
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation revealed only after submission */}
          {isSubmitted && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: isLight ? 'rgba(224, 242, 254, 0.85)' : 'rgba(56, 189, 248, 0.12)',
              border: isLight ? '1.5px solid rgba(2, 132, 199, 0.35)' : '1px solid rgba(56, 189, 248, 0.3)',
              color: isLight ? '#334155' : '#cbd5e1',
              fontSize: '0.8rem',
              lineHeight: 1.4
            }}>
              <strong style={{ color: isLight ? '#0284c7' : '#38bdf8', display: 'block', marginBottom: '2px' }}>Explanation:</strong>
              {currentQ.explanation}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: selectedOption ? 'pointer' : 'not-allowed',
                  opacity: selectedOption ? 1 : 0.6
                }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                {currentIdx + 1 < questions.length ? 'Next Question →' : 'Complete Quiz'}
              </button>
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Award size={44} color="#10b981" style={{ marginBottom: '8px' }} />
          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>
            Quiz Completed!
          </h4>
          <p style={{ color: isLight ? '#475569' : '#94a3b8', fontSize: '0.88rem', margin: '8px 0 16px 0' }}>
            Final Score: <strong style={{ color: isLight ? '#0f172a' : '#fff' }}>{score} / {questions.length}</strong> ({Math.round((score / questions.length) * 100)}%). Evidence added to Skill DNA.
          </p>
          <button
            onClick={() => setQuizStarted(false)}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={16} /> Take Another Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default XRQuizMode;
