// Custom Hook: useSkillExchange
// Centralized reactive state manager for Peer Skill Exchange (Education Level Aware)

import { useState, useEffect, useCallback } from 'react';
import {
  getUserSkillsToTeach,
  getUserSkillsToLearn,
  getMarketplace,
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

  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeExchanges, setActiveExchanges] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [savedUserIds, setSavedUserIds] = useState(() => getSavedMatches());
  const [stats, setStats] = useState({ skillsTeachCount: 0, skillsWantCount: 0, activeCount: 0, completedCount: 0 });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [filters, setFilters] = useState({ wantSkill: 'All', experience: 'All', availability: 'All', format: 'All', verifiedOnly: false });

  const currentUser = {
    id: learner?.id || 'current_user',
    name: learner?.name || 'Learner',
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

  const refreshState = useCallback(async () => {
    const [teach, learn, exchangeRequests, active, saved, statistics, listings] = await Promise.all([
      getUserSkillsToTeach(learnerType),
      getUserSkillsToLearn(learnerType),
      getExchangeRequests(),
      getActiveExchanges(),
      Promise.resolve(getSavedMatches()),
      calculateUserStatistics(learnerType),
      getMarketplace(),
    ]);
    setTeachSkills(teach);
    setLearnSkills(learn);
    setRequests(exchangeRequests);
    setActiveExchanges(active);
    setSavedUserIds(saved);
    setStats(statistics);
    setMarketplace(listings);
  }, [learnerType]);

  useEffect(() => {
    refreshState().catch((error) => console.error('Unable to load skill exchange data', error));
  }, [refreshState]);

  // Perform AI Natural Language / Keyword match calculation
  const marketplaceUsers = marketplace.map((listing) => ({
    id: listing.userId,
    name: listing.name,
    avatar: listing.avatar,
    learnerType: listing.learnerType,
    skillsToTeach: [{ name: listing.skillOffered }],
    skillsToLearn: [{ name: listing.skillWanted }],
    verified: true,
  }));
  const matchedCandidates = searchMatchesByQuery(searchQuery, currentUser, marketplaceUsers);

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
  const savedCandidates = marketplaceUsers.filter(u => savedUserIds.includes(u.id));

  // Handler actions
  const handleAddSkillToTeach = async (skillObj) => {
    await addTeach(skillObj, learnerType);
    await refreshState();
  };

  const handleRemoveSkillToTeach = async (id) => {
    await removeTeach(id, learnerType);
    await refreshState();
  };

  const handleAddSkillToLearn = async (skillObj) => {
    await addLearn(skillObj, learnerType);
    await refreshState();
  };

  const handleRemoveSkillToLearn = async (id) => {
    await removeLearn(id, learnerType);
    await refreshState();
  };

  const handleSendRequest = (targetUser, requestedSkill, offeredSkill, message) => {
    const req = sendExchangeRequest(targetUser, requestedSkill, offeredSkill, message);
    refreshState().catch((error) => console.error('Unable to refresh exchanges', error));
    return req;
  };

  const handleAcceptRequest = (requestId) => {
    acceptExchangeRequest(requestId).then(refreshState).catch((error) => console.error('Unable to accept exchange', error));
  };

  const handleDeclineRequest = (requestId) => {
    rejectExchangeRequest(requestId).then(refreshState).catch((error) => console.error('Unable to reject exchange', error));
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
