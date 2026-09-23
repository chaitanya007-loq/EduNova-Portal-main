const STORAGE_KEY = 'edunova_education_context';

export const DEFAULT_CONTEXTS = {
  school: { educationType: 'school', selectedSubjects: [] },
  college: { educationType: 'college', selectedSubjects: [] },
  exam: { educationType: 'exam', selectedSubjects: [] },
  skills: { educationType: 'skills', selectedSubjects: [] }
};

/**
 * Get active education context from localStorage, user profile, or default learner type
 */
export const getEducationContext = (userProfile = null) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Could not load education context from localStorage', e);
  }

  // Infer from userProfile if available
  if (userProfile && userProfile.learnerType) {
    const type = userProfile.learnerType.toLowerCase();
    if (DEFAULT_CONTEXTS[type]) {
      return {
        ...DEFAULT_CONTEXTS[type],
        ...(userProfile.degree && { degree: userProfile.degree }),
        ...(userProfile.branch && { branch: userProfile.branch }),
        ...(userProfile.semester && { semester: userProfile.semester }),
        ...(userProfile.classLevel && { classLevel: userProfile.classLevel }),
        ...(userProfile.exam && { examTarget: userProfile.exam })
      };
    }
  }

  return DEFAULT_CONTEXTS.college;
};

/**
 * Save updated education context
 */
export const setEducationContext = (newContext) => {
  try {
    const current = getEducationContext();
    const updated = { ...current, ...newContext };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save education context', e);
    return newContext;
  }
};

/**
 * Switch education mode directly
 */
export const switchEducationMode = (modeKey) => {
  if (DEFAULT_CONTEXTS[modeKey]) {
    const updated = DEFAULT_CONTEXTS[modeKey];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
  return getEducationContext();
};

export default {
  getEducationContext,
  setEducationContext,
  switchEducationMode,
  DEFAULT_CONTEXTS
};
