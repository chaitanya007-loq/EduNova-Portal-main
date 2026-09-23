import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Target, Plus } from 'lucide-react';
import { addSkillToLearn } from '../../services/skillExchangeService';

export const AddLearningGoalModal = ({ isOpen, onClose, onGoalAdded }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Design');
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [targetLevel, setTargetLevel] = useState('Intermediate');
  const [goal, setGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGoal = {
      name: name.trim(),
      category,
      currentLevel,
      targetLevel,
      goal: goal.trim() || `Master ${name.trim()} fundamentals and practical projects`
    };

    addSkillToLearn(newGoal);
    onGoalAdded && onGoalAdded(newGoal);
    setName('');
    setGoal('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Skill You Want to Learn">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Target Skill Name</label>
          <input
            type="text"
            placeholder="e.g. UI/UX Design, Figma, Python, 3D WebGL"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%' }}>
              <option value="Design">Design & UI/UX</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science & AI</option>
              <option value="Backend">Backend & Cloud</option>
              <option value="3D Graphics">3D & Game Dev</option>
              <option value="School Academics">School Academics</option>
              <option value="Exam Prep">Competitive Exam Prep</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Current Level</label>
            <select value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} style={{ width: '100%' }}>
              <option value="Beginner">Absolute Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Specific Learning Goal</label>
          <textarea
            rows={3}
            placeholder="e.g. Design modern mobile UI layouts in Figma and create reusable design tokens"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>

        <Button type="submit" size="lg" style={{ marginTop: '6px' }}>
          <Target size={16} /> Save Learning Goal
        </Button>
      </form>
    </Modal>
  );
};

export default AddLearningGoalModal;
