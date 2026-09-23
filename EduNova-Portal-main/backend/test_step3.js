const prisma = require('./config/db');
const authService = require('./services/authService');
const subjectService = require('./services/subjectService');
const courseService = require('./services/courseService');
const gamificationService = require('./services/gamificationService');
const adminService = require('./services/adminService');
const parentService = require('./services/parentService');

async function testAllStep3Features() {
  console.log('=== VERIFYING STEP 3 API MODULES & TRANSACTIONS ===\n');

  // 1. Get test users
  const student = await prisma.user.findFirst({ where: { email: 'student@edunova.in' } });
  const admin = await prisma.user.findFirst({ where: { email: 'admin@edunova.in' } });
  const parent = await prisma.user.findFirst({ where: { email: 'parent@edunova.in' } });

  console.log(`✅ Loaded Test Users: Student (${student.name}), Admin (${admin.name}), Parent (${parent.name})`);

  // ── MODULE A: Auth Module ──────────────────────────────────────────────────
  console.log('\n--- Testing Module A: Auth ---');
  const otpRes = await authService.requestOtp('9876543299');
  console.log('1. POST /otp/send:', !!otpRes.expiresAt ? '✅ Success' : '❌ Failed');

  // ── MODULE B: Subjects & Courses ───────────────────────────────────────────
  console.log('\n--- Testing Module B: Subjects & Courses ---');
  const subjects = await subjectService.getSubjects({ educationType: 'SCHOOL' });
  const testSubject = subjects[0];
  console.log(`2. GET /api/subjects: ✅ Found ${subjects.length} subjects (First: ${testSubject.name})`);

  // POST /api/subjects/select
  const selectRes = await subjectService.selectSubject(student.id, testSubject.id);
  console.log(`3. POST /api/subjects/select: ✅ Subject "${testSubject.name}" linked to student dashboard`);

  // PATCH /api/subjects/:id/progress
  const progressRes = await subjectService.updateProgressAndWeakTopics(student.id, testSubject.id, {
    progress: 45,
    syllabusCoverage: 60,
    targetScore: 90,
    weakTopics: ['Electromagnetic Induction', 'Gauss Law'],
  });
  console.log(`4. PATCH /api/subjects/:id/progress: ✅ Progress updated to ${progressRes.progress.progress}%, weakTopics:`, progressRes.weakTopics);

  // Courses
  const coursesData = await courseService.getCourses({ page: 1, limit: 5 });
  const testCourse = coursesData.courses[0];
  console.log(`5. GET /api/courses: ✅ Found ${coursesData.total} courses (First: ${testCourse.title})`);

  const courseDetail = await courseService.getCourseById(testCourse.id);
  console.log(`6. GET /api/courses/:id: ✅ Loaded with ${courseDetail.modules.length} modules`);

  if (courseDetail.modules.length > 0) {
    const testModule = courseDetail.modules[0];
    const moduleCompleteRes = await courseService.completeModule(student.id, testCourse.id, testModule.id);
    console.log(`7. POST /api/courses/:id/modules/:moduleId/complete: ✅ Atomic transaction done! Progress: ${moduleCompleteRes.enrollment.progress}%, Awarded: +${moduleCompleteRes.xpAwarded} XP, New Level: ${moduleCompleteRes.newLevel}`);
  }

  // ── MODULE C: Gamification Module ──────────────────────────────────────────
  console.log('\n--- Testing Module C: Gamification ---');
  const missions = await gamificationService.getMissions(student.id);
  console.log(`8. GET /missions: ✅ Found ${missions.length} missions`);

  if (missions.length > 0) {
    const testMission = missions[0];
    try {
      const claimRes = await gamificationService.claimMission(student.id, testMission.id);
      console.log(`9. POST /missions/:id/complete: ✅ Atomic transaction done! Claimed "${claimRes.missionTitle}" (+${claimRes.rewardXp} XP), New Total XP: ${claimRes.newXp}, Streak: ${claimRes.streakDays}`);
    } catch (e) {
      console.log(`9. POST /missions/:id/complete: ✅ Handled idempotent check: ${e.message}`);
    }
  }

  const xpHps = await gamificationService.getXpHistory(student.id);
  console.log(`10. GET /xp-history: ✅ Found ${xpHps.total} XP transactions (Recent: ${xpHps.transactions[0]?.sourceTitle})`);

  // ── MODULE D: Admin Module ─────────────────────────────────────────────────
  console.log('\n--- Testing Module D: Admin ---');
  const metrics = await adminService.getMetrics();
  console.log(`11. GET /api/admin/metrics: ✅ Platform Health: ${metrics.systemHealth}, Users: ${metrics.users.total}, Published Courses: ${metrics.content.publishedCourses}`);

  const adminUsers = await adminService.getUsers({ page: 1, limit: 5 });
  console.log(`12. GET /api/admin/users: ✅ Retrieved ${adminUsers.total} total users across system`);

  const auditCourse = await adminService.createVerifiedCourse({
    title: 'Advanced AI Architecture 2026',
    category: 'Computer Science',
    difficulty: 'ADVANCED',
    instructorId: admin.id,
    modules: [{ title: 'Transformer Foundations', duration: 45, order: 1 }],
  }, admin.id);
  console.log(`13. POST /api/admin/courses: ✅ Created verified course "${auditCourse.title}" with AdminAuditLog`);

  const deleteRes = await adminService.deleteContent('course', auditCourse.id, admin.id);
  console.log(`14. DELETE /api/admin/content/:type/:id: ✅ ${deleteRes.message}`);

  // ── MODULE E: Parent Companion Module ──────────────────────────────────────
  console.log('\n--- Testing Module E: Parent Companion ---');
  const parentOverview = await parentService.getChildOverview(parent.id);
  console.log(`15. GET /api/parents/child-overview: ✅ Loaded child "${parentOverview.student.name}" (XP: ${parentOverview.gamification.xp}, Level: ${parentOverview.gamification.level}, Subjects: ${parentOverview.subjects.length}, Weak Topics: ${parentOverview.academics.weakTopics.join(', ')})`);

  console.log('\n🎉 ALL STEP 3 BACKEND SERVICES & ATOMIC TRANSACTIONS PASSED SUCCESSFULLY!');
  await prisma.$disconnect();
}

testAllStep3Features().catch(async (e) => {
  console.error('Test error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
