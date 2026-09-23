import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES, RARITIES } from '../../data/achievements';
import { AchievementHero } from '../../components/achievements/AchievementHero';
import { KPIRow } from '../../components/achievements/KPIRow';
import { DailyMissionsCard } from '../../components/achievements/DailyMissionsCard';
import { WeeklyChallengeCard } from '../../components/achievements/WeeklyChallengeCard';
import { ClosestAchievementCard } from '../../components/achievements/ClosestAchievementCard';
import { SageAchievementInsight } from '../../components/achievements/SageAchievementInsight';
import { AchievementCard } from '../../components/achievements/AchievementCard';
import { BadgeDetailModal } from '../../components/achievements/BadgeDetailModal';
import { LevelUpModal } from '../../components/achievements/LevelUpModal';
import { LevelRoadmap } from '../../components/achievements/LevelRoadmap';
import { XPHistoryLog } from '../../components/achievements/XPHistoryLog';
import { Award, Filter, Sparkles } from 'lucide-react';

export const AchievementsPage = () => {
  const { achievements = [] } = useLearning() || {};
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState(null);

  const filteredAchievements = achievements.filter((ach) => {
    const matchCat = selectedCategory === 'All' || ach.category === selectedCategory;
    const matchRarity = selectedRarity === 'All' || ach.rarity === selectedRarity;
    return matchCat && matchRarity;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <AchievementHero />
      <KPIRow />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <DailyMissionsCard />
          <WeeklyChallengeCard />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ClosestAchievementCard />
          <SageAchievementInsight />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: isLight ? '#0f172a' : 'var(--text-primary)', margin: 0 }}>
              Badge Collection ({filteredAchievements.length})
            </h2>
            <p style={{ fontSize: '0.85rem', color: isLight ? '#52668a' : 'var(--text-muted)', margin: '2px 0 0', fontWeight: 600 }}>
              Filter by learning category and achievement rarity
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                background: isLight ? '#ffffff' : 'var(--bg-secondary)',
                border: isLight ? '1.5px solid rgba(195, 215, 245, 0.95)' : '1px solid var(--border-color)',
                color: isLight ? '#0f172a' : 'var(--text-primary)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                outline: 'none',
                boxShadow: isLight ? '0 4px 14px rgba(180, 200, 230, 0.25)' : 'none'
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              style={{
                background: isLight ? '#ffffff' : 'var(--bg-secondary)',
                border: isLight ? '1.5px solid rgba(195, 215, 245, 0.95)' : '1px solid var(--border-color)',
                color: isLight ? '#0f172a' : 'var(--text-primary)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                outline: 'none',
                boxShadow: isLight ? '0 4px 14px rgba(180, 200, 230, 0.25)' : 'none'
              }}
            >
              {RARITIES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredAchievements.map((ach) => (
            <AchievementCard
              key={ach.id}
              achievement={ach}
              onClick={(b) => setSelectedBadge(b)}
            />
          ))}
        </div>
      </div>

      <LevelRoadmap />
      <XPHistoryLog />

      <BadgeDetailModal
        achievement={selectedBadge}
        isOpen={Boolean(selectedBadge)}
        onClose={() => setSelectedBadge(null)}
      />

      <LevelUpModal />
    </div>
  );
};

export default AchievementsPage;
