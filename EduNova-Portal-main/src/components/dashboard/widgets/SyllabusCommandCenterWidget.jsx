import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, RotateCcw, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../common/Button';
import examTrackService from '../../../services/examTrackService';

export const SyllabusCommandCenterWidget = () => {
  const navigate = useNavigate();
  const syllabus = examTrackService.getExamSyllabusData();

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
          <span className="cyber-badge-cyan">{syllabus.examName} • {syllabus.daysRemaining} Days Left</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={22} color="#f59e0b" /> Exam Syllabus Command Center
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <Button size="xs" variant="outline" onClick={() => navigate('/my-subjects')}>
            View Topics
          </Button>
          <Button size="xs" onClick={() => navigate('/courses')}>
            Start Practice
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Topics</span>
          <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '2px' }}>{syllabus.totalTopics}</strong>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed</span>
          <strong style={{ display: 'block', fontSize: '1.4rem', color: '#10b981', marginTop: '2px' }}>{syllabus.completedTopics}</strong>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In Revision</span>
          <strong style={{ display: 'block', fontSize: '1.4rem', color: '#a855f7', marginTop: '2px' }}>{syllabus.inRevisionTopics}</strong>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mastered</span>
          <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>{syllabus.masteredTopics}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {syllabus.subjectBreakdown.map((sub, idx) => (
          <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{sub.subject}</strong>
              <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Next: {sub.nextTopic}</span>
            </div>
            <div style={{ width: '130px', textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{sub.completed} / {sub.total} Topics ({sub.progress}%)</span>
              <div style={{ width: '100%', height: '5px', background: 'var(--bg-tertiary)', borderRadius: '3px', marginTop: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${sub.progress}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #06b6d4)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyllabusCommandCenterWidget;
