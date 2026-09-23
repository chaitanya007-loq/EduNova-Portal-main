import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authApi } from '../lib/apiClient';
import { updateUserProfile } from '../services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Stable setUser that avoids updating state if object contents are identical
  const setUser = useCallback((newUserOrUpdater) => {
    setUserState((prev) => {
      const next = typeof newUserOrUpdater === 'function' ? newUserOrUpdater(prev) : newUserOrUpdater;
      if (prev === next) return prev;
      if (prev && next && JSON.stringify(prev) === JSON.stringify(next)) return prev;
      return next;
    });
  }, []);

  /**
   * Session Hydration on Mount
   * Replaces static localStorage mocks with a live call to GET /api/auth/me
   */
  const hydrateSession = useCallback(async () => {
    try {
      setLoading(true);
      setAuthError(null);
      const res = await authApi.getMe();
      if (res && res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      // Unauthenticated session is normal on initial load if not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  /**
   * 1. Login with Email/Phone/Username and Password
   */
  const loginWithPassword = useCallback(async (credentials, optionalPassword) => {
    try {
      setLoading(true);
      setAuthError(null);

      let payload = {};
      if (typeof credentials === 'object' && credentials !== null) {
        payload = credentials;
      } else if (typeof credentials === 'string' && optionalPassword) {
        if (credentials.includes('@')) {
          payload = { email: credentials, password: optionalPassword };
        } else if (/^\+?[0-9]{10,14}$/.test(credentials.replace(/\s+/g, ''))) {
          payload = { phone: credentials, password: optionalPassword };
        } else {
          payload = { studentUsername: credentials, password: optionalPassword };
        }
      }

      const res = await authApi.login(payload);
      if (res?.data?.token) {
        localStorage.setItem('edunova_token', res.data.token);
      }
      if (res?.data?.refreshToken) {
        localStorage.setItem('edunova_refresh_token', res.data.refreshToken);
      }
      if (res?.data?.user) {
        setUser(res.data.user);
      }
      return res.data;
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  /**
   * 2. Phone OTP Authentication
   */
  const sendPhoneOtp = useCallback(async (phone) => {
    try {
      setAuthError(null);
      const res = await authApi.sendOtp(phone);
      return res.data;
    } catch (err) {
      setAuthError(err.message || 'Failed to send OTP');
      throw err;
    }
  }, []);

  const verifyPhoneOtp = useCallback(async (phoneOrPayload, otp) => {
    try {
      setLoading(true);
      setAuthError(null);

      const payload =
        typeof phoneOrPayload === 'object'
          ? phoneOrPayload
          : { phone: phoneOrPayload, otp };

      const res = await authApi.verifyOtp(payload);
      if (res?.data?.token) {
        localStorage.setItem('edunova_token', res.data.token);
      }
      if (res?.data?.refreshToken) {
        localStorage.setItem('edunova_refresh_token', res.data.refreshToken);
      }
      if (res?.data?.user) {
        setUser(res.data.user);
      }
      return res.data;
    } catch (err) {
      setAuthError(err.message || 'OTP verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  /**
   * 3. Google OAuth Login
   */
  const loginWithGoogle = useCallback(async (idToken, role = 'STUDENT', learnerType = 'SCHOOL') => {
    try {
      setLoading(true);
      setAuthError(null);
      const res = await authApi.googleLogin({ idToken, role, learnerType });
      if (res?.data?.token) {
        localStorage.setItem('edunova_token', res.data.token);
      }
      if (res?.data?.refreshToken) {
        localStorage.setItem('edunova_refresh_token', res.data.refreshToken);
      }
      if (res?.data?.user) {
        setUser(res.data.user);
      }
      return res.data;
    } catch (err) {
      setAuthError(err.message || 'Google sign-in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  /**
   * 4. Register Standard Learner
   */
  const register = useCallback(async (nameOrData, email, password, learnerType = 'SCHOOL', extraData = {}) => {
    try {
      setLoading(true);
      setAuthError(null);

      const rawTrack = typeof learnerType === 'string' ? learnerType.toUpperCase() : 'SCHOOL';
      const validTrack = ['SCHOOL', 'COLLEGE', 'SKILLS', 'EXAM'].includes(rawTrack) ? rawTrack : 'SCHOOL';

      const payload =
        typeof nameOrData === 'object'
          ? nameOrData
          : { name: nameOrData, email, password, learnerType: validTrack, ...extraData };

      const res = await authApi.register(payload);
      if (res?.data?.token) {
        localStorage.setItem('edunova_token', res.data.token);
      }
      if (res?.data?.refreshToken) {
        localStorage.setItem('edunova_refresh_token', res.data.refreshToken);
      }
      if (res?.data?.user) {
        setUser(res.data.user);
      }
      return res.data;
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  /**
   * 5. Register Parent Companion Account
   */
  const registerParent = useCallback(async (
    parentNameOrData,
    parentEmail,
    parentPassword,
    studentUsername,
    phone = ''
  ) => {
    try {
      setLoading(true);
      setAuthError(null);

      const payload =
        typeof parentNameOrData === 'object'
          ? { ...parentNameOrData, role: 'PARENT' }
          : {
              name: parentNameOrData,
              email: parentEmail,
              password: parentPassword,
              studentUsername,
              phone,
              role: 'PARENT',
            };

      const res = await authApi.register(payload);
      if (res?.data?.token) {
        localStorage.setItem('edunova_token', res.data.token);
      }
      if (res?.data?.refreshToken) {
        localStorage.setItem('edunova_refresh_token', res.data.refreshToken);
      }
      if (res?.data?.user) {
        setUser(res.data.user);
      }
      return res.data;
    } catch (err) {
      setAuthError(err.message || 'Parent registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  /**
   * 6. Logout
   */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Continue clearing local state regardless
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('edunova_token');
        localStorage.removeItem('edunova_refresh_token');
        localStorage.removeItem('edunova_user');
        localStorage.removeItem('edunova_active_learner_profile');
        localStorage.setItem('edunova_theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      setUser(null);
      setAuthError(null);
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
  }, [setUser]);

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const merged = prev ? { ...prev, ...updatedData } : updatedData;
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('edunova_user', JSON.stringify(merged));
        }
      } catch (e) {}
      return merged;
    });
  }, [setUser]);

  const saveProfile = useCallback(async (updates) => {
    try {
      const savedUser = await updateUserProfile(updates);
      if (savedUser) {
        setUser((prev) => ({ ...prev, ...savedUser }));
      }
      return savedUser;
    } catch (err) {
      console.warn('Profile save fallback to local:', err.message);
      updateUser(updates);
      return updates;
    }
  }, [setUser, updateUser]);

  const loginParent = useCallback((studentUsername, parentPassword) => {
    return loginWithPassword({ studentUsername, password: parentPassword });
  }, [loginWithPassword]);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isParent: user?.role === 'PARENT',
    loading,
    authError,
    hydrateSession,
    // Standard Deliverable Methods
    loginWithPassword,
    sendPhoneOtp,
    verifyPhoneOtp,
    loginWithGoogle,
    register,
    registerParent,
    logout,
    updateUser,
    saveProfile,
    // Backward-compatibility Aliases
    login: loginWithPassword,
    loginGoogle: loginWithGoogle,
    requestOtp: sendPhoneOtp,
    verifyOtp: verifyPhoneOtp,
    loginParent,
  }), [
    user,
    loading,
    authError,
    hydrateSession,
    loginWithPassword,
    sendPhoneOtp,
    verifyPhoneOtp,
    loginWithGoogle,
    register,
    registerParent,
    logout,
    updateUser,
    saveProfile,
    loginParent
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

