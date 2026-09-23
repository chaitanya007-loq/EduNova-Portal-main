import React, { useState } from 'react';
import { useSkillDNA } from '../../hooks/useSkillDNA';
import { SkillDNAHero } from '../../components/skillDNA/SkillDNAHero';
import { SkillConstellation } from '../../components/skillDNA/SkillConstellation';
import { SkillCategoryGrid } from '../../components/skillDNA/SkillCategoryGrid';
import { StrengthsAndWeaknesses } from '../../components/skillDNA/StrengthsAndWeaknesses';
import { SkillGapAnalysis } from '../../components/skillDNA/SkillGapAnalysis';
import { LearningRoadmapView } from '../../components/skillDNA/LearningRoadmapView';
import { GrowthTimeline } from '../../components/skillDNA/GrowthTimeline';
import { quizService } from '../../services/quizService';
import { sanitizeQuizForTesting } from '../../services/ai/aiValidator';
import { CheckCircle2, Play, RefreshCw, X } from 'lucide-react';

export const SkillDnaPage = () => {
  const {
    skillDNA,
    loading,
    activeGoal,
    gapAnalysis,
    roadmap,
    updateGoal,
    refreshAnalysis
  } = useSkillDNA();

  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [assessmentQuiz, setAssessmentQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(0);

  // Generate Adaptive Skill Assessment
  const handleStartAssessment = async () => {
    setShowAssessmentModal(true);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setAssessmentScore(0);

    // Fetch dynamic adaptive questions from quizService
    const quiz = await quizService.getQuizById ? quizService.getQuizById('q_programming_1') : null;
    const initialQuestions = quiz ? quiz.questions : [
      {
        id: 'q1',
        question: 'What is the primary benefit of React Virtual DOM?',
        options: [
          { id: 'A', text: 'Directly modifies the browser DOM on every state change' },
          { id: 'B', text: 'Minimizes real DOM re-renders by batching diff calculations in memory' },
          { id: 'C', text: 'Eliminates JavaScript execution inside the browser' },
          { id: 'D', text: 'Compiles React components directly into WebAssembly' }
        ],
        correctOptionId: 'B',
        explanation: 'The Virtual DOM computes memory diffs and efficiently updates only changed real DOM nodes.'
      },
      {
        id: 'q2',
        question: 'What is the time complexity of searching a target key in a balanced Binary Search Tree (BST)?',
        options: [
          { id: 'A', text: 'O(1)' },
          { id: 'B', text: 'O(log n)' },
          { id: 'C', text: 'O(n)' },
          { id: 'D', text: 'O(n^2)' }
        ],
        correctOptionId: 'B',
        explanation: 'Balanced BST halving at each step guarantees logarithmic time complexity O(log n).'
      }
    ];

    setAssessmentQuiz({
      title: 'Adaptive Skill Assessment',
      questions: initialQuestions
    });
  };

  const handleOptionSelect = (optionId) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const currentQ = assessmentQuiz.questions[currentQuestionIdx];
    if (selectedOption === currentQ.correctOptionId) {
      setAssessmentScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < assessmentQuiz.questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Assessment completed
      refreshAnalysis();
    }
  };

  if (loading || !skillDNA) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center', color: '#38bdf8' }}>
        <RefreshCw size={28} className="animate-spin-slow" />
        <p style={{ marginTop: '12px', color: '#94a3b8' }}>Analyzing verified learning evidence and skill DNA...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '8px', paddingBottom: '40px' }}>
      
      {/* 1. Hero Header Banner */}
      <SkillDNAHero
        skillDNA={skillDNA}
        onTakeAssessment={handleStartAssessment}
        onGenerateRoadmap={() => {
          const el = document.getElementById('skill-roadmap-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Main Visual Grid: Constellation Map + Skill Categories */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px', alignItems: 'start' }}>
        <div className="col-span-4">
          <SkillConstellation
            skills={skillDNA.skills}
            onSelectSkill={(s) => console.log('Selected skill:', s)}
          />
        </div>

        <div className="col-span-8">
          <SkillCategoryGrid
            skills={skillDNA.skills}
            onSelectSkill={(s) => console.log('Selected skill category:', s)}
          />
        </div>
      </div>

      {/* 3. Strengths & Weak Areas Panels */}
      <StrengthsAndWeaknesses
        strengths={skillDNA.topStrengths}
        weakAreas={skillDNA.weakAreas}
      />

      {/* 4. AI Skill Gap Analysis */}
      <SkillGapAnalysis
        gapAnalysis={gapAnalysis}
        activeGoal={activeGoal}
        onSelectGoal={updateGoal}
      />

      {/* 5. AI Learning Roadmap */}
      <div id="skill-roadmap-section">
        <LearningRoadmapView roadmap={roadmap} />
      </div>

      {/* 6. Growth Timeline & Evidence Log */}
      <GrowthTimeline />

      {/* 7. Adaptive Skill Assessment Modal */}
      {showAssessmentModal && assessmentQuiz && (
        <div className="se-modal-overlay" onClick={() => setShowAssessmentModal(false)}>
          <div className="se-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Adaptive Skill Assessment
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>
                  Question {currentQuestionIdx + 1} of {assessmentQuiz.questions.length}
                </span>
              </div>
              <button onClick={() => setShowAssessmentModal(false)} style={{ color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {currentQuestionIdx < assessmentQuiz.questions.length ? (
              <div>
                <div style={{ background: 'rgba(5, 8, 20, 0.7)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '16px' }}>
                  <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                    {assessmentQuiz.questions[currentQuestionIdx].question}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {assessmentQuiz.questions[currentQuestionIdx].options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const isCorrect = opt.id === assessmentQuiz.questions[currentQuestionIdx].correctOptionId;

                    let bg = 'rgba(255, 255, 255, 0.05)';
                    let border = '1px solid rgba(255, 255, 255, 0.14)';
                    let color = '#ffffff';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        bg = 'rgba(52, 211, 153, 0.2)';
                        border = '1px solid #34d399';
                        color = '#34d399';
                      } else if (isSelected && !isCorrect) {
                        bg = 'rgba(244, 63, 94, 0.2)';
                        border = '1px solid #fb7185';
                        color = '#fb7185';
                      }
                    } else if (isSelected) {
                      bg = 'rgba(6, 182, 212, 0.2)';
                      border = '1px solid #38bdf8';
                      color = '#38bdf8';
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleOptionSelect(opt.id)}
                        disabled={isAnswerSubmitted}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: bg,
                          border: border,
                          color: color,
                          textAlign: 'left',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          cursor: isAnswerSubmitted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {isAnswerSubmitted && (
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', marginBottom: '16px', color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.4 }}>
                    <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '2px' }}>Explanation:</strong>
                    {assessmentQuiz.questions[currentQuestionIdx].explanation}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedOption}
                      className="se-btn se-btn-primary"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="se-btn se-btn-primary"
                    >
                      {currentQuestionIdx + 1 < assessmentQuiz.questions.length ? 'Next Question' : 'Complete Assessment'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={48} color="#34d399" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Assessment Complete!
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '8px 0 20px 0' }}>
                  You scored <strong>{assessmentScore} / {assessmentQuiz.questions.length}</strong>. Your Skill DNA profile and verified activity evidence have been updated.
                </p>
                <button onClick={() => setShowAssessmentModal(false)} className="se-btn se-btn-primary">
                  Return to Skill DNA
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default SkillDnaPage;
