import React from 'react';
import { Sparkles, TrendingUp, Clock, HelpCircle, Users, Award, BookOpen, FolderGit2 } from 'lucide-react';

export const CommunityNavigationTabs = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'for-you', label: 'For You', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'latest', label: 'Latest', icon: Clock },
    { id: 'unanswered', label: 'Unanswered', icon: HelpCircle },
    { id: 'groups', label: 'Study Groups', icon: Users },
    { id: 'mentors', label: 'Mentors & Partners', icon: Award },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'projects', label: 'Projects Showcase', icon: FolderGit2 }
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '20px'
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              background: isActive ? 'var(--glass-bg)' : 'transparent',
              border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
              borderBottom: isActive ? '2px solid var(--accent-cyan)' : '1px solid transparent',
              color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
