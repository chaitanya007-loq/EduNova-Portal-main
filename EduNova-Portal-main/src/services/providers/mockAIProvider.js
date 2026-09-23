// EduNova Sage AI — Grounded Mock Provider Engine (No Placeholder Contamination)

import { INTENT_TYPES } from '../ai/intentClassifier';
import { generateDynamicQuiz } from '../ai/quizGeneratorEngine';

export const callMockAI = async (prompt, intentObj, context) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const { intent, constraints } = intentObj;
  const pLower = prompt.toLowerCase().trim();

  // Extract clean topic name from prompt if provided by user, otherwise use context
  const targetTopic = context.currentTopic || context.currentSubject || 'General Knowledge';
  const targetSubject = context.currentSubject || 'Science & Math';
  const isSchoolTrack =
    (context.educationType === 'school') ||
    (context.title && (context.title.includes('Class') || context.title.includes('CBSE') || context.title.includes('School'))) ||
    (targetSubject && (targetSubject.includes('Science') || targetSubject.includes('Math') || targetSubject.includes('Physics') || targetSubject.includes('Chemistry') || targetSubject.includes('Class 10') || targetSubject.includes('CBSE') || targetSubject.includes('Social'))) ||
    (context.currentSubject && (context.currentSubject.includes('Science') || context.currentSubject.includes('Math') || context.currentSubject.includes('Physics') || context.currentSubject.includes('Chemistry') || context.currentSubject.includes('Class 10') || context.currentSubject.includes('CBSE')));

  // 1. GREETING & CASUAL CONVERSATION
  if (intent === INTENT_TYPES.GREETING) {
    return `Hello ${context.name || ''}! I'm Sage AI, your personal tutor. What would you like to learn or practice today?`.trim();
  }

  if (intent === INTENT_TYPES.CASUAL_CONVERSATION) {
    if (pLower.includes('how are you') || pLower.includes('how are u')) {
      return "I'm doing great and ready to help! What would you like to learn today?";
    }
    if (pLower.includes('what can you do')) {
      return "I can break down complex topics, explain code, generate practice quizzes, solve math problems step-by-step, create active recall flashcards, and build adaptive study plans!";
    }
    if (pLower.includes('thank')) {
      return "You're very welcome! Keep up the great progress. Let me know whenever you need help.";
    }
    if (pLower.includes('joke')) {
      return "Why do programmers prefer dark mode? Because light attracts bugs!";
    }
    if (pLower.includes('bye')) {
      return "Goodbye! Have a productive study session!";
    }
    return "I'm here to support your learning! Feel free to ask any question or request a practice quiz.";
  }

  // 2. MATH & SOLVE QUESTION
  if (pLower.includes('2x + 5 = 15') || (pLower.includes('2x') && pLower.includes('15'))) {
    if (constraints.onlyAnswer) {
      return "x = 5";
    }
    return `**Solving $2x + 5 = 15$:**\n\n1. Subtract 5 from both sides:\n   $$2x = 15 - 5 = 10$$\n\n2. Divide by 2:\n   $$x = \\frac{10}{2} = 5$$\n\n**Answer:** $x = 5$`;
  }

  // 3. GENERAL KNOWLEDGE QUESTIONS
  if (pLower.includes('capital of india')) {
    return "The capital of India is New Delhi.";
  }

  // 4. DEFINITION MODE
  if (intent === INTENT_TYPES.DEFINITION) {
    if (pLower.includes('photosynthesis')) {
      return "Photosynthesis is the process by which green plants use sunlight, carbon dioxide, and water to produce glucose and oxygen.";
    }
    if (pLower.includes('dbms')) {
      return "A Database Management System (DBMS) is software designed to systematically define, store, retrieve, and manage structured data while maintaining data integrity and ACID transaction properties.";
    }
    if (pLower.includes('inheritance')) {
      return "Inheritance is an object-oriented programming concept where a child class derives methods and attributes from a parent class to foster code reuse.";
    }
    if (pLower.includes('binary search')) {
      return "Binary search is an efficient search algorithm that repeatedly divides a sorted dataset in half until the target element is found, running in $O(\\log n)$ time complexity.";
    }

    // Extract exact concept term
    let term = prompt
      .replace(/give only definition of|give only the definition of|define|what is the definition of|what is|only definition of/gi, '')
      .replace(/[?.!]/g, '')
      .trim();
    if (!term) term = targetTopic;

    return `**${term.toUpperCase()} DEFINITION:** A fundamental concept in ${targetSubject} defining the structural principles and mathematical rules governing system operation.`;
  }

  // 5. QUIZ & MCQ GENERATION (Conversational Setup & Smart Shortcut Execution)
  if (intent === INTENT_TYPES.QUIZ || intent === INTENT_TYPES.MCQ || pLower.includes('quiz') || pLower.includes('test me') || pLower.includes('practice questions')) {
    const isGenericSetupPrompt = [
      'create a quiz', 'quiz me', 'take a test', 'give me mcqs',
      'practice questions', 'test me', 'create a quiz for me'
    ].includes(pLower);

    // If user asked a generic setup prompt -> Trigger Conversational Setup Wizard!
    if (isGenericSetupPrompt) {
      return JSON.stringify({
        isQuizSetup: true,
        message: "Sure! Let's set up your quiz. 🎯 Which subject would you like to practice?"
      });
    }

    // Extract exact request parameters if specified by user shortcut
    const count = constraints.exactQuestions || 10;
    const dynamicQuiz = generateDynamicQuiz({
      subjectName: targetSubject,
      topicName: targetTopic,
      count,
      difficulty: constraints.isBeginner ? 'Easy' : (constraints.isDetailed ? 'Hard' : 'Mixed'),
      questionType: pLower.includes('true') ? 'True / False' : (pLower.includes('mcq') ? 'MCQ' : 'Mixed'),
      mode: 'Practice',
      isSchool: isSchoolTrack
    });

    return JSON.stringify(dynamicQuiz);
  }

  // 6. BEGINNER EXPLANATION MODE
  if (intent === INTENT_TYPES.BEGINNER_EXPLANATION || pLower.includes("explain this like i'm a beginner") || pLower.includes("explain like i'm a beginner")) {
    const analogies = isSchoolTrack ? [
      `### 💡 Beginner Breakdown: ${targetTopic || targetSubject}\n\nImagine electricity like **water flowing through a hose**:\n- **Voltage (V)** is the pressure pushing the water.\n- **Current (I)** is how fast the water is flowing.\n- **Resistance (R)** is a narrow pinch in the hose slowing it down.\n\nThat's why **Ohm's Law ($V = I \\times R$)** says more pressure creates more flow unless resistance stops it!`,
      `### 💡 Beginner Breakdown: ${targetTopic || targetSubject}\n\nThink of a **Concave Mirror** like the **inside of a polished metal spoon**:\n- When you look closely, your reflection is magnified.\n- Light rays curve inward to meet at a single focal point ($f = R/2$).\n- That is why satellite dishes and car headlights use parabolic concave reflectors!`
    ] : [
      `### 💡 Beginner Breakdown: ${targetTopic || targetSubject}\n\nThink of a **Stack Data Structure** like a **stack of cafeteria trays**:\n- You put new trays on top (**Push**).\n- You take trays off the top (**Pop**).\n- The last tray put on top is always the first one taken off (**LIFO - Last In, First Out**).`,
      `### 💡 Beginner Breakdown: Database Normalization\n\nImagine your wardrobe closet:\n- **Unnormalized Data:** Throwing shoes, jackets, and socks all in one giant messy heap.\n- **Normalized Data:** Storing shoes in a shoe rack, hanging jackets on hangers, and placing socks in labeled drawers!\n- Normalization avoids duplicate copies and keeps data neat and anomaly-free.`
    ];

    const chosenAnalogy = analogies[Math.floor(Math.random() * analogies.length)];
    return chosenAnalogy;
  }

  // 7. RECOMMENDATIONS ("What should I learn next?")
  if (pLower.includes("what should i learn next") || pLower.includes("recommendation")) {
    if (isSchoolTrack) {
      const recs = [
        `### 🎯 Recommended Learning Path (Class 10 CBSE)\n\nBased on your progress, here is your target study roadmap:\n\n1. **Physics:** Master *Ohm's Law & Combination of Resistors* (High exam weightage).\n2. **Chemistry:** Review *Balancing Chemical Equations & Redox Reactions*.\n3. **Mathematics:** Practice 10 MCQs on *Quadratic Discriminant & Real Roots*.\n\n⚡ *Tip: Take a 10-question practice quiz to solidify your understanding!*`,
        `### 🎯 Recommended Learning Path (Class 10 CBSE)\n\nRecommended focus for today:\n\n1. **Biology:** Review *Life Processes: Double Circulation & Nephron Structure*.\n2. **Physics:** Practice ray diagrams for *Spherical Lenses & Magnification*.\n3. **Math:** Solve 5 problems on *Trigonometric Identities ($\sin^2\\theta + \\cos^2\\theta = 1$)*.`
      ];
      return recs[Math.floor(Math.random() * recs.length)];
    } else {
      return `### 🎯 Recommended Learning Path (College B.Tech)\n\nBased on your profile, here are your top recommended next topics:\n\n1. **DBMS:** Practice *SQL Joins & BCNF Normalization*.\n2. **Data Structures:** Implement *Binary Search Tree (BST) In-Order Traversal*.\n3. **Operating Systems:** Review *Round Robin & SJF CPU Scheduling*.\n\n⚡ *Tip: Generate a 10-question quiz to test your readiness!*`;
    }
  }

  // 8. WEAK AREA ANALYSIS ("Find my weak areas")
  if (pLower.includes("find my weak areas") || pLower.includes("weak area")) {
    const weakList = (context.weakTopics && context.weakTopics.length > 0)
      ? context.weakTopics
      : (isSchoolTrack ? ['Quadratic Equations', 'Chemical Reactions', 'Electric Current'] : ['Database Normalization', 'Tree Traversals', 'Process Scheduling']);

    return `### 🔍 Targeted Weak Area Diagnostic for ${context.name || 'Learner'}\n\nBased on your active ${context.learnerType?.toUpperCase() || 'SCHOOL'} profile analytics, here are your identified focus areas:\n\n${weakList.map(w => `- ⚠️ **${w}**: Needs active recall practice & formula review.`).join('\n')}\n\n**Actionable Remediation Plan:**\n1. Review your personalized study notes in the **Notes & Flashcards** section.\n2. Take a targeted **10-question practice quiz** focused on these topics.\n3. Open your **Knowledge Constellation Map** to view connected prerequisite nodes.`;
  }

  // 9. DYNAMIC ACCURATE STUDY PLAN GENERATOR (Uses Full Website Data & Active Track)
  if (pLower.includes("study plan") || pLower.includes("schedule") || pLower.includes("timetable") || pLower.includes("plan my") || pLower.includes("roadmap")) {
    const trackName = (context.learnerType || 'school').toUpperCase();
    const enrolledNames = (context.enrolledSubjects && context.enrolledSubjects.length > 0)
      ? context.enrolledSubjects.map(s => s.name).join(', ')
      : (isSchoolTrack ? 'Mathematics, Physics, Chemistry, Biology, English' : 'Data Structures, Operating Systems, DBMS, Computer Networks');

    const eduInfo = isSchoolTrack
      ? `${context.education?.class || 'Class 10'} (${context.education?.board || 'CBSE Board'})`
      : `${context.education?.degree || 'B.Tech'} ${context.education?.branch || 'Computer Science'}`;

    return `### 📅 Smart Adaptive Study Plan (${trackName} Track • ${eduInfo})\n\nHi **${context.name || 'Learner'}**! Here is your personalized study schedule built from your enrolled subjects (**${enrolledNames}**) and target weak areas:\n\n` +
      `- **Day 1 (Mon): Core Concepts & Theory**\n  - Focus: ${context.enrolledSubjects?.[0]?.name || 'Mathematics'} — ${context.enrolledSubjects?.[0]?.currentTopic || 'Key Definitions & Formulas'}\n  - Duration: 90 mins • Task: Review summary notes & formulas\n\n` +
      `- **Day 2 (Tue): Interactive Practice & Diagnostic Quizzes**\n  - Focus: ${context.enrolledSubjects?.[1]?.name || 'Physics'} — ${context.enrolledSubjects?.[1]?.currentTopic || 'Problem Solving'}\n  - Duration: 60 mins • Task: Complete 10-question diagnostic quiz\n\n` +
      `- **Day 3 (Wed): Weak Topic Remediation**\n  - Focus: Target Weak Areas (${context.weakTopics?.slice(0, 2).join(', ') || 'Core Weak Areas'})\n  - Duration: 90 mins • Task: Socratic step-by-step problem breakdown\n\n` +
      `- **Day 4 (Thu): 3D Visual & Practical Application**\n  - Focus: ${context.enrolledSubjects?.[2]?.name || 'Chemistry'} — Lab & Spatial Concepts\n  - Duration: 60 mins • Task: Explore interactive visual experiments\n\n` +
      `- **Day 5 (Fri): Active Recall & Flashcard Sprint**\n  - Focus: Comprehensive Revision across ${context.enrolledSubjects?.length || 4} Enrolled Subjects\n  - Duration: 45 mins • Task: Review 15 active recall cards\n\n` +
      `- **Day 6 (Sat): Exam Simulation & Past Question Drill**\n  - Focus: High-Yield Exam Preparation\n  - Duration: 120 mins • Task: Complete mock practice assessment\n\n` +
      `- **Day 7 (Sun): Progress Synthesis & DNA Review**\n  - Focus: Knowledge Constellation Node Alignment\n  - Duration: 45 mins • Task: Review mastery score increases\n\n` +
      `⚡ *Next Step: Open the **AI Study Planner** (/study-planner) or **Knowledge Constellation** (/constellation) to track your live progress!*`;
  }

  // 10. WEBSITE NAVIGATION & FEATURE GUIDANCE
  if (pLower.includes('where can i') || pLower.includes('how to use') || pLower.includes('feature') || pLower.includes('3d lab') || pLower.includes('xr') || pLower.includes('constellation') || pLower.includes('marketplace') || pLower.includes('exchange')) {
    if (pLower.includes('3d') || pLower.includes('xr') || pLower.includes('lab')) {
      return `### 🥽 3D AR/VR Science & Engineering XR Studio\n\nYou can explore interactive spatial science labs, planetary orbits, biology models, and physics circuits in the **XR Studio**!\n\n👉 Navigating to **XR Studio**: Access it from the main sidebar or visit \`/xr-studio\`.`;
    }
    if (pLower.includes('constellation') || pLower.includes('graph') || pLower.includes('skill map')) {
      return `### 🌌 Knowledge Constellation 3D Skill Graph\n\nThe **Knowledge Constellation** visualizes your learning journey in an interactive 3D node canvas. You can add new custom skill nodes, track prerequisite chains, test mastery, and view career goal coverage.\n\n👉 Access **Knowledge Constellation**: Visit \`/constellation\`.`;
    }
    if (pLower.includes('exchange') || pLower.includes('marketplace') || pLower.includes('peer') || pLower.includes('swap')) {
      return `### 🤝 Peer Skill Exchange & Mentorship\n\nThe **Skill Exchange Marketplace** lets you share your verified expertise (skills you can teach) and learn new skills from peer mentors.\n\n👉 Access **Skill Exchange**: Visit \`/marketplace\`.`;
    }
  }

  // 11. EXPLANATION, MATH & PROGRAMMING TOPICS
  if (pLower.includes('photosynthesis')) {
    return `### 🌿 Photosynthesis Breakdown\n\nPhotosynthesis is the chemical process by which green plants, algae, and cyanobacteria convert light energy into chemical energy stored in glucose.\n\n**Chemical Equation:**\n$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Sunlight, Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$\n\n- **Light Phase (Thylakoids):** Sunlight splits water molecules ($2\\text{H}_2\\text{O} \\to 4\\text{H}^+ + \\text{O}_2 + 4e^-$) producing ATP and NADPH.\n- **Dark Phase / Calvin Cycle (Stroma):** $\\text{CO}_2$ is fixed into Glucose using ATP and NADPH.`;
  }

  // Math Quadratic Equations
  if (pLower.includes('quadratic') || pLower.includes('x^2') || pLower.includes('equation')) {
    return `### 📐 Quadratic Equations & Formula Derivation\n\nA standard quadratic equation has the form:\n$$ax^2 + bx + c = 0$$\n\n**Quadratic Formula:**\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n**Discriminant Analysis ($D = b^2 - 4ac$):**\n- If $D > 0$: Two distinct real roots.\n- If $D = 0$: Two equal real roots.\n- If $D < 0$: No real roots (complex conjugate roots).`;
  }

  if (pLower.includes('dbms')) {
    return `### 🗄️ Database Management Systems (DBMS)\n\nA DBMS is software for creating and managing databases. It provides systematic mechanisms to store, query, and secure structured data.\n\n- **Key Features:** Data persistence, concurrency control, transaction management (ACID properties), and backup security.\n- **Common Types:** Relational DBMS (PostgreSQL, MySQL) and NoSQL (MongoDB).`;
  }

  if (pLower.includes('normalization')) {
    return `### 🗄️ Database Normalization\n\nDatabase Normalization is the technique of organizing relational tables to minimize data redundancy and prevent modification anomalies.\n\n1. **1NF:** Ensures atomic column values.\n2. **2NF:** Reaches 1NF and removes partial dependencies on composite keys.\n3. **3NF:** Reaches 2NF and removes transitive non-key dependencies.\n4. **BCNF:** A stricter 3NF variant where every functional dependency $X \\rightarrow Y$ requires $X$ to be a super key.`;
  }

  if (pLower.includes('react hook') || pLower.includes('usestate') || pLower.includes('useeffect')) {
    return `### ⚛️ React Hooks Architecture & Code Example\n\nReact Hooks let functional components access state and lifecycle events without writing class components.\n\n\`\`\`javascript\nimport React, { useState, useEffect } from 'react';\n\nexport function TopicTracker({ topicName }) {\n  const [progress, setProgress] = useState(0);\n\n  useEffect(() => {\n    // Dynamic subscriber or analytics logging\n    console.log(\`Tracking progress for \${topicName}\`);\n  }, [topicName]);\n\n  return (\n    <div className="card">\n      <h3>{topicName} Mastery</h3>\n      <p>Current Progress: {progress}%</p>\n      <button onClick={() => setProgress(p => Math.min(100, p + 10))}>\n        Complete Session (+10%)\n      </button>\n    </div>\n  );\n}\n\`\`\``;
  }

  // Default clean, context-aware answer based strictly on user prompt & learner track
  const trackLabel = context.learnerType ? context.learnerType.toUpperCase() : 'ACADEMIC';
  return `### 🧠 ${targetTopic} (${trackLabel} Track)\n\nHere is a clear breakdown for **"${prompt}"** tailored for your **${context.name || 'Learner'}** profile:\n\n` +
    `- **Core Concept:** ${targetTopic} is a core foundational topic in ${targetSubject}.\n` +
    `- **Key Takeaways:**\n` +
    `  1. Master fundamental rules and definitions before tackling advanced problem sets.\n` +
    `  2. Pay attention to edge conditions, formulas, and step-by-step logic.\n` +
    `  3. Take diagnostic quizzes to solidify memory retention.\n\n` +
    `💡 *Need a quiz or study plan? Ask Sage "Quiz me on ${targetTopic}" or "Create a 7-day study plan"!*`;
};
