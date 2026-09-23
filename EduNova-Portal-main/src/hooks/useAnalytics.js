import { useState, useEffect, useCallback } from 'react';
import { useLearner } from '../context/LearnerContext';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  const { learner, learnerType: contextLearnerType } = useLearner();

  const [timeRange, setTimeRange] = useState('30d');
  const [educationContext, setEducationContext] = useState(contextLearnerType || 'college');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync education context if global learner context changes
  useEffect(() => {
    if (contextLearnerType) {
      setEducationContext(contextLearnerType);
    }
  }, [contextLearnerType]);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getAnalyticsData(timeRange, educationContext, learner);
      setAnalyticsData(data);
    } catch (err) {
      setError(err.message || 'Failed to load learning analytics');
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, educationContext, learner]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    timeRange,
    setTimeRange,
    educationContext,
    setEducationContext,
    analyticsData,
    isLoading,
    error,
    refreshAnalytics: fetchAnalytics
  };
};
