export const sampleDailyMissions = [
  {
    id: 'mis_1',
    title: 'Complete 1 Interactive Lesson',
    rewardXp: 50,
    progress: 1,
    target: 1,
    completed: true,
    category: 'Learning',
    actionRoute: '/explore'
  },
  {
    id: 'mis_2',
    title: 'Solve 10 Practice Questions',
    rewardXp: 75,
    progress: 7,
    target: 10,
    completed: false,
    category: 'Quizzes',
    actionRoute: '/my-subjects'
  },
  {
    id: 'mis_3',
    title: 'Study for 45 Minutes',
    rewardXp: 100,
    progress: 30,
    target: 45,
    completed: false,
    category: 'Study',
    actionRoute: '/study-planner'
  },
  {
    id: 'mis_4',
    title: 'Complete Daily Revision',
    rewardXp: 50,
    progress: 0,
    target: 1,
    completed: false,
    category: 'Revision',
    actionRoute: '/my-subjects'
  }
];

export const sampleWeeklyChallenge = {
  id: 'chal_weekly_1',
  title: 'Master React State & Hooks',
  description: 'Complete 3 lessons, score 100% on 2 quizzes, and launch 1 practice lab session this week.',
  rewardXp: 500,
  badgeReward: 'React Explorer Badge',
  progress: 2,
  target: 3,
  daysRemaining: 4
};
