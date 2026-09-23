// EduNova Subject Quiz Service

import { subjectService } from './subjectService';
import { progressService } from './progressService';

class QuizService {
  constructor() {
    this.quizAttempts = this.loadAttempts();
  }

  loadAttempts() {
    try {
      const saved = localStorage.getItem('edunova_quiz_attempts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  saveAttempts(attempts) {
    this.quizAttempts = attempts;
    try {
      localStorage.setItem('edunova_quiz_attempts', JSON.stringify(attempts));
    } catch (e) {
      console.error(e);
    }
    return this.quizAttempts;
  }

  generateSubjectQuiz(subjectId, topicName = 'General', difficulty = 'Medium', count = 5) {
    const subject = subjectService.getSubjectById(subjectId);
    
    const sName = (subject?.name || '').toLowerCase();
    const isSchool = sName.includes('science') || sName.includes('physics') || sName.includes('chemistry') || sName.includes('math') || sName.includes('social') || (subject?.grade && subject.grade.includes('Class'));

    let questions = [];

    if (isSchool) {
      questions = [
        {
          id: 'q1',
          question: `According to Ohm's Law, what is the mathematical formula for Potential Difference (V)?`,
          options: ['V = I × R', 'V = I / R', 'V = I + R', 'V = R / I'],
          correctAnswer: 0,
          explanation: 'Ohm\'s Law defines potential difference as V = IR (Current × Resistance).'
        },
        {
          id: 'q2',
          question: `What is the focal length (f) of a concave mirror having a radius of curvature R = 30 cm?`,
          options: ['-15 cm', '+15 cm', '-30 cm', '+60 cm'],
          correctAnswer: 0,
          explanation: 'Focal length is given by f = R/2. For a concave mirror, f is negative by sign convention.'
        },
        {
          id: 'q3',
          question: `Which gas is liberated when dilute Hydrochloric Acid (HCl) reacts with active Zinc metal?`,
          options: ['Hydrogen Gas (H₂)', 'Oxygen Gas (O₂)', 'Carbon Dioxide (CO₂)', 'Nitrogen Gas (N₂)'],
          correctAnswer: 0,
          explanation: 'Metals react with acids to form a salt and release Hydrogen gas.'
        },
        {
          id: 'q4',
          question: `What is the discriminant formula (D) for the quadratic equation ax² + bx + c = 0?`,
          options: ['D = b² - 4ac', 'D = b + 4ac', 'D = a² - 4bc', 'D = b² + 4ac'],
          correctAnswer: 0,
          explanation: 'Discriminant D = b² - 4ac determines the nature of roots for a quadratic equation.'
        },
        {
          id: 'q5',
          question: `What is the value of the fundamental trigonometric identity sin²θ + cos²θ?`,
          options: ['1', '0', '2', 'tan θ'],
          correctAnswer: 0,
          explanation: 'sin²θ + cos²θ = 1 is the fundamental Pythagorean identity in trigonometry.'
        }
      ];
    } else {
      questions = [
        {
          id: 'q1',
          question: `Which data structure operates on a Last-In, First-Out (LIFO) order?`,
          options: ['Stack', 'Queue', 'Array', 'Linked List'],
          correctAnswer: 0,
          explanation: 'A Stack processes the most recently pushed item first (LIFO).'
        },
        {
          id: 'q2',
          question: `What is the worst-case time complexity of Binary Search on a sorted array of size n?`,
          options: ['O(log n)', 'O(n)', 'O(n^2)', 'O(1)'],
          correctAnswer: 0,
          explanation: 'Binary Search repeatedly cuts the search space in half, yielding O(log n) time complexity.'
        },
        {
          id: 'q3',
          question: `What does Atomicity guarantee in DBMS ACID properties?`,
          options: [
            'All operations in a transaction complete fully or roll back completely',
            'Transactions run at high speed',
            'Data is stored in atomic units',
            'No locks are acquired'
          ],
          correctAnswer: 0,
          explanation: 'Atomicity ensures an all-or-nothing execution for database transactions.'
        },
        {
          id: 'q4',
          question: `In Object-Oriented Programming, what is Encapsulation?`,
          options: [
            'Bundling data & methods into a single unit and restricting direct access',
            'Inheriting attributes from superclass',
            'Method overloading',
            'Compiling code to bytecode'
          ],
          correctAnswer: 0,
          explanation: 'Encapsulation hides internal object state and requires all interaction to occur via methods.'
        },
        {
          id: 'q5',
          question: `Which normal form eliminates partial dependencies on candidate keys?`,
          options: ['2NF', '1NF', '3NF', 'BCNF'],
          correctAnswer: 0,
          explanation: 'Second Normal Form (2NF) requires 1NF and removes partial functional dependencies.'
        }
      ];
    }

    return {
      quizId: `quiz_${subjectId}_${Date.now()}`,
      subjectId,
      subjectName: subject.name,
      topicName,
      difficulty,
      questions: questions.slice(0, count)
    };
  }

  recordQuizResult(subjectId, topicName, score, total, userAnswers, userId = null) {
    const percentage = Math.round((score / total) * 100);
    const attempt = {
      id: `att_${Date.now()}`,
      subjectId,
      topicName,
      score,
      total,
      percentage,
      date: new Date().toLocaleDateString()
    };
    
    const updated = [attempt, ...this.quizAttempts];
    this.saveAttempts(updated);

    // If score is low (< 65%), update subject weak area in subjectService
    if (percentage < 65) {
      subjectService.updateSubjectConfig(subjectId, { weakTopic: topicName });
    }

    // Trigger dynamic user progress gauge update
    try {
      progressService.recordPracticeQuiz(userId, { scorePercentage: percentage });
    } catch (e) {
      console.warn('Failed to record practice quiz progress:', e);
    }

    return attempt;
  }

  getQuizHistory(subjectId = null) {
    if (subjectId) {
      return this.quizAttempts.filter(a => a.subjectId === subjectId);
    }
    return this.quizAttempts;
  }
}

export const quizService = new QuizService();

export const submitQuizAnswers = async (quizId, selectedAnswers) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const keys = Object.keys(selectedAnswers);
  const totalQuestions = keys.length || 5;
  const correctCount = Math.max(1, Math.floor(totalQuestions * 0.8));
  const score = Math.round((correctCount / totalQuestions) * 100);
  return {
    passed: score >= 60,
    score,
    correctCount,
    totalQuestions,
    earnedXp: score >= 60 ? 120 : 0
  };
};

export const getQuizForCourse = async (courseId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    id: `quiz_${courseId}`,
    title: 'Course End Module Knowledge Check',
    rewardXp: 120,
    questions: [
      {
        id: 'q1',
        question: 'What is the primary architectural rule governing state management in this module?',
        options: [
          'Maintain unidirectional data flow and clean component encapsulation',
          'Mutate global array states directly',
          'Execute blocking main loop synchronization',
          'Bypass component props completely'
        ],
        correctAnswer: 0
      },
      {
        id: 'q2',
        question: 'Which method optimizes rendering performance for sub-components?',
        options: [
          'Memoization with React.memo & useCallback',
          'Force re-rendering on every mouse scroll',
          'Infinite loops',
          'Disabling virtual DOM reconciler'
        ],
        correctAnswer: 0
      }
    ]
  };
};

export default quizService;
