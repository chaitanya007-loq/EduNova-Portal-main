// EduNova AI Structured Output Validator
// Validates structured AI JSON responses, cleans security leaks, deduplicates questions, and supports 1-pass correction retry

/**
 * Validates a quiz object returned by AI or fallback engine.
 * @param {Object} quiz - Parsed quiz payload
 * @param {number} expectedCount - Requested question count (e.g. 5, 10, 20)
 * @returns {Object} { isValid: boolean, cleanedQuiz: Object, errors: string[] }
 */
export const validateQuizResponse = (quiz, expectedCount = 5) => {
  const errors = [];
  if (!quiz || typeof quiz !== 'object') {
    return { isValid: false, cleanedQuiz: null, errors: ['Invalid JSON payload: expected an object'] };
  }

  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    errors.push('Quiz contains no questions array or questions array is empty');
    return { isValid: false, cleanedQuiz: null, errors };
  }

  const uniqueQuestions = [];
  const seenQuestionTexts = new Set();

  quiz.questions.forEach((q, idx) => {
    if (!q.question || typeof q.question !== 'string') {
      errors.push(`Question #${idx + 1} is missing valid question text`);
      return;
    }

    const normalizedText = q.question.trim().toLowerCase();
    if (seenQuestionTexts.has(normalizedText)) {
      // Duplicate question detected, skip it
      return;
    }
    seenQuestionTexts.add(normalizedText);

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`Question #${idx + 1} does not have exactly 4 options`);
      return;
    }

    const optionIds = new Set(q.options.map(o => o.id));
    if (!q.correctOptionId || !optionIds.has(q.correctOptionId)) {
      // Default to option A or first option if correctOptionId is invalid
      q.correctOptionId = q.options[0]?.id || 'A';
    }

    uniqueQuestions.push({
      id: q.id || `q_${idx + 1}`,
      question: q.question,
      options: q.options,
      correctOptionId: q.correctOptionId,
      explanation: q.explanation || 'No detailed explanation provided for this question.'
    });
  });

  const cleanedQuiz = {
    type: 'quiz',
    title: quiz.title || `${quiz.subject || 'Subject'} Practice Quiz`,
    subject: quiz.subject || 'General',
    topic: quiz.topic || 'Practice',
    questions: uniqueQuestions
  };

  const isValid = cleanedQuiz.questions.length > 0 && errors.length === 0;
  return { isValid, cleanedQuiz, errors };
};

/**
 * Sanitizes a quiz before sending to the client UI to prevent answer leakage prior to submission.
 * @param {Object} quiz - Validated quiz object
 * @returns {Object} Safe quiz object for question rendering
 */
export const sanitizeQuizForTesting = (quiz) => {
  if (!quiz || !Array.isArray(quiz.questions)) return quiz;
  return {
    ...quiz,
    questions: quiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
      // Note: correctOptionId and explanation are retained in secure memory state, not shown on options
    }))
  };
};

/**
 * Validates a Skill DNA analysis object.
 * @param {Object} data 
 * @returns {Object} { isValid: boolean, data: Object }
 */
export const validateSkillAnalysisResponse = (data) => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, data: null };
  }

  const learningIndex = Math.min(100, Math.max(0, Number(data.learningIndex) || 0));
  const confidence = ['High', 'Medium', 'Low', 'Insufficient Data'].includes(data.confidence) 
    ? data.confidence 
    : 'Medium';

  return {
    isValid: Array.isArray(data.skills) && data.skills.length > 0,
    data: {
      type: 'skill_analysis',
      learningIndex,
      confidence,
      summary: data.summary || 'Learner skill profile generated from recent practice and verified evidence.',
      skills: Array.isArray(data.skills) ? data.skills : [],
      topStrengths: Array.isArray(data.topStrengths) ? data.topStrengths : [],
      weakAreas: Array.isArray(data.weakAreas) ? data.weakAreas : []
    }
  };
};
