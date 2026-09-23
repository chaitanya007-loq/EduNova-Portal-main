/**
 * Sage AI — Google Gemini Provider (backend/ai/geminiProvider.js)
 * 
 * Powered by Google Gemini (Gemini 2.5 Flash via @google/generative-ai)
 * Features:
 * - Real streaming generation (SSE / chunk callback)
 * - Structured JSON generation with single-attempt retry logic on parse failure
 * - Conversational multi-turn memory
 * - Resilient fallback simulation if API key is unconfigured or rate-limited
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiProvider {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.isRealKey = Boolean(
      this.apiKey &&
      this.apiKey !== 'your_gemini_api_key_here' &&
      !this.apiKey.includes('your_') &&
      this.apiKey.trim().length > 10
    );

    this.genAI = this.isRealKey ? new GoogleGenerativeAI(this.apiKey) : null;
  }

  /**
   * Get an instance of the generative model with optional system instructions
   */
  _getModel(systemInstruction, generationConfig = {}) {
    if (!this.genAI) return null;
    return this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      generationConfig,
    });
  }

  /**
   * Streaming response generator for Socratic tutoring
   * @param {Object} params
   * @param {string} params.systemInstruction
   * @param {Array} params.history
   * @param {string} params.message
   * @param {Function} params.onChunk (chunkText: string) => void
   * @returns {Promise<{ fullText: string, model: string }>}
   */
  async generateStream({ systemInstruction, history = [], message, onChunk = () => {} }) {
    if (!message || !message.trim()) {
      throw new Error('Message is required');
    }

    if (this.genAI) {
      try {
        const model = this._getModel(systemInstruction);
        const formattedHistory = history.map((item) => ({
          role: item.role === 'assistant' ? 'model' : item.role,
          parts: Array.isArray(item.parts)
            ? item.parts
            : [{ text: typeof item.parts === 'string' ? item.parts : item.content || '' }],
        }));

        const chat = model.startChat({ history: formattedHistory });
        const result = await chat.sendMessageStream(message);

        let fullText = '';
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullText += chunkText;
          onChunk(chunkText);
        }

        return { fullText, model: this.modelName };
      } catch (err) {
        console.warn(`[Gemini Streaming Warning] ${err.message}. Falling back to Socratic simulation stream.`);
      }
    }

    // Fallback simulated Socratic stream
    return this._mockSocraticStream(message, onChunk);
  }

  /**
   * Structured JSON generation with single-attempt retry logic on parse failure
   * @param {Object} params
   * @param {string} params.prompt
   * @param {string} params.systemInstruction
   * @returns {Promise<Object>} parsed JSON object
   */
  async generateStructuredJson({ prompt, systemInstruction }) {
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    if (this.genAI) {
      // First attempt
      try {
        const model = this._getModel(systemInstruction, {
          responseMimeType: 'application/json',
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();
        return this._parseJsonSafely(rawText);
      } catch (firstErr) {
        console.warn(`[Gemini JSON Attempt 1 Failed] ${firstErr.message}. Retrying with strict schema instruction...`);

        // Single-attempt retry with reinforced format prompt
        try {
          const retryPrompt = `${prompt}\n\nIMPORTANT: The previous generation failed to parse as valid JSON. You MUST return ONLY a clean, valid RFC-8259 JSON object with no markdown fences, no backticks, and no conversational preamble.`;
          const model = this._getModel(systemInstruction, {
            responseMimeType: 'application/json',
          });

          const retryResult = await model.generateContent(retryPrompt);
          const retryResponse = await retryResult.response;
          const retryText = retryResponse.text();
          return this._parseJsonSafely(retryText);
        } catch (retryErr) {
          console.error(`[Gemini JSON Attempt 2 Failed] ${retryErr.message}.`);
        }
      }
    }

    return null;
  }

  /**
   * Standard single-turn chat completion
   */
  async generateChatReply({ systemInstruction, history = [], message }) {
    let fullReply = '';
    await this.generateStream({
      systemInstruction,
      history,
      message,
      onChunk: (chunk) => {
        fullReply += chunk;
      },
    });
    return fullReply;
  }

  /**
   * Extracts and parses JSON from raw LLM text
   */
  _parseJsonSafely(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      throw new Error('Empty response from model');
    }

    let clean = rawText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1').trim();
    const firstCurly = clean.indexOf('{');
    const lastCurly = clean.lastIndexOf('}');
    if (firstCurly !== -1 && lastCurly !== -1) {
      clean = clean.substring(firstCurly, lastCurly + 1);
    }
    clean = clean.replace(/,\s*([\]}])/g, '$1').trim();

    return JSON.parse(clean);
  }

  /**
   * High-fidelity simulated Socratic stream for local development / unconfigured keys
   */
  async _mockSocraticStream(message, onChunk) {
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('recursion') || lower.includes('recursive')) {
      reply = `That's a classic Computer Science pillar!\n\nBefore writing any recursive code, let's step back for a moment: what do you think would happen if a function keeps invoking itself infinitely?\n\nWhat is the single most essential check that every recursive function must perform first to safely terminate the chain?`;
    } else if (lower.includes('derivative') || lower.includes('calculus')) {
      reply = `Let's visualize this geometrically!\n\nImagine a position-versus-time graph of a spacecraft during launch. What does the slope of the secant line between two nearby timestamps tell you, and what happens to that rate of change as the time gap shrinks towards zero?`;
    } else if (lower.includes('react') || lower.includes('state') || lower.includes('hook')) {
      reply = `Great question on React architecture!\n\nWhen a state variable changes, does React immediately redraw the entire browser DOM, or does it compute differences using the Virtual DOM reconciliation tree first?\n\nHow does this preserve rendering performance?`;
    } else if (lower.includes('thermodynamics') || lower.includes('heat')) {
      reply = `Let's think about energy conservation!\n\nAccording to the First Law of Thermodynamics, energy cannot simply vanish. If you supply heat energy to an insulated gas cylinder with a movable piston, where does that energy go? (Hint: consider temperature and physical expansion).`;
    } else {
      reply = `That's an insightful concept to explore!\n\nTo help us unpack this systematically, what is the initial intuition or definition that comes to mind when you encounter this problem? Let's take it step by step.`;
    }

    // Deliver words in small chunks
    const words = reply.split(' ');
    let fullText = '';
    for (let i = 0; i < words.length; i += 3) {
      const slice = words.slice(i, i + 3).join(' ') + ' ';
      fullText += slice;
      onChunk(slice);
      await new Promise((resolve) => setTimeout(resolve, 35));
    }

    return { fullText: fullText.trim(), model: 'sage-socratic-engine' };
  }
}

module.exports = new GeminiProvider();
