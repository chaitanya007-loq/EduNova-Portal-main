// Custom Hook: useSkillExchange
// Centralized reactive state manager for Peer Skill Exchange (Education Level Aware)

import { useState, useEffect, useCallback } from 'react';
import {
  getUserSkillsToTeach,
  getUserSkillsToLearn,
  addSkillToTeach as addTeach,
  addSkillToLearn as addLearn,
  removeSkillToTeach as removeTeach,
  removeSkillToLearn as removeLearn,
  getExchangeRequests,
  sendExchangeRequest,
  acceptExchangeRequest,
  rejectExchangeRequest,
  getActiveExchanges,
  getSavedMatches,
  saveMatch as saveM,
  removeSavedMatch as removeSavedM,
  calculateUserStatistics
} from '../services/skillExchangeService';
import { sampleExchangeUsers } from '../data/skillExchangeUsers';
import { getRecommendedMatches, searchMatchesByQuery, sortMatches } from '../services/skillMatchService';
import { useLearner } from '../context/LearnerContext';

export const useSkillExchange = () => {
  const { learner, learnerType = 'college' } = useLearner();

  const [teachSkills, setTeachSkills] = useState(() => getUserSkillsToTeach(learnerType));
  const [learnSkills, setLearnSkills] = useState(() => getUserSkillsToLearn(learnerType));
  const [requests, setRequests] = useState(() => getExchangeRequests());
  const [activeExchanges, setActiveExchanges] = useState(() => getActiveExchanges());
  const [savedUserIds, setSavedUserIds] = useState(() => getSavedMatches());
  const [stats, setStats] = useState(() => calculateUserStatistics(learnerType));

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [filters, setFilters] = useState({ wantSkill: 'All', experience: 'All', availability: 'All', format: 'All', verifiedOnly: false });

  const currentUser = {
    id: learner?.id || 'current_user',
    name: learner?.name || (learnerType === 'school' ? 'Aarav Sharma' : 'Kavya Shah'),
    learnerType,
    education: learner?.title || (learnerType === 'school' ? 'Class 10 CBSE' : 'B.Tech CSE'),
    skillsToTeach: teachSkills,
    skillsToLearn: learnSkills,
    experience: learnerType === 'school' ? 'Intermediate' : 'Advanced',
    availability: 'Weekends',
    availableDays: ['Saturday', 'Sunday'],
    learningFormat: learnerType === 'school' ? 'Study partner' : '1-to-1',
    languages: ['English', 'Hindi']
  };

  const refreshState = useCallback(() => {
    setTeachSkills(getUserSkillsToTeach(learnerType));
    setLearnSkills(getUserSkillsToLearn(learnerType));
    setRequests(getExchangeRequests());
    setActiveExchanges(getActiveExchanges());
    setSavedUserIds(getSavedMatches());
    setStats(calculateUserStatistics(learnerType));
  }, [learnerType]);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  // Perform AI Natural Language / Keyword match calculation
  const matchedCandidates = searchMatchesByQuery(searchQuery, currentUser, sampleExchangeUsers);

  const filteredCandidates = matchedCandidates.filter(c => {
    if (filters.wantSkill !== 'All') {
      const hasSkill = c.skillsToTeach.some(s => (typeof s === 'string' ? s : s.name).includes(filters.wantSkill));
      if (!hasSkill) return false;
    }
    if (filters.experience !== 'All' && c.experience !== filters.experience) return false;
    if (filters.availability !== 'All' && c.availability !== filters.availability && c.availability !== 'Flexible') return false;
    if (filters.format !== 'All' && c.learningFormat !== filters.format && c.learningFormat !== '1-to-1') return false;
    if (filters.verifiedOnly && !c.verified) return false;
    return true;
  });

  const sortedCandidates = sortMatches(filteredCandidates, sortBy);
  const savedCandidates = sampleExchangeUsers.filter(u => savedUserIds.includes(u.id));

  // Handler actions
  const handleAddSkillToTeach = (skillObj) => {
    addTeach(skillObj, learnerType);
    refreshState();
  };

  const handleRemoveSkillToTeach = (id) => {
    removeTeach(id, learnerType);
    refreshState();
  };

  const handleAddSkillToLearn = (skillObj) => {
    addLearn(skillObj, learnerType);
    refreshState();
  };

  const handleRemoveSkillToLearn = (id) => {
    removeLearn(id, learnerType);
    refreshState();
  };

  const handleSendRequest = (targetUser, requestedSkill, offeredSkill, message) => {
    const req = sendExchangeRequest(targetUser, requestedSkill, offeredSkill, message);
    refreshState();
    return req;
  };

  const handleAcceptRequest = (requestId) => {
    acceptExchangeRequest(requestId);
    refreshState();
  };

  const handleDeclineRequest = (requestId) => {
    rejectExchangeRequest(requestId);
    refreshState();
  };

  const handleToggleSave = (userId) => {
    if (savedUserIds.includes(userId)) {
      removeSavedM(userId);
    } else {
      saveM(userId);
    }
    refreshState();
  };

  return {
    learner,
    learnerType,
    currentUser,
    teachSkills,
    learnSkills,
    requests,
    activeExchanges,
    savedUserIds,
    stats,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    candidates: sortedCandidates,
    savedCandidates,
    handleAddSkillToTeach,
    handleRemoveSkillToTeach,
    handleAddSkillToLearn,
    handleRemoveSkillToLearn,
    handleSendRequest,
    handleAcceptRequest,
    handleDeclineRequest,
    handleToggleSave,
    refreshState
  };
};
