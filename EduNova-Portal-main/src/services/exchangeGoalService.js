// EduNova Exchange Milestone & Goal Tracking Service

const GOALS_KEY = 'edunova_exchange_goals_v2';

export const getExchangeGoals = (exchangeId) => {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (raw) {
      const all = JSON.parse(raw);
      return all.filter(g => g.exchangeId === exchangeId);
    }
  } catch (e) {
    console.error('Failed to load goals', e);
  }
  localStorage.setItem(GOALS_KEY, JSON.stringify([]));
  return [];
};

export const toggleMilestoneCompletion = (exchangeId, goalId, milestoneId) => {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    const all = raw ? JSON.parse(raw) : [];

    const updated = all.map(g => {
      if (g.id === goalId) {
        const newMilestones = g.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
        const completedCount = newMilestones.filter(m => m.completed).length;
        const newProgress = Math.round((completedCount / newMilestones.length) * 100);
        return { ...g, milestones: newMilestones, progress: newProgress };
      }
      return g;
    });

    localStorage.setItem(GOALS_KEY, JSON.stringify(updated));
    return updated.filter(g => g.exchangeId === exchangeId);
  } catch (e) {
    console.error('Failed to toggle milestone', e);
  }
};

export const addExchangeGoal = (exchangeId, title, category, milestonesList = []) => {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    const all = raw ? JSON.parse(raw) : [];

    const newGoal = {
      id: `goal_${Date.now()}`,
      exchangeId,
      title,
      category,
      progress: 0,
      milestones: milestonesList.map((m, idx) => ({ id: `m_${Date.now()}_${idx}`, text: m, completed: false }))
    };

    const updated = [...all, newGoal];
    localStorage.setItem(GOALS_KEY, JSON.stringify(updated));
    return newGoal;
  } catch (e) {
    console.error('Failed to add goal', e);
  }
};
