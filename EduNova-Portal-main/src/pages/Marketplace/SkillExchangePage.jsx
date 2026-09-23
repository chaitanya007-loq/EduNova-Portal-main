import React, { useState } from 'react';
import { useSkillExchange } from '../../hooks/useSkillExchange';
import { useMeetings } from '../../hooks/useMeetings';
import { SkillExchangeHeader } from '../../components/exchange/SkillExchangeHeader';
import { PersonalizedHero } from '../../components/exchange/PersonalizedHero';
import { SkillStatisticsBar } from '../../components/exchange/SkillStatisticsBar';
import { LearningNetworkSection } from '../../components/exchange/LearningNetworkSection';
import { SkillExchangeCard } from '../../components/exchange/SkillExchangeCard';
import { CreateExchangeOfferModal } from '../../components/exchange/CreateExchangeOfferModal';
import { AddSkillModal } from '../../components/exchange/AddSkillModal';
import { MeetingSchedulerModal } from '../../components/exchange/MeetingSchedulerModal';
import { MeetingRoomModal } from '../../components/exchange/MeetingRoomModal';
import { MeetingCalendarView } from '../../components/exchange/MeetingCalendarView';
import { ActiveExchangeWorkspace } from '../../components/exchange/ActiveExchangeWorkspace';
import { LearningCircleModal } from '../../components/exchange/LearningCircleModal';
import { MatchFiltersDrawer } from '../../components/exchange/MatchFiltersDrawer';
import { RequestExchangeModal } from '../../components/exchange/RequestExchangeModal';
import { ChatPage } from '../../components/chat/ChatPage';
import { getUnreadMessageCount } from '../../services/chatService';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/SkillExchange.css';

import {
  Sparkles,
  Filter,
  Search,
  BookOpen,
  Target,
  Repeat,
  Calendar,
  MessageSquare,
  Heart,
  Users,
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-react';

export const SkillExchangePage = ({ initialTab = 'discover' }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const {
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
    candidates,
    savedCandidates,
    handleAddSkillToTeach,
    handleAddSkillToLearn,
    handleRemoveSkillToTeach,
    handleRemoveSkillToLearn,
    handleSendRequest,
    handleAcceptRequest,
    handleDeclineRequest,
    handleToggleSave
  } = useSkillExchange();

  const { meetings, upcomingMeetings, handleCreateMeeting } = useMeetings();

  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState(initialTab);

  // Modals State
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isMeetingRoomOpen, setIsMeetingRoomOpen] = useState(false);
  const [isCircleModalOpen, setIsCircleModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Selected Target Objects for Modals
  const [selectedTargetUser, setSelectedTargetUser] = useState(null);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Modal Triggers
  const handleOpenRequestModal = (candidate) => {
    setSelectedTargetUser(candidate);
    setIsRequestModalOpen(true);
  };

  const handleOpenScheduler = (peerUser, exchange) => {
    setSelectedTargetUser(peerUser || { id: exchange?.peerId, name: exchange?.peerName, avatar: exchange?.peerAvatar, title: exchange?.peerTitle });
    setSelectedExchange(exchange || activeExchanges[0]);
    setIsSchedulerOpen(true);
  };

  const handleOpenMeetingRoom = (meetingObj) => {
    setSelectedMeeting(meetingObj || upcomingMeetings[0] || meetings[0]);
    setIsMeetingRoomOpen(true);
  };

  const unreadCount = getUnreadMessageCount() || 3;

  return (
    <div className="skill-exchange-page">
      {/* 1. PAGE HEADER */}
      <SkillExchangeHeader
        onCreateExchange={() => setIsCreateOfferOpen(true)}
        onAddSkill={() => setIsAddSkillOpen(true)}
        onFindMentor={() => {
          setSearchQuery('mentor');
          setActiveTab('discover');
        }}
        onMySchedule={() => setActiveTab('meetings')}
        onOpenMessages={() => setActiveTab('messages')}
      />

      {/* 2. PERSONALIZED AI HERO SEARCH */}
      <PersonalizedHero
        learner={learner}
        onSearch={(query) => {
          setSearchQuery(query);
          setActiveTab('discover');
        }}
      />

      {/* 3. DYNAMIC CALCULATED STATISTICS BAR */}
      <SkillStatisticsBar stats={stats} />

      {/* 4. MAIN NAVIGATION TABS */}
      <div className="se-tabs-bar">
        {[
          { id: 'discover', label: 'Discover Matches', badge: candidates.length },
          { id: 'messages', label: 'Messages', badge: unreadCount },
          { id: 'my-skills', label: 'My Skills', badge: teachSkills.length + learnSkills.length },
          { id: 'requests', label: 'Requests', badge: requests.filter(r => r.status === 'Pending').length },
          { id: 'active', label: 'Active Exchanges', badge: activeExchanges.length },
          { id: 'meetings', label: 'Meetings', badge: upcomingMeetings.length },
          { id: 'saved', label: 'Saved Matches', badge: savedCandidates.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`se-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
            {tab.badge > 0 && (
              <span className="se-tab-badge">
                {tab.badge}
              </span>
            )}
          </button>
        ))}

        {/* Learning Circle Trigger Button */}
        <button
          onClick={() => setIsCircleModalOpen(true)}
          className="se-btn se-btn-purple"
          style={{ padding: '8px 14px', fontSize: '0.8rem', marginLeft: 'auto' }}
        >
          <Users size={14} />
          + Learning Circle
        </button>
      </div>

      {/* 5. TAB CONTENTS */}

      {/* TAB: MESSAGES REAL-TIME CHAT */}
      {activeTab === 'messages' && (
        <ChatPage onOpenScheduler={(peer) => handleOpenScheduler(peer)} />
      )}

      {/* TAB 1: DISCOVER MATCHES */}
      {activeTab === 'discover' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Controls Bar: Search & Filter Controls */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '16px',
            borderRadius: '16px',
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'rgba(12, 16, 36, 0.85)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : 'none'
          }}>
            <div className="se-search-input-wrapper" style={{ minWidth: '240px' }}>
              <Search className="se-search-icon" style={{ width: '16px', height: '16px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={learnerType === 'school' ? 'Search school subjects or peers...' : 'Search skills or peers...'}
                className="se-search-input"
                style={{ padding: '10px 14px 10px 40px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="se-form-select"
                  style={{ padding: '8px 12px', fontSize: '0.8rem', width: 'auto' }}
                >
                  <option value="recommended">Best Compatibility</option>
                  <option value="rating">Highest Rated</option>
                  <option value="completedCount">Most Exchanges</option>
                </select>
              </div>

              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="se-btn se-btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.8rem' }}
              >
                <Filter size={14} color="#38bdf8" />
                Filters
              </button>
            </div>
          </div>

          {/* Candidate Match Cards Grid */}
          {candidates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', borderRadius: '24px', background: 'rgba(12, 16, 36, 0.6)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <Sparkles size={48} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0' }}>No strong matches found</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '400px', margin: '6px auto 20px auto' }}>
                Try searching for another skill, expanding your experience range, or adding more skills to your profile.
              </p>
              <button
                onClick={() => setIsAddSkillOpen(true)}
                className="se-btn se-btn-primary"
              >
                Add Skills to Your Profile
              </button>
            </div>
          ) : (
            <div className="se-cards-grid">
              {candidates.map((candidate) => (
                <SkillExchangeCard
                  key={candidate.id}
                  candidate={candidate}
                  isSaved={savedUserIds.includes(candidate.id)}
                  onSaveToggle={handleToggleSave}
                  onRequestExchange={handleOpenRequestModal}
                  onViewProfile={handleOpenRequestModal}
                />
              ))}
            </div>
          )}

          {/* Interactive Learning Network Section */}
          <LearningNetworkSection
            onOpenChat={() => setActiveTab('messages')}
            onRequestExchange={handleOpenRequestModal}
            onOpenScheduler={handleOpenScheduler}
            candidates={candidates}
          />
        </div>
      )}

      {/* TAB 2: MY SKILLS */}
      {activeTab === 'my-skills' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Skills I Teach */}
          <div style={{
            padding: '24px',
            borderRadius: '24px',
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 246, 255, 0.90) 100%)' : 'rgba(12, 16, 36, 0.9)',
            border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : 'none',
            backdropFilter: 'blur(16px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <BookOpen size={20} color={isLight ? '#0284c7' : '#38bdf8'} />
                Skills I Teach ({teachSkills.length})
              </h3>
              <button
                onClick={() => setIsAddSkillOpen(true)}
                className="se-btn se-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <Plus size={14} /> Add Skill
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {teachSkills.map((s) => (
                <div key={s.id} style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814',
                  border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isLight ? '0 4px 12px rgba(180, 200, 230, 0.2)' : 'none',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>{s.name}</h4>
                    <p style={{ fontSize: '0.78rem', color: isLight ? '#52668a' : '#94a3b8', margin: '4px 0', fontWeight: isLight ? 600 : 400 }}>{s.category} • {s.level} Level ({s.experienceYears || 2} yrs exp)</p>
                    {s.topics && s.topics.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                        {s.topics.map((t, idx) => (
                          <span key={idx} style={{ padding: '3px 8px', borderRadius: '6px', background: isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(255, 255, 255, 0.08)', fontSize: '0.7rem', color: isLight ? '#0284c7' : '#cbd5e1', fontWeight: 700 }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveSkillToTeach(s.id)}
                    style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div style={{
            padding: '24px',
            borderRadius: '24px',
            background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 240, 255, 0.90) 100%)' : 'rgba(12, 16, 36, 0.9)',
            border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : 'none',
            backdropFilter: 'blur(16px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Target size={20} color={isLight ? '#7e22ce' : '#c084fc'} />
                Skills I Want to Learn ({learnSkills.length})
              </h3>
              <button
                onClick={() => setIsAddSkillOpen(true)}
                className="se-btn se-btn-purple"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <Plus size={14} /> Add Goal
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {learnSkills.map((s) => (
                <div key={s.id} style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#050814',
                  border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isLight ? '0 4px 12px rgba(180, 200, 230, 0.2)' : 'none',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>{s.name}</h4>
                    <p style={{ fontSize: '0.78rem', color: isLight ? '#52668a' : '#94a3b8', margin: '4px 0', fontWeight: isLight ? 600 : 400 }}>Target: {s.targetLevel || 'Intermediate'}</p>
                    <p style={{ fontSize: '0.78rem', color: isLight ? '#334155' : '#cbd5e1', fontStyle: 'italic', margin: '4px 0 0 0', fontWeight: isLight ? 600 : 400 }}>"{s.goal}"</p>
                  </div>
                  <button
                    onClick={() => handleRemoveSkillToLearn(s.id)}
                    style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REQUESTS WORKFLOW */}
      {activeTab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: '0 0 8px 0' }}>Incoming & Outgoing Exchange Requests</h3>
          {requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', borderRadius: '20px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(12, 16, 36, 0.8)', border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)', boxShadow: isLight ? '0 12px 32px rgba(180, 200, 230, 0.3)' : 'none', color: isLight ? '#52668a' : '#94a3b8', fontSize: '0.85rem' }}>
              No pending requests. Discover peers to initiate skill exchanges!
            </div>
          ) : (
            requests.map((r) => (
              <div key={r.id} style={{
                padding: '20px',
                borderRadius: '20px',
                background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 246, 255, 0.90))' : 'rgba(12, 16, 36, 0.9)',
                border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: isLight ? '0 12px 32px rgba(180, 200, 230, 0.3)' : 'none',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justify: 'space-between',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={r.fromUser.avatar} alt={r.fromUser.name} style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: 0 }}>{r.fromUser.name}</h4>
                    <p style={{ fontSize: '0.78rem', color: isLight ? '#0284c7' : '#38bdf8', margin: '2px 0', fontWeight: 700 }}>Wants: {r.requestedSkill} ↔ Offers: {r.offeredSkill}</p>
                    <p style={{ fontSize: '0.78rem', color: isLight ? '#334155' : '#cbd5e1', fontStyle: 'italic', margin: 0 }}>"{r.message}"</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {r.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => {
                          handleAcceptRequest(r.id);
                          setActiveTab('messages');
                        }}
                        className="se-btn se-btn-primary"
                        style={{ padding: '8px 16px', color: '#ffffff' }}
                      >
                        Accept & Open Chat
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(r.id)}
                        className="se-btn se-btn-secondary"
                        style={{ padding: '8px 14px' }}
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span className="se-tag-cyan" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                      {r.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: ACTIVE EXCHANGES WORKSPACE */}
      {activeTab === 'active' && (
        <div>
          {activeExchanges.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', borderRadius: '24px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(12, 16, 36, 0.8)', border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)', boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.3)' : 'none', color: isLight ? '#52668a' : '#94a3b8', fontSize: '0.85rem' }}>
              No active exchanges yet. Accept an incoming request or discover compatible peers!
            </div>
          ) : (
            activeExchanges.map((exc) => (
              <ActiveExchangeWorkspace
                key={exc.id}
                exchange={exc}
                onScheduleMeeting={(ex) => handleOpenScheduler(null, ex)}
                onOpenMeetingRoom={handleOpenMeetingRoom}
              />
            ))
          )}
        </div>
      )}

      {/* TAB 5: MEETINGS CALENDAR */}
      {activeTab === 'meetings' && (
        <MeetingCalendarView
          meetings={upcomingMeetings}
          onOpenScheduler={() => handleOpenScheduler(candidates[0])}
          onJoinMeeting={handleOpenMeetingRoom}
        />
      )}

      {/* TAB 6: SAVED MATCHES */}
      {activeTab === 'saved' && (
        <div className="se-cards-grid">
          {savedCandidates.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', borderRadius: '24px', background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(12, 16, 36, 0.8)', border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)', boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.3)' : 'none', color: isLight ? '#52668a' : '#94a3b8', fontSize: '0.85rem' }}>
              No saved matches yet. Bookmark profiles in the Discover tab!
            </div>
          ) : (
            savedCandidates.map((c) => (
              <SkillExchangeCard
                key={c.id}
                candidate={c}
                isSaved={true}
                onSaveToggle={handleToggleSave}
                onRequestExchange={handleOpenRequestModal}
                onViewProfile={handleOpenRequestModal}
              />
            ))
          )}
        </div>
      )}

      {/* MODAL DIALOGS */}
      <CreateExchangeOfferModal
        isOpen={isCreateOfferOpen}
        onClose={() => setIsCreateOfferOpen(false)}
        onPublish={(offer) => {
          handleAddSkillToTeach({ name: offer.teachSkill, category: learnerType === 'school' ? 'School Academics' : 'General', level: offer.experience });
          handleAddSkillToLearn({ name: offer.learnSkill, category: learnerType === 'school' ? 'School Academics' : 'General', goal: offer.goal });
        }}
      />

      <AddSkillModal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        onAddSkill={(type, skillObj) => {
          if (type === 'teach') handleAddSkillToTeach(skillObj);
          else handleAddSkillToLearn(skillObj);
        }}
      />

      <MeetingSchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        peerUser={selectedTargetUser}
        exchange={selectedExchange}
        onScheduleSuccess={handleCreateMeeting}
      />

      <MeetingRoomModal
        isOpen={isMeetingRoomOpen}
        onClose={() => setIsMeetingRoomOpen(false)}
        meeting={selectedMeeting}
      />

      <LearningCircleModal
        isOpen={isCircleModalOpen}
        onClose={() => setIsCircleModalOpen(false)}
      />

      <MatchFiltersDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
      />

      {selectedTargetUser && (
        <RequestExchangeModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          candidate={selectedTargetUser}
          onSendRequest={(target, reqSkill, offSkill, msg) => {
            handleSendRequest(target, reqSkill, offSkill, msg);
            setIsRequestModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
