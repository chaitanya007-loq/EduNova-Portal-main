/**
 * Automated Verification Script for EduNova Full-Stack Refactor
 * 
 * Verifies live PostgreSQL database operations via Express API:
 * 1. Authentication & Session Hydration
 * 2. Learner Profile & Dynamic Goals CRUD (/api/learners)
 * 3. Subject Enrollment & Progress Tracking (/api/subjects)
 * 4. Authoritative Gamification & Level Calculations (/api/gamification)
 */

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting EduNova Full-Stack Refactor Test Suite...\n');
  let authToken = null;
  let testUser = null;
  let createdGoalId = null;
  let testSubjectId = null;

  const request = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    };
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, data };
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 1. AUTHENTICATION & SESSION HYDRATION
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- 1. Testing Authentication & Me Session ---');
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'chaitanyasanchaniya7@gmail.com',
      password: 'Password@123',
    }),
  });

  if (!loginRes.ok || !loginRes.data.success) {
    console.error('❌ Login failed:', loginRes.data);
    process.exit(1);
  }

  authToken = loginRes.data.data.token;
  testUser = loginRes.data.data.user;
  console.log(`✅ Logged in as ${testUser.name} (${testUser.role})`);
  console.log(`   Token received: ${authToken.slice(0, 20)}...`);

  const meRes = await request('/auth/me');
  if (!meRes.ok || !meRes.data.success) {
    console.error('❌ Session hydration (/auth/me) failed:', meRes.data);
    process.exit(1);
  }
  console.log(`✅ /api/auth/me session hydrated successfully. LearnerType: ${meRes.data.data.learnerType}`);

  // ──────────────────────────────────────────────────────────────────────────
  // 2. LEARNER PROFILE & DYNAMIC GOALS CRUD (/api/learners)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 2. Testing Learner Profile & Goals CRUD ---');

  const profileRes = await request('/learners/profile');
  if (!profileRes.ok || !profileRes.data.success) {
    console.error('❌ GET /api/learners/profile failed:', profileRes.data);
    process.exit(1);
  }
  console.log(`✅ GET /api/learners/profile returned profile for user ${profileRes.data.data.userId}`);
  console.log(`   Initial parsed goals count: ${profileRes.data.data.parsedGoals?.length || 0}`);

  // Add Goal
  const addGoalRes = await request('/learners/goals', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Master Quantum Algorithms 2026',
      targetDate: '2026-11-30',
      progress: 15,
    }),
  });

  if (!addGoalRes.ok || !addGoalRes.data.success) {
    console.error('❌ POST /api/learners/goals failed:', addGoalRes.data);
    process.exit(1);
  }
  createdGoalId = addGoalRes.data.newGoal?.id;
  console.log(`✅ POST /api/learners/goals created goal: "${addGoalRes.data.newGoal?.title}" (ID: ${createdGoalId})`);

  // Update Goal
  const updateGoalRes = await request(`/learners/goals/${encodeURIComponent(createdGoalId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      progress: 60,
      targetDate: '2026-12-15',
    }),
  });

  if (!updateGoalRes.ok || !updateGoalRes.data.success) {
    console.error('❌ PATCH /api/learners/goals/:id failed:', updateGoalRes.data);
    process.exit(1);
  }
  console.log(`✅ PATCH /api/learners/goals/:id updated goal progress to ${updateGoalRes.data.updatedGoal?.progress}%`);

  // Delete Goal
  const deleteGoalRes = await request(`/learners/goals/${encodeURIComponent(createdGoalId)}`, {
    method: 'DELETE',
  });

  if (!deleteGoalRes.ok || !deleteGoalRes.data.success) {
    console.error('❌ DELETE /api/learners/goals/:id failed:', deleteGoalRes.data);
    process.exit(1);
  }
  console.log('✅ DELETE /api/learners/goals/:id successfully removed test goal');

  // Update Learner Type
  const updateTypeRes = await request('/learners/type', {
    method: 'PATCH',
    body: JSON.stringify({
      learnerType: 'COLLEGE',
      board: 'Autonomous University',
      degree: 'B.Tech AI & Data Science',
    }),
  });

  if (!updateTypeRes.ok || !updateTypeRes.data.success) {
    console.error('❌ PATCH /api/learners/type failed:', updateTypeRes.data);
    process.exit(1);
  }
  console.log(`✅ PATCH /api/learners/type updated user to ${updateTypeRes.data.data.user.learnerType}`);

  // Revert back to SCHOOL for consistency
  await request('/learners/type', {
    method: 'PATCH',
    body: JSON.stringify({
      learnerType: 'SCHOOL',
      board: 'CBSE - Class 12',
      degree: 'JEE Advanced Aspirant',
    }),
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3. SUBJECT ENROLLMENT & PROGRESS (/api/subjects)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 3. Testing Subject Enrollment & Management ---');

  const subjectsRes = await request('/subjects?limit=5');
  if (!subjectsRes.ok || !subjectsRes.data.success || !subjectsRes.data.data.length) {
    console.error('❌ GET /api/subjects failed:', subjectsRes.data);
    process.exit(1);
  }
  testSubjectId = subjectsRes.data.data[0].id;
  const testSubjectName = subjectsRes.data.data[0].name;
  console.log(`✅ Found available subject: "${testSubjectName}" (${testSubjectId})`);

  // Enroll / Select Subject
  const selectRes = await request('/subjects/select', {
    method: 'POST',
    body: JSON.stringify({ subjectId: testSubjectId }),
  });
  if (!selectRes.ok || !selectRes.data.success) {
    console.error('❌ POST /api/subjects/select failed:', selectRes.data);
    process.exit(1);
  }
  console.log(`✅ POST /api/subjects/select enrolled student in subject "${testSubjectName}"`);

  // Get Enrolled Subjects
  const enrolledRes = await request('/subjects/enrolled');
  if (!enrolledRes.ok || !enrolledRes.data.success) {
    console.error('❌ GET /api/subjects/enrolled failed:', enrolledRes.data);
    process.exit(1);
  }
  const isEnrolled = enrolledRes.data.data.some((e) => e.subjectId === testSubjectId);
  console.log(`✅ GET /api/subjects/enrolled returned ${enrolledRes.data.count} enrolled subjects (Verified: ${isEnrolled})`);

  // Update Progress & Weak Topics
  const progressRes = await request(`/subjects/${testSubjectId}/progress`, {
    method: 'PATCH',
    body: JSON.stringify({
      progress: 75,
      syllabusCoverage: 80,
      targetScore: 90,
      weakTopics: ['Rotational Dynamics', 'Kinematics'],
    }),
  });
  if (!progressRes.ok || !progressRes.data.success) {
    console.error('❌ PATCH /api/subjects/:id/progress failed:', progressRes.data);
    process.exit(1);
  }
  console.log(`✅ PATCH /api/subjects/:id/progress updated progress to ${progressRes.data.data.progress?.progress}%`);

  // ──────────────────────────────────────────────────────────────────────────
  // 4. GAMIFICATION & LEVEL CALCULATIONS (/api/gamification)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 4. Testing Gamification & Progression ---');

  // Summary
  const summaryRes = await request('/gamification/summary');
  if (!summaryRes.ok || !summaryRes.data.success) {
    console.error('❌ GET /api/gamification/summary failed:', summaryRes.data);
    process.exit(1);
  }
  const summary = summaryRes.data.data;
  console.log(`✅ GET /api/gamification/summary: Level ${summary.level}, XP: ${summary.xp}, Streak: ${summary.streakDays}d, Progress: ${summary.progressPercent}%`);

  // Award XP
  const xpRes = await request('/gamification/xp', {
    method: 'POST',
    body: JSON.stringify({
      amount: 50,
      sourceTitle: 'Full-Stack Refactor Verification Quiz',
    }),
  });
  if (!xpRes.ok || !xpRes.data.success) {
    console.error('❌ POST /api/gamification/xp failed:', xpRes.data);
    process.exit(1);
  }
  console.log(`✅ POST /api/gamification/xp awarded 50 XP. New total: ${xpRes.data.data.newXp} XP (Leveled up: ${xpRes.data.data.leveledUp})`);

  // XP History
  const historyRes = await request('/gamification/xp?limit=5');
  if (!historyRes.ok || !historyRes.data.success) {
    console.error('❌ GET /api/gamification/xp failed:', historyRes.data);
    process.exit(1);
  }
  console.log(`✅ GET /api/gamification/xp returned ${historyRes.data.data.transactions?.length} recent transactions`);

  // Missions
  const missionsRes = await request('/gamification/missions');
  if (!missionsRes.ok || !missionsRes.data.success) {
    console.error('❌ GET /api/gamification/missions failed:', missionsRes.data);
    process.exit(1);
  }
  console.log(`✅ GET /api/gamification/missions returned ${missionsRes.data.data.length} live missions`);

  console.log('\n======================================================');
  console.log('🎉 ALL FULL-STACK REFACTOR VERIFICATION TESTS PASSED!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
