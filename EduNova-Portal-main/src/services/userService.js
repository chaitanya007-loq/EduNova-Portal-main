import { apiClient } from '../lib/apiClient';

/**
 * Fetch current user profile from PostgreSQL
 */
export const getUserProfile = async () => {
  try {
    const res = await apiClient('/users/profile');
    if (res.data) {
      localStorage.setItem('edunova_user', JSON.stringify(res.data));
      return res.data;
    }
  } catch (error) {
    console.warn('Falling back to local session:', error.message);
  }

  const stored = localStorage.getItem('edunova_user');
  return stored ? JSON.parse(stored) : null;
};

/**
 * Update user profile in PostgreSQL
 */
export const updateUserProfile = async (updates) => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('edunova_user') : null;
  const currentUser = stored ? JSON.parse(stored) : {};
  const localMerged = { ...currentUser, ...updates };

  try {
    const res = await apiClient('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (res?.data) {
      const serverMerged = { ...localMerged, ...res.data };
      if (typeof window !== 'undefined') {
        localStorage.setItem('edunova_user', JSON.stringify(serverMerged));
      }
      return serverMerged;
    }
  } catch (error) {
    console.warn('Failed to update profile on backend, persisting locally:', error.message);
    if (typeof window !== 'undefined') {
      localStorage.setItem('edunova_user', JSON.stringify(localMerged));
    }
    return localMerged;
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('edunova_user', JSON.stringify(localMerged));
  }
  return localMerged;
};

/**
 * Add XP to user profile
 */
export const addXp = async (amount) => {
  try {
    const res = await apiClient('/gamification/streak', { method: 'POST' });
    return res.data;
  } catch (error) {
    return null;
  }
};
