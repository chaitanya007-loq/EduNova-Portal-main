/**
 * EduNova Analytics Demo & Seed Data Configuration
 * Provides structured fallback data for hackathon presentation when live user database history is initial or offline.
 */

export const USE_ANALYTICS_MOCK_DATA = true;

export const analyticsDemoData = {
  lastUpdated: new Date().toISOString(),
  sessionCount: 46,
  quizCount: 18,
  learnerContext: {
    name: 'Aarav Sharma',
    learnerType: 'college',
    title: 'B.Tech Computer Science (Sem 5) / Class 10 CBSE',
    xp: 4120,
    streakDays: 18
  }
};
