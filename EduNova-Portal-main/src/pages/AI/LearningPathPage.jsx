import React, { useState, useEffect } from 'react';
import { getPersonalizedLearningPath } from '../../services/progressService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Bot, Route, CheckCircle, Clock, Lock, ArrowDown } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const LearningPathPage = () => {
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPersonalizedLearningPath().then((data) => {
      setPathData(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <SkeletonLoader height="400px" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Route size={28} color="#6366f1" /> Your AI Recommended Learning Path
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Sage AI continuously re-evaluates your completed quizzes and lab exercises to optimize your learning sequence.
        </p>
      </div>

      {/* AI Recommendation Reason Banner */}
      <Card style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
        border: '1px solid var(--border-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Bot size={20} color="#38bdf8" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>Why Sage AI Recommends This Sequence</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {pathData.recommendationReason}
        </p>
      </Card>

      {/* Vertical Sequence Nodes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {pathData.nodes.map((node, idx) => {
          const isCompleted = node.status === 'completed';
          const isRecommended = node.status === 'recommended' || node.status === 'in_progress';
          const isLocked = node.status === 'locked';

          return (
            <React.Fragment key={node.id}>
              <Card hoverEffect={!isLocked} style={{
                border: isRecommended ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                opacity: isLocked ? 0.65 : 1
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isCompleted ? '#10b981' : isRecommended ? '#06b6d4' : 'var(--bg-tertiary)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}>
                      {isCompleted ? <CheckCircle size={20} /> : isLocked ? <Lock size={18} /> : node.step}
                    </div>

                    <div>
                      <span className={`cyber-badge-${isCompleted ? 'emerald' : isRecommended ? 'cyan' : 'amber'}`}>
                        {node.difficulty} • {node.estimatedHours}
                      </span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>{node.title}</h3>
                    </div>
                  </div>

                  {isRecommended && (
                    <Button size="sm">Continue Node</Button>
                  )}
                </div>
              </Card>

              {idx < pathData.nodes.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ArrowDown size={24} color="var(--text-muted)" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
