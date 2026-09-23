import React, { useState } from 'react';
import { Search, Filter, Layers, Compass, Sparkles, BookOpen } from 'lucide-react';
import LabCard from './LabCard';
import { getFilteredLabs } from '../../services/labService';
import { useTheme } from '../../context/ThemeContext';

export const LabLibrary = ({ activeContext, progress = {}, onOpenLab }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const completedLabs = progress.completedLabs || [];

  // Filter labs according to active learner context & local state
  const labs = getFilteredLabs(activeContext, {
    subject: selectedSubject,
    difficulty: selectedDifficulty,
    query: searchQuery
  });

  // Extract available subjects from activeContext
  const subjectsList = ['All', ...(activeContext?.selectedSubjects || ['Physics', 'Chemistry', 'Biology', 'Data Structures', 'Operating Systems', 'Mathematics'])];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search & Filtering Header Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '20px 24px',
          borderRadius: '20px',
          background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(15, 23, 42, 0.65)',
          border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          boxShadow: isLight ? '0 10px 30px rgba(37, 99, 235, 0.06)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: isLight ? '#18345F' : '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Compass size={22} color={isLight ? '#0284c7' : '#06b6d4'} /> Explore Interactive Labs
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: isLight ? '#475569' : '#94a3b8' }}>
              Select a subject or experiment topic tailored to your active curriculum profile.
            </p>
          </div>

          {/* Search Box */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '320px'
            }}
          >
            <Search size={18} color={isLight ? '#64748b' : '#94a3b8'} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search labs, topics, or formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 42px',
                borderRadius: '12px',
                background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.8)',
                border: isLight ? '1px solid rgba(186, 230, 253, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Subject Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {subjectsList.map((sub) => {
            const isActive = selectedSubject.toLowerCase() === sub.toLowerCase();
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: isActive
                    ? (isLight ? '#2563eb' : '#0ea5e9')
                    : (isLight ? '#f1f5f9' : 'rgba(30, 41, 59, 0.6)'),
                  color: isActive ? '#ffffff' : (isLight ? '#475569' : '#94a3b8'),
                  border: isActive
                    ? 'none'
                    : (isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)'),
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive
                    ? (isLight ? '0 2px 8px rgba(37, 99, 235, 0.25)' : '0 2px 8px rgba(14, 165, 233, 0.3)')
                    : 'none'
                }}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lab Cards Responsive Grid */}
      {labs.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {labs.map((lab) => (
            <LabCard
              key={lab.id}
              lab={lab}
              isCompleted={completedLabs.includes(lab.id)}
              onOpenLab={onOpenLab}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <BookOpen size={40} color="#64748b" />
          <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.1rem' }}>No labs found</h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>
            Try adjusting your search query or switching subject categories.
          </p>
          <button
            onClick={() => {
              setSelectedSubject('All');
              setSearchQuery('');
            }}
            style={{
              marginTop: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.84rem'
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default LabLibrary;
