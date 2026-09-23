import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { calculateLevelInfo } from '../utils/levelCalculator';
import { gamificationApi } from '../lib/apiClient';
import { useAuth } from './AuthContext';

const LearningContext = createContext();

export const LearningProvider = ({ children }) => {
  const { user } = useAuth() || {};

  const [xp, setXp] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [weeklyConsistency, setWeeklyConsistency] = useState([false, false, false, false, false, false, false]);
  const [streakShields, setStreakShields] = useState(0);

  const [achievements, setAchievements] = useState([]);
  const [dailyMissions, setDailyMissions] = useState([]);
  const [weeklyChallenge, setWeeklyChallenge] = useState(null);

  const [levelInfo, setLevelInfo] = useState(() => calculateLevelInfo(0));
  const [levelUpData, setLevelUpData] = useState(null);

  const [xpTransactions, setXpTransactions] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = user?.id;

  /**
   * Sync live gamification state from backend on mount or user change
   */
  const syncGamificationState = useCallback(async () => {
    if (!user) {
      setXp(0);
      setStreakDays(0);
      setBestStreak(0);
      setDailyMissions([]);
      setXpTransactions([]);
      setLevelInfo(calculateLevelInfo(0));
      return;
    }

    // 1. Hydrate preliminary from user's learnerProfile if available
    if (user.learnerProfile) {
      setXp(user.learnerProfile.xp || 0);
      setStreakDays(user.learnerProfile.streakDays || 0);
      setBestStreak((prev) => Math.max(prev, user.learnerProfile.streakDays || 0));
    }

    try {
      // 2. Fetch live summary and missions in parallel
      const [summaryRes, missionsRes] = await Promise.allSettled([
        gamificationApi.getSummary(),
        gamificationApi.getMissions(),
      ]);

      if (summaryRes.status === 'fulfilled' && summaryRes.value?.success && summaryRes.value.data) {
        const s = summaryRes.value.data;
        setXp(s.xp ?? 0);
        setStreakDays(s.streakDays ?? 0);
        setBestStreak((prev) => Math.max(prev, s.streakDays ?? 0));

        if (Array.isArray(s.xpHistory)) {
          setXpTransactions(
            s.xpHistory.map((t) => ({
              id: t.id,
              title: t.sourceTitle,
              xp: t.amount,
              category: 'Learning',
              createdAt: t.createdAt,
              timeAgo: new Date(t.createdAt).toLocaleDateString(),
            }))
          );
        }
      }

      if (missionsRes.status === 'fulfilled' && missionsRes.value?.success) {
        const missions = missionsRes.value.data || [];
        setDailyMissions(missions.filter((m) => m.period === 'DAILY'));
        const weekly = missions.find((m) => m.period === 'WEEKLY');
        if (weekly) setWeeklyChallenge(weekly);
      }
    } catch (err) {
      console.warn('[LearningContext] Gamification sync error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, user]);

  useEffect(() => {
    syncGamificationState();
  }, [syncGamificationState]);

  // Recalculate level info whenever XP updates
  useEffect(() => {
    const newLevelInfo = calculateLevelInfo(xp);
    setLevelInfo(newLevelInfo);
  }, [xp]);

  /**
   * Real XP Awarding:
   * Calls POST /api/gamification/xp and updates client state
   */
  const earnXp = useCallback(async (amount, sourceTitle = 'Learning Activity', category = 'Learning') => {
    const safeAmount = Number(amount) || 0;
    if (safeAmount <= 0) return;

    // Optimistic UI update
    setXp((prev) => prev + safeAmount);

    const tempTx = {
      id: `tx_${Date.now()}`,
      title: sourceTitle,
      xp: safeAmount,
      category,
      timeAgo: 'Just now',
    };
    setXpTransactions((prev) => [tempTx, ...prev]);

    // Persist to PostgreSQL backend
    try {
      const res = await gamificationApi.addXp(safeAmount, sourceTitle);
      const data = res?.data;

      if (data?.transaction?.id) {
        setXpTransactions((prev) =>
          prev.map((tx) => (tx.id === tempTx.id ? { ...tx, id: data.transaction.id } : tx))
        );
      }

      if (typeof data?.newXp === 'number') {
        setXp(data.newXp);
      }

      // Trigger celebration only if leveled up
      if (data?.leveledUp) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        const newLvlInfo = calculateLevelInfo(data.newXp);
        setLevelUpData({
          level: data.newLevel,
          title: newLvlInfo.title,
        });
      }
    } catch (err) {
      console.warn('[LearningContext] Failed to persist XP to backend:', err.message);
    }
  }, []);

  /**
   * Real Mission Completion:
   * Calls POST /api/gamification/missions/:id/complete and synchronizes live rewards
   */
  const completeMission = useCallback(async (missionId) => {
    try {
      const res = await gamificationApi.completeMission(missionId);
      if (res?.success && res.data) {
        const { rewardXp, newXp, newLevel, streakDays: updatedStreak, leveledUp } = res.data;

        if (typeof newXp === 'number') setXp(newXp);
        if (typeof updatedStreak === 'number') setStreakDays(updatedStreak);

        // Update local mission completed state
        setDailyMissions((prev) =>
          prev.map((m) =>
            m.id === missionId ? { ...m, completed: true, userProgress: 100 } : m
          )
        );

        if (leveledUp) {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
          const newLvlInfo = calculateLevelInfo(newXp);
          setLevelUpData({
            level: newLevel,
            title: newLvlInfo.title,
          });
        } else {
          confetti({ particleCount: 45, spread: 50, origin: { y: 0.6 } });
        }

        // Add to transaction feed
        setXpTransactions((prev) => [
          {
            id: `tx_${Date.now()}`,
            title: `Mission Completed: ${res.data.missionTitle}`,
            xp: rewardXp,
            category: 'Missions',
            timeAgo: 'Just now',
          },
          ...prev,
        ]);

        return res.data;
      }
    } catch (err) {
      console.error('[LearningContext] Failed to complete mission on backend:', err.message);
      throw err;
    }
  }, []);

  const useStreakShield = useCallback(() => {
    if (streakShields > 0) {
      setStreakShields((prev) => prev - 1);
      return true;
    }
    return false;
  }, [streakShields]);

  const closeLevelUpModal = useCallback(() => {
    setLevelUpData(null);
  }, []);

  const contextValue = useMemo(() => ({
    xp,
    level: levelInfo.level,
    levelInfo,
    streakDays,
    bestStreak,
    weeklyConsistency,
    streakShields,
    achievements,
    dailyMissions,
    weeklyChallenge,
    xpTransactions,
    milestones,
    levelUpData,
    loading,
    syncGamificationState,
    earnXp,
    addXp: earnXp,
    completeMission,
    useStreakShield,
    closeLevelUpModal,
  }), [
    xp,
    levelInfo,
    streakDays,
    bestStreak,
    weeklyConsistency,
    streakShields,
    achievements,
    dailyMissions,
    weeklyChallenge,
    xpTransactions,
    milestones,
    levelUpData,
    loading,
    syncGamificationState,
    earnXp,
    completeMission,
    useStreakShield,
    closeLevelUpModal
  ]);

  return (
    <LearningContext.Provider value={contextValue}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => useContext(LearningContext);

