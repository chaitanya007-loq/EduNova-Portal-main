// EduNova AI Error Handler
// Standardizes AI API exception responses into user-friendly error objects

export const handleAIError = (error, mode = 'General') => {
  console.error(`[EduNova Sage AI Error - Mode: ${mode}]:`, error);

  const errorString = String(error?.message || error || '').toLowerCase();

  if (errorString.includes('429') || errorString.includes('rate limit') || errorString.includes('resource_exhausted')) {
    return {
      status: 'rate_limited',
      message: 'Sage AI is receiving high traffic right now. Please wait a few seconds and try again.',
      canRetry: true
    };
  }

  if (errorString.includes('network') || errorString.includes('fetch') || errorString.includes('failed to fetch')) {
    return {
      status: 'network_error',
      message: 'Network connection issue. Please check your internet connection.',
      canRetry: true
    };
  }

  if (errorString.includes('api key') || errorString.includes('unauthorized') || errorString.includes('401')) {
    return {
      status: 'auth_error',
      message: 'Gemini API key is not configured or unauthorized. Using EduNova offline intelligence engine.',
      canRetry: false
    };
  }

  return {
    status: 'error',
    message: 'Sage AI is temporarily unavailable. Switching to EduNova offline intelligence engine.',
    canRetry: true
  };
};
