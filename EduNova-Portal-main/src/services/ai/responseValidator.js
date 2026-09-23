// EduNova Sage AI — Response Validator & Structural Repair Engine

export const validateAIResponse = (rawResponse, expectedType = 'text', constraints = {}) => {
  if (!rawResponse) {
    return {
      isValid: false,
      repairedContent: 'I apologize, but I could not generate a response. Please try asking again.',
      data: null
    };
  }

  // Handle plain string responses
  let text = typeof rawResponse === 'string' ? rawResponse : rawResponse.text || JSON.stringify(rawResponse);

  // Clean raw markdown wrappers if JSON was expected
  if (expectedType === 'json' || expectedType === 'quiz' || expectedType === 'flashcards') {
    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const parsed = JSON.parse(cleanJson);
      
      if (parsed && (parsed.isQuizSetup || parsed.isConfigurator)) {
        return {
          isValid: true,
          repairedContent: parsed.message || "Sure! Let's set up your quiz. 🎯 Which subject would you like to practice?",
          data: parsed
        };
      }

      // Validate Quiz structure
      if (expectedType === 'quiz') {
        const questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
        if (questions.length === 0) throw new Error('Empty quiz questions');

        const sanitizedQuestions = questions.map((q, idx) => ({
          id: q.id || `q_${idx + 1}`,
          question: q.question || 'Practice Question',
          options: Array.isArray(q.options) 
            ? q.options.map((opt, oIdx) => {
                if (typeof opt === 'object') return { id: opt.id || String.fromCharCode(65 + oIdx), text: opt.text || opt.label || '' };
                return { id: String.fromCharCode(65 + oIdx), text: String(opt) };
              })
            : [],
          correctOptionId: q.correctOptionId || q.correctAnswerId || q.correctAnswer || 'A',
          explanation: q.explanation || 'Review concept rules for verification.',
          difficulty: q.difficulty || 'Medium'
        }));

        return {
          isValid: true,
          repairedContent: text,
          data: { questions: sanitizedQuestions }
        };
      }

      return {
        isValid: true,
        repairedContent: text,
        data: parsed
      };
    } catch (err) {
      console.warn('JSON Validation failed, applying structural fallback:', err);
    }
  }

  // Enforce Line Count Constraints if specified
  if (constraints.exactLines) {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    if (lines.length > constraints.exactLines) {
      text = lines.slice(0, constraints.exactLines).join('\n');
    }
  }

  // Strip unneeded trailing pitch phrases like "Would you like me to..." if present
  text = text.replace(/Would you like me to (?:explain|generate|provide|create).*\?$/gi, '').trim();

  return {
    isValid: true,
    repairedContent: text,
    data: { text }
  };
};
