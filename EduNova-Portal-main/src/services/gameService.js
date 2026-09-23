/**
 * EduNova Learning Game Center Service (src/services/gameService.js)
 * High-performance game engine content provider, score tracker, and gamification connector.
 */

const RESULTS_KEY = 'edunova_game_results_v1';
const BESTS_KEY = 'edunova_game_bests_v1';

// Seed Subject Content for Dynamic Game Engines
const GAME_CONTENT = {
  SCHOOL: {
    Physics: {
      concepts: [
        { term: 'Trajectory', definition: 'The curved path followed by a projectile under gravity', example: 'Motion of a kicked football' },
        { term: 'Refraction', definition: 'Bending of light rays as they pass through different media', example: 'Pencil appearing bent in water' },
        { term: 'Ohm’s Law', definition: 'Current through a conductor is directly proportional to voltage (V = IR)', example: 'Electric circuit voltage drop' },
        { term: 'Work-Energy Theorem', definition: 'Work done by net forces equals change in kinetic energy', example: 'Car braking to a stop' }
      ],
      formulas: [
        { term: 'v = u + at', definition: 'First equation of motion under constant acceleration' },
        { term: 'F = ma', definition: 'Newton’s Second Law of Motion' },
        { term: 'E = mc²', definition: 'Mass-energy equivalence equation' },
        { term: 'P = IV', definition: 'Electric power formula' }
      ],
      mistakes: [
        {
          id: 'fix-phys-1',
          title: 'Incorrect Kinematic Substitution',
          codeOrEq: 's = ut + (1/2) a t³',
          corrected: 's = ut + (1/2) a t²',
          explanation: 'Time t is squared (t²) in the second kinematic equation, not cubed.'
        },
        {
          id: 'fix-phys-2',
          title: 'Resistance Formula Confusion',
          codeOrEq: 'R = I / V',
          corrected: 'R = V / I',
          explanation: 'By Ohm’s Law V = IR, so Resistance R equals Voltage V divided by Current I.'
        }
      ],
      sequences: [
        { title: 'Scientific Method Sequence', items: ['Form Hypothesis', 'Design Experiment', 'Collect Data', 'Analyze Results', 'Draw Conclusion'] },
        { title: 'Refraction Beam Path', items: ['Incident Ray in Air', 'Glass Interface Boundary', 'Bends Toward Normal in Glass', 'Emerges Parallel to Incident Beam'] }
      ]
    },
    Mathematics: {
      concepts: [
        { term: 'Quadratic Discriminant', definition: 'b² - 4ac determines the nature of quadratic roots', example: 'Delta > 0 gives two real distinct roots' },
        { term: 'Pythagorean Theorem', definition: 'In right-angled triangle: a² + b² = c²', example: '3-4-5 triangle sides' },
        { term: 'Polynomial Degree', definition: 'Highest power of variable x in the polynomial expression', example: '3x³ + 2x + 1 has degree 3' }
      ],
      formulas: [
        { term: 'x = (-b ± √(b²-4ac)) / 2a', definition: 'Quadratic formula for roots of ax² + bx + c = 0' },
        { term: 'sin²θ + cos²θ = 1', definition: 'Pythagorean Trigonometric Identity' },
        { term: 'A = πr²', definition: 'Area of circle formula' }
      ],
      mistakes: [
        {
          id: 'fix-math-1',
          title: 'Incorrect Binomial Expansion',
          codeOrEq: '(a + b)² = a² + b²',
          corrected: '(a + b)² = a² + 2ab + b²',
          explanation: 'The middle term 2ab must be included in binomial squaring.'
        }
      ],
      sequences: [
        { title: 'Quadratic Formula Solution Steps', items: ['Write in Standard Form ax² + bx + c = 0', 'Identify Coefficients a, b, c', 'Calculate Discriminant D = b² - 4ac', 'Apply Quadratic Formula', 'Simplify Roots'] }
      ]
    }
  },
  COLLEGE: {
    'Database Systems': {
      concepts: [
        { term: '3NF (Third Normal Form)', definition: 'Table is in 2NF and has no transitive dependencies', example: 'Zip code lookup moved to Zip table' },
        { term: 'ACID Properties', definition: 'Atomicity, Consistency, Isolation, Durability in DB transactions', example: 'Bank fund transfer reliability' },
        { term: 'B-Tree Index', definition: 'Self-balancing search tree used by SQL databases for fast retrieval', example: 'Primary key index on User ID' }
      ],
      formulas: [
        { term: 'SELECT * FROM Users WHERE age > 18', definition: 'Filter records with SQL query' },
        { term: 'JOIN ON table1.id = table2.fk', definition: 'Relational table join condition' }
      ],
      mistakes: [
        {
          id: 'fix-dbms-1',
          title: 'Missing WHERE Clause in UPDATE',
          codeOrEq: 'UPDATE Students SET status = "Graduated";',
          corrected: 'UPDATE Students SET status = "Graduated" WHERE credits >= 120;',
          explanation: 'Omitting WHERE updates EVERY row in the table unconditionally.'
        }
      ],
      sequences: [
        { title: 'SQL Query Execution Pipeline', items: ['FROM & JOIN clauses', 'WHERE filter', 'GROUP BY aggregation', 'HAVING filter', 'SELECT projection', 'ORDER BY sorting'] }
      ]
    },
    'Web Development': {
      concepts: [
        { term: 'React useEffect', definition: 'Hook for side effects like data fetching and subscriptions', example: 'Fetching API data on mount' },
        { term: 'CSS Glassmorphism', definition: 'Frosted glass UI using backdrop-filter blur and semi-transparent fills', example: 'EduNova card background' }
      ],
      formulas: [
        { term: 'backdrop-filter: blur(28px)', definition: 'CSS property for frosted glass blur' }
      ],
      mistakes: [
        {
          id: 'fix-react-1',
          title: 'Direct State Mutation',
          codeOrEq: 'this.state.count = 5;',
          corrected: 'setCount(5); // or setState({ count: 5 })',
          explanation: 'Direct state mutation does not trigger React re-render.'
        }
      ],
      sequences: [
        { title: 'React Component Lifecycle', items: ['Render Phase', 'DOM Update', 'useEffect Cleanup', 'useEffect Execution'] }
      ]
    }
  },
  EXAM: {
    CMAT: {
      concepts: [
        { term: 'Speed-Distance-Time', definition: 'Speed = Distance / Time', example: 'Train passing a pole' },
        { term: 'Syllogism Validity', definition: 'Deductive reasoning based on categorical premises', example: 'All A are B, All B are C' }
      ],
      formulas: [
        { term: 'Relative Speed (Opposite)', definition: 'S1 + S2 when moving toward each other' }
      ],
      mistakes: [
        { id: 'fix-cmat-1', title: 'Average Speed Fallacy', codeOrEq: 'Avg Speed = (S1 + S2) / 2', corrected: 'Avg Speed = Total Distance / Total Time', explanation: 'Average speed is harmonic mean if distances are equal.' }
      ],
      sequences: [
        { title: 'Logical Puzzle Solving Steps', items: ['Read All Constraints', 'Identify Fixed Anchor Points', 'Eliminate Impossible Cases', 'Fill Secondary Positions', 'Verify Final Grid'] }
      ]
    }
  }
};

class GameService {
  getResults() {
    try {
      const data = localStorage.getItem(RESULTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  getPersonalBests() {
    try {
      const data = localStorage.getItem(BESTS_KEY);
      return data ? JSON.parse(data) : {
        highScore: 0,
        highestAccuracy: 0,
        totalGames: 0,
        currentStreak: 1
      };
    } catch (e) {
      return { highScore: 0, highestAccuracy: 0, totalGames: 0, currentStreak: 1 };
    }
  }

  saveGameResult(result) {
    const results = this.getResults();
    const newEntry = {
      id: `game-res-${Date.now()}`,
      gameId: result.gameId,
      gameTitle: result.gameTitle,
      subject: result.subject || 'General',
      score: result.score || 0,
      accuracy: result.accuracy || 0,
      xpEarned: result.xpEarned || 50,
      durationSeconds: result.durationSeconds || 45,
      mistakes: result.mistakes || [],
      timestamp: new Date().toISOString()
    };

    results.unshift(newEntry);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));

    // Update Personal Bests
    const bests = this.getPersonalBests();
    bests.totalGames = (bests.totalGames || 0) + 1;
    if (newEntry.score > bests.highScore) bests.highScore = newEntry.score;
    if (newEntry.accuracy > bests.highestAccuracy) bests.highestAccuracy = newEntry.accuracy;

    localStorage.setItem(BESTS_KEY, JSON.stringify(bests));
    return newEntry;
  }

  getContentForTrack(track = 'SCHOOL', subject = 'Physics') {
    const trackData = GAME_CONTENT[track] || GAME_CONTENT.SCHOOL;
    const subData = trackData[subject] || Object.values(trackData)[0] || GAME_CONTENT.SCHOOL.Physics;
    return subData;
  }
}

export const gameService = new GameService();
export default gameService;
