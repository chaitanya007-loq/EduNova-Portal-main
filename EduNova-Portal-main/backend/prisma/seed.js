const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 3,
  parallelism: 1,
};

async function main() {
  console.log('🌱 Seeding EduNova database...\n');

  // ── 1. Admin User ───────────────────────────────────────────────────────
  const adminPassword = await argon2.hash('admin123', ARGON2_OPTIONS);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edunova.in' },
    update: {},
    create: {
      name: 'EduNova Admin',
      email: 'admin@edunova.in',
      passwordHash: adminPassword,
      role: 'ADMIN',
      learnerType: 'SCHOOL',
    },
  });
  console.log(`✅ Admin: ${admin.name} (${admin.email})`);

  // ── 2. Instructor User ─────────────────────────────────────────────────
  const instructorPassword = await argon2.hash('instructor123', ARGON2_OPTIONS);
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@edunova.in' },
    update: {},
    create: {
      name: 'Dr. Priya Sharma',
      email: 'instructor@edunova.in',
      passwordHash: instructorPassword,
      role: 'INSTRUCTOR',
      learnerType: 'COLLEGE',
    },
  });
  console.log(`✅ Instructor: ${instructor.name} (${instructor.email})`);

  // ── 3. Student User ────────────────────────────────────────────────────
  const studentPassword = await argon2.hash('student123', ARGON2_OPTIONS);
  const student = await prisma.user.upsert({
    where: { email: 'student@edunova.in' },
    update: {},
    create: {
      name: 'Arjun Patel',
      email: 'student@edunova.in',
      passwordHash: studentPassword,
      role: 'STUDENT',
      learnerType: 'SCHOOL',
      studentUsername: 'arjun_patel',
      learnerProfile: {
        create: {
          board: 'CBSE',
          goals: ['JEE', 'Board Exams'],
          weakTopics: ['Organic Chemistry', 'Integration'],
          xp: 1250,
          level: 5,
          streakDays: 12,
        },
      },
    },
  });
  console.log(`✅ Student: ${student.name} (${student.email})`);

  // ── 4. Parent User ─────────────────────────────────────────────────────
  const parentPassword = await argon2.hash('parent123', ARGON2_OPTIONS);
  const parent = await prisma.user.upsert({
    where: { email: 'parent@edunova.in' },
    update: {},
    create: {
      name: 'Meera Patel',
      email: 'parent@edunova.in',
      passwordHash: parentPassword,
      role: 'PARENT',
      learnerType: 'SCHOOL',
      studentUsername: 'arjun_patel', // linked to student
    },
  });
  console.log(`✅ Parent: ${parent.name} (${parent.email})`);

  // ── 5. Subjects ─────────────────────────────────────────────────────────
  const physics = await prisma.subject.create({
    data: {
      name: 'Physics',
      category: 'Science',
      educationType: 'SCHOOL',
      class: '12',
      board: 'CBSE',
      createdById: admin.id,
      topics: {
        create: [
          { title: 'Electrostatics', order: 1 },
          { title: 'Current Electricity', order: 2 },
          { title: 'Magnetic Effects of Current', order: 3 },
          { title: 'Electromagnetic Induction', order: 4 },
          { title: 'Optics', order: 5 },
          { title: 'Modern Physics', order: 6 },
        ],
      },
    },
  });
  console.log(`✅ Subject: ${physics.name} (${6} topics)`);

  const maths = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      category: 'Science',
      educationType: 'SCHOOL',
      class: '12',
      board: 'CBSE',
      createdById: admin.id,
      topics: {
        create: [
          { title: 'Relations and Functions', order: 1 },
          { title: 'Algebra', order: 2 },
          { title: 'Calculus', order: 3 },
          { title: 'Vectors and 3D Geometry', order: 4 },
          { title: 'Linear Programming', order: 5 },
          { title: 'Probability', order: 6 },
        ],
      },
    },
  });
  console.log(`✅ Subject: ${maths.name} (${6} topics)`);

  const chemistry = await prisma.subject.create({
    data: {
      name: 'Chemistry',
      category: 'Science',
      educationType: 'SCHOOL',
      class: '12',
      board: 'CBSE',
      createdById: admin.id,
      topics: {
        create: [
          { title: 'Solid State', order: 1 },
          { title: 'Solutions', order: 2 },
          { title: 'Electrochemistry', order: 3 },
          { title: 'Chemical Kinetics', order: 4 },
          { title: 'Organic Chemistry', order: 5 },
          { title: 'Polymers', order: 6 },
        ],
      },
    },
  });
  console.log(`✅ Subject: ${chemistry.name} (${6} topics)`);

  // ── 6. Student Subject Progress ─────────────────────────────────────────
  await prisma.studentSubjectProgress.createMany({
    data: [
      { userId: student.id, subjectId: physics.id, progress: 65.0, targetScore: 90, syllabusCoverage: 58.0 },
      { userId: student.id, subjectId: maths.id, progress: 72.0, targetScore: 95, syllabusCoverage: 64.0 },
      { userId: student.id, subjectId: chemistry.id, progress: 48.0, targetScore: 85, syllabusCoverage: 40.0 },
    ],
  });
  console.log(`✅ Student subject progress: 3 records`);

  // ── 7. Course with Modules ──────────────────────────────────────────────
  const course = await prisma.course.create({
    data: {
      title: 'Complete Physics for JEE Mains',
      description: 'Master physics concepts with solved problems, practice tests, and video lectures.',
      category: 'JEE Preparation',
      instructorId: instructor.id,
      difficulty: 'INTERMEDIATE',
      rating: 4.7,
      totalRatings: 234,
      isPublished: true,
      modules: {
        create: [
          { title: 'Mechanics Fundamentals', duration: 120, order: 1 },
          { title: 'Thermodynamics Deep Dive', duration: 90, order: 2 },
          { title: 'Electromagnetism Mastery', duration: 150, order: 3 },
          { title: 'Optics & Wave Theory', duration: 100, order: 4 },
          { title: 'Modern Physics & Nuclear', duration: 80, order: 5 },
        ],
      },
    },
    include: { modules: true },
  });
  console.log(`✅ Course: ${course.title} (${course.modules.length} modules)`);

  // ── 8. User Course Enrollment ───────────────────────────────────────────
  await prisma.userCourseProgress.create({
    data: {
      userId: student.id,
      courseId: course.id,
      completedModuleIds: [course.modules[0].id],
      progress: 20.0,
    },
  });
  console.log(`✅ Enrolled ${student.name} in "${course.title}"`);

  // ── 9. Missions ─────────────────────────────────────────────────────────
  const missions = await prisma.mission.createMany({
    data: [
      { title: 'Complete 3 Lessons', description: 'Finish any 3 lessons today', rewardXp: 50, category: 'learning', period: 'DAILY' },
      { title: 'Score 80%+ on a Quiz', description: 'Ace a quiz with 80% or higher', rewardXp: 75, category: 'learning', period: 'DAILY' },
      { title: '30-Minute Study Session', description: 'Study for at least 30 minutes', rewardXp: 30, category: 'streak', period: 'DAILY' },
      { title: 'Help a Peer', description: 'Answer a question in the community', rewardXp: 40, category: 'social', period: 'DAILY' },
      { title: 'Complete a Full Chapter', description: 'Finish all topics in a chapter', rewardXp: 200, category: 'learning', period: 'WEEKLY' },
      { title: '7-Day Streak', description: 'Maintain a 7-day login streak', rewardXp: 300, category: 'streak', period: 'WEEKLY' },
    ],
  });
  console.log(`✅ Missions: ${missions.count} created`);

  // ── 10. XP Transactions ─────────────────────────────────────────────────
  await prisma.xpTransaction.createMany({
    data: [
      { userId: student.id, amount: 50, sourceTitle: 'Completed Electrostatics Lesson' },
      { userId: student.id, amount: 75, sourceTitle: 'Scored 92% on Physics Quiz' },
      { userId: student.id, amount: 100, sourceTitle: 'Finished Mechanics Module' },
      { userId: student.id, amount: 30, sourceTitle: 'Daily Login Streak (Day 12)' },
      { userId: student.id, amount: 200, sourceTitle: 'Weekly Mission: Full Chapter Completed' },
    ],
  });
  console.log(`✅ XP Transactions: 5 records for ${student.name}`);

  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
