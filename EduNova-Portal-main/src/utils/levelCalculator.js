import { RANK_TIERS, LEVEL_CONFIG, getRankForLevel } from '../data/levels';

/**
 * Calculates level, rank title, XP requirements, and progress % based on total XP.
 */
export const calculateLevelInfo = (totalXp = 0) => {
  let currentLevel = 1;

  for (let i = 0; i < LEVEL_CONFIG.length; i++) {
    if (totalXp >= LEVEL_CONFIG[i].xpRequired) {
      currentLevel = LEVEL_CONFIG[i].level;
    } else {
      break;
    }
  }

  // If XP exceeds config array, calculate using linear formula beyond max configured level
  if (totalXp >= LEVEL_CONFIG[LEVEL_CONFIG.length - 1].xpRequired) {
    const maxConfig = LEVEL_CONFIG[LEVEL_CONFIG.length - 1];
    const extraXp = totalXp - maxConfig.xpRequired;
    const extraLevels = Math.floor(extraXp / 1000);
    currentLevel = maxConfig.level + extraLevels;
  }

  const rank = getRankForLevel(currentLevel);

  // Find min XP threshold for current level and next level
  const currentLevelConfig = LEVEL_CONFIG.find((l) => l.level === currentLevel);
  const nextLevelConfig = LEVEL_CONFIG.find((l) => l.level === currentLevel + 1);

  const currentLevelMinXp = currentLevelConfig
    ? currentLevelConfig.xpRequired
    : (currentLevel - 1) * 600;
  const nextLevelMinXp = nextLevelConfig
    ? nextLevelConfig.xpRequired
    : currentLevelMinXp + 600;

  const xpInCurrentLevel = totalXp - currentLevelMinXp;
  const xpSpanForNextLevel = nextLevelMinXp - currentLevelMinXp;

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpInCurrentLevel / xpSpanForNextLevel) * 100))
  );

  const remainingXp = Math.max(0, nextLevelMinXp - totalXp);

  return {
    level: currentLevel,
    rankTitle: rank.title,
    rankColor: rank.color,
    rankBg: rank.bg,
    rankBorder: rank.border,
    totalXp,
    currentLevelMinXp,
    nextLevelMinXp,
    xpInCurrentLevel,
    xpSpanForNextLevel,
    progressPercent,
    remainingXp,
    perk: currentLevelConfig?.perk || 'Unlocked Advanced Mastery Features'
  };
};
