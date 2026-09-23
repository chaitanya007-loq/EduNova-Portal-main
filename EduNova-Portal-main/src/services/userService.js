import { apiClient } from '../lib/apiClient';

/**
 * Fetch current user profile from PostgreSQL
 */
export const getUserProfile = async () => {
  const res = await apiClient('/users/profile');
  return res.data || null;
};

/**
 * Update user profile in PostgreSQL
 */
export const updateUserProfile = async (updates) => {
  const res = await apiClient('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return res?.data || null;
};

/**
 * Add XP to user profile
 */
export const addXp = async (amount, sourceTitle = 'Learning Activity') => {
  try {
    const res = await apiClient('/gamification/xp', {
      method: 'POST',
      body: JSON.stringify({ amount, sourceTitle }),
    });
    return res.data;
  } catch (error) {
    return null;
  }
};
