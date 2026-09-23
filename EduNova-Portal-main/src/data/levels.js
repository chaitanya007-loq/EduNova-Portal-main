export const RANK_TIERS = [
  { minLevel: 1, maxLevel: 4, title: 'Explorer', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.4)' },
  { minLevel: 5, maxLevel: 9, title: 'Scholar', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.4)' },
  { minLevel: 10, maxLevel: 14, title: 'Achiever', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)' },
  { minLevel: 15, maxLevel: 19, title: 'Specialist', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)' },
  { minLevel: 20, maxLevel: 29, title: 'Expert', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' },
  { minLevel: 30, maxLevel: 999, title: 'Master', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' }
];

export const LEVEL_CONFIG = [
  { level: 1, xpRequired: 0, perk: 'Unlocked Basic Courses & AI Sage' },
  { level: 2, xpRequired: 400, perk: 'Unlocked Practice Quizzes' },
  { level: 3, xpRequired: 800, perk: 'Unlocked Immersive AR/VR Labs' },
  { level: 4, xpRequired: 1200, perk: 'Unlocked Skill Barter Marketplace' },
  { level: 5, xpRequired: 1700, perk: 'Scholar Badge & Study Group Creation' },
  { level: 6, xpRequired: 2200, perk: 'Streak Shield Protection' },
  { level: 7, xpRequired: 2800, perk: 'Knowledge Constellation Advanced Nodes' },
  { level: 8, xpRequired: 3400, perk: 'Peer Mentorship Status & Custom Avatars' },
  { level: 9, xpRequired: 4100, perk: 'AI Custom Exam Simulator' },
  { level: 10, xpRequired: 4900, perk: 'Achiever Title & Holographic Profile Aura' },
  { level: 12, xpRequired: 6700, perk: 'Priority Mentor Queue' },
  { level: 15, xpRequired: 10000, perk: 'Specialist Masterclass Access' },
  { level: 20, xpRequired: 18000, perk: 'Expert Educator Verifications' },
  { level: 30, xpRequired: 35000, perk: 'Master Holographic Constellation' }
];

export const getRankForLevel = (level) => {
  return RANK_TIERS.find((r) => level >= r.minLevel && level <= r.maxLevel) || RANK_TIERS[RANK_TIERS.length - 1];
};
