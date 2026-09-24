// EduNova Student Subject Management Service

import { ALL_SUBJECTS, DEFAULT_STUDENT_SUBJECTS } from '../data/subjects';
import { getStoredLearnerProfile } from '../data/learners';
import { subjectApi } from '../lib/apiClient';

const STORAGE_KEY = 'edunova_selected_student_subjects';
const STORAGE_KEY_BOOKMARKS = 'edunova_subject_bookmarks';
const STORAGE_KEY_NOTES = 'edunova_subject_personal_notes';

class SubjectService {
  constructor() {
    this.listeners = new Set();
    this.studentSubjects = this.loadStoredSubjects();
  }

  deduplicateSubjects(list) {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    return list.filter(item => {
      if (!item || !item.id) return false;
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  loadStoredSubjects() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const deduplicated = this.deduplicateSubjects(parsed);
          const sanitized = deduplicated.map(s => {
            const hasActivity = Boolean(
              s.hasStudied ||
              (Array.isArray(s.completedQuizzes) && s.completedQuizzes.length > 0) ||
              (Array.isArray(s.completedChapters) && s.completedChapters.length > 0) ||
              (typeof s.userProgress === 'number' && s.userProgress > 0)
            );
            return {
              ...s,
              track: s.educationType || s.track || 'college',
              progress: hasActivity ? (typeof s.progress === 'number' ? s.progress : 0) : 0,
              xp: hasActivity ? (typeof s.xp === 'number' ? s.xp : 0) : 0,
              streak: hasActivity ? (typeof s.streak === 'number' ? s.streak : 0) : 0,
              level: hasActivity ? (s.level || 1) : 1
            };
          });
          // Update localStorage with clean sanitized state
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
          } catch (e) {}
          return sanitized;
        }
      }
    } catch (e) {
      console.error('Error reading student subjects from localStorage:', e);
    }
    
    // Default fallback based on initial learner track
    const activeLearner = getStoredLearnerProfile();
    const track = activeLearner?.learnerType || 'college';
    const defaultIds = DEFAULT_STUDENT_SUBJECTS[track] || DEFAULT_STUDENT_SUBJECTS.college;
    
    const freshSubjects = ALL_SUBJECTS.filter(s => defaultIds.includes(s.id)).map((s, idx) => ({
      ...s,
      track: s.educationType || track,
      order: idx,
      targetScore: s.defaultTargetScore || 90,
      weeklyGoal: s.defaultWeeklyGoal || 4,
      progress: 0,
      streak: 0,
      xp: 0,
      level: 1,
      selectedAt: new Date().toISOString()
    }));

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshSubjects));
    } catch (e) {}

    return freshSubjects;
  }

  saveSubjects(subjects) {
    const deduplicated = this.deduplicateSubjects(subjects);
    this.studentSubjects = deduplicated;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deduplicated));
    } catch (e) {
      console.error('Error saving student subjects to localStorage:', e);
    }
    this.notifyListeners();
    return this.studentSubjects;
  }

  // Get currently selected student subjects (Deduplicated & Track-Tailored)
  getSelectedSubjects(learnerType = null) {
    let subjects = this.deduplicateSubjects(this.studentSubjects);
    if (learnerType) {
      const matched = subjects.filter(s => s.educationType === learnerType || s.track === learnerType);
      if (matched.length > 0) {
        subjects = matched;
      } else {
        const defaultIds = DEFAULT_STUDENT_SUBJECTS[learnerType] || DEFAULT_STUDENT_SUBJECTS.college;
        const initial = ALL_SUBJECTS.filter(s => defaultIds.includes(s.id)).map((s, idx) => ({
          ...s,
          track: s.educationType || learnerType,
          order: idx,
          targetScore: s.defaultTargetScore || 90,
          weeklyGoal: s.defaultWeeklyGoal || 4,
          progress: 0,
          streak: 0,
          xp: 0,
          level: 1,
          selectedAt: new Date().toISOString()
        }));
        
        const combined = this.deduplicateSubjects([...this.studentSubjects, ...initial]);
        this.studentSubjects = combined;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
        } catch (e) {
          console.error('Error writing subjects to localStorage:', e);
        }
        subjects = initial;
      }
    }
    return [...this.deduplicateSubjects(subjects)].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  async getStudentSubjects() {
    const response = await subjectApi.getEnrolledSubjects();
    const enrollments = Array.isArray(response?.data) ? response.data : [];
    return enrollments
      .filter((enrollment) => enrollment.subject)
      .map((enrollment) => ({
        ...enrollment.subject,
        progress: enrollment.progress ?? 0,
        syllabusCoverage: enrollment.syllabusCoverage ?? 0,
        targetScore: enrollment.targetScore ?? 90,
        weakTopics: enrollment.weakTopics ?? [],
      }));
  }

  // Reorder subjects (Move Up / Move Down)
  reorderSubjects(subjectId, direction) {
    const list = [...this.studentSubjects];
    const index = list.findIndex(s => s.id === subjectId);
    if (index < 0) return this.studentSubjects;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return this.studentSubjects;

    // Swap positions
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Re-assign order indices
    const updated = list.map((s, i) => ({ ...s, order: i }));
    this.saveSubjects(updated);
    return updated;
  }

  // Add a subject to student's personalized list
  addSubject(subjectId) {
    const exists = this.studentSubjects.some(s => s.id === subjectId);
    if (!exists) {
      const baseSubject = ALL_SUBJECTS.find(s => s.id === subjectId);
      if (baseSubject) {
        const updated = [...this.studentSubjects, { 
          ...baseSubject, 
          track: baseSubject.educationType || 'college',
          order: this.studentSubjects.length,
          targetScore: baseSubject.defaultTargetScore || 90,
          weeklyGoal: baseSubject.defaultWeeklyGoal || 4,
          progress: 0,
          streak: 0,
          xp: 0,
          level: 1,
          selectedAt: new Date().toISOString() 
        }];
        this.saveSubjects(updated);
      }
    }
    // Async persist to PostgreSQL
    subjectApi.selectSubject(subjectId).catch(err => {
      console.warn('Subject enrollment backend error:', err.message);
    });
    return this.studentSubjects;
  }

  // Remove a subject from student's personalized list
  removeSubject(subjectId) {
    const updated = this.studentSubjects.filter(s => s.id !== subjectId);
    this.saveSubjects(updated);
    // Async persist to PostgreSQL
    subjectApi.unenrollSubject(subjectId).catch(err => {
      console.warn('Subject unenrollment backend error:', err.message);
    });
    return this.studentSubjects;
  }

  // Update subject configuration (Priority, Target Score %, Weekly Goal hours, Difficulty)
  updateSubjectConfig(subjectId, updates) {
    const updated = this.studentSubjects.map(s => {
      if (s.id === subjectId) {
        return { ...s, ...updates };
      }
      return s;
    });
    this.saveSubjects(updated);
    // Async persist to PostgreSQL
    subjectApi.updateProgress(subjectId, {
      progress: updates.progress,
      syllabusCoverage: updates.syllabusCoverage,
      targetScore: updates.targetScore,
      weakTopics: updates.weakTopics,
    }).catch(err => {
      console.warn('Subject progress update backend error:', err.message);
    });
    return this.studentSubjects;
  }


  // Calculate compact summary statistics for My Subjects Hub header
  getSubjectStats(learnerType = null) {
    const active = this.getSelectedSubjects(learnerType);
    if (active.length === 0) {
      return { activeCount: 0, avgProgress: 0, streakDays: 0, weeklyHours: '0h', totalXP: 0 };
    }

    const totalProgress = active.reduce((acc, curr) => acc + (typeof curr.progress === 'number' ? curr.progress : 0), 0);
    const avgProgress = active.length > 0 ? Math.round(totalProgress / active.length) : 0;
    const totalXP = active.reduce((acc, curr) => acc + (typeof curr.xp === 'number' ? curr.xp : 0), 0);
    const maxStreak = active.reduce((max, curr) => Math.max(max, curr.streak || 0), 0);
    const totalHoursStudied = active.reduce((acc, curr) => acc + (curr.hoursStudied || 0), 0);
    const weeklyHours = totalHoursStudied > 0 ? `${totalHoursStudied}h` : '0h 0m';

    return {
      activeCount: active.length,
      avgProgress,
      streakDays: maxStreak,
      weeklyHours,
      totalXP
    };
  }

  // Get Topics to Improve (<75% accuracy/progress) and Strong Topics (>88%)
  getWeakAndStrongTopics(learnerType = null) {
    const active = this.getSelectedSubjects(learnerType);
    const weakList = [];
    const strongList = [];

    active.forEach((s) => {
      const progress = typeof s.progress === 'number' ? s.progress : 0;
      // Do not create weak or strong topics if user has not started or tested yet
      if (progress === 0 || (!s.completedQuizzes && !s.hasStudied)) {
        return;
      }

      if (s.weakTopic) {
        weakList.push({
          subjectName: s.name,
          topic: s.weakTopic,
          score: 68,
          subjectColor: s.color || '#6366f1'
        });
      }
      
      const currentChapter = s.currentChapter || `${s.name} Foundations`;

      if (progress >= 80) {
        strongList.push({
          subjectName: s.name,
          topic: currentChapter,
          score: progress,
          subjectColor: s.color || '#34d399'
        });
      } else if (!s.weakTopic && progress < 75) {
        weakList.push({
          subjectName: s.name,
          topic: currentChapter,
          score: progress,
          subjectColor: s.color || '#f59e0b'
        });
      }
    });

    return { weakTopics: weakList.slice(0, 3), strongTopics: strongList.slice(0, 3) };
  }

  // Get Quiz Performance Mini Sparkline Trend Data
  getQuizPerformanceTrend(subjectId) {
    const subject = this.getSubjectById(subjectId);
    const baseScore = typeof subject?.progress === 'number' ? subject.progress : 0;

    if (baseScore === 0) {
      return {
        scores: [],
        status: 'Not Started',
        trendColor: '#94a3b8'
      };
    }

    if (baseScore >= 80) {
      return {
        scores: [Math.max(0, baseScore - 12), Math.max(0, baseScore - 5), baseScore],
        status: 'Improving',
        trendColor: '#34d399'
      };
    } else if (baseScore < 60) {
      return {
        scores: [baseScore + 8, baseScore + 2, baseScore],
        status: 'Needs Attention',
        trendColor: '#fb7185'
      };
    }

    return {
      scores: [Math.max(0, baseScore - 8), Math.max(0, baseScore - 2), baseScore],
      status: 'Improving',
      trendColor: '#38bdf8'
    };
  }

  // Get all available subjects in system for catalog selection
  getAllAvailableSubjects(learnerType = null) {
    if (learnerType) {
      return ALL_SUBJECTS.filter(s => s.educationType === learnerType || s.track === learnerType);
    }
    return ALL_SUBJECTS;
  }

  // Get subject details by ID
  getSubjectById(subjectId) {
    const foundInSelected = this.studentSubjects.find(s => s.id === subjectId);
    if (foundInSelected) return foundInSelected;
    return ALL_SUBJECTS.find(s => s.id === subjectId) || ALL_SUBJECTS[0];
  }

  // Bookmarks Management
  getBookmarks(subjectId = null) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      const all = saved ? JSON.parse(saved) : [];
      if (subjectId) return all.filter(b => b.subjectId === subjectId);
      return all;
    } catch (e) {
      return [];
    }
  }

  toggleBookmark(item) {
    const current = this.getBookmarks();
    const exists = current.some(b => b.id === item.id);
    let updated;
    if (exists) {
      updated = current.filter(b => b.id !== item.id);
    } else {
      updated = [{ ...item, bookmarkedAt: new Date().toISOString() }, ...current];
    }
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving bookmark:', e);
    }
    return updated;
  }

  // Personal Notes Management
  getPersonalNotes(subjectId = null) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTES);
      const all = saved ? JSON.parse(saved) : [];
      if (subjectId) return all.filter(n => n.subjectId === subjectId);
      return all;
    } catch (e) {
      return [];
    }
  }

  savePersonalNote(noteData) {
    const current = this.getPersonalNotes();
    const newNote = {
      id: `note_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...noteData
    };
    const updated = [newNote, ...current];
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving personal note:', e);
    }
    return updated;
  }

  updatePersonalNote(noteId, updates) {
    const current = this.getPersonalNotes();
    const updated = current.map(n => {
      if (n.id === noteId) {
        return { ...n, ...updates, updatedAt: new Date().toISOString() };
      }
      return n;
    });
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updated));
    } catch (e) {
      console.error('Error updating personal note:', e);
    }
    return updated;
  }

  deletePersonalNote(noteId) {
    const current = this.getPersonalNotes();
    const updated = current.filter(n => n.id !== noteId);
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updated));
    } catch (e) {
      console.error('Error deleting note:', e);
    }
    return updated;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.studentSubjects));
  }
}

export const subjectService = new SubjectService();
export default subjectService;
