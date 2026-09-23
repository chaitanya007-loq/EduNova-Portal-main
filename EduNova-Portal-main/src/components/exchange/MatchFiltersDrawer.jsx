import React from 'react';
import { Filter, Search, RotateCcw, X } from 'lucide-react';

export const MatchFiltersDrawer = ({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onResetFilters,
  sortBy,
  onSortChange,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="se-modal-overlay">
      <div className="se-modal-box" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '12px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Filter size={18} color="#06b6d4" /> Filter & Sort Matches
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search Input */}
          <div>
            <label className="se-form-label">
              Search Skills or Peers
            </label>
            <div className="se-search-input-wrapper">
              <Search className="se-search-icon" style={{ width: '16px', height: '16px' }} />
              <input
                type="text"
                placeholder="Search e.g. React, UI/UX, Python..."
                value={searchQuery || ''}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="se-search-input"
                style={{ padding: '10px 14px 10px 40px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="se-form-label">
              Smart Sorting
            </label>
            <select
              value={sortBy || 'recommended'}
              onChange={(e) => onSortChange && onSortChange(e.target.value)}
              className="se-form-select"
            >
              <option value="recommended">Recommended (EduNova Synergy)</option>
              <option value="matchScore">Highest Match Score %</option>
              <option value="rating">Highest Average Rating ⭐</option>
              <option value="completedCount">Most Completed Swaps</option>
            </select>
          </div>

          {/* Skill I Want */}
          <div>
            <label className="se-form-label">
              Filter Skill I Want
            </label>
            <select
              value={filters?.wantSkill || 'All'}
              onChange={(e) => onFilterChange && onFilterChange('wantSkill', e.target.value)}
              className="se-form-select"
            >
              <option value="All">All Desired Skills</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="React">React.js</option>
              <option value="Python">Python & Data Science</option>
              <option value="Node.js">Node.js & Backend</option>
              <option value="3D WebGL">3D WebGL & Shaders</option>
              <option value="Mathematics">Math & Physics</option>
              <option value="Quantitative Aptitude">Quant & Exam Prep</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="se-form-label">
              Experience Level
            </label>
            <select
              value={filters?.experience || 'All'}
              onChange={(e) => onFilterChange && onFilterChange('experience', e.target.value)}
              className="se-form-select"
            >
              <option value="All">All Experience Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="se-form-label">
              Availability
            </label>
            <select
              value={filters?.availability || 'All'}
              onChange={(e) => onFilterChange && onFilterChange('availability', e.target.value)}
              className="se-form-select"
            >
              <option value="All">Any Availability</option>
              <option value="Weekends">Weekends</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Evenings">Evenings</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', pt: '10px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <button
              onClick={onResetFilters}
              className="se-btn se-btn-secondary"
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              onClick={onClose}
              className="se-btn se-btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchFiltersDrawer;
