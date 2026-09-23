export const sampleQuizzes = {
  crs_1: {
    id: 'quiz_react_19',
    title: 'React 19 & Architecture Knowledge Check',
    rewardXp: 150,
    timeLimitSeconds: 180,
    questions: [
      {
        id: 'q1',
        question: 'What is the primary benefit of React Context API over prop drilling?',
        options: [
          'It speeds up JavaScript execution engine by 50%',
          'It provides global state access without passing props down multiple component levels',
          'It automatically connects components to a database',
          'It replaces CSS files completely'
        ],
        correctAnswer: 1,
        explanation: 'Context provides a clean mechanism to share values like user data, themes, or UI states across tree levels without manual prop drilling.'
      },
      {
        id: 'q2',
        question: 'Which Hook is best suited for memoizing expensive calculation results in React?',
        options: ['useEffect', 'useCallback', 'useMemo', 'useReducer'],
        correctAnswer: 2,
        explanation: 'useMemo returns a memoized value and recomputes it only when one of its specified dependencies changes.'
      },
      {
        id: 'q3',
        question: 'In modern React, what happens when a state updater function receives a callback `(prev) => prev + 1`?',
        options: [
          'It mutates the DOM immediately synchronously',
          'It ensures state update is based on the most up-to-date previous state',
          'It triggers a full page refresh',
          'It converts the state to a string'
        ],
        correctAnswer: 1,
        explanation: 'Functional state updates guarantee access to pending previous state regardless of batched async execution.'
      }
    ]
  }
};
