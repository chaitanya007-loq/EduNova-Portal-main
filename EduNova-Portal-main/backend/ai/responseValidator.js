/**
 * Sage AI — Gemini Response Validator
 * 
 * Cleans, sanitizes, and validates LLM responses against strict Zod schemas
 * to ensure bulletproof frontend parsing and guard against hallucinated schemas.
 */

const { z } = require('zod');

// ── Zod Schemas ──────────────────────────────────────────────────────────────

const quizQuestionSchema = z.object({
  id: z.coerce.number().default(1),
  question: z.string().min(3, 'Question must not be empty'),
  codeSnippet: z.string().nullable().optional(),
  options: z.array(z.string()).min(2).max(6),
  correctIndex: z.coerce.number().int().min(0),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(5),
  bloomTaxonomy: z.string().optional().default('APPLY'),
});

const quizSchema = z.object({
  title: z.string().min(3),
  subject: z.string().min(2),
  topic: z.string().min(2),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('INTERMEDIATE'),
  totalQuestions: z.coerce.number().int().positive(),
  questions: z.array(quizQuestionSchema).min(1),
});

const recoveryAreaSchema = z.object({
  topic: z.string(),
  coreMisconception: z.string(),
  actionableSteps: z.array(z.string()).min(1),
  practiceProblem: z.string().optional(),
  estimatedMinutes: z.coerce.number().default(30),
});

const dayPlanSchema = z.object({
  day: z.coerce.number().int().positive(),
  focus: z.string(),
  tasks: z.array(z.string()).min(1),
  xpReward: z.coerce.number().default(50),
});

const weakTopicPlanSchema = z.object({
  studentName: z.string(),
  diagnosticSummary: z.string().min(5),
  targetRecoveryAreas: z.array(recoveryAreaSchema).min(1),
  threeDayPlan: z.array(dayPlanSchema).min(1),
});

// ── Utility: Sanitize and parse raw LLM text into JSON ────────────────────────

function extractJson(rawText) {
  if (typeof rawText !== 'string') {
    throw new Error('Expected raw text response from LLM');
  }

  // 1. Strip markdown code fences (```json ... ``` or ``` ... ```)
  let clean = rawText
    .replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1')
    .trim();

  // 2. Find outermost brackets if surrounded by extraneous text
  const firstCurly = clean.indexOf('{');
  const lastCurly = clean.lastIndexOf('}');
  if (firstCurly !== -1 && lastCurly !== -1) {
    clean = clean.substring(firstCurly, lastCurly + 1);
  }

  // 3. Remove trailing commas before } or ]
  clean = clean
    .replace(/,\s*([\]}])/g, '$1')
    .trim();

  try {
    return JSON.parse(clean);
  } catch (err) {
    throw new Error(`Failed to parse AI output as valid JSON: ${err.message}. Raw: ${clean.slice(0, 100)}...`);
  }
}

// ── Validation Functions ─────────────────────────────────────────────────────

/**
 * Validates and normalizes dynamic quiz payload
 * @param {string|Object} rawResponse 
 * @returns {z.infer<typeof quizSchema>}
 */
function validateQuizResponse(rawResponse) {
  const parsed = typeof rawResponse === 'string' ? extractJson(rawResponse) : rawResponse;
  const result = quizSchema.safeParse(parsed);

  if (!result.success) {
    console.error('[Quiz Validation Error]', result.error.issues);
    throw new Error(
      `AI generated an invalid quiz structure: ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
    );
  }

  // Ensure correctIndex and correctAnswer match accurately
  const validated = result.data;
  validated.questions.forEach((q) => {
    if (q.correctIndex >= q.options.length) {
      q.correctIndex = 0;
    }
    if (!q.correctAnswer && q.options[q.correctIndex]) {
      q.correctAnswer = q.options[q.correctIndex];
    }
  });

  return validated;
}

/**
 * Validates weak topic remediation plan payload
 * @param {string|Object} rawResponse 
 * @returns {z.infer<typeof weakTopicPlanSchema>}
 */
function validateWeakTopicPlanResponse(rawResponse) {
  const parsed = typeof rawResponse === 'string' ? extractJson(rawResponse) : rawResponse;
  const result = weakTopicPlanSchema.safeParse(parsed);

  if (!result.success) {
    console.error('[Weak Topic Plan Validation Error]', result.error.issues);
    throw new Error(
      `AI generated an invalid study plan structure: ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
    );
  }

  return result.data;
}

module.exports = {
  extractJson,
  validateQuizResponse,
  validateWeakTopicPlanResponse,
  quizSchema,
  weakTopicPlanSchema,
};
