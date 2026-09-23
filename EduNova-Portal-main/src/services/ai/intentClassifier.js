// EduNova Sage AI — Intent Classifier Engine

export const INTENT_TYPES = {
  GREETING: 'greeting',
  CASUAL_CONVERSATION: 'casual_conversation',
  DEFINITION: 'definition',
  EXPLANATION: 'explanation',
  BEGINNER_EXPLANATION: 'beginner_explanation',
  DETAILED_EXPLANATION: 'detailed_explanation',
  EXAMPLE: 'example',
  ANALOGY: 'analogy',
  SUMMARY: 'summary',
  SIMPLIFY: 'simplify',
  SOLVE_QUESTION: 'solve_question',
  STEP_BY_STEP_SOLUTION: 'step_by_step_solution',
  COMPARE: 'compare',
  FORMULA: 'formula',
  NOTES: 'notes',
  FLASHCARDS: 'flashcards',
  QUIZ: 'quiz',
  MCQ: 'mcq',
  PRACTICE_QUESTIONS: 'practice_questions',
  REVISION: 'revision',
  STUDY_PLAN: 'study_plan',
  WEAK_AREA_ANALYSIS: 'weak_area_analysis',
  EXPLAIN_WRONG_ANSWER: 'explain_wrong_answer',
  FOLLOW_UP: 'follow_up',
  GENERAL_QUESTION: 'general_question'
};

export const classifyIntent = (prompt = '') => {
  const p = prompt.toLowerCase().trim();

  // Constraints detection
  const constraints = {
    exactLines: null,
    exactQuestions: null,
    isBeginner: false,
    isDetailed: false,
    isConcise: false,
    onlyAnswer: false
  };

  const lineMatch = p.match(/(?:in|only)\s*(\d+)\s*lines?/i);
  if (lineMatch) constraints.exactLines = parseInt(lineMatch[1], 10);

  const qMatch = p.match(/(\d+)\s*(?:mcqs?|questions?|quizzes?|cards?)/i);
  if (qMatch) constraints.exactQuestions = parseInt(qMatch[1], 10);

  if (p.includes('beginner') || p.includes('simple') || p.includes('easy') || p.includes('like i am 5') || p.includes('like i\'m 10') || p.includes('like i am 10')) {
    constraints.isBeginner = true;
  }

  if (p.includes('detailed') || p.includes('deeply') || p.includes('comprehensive') || p.includes('in depth') || p.includes('in detail')) {
    constraints.isDetailed = true;
  }

  if (p.includes('concise') || p.includes('brief') || p.includes('short') || p.includes('only definition')) {
    constraints.isConcise = true;
  }

  if (p.includes('only give answer') || p.includes('only answer') || p.includes('only give the answer') || p.includes('just the answer')) {
    constraints.onlyAnswer = true;
  }

  // 1. Casual Greetings & Conversation
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|yo)\b/i.test(p)) {
    return { intent: INTENT_TYPES.GREETING, constraints };
  }

  if (
    p.includes('how are you') || 
    p.includes('how are u') || 
    p.includes('who are you') || 
    p.includes('what can you do') || 
    p.includes('thank') || 
    p.includes('thanks') || 
    p.includes('bye') || 
    p.includes('tell me a joke') ||
    p === 'okay' || p === 'ok' || p === 'great' || p === 'cool'
  ) {
    return { intent: INTENT_TYPES.CASUAL_CONVERSATION, constraints };
  }

  // 2. MCQ & Quiz
  if (p.includes('mcq') || p.includes('multiple choice')) {
    return { intent: INTENT_TYPES.MCQ, constraints };
  }

  if (p.includes('quiz') || p.includes('test me')) {
    return { intent: INTENT_TYPES.QUIZ, constraints };
  }

  // 3. Flashcards
  if (p.includes('flashcard') || p.includes('active recall')) {
    return { intent: INTENT_TYPES.FLASHCARDS, constraints };
  }

  // 4. Notes & Study Plan & Revision
  if (p.includes('notes') || p.includes('cheat sheet') || p.includes('summary sheet')) {
    return { intent: INTENT_TYPES.NOTES, constraints };
  }

  if (p.includes('study plan') || p.includes('schedule') || p.includes('what should i study')) {
    return { intent: INTENT_TYPES.STUDY_PLAN, constraints };
  }

  if (p.includes('weak area') || p.includes('weak topic') || p.includes('where am i lagging')) {
    return { intent: INTENT_TYPES.WEAK_AREA_ANALYSIS, constraints };
  }

  if (p.includes('why is my answer wrong') || p.includes('explain wrong answer') || p.includes('incorrect answer')) {
    return { intent: INTENT_TYPES.EXPLAIN_WRONG_ANSWER, constraints };
  }

  if (p.includes('revision') || p.includes('review plan')) {
    return { intent: INTENT_TYPES.REVISION, constraints };
  }

  // 5. Follow-ups
  if (p === 'give me an example' || p === 'give example' || p.includes('give an example') || p.includes('explain it simply') || p.includes('explain it') || p === 'solve this') {
    return { intent: INTENT_TYPES.FOLLOW_UP, constraints };
  }

  // 6. Math & Step-by-Step Solution
  if (p.includes('step by step') || p.includes('solve') || p.match(/[\d=+\-*/^]/)) {
    if (p.includes('solve') || p.includes('calculate') || p.includes('find x')) {
      return { intent: INTENT_TYPES.SOLVE_QUESTION, constraints };
    }
  }

  // 7. Formula & Comparison
  if (p.includes('formula') || p.includes('equation')) {
    return { intent: INTENT_TYPES.FORMULA, constraints };
  }

  if (p.includes('compare') || p.includes('difference between') || p.includes('versus') || p.includes('vs')) {
    return { intent: INTENT_TYPES.COMPARE, constraints };
  }

  if (p.includes('analogy') || p.includes('like a')) {
    return { intent: INTENT_TYPES.ANALOGY, constraints };
  }

  if (p.includes('example')) {
    return { intent: INTENT_TYPES.EXAMPLE, constraints };
  }

  // 8. Academic Definitions vs General Questions
  if (p.startsWith('define') || p.includes('definition of') || p.includes('only definition')) {
    return { intent: INTENT_TYPES.DEFINITION, constraints };
  }

  if (constraints.isBeginner) {
    return { intent: INTENT_TYPES.BEGINNER_EXPLANATION, constraints };
  }

  if (constraints.isDetailed) {
    return { intent: INTENT_TYPES.DETAILED_EXPLANATION, constraints };
  }

  if (p.startsWith('explain') || p.includes('how does') || p.includes('understand')) {
    return { intent: INTENT_TYPES.EXPLANATION, constraints };
  }

  return { intent: INTENT_TYPES.GENERAL_QUESTION, constraints };
};
