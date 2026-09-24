import { authApi } from '../lib/apiClient';
import { learnerService } from './learnerService';

/**
 * Helper to get authorization headers
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('edunova_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Persist user & token to localStorage
 */
const saveSession = (user, token) => {
  const formattedUser = {
    ...user,
    role: (user.role || 'STUDENT').toLowerCase(),
    isParent: user.role === 'PARENT' || user.role === 'parent',
  };
  if (token) localStorage.setItem('edunova_token', token);
  localStorage.setItem('edunova_user', JSON.stringify(formattedUser));
  return formattedUser;
};

/**
 * 1. Email / Phone + Password Login
 */
export const loginUser = async (emailOrPhone, password) => {
  const isEmail = (emailOrPhone || '').includes('@');
  const payload = {
    ...(isEmail ? { email: emailOrPhone } : { phone: emailOrPhone }),
    password,
  };

  try {
    const res = await authApi.login(payload);
    const user = saveSession(res.data.user, res.data.token);
    return { success: true, user, token: res.data.token };
  } catch (error) {
    throw error;
  }
};

/**
 * 2. Register User
 */
export const registerUser = async (name, email, password, learnerType = 'school', extraData = {}) => {
  const payload = {
    name: name || 'EduNova Learner',
    email: email || undefined,
    phone: extraData.phone || undefined,
    password,
    role: 'STUDENT',
    learnerType: (learnerType || 'school').toUpperCase(),
    studentUsername: extraData.username || undefined,
  };

  try {
    const res = await authApi.register(payload);
    const user = saveSession(res.data.user, res.data.token);
    learnerService.updateLearningType(learnerType.toLowerCase(), {
      name: user.name,
      username: user.studentUsername || extraData.username,
      phone: user.phone,
    });

    return { success: true, user, token: res.data.token };
  } catch (error) {
    throw error;
  }
};

/**
 * 3. Google Login / Register
 */
export const loginWithGoogle = async (idToken, role = 'STUDENT', learnerType = 'SCHOOL') => {
  try {
    const res = await authApi.googleLogin({ idToken, role, learnerType });
    const user = saveSession(res.data.user, res.data.token);
    return { success: true, user, token: res.data.token };
  } catch (error) {
    throw error;
  }
};

/**
 * 4. Parent Login
 */
export const loginParentUser = async (studentUsername, parentPassword) => {
  const cleanUsername = (studentUsername || '').trim().toLowerCase().replace(/^@/, '');
  if (!cleanUsername) throw new Error('Please enter a valid Student Username.');
  if (!parentPassword) throw new Error('Please enter your Parent Password.');

  try {
    const res = await authApi.login({ studentUsername: cleanUsername, password: parentPassword });
    const user = saveSession(res.data.user, res.data.token);
    return { success: true, user, token: res.data.token };
  } catch (error) {
    throw error;
  }
};

/**
 * 5. Parent Register
 */
export const registerParentUser = async (parentName, parentEmail, parentPassword, studentUsername, phone = '') => {
  const cleanUsername = (studentUsername || '').trim().toLowerCase().replace(/^@/, '');
  if (!cleanUsername) throw new Error('Student Username is required.');

  try {
    const res = await authApi.register({
      name: parentName,
      email: parentEmail,
      password: parentPassword,
      role: 'PARENT',
      studentUsername: cleanUsername,
      phone: phone || undefined,
    });
    const user = saveSession(res.data.user, res.data.token);
    return { success: true, user, token: res.data.token };
  } catch (error) {
    throw error;
  }
};

/**
 * 6. Current Session
 */
export const getCurrentUserSession = () => {
  const stored = localStorage.getItem('edunova_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * 7. Logout
 */
export const logoutUser = async () => {
  try {
    await authApi.logout();
  } catch {
    // Ignore network error on logout
  }
  localStorage.removeItem('edunova_token');
  localStorage.removeItem('edunova_user');
  return { success: true };
};
