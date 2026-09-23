import React from 'react';
import { sampleProjects, sampleResources } from '../../data/community';
import { FolderGit2, BookOpen, Download, ThumbsUp, ExternalLink, Code } from 'lucide-react';
import { Button } from '../common/Button';

export const ProjectsTab = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      {sampleProjects.map((proj) => (
        <div
          key={proj.id}
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--glass-shadow)'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="cyber-badge-cyan" style={{ fontSize: '0.75rem' }}>Project Showcase</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>By {proj.creator}</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {proj.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              {proj.description}
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {proj.techStack.map((t) => (
                <span key={t} className="cyber-badge" style={{ fontSize: '0.75rem' }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button size="sm" style={{ flex: 1 }}>
              <ExternalLink size={14} /> Live Demo
            </Button>
            <Button size="sm" variant="outline" style={{ flex: 1 }}>
              <Code size={14} /> Code
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ResourcesTab = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      {sampleResources.map((res) => (
        <div
          key={res.id}
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="cyber-badge-cyan" style={{ fontSize: '0.75rem' }}>{res.type}</span>
              <span className="cyber-badge" style={{ fontSize: '0.75rem' }}>{res.subject}</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
              {res.title}
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Uploaded by {res.author} • {res.downloadsCount} Downloads
            </span>
          </div>

          <Button size="sm">
            <Download size={14} /> Download
          </Button>
        </div>
      ))}
    </div>
  );
};
