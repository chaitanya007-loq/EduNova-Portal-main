/**
 * Comprehensive API Health & Functionality Verification Suite
 * Tests every mounted route module in EduNova across roles.
 */

const BASE_URL = 'http://localhost:5000/api';

const results = [];

function recordResult(module, endpoint, status, passed, details = '') {
  results.push({ module, endpoint, status, passed, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${module}] ${endpoint} -> ${status} ${details ? `(${details})` : ''}`);
}

async function request(endpoint, token = null, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, data };
  } catch (err) {
    return { status: 0, ok: false, data: null, error: err.message };
  }
}

async function runComprehensiveCheck() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔍 EDUNOVA COMPREHENSIVE API VERIFICATION SUITE');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Health
  const health = await request('/health');
  recordResult('Health', 'GET /api/health', health.status, health.ok && health.data?.status === 'ok', health.data?.database);

  // 2. Auth - Student Login
  const studentLogin = await request('/auth/login', null, {
    method: 'POST',
    body: JSON.stringify({ email: 'student@edunova.in', password: 'student123' }),
  });
  const studentToken = studentLogin.data?.data?.token;
  recordResult('Auth', 'POST /api/auth/login (Student)', studentLogin.status, studentLogin.ok && !!studentToken, studentLogin.data?.data?.user?.name);

  // Student Session
  const studentMe = await request('/auth/me', studentToken);
  recordResult('Auth', 'GET /api/auth/me', studentMe.status, studentMe.ok && studentMe.data?.data?.email === 'student@edunova.in');

  // 3. Auth - Admin Login
  const adminLogin = await request('/auth/login', null, {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@edunova.in', password: 'admin123' }),
  });
  const adminToken = adminLogin.data?.data?.token;
  recordResult('Auth', 'POST /api/auth/login (Admin)', adminLogin.status, adminLogin.ok && !!adminToken);

  // 4. Auth - Parent Login
  const parentLogin = await request('/auth/login', null, {
    method: 'POST',
    body: JSON.stringify({ email: 'parent@edunova.in', password: 'parent123' }),
  });
  const parentToken = parentLogin.data?.data?.token;
  recordResult('Auth', 'POST /api/auth/login (Parent)', parentLogin.status, parentLogin.ok && !!parentToken);

  // 5. Users Module
  const userProfile = await request('/users/profile', studentToken);
  recordResult('Users', 'GET /api/users/profile', userProfile.status, userProfile.ok && !!(userProfile.data?.data?.id || userProfile.data?.data?.user), userProfile.data?.data?.name);

  // 6. Learners Module
  const learnerProfile = await request('/learners/profile', studentToken);
  recordResult('Learners', 'GET /api/learners/profile', learnerProfile.status, learnerProfile.ok && !!learnerProfile.data?.data?.id);

  const learnerGoals = await request('/learners/goals', studentToken);
  recordResult('Learners', 'GET /api/learners/goals', learnerGoals.status, learnerGoals.ok && Array.isArray(learnerGoals.data?.data));

  const addGoal = await request('/learners/goals', studentToken, {
    method: 'POST',
    body: JSON.stringify({ title: 'Full API Verification Goal', targetDate: '2026-12-31', progress: 20 }),
  });
  const tempGoalId = addGoal.data?.newGoal?.id;
  recordResult('Learners', 'POST /api/learners/goals', addGoal.status, addGoal.ok && !!tempGoalId, `ID: ${tempGoalId}`);

  if (tempGoalId) {
    const updateGoal = await request(`/learners/goals/${tempGoalId}`, studentToken, {
      method: 'PATCH',
      body: JSON.stringify({ progress: 80 }),
    });
    recordResult('Learners', 'PATCH /api/learners/goals/:id', updateGoal.status, updateGoal.ok);

    const deleteGoal = await request(`/learners/goals/${tempGoalId}`, studentToken, {
      method: 'DELETE',
    });
    recordResult('Learners', 'DELETE /api/learners/goals/:id', deleteGoal.status, deleteGoal.ok);
  }

  // 7. Subjects Module
  const subjects = await request('/subjects', studentToken);
  recordResult('Subjects', 'GET /api/subjects', subjects.status, subjects.ok && subjects.data?.data?.length > 0, `Count: ${subjects.data?.data?.length}`);

  const testSubject = subjects.data?.data?.[0];
  if (testSubject) {
    const singleSubject = await request(`/subjects/${testSubject.id}`, studentToken);
    recordResult('Subjects', 'GET /api/subjects/:id', singleSubject.status, singleSubject.ok && !!singleSubject.data?.data?.name, testSubject.name);

    const selectSub = await request('/subjects/select', studentToken, {
      method: 'POST',
      body: JSON.stringify({ subjectId: testSubject.id }),
    });
    recordResult('Subjects', 'POST /api/subjects/select', selectSub.status, selectSub.ok);

    const enrolled = await request('/subjects/enrolled', studentToken);
    recordResult('Subjects', 'GET /api/subjects/enrolled', enrolled.status, enrolled.ok && Array.isArray(enrolled.data?.data), `Enrolled: ${enrolled.data?.count}`);

    const updateProg = await request(`/subjects/${testSubject.id}/progress`, studentToken, {
      method: 'PATCH',
      body: JSON.stringify({ progress: 65, syllabusCoverage: 70 }),
    });
    recordResult('Subjects', 'PATCH /api/subjects/:id/progress', updateProg.status, updateProg.ok);
  }

  // 8. Courses Module
  const courses = await request('/courses', studentToken);
  recordResult('Courses', 'GET /api/courses', courses.status, courses.ok && Array.isArray(courses.data?.data?.courses), `Total: ${courses.data?.data?.total}`);

  const enrolledCourses = await request('/courses/enrolled/me', studentToken);
  recordResult('Courses', 'GET /api/courses/enrolled/me', enrolledCourses.status, enrolledCourses.ok && Array.isArray(enrolledCourses.data?.data));

  // 9. Progress Module
  const dashProgress = await request('/progress/dashboard', studentToken);
  recordResult('Progress', 'GET /api/progress/dashboard', dashProgress.status, dashProgress.ok && !!dashProgress.data?.data);

  const subProgress = await request('/progress/subjects', studentToken);
  recordResult('Progress', 'GET /api/progress/subjects', subProgress.status, subProgress.ok && Array.isArray(subProgress.data?.data));

  const crsProgress = await request('/progress/courses', studentToken);
  recordResult('Progress', 'GET /api/progress/courses', crsProgress.status, crsProgress.ok && Array.isArray(crsProgress.data?.data));

  // 10. Quizzes Module
  const quizList = await request('/quizzes', studentToken);
  recordResult('Quizzes', 'GET /api/quizzes', quizList.status, quizList.ok && Array.isArray(quizList.data?.data), `Count: ${quizList.data?.data?.length}`);

  const testQuiz = quizList.data?.data?.[0];
  if (testQuiz) {
    const singleQuiz = await request(`/quizzes/${testQuiz.id}`, studentToken);
    recordResult('Quizzes', 'GET /api/quizzes/:id', singleQuiz.status, singleQuiz.ok && !!singleQuiz.data?.data?.title, testQuiz.title);
  }

  // 11. Gamification Module
  const gamSummary = await request('/gamification/summary', studentToken);
  recordResult('Gamification', 'GET /api/gamification/summary', gamSummary.status, gamSummary.ok && typeof gamSummary.data?.data?.xp === 'number', `XP: ${gamSummary.data?.data?.xp}, Lvl: ${gamSummary.data?.data?.level}`);

  const missions = await request('/gamification/missions', studentToken);
  recordResult('Gamification', 'GET /api/gamification/missions', missions.status, missions.ok && Array.isArray(missions.data?.data), `Missions: ${missions.data?.data?.length}`);

  const leaderboard = await request('/gamification/leaderboard', studentToken);
  recordResult('Gamification', 'GET /api/gamification/leaderboard', leaderboard.status, leaderboard.ok && Array.isArray(leaderboard.data?.data), `Top count: ${leaderboard.data?.data?.length}`);

  const xpHistory = await request('/gamification/xp?limit=5', studentToken);
  recordResult('Gamification', 'GET /api/gamification/xp', xpHistory.status, xpHistory.ok && Array.isArray(xpHistory.data?.data?.transactions));

  const addXp = await request('/gamification/xp', studentToken, {
    method: 'POST',
    body: JSON.stringify({ amount: 10, sourceTitle: 'System API Verification' }),
  });
  recordResult('Gamification', 'POST /api/gamification/xp', addXp.status, addXp.ok && typeof addXp.data?.data?.newXp === 'number');

  // 12. Conversations & Realtime Chat
  const convos = await request('/conversations', studentToken);
  recordResult('Conversations', 'GET /api/conversations', convos.status, convos.ok && Array.isArray(convos.data?.data), `Threads: ${convos.data?.data?.length}`);

  // 13. Peer Exchanges
  const exchanges = await request('/exchanges', studentToken);
  recordResult('Exchanges', 'GET /api/exchanges', exchanges.status, exchanges.ok && Array.isArray(exchanges.data?.data), `Exchanges: ${exchanges.data?.data?.length}`);

  // 14. Analytics Module
  const analyticsOverview = await request('/analytics/overview', studentToken);
  recordResult('Analytics', 'GET /api/analytics/overview', analyticsOverview.status, analyticsOverview.ok && !!analyticsOverview.data?.data);

  const studentAnalytics = await request('/analytics/student', studentToken);
  recordResult('Analytics', 'GET /api/analytics/student', studentAnalytics.status, studentAnalytics.ok && !!studentAnalytics.data?.data);

  // 15. AI Module
  const aiHistory = await request('/ai/history?limit=5', studentToken);
  recordResult('AI (Sage)', 'GET /api/ai/history', aiHistory.status, aiHistory.ok && Array.isArray(aiHistory.data?.data?.history));

  // 16. Skills Module
  const skills = await request('/skills', studentToken);
  recordResult('Skills', 'GET /api/skills', skills.status, skills.ok);

  // 17. Admin Protected Module
  if (adminToken) {
    const adminMetrics = await request('/admin/metrics', adminToken);
    recordResult('Admin', 'GET /api/admin/metrics', adminMetrics.status, adminMetrics.ok && typeof adminMetrics.data?.data?.users?.total === 'number', `Users: ${adminMetrics.data?.data?.users?.total}`);

    const adminUsers = await request('/admin/users?limit=5', adminToken);
    recordResult('Admin', 'GET /api/admin/users', adminUsers.status, adminUsers.ok && Array.isArray(adminUsers.data?.data?.users));
  }

  // 18. Parent Module
  if (parentToken) {
    const parentOverview = await request('/parents/child-overview', parentToken);
    recordResult('Parents', 'GET /api/parents/child-overview', parentOverview.status, parentOverview.ok);
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`TOTAL ENDPOINTS TESTED: ${total}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    console.error('❌ Some endpoints failed verification!');
    process.exit(1);
  } else {
    console.log('🌟 100% OF APIS ARE OPERATIONAL AND RETURNING SUCCESS!');
    process.exit(0);
  }
}

runComprehensiveCheck().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
