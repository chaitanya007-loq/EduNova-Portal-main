import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, FolderGit2, Users, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../../common/Button';
import collegeTrackService from '../../../services/collegeTrackService';

export const ProjectTrackerWidget = () => {
  const navigate = useNavigate();
  const projects = collegeTrackService.getCollegeProjects();

  return (
    <div style={{
      background: 'var(--glass-bg)',
      padding: '24px',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderGit2 size={18} color="#10b981" /> Practical Projects & Portfolio
        </h3>
        <Button size="xs" variant="outline" onClick={() => navigate('/my-subjects')}>
          + New Project
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {projects.map((proj) => (
          <div
            key={proj.id}
            style={{
              background: 'var(--bg-secondary)',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>{proj.name}</strong>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{proj.technology}</span>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                background: proj.status === 'Testing' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                color: proj.status === 'Testing' ? '#10b981' : '#818cf8'
              }}>
                {proj.status}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span><Users size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {proj.team}</span>
              <span><Calendar size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Due {proj.deadline}</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                <span>Milestone Completion</span>
                <strong>{proj.progress}%</strong>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${proj.progress}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTrackerWidget;
