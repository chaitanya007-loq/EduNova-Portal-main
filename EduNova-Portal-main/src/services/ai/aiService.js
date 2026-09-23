import apiClient from '../../lib/apiClient';

class AIService {
  async askSage({ prompt, conversationId = null }) {
    const response = await apiClient.post('/ai/chat', {
      message: prompt,
      conversationId,
    });
    return {
      text: response.data.reply,
      conversationId: response.data.conversationId,
      type: 'text',
    };
  }

  async getHistory() {
    const response = await apiClient.get('/ai/history');
    return response.data;
  }

  /**
   * Specialized Quiz Generator Mode (Structured Quiz Data)
   */
  async generateQuiz({ subjectName, topicName, difficulty = 'Medium', count = 5, subjectId = null }) {
    const prompt = `Give me a ${count}-question ${difficulty} quiz on ${topicName || subjectName || 'Core Theory'}.`;
    const response = await apiClient.post('/ai/generate-quiz', {
      subject: subjectName,
      topic: topicName,
      difficulty: difficulty.toUpperCase(),
      questionCount: count,
    });
    return response.data;
  }

  /**
   * Wrong Answer Explanation Mode
   */
  async explainWrongAnswer({ questionText, userAnswer, correctAnswer }) {
    const prompt = `Explain why '${userAnswer}' is incorrect and why '${correctAnswer}' is correct for question: "${questionText}".`;
    return this.askSage({ prompt });
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
