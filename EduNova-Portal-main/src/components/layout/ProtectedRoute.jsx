import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EduNovaLoadingScreen } from '../common/EduNovaLoadingScreen';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Render premium 3D EduNova loading screen during auth checking
  if (loading && !user) {
    return <EduNovaLoadingScreen message="Negotiating with the Wi-Fi… 📶" fullScreen={true} />;
  }

  if (!isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  // Check onboarding status for learners
  const onboardingCompleted = user?.learnerProfile?.onboardingCompleted ?? user?.onboardingCompleted ?? true;
  if (user && user?.role !== 'PARENT' && !onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;
