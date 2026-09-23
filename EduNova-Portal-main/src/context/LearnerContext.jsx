import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { learnerService } from '../services/learnerService';
import { useAuth } from './AuthContext';

import { getDynamicAvatar } from '../utils/avatarUtils';

const LearnerContext = createContext();

export const LearnerProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [learner, setLearner] = useState(() => learnerService.getProfile());

  // Synchronize live user from PostgreSQL / AuthContext into LearnerContext
  useEffect(() => {
    if (user) {
      const activeLearnerType = (user.learnerType || 'school').toLowerCase();
      const current = learnerService.getProfile();
      const liveProfile = {
        ...current,
        id: user.id,
        name: user.name || current.name || '',
        email: user.email || current.email || '',
        phone: user.phone || current.phone || '',
        username: user.studentUsername || current.username || (user.email ? user.email.split('@')[0] : 'learner'),
        avatar: getDynamicAvatar(user, current.username),
        learnerType: activeLearnerType || current.learnerType || 'school',
        title: current.title || user.title || `${user.learnerType || 'School'} Learner`,
        bio: current.bio || user.bio || '',
        role: user.role,
        isParent: user.isParent || user.role === 'PARENT',
        xp: user.learnerProfile?.xp ?? (user.xp || current.xp || 0),
        level: user.learnerProfile?.level ?? (user.level || current.level || 1),
        streakDays: user.learnerProfile?.streakDays ?? (user.streakDays || current.streakDays || 0),
        goals: Array.isArray(user.learnerProfile?.goals) && user.learnerProfile.goals.length > 0
          ? user.learnerProfile.goals.map((g, i) => {
              if (typeof g === 'object') return g;
              try {
                return JSON.parse(g);
              } catch (e) {
                return { id: `goal_${i + 1}`, title: String(g), progress: 0, targetDate: '2026-12-31' };
              }
            })
          : (current.goals || []),
        weakTopics: Array.isArray(user.learnerProfile?.weakTopics) && user.learnerProfile.weakTopics.length > 0
          ? user.learnerProfile.weakTopics
          : (current.weakTopics || []),
        education: {
          ...(current.education || {}),
          ...(user.learnerProfile?.board ? { board: user.learnerProfile.board } : {}),
          ...(user.learnerProfile?.degree ? { degree: user.learnerProfile.degree } : {}),
        },
        projects: current.projects && current.projects.length > 0 ? current.projects : (user.projects || []),
      };

      setLearner((prev) => {
        if (prev && JSON.stringify(prev) === JSON.stringify(liveProfile)) {
          return prev;
        }
        learnerService.setProfile(liveProfile);
        return liveProfile;
      });
    }
  }, [user]);

  // Subscribe to service-level updates
  useEffect(() => {
    const unsubscribe = learnerService.subscribe((updatedProfile) => {
      setLearner((prev) => {
        const merged = { ...prev, ...updatedProfile };
        if (prev && JSON.stringify(prev) === JSON.stringify(merged)) {
          return prev;
        }
        return merged;
      });
    });
    return unsubscribe;
  }, []);

  const switchDemoProfile = useCallback((typeKey) => {
    const updated = learnerService.switchDemoProfile(typeKey);
    setLearner({ ...updated });
    if (updateUser) {
      updateUser({ learnerType: (typeKey || '').toUpperCase() });
    }
  }, [updateUser]);

  const updateLearnerType = useCallback((typeKey, extraDetails) => {
    const updated = learnerService.updateLearningType(typeKey, extraDetails);
    setLearner({ ...updated });
    if (updateUser) {
      updateUser({
        learnerType: (typeKey || '').toUpperCase(),
        ...(extraDetails?.education?.board && { board: extraDetails.education.board }),
        ...(extraDetails?.education?.degree && { degree: extraDetails.education.degree }),
      });
    }
  }, [updateUser]);

  const updateProfile = useCallback((profileData) => {
    const updated = learnerService.setProfile(profileData);
    setLearner({ ...updated });
  }, []);

  const addLearningGoal = useCallback((newGoal) => {
    const updatedGoals = learnerService.addLearningGoal(newGoal);
    setLearner((prev) => ({ ...prev, goals: updatedGoals }));
    return updatedGoals;
  }, []);

  const updateLearningGoal = useCallback((goalId, updates) => {
    const updatedGoals = learnerService.updateLearningGoal(goalId, updates);
    setLearner((prev) => ({ ...prev, goals: updatedGoals }));
    return updatedGoals;
  }, []);

  const deleteLearningGoal = useCallback((goalId) => {
    const updatedGoals = learnerService.deleteLearningGoal(goalId);
    setLearner((prev) => ({ ...prev, goals: updatedGoals }));
    return updatedGoals;
  }, []);

  const refreshProfile = useCallback(async () => {
    const live = await learnerService.fetchLiveProfile();
    setLearner({ ...live });
    return live;
  }, []);

  const contextValue = useMemo(() => ({
    learner,
    currentLearner: learner,
    learnerType: learner?.learnerType || 'school',
    goals: Array.isArray(learner?.goals) ? learner.goals : [],
    weakTopics: Array.isArray(learner?.weakTopics) ? learner.weakTopics : [],
    switchDemoProfile,
    switchLearnerType: switchDemoProfile,
    updateLearnerType,
    updateProfile,
    addLearningGoal,
    updateLearningGoal,
    deleteLearningGoal,
    refreshProfile,
  }), [
    learner,
    switchDemoProfile,
    updateLearnerType,
    updateProfile,
    addLearningGoal,
    updateLearningGoal,
    deleteLearningGoal,
    refreshProfile
  ]);

  return (
    <LearnerContext.Provider value={contextValue}>
      {children}
    </LearnerContext.Provider>
  );
};

export const useLearner = () => useContext(LearnerContext);
export default LearnerProvider;

