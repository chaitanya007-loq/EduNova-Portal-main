/**
 * Sage AI — Weak Topic Remediation Plan Prompt
 * 
 * Formulates structured recovery plans based on diagnostic quiz errors and conceptual gaps.
 */

/**
 * Builds the prompt for generating a personalized study recovery plan
 * @param {Object} params
 * @param {string} params.studentName
 * @param {string} params.learnerType
 * @param {string[]} params.weakTopics
 * @param {Array<{ question: string, studentAnswer: string, correctAnswer: string, topic?: string }>} params.recentErrors
 * @returns {string}
 */
function buildWeakTopicPlanPrompt({
  studentName = 'Learner',
  learnerType = 'COLLEGE',
  weakTopics = [],
  recentErrors = [],
}) {
  const errorsSummary = recentErrors.length > 0
    ? recentErrors
        .map(
          (err, idx) =>
            `${idx + 1}. [${err.topic || 'General'}] Question: "${err.question}" | Student answered: "${err.studentAnswer}" | Correct: "${err.correctAnswer}"`
        )
        .join('\n')
    : 'No recent quiz errors logged; focusing on identified curriculum weak spots.';

  return `You are Sage AI's Remediation Specialist at EduNova.
Formulate a targeted recovery study plan for ${studentName} (${learnerType} level).

=== STUDENT DIAGNOSTICS ===
- Flagged Weak Topics: ${weakTopics.join(', ') || 'Core fundamentals'}
- Recent Quiz Misconceptions:
${errorsSummary}

STRICT OUTPUT REQUIREMENT:
Respond ONLY with a valid JSON object matching the schema below:

{
  "studentName": "${studentName}",
  "diagnosticSummary": "A concise, empathetic synthesis of what the student is struggling with and why.",
  "targetRecoveryAreas": [
    {
      "topic": "Topic name",
      "coreMisconception": "Explanation of the root mental model mistake",
      "actionableSteps": [
        "Step 1 to rebuild intuition",
        "Step 2 to practice"
      ],
      "practiceProblem": "A concrete diagnostic practice problem to test mastery",
      "estimatedMinutes": 30
    }
  ],
  "threeDayPlan": [
    {
      "day": 1,
      "focus": "Conceptual Foundation",
      "tasks": ["Read core chapter notes", "Complete 3 flashcards"],
      "xpReward": 50
    },
    {
      "day": 2,
      "focus": "Guided Application",
      "tasks": ["Solve 5 targeted practice problems with Sage AI"],
      "xpReward": 75
    },
    {
      "day": 3,
      "focus": "Mastery Verification",
      "tasks": ["Retake topic diagnostic quiz with 90%+ target"],
      "xpReward": 100
    }
  ]
}`;
}

module.exports = { buildWeakTopicPlanPrompt };
