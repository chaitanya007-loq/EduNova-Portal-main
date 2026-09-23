import React from 'react';
import { MessageSquare, Plus, Users, Award, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '../common/Button';
import { EduNovaHeroBanner } from '../common/EduNovaHeroBanner';

export const CommunityHero = ({ onOpenAskModal, onOpenGroupModal, onOpenMentorTab }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <EduNovaHeroBanner
        badge="✦ AI-Powered Collaborative Learning Hub"
        title="EduNova Community Hub 💬"
        subtitle="Ask questions, share architectural knowledge, and solve challenges together with global mentors and study squads."
        stats={[
          { label: '12', subtext: 'Topics Following' },
          { label: '4', subtext: 'Active Study Groups' },
          { label: '3', subtext: 'Learning Goals', isPill: true }
        ]}
      />
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '-8px' }}>
        <Button onClick={onOpenAskModal} style={{ padding: '12px 22px' }}>
          <Plus size={18} /> Ask a Question
        </Button>
        <Button variant="outline" onClick={onOpenGroupModal} style={{ padding: '12px 18px' }}>
          <Users size={18} /> Create Study Group
        </Button>
        <Button variant="outline" onClick={onOpenMentorTab} style={{ padding: '12px 18px' }}>
          <Award size={18} /> Find a Mentor
        </Button>
      </div>
    </div>
  );
};
