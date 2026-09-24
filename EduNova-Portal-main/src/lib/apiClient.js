/**
 * Centralized EduNova API Client for Next.js / React (JavaScript / ES-Module)
 * 
 * Configured with:
 * - Dynamic Port Fallback (attempts http://localhost:5000/api and http://localhost:5001/api)
 * - credentials: 'include' (transmits HTTP-only JWT cookies)
 * - Automatic 401 interceptor with silent token refresh
 * - Standard toast notification dispatch on unexpected errors
 * - Automatic redirection to /login on unrecoverable 401 session expiry
 * - Modular SDK exports: authApi, subjectApi, courseApi, gamificationApi, adminApi, parentApi, conversationApi, exchangeApi
 */

const CANDIDATE_URLS = Array.from(
  new Set(
    [
      typeof process !== 'undefined' && process.env?.REACT_APP_API_URL,
      typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL,
      'http://localhost:5000/api',
      'http://localhost:5001/api',
    ].filter(Boolean)
  )
);

let activeBaseUrl = CANDIDATE_URLS[0] || 'http://localhost:5000/api';

/**
 * Global UI Notification Dispatcher
 * Dispatches a custom window event and renders a subtle top-center floating toast
 */
export function showToast(message, type = 'error') {
  if (typeof window === 'undefined') return;

  // 1. Dispatch custom event for any React Context listeners
  window.dispatchEvent(
    new CustomEvent('edunova:toast', {
      detail: { message, type, timestamp: Date.now() },
    })
  );

  // 2. Fallback DOM Toast Notification Container
  try {
    let container = document.getElementById('edunova-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'edunova-toast-container';
      container.style.position = 'fixed';
      container.style.top = '24px';
      container.style.right = '24px';
      container.style.zIndex = '999999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.pointerEvents = 'auto';
    toast.style.background = type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)';
    toast.style.color = '#ffffff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '10px';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '500';
    toast.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)';
    toast.style.backdropFilter = 'blur(8px)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.textContent = (type === 'error' ? '⚠️ ' : '✓ ') + message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 4000);
  } catch (e) {
    // Non-critical toast error
  }
}

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const clearSessionAndRedirect = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('edunova_token');
  localStorage.removeItem('edunova_refresh_token');
  localStorage.removeItem('edunova_user');

  if (!window.location.pathname.includes('/login')) {
    showToast('Your session has expired. Please sign in again.', 'error');
    window.location.href = '/login';
  }
};

/**
 * Centralized API Client Fetch Wrapper
 */
export async function apiClient(endpoint, options = {}, isRetry = false) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('edunova_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // Transmit HTTP-only JWT cookies
  };

  const attemptFetch = (baseUrl, requestConfig = config) => {
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    return fetch(url, requestConfig);
  };

  try {
    let response;
    try {
      response = await attemptFetch(activeBaseUrl);
    } catch (netErr) {
      // Primary URL failed -> Attempt alternate backend URLs
      let fallbackSuccess = false;
      for (const candUrl of CANDIDATE_URLS) {
        if (candUrl !== activeBaseUrl) {
          try {
            response = await attemptFetch(candUrl);
            activeBaseUrl = candUrl; // Save working URL!
            fallbackSuccess = true;
            break;
          } catch (e) {
            // Keep trying next candidate
          }
        }
      }
      if (!fallbackSuccess) throw netErr;
    }

    // ── 401 Interceptor: Auto-Refresh Access Token or Dispatch Session Expiry ──
    if (
      response.status === 401 &&
      !isRetry &&
      !endpoint.includes('/auth/login') &&
      !endpoint.includes('/auth/refresh')
    ) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('edunova:unauthorized', {
            detail: { endpoint, timestamp: Date.now() },
          })
        );
      }

      const refreshToken =
        typeof window !== 'undefined' ? localStorage.getItem('edunova_refresh_token') : null;

      if (!refreshToken) {
        const sessionError = new Error('Session expired');
        processQueue(sessionError);
        clearSessionAndRedirect();
        throw sessionError;
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          return apiClient(endpoint, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
          }, true);
        });
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${activeBaseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ refreshToken }),
        });
        const refreshData = await refreshRes.json();
        const newToken = refreshData.token || refreshData.data?.token;
        const newRefreshToken = refreshData.refreshToken || refreshData.data?.refreshToken;

        if (refreshRes.ok && refreshData.success && newToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('edunova_token', newToken);
            if (newRefreshToken) {
              localStorage.setItem('edunova_refresh_token', newRefreshToken);
            }
          }
          processQueue(null, newToken);
          return apiClient(
            endpoint,
            {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
              },
            },
            true
          );
        } else {
          const sessionError = new Error('Session expired');
          processQueue(sessionError);
          clearSessionAndRedirect();
          throw sessionError;
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearSessionAndRedirect();
        throw refreshErr;
      } finally {
        isRefreshing = false;
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      const errorMessage = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;

      // Don't toast for silent /auth/me checks when unauthenticated
      if (endpoint !== '/auth/me' && response.status !== 401) {
        showToast(errorMessage, 'error');
      }

      throw error;
    }

    return data;
  } catch (error) {
    if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('edunova:network-error', { detail: { url: activeBaseUrl } }));
      }
      const connMsg = `Cannot connect to server at ${activeBaseUrl}. Ensure backend is active.`;
      throw new Error(connMsg);
    }
    throw error;
  }
}

// ── REST Convenience Verbs ────────────────────────────────────────────────────
apiClient.get = (url, options = {}) => apiClient(url, { ...options, method: 'GET' });
apiClient.post = (url, data, options = {}) =>
  apiClient(url, {
    ...options,
    method: 'POST',
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
apiClient.patch = (url, data, options = {}) =>
  apiClient(url, {
    ...options,
    method: 'PATCH',
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
apiClient.put = (url, data, options = {}) =>
  apiClient(url, {
    ...options,
    method: 'PUT',
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
apiClient.delete = (url, options = {}) => apiClient(url, { ...options, method: 'DELETE' });


// ══════════════════════════════════════════════════════════════════════════════
// MODULAR SDK ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * A. Authentication Module (`/api/auth`)
 */
export const authApi = {
  requestPasswordReset: (email) =>
    apiClient('/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: ({ email, code, password }) =>
    apiClient('/auth/password-reset/confirm', {
      method: 'POST',
      body: JSON.stringify({ email, code, password }),
    }),

  googleLogin: ({ idToken, role = 'STUDENT', learnerType = 'SCHOOL' }) =>
    apiClient('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken, role, learnerType }),
    }),

  register: (payload) =>
    apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: ({ email, phone, studentUsername, password }) =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, phone, studentUsername, password }),
    }),

  logout: () =>
    apiClient('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => apiClient('/auth/me'),

  linkParent: (studentUsername) =>
    apiClient('/auth/link-parent', {
      method: 'POST',
      body: JSON.stringify({ studentUsername }),
    }),
};

/**
 * B. Subject & Curriculum Module (`/api/subjects`)
 */
export const subjectApi = {
  getSubjects: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/subjects${query ? `?${query}` : ''}`);
  },

  getSubject: (id) => apiClient(`/subjects/${id}`),

  selectSubject: (subjectId) =>
    apiClient('/subjects/select', {
      method: 'POST',
      body: JSON.stringify({ subjectId }),
    }),

  getEnrolledSubjects: () => apiClient('/subjects/enrolled'),

  unenrollSubject: (subjectId) =>
    apiClient(`/subjects/${subjectId}/enrollment`, {
      method: 'DELETE',
    }),

  updateProgress: (id, { progress, syllabusCoverage, targetScore, weakTopics }) =>
    apiClient(`/subjects/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progress, syllabusCoverage, targetScore, weakTopics }),
    }),
};

/**
 * C. Course & Module Module (`/api/courses`)
 */
export const courseApi = {
  getCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/courses${query ? `?${query}` : ''}`);
  },

  getCourse: (id) => apiClient(`/courses/${id}`),

  getMyEnrolled: () => apiClient('/courses/enrolled/me'),

  enrollCourse: (id) =>
    apiClient(`/courses/${id}/enroll`, {
      method: 'POST',
    }),

  completeModule: (courseId, moduleId) =>
    apiClient(`/courses/${courseId}/modules/${moduleId}/complete`, {
      method: 'POST',
    }),
};

/**
 * D. Gamification & Progression Module (`/api/gamification`)
 */
export const gamificationApi = {
  getSummary: () => apiClient('/gamification/summary'),

  getMissions: (period) =>
    apiClient(`/gamification/missions${period ? `?period=${period}` : ''}`),

  completeMission: (id) =>
    apiClient(`/gamification/missions/${id}/complete`, {
      method: 'POST',
    }),

  addXp: (amount, sourceTitle = 'Learning Activity') =>
    apiClient('/gamification/xp', {
      method: 'POST',
      body: JSON.stringify({ amount, sourceTitle }),
    }),

  getXpHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/gamification/xp${query ? `?${query}` : ''}`);
  },

  updateStreak: () =>
    apiClient('/gamification/streak', {
      method: 'POST',
    }),

  getLeaderboard: (limit = 20) =>
    apiClient(`/gamification/leaderboard?limit=${limit}`),
};

/**
 * E. Admin Module (`/api/admin`)
 */
export const adminApi = {
  getMetrics: () => apiClient('/admin/metrics'),

  getCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/admin/courses${query ? `?${query}` : ''}`);
  },

  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/admin/users${query ? `?${query}` : ''}`);
  },

  updateUserRole: (id, role) =>
    apiClient(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  createCourse: (data) =>
    apiClient('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCourse: (id, data) =>
    apiClient(`/admin/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  getSubjects: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/admin/subjects${query ? `?${query}` : ''}`);
  },

  createSubject: (data) =>
    apiClient('/admin/subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateSubject: (id, data) =>
    apiClient(`/admin/subjects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteContent: (type, id) =>
    apiClient(`/admin/content/${type}/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * F. Parent Companion Module (`/api/parents`)
 */
export const parentApi = {
  getChildOverview: () => apiClient('/parents/child-overview'),
};

/**
 * G. Realtime Conversation & Chat Module (`/api/conversations`)
 */
export const conversationApi = {
  getConversations: () => apiClient('/conversations'),

  getConversation: (id) => apiClient(`/conversations/${id}`),

  getMessages: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/conversations/${id}/messages${query ? `?${query}` : ''}`);
  },

  sendMessage: (id, { content, messageType = 'TEXT', fileUrl = null }) =>
    apiClient(`/conversations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, messageType, fileUrl }),
    }),
};

/**
 * H. Peer Skill Exchange Module (`/api/exchanges`)
 */
export const exchangeApi = {
  getExchanges: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/exchanges${query ? `?${query}` : ''}`);
  },

  getExchange: (id) => apiClient(`/exchanges/${id}`),

  requestExchange: ({ receiverId, skillOffered, skillWanted }) =>
    apiClient('/exchanges/request', {
      method: 'POST',
      body: JSON.stringify({ receiverId, skillOffered, skillWanted }),
    }),

  updateStatus: (id, status) =>
    apiClient(`/exchanges/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

/**
 * I. Sage AI Intelligence Module (`/api/ai`)
 */
export const aiApi = {
  chat: ({ message, history = [] }) =>
    apiClient('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),

  generateQuiz: ({ subject, topic, questionCount = 5, difficulty = 'INTERMEDIATE' }) =>
    apiClient('/ai/quiz', {
      method: 'POST',
      body: JSON.stringify({ subject, topic, questionCount, difficulty }),
    }),

  generateWeakTopicPlan: ({ recentErrors = [], targetTopics = [] } = {}) =>
    apiClient('/ai/weak-topic-plan', {
      method: 'POST',
      body: JSON.stringify({ recentErrors, targetTopics }),
    }),

  getHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/ai/history${query ? `?${query}` : ''}`);
  },
};


/**
 * J. Quiz & Assessment Module (`/api/quizzes`)
 */
export const quizApi = {
  getQuizzes: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/quizzes${query ? `?${query}` : ''}`);
  },

  getQuiz: (id) => apiClient(`/quizzes/${id}`),

  submitQuiz: (id, answers, timeSpentSec = 0) =>
    apiClient(`/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpentSec }),
    }),

  createQuiz: (payload) =>
    apiClient('/quizzes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

/**
 * K. Performance Analytics Module (`/api/analytics`)
 */
export const analyticsApi = {
  getOverview: () => apiClient('/analytics/overview'),

  getStudentAnalytics: (userId) =>
    apiClient(`/analytics/student${userId ? `/${userId}` : ''}`),

  createStudySession: ({ subjectId, durationMinutes, plannedDate }) =>
    apiClient('/analytics/study-sessions', {
      method: 'POST',
      body: JSON.stringify({ subjectId, durationMinutes, plannedDate }),
    }),

  completeStudySession: (id) =>
    apiClient(`/analytics/study-sessions/${id}/complete`, {
      method: 'PATCH',
    }),
};

export const userApi = {
  getProfile: () => apiClient('/users/profile'),
  updateProfile: (profileData) =>
    apiClient('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

/**
 * L. Learner Profile & Goals Module (`/api/learners`)
 */
export const learnerApi = {
  getProfile: () => apiClient('/learners/profile'),

  getGoals: () => apiClient('/learners/goals'),

  addGoal: (goalData) =>
    apiClient('/learners/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    }),

  updateGoal: (id, goalData) =>
    apiClient(`/learners/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(goalData),
    }),

  deleteGoal: (id) =>
    apiClient(`/learners/goals/${id}`, {
      method: 'DELETE',
    }),

  updateLearnerType: (payload) => {
    const body = typeof payload === 'string' ? { learnerType: payload } : payload;
    return apiClient('/learners/type', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  completeOnboarding: (payload) =>
    apiClient('/learners/onboarding', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

/**
 * M. Smart Notes Module (`/api/notes`)
 */
export const noteApi = {
  getNotes: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/notes${query ? '?' + query : ''}`);
  },
  getSummary: () => apiClient('/notes/summary'),
  getTags: () => apiClient('/notes/tags'),
  getNote: (id) => apiClient(`/notes/${id}`),
  createNote: (noteData) => apiClient('/notes', { method: 'POST', body: JSON.stringify(noteData) }),
  updateNote: (id, noteData) => apiClient(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(noteData) }),
  deleteNote: (id) => apiClient(`/notes/${id}`, { method: 'DELETE' }),
  togglePin: (id) => apiClient(`/notes/${id}/pin`, { method: 'POST' }),
  toggleFavorite: (id) => apiClient(`/notes/${id}/favorite`, { method: 'POST' }),
  generateSageNote: (payload) => apiClient('/notes/generate-sage', { method: 'POST', body: JSON.stringify(payload) }),
  createQuizFromNote: (id, payload) => apiClient(`/notes/${id}/create-quiz`, { method: 'POST', body: JSON.stringify(payload) }),
  createFlashcardsFromNote: (id, payload) => apiClient(`/notes/${id}/create-flashcards`, { method: 'POST', body: JSON.stringify(payload) }),
  addToStudyPlanner: (id, payload) => apiClient(`/notes/${id}/add-to-planner`, { method: 'POST', body: JSON.stringify(payload) }),
  askSageAboutNote: (id, payload) => apiClient(`/notes/${id}/ask-sage`, { method: 'POST', body: JSON.stringify(payload) }),
};

export default apiClient;
