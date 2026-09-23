export const sampleLearningPath = {
  title: 'AI-Guided Full-Stack Specialist Track',
  summary: 'Sage AI analyzed your 78% React mastery and identified a key gap in async state synchronization before progressing to Full-Stack API architecture.',
  recommendationReason: 'You performed strongly in JavaScript fundamentals but need more practice with asynchronous edge cases and state management context.',
  nodes: [
    {
      step: 1,
      id: 'node_1',
      title: 'JavaScript Fundamentals & Async Execution',
      difficulty: 'Beginner',
      estimatedHours: '4 hrs',
      completionPercentage: 100,
      status: 'completed',
      prerequisites: []
    },
    {
      step: 2,
      id: 'node_2',
      title: 'React 19 Hooks & Context State Architecture',
      difficulty: 'Intermediate',
      estimatedHours: '8 hrs',
      completionPercentage: 78,
      status: 'in_progress',
      prerequisites: ['node_1']
    },
    {
      step: 3,
      id: 'node_3',
      title: 'Async State Synchronization & Edge Cases',
      difficulty: 'Intermediate',
      estimatedHours: '5 hrs',
      completionPercentage: 20,
      status: 'recommended',
      prerequisites: ['node_2']
    },
    {
      step: 4,
      id: 'node_4',
      title: 'RESTful API & GraphQL Integration Patterns',
      difficulty: 'Advanced',
      estimatedHours: '10 hrs',
      completionPercentage: 0,
      status: 'locked',
      prerequisites: ['node_3']
    },
    {
      step: 5,
      id: 'node_5',
      title: 'Full-Stack Deployment & Firebase Backend Setup',
      difficulty: 'Advanced',
      estimatedHours: '12 hrs',
      completionPercentage: 0,
      status: 'locked',
      prerequisites: ['node_4']
    }
  ]
};
