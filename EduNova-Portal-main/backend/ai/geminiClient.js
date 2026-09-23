/**
 * Sage AI — Google Gemini Service Adapter
 * 
 * Powered by Gemini 2.5 Flash via @google/generative-ai.
 * Supports system instructions, multi-turn chat memory, and structured JSON generation.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiClient {
  _getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    const isRealApiKey = apiKey && apiKey !== 'your_gemini_api_key_here' && !apiKey.includes('your_');
    if (isRealApiKey) {
      return new GoogleGenerativeAI(apiKey);
    }
    return null;
  }

  /**
   * Multi-turn conversational chat with system instruction memory
   * @param {Object} params
   * @param {string} params.systemInstruction
   * @param {Array<{ role: 'user' | 'model', parts: string | Array<{ text: string }> }>} params.history
   * @param {string} params.message
   */
  async generateChatReply({ systemInstruction, history = [], message }) {
    if (!message || !message.trim()) {
      throw new Error('User message is required');
    }

    const genAI = this._getGenAI();
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction || undefined,
        });

        // Format history for Gemini SDK: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
        const formattedHistory = history.map((item) => ({
          role: item.role === 'assistant' ? 'model' : item.role,
          parts: Array.isArray(item.parts)
            ? item.parts
            : [{ text: typeof item.parts === 'string' ? item.parts : item.content || '' }],
        }));

        const chat = model.startChat({
          history: formattedHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
      } catch (err) {
        console.warn(`[Gemini API Warning] ${err.message}. Falling back to Socratic simulation engine.`);
      }
    }

    // High-Quality Socratic Simulation Engine (for dev/offline without active Google Cloud billing)
    return this._mockSocraticReply(message);
  }

  /**
   * Generates strict structured output from Gemini
   * @param {Object} params
   * @param {string} params.prompt
   * @param {string} params.systemInstruction
   */
  async generateStructuredContent({ prompt, systemInstruction }) {
    const genAI = this._getGenAI();
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction || undefined,
          generationConfig: {
            responseMimeType: 'application/json',
          },
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (err) {
        console.warn(`[Gemini Structured API Warning] ${err.message}. Generating curriculum simulation.`);
      }
    }

    return null;
  }

  _mockSocraticReply(message) {
    const lower = message.toLowerCase();

    if (lower.includes('recursion') || lower.includes('recursive')) {
      return `That's a classic Computer Science pillar! 

Before writing any recursive lines, what do you think would happen if a function keeps calling itself infinitely?

What is the single most important condition every recursive function must check first before doing any further work? Think about what stops the chain.`;
    }

    if (lower.includes('derivative') || lower.includes('calculus')) {
      return `Let's visualize this geometrically! 

Imagine you are looking at a curved position-time graph of a moving rocket. 
What does the slope of the secant line between two close time points tell you, and what happens to that slope as the time interval shrinks to near zero?`;
    }

    if (lower.includes('react') || lower.includes('state') || lower.includes('hook')) {
      return `Great question on modern React architecture! 

When a component's state updates, does React immediately re-render the entire browser DOM, or does it do something else first? 

What role does the Virtual DOM reconciliation process play here?`;
    }

    return `That's a thoughtful question! 

To help us break this down Socratically: what is the fundamental principle you think underpins this problem? 

If you had to formulate a first step or hypothesis before calculating or coding, where would you start?`;
  }
}

module.exports = new GeminiClient();
