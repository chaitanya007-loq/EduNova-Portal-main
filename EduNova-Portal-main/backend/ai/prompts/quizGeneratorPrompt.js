/**
 * Sage AI — Strict JSON Quiz Generator Prompt
 * 
 * Generates dynamic, curriculum-aligned multiple-choice questions with answer keys,
 * distractor explanations, and Bloom's taxonomy tags.
 */

/**
 * Builds the prompt for generating a strict JSON quiz
 * @param {Object} params
 * @param {string} params.subject
 * @param {string} params.topic
 * @param {number} params.questionCount (5, 10, or 15)
 * @param {string} params.difficulty ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')
 * @param {string} params.learnerType
 * @param {string[]} params.weakTopics
 * @returns {string}
 */
function buildQuizPrompt({
  subject = 'Computer Science',
  topic = 'Algorithms',
  questionCount = 5,
  difficulty = 'INTERMEDIATE',
  learnerType = 'COLLEGE',
  weakTopics = [],
}) {
  const count = [5, 10, 15].includes(Number(questionCount)) ? Number(questionCount) : 5;
  const weakFocus =
    weakTopics.length > 0
      ? `Ensure at least 2 questions test or reinforce these learner weak topics: ${weakTopics.join(', ')}.`
      : '';

  return `Generate an assessment quiz for EduNova.
Target Audience: ${learnerType} student.
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Total Questions Required: Exactly ${count} questions.
${weakFocus}

STRICT OUTPUT REQUIREMENT:
You must respond ONLY with a raw, valid JSON object matching the schema below.
Do NOT prepend any markdown commentary, greetings, or conversational preamble outside the JSON block.

JSON SCHEMA:
{
  "title": "${subject}: ${topic} Mastery Quiz",
  "subject": "${subject}",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "totalQuestions": ${count},
  "questions": [
    {
      "id": 1,
      "question": "Concise, unambiguous question text",
      "codeSnippet": null,
      "options": [
        "Option text A",
        "Option text B",
        "Option text C",
        "Option text D"
      ],
      "correctIndex": 0,
      "correctAnswer": "Option text A",
      "explanation": "Clear explanation of why this answer is correct and why other choices fail.",
      "bloomTaxonomy": "APPLY"
    }
  ]
}

PEDAGOGICAL CRITERIA:
1. Each question must have exactly 4 plausible options.
2. The "correctIndex" MUST match the 0-indexed position of the "correctAnswer" in the "options" array.
3. Bloom Taxonomy tags: "REMEMBER", "UNDERSTAND", "APPLY", "ANALYZE", or "EVALUATE".
4. Include code snippets for programming topics where appropriate.`;
}

module.exports = { buildQuizPrompt };
