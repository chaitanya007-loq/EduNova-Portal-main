import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../../services/courseService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Star, Clock, BookOpen, CheckCircle, PlayCircle, Bot, ArrowLeft } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourseById(id).then((data) => {
      setCourse(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <SkeletonLoader height="400px" />;
  if (!course) return <div>Course not found.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Back Button Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate('/courses')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9999px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--accent-cyan)',
            fontSize: '0.86rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: 'var(--glass-shadow)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>
      </div>
      {/* Course Banner Header */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--border-glow)',
        background: '#050811'
      }}>
        <img
          src={course.thumbnail}
          alt={course.title}
          style={{ width: '100%', height: '260px', objectFit: 'cover', opacity: 0.4 }}
        />

        <div style={{ position: 'absolute', inset: 0, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <span className="cyber-badge-cyan" style={{ marginBottom: '12px', width: 'fit-content' }}>
            {course.category}
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>{course.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '750px' }}>
            Instructor: <strong>{course.instructor}</strong> • {course.duration} Total Duration
          </p>
        </div>
      </div>

      {/* Course Overview & Modules */}
      <div className="dashboard-grid">
        <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Course Syllabus & Modules</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {course.modules.map((m, idx) => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/courses/${course.id}/lesson`)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {m.completed ? <CheckCircle size={18} color="#10b981" /> : <PlayCircle size={18} color="#6366f1" />}
                    <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{m.title}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.duration}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Your Completion Progress</h3>
            <ProgressBar progress={course.progress} height={8} />
            <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700, display: 'block', marginTop: '6px' }}>
              {course.progress}% Completed
            </span>

            <Button
              style={{ width: '100%', marginTop: '20px' }}
              onClick={() => navigate(`/courses/${course.id}/lesson`)}
            >
              <PlayCircle size={18} /> Launch Lesson Viewer
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
