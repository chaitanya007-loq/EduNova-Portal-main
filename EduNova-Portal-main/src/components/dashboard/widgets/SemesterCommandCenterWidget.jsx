import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Calendar, Award, ArrowRight } from 'lucide-react';
import { Button } from '../../common/Button';
import collegeTrackService from '../../../services/collegeTrackService';

export const SemesterCommandCenterWidget = () => {
  const navigate = useNavigate();
  const semester = collegeTrackService.getSemesterData();

  return (
    <div style={{
      background: 'var(--glass-bg)',
      padding: '24px',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="cyber-badge-cyan">Semester {semester.semesterNumber} • {semester.degree}</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={22} color="#6366f1" /> Semester Command Center
          </h3>
        </div>

        <span style={{
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#f59e0b',
          fontWeight: 800,
          fontSize: '0.8rem',
          padding: '4px 12px',
          borderRadius: '999px'
        }}>
          Internal Exams: {semester.internalExamDaysRemaining} Days
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Subjects</span>
          <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>{semester.activeSubjectsCount}</strong>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Credits</span>
          <strong style={{ display: 'block', fontSize: '1.4rem', color: '#6366f1', marginTop: '2px' }}>{semester.totalCredits}</strong>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assignments Due</span>
          <strong style={{ display: 'block', fontSize: '1.4rem', color: '#f43f5e', marginTop: '2px' }}>{semester.assignmentsDueCount}</strong>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Projects Active</span>
          <strong style={{ display: 'block', fontSize: '1.4rem', color: '#10b981', marginTop: '2px' }}>{semester.projectsInProgressCount}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {semester.subjects.slice(0, 3).map((sub, idx) => (
          <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{sub.name}</strong>
              <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{sub.credits} Credits • Current Grade {sub.grade}</span>
            </div>
            <div style={{ width: '120px', textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{sub.progress}%</span>
              <div style={{ width: '100%', height: '5px', background: 'var(--bg-tertiary)', borderRadius: '3px', marginTop: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${sub.progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemesterCommandCenterWidget;
