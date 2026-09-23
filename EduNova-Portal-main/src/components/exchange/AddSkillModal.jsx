import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

export const AddSkillModal = ({ isOpen, onClose, onAddSkill }) => {
  const [type, setType] = useState('teach'); // 'teach' | 'learn'
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Intermediate');
  const [experienceYears, setExperienceYears] = useState(2);
  const [topics, setTopics] = useState('');
  const [helpDetails, setHelpDetails] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [preferredLearners, setPreferredLearners] = useState('All Levels');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skillName.trim()) {
      setError('Please enter a skill name.');
      return;
    }

    try {
      const skillObj = {
        name: skillName.trim(),
        category,
        level,
        experienceYears: Number(experienceYears),
        topics,
        helpDetails,
        portfolioUrl,
        preferredLearners
      };
      onAddSkill(type, skillObj);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add skill');
    }
  };

  return (
    <div className="se-modal-overlay">
      <div className="se-modal-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', color: '#38bdf8' }}>
              <Plus size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Add New Skill to Profile</h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>Expand your teaching or learning portfolio</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', fontSize: '0.8rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Type Switch */}
          <div style={{ display: 'flex', background: '#050814', padding: '4px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <button
              type="button"
              onClick={() => setType('teach')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: type === 'teach' ? '#06b6d4' : 'transparent',
                color: type === 'teach' ? '#050814' : '#94a3b8'
              }}
            >
              Skill I Teach
            </button>
            <button
              type="button"
              onClick={() => setType('learn')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: type === 'learn' ? '#a855f7' : 'transparent',
                color: type === 'learn' ? '#ffffff' : '#94a3b8'
              }}
            >
              Skill I Want to Learn
            </button>
          </div>

          <div>
            <label className="se-form-label">
              Skill Name
            </label>
            <input
              type="text"
              value={skillName}
              onChange={(e) => { setSkillName(e.target.value); setError(''); }}
              placeholder="e.g. React, Python, UI/UX Design, Figma, SQL"
              className="se-form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="se-form-label">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="se-form-select"
              >
                <option value="Web Development">Web Development</option>
                <option value="Design">Design</option>
                <option value="Data Science">Data Science</option>
                <option value="Backend">Backend & Cloud</option>
                <option value="3D Graphics">3D Graphics</option>
                <option value="School Academics">School Academics</option>
                <option value="Exam Prep">Exam Prep</option>
              </select>
            </div>

            <div>
              <label className="se-form-label">
                Proficiency Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="se-form-select"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          {type === 'teach' && (
            <>
              <div>
                <label className="se-form-label">
                  Topics You Can Teach (comma separated)
                </label>
                <input
                  type="text"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  placeholder="e.g. Components, Hooks, State Management, Router"
                  className="se-form-input"
                />
              </div>

              <div>
                <label className="se-form-label">
                  Portfolio / Project Link (Optional)
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/... or Figma link"
                  className="se-form-input"
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <button type="button" onClick={onClose} className="se-btn se-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="se-btn se-btn-primary">
              Save Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
