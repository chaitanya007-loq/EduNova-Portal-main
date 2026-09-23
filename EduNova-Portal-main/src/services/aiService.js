// EduNova Sage AI Service — Facade Re-export Module

import { aiService } from './ai/aiService';

export const askSageAI = async (prompt, conversationHistory = [], context = {}) => {
  return aiService.askSage({
    prompt,
    subjectId: context.subjectId,
    topicId: context.topicId,
    conversationHistory
  });
};

export const generateExplanation = async (subjectName, topicName, level = 'beginner') => {
  return aiService.askSage({ prompt: `Explain ${topicName} in ${subjectName} for a ${level} learner.` });
};

export const generateSummary = async (subjectName, topicName) => {
  return aiService.askSage({ prompt: `Summarize ${topicName} in ${subjectName} in 3 bullet points.` });
};

export const generateNotes = async (subjectName, topicName) => {
  return aiService.askSage({ prompt: `Give me complete structured revision notes for ${topicName} in ${subjectName}.` });
};

export const generateFlashcards = async (subjectName, topicName, count = 5) => {
  return aiService.generateFlashcards({ subjectName, topicName, count });
};

export const generateQuiz = async (subjectName, topicName, difficulty = 'Medium', count = 5) => {
  return aiService.generateQuiz({ subjectName, topicName, difficulty, count });
};

export const generateMCQs = async (subjectName, topicName, count = 10) => {
  return aiService.askSage({ prompt: `Give me exactly ${count} MCQs on ${topicName || subjectName}.` });
};

export const generatePracticeQuestions = async (subjectName, topicName) => {
  return aiService.askSage({ prompt: `Give me 5 exam practice questions for ${topicName || subjectName}.` });
};

export const generateFormulaSheet = async (subjectName, topicName) => {
  return aiService.askSage({ prompt: `Create a formula sheet for ${topicName || subjectName}.` });
};

export const generateStudyPlan = async (goal, availableHoursPerWeek = 8) => {
  const hrs = ((availableHoursPerWeek || 8) / 5).toFixed(1);
  return [
    { day: 'Monday', focus: 'Core Theory & Concepts', hours: hrs, topic: `${goal} Foundations` },
    { day: 'Tuesday', focus: 'Interactive Simulation & Labs', hours: hrs, topic: `Spatial Model & Practice` },
    { day: 'Wednesday', focus: 'Code Practice & Quizzes', hours: hrs, topic: `Knowledge Check Assessment` },
    { day: 'Thursday', focus: 'Peer Skill Exchange & Swap', hours: hrs, topic: `Mentorship Swap Chat` },
    { day: 'Friday', focus: 'Synthesis & Progress Analytics', hours: hrs, topic: `Skill DNA & Weak Area Review` }
  ];
};

export const generateRevisionPlan = async (subjectName, weakTopics = []) => {
  return aiService.askSage({ prompt: `Create a targeted revision plan for weak topics in ${subjectName}: ${weakTopics.join(', ')}.` });
};

export const generateExamples = async (subjectName, topicName) => {
  return aiService.askSage({ prompt: `Give me 3 solved step-by-step examples for ${topicName} in ${subjectName}.` });
};

export const generateExamQuestions = async (subjectName) => {
  return aiService.askSage({ prompt: `Give me important high-yield exam questions for ${subjectName}.` });
};

export const analyzeWeakTopics = async (subjectName) => {
  return aiService.askSage({ prompt: `Analyze my weak areas in ${subjectName} and give actionable remediation.` });
};

export const generateSubjectRecommendations = async (subjectName) => {
  return aiService.askSage({ prompt: `Recommend next steps for ${subjectName}.` });
};

export const explainWrongAnswer = async (questionText, userAnswer, correctAnswer) => {
  return aiService.explainWrongAnswer({ questionText, userAnswer, correctAnswer });
};

export default aiService;
