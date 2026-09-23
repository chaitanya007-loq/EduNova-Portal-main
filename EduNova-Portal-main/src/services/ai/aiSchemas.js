// EduNova Structured AI Output Schemas
// Defines JSON structures for AI mode responses

export const AI_SCHEMAS = {
  QUIZ: {
    type: 'object',
    required: ['type', 'title', 'subject', 'topic', 'questions'],
    properties: {
      type: { type: 'string', enum: ['quiz'] },
      title: { type: 'string' },
      subject: { type: 'string' },
      topic: { type: 'string' },
      questions: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'question', 'options', 'correctOptionId', 'explanation'],
          properties: {
            id: { type: 'string' },
            question: { type: 'string' },
            options: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'text'],
                properties: {
                  id: { type: 'string' },
                  text: { type: 'string' }
                }
              }
            },
            correctOptionId: { type: 'string' },
            explanation: { type: 'string' }
          }
        }
      }
    }
  },

  SKILL_ANALYSIS: {
    type: 'object',
    required: ['type', 'learningIndex', 'confidence', 'summary', 'skills', 'topStrengths', 'weakAreas'],
    properties: {
      type: { type: 'string', enum: ['skill_analysis'] },
      learningIndex: { type: 'number' },
      confidence: { type: 'string', enum: ['High', 'Medium', 'Low', 'Insufficient Data'] },
      summary: { type: 'string' },
      skills: {
        type: 'array',
        items: {
          type: 'object',
          required: ['skill', 'score', 'confidence', 'evidenceCount', 'trend'],
          properties: {
            skill: { type: 'string' },
            score: { type: 'number' },
            confidence: { type: 'string' },
            evidenceCount: { type: 'number' },
            trend: { type: 'string' }
          }
        }
      },
      topStrengths: {
        type: 'array',
        items: {
          type: 'object',
          required: ['title', 'evidence', 'score'],
          properties: {
            title: { type: 'string' },
            evidence: { type: 'string' },
            score: { type: 'number' }
          }
        }
      },
      weakAreas: {
        type: 'array',
        items: {
          type: 'object',
          required: ['topic', 'mistakePattern', 'recommendedAction'],
          properties: {
            topic: { type: 'string' },
            mistakePattern: { type: 'string' },
            recommendedAction: { type: 'string' }
          }
        }
      }
    }
  },

  SKILL_GAP: {
    type: 'object',
    required: ['targetGoal', 'matchPercentage', 'acquiredSkills', 'missingSkills', 'actionPlan'],
    properties: {
      targetGoal: { type: 'string' },
      matchPercentage: { type: 'number' },
      acquiredSkills: { type: 'array', items: { type: 'string' } },
      missingSkills: {
        type: 'array',
        items: {
          type: 'object',
          required: ['skill', 'priority', 'prerequisite'],
          properties: {
            skill: { type: 'string' },
            priority: { type: 'string' },
            prerequisite: { type: 'string' }
          }
        }
      },
      actionPlan: { type: 'array', items: { type: 'string' } }
    }
  },

  ROADMAP: {
    type: 'object',
    required: ['title', 'targetGoal', 'phases'],
    properties: {
      title: { type: 'string' },
      targetGoal: { type: 'string' },
      phases: {
        type: 'array',
        items: {
          type: 'object',
          required: ['phaseNumber', 'title', 'duration', 'skills', 'topics', 'status'],
          properties: {
            phaseNumber: { type: 'number' },
            title: { type: 'string' },
            duration: { type: 'string' },
            skills: { type: 'array', items: { type: 'string' } },
            topics: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['completed', 'current', 'locked'] }
          }
        }
      }
    }
  }
};
