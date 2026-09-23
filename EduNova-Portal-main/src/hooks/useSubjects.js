import { useState, useEffect, useCallback } from 'react';
import { useLearner } from '../context/LearnerContext';
import { useAuth } from '../context/AuthContext';
import { subjectService } from '../services/subjectService';
import { subjectApi } from '../lib/apiClient';

export const useSubjects = () => {
  const { learnerType } = useLearner();
  const { user } = useAuth();
  const [selectedSubjects, setSelectedSubjects] = useState(() => subjectService.getSelectedSubjects(learnerType));
  const [availableSubjects, setAvailableSubjects] = useState(() => subjectService.getAllAvailableSubjects(learnerType));
  const [loading, setLoading] = useState(false);

  const fetchLiveEnrolled = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await subjectApi.getEnrolledSubjects();
      const currentLearnerType = (learnerType || user?.learnerType || 'school').toLowerCase();

      if (res?.data && Array.isArray(res.data)) {
        const matchingDbSubjects = res.data.filter((item) => {
          const sEduType = (item.subject?.educationType || item.educationType || '').toLowerCase();
          return !sEduType || sEduType === currentLearnerType;
        });

        if (matchingDbSubjects.length > 0) {
          const enrolled = matchingDbSubjects.map((item) => ({
            id: item.subject?.id || item.subjectId,
            name: item.subject?.name || 'Subject',
            category: item.subject?.category || 'General',
            educationType: (item.subject?.educationType || currentLearnerType).toLowerCase(),
            track: (item.subject?.educationType || currentLearnerType).toLowerCase(),
            progress: typeof item.progress === 'number' ? item.progress : 0,
            targetScore: item.targetScore || 80,
            syllabusCoverage: item.syllabusCoverage || 0,
            topics: item.subject?.topics || [],
            score: Math.round(((item.progress || 0) / 100) * 80),
            total: 80,
          }));
          setSelectedSubjects(enrolled);
          subjectService.saveSubjects(enrolled);
        } else {
          const defaultTrackSubjects = subjectService.getSelectedSubjects(currentLearnerType);
          setSelectedSubjects(defaultTrackSubjects);
        }
      } else {
        const defaultTrackSubjects = subjectService.getSelectedSubjects(currentLearnerType);
        setSelectedSubjects(defaultTrackSubjects);
      }
    } catch (err) {
      console.warn('Unable to fetch enrolled subjects from DB:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user, learnerType]);

  useEffect(() => {
    fetchLiveEnrolled();
  }, [fetchLiveEnrolled]);

  useEffect(() => {
    const unsub = subjectService.subscribe((updated) => {
      const filtered = updated.filter(s => !learnerType || s.educationType === (learnerType || '').toLowerCase() || s.track === learnerType);
      setSelectedSubjects(filtered.length > 0 ? filtered : updated);
    });

    return unsub;
  }, [learnerType]);

  const addSubject = async (subjectId) => {
    subjectService.addSubject(subjectId);
    setSelectedSubjects(subjectService.getSelectedSubjects(learnerType));
    try {
      await subjectApi.selectSubject(subjectId);
    } catch (e) {
      console.warn('Subject API selection sync warning:', e.message);
    }
  };

  const removeSubject = async (subjectId) => {
    subjectService.removeSubject(subjectId);
    setSelectedSubjects(subjectService.getSelectedSubjects(learnerType));
    try {
      await subjectApi.unenrollSubject(subjectId);
    } catch (e) {
      console.warn('Subject API unenrollment sync warning:', e.message);
    }
  };

  const updateSubjectConfig = async (subjectId, updates) => {
    try {
      await subjectApi.updateProgress(subjectId, updates);
      await fetchLiveEnrolled();
    } catch (e) {
      subjectService.updateSubjectConfig(subjectId, updates);
    }
  };

  return {
    selectedSubjects,
    availableSubjects,
    addSubject,
    removeSubject,
    updateSubjectConfig,
    refreshSubjects: fetchLiveEnrolled,
    loading
  };
};

export default useSubjects;
