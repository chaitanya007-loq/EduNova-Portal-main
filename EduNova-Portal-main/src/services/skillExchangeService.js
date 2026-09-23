import apiClient from '../lib/apiClient';

export const getMarketplace = async () => {
  const response = await apiClient.get('/skills/marketplace');
  return response.data || [];
};

export const getUserSkillsToTeach = async () => {
  const listings = await getMarketplace();
  return listings.map((listing) => ({
    id: listing.id,
    name: listing.skillOffered,
    category: listing.learnerType,
    ownerId: listing.userId,
  }));
};

export const getUserSkillsToLearn = async () => {
  const listings = await getMarketplace();
  return listings.map((listing) => ({
    id: listing.id,
    name: listing.skillWanted,
    category: listing.learnerType,
    ownerId: listing.userId,
  }));
};

export const addSkillToTeach = async () => {
  throw new Error('Skill listings are managed by the backend exchange API');
};

export const addSkillToLearn = async () => {
  throw new Error('Skill interests are managed by the backend exchange API');
};

export const removeSkillToTeach = async () => {
  throw new Error('Skill listings are managed by the backend exchange API');
};

export const removeSkillToLearn = async () => {
  throw new Error('Skill interests are managed by the backend exchange API');
};

export const getExchangeRequests = async () => {
  const response = await apiClient.get('/exchanges');
  return response.data || [];
};

export const getActiveExchanges = async () => {
  const exchanges = await getExchangeRequests();
  return exchanges.filter((exchange) => exchange.status === 'ACCEPTED');
};

export const sendExchangeRequest = async (targetUser, requestedSkill, offeredSkill) => {
  const response = await apiClient.post('/exchanges/request', {
    receiverId: targetUser.id,
    skillWanted: requestedSkill,
    skillOffered: offeredSkill,
  });
  return response.data;
};

export const acceptExchangeRequest = async (requestId) => {
  const response = await apiClient.patch(`/exchanges/${requestId}/status`, { status: 'ACCEPTED' });
  return response.data;
};

export const rejectExchangeRequest = async (requestId) => {
  const response = await apiClient.patch(`/exchanges/${requestId}/status`, { status: 'REJECTED' });
  return response.data;
};

export const calculateUserStatistics = async () => {
  const [teachSkills, learnSkills, exchanges] = await Promise.all([
    getUserSkillsToTeach(),
    getUserSkillsToLearn(),
    getExchangeRequests(),
  ]);
  return {
    skillsTeachCount: teachSkills.length,
    skillsWantCount: learnSkills.length,
    activeCount: exchanges.filter((exchange) => exchange.status === 'ACCEPTED').length,
    completedCount: exchanges.filter((exchange) => exchange.status === 'COMPLETED').length,
  };
};

export const getSavedMatches = () => [];
export const saveMatch = () => {};
export const removeSavedMatch = () => {};

export const getExchangeMessages = async (conversationId) => {
  const response = await apiClient.get(`/conversations/${conversationId}/messages`);
  return response.data?.messages || response.data || [];
};

export const sendExchangeMessage = async (conversationId, content) => {
  const response = await apiClient.post(`/conversations/${conversationId}/messages`, { content });
  return response.data;
};

export const getExchangeNotes = async () => [];
export const addExchangeNote = async () => {
  throw new Error('Exchange notes are not supported by the backend yet');
};
