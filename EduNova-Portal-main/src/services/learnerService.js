import { learnerApi } from '../lib/apiClient';

const createCleanProfile = () => ({
  id: '',
  name: '',
  username: '',
  email: '',
  phone: '',
  avatar: '',
  role: 'STUDENT',
  learnerType: 'school',
  title: '',
  bio: '',
  xp: 0,
  level: 1,
  streakDays: 0,
  goals: [],
  weakTopics: [],
  education: {},
  projects: [],
});

const STORAGE_KEY = 'edunova_active_learner_profile';

class LearnerService {
  constructor() {
    let cached = null;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) cached = JSON.parse(stored);
      } catch (e) {}
    }
    this.currentLearner = cached ? { ...createCleanProfile(), ...cached } : createCleanProfile();
    this.listeners = new Set();
  }

  getProfile() {
    return this.currentLearner || createCleanProfile();
  }

  getCurrentLearner() {
    return this.getProfile();
  }

  setProfile(profile) {
    if (!profile) return this.currentLearner;
    this.currentLearner = {
      ...(this.currentLearner || createCleanProfile()),
      ...profile,
      education: {
        ...(this.currentLearner?.education || {}),
        ...(profile.education || {}),
      },
      goals: Array.isArray(profile.goals)
        ? profile.goals
        : Array.isArray(this.currentLearner?.goals)
        ? this.currentLearner.goals
        : [],
      weakTopics: Array.isArray(profile.weakTopics)
        ? profile.weakTopics
        : Array.isArray(this.currentLearner?.weakTopics)
        ? this.currentLearner.weakTopics
        : [],
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentLearner));
      } catch (e) {}
    }
    this.notifyListeners();
    return this.currentLearner;
  }

  async fetchLiveProfile() {
    try {
      const res = await learnerApi.getProfile();
      if (res?.data) {
        const p = res.data;
        const normalized = {
          id: p.userId || p.id,
          name: p.user?.name || this.currentLearner?.name || '',
          email: p.user?.email || this.currentLearner?.email || '',
          phone: p.user?.phone || this.currentLearner?.phone || '',
          username: p.user?.studentUsername || this.currentLearner?.username || '',
          avatar: p.user?.avatar || this.currentLearner?.avatar || '',
          role: p.user?.role || this.currentLearner?.role || 'STUDENT',
          learnerType: (p.user?.learnerType || this.currentLearner?.learnerType || 'school').toLowerCase(),
          xp: p.xp ?? 0,
          level: p.level ?? 1,
          streakDays: p.streakDays ?? 0,
          goals: Array.isArray(p.parsedGoals) ? p.parsedGoals : [],
          weakTopics: Array.isArray(p.weakTopics) ? p.weakTopics : [],
          education: {
            board: p.board || null,
            degree: p.degree || null,
          },
        };
        return this.setProfile(normalized);
      }
    } catch (err) {
      console.warn('Unable to hydrate live learner profile:', err.message);
    }
    return this.getProfile();
  }

  calculateProfileCompletion() {
    const l = this.currentLearner || {};
    let score = 0;
    if (l.name) score += 20;
    if (l.username) score += 20;
    if (l.bio || l.title) score += 20;
    if (l.education && (l.education.board || l.education.degree || l.education.class)) score += 20;
    if (Array.isArray(l.goals) && l.goals.length > 0) score += 20;
    return Math.min(100, score);
  }

  getLearningGoals() {
    return Array.isArray(this.currentLearner?.goals) ? this.currentLearner.goals : [];
  }

  addLearningGoal(newGoal) {
    const goalObj = {
      id: newGoal?.id || `goal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: newGoal?.title || 'Learning Goal',
      targetDate: newGoal?.targetDate || '2026-12-31',
      progress: Number(newGoal?.progress) || 0,
      createdAt: new Date().toISOString(),
    };

    const currentGoals = this.getLearningGoals();
    const updatedGoals = [...currentGoals, goalObj];

    this.currentLearner = { ...this.currentLearner, goals: updatedGoals };
    this.notifyListeners();

    // Async background persist via PostgreSQL REST endpoint
    learnerApi.addGoal(goalObj).catch((err) => {
      console.warn('Failed to persist new goal to backend:', err.message);
    });

    return updatedGoals;
  }

  updateLearningGoal(goalId, updates) {
    const currentGoals = this.getLearningGoals();
    const updatedGoals = currentGoals.map((g) =>
      g.id === goalId || g.title === goalId ? { ...g, ...updates } : g
    );

    this.currentLearner = { ...this.currentLearner, goals: updatedGoals };
    this.notifyListeners();

    learnerApi.updateGoal(goalId, updates).catch((err) => {
      console.warn('Failed to update goal on backend:', err.message);
    });

    return updatedGoals;
  }

  deleteLearningGoal(goalId) {
    const currentGoals = this.getLearningGoals();
    const updatedGoals = currentGoals.filter((g) => g.id !== goalId && g.title !== goalId);

    this.currentLearner = { ...this.currentLearner, goals: updatedGoals };
    this.notifyListeners();

    learnerApi.deleteGoal(goalId).catch((err) => {
      console.warn('Failed to delete goal on backend:', err.message);
    });

    return updatedGoals;
  }

  getLearningTimeline() {
    return [];
  }

  async checkUsernameAvailability(rawUsername) {
    const clean = (rawUsername || '').trim().toLowerCase().replace(/^@/, '');
    if (!clean) {
      return { available: false, message: 'Username cannot be empty', suggestions: [] };
    }
    return { available: true, message: `@${clean} is available`, suggestions: [] };
  }

  switchDemoProfile(learnerTypeKey) {
    return this.updateLearningType(learnerTypeKey);
  }

  updateLearningType(learnerType, extraDetails = {}) {
    const normalizedType = (learnerType || 'school').toLowerCase();
    this.currentLearner = {
      ...(this.currentLearner || createCleanProfile()),
      learnerType: normalizedType,
      ...extraDetails,
      education: {
        ...(this.currentLearner?.education || {}),
        ...(extraDetails?.education || {}),
      },
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentLearner));
      } catch (e) {}
    }
    this.notifyListeners();

    const board = extraDetails?.education?.board || null;
    const degree = extraDetails?.education?.degree || null;

    learnerApi
      .updateLearnerType({
        learnerType: normalizedType.toUpperCase(),
        ...(board && { board }),
        ...(degree && { degree }),
      })
      .catch((err) => {
        console.warn('Failed to persist learner type change:', err.message);
      });

    return this.currentLearner;
  }

  updateParentCompanion(parentData) {
    return this.setProfile({ parentCompanion: parentData });
  }

  resetPersonalization() {
    this.currentLearner = createCleanProfile();
    this.notifyListeners();
    return this.currentLearner;
  }

  exportUserData() {
    return this.getProfile();
  }

  getSetupHealthScore() {
    return this.calculateProfileCompletion();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    const snapshot = this.getProfile();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (e) {
        console.error('Error in learner listener:', e);
      }
    });
  }
}

export const learnerService = new LearnerService();
export default learnerService;
