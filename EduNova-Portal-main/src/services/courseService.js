import { courseApi } from '../lib/apiClient';

/**
 * Fetch courses from live PostgreSQL backend
 */
export const getCourses = async (learnerType = 'school', categoryFilter = 'All', searchQuery = '') => {
  try {
    const params = {};
    if (categoryFilter && categoryFilter !== 'All') {
      params.category = categoryFilter;
    }
    if (searchQuery) {
      params.search = searchQuery;
    }

    const res = await courseApi.getCourses(params);
    return res.data?.courses || [];
  } catch (error) {
    console.warn('Could not fetch courses from backend, returning empty list:', error.message);
    return [];
  }
};

/**
 * Fetch single course details with modules from backend
 */
export const getCourseById = async (id) => {
  try {
    const res = await courseApi.getCourse(id);
    return res.data || null;
  } catch (error) {
    console.warn(`Could not fetch course ${id} from backend:`, error.message);
    return null;
  }
};

/**
 * Mark a course module as completed (atomic transaction awarding XP)
 */
export const completeCourseModule = async (courseId, moduleId) => {
  try {
    const res = await courseApi.completeModule(courseId, moduleId);
    return res.data || null;
  } catch (error) {
    console.error('Failed to complete module:', error.message);
    throw error;
  }
};

/**
 * Fetch courses the student is enrolled in
 */
export const getMyEnrolledCourses = async () => {
  try {
    const res = await courseApi.getMyEnrolled();
    return res.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Enroll student in course
 */
export const enrollInCourse = async (courseId) => {
  try {
    const res = await courseApi.enrollCourse(courseId);
    return res.data || null;
  } catch (error) {
    throw error;
  }
};
