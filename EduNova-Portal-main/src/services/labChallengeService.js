/**
 * Lab Challenge Service for EduNova Immersive Learning Platform.
 * Generates Daily Lab Challenges and adaptive mistake-based challenges.
 */

export const DAILY_CHALLENGES = {
  school: {
    id: 'daily-school-01',
    title: 'Daily Optics Challenge: The 50cm Target',
    labId: 'optics-lens-lab',
    subject: 'Physics',
    difficulty: 'Intermediate',
    targetObjective: 'Adjust object distance to form an inverted image at exactly v = 30.0 cm for f = 15 cm.',
    targetValue: 30.0,
    timeLimitSec: 300,
    rewardXP: 200,
    badge: 'Optics Calibration Master'
  },
  college: {
    id: 'daily-college-01',
    title: 'Daily CSE Challenge: AVL Single Rotation',
    labId: 'cs-data-structures-trees',
    subject: 'Data Structures',
    difficulty: 'Advanced',
    targetObjective: 'Insert keys [30, 20, 10] and trigger a single Right rotation to rebalance the AVL root.',
    targetValue: 'Right Rotation',
    timeLimitSec: 300,
    rewardXP: 250,
    badge: 'AVL Tree Architect'
  },
  exam: {
    id: 'daily-exam-01',
    title: 'Daily JEE Challenge: Target Trajectory Landing',
    labId: 'exam-jee-physics-projectile',
    subject: 'Physics',
    difficulty: 'Expert',
    targetObjective: 'Launch the projectile to strike the target at Range x = 50.0 m with velocity 30 m/s.',
    targetValue: 50.0,
    timeLimitSec: 240,
    rewardXP: 300,
    badge: 'Precision Kinematics'
  },
  skills: {
    id: 'daily-skills-01',
    title: 'Daily Skills Challenge: 200 OK REST API Flow',
    labId: 'skills-fullstack-api',
    subject: 'Full Stack Development',
    difficulty: 'Intermediate',
    targetObjective: 'Configure a valid GET request with Bearer authorization to return a 200 OK payload in under 25ms.',
    targetValue: 200,
    timeLimitSec: 300,
    rewardXP: 200,
    badge: 'REST API Commander'
  }
};

/**
 * Get Daily Challenge for education type
 */
export const getDailyChallenge = (educationType = 'college') => {
  return DAILY_CHALLENGES[educationType] || DAILY_CHALLENGES.college;
};

/**
 * Generate Adaptive Challenge based on weak areas
 */
export const generateAdaptiveChallenge = (subject, topic, skillLevel = 'Intermediate') => {
  return {
    id: `adaptive_${Date.now()}`,
    title: `Sage Adaptive Challenge: ${topic || subject} Masterclass`,
    subject,
    difficulty: skillLevel,
    targetObjective: `Analyze parameters and optimize results for ${topic || subject} to strengthen recent weak concepts.`,
    rewardXP: 250,
    isAdaptive: true
  };
};

export default {
  DAILY_CHALLENGES,
  getDailyChallenge,
  generateAdaptiveChallenge
};
