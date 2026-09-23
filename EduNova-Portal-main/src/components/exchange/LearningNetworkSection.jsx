import React, { useState } from 'react';
import {
  Users,
  Repeat,
  MessageSquare,
  Calendar,
  Sparkles,
  TrendingUp,
  FolderGit2,
  BookOpen,
  UserPlus,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

export const LearningNetworkSection = ({
  onOpenChat,
  onRequestExchange,
  onOpenScheduler,
  candidates = []
}) => {
  const [networkTab, setNetworkTab] = useState('people'); // 'people' | 'exchanges' | 'messages' | 'sessions' | 'circles' | 'projects'

  const trendingSkills = [
    { name: 'React 19 & Next.js', category: 'Web Dev', learners: 48, growth: '+24%' },
    { name: 'Python for AI & ML', category: 'AI', learners: 62, growth: '+38%' },
    { name: 'CBSE Class 10 Math', category: 'School', learners: 35, growth: '+15%' },
    { name: 'Figma Auto Layout', category: 'UI/UX', learners: 29, growth: '+18%' },
    { name: 'DSA & LeetCode Patterns', category: 'Algorithms', learners: 54, growth: '+31%' }
  ];

  const projectPartners = [
    {
      title: 'AI Education Assistant Web App',
      roles: 'Frontend Developer (React), UI/UX Designer',
      author: 'Priya Verma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Verma',
      stack: 'React, Node.js, OpenAI API'
    },
    {
      title: 'Smart Exam Study Planner Mobile App',
      roles: 'Backend Developer (Node.js), QA Specialist',
      author: 'Dev Patel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      stack: 'React Native, Express, MongoDB'
    }
  ];

  return (
    <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* SECTION HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
            Interactive Peer Ecosystem
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            YOUR LEARNING NETWORK
          </h2>
        </div>

        {/* Network Sub-Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(12, 16, 36, 0.8)', padding: '6px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)' }}>
          {[
            { id: 'people', label: 'People', icon: Users },
            { id: 'exchanges', label: 'Exchanges', icon: Repeat },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'sessions', label: 'Sessions', icon: Calendar },
            { id: 'projects', label: 'Project Partners', icon: FolderGit2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = networkTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setNetworkTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'transparent',
                  color: isActive ? '#fff' : '#94a3b8',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB TAB 1: RECOMMENDED PEOPLE & STUDY BUDDIES */}
      {networkTab === 'people' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {candidates.slice(0, 3).map((candidate) => (
            <div
              key={candidate.id}
              style={{
                padding: '20px',
                borderRadius: '20px',
                background: 'rgba(12, 16, 36, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={candidate.avatar} alt={candidate.name} style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0 }}>{candidate.name}</h4>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>{candidate.title}</p>
                </div>
              </div>

              <div style={{ padding: '10px', borderRadius: '12px', background: '#050814', fontSize: '0.78rem' }}>
                <span style={{ color: '#38bdf8', fontWeight: 700, display: 'block' }}>
                  Teaches: {candidate.skillsToTeach?.[0]?.name || 'React'}
                </span>
                <span style={{ color: '#c084fc', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                  Wants: {candidate.skillsToLearn?.[0]?.name || 'UI/UX'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onRequestExchange(candidate)}
                  className="se-btn se-btn-primary"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.78rem', justifyContent: 'center' }}
                >
                  <UserPlus size={14} /> Exchange
                </button>
                <button
                  onClick={onOpenChat}
                  className="se-btn se-btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.78rem' }}
                >
                  <MessageSquare size={14} /> Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB TAB 2: PROJECT PARTNERS */}
      {networkTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {projectPartners.map((proj, idx) => (
            <div
              key={idx}
              style={{
                padding: '20px',
                borderRadius: '20px',
                background: 'rgba(12, 16, 36, 0.9)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FolderGit2 size={20} color="#a855f7" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>{proj.title}</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                Looking for: <strong style={{ color: '#38bdf8' }}>{proj.roles}</strong>
              </p>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', padding: '8px 12px', borderRadius: '10px', background: '#050814' }}>
                Tech Stack: {proj.stack}
              </div>
              <button
                onClick={onOpenChat}
                className="se-btn se-btn-purple"
                style={{ padding: '8px 14px', fontSize: '0.8rem', justifyContent: 'center' }}
              >
                Join Project Group Chat
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TRENDING SKILLS WIDGET */}
      <div style={{ padding: '24px', borderRadius: '24px', background: 'rgba(12, 16, 36, 0.9)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <TrendingUp size={18} color="#38bdf8" /> Trending Peer Exchange Skills
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {trendingSkills.map((sk, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px 16px',
                borderRadius: '16px',
                background: '#050814',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', display: 'block' }}>{sk.name}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{sk.learners} active learners</span>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', fontSize: '0.75rem', fontWeight: 800 }}>
                {sk.growth}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
