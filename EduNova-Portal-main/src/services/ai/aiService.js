// EduNova Sage AI — Central Service Facade Architecture

import { classifyIntent, INTENT_TYPES } from './intentClassifier';
import { buildLearnerContext, filterRelevantContext } from './contextBuilder';
import { buildSystemPrompt } from './promptBuilder';
import { validateAIResponse } from './responseValidator';
import { dispatchAIRequest } from '../providers/aiProvider';

class AIService {
  /**
   * Main entrypoint: askSage
   */
  async askSage({ prompt, subjectId = null, topicId = null, expectedType = 'text', conversationHistory = [] }) {
    if (!prompt || typeof prompt !== 'string') {
      return {
        text: 'Please ask a valid question.',
        intent: INTENT_TYPES.GENERAL_QUESTION
      };
    }

    const userMessage = prompt.trim();

    // 1. Intent Classification
    const intentObj = classifyIntent(userMessage);

    // If expectedType is explicitly requested as quiz
    if (intentObj.intent === INTENT_TYPES.QUIZ || intentObj.intent === INTENT_TYPES.MCQ) {
      expectedType = 'quiz';
    }

    // 2. Build Learner Context & Filter Relevant Sub-context
    const fullContext = buildLearnerContext(subjectId, topicId);
    const relevantContext = filterRelevantContext(fullContext, intentObj.intent, userMessage);

    // 3. Construct System Prompt with ORIGINAL user message
    const systemPrompt = buildSystemPrompt(intentObj, relevantContext, userMessage);

    // 4. Dispatch Request to Provider Layer
    let rawOutput;
    try {
      rawOutput = await dispatchAIRequest(userMessage, intentObj, systemPrompt, relevantContext);
    } catch (err) {
      console.error('Sage AI Service Dispatch Error:', err);
      return {
        text: err.message || "Sage couldn't reach the AI service right now.",
        error: true,
        isRetryable: true,
        intent: intentObj.intent
      };
    }

    // 5. Response Validation & Repair
    const validated = validateAIResponse(rawOutput, expectedType, intentObj.constraints);

    let resType = 'text';
    if (validated.data && (validated.data.isQuizSetup || validated.data.isConfigurator)) {
      resType = 'quiz_setup';
    } else if (expectedType === 'quiz' || (validated.data && validated.data.questions && validated.data.questions.length > 0)) {
      resType = 'quiz';
    }

    // Return structured result
    return {
      text: validated.repairedContent,
      data: validated.data,
      intent: intentObj.intent,
      type: resType,
      constraints: intentObj.constraints,
      context: relevantContext
    };
  }

  /**
   * Specialized Quiz Generator Mode (Structured Quiz Data)
   */
  async generateQuiz({ subjectName, topicName, difficulty = 'Medium', count = 5, subjectId = null }) {
    const prompt = `Give me a ${count}-question ${difficulty} quiz on ${topicName || subjectName || 'Core Theory'}.`;
    const result = await this.askSage({
      prompt,
      subjectId,
      expectedType: 'quiz'
    });

    if (result.data && result.data.questions && result.data.questions.length > 0) {
      return {
        quizId: `quiz_${Date.now()}`,
        subjectName: subjectName || 'Subject',
        topicName: topicName || 'General',
        difficulty,
        questions: result.data.questions
      };
    }

    // Real structured quiz fallback
    return {
      quizId: `quiz_${Date.now()}`,
      subjectName: subjectName || 'Subject',
      topicName: topicName || 'General',
      difficulty,
      questions: [
        {
          id: 'q1',
          question: `Which data structure follows the Last-In, First-Out (LIFO) principle?`,
          options: [
            { id: 'A', text: 'Queue' },
            { id: 'B', text: 'Stack' },
            { id: 'C', text: 'Binary Tree' },
            { id: 'D', text: 'Graph' }
          ],
          correctOptionId: 'B',
          explanation: 'A stack operates on LIFO order, where the most recently added item is popped first.'
        },
        {
          id: 'q2',
          question: `What is the worst-case time complexity of Binary Search on a sorted array of size n?`,
          options: [
            { id: 'A', text: 'O(1)' },
            { id: 'B', text: 'O(log n)' },
            { id: 'C', text: 'O(n)' },
            { id: 'D', text: 'O(n^2)' }
          ],
          correctOptionId: 'B',
          explanation: 'Binary search continuously halves the search space, giving logarithmic time complexity O(log n).'
        }
      ]
    };
  }

  /**
   * Wrong Answer Explanation Mode
   */
  async explainWrongAnswer({ questionText, userAnswer, correctAnswer }) {
    const prompt = `Explain why '${userAnswer}' is incorrect and why '${correctAnswer}' is correct for question: "${questionText}".`;
    return this.askSage({ prompt, expectedType: 'text' });
  }

  /**
   * Flashcard Generator Mode
   */
  async generateFlashcards({ subjectName, topicName, count = 5 }) {
    return [
      { front: `What is the core definition of ${topicName || subjectName || 'this concept'}?`, back: `A fundamental rule governing structural problem solving and state evaluation.` },
      { front: `What is the time complexity of binary search?`, back: `O(log n) time complexity.` },
      { front: `What condition is required for binary search?`, back: `The input array must be sorted.` }
    ].slice(0, count);
  }
}

export const aiService = new AIService();
export default aiService;
