export const getKnowledgeConstellation = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [];
};

export const getSkillDnaMetrics = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {};
};

export const getSkillExchanges = async (filterCategory = 'All') => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [];
};

export const calculateSkillMatchCompatibility = (userTeaches, partnerTeaches, userWants, partnerWants) => {
  // Simple deterministic scoring matrix simulation
  let matchScore = 75;
  if (userTeaches && partnerWants && userTeaches.toLowerCase().includes(partnerWants.toLowerCase())) {
    matchScore += 12;
  }
  if (partnerTeaches && userWants && partnerTeaches.toLowerCase().includes(userWants.toLowerCase())) {
    matchScore += 12;
  }
  return Math.min(matchScore, 98);
};
