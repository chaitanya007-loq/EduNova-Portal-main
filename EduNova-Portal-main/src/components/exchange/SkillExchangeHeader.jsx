import React, { useState, useEffect } from 'react';
import { EduNovaHeroBanner } from '../common/EduNovaHeroBanner';
import { Plus, UserCheck, Calendar, Sparkles, MessageSquare, Users, Repeat } from 'lucide-react';
import { getUnreadMessageCount } from '../../services/chatService';

export const SkillExchangeHeader = ({ onCreateExchange, onAddSkill, onFindMentor, onMySchedule, onOpenMessages }) => {
  const [unreadCount, setUnreadCount] = useState(3);

  useEffect(() => {
    try {
      const count = getUnreadMessageCount();
      setUnreadCount(count || 3);
    } catch (e) {}
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
      {/* 1. HERO BRANDING HEADER WITH 3D GLASS ORB */}
      <EduNovaHeroBanner
        badge="✦ Peer-to-Peer Learning Network"
        title="Peer Skill Exchange"
        subtitle="Share what you know. Learn what you need. Build skills together through 1-on-1 peer sessions & mentorship."
        stats={[
          { label: '24 Active', subtext: 'Peer Learners Now', icon: Users, color: '#38bdf8', iconBg: 'rgba(56, 189, 248, 0.25)' },
          { label: 'Level 4', subtext: 'XP Rank', icon: Sparkles, color: '#c084fc', iconBg: 'rgba(192, 132, 252, 0.25)' },
          { label: '3', subtext: 'Learning Goals', isPill: true }
        ]}
      />

      {/* Header Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '-8px' }}>
        <button onClick={onCreateExchange} className="se-btn se-btn-primary">
          <Plus size={16} strokeWidth={3} />
          Create Exchange
        </button>

        <button onClick={onAddSkill} className="se-btn se-btn-secondary">
          <Plus size={16} color="#38bdf8" />
          Add Skill
        </button>

        <button onClick={onFindMentor} className="se-btn se-btn-purple">
          <UserCheck size={16} />
          Find a Mentor
        </button>

        <button onClick={onMySchedule} className="se-btn se-btn-secondary">
          <Calendar size={16} color="#38bdf8" />
          My Schedule
        </button>

        <button onClick={onOpenMessages} className="se-btn se-btn-primary" style={{ position: 'relative', background: 'linear-gradient(135deg, #06b6d4, #a855f7)' }}>
          <MessageSquare size={16} />
          Messages
          {unreadCount > 0 && (
            <span style={{ padding: '2px 7px', borderRadius: '9999px', background: '#f43f5e', color: '#fff', fontSize: '0.72rem', fontWeight: 900, marginLeft: '4px', boxShadow: '0 2px 8px rgba(244, 63, 94, 0.5)' }}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
