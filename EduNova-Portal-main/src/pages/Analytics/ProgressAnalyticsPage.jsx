import React, { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

import { AnalyticsHeader } from '../../components/analytics/AnalyticsHeader';
import { AnalyticsKPIGrid } from '../../components/analytics/AnalyticsKPIGrid';
import { LearningHealthCard } from '../../components/analytics/LearningHealthCard';
import { StudyHoursChart } from '../../components/analytics/StudyHoursChart';
import { StudyHeatmap } from '../../components/analytics/StudyHeatmap';
import { SubjectPerformanceMatrix } from '../../components/analytics/SubjectPerformanceMatrix';
import { SubjectFocusChart } from '../../components/analytics/SubjectFocusChart';
import { TimeVsPerformanceAnalysis } from '../../components/analytics/TimeVsPerformanceAnalysis';
import { WeakTopicsRadar } from '../../components/analytics/WeakTopicsRadar';
import { LearningTrendChart } from '../../components/analytics/LearningTrendChart';
import { AccuracyIntelligence } from '../../components/analytics/AccuracyIntelligence';
import { RevisionRadar } from '../../components/analytics/RevisionRadar';
import { GoalAndTimelineCard } from '../../components/analytics/GoalAndTimelineCard';
import { PersonalPatternsCard } from '../../components/analytics/PersonalPatternsCard';
import { SageInsightsSection, NextBestActionCard } from '../../components/analytics/SageInsightsSection';
import { KnowledgeConstellationWidget } from '../../components/analytics/KnowledgeConstellationWidget';
import { AnalyticsChatModal } from '../../components/analytics/AnalyticsChatModal';
import { ExportReportModal, AnalyticsPrivacyModal } from '../../components/analytics/ExportReportModal';
import { AnalyticsSkeleton } from '../../components/analytics/AnalyticsSkeleton';

// Interactive Practice & Revision Modals
import { SkillPracticeModal } from '../../components/knowledge/SkillPracticeModal';
import { RevisionFlashcardsModal } from '../../components/knowledge/RevisionFlashcardsModal';
import { AddToPlannerModal } from '../../components/knowledge/AddToPlannerModal';

export const ProgressAnalyticsPage = () => {
  const {
    timeRange,
    setTimeRange,
    educationContext,
    setEducationContext,
    analyticsData,
    isLoading,
    error,
    refreshAnalytics
  } = useAnalytics();

  // Modals state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [chatInitialQuery, setChatInitialQuery] = useState('');
  const [activeTargetObj, setActiveTargetObj] = useState(null);

  const handleAction = (type, targetObj) => {
    const target = targetObj || { topic: 'Chemical Reactions & Equations', subject: 'Chemistry' };
    setActiveTargetObj(target);

    if (type === 'sage' || type === 'explain') {
      setChatInitialQuery(target?.topic ? `Explain why ${target.topic} in ${target.subject || 'your subjects'} was identified as a weak area and how I can improve.` : `Explain ${target?.title || 'my recent analytics'}.`);
      setIsChatOpen(true);
    } else if (type === 'practice' || type === 'start') {
      setIsPracticeOpen(true);
    } else if (type === 'revise') {
      setIsRevisionOpen(true);
    } else if (type === 'planner') {
      setIsPlannerOpen(true);
    }
  };

  if (isLoading && !analyticsData) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* 1. HERO PAGE HEADER & CONTEXT FILTERS */}
      <AnalyticsHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        educationContext={educationContext}
        onEducationContextChange={setEducationContext}
        lastUpdated={analyticsData?.lastUpdated}
        onExport={() => setIsExportOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenChat={() => { setChatInitialQuery(''); setIsChatOpen(true); }}
        onRefresh={refreshAnalytics}
      />

      {/* 2. HIGHLIGHTED NEXT BEST LEARNING ACTION */}
      {analyticsData?.nextBestAction && (
        <NextBestActionCard
          actionData={analyticsData.nextBestAction}
          onAction={handleAction}
        />
      )}

      {/* 3. TOP KPI COMMAND CENTER (8 Cards) */}
      <AnalyticsKPIGrid kpiData={analyticsData?.kpiSummary} />

      {/* 4. AI LEARNING HEALTH SCORE (Radial Score & Ring Breakdown) */}
      <LearningHealthCard healthData={analyticsData?.learningHealth} />

      {/* 5. WEEKLY STUDY HOURS LOG & SUBJECT FOCUS RATIO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        <StudyHoursChart weeklyData={analyticsData?.weeklyHours} />
        <SubjectFocusChart focusData={analyticsData?.subjectFocus} />
      </div>

      {/* 6. SUBJECT PERFORMANCE MATRIX */}
      <SubjectPerformanceMatrix subjectsData={analyticsData?.subjectMatrix} />

      {/* 7. STUDY CONSISTENCY HEATMAP (365 Days Activity) */}
      <StudyHeatmap heatmapData={analyticsData?.activityHeatmap} />

      {/* 8. TIME VS PERFORMANCE RELATIONSHIP ANALYSIS */}
      <TimeVsPerformanceAnalysis relationshipData={analyticsData?.timeVsPerformance} />

      {/* 9. WEAK TOPICS RADAR & STRONGEST AREAS */}
      <WeakTopicsRadar
        weakTopics={analyticsData?.weakTopics || []}
        strengths={analyticsData?.strengths || []}
        onAction={handleAction}
      />

      {/* 10. LEARNING TREND (Interactive Metric Chart) */}
      <LearningTrendChart />

      {/* 11. ACCURACY INTELLIGENCE & ERROR PATTERN ANALYSIS */}
      <AccuracyIntelligence
        accuracyData={analyticsData?.accuracyIntel}
        onAskSageError={() => {
          setChatInitialQuery('Analyze my error patterns and tell me why I am losing marks.');
          setIsChatOpen(true);
        }}
      />

      {/* 12. REVISION RADAR & EXAM READINESS */}
      {analyticsData?.revisionRadar && analyticsData?.examReadiness && (
        <RevisionRadar
          revisionData={analyticsData.revisionRadar}
          examData={analyticsData.examReadiness}
          onReviseTopic={(r) => handleAction('revise', r)}
        />
      )}

      {/* 13. GOAL PROGRESS & STUDY BALANCE TIMELINE */}
      <GoalAndTimelineCard
        goalData={analyticsData?.goal}
        balanceData={analyticsData?.studyBalance}
        timelineData={analyticsData?.productivityTimeline}
      />

      {/* 14. KNOWLEDGE CONSTELLATION TOPIC NETWORK GRAPH */}
      <KnowledgeConstellationWidget />

      {/* 15. SAGE AI LEARNING INSIGHTS SECTION */}
      <SageInsightsSection
        insights={analyticsData?.insights || []}
        onAction={handleAction}
      />

      {/* 16. PERSONAL LEARNING PATTERNS */}
      <PersonalPatternsCard patternsData={analyticsData?.personalPatterns} />

      {/* MODALS */}
      <AnalyticsChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        analyticsData={analyticsData}
        initialQuery={chatInitialQuery}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        analyticsData={analyticsData}
      />

      <AnalyticsPrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <SkillPracticeModal
        isOpen={isPracticeOpen}
        onClose={() => setIsPracticeOpen(false)}
        skillObj={activeTargetObj}
      />

      <RevisionFlashcardsModal
        isOpen={isRevisionOpen}
        onClose={() => setIsRevisionOpen(false)}
        topicObj={activeTargetObj}
      />

      <AddToPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        skillObj={activeTargetObj}
      />
    </div>
  );
};
