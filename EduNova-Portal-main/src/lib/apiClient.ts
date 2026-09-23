/**
 * Centralized EduNova API Client for Next.js / React (TypeScript)
 * 
 * Features:
 * - Configured with baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
 * - credentials: 'include' (passes HTTP-only JWT cookies automatically)
 * - Automatic 401 response interceptor for token refresh handling
 * - Modular SDK exports: authApi, subjectApi, courseApi, gamificationApi, adminApi, parentApi
 * - Return standard JSON: { success: boolean, message: string, data: any }
 */

// ── Types & Interfaces ────────────────────────────────────────────────────────

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
  pagination?: {
    nextCursor?: string;
    hasMore: boolean;
    count: number;
  };
}

export interface User {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT' | 'PARENT';
  learnerType: 'SCHOOL' | 'COLLEGE' | 'SKILLS' | 'EXAM';
  studentUsername?: string | null;
  avatar?: string | null;
  googleId?: string | null;
  createdAt: string;
  updatedAt?: string;
  learnerProfile?: LearnerProfile | null;
}

export interface LearnerProfile {
  id: string;
  userId: string;
  board?: string | null;
  degree?: string | null;
  goals: string[];
  weakTopics: string[];
  xp: number;
  level: number;
  streakDays: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  order: number;
}

export interface Subject {
  id: string;
  name: string;
  category: string;
  educationType: 'SCHOOL' | 'COLLEGE' | 'SKILLS' | 'EXAM';
  class?: string | null;
  board?: string | null;
  createdById?: string;
  topics?: Topic[];
  _count?: { progress: number };
}

export interface StudentSubjectProgress {
  id: string;
  userId: string;
  subjectId: string;
  progress: number;
  targetScore: number;
  syllabusCoverage: number;
  subject?: Subject;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  duration: number;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  rating: number;
  totalRatings: number;
  thumbnail?: string | null;
  isPublished: boolean;
  instructorId: string;
  instructor?: { id: string; name: string; avatar?: string | null };
  modules?: CourseModule[];
  _count?: { enrollments: number };
}

export interface UserCourseProgress {
  id: string;
  userId: string;
  courseId: string;
  completedModuleIds: string[];
  progress: number;
  enrolledAt: string;
  course?: Course;
}

export interface Mission {
  id: string;
  title: string;
  description?: string | null;
  rewardXp: number;
  category: string;
  period: 'DAILY' | 'WEEKLY';
  completed?: boolean;
  userProgress?: number;
  completedAt?: string | null;
}

export interface XpTransaction {
  id: string;
  userId: string;
  amount: number;
  sourceTitle: string;
  createdAt: string;
}

export interface AdminMetrics {
  systemHealth: string;
  uptime: number;
  databaseStatus: string;
  timestamp: string;
  users: {
    total: number;
    students: number;
    instructors: number;
    parents: number;
  };
  content: {
    totalCourses: number;
    publishedCourses: number;
    totalSubjects: number;
    totalEnrollments: number;
  };
  popularSubjects: Array<{
    id: string;
    name: string;
    category: string;
    studentCount: number;
  }>;
}

export interface ChildOverview {
  student: {
    id: string;
    name: string;
    studentUsername?: string | null;
    avatar?: string | null;
    learnerType: string;
    memberSince: string;
  };
  academics: {
    board: string;
    degree?: string | null;
    goals: string[];
    weakTopics: string[];
    totalSubjects: number;
    avgSubjectProgress: number;
    totalCourses: number;
    avgCourseProgress: number;
  };
  gamification: {
    xp: number;
    level: number;
    streakDays: number;
    recentActivity: XpTransaction[];
    completedMissions: Array<{
      title: string;
      rewardXp: number;
      completedAt: string | null;
    }>;
  };
  subjects: Array<{
    id: string;
    name: string;
    category: string;
    progress: number;
    syllabusCoverage: number;
    targetScore: number;
  }>;
  courses: Array<{
    id: string;
    title: string;
    category: string;
    progress: number;
    completedModulesCount: number;
    enrolledAt: string;
  }>;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'TEXT' | 'CODE' | 'FILE';
  fileUrl?: string | null;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string | null;
    role?: string;
    learnerType?: string;
  };
}

export interface ConversationMember {
  id: string;
  conversationId: string;
  userId: string;
  role: string;
  joinedAt: string;
  lastReadAt: string;
  name?: string;
  avatar?: string | null;
}

export interface Conversation {
  id: string;
  type: 'DIRECT' | 'COMMUNITY' | 'SKILL_EXCHANGE';
  createdAt: string;
  updatedAt: string;
  lastReadAt?: string;
  unreadCount?: number;
  lastMessage?: ChatMessage | null;
  peers?: Array<{
    id: string;
    name: string;
    avatar?: string | null;
    role: string;
    joinedAt: string;
  }>;
  skillExchange?: {
    id: string;
    skillOffered: string;
    skillWanted: string;
    status: string;
  } | null;
}

export interface SkillExchange {
  id: string;
  senderId: string;
  receiverId: string;
  skillOffered: string;
  skillWanted: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  conversationId?: string | null;
  createdAt: string;
  updatedAt: string;
  sender?: { id: string; name: string; avatar?: string | null };
  receiver?: { id: string; name: string; avatar?: string | null };
  conversation?: Conversation | null;
}

export interface QuizQuestion {
  id: string;
  quizId?: string;
  questionText: string;
  options: string[];
  correctOptionIndex?: number;
  explanation?: string | null;
  fingerprint?: string | null;
}

export interface Quiz {
  id: string;
  subjectId: string;
  topicId?: string | null;
  title: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  totalQuestions: number;
  subject?: { id: string; name: string; category?: string };
  topic?: { id: string; title: string };
  questions?: QuizQuestion[];
  _count?: { questions: number; attempts: number };
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpentSec: number;
  createdAt: string;
}

export interface QuizEvaluationResult {
  attemptId: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  xpAwarded: number;
  newXp: number;
  newLevel: number;
  weakTopics: string[];
  weakTopicsModified: boolean;
  detailedReview: Array<{
    questionId: string;
    questionText: string;
    options: string[];
    selectedOptionIndex: number;
    correctOptionIndex: number;
    isCorrect: boolean;
    explanation: string;
  }>;
}

export interface StudySession {
  id: string;
  userId: string;
  subjectId: string;
  durationMinutes: number;
  plannedDate: string;
  completed: boolean;
  subject?: { id: string; name: string; category?: string };
}

export interface LearnerOverview {
  learner: {
    id: string;
    name: string;
    learnerType: string;
    level: number;
    xp: number;
    streakDays: number;
  };
  studyHours: {
    plannedHours: number;
    completedHours: number;
    adherenceRate: string;
    totalSessions: number;
    completedSessions: number;
  };
  assessmentSummary: {
    totalQuizzesTaken: number;
    totalQuestionsAnswered: number;
    overallAccuracy: string;
    subjectMastery: Array<{
      subjectId: string;
      subjectName: string;
      category?: string;
      totalQuizzes: number;
      averageAccuracy: number;
      masteryLevel: 'MASTERED' | 'PROFICIENT' | 'NEEDS_WORK';
      recentHistory: Array<{ accuracy: number; date: string }>;
    }>;
  };
  revisionRadar: {
    totalWeakAreas: number;
    items: Array<{
      topic: string;
      urgency: 'HIGH' | 'MEDIUM' | 'LOW';
      recentAccuracy: string;
      suggestedAction: string;
      recommendedStudyMinutes: number;
    }>;
  };
  consistency: {
    streakDays: number;
    weeklyConsistencyRate: string;
    activeDaysLastWeek: number;
    weeklyHeatmap: Array<{ dayName: string; date: string; active: boolean }>;
  };
  curriculumProgress: Array<{
    subjectId: string;
    subjectName?: string;
    progress: number;
    syllabusCoverage: number;
    targetScore: number;
  }>;
}


// ── Client Configuration ──────────────────────────────────────────────────────

const BASE_URL: string =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  'http://localhost:5000/api';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Core HTTP Request Wrapper with 401 Token Refresh Interceptor
 */
export async function apiClient<T = any, R = ApiResponse<T>>(
  endpoint: string,
  options: RequestInit = {},
  isRetry: boolean = false
): Promise<R> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('edunova_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Automatically passes HTTP-only cookies
  };

  try {
    const response = await fetch(url, config);

    // ── 401 Interceptor: Auto-Refresh Access Token ──
    if (
      response.status === 401 &&
      !isRetry &&
      !endpoint.includes('/auth/login') &&
      !endpoint.includes('/auth/refresh')
    ) {
      const refreshToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('edunova_refresh_token')
          : null;

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          options.headers = {
            ...((options.headers as Record<string, string>) || {}),
            Authorization: `Bearer ${newToken}`,
          };
          return apiClient<T, R>(endpoint, options, true);
        });
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ refreshToken: refreshToken || '' }),
        });

        const refreshData = await refreshRes.json();

        if (refreshRes.ok && refreshData.success && refreshData.data?.token) {
          const newToken = refreshData.data.token;
          if (typeof window !== 'undefined') {
            localStorage.setItem('edunova_token', newToken);
          }
          processQueue(null, newToken);

          return apiClient<T, R>(endpoint, options, true);
        } else {
          processQueue(new Error('Session expired'), null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('edunova_token');
            localStorage.removeItem('edunova_refresh_token');
            localStorage.removeItem('edunova_user');
          }
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
      } finally {
        isRefreshing = false;
      }
    }

    const data: any = await response.json();

    if (!response.ok || !data.success) {
      const error: any = new Error(data.message || 'API request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data as R;
  } catch (error: any) {
    if (error.message?.includes('Failed to fetch')) {
      throw new Error(
        `Unable to reach EduNova API at ${BASE_URL}. Ensure the backend server is running.`
      );
    }
    throw error;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULAR SDK EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * A. Authentication Module (`/api/auth`)
 */
export const authApi = {
  sendOtp: (phone: string): Promise<ApiResponse<{ message: string; expiresAt: string; devOtp?: string }>> =>
    apiClient('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (payload: {
    phone: string;
    otp: string;
    name?: string;
    role?: 'STUDENT' | 'INSTRUCTOR' | 'PARENT';
    learnerType?: 'SCHOOL' | 'COLLEGE' | 'SKILLS' | 'EXAM';
  }): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>> =>
    apiClient('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  googleLogin: (payload: {
    idToken: string;
    role?: 'STUDENT' | 'INSTRUCTOR' | 'PARENT';
    learnerType?: 'SCHOOL' | 'COLLEGE' | 'SKILLS' | 'EXAM';
  }): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>> =>
    apiClient('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  register: (payload: {
    name: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: 'STUDENT' | 'INSTRUCTOR' | 'PARENT';
    learnerType?: 'SCHOOL' | 'COLLEGE' | 'SKILLS' | 'EXAM';
    studentUsername?: string;
  }): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>> =>
    apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: {
    email?: string;
    phone?: string;
    studentUsername?: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>> =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: (): Promise<ApiResponse<{ message: string }>> =>
    apiClient('/auth/logout', {
      method: 'POST',
    }),

  getMe: (): Promise<ApiResponse<User>> =>
    apiClient('/auth/me'),

  linkParent: (studentUsername: string): Promise<ApiResponse<{ parent: User; linkedStudent: User }>> =>
    apiClient('/auth/link-parent', {
      method: 'POST',
      body: JSON.stringify({ studentUsername }),
    }),
};

/**
 * B. Subject & Curriculum Module (`/api/subjects`)
 */
export const subjectApi = {
  getSubjects: (params: {
    educationType?: 'SCHOOL' | 'COLLEGE' | 'SKILLS' | 'EXAM';
    board?: string;
    className?: string;
    category?: string;
    search?: string;
  } = {}): Promise<ApiResponse<Subject[]>> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient(`/subjects${query ? `?${query}` : ''}`);
  },

  getSubject: (id: string): Promise<ApiResponse<Subject>> =>
    apiClient(`/subjects/${id}`),

  selectSubject: (subjectId: string): Promise<ApiResponse<StudentSubjectProgress>> =>
    apiClient('/subjects/select', {
      method: 'POST',
      body: JSON.stringify({ subjectId }),
    }),

  getEnrolledSubjects: (): Promise<ApiResponse<StudentSubjectProgress[]>> =>
    apiClient('/subjects/enrolled'),

  unenrollSubject: (subjectId: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient(`/subjects/${subjectId}/enrollment`, {
      method: 'DELETE',
    }),

  updateProgress: (
    id: string,
    payload: {
      progress?: number;
      syllabusCoverage?: number;
      targetScore?: number;
      weakTopics?: string[];
    }
  ): Promise<ApiResponse<{ progress: StudentSubjectProgress; weakTopics?: string[] }>> =>
    apiClient(`/subjects/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};

/**
 * C. Course & Module Engine (`/api/courses`)
 */
export const courseApi = {
  getCourses: (params: {
    category?: string;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<{ courses: Course[]; total: number; page: number; totalPages: number }>> => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/courses${query ? `?${query}` : ''}`);
  },

  getCourse: (id: string): Promise<ApiResponse<Course>> =>
    apiClient(`/courses/${id}`),

  getMyEnrolled: (): Promise<ApiResponse<UserCourseProgress[]>> =>
    apiClient('/courses/enrolled/me'),

  enrollCourse: (id: string): Promise<ApiResponse<UserCourseProgress>> =>
    apiClient(`/courses/${id}/enroll`, {
      method: 'POST',
    }),

  completeModule: (
    courseId: string,
    moduleId: string
  ): Promise<ApiResponse<{
    enrollment: UserCourseProgress;
    completedModuleId: string;
    isFirstTimeCompletion: boolean;
    xpAwarded: number;
    newXp: number;
    newLevel: number;
  }>> =>
    apiClient(`/courses/${courseId}/modules/${moduleId}/complete`, {
      method: 'POST',
    }),
};

/**
 * D. Gamification Module (`/api/gamification`)
 */
export const gamificationApi = {
  getSummary: (): Promise<ApiResponse<{
    xp: number;
    level: number;
    streakDays: number;
    nextLevelXp: number;
    currentLevelBaseXp: number;
    progressPercent: number;
    xpHistory: XpTransaction[];
  }>> => apiClient('/gamification/summary'),

  getMissions: (period?: 'DAILY' | 'WEEKLY'): Promise<ApiResponse<Mission[]>> =>
    apiClient(`/gamification/missions${period ? `?period=${period}` : ''}`),

  completeMission: (id: string): Promise<ApiResponse<{
    userMission: any;
    missionTitle: string;
    rewardXp: number;
    newXp: number;
    newLevel: number;
    streakDays: number;
  }>> =>
    apiClient(`/gamification/missions/${id}/complete`, {
      method: 'POST',
    }),

  getXpHistory: (params: { page?: number; limit?: number } = {}): Promise<ApiResponse<{
    transactions: XpTransaction[];
    total: number;
    page: number;
    totalPages: number;
  }>> => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/gamification/xp-history${query ? `?${query}` : ''}`);
  },

  getLeaderboard: (limit: number = 20): Promise<ApiResponse<Array<{
    rank: number;
    userId: string;
    name: string;
    avatar?: string | null;
    xp: number;
    level: number;
    streakDays: number;
  }>>> =>
    apiClient(`/gamification/leaderboard?limit=${limit}`),
};

/**
 * E. Admin & Creator/Owner Module (`/api/admin`) - Protected by requireRole('ADMIN')
 */
export const adminApi = {
  getMetrics: (): Promise<ApiResponse<AdminMetrics>> =>
    apiClient('/admin/metrics'),

  getUsers: (params: {
    role?: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT' | 'PARENT';
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<{ users: User[]; total: number; page: number; totalPages: number }>> => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/admin/users${query ? `?${query}` : ''}`);
  },

  updateUserRole: (
    id: string,
    role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT' | 'PARENT'
  ): Promise<ApiResponse<User>> =>
    apiClient(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  createCourse: (data: {
    title: string;
    category: string;
    description?: string;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    thumbnail?: string;
    instructorId?: string;
    modules?: Array<{ title: string; duration?: number; order?: number }>;
  }): Promise<ApiResponse<Course>> =>
    apiClient('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteContent: (
    type: 'course' | 'subject',
    id: string
  ): Promise<ApiResponse<{ message: string; type: string; id: string }>> =>
    apiClient(`/admin/content/${type}/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * F. Parent Companion Module (`/api/parents`) - Protected by requireRole('PARENT')
 */
export const parentApi = {
  getChildOverview: (): Promise<ApiResponse<ChildOverview>> =>
    apiClient('/parents/child-overview'),
};

/**
 * G. Realtime Conversation & Chat Module (`/api/conversations`)
 */
export const conversationApi = {
  getConversations: (): Promise<ApiResponse<Conversation[]>> =>
    apiClient('/conversations'),

  getConversation: (id: string): Promise<ApiResponse<Conversation>> =>
    apiClient(`/conversations/${id}`),

  getMessages: (
    id: string,
    params: { cursor?: string; limit?: number } = {}
  ): Promise<ApiResponse<ChatMessage[]> & { pagination: { nextCursor?: string; hasMore: boolean; count: number } }> => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient<
      ChatMessage[],
      ApiResponse<ChatMessage[]> & { pagination: { nextCursor?: string; hasMore: boolean; count: number } }
    >(`/conversations/${id}/messages${query ? `?${query}` : ''}`);
  },

  sendMessage: (
    id: string,
    payload: { content: string; messageType?: 'TEXT' | 'CODE' | 'FILE'; fileUrl?: string }
  ): Promise<ApiResponse<ChatMessage>> =>
    apiClient(`/conversations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

/**
 * H. Peer Skill Exchange Module (`/api/exchanges`)
 */
export const exchangeApi = {
  getExchanges: (params: { status?: string; type?: 'sent' | 'received' | 'all' } = {}): Promise<ApiResponse<SkillExchange[]>> => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/exchanges${query ? `?${query}` : ''}`);
  },

  getExchange: (id: string): Promise<ApiResponse<SkillExchange>> =>
    apiClient(`/exchanges/${id}`),

  requestExchange: (payload: {
    receiverId: string;
    skillOffered: string;
    skillWanted: string;
  }): Promise<ApiResponse<SkillExchange>> =>
    apiClient('/exchanges/request', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateStatus: (
    id: string,
    status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED'
  ): Promise<ApiResponse<SkillExchange>> =>
    apiClient(`/exchanges/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

/**
 * I. Sage AI Intelligence Module (`/api/ai`)
 */
export const aiApi = {
  chat: (payload: {
    message: string;
    history?: Array<{ role: 'user' | 'model' | 'assistant'; parts?: any; content?: string }>;
  }): Promise<ApiResponse<{
    reply: string;
    model: string;
    studentContext: {
      name: string;
      level: number;
      streakDays: number;
      weakTopics: string[];
    };
  }>> =>
    apiClient('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  generateQuiz: (payload: {
    subject: string;
    topic: string;
    questionCount?: number;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  }): Promise<ApiResponse<{
    title: string;
    subject: string;
    topic: string;
    difficulty: string;
    totalQuestions: number;
    questions: Array<{
      id: number;
      question: string;
      codeSnippet?: string | null;
      options: string[];
      correctIndex: number;
      correctAnswer: string;
      explanation: string;
      bloomTaxonomy?: string;
    }>;
  }>> =>
    apiClient('/ai/quiz', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  generateWeakTopicPlan: (payload: {
    recentErrors?: Array<{ question: string; studentAnswer: string; correctAnswer: string; topic?: string }>;
    targetTopics?: string[];
  } = {}): Promise<ApiResponse<{
    studentName: string;
    diagnosticSummary: string;
    targetRecoveryAreas: Array<{
      topic: string;
      coreMisconception: string;
      actionableSteps: string[];
      practiceProblem?: string;
      estimatedMinutes: number;
    }>;
    threeDayPlan: Array<{
      day: number;
      focus: string;
      tasks: string[];
      xpReward: number;
    }>;
  }>> =>
    apiClient('/ai/weak-topic-plan', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getHistory: (params: { page?: number; limit?: number } = {}): Promise<ApiResponse<{
    history: Array<{
      id: string;
      userId: string;
      title: string;
      prompt: string;
      response: string;
      metadata?: any;
      createdAt: string;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }>> => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/ai/history${query ? `?${query}` : ''}`);
  },
};

/**
 * J. Quiz & Assessment Module (`/api/quizzes`)
 */
export const quizApi = {
  getQuizzes: (params?: {
    subjectId?: string;
    topicId?: string;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    search?: string;
  }): Promise<ApiResponse<Quiz[]>> => {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    return apiClient(`/quizzes${query ? `?${query}` : ''}`);
  },

  getQuiz: (id: string): Promise<ApiResponse<Quiz>> =>
    apiClient(`/quizzes/${id}`),

  submitQuiz: (
    id: string,
    answers: Array<{ questionId: string; selectedOptionIndex: number }> | Record<string, number>,
    timeSpentSec: number = 0
  ): Promise<ApiResponse<QuizEvaluationResult>> =>
    apiClient(`/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpentSec }),
    }),

  createQuiz: (payload: {
    subjectId: string;
    topicId?: string | null;
    title: string;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    questions: Array<{
      questionText: string;
      options: string[];
      correctOptionIndex: number;
      explanation?: string;
      fingerprint?: string;
    }>;
  }): Promise<ApiResponse<Quiz>> =>
    apiClient('/quizzes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

/**
 * K. Performance Analytics Module (`/api/analytics`)
 */
export const analyticsApi = {
  getOverview: (): Promise<ApiResponse<LearnerOverview>> =>
    apiClient('/analytics/overview'),

  getStudentAnalytics: (userId?: string): Promise<ApiResponse<LearnerOverview>> =>
    apiClient(`/analytics/student${userId ? `/${userId}` : ''}`),

  createStudySession: (payload: {
    subjectId: string;
    durationMinutes: number;
    plannedDate?: string;
  }): Promise<ApiResponse<StudySession>> =>
    apiClient('/analytics/study-sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  completeStudySession: (id: string): Promise<ApiResponse<{ session: StudySession; xpEarned: number }>> =>
    apiClient(`/analytics/study-sessions/${id}/complete`, {
      method: 'PATCH',
    }),
};

/**
 * L. Learner Profile & Goals Module (`/api/learners`)
 */
export const learnerApi = {
  getProfile: (): Promise<ApiResponse<LearnerProfile>> =>
    apiClient('/learners/profile'),

  getGoals: (): Promise<ApiResponse<any[]>> =>
    apiClient('/learners/goals'),

  addGoal: (goalData: any): Promise<ApiResponse<any>> =>
    apiClient('/learners/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    }),

  updateGoal: (id: string, goalData: any): Promise<ApiResponse<any>> =>
    apiClient(`/learners/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(goalData),
    }),

  deleteGoal: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient(`/learners/goals/${id}`, {
      method: 'DELETE',
    }),

  updateLearnerType: (payload: any): Promise<ApiResponse<{ user: User; profile: LearnerProfile }>> => {
    const body = typeof payload === 'string' ? { learnerType: payload } : payload;
    return apiClient('/learners/type', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
};

export const userApi = {
  getProfile: (): Promise<ApiResponse<User>> => apiClient('/users/profile'),
  updateProfile: (profileData: any): Promise<ApiResponse<User>> =>
    apiClient('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

export default apiClient;


