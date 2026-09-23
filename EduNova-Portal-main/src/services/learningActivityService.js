/**
 * EduNova Event-Driven Learning Activity System
 * Log learning activities across the platform (lessons, quizzes, sessions, projects, simulations)
 * and calculate real Learning Time Intelligence & Study Consistency.
 */

const STORAGE_KEY = 'edunova_learning_activities';

// Initial seed activities to guarantee rich initial data without hardcoding UI components
const SEED_ACTIVITIES = [
  {
    id: 'act_101',
    type: 'QUIZ',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    durationMinutes: 35,
    accuracy: 86,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hrs ago
    xpEarned: 120
  },
  {
    id: 'act_102',
    type: 'LESSON',
    subject: 'Physics',
    topic: 'Light & Refraction',
    durationMinutes: 45,
    accuracy: 90,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    xpEarned: 150
  },
  {
    id: 'act_103',
    type: 'PRACTICE',
    subject: 'Chemistry',
    topic: 'Chemical Reactions',
    durationMinutes: 22,
    accuracy: 78,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // Yesterday
    xpEarned: 80
  },
  {
    id: 'act_104',
    type: 'SIMULATION',
    subject: 'Biology',
    topic: 'Human Heart Anatomy 3D',
    durationMinutes: 30,
    accuracy: 100,
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    xpEarned: 140
  },
  {
    id: 'act_105',
    type: 'REVISION',
    subject: 'Mathematics',
    topic: 'Trigonometry Ratios',
    durationMinutes: 25,
    accuracy: 84,
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
    xpEarned: 95
  }
];

export const getActivities = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read learning activities', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ACTIVITIES));
  return SEED_ACTIVITIES;
};

export const logActivity = (activity) => {
  const activities = getActivities();
  const newEntry = {
    id: `act_${Date.now()}`,
    timestamp: new Date().toISOString(),
    accuracy: activity.accuracy || 85,
    durationMinutes: activity.durationMinutes || 25,
    xpEarned: activity.xpEarned || 100,
    ...activity
  };

  const updated = [newEntry, ...activities];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Dispatch custom browser event for instant UI sync
  window.dispatchEvent(new CustomEvent('edunova:activity_logged', { detail: newEntry }));
  return newEntry;
};

/**
 * Calculate total learning time intelligence for today, this week, and this month
 */
export const getTimeIntelligence = () => {
  const activities = getActivities();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let todayMinutes = 0;
  let weekMinutes = 0;
  let monthMinutes = 0;

  let totalAccuracySum = 0;
  let accuracyCount = 0;

  const subjectTimes = {};
  const activityTypeTimes = {
    Lesson: 0,
    Practice: 0,
    Quiz: 0,
    Revision: 0,
    Flashcards: 0,
    Project: 0,
    Simulation: 0,
    XR: 0
  };

  activities.forEach(act => {
    const actDate = new Date(act.timestamp);
    const dateStr = actDate.toISOString().split('T')[0];
    const mins = act.durationMinutes || 0;

    if (dateStr === todayStr) {
      todayMinutes += mins;
    }
    if (actDate >= sevenDaysAgo) {
      weekMinutes += mins;
    }
    if (actDate >= thirtyDaysAgo) {
      monthMinutes += mins;
    }

    if (act.subject) {
      subjectTimes[act.subject] = (subjectTimes[act.subject] || 0) + mins;
    }

    const typeKey = act.type ? (act.type.charAt(0).toUpperCase() + act.type.slice(1).toLowerCase()) : 'Practice';
    if (activityTypeTimes[typeKey] !== undefined) {
      activityTypeTimes[typeKey] += mins;
    } else {
      activityTypeTimes['Practice'] += mins;
    }

    if (act.accuracy !== undefined) {
      totalAccuracySum += act.accuracy;
      accuracyCount++;
    }
  });

  const avgAccuracy = accuracyCount > 0 ? Math.round(totalAccuracySum / accuracyCount) : 84;

  return {
    todayFormatted: `${Math.floor(todayMinutes / 60)}h ${todayMinutes % 60}m`,
    todayMinutes,
    weekFormatted: `${Math.floor(weekMinutes / 60)}h ${weekMinutes % 60}m`,
    weekMinutes,
    monthFormatted: `${Math.floor(monthMinutes / 60)}h ${monthMinutes % 60}m`,
    monthMinutes,
    avgAccuracy,
    subjectTimes,
    activityTypeTimes,
    totalActivitiesLogged: activities.length
  };
};

/**
 * Generate 7-day study consistency matrix
 */
export const getConsistencyMatrix = () => {
  const activities = getActivities();
  const days = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

    const dayMins = activities
      .filter(a => a.timestamp.startsWith(dateStr))
      .reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

    days.push({
      date: dateStr,
      dayLabel,
      minutes: dayMins,
      isActive: dayMins > 0,
      intensity: dayMins >= 60 ? 'high' : dayMins >= 30 ? 'medium' : dayMins > 0 ? 'low' : 'none'
    });
  }

  return days;
};

export default {
  getActivities,
  logActivity,
  getTimeIntelligence,
  getConsistencyMatrix
};
