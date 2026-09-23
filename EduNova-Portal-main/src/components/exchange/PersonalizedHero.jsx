import React, { useState } from 'react';
import { Search, Sparkles, UserCheck, BookOpen, GraduationCap, Users, Handshake } from 'lucide-react';
import { useDynamicGreeting } from '../../hooks/useDynamicGreeting';

export const PersonalizedHero = ({ learner, onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const learnerType = learner?.learnerType || 'college';
  const userName = learner?.name || 'Learner';
  const userTitle = learner?.title || (learnerType === 'school' ? 'Class 10 CBSE Student' : 'B.Tech CSE Student');
  const dynamicGreeting = useDynamicGreeting(userName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchInput);
  };

  // Education level tailored quick action pills
  const schoolPills = [
    { id: 'math', label: 'Find Math Tutor', query: 'I need a tutor for Mathematics', icon: GraduationCap },
    { id: 'physics', label: 'Find Physics Study Partner', query: 'Find a study partner for Physics', icon: BookOpen },
    { id: 'science', label: 'Teach Board Science', query: 'I can teach Chemistry and Science', icon: Users },
    { id: 'english', label: 'English Grammar Buddy', query: 'I want to learn English Speaking & Grammar', icon: UserCheck },
    { id: 'prep', label: 'Class 10 Board Prep', query: 'Find Class 10 CBSE Board Exam preparation partner', icon: Handshake }
  ];

  const collegePills = [
    { id: 'tutor', label: 'Find a Tutor', query: 'I need a tutor for UI/UX', icon: GraduationCap },
    { id: 'study', label: 'Find a Study Partner', query: 'Find a study partner for DBMS', icon: BookOpen },
    { id: 'teach', label: 'Teach React', query: 'I can teach React', icon: Users },
    { id: 'mentor', label: 'Start Mentoring Session', query: 'I want a UI/UX mentor', icon: UserCheck },
    { id: 'project', label: 'Find Project Partner', query: 'Find a backend project partner for Node.js', icon: Handshake }
  ];

  const quickPills = learnerType === 'school' ? schoolPills : collegePills;

  const handlePillClick = (query) => {
    setSearchInput(query);
    if (onSearch) onSearch(query);
  };

  return (
    <div className="se-hero-card">
      <div className="se-badge">
        <Sparkles size={14} color="#38bdf8" />
        {learnerType === 'school' ? 'SCHOOL ACADEMIC PEER NETWORK' : 'AI-POWERED MATCH ENGINE'}
      </div>

      <h2 className="se-hero-greeting">
        {dynamicGreeting.title}
      </h2>
      <p className="se-hero-sub">
        <strong style={{ color: '#38bdf8' }}>{userTitle}</strong> • {learnerType === 'school' ? 'What school academic subject would you like to learn or teach today?' : 'What technical skill or course would you like to learn or teach today?'}
      </p>

      {/* Natural Language AI Search Bar */}
      <form onSubmit={handleSubmit} className="se-search-form">
        <div className="se-search-input-wrapper">
          <Search className="se-search-icon" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={learnerType === 'school'
              ? 'e.g. "I want to learn Class 10 Physics and can teach Mathematics"'
              : 'e.g. "I want to learn UI/UX and can teach React" or "Find a Python mentor"'
            }
            className="se-search-input"
          />
        </div>
        <button type="submit" className="se-btn se-btn-primary" style={{ padding: '14px 24px' }}>
          <Sparkles size={16} />
          Find Matches
        </button>
      </form>

      {/* Quick Action Pills */}
      <div className="se-pills-row">
        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginRight: '4px' }}>
          Popular Actions:
        </span>
        {quickPills.map((pill) => {
          const Icon = pill.icon;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => handlePillClick(pill.query)}
              className="se-pill-btn"
            >
              <Icon size={14} color="#38bdf8" />
              {pill.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
