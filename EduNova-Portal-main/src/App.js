import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LearningProvider } from './context/LearningContext';
import { LearnerProvider } from './context/LearnerContext';
import { AIProvider } from './context/AIContext';
import { NotificationProvider } from './context/NotificationContext';

import { MainLayout } from './components/layout/MainLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { LandingPage } from './pages/Landing/LandingPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { ParentLoginPage } from './pages/Auth/ParentLoginPage';
import { ParentRegisterPage } from './pages/Auth/ParentRegisterPage';
import { OnboardingPage } from './pages/Onboarding/OnboardingPage';
import { StudentDashboardPage } from './pages/Dashboard/StudentDashboardPage';
import { NotesPage } from './pages/Notes/NotesPage';
import { MySubjectsPage } from './pages/subjects/MySubjectsPage';
import { SubjectDetailsPage } from './pages/subjects/SubjectDetailsPage';
import { CoursesPage } from './pages/Courses/CoursesPage';
import { CourseDetailsPage } from './pages/Courses/CourseDetailsPage';
import { LessonPage } from './pages/Courses/LessonPage';
import { AIAssistantPage } from './pages/AI/AIAssistantPage';
import { LearningPathPage } from './pages/AI/LearningPathPage';
import { StudyPlannerPage } from './pages/AI/StudyPlannerPage';
import { ImmersiveLabPage } from './pages/Immersive/ImmersiveLabPage';
import { XRStudioPage } from './pages/Immersive/XRStudioPage';
import { KnowledgeConstellationPage } from './pages/Constellation/KnowledgeConstellationPage';
import { SkillDnaPage } from './pages/SkillDNA/SkillDnaPage';
import { SkillExchangePage } from './pages/Marketplace/SkillExchangePage';
import { SkillSwapMatchPage } from './pages/Marketplace/SkillSwapMatchPage';
import { CommunityPage } from './pages/Community/CommunityPage';
import { ProgressAnalyticsPage } from './pages/Analytics/ProgressAnalyticsPage';
import { AchievementsPage } from './pages/Gamification/AchievementsPage';
import { ChallengesPage } from './pages/Gamification/ChallengesPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { ParentDashboardPage } from './pages/Dashboard/ParentDashboardPage';
import { MyTasksPage } from './pages/Tasks/MyTasksPage';
import { GameCenterPage } from './pages/Games/GameCenterPage';
import { ServerUnavailableBanner } from './components/common/ServerUnavailableBanner';

export default function App() {
  useEffect(() => {
    ['edunova_user', 'edunova_active_learner_profile', 'edunova_missions', 'edunova_xp'].forEach((key) => {
      localStorage.removeItem(key);
    });
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <LearnerProvider>
          <LearningProvider>
            <AIProvider>
              <NotificationProvider>
                <BrowserRouter>
                  <ServerUnavailableBanner />
                  <Routes>
                    {/* Public Shell */}
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/explore" element={<CoursesPage />} />
                      <Route path="/marketplace" element={<SkillExchangePage />} />
                      <Route path="/skill-exchange" element={<SkillExchangePage />} />
                      <Route path="/about" element={<LandingPage />} />

                      {/* Authenticated Protected Shell */}
                      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
                      <Route path="/dashboard" element={<ProtectedRoute><StudentDashboardPage /></ProtectedRoute>} />
                      <Route path="/dashboard/school" element={<ProtectedRoute><StudentDashboardPage track="school" /></ProtectedRoute>} />
                      <Route path="/dashboard/college" element={<ProtectedRoute><StudentDashboardPage track="college" /></ProtectedRoute>} />
                      <Route path="/dashboard/skills" element={<ProtectedRoute><StudentDashboardPage track="skills" /></ProtectedRoute>} />
                      <Route path="/dashboard/exam" element={<ProtectedRoute><StudentDashboardPage track="exam" /></ProtectedRoute>} />
                      <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
                      <Route path="/notes/:noteId" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
                      <Route path="/dashboard/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
                      <Route path="/my-subjects" element={<ProtectedRoute><MySubjectsPage /></ProtectedRoute>} />
                      <Route path="/subjects/:subjectId" element={<ProtectedRoute><SubjectDetailsPage /></ProtectedRoute>} />
                      <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
                      <Route path="/learning-path" element={<ProtectedRoute><LearningPathPage /></ProtectedRoute>} />
                      <Route path="/study-planner" element={<ProtectedRoute><StudyPlannerPage /></ProtectedRoute>} />
                      <Route path="/tasks" element={<ProtectedRoute><MyTasksPage /></ProtectedRoute>} />
                      <Route path="/my-tasks" element={<ProtectedRoute><MyTasksPage /></ProtectedRoute>} />
                      <Route path="/games" element={<ProtectedRoute><GameCenterPage /></ProtectedRoute>} />
                      <Route path="/game-center" element={<ProtectedRoute><GameCenterPage /></ProtectedRoute>} />
                      <Route path="/immersive-lab" element={<ProtectedRoute><ImmersiveLabPage /></ProtectedRoute>} />
                      <Route path="/labs" element={<ProtectedRoute><ImmersiveLabPage /></ProtectedRoute>} />
                      <Route path="/xr-studio" element={<ProtectedRoute><XRStudioPage /></ProtectedRoute>} />
                      <Route path="/ar-vr" element={<ProtectedRoute><XRStudioPage /></ProtectedRoute>} />
                      <Route path="/ar-vr-studio" element={<ProtectedRoute><XRStudioPage /></ProtectedRoute>} />
                      <Route path="/immersive-studio" element={<ProtectedRoute><XRStudioPage /></ProtectedRoute>} />
                      <Route path="/constellation" element={<ProtectedRoute><KnowledgeConstellationPage /></ProtectedRoute>} />
                      <Route path="/skill-dna" element={<ProtectedRoute><SkillDnaPage /></ProtectedRoute>} />
                      <Route path="/skill-marketplace" element={<ProtectedRoute><SkillExchangePage /></ProtectedRoute>} />
                      <Route path="/skill-exchange" element={<ProtectedRoute><SkillExchangePage /></ProtectedRoute>} />
                      <Route path="/messages" element={<ProtectedRoute><SkillExchangePage initialTab="messages" /></ProtectedRoute>} />
                      <Route path="/messages/:conversationId" element={<ProtectedRoute><SkillExchangePage initialTab="messages" /></ProtectedRoute>} />
                      <Route path="/exchanges/:exchangeId/chat" element={<ProtectedRoute><SkillExchangePage initialTab="messages" /></ProtectedRoute>} />
                      <Route path="/skill-swap-match" element={<ProtectedRoute><SkillSwapMatchPage /></ProtectedRoute>} />
                      <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
                      <Route path="/courses/:id" element={<ProtectedRoute><CourseDetailsPage /></ProtectedRoute>} />
                      <Route path="/courses/:id/lesson" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
                      <Route path="/analytics" element={<ProtectedRoute><ProgressAnalyticsPage /></ProtectedRoute>} />
                      <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
                      <Route path="/community/:channelId" element={<ProtectedRoute><SkillExchangePage initialTab="messages" /></ProtectedRoute>} />
                      <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
                      <Route path="/challenges" element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                      <Route path="/parent-dashboard" element={<ProtectedRoute><ParentDashboardPage /></ProtectedRoute>} />
                      <Route path="/parent/dashboard" element={<ProtectedRoute><ParentDashboardPage /></ProtectedRoute>} />
                      <Route path="/parent/performance" element={<ProtectedRoute><ParentDashboardPage /></ProtectedRoute>} />
                      <Route path="/parent/settings" element={<ProtectedRoute><ParentDashboardPage /></ProtectedRoute>} />
                    </Route>

                    {/* Auth Shell */}
                    <Route element={<AuthLayout />}>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/parent-login" element={<ParentLoginPage />} />
                      <Route path="/parent-register" element={<ParentRegisterPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    {/* Catch-all redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </BrowserRouter>
              </NotificationProvider>
            </AIProvider>
          </LearningProvider>
        </LearnerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
