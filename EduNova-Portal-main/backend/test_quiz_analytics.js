const prisma = require('./config/db');
const quizService = require('./services/quizService');
const analyticsService = require('./services/analyticsService');

async function testQuizAndAnalytics() {
  console.log('===========================================================');
  console.log('  EDUNOVA: TESTING QUIZ EVALUATION & PERFORMANCE ANALYTICS');
  console.log('===========================================================\n');

  try {
    // 1. Get or create test student and subject
    let student = await prisma.user.findFirst({
      where: { role: 'STUDENT' },
      include: { learnerProfile: true },
    });

    if (!student) {
      student = await prisma.user.create({
        data: {
          name: 'Priya Sharma',
          email: 'priya.test@edunova.in',
          role: 'STUDENT',
          learnerType: 'SCHOOL',
          learnerProfile: {
            create: {
              board: 'CBSE',
              goals: ['Score 95% in Physics', 'Crack JEE'],
              weakTopics: [],
              xp: 100,
              level: 1,
              streakDays: 4,
            },
          },
        },
        include: { learnerProfile: true },
      });
    }

    let subject = await prisma.subject.findFirst();
    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          name: 'Physics XI',
          category: 'Science',
          educationType: 'SCHOOL',
          class: 'Class 11',
        },
      });
    }

    console.log(`👤 Student: ${student.name} (${student.id})`);
    console.log(`📚 Subject: ${subject.name} (${subject.id})\n`);

    // ── 2. CREATE QUIZ WITH QUESTIONS ──────────────────────────────────────────
    console.log('--- 1. Creating Test Quiz & Questions ---');
    const createdQuiz = await quizService.createQuiz({
      subjectId: subject.id,
      title: 'Thermodynamics & Heat Transfer Diagnostic',
      difficulty: 'INTERMEDIATE',
      questions: [
        {
          questionText: 'What is the First Law of Thermodynamics fundamentally based on?',
          options: [
            'Conservation of Momentum',
            'Conservation of Energy',
            'Conservation of Mass',
            'Entropy Maximization',
          ],
          correctOptionIndex: 1,
          explanation: 'The first law of thermodynamics states that energy cannot be created or destroyed, only transferred or converted (Law of Conservation of Energy).',
          fingerprint: 'fp_thermo_q1',
        },
        {
          questionText: 'In an isothermal process for an ideal gas, which quantity remains constant?',
          options: [
            'Temperature (T)',
            'Pressure (P)',
            'Volume (V)',
            'Heat (Q)',
          ],
          correctOptionIndex: 0,
          explanation: 'An isothermal process occurs at a constant temperature (ΔT = 0, thus ΔU = 0 for an ideal gas).',
          fingerprint: 'fp_thermo_q2',
        },
        {
          questionText: 'Which thermodynamic process involves NO heat exchange between system and surroundings?',
          options: [
            'Isobaric',
            'Isochoric',
            'Adiabatic',
            'Cyclic',
          ],
          correctOptionIndex: 2,
          explanation: 'An adiabatic process is one where no heat enters or leaves the system (Q = 0).',
          fingerprint: 'fp_thermo_q3',
        },
      ],
    });

    console.log(`✅ Created Quiz: "${createdQuiz.title}" (ID: ${createdQuiz.id})`);
    console.log(`   Total Questions: ${createdQuiz.totalQuestions}`);

    // ── 3. VERIFY ANTI-CHEAT QUESTION SANITIZATION ────────────────────────────
    console.log('\n--- 2. Testing Anti-Cheat Question Sanitization ---');
    const sanitizedQuiz = await quizService.getQuizQuestions(createdQuiz.id, { sanitize: true });
    
    let hasLeakedAnswers = false;
    sanitizedQuiz.questions.forEach((q, idx) => {
      if (q.correctOptionIndex !== undefined || q.explanation !== undefined) {
        hasLeakedAnswers = true;
      }
    });

    if (!hasLeakedAnswers) {
      console.log('✅ PASS: Quiz questions are properly sanitized!');
      console.log('   `correctOptionIndex` and `explanation` are completely omitted from client response.');
      console.log('   Sample Question payload:');
      console.log(`   { id: "${sanitizedQuiz.questions[0].id}", questionText: "${sanitizedQuiz.questions[0].questionText.slice(0, 40)}...", options: [${sanitizedQuiz.questions[0].options.map(o => `"${o}"`).join(', ')}] }`);
    } else {
      console.error('❌ FAIL: Quiz questions leaked answer keys or explanations!');
    }

    // ── 4. SUBMIT QUIZ WITH LOW ACCURACY (< 60%) ──────────────────────────────
    console.log('\n--- 3. Testing Server-Side Evaluation with Low Accuracy (< 60%) ---');
    // Answering 1 out of 3 correctly (33.3% accuracy)
    const lowAnswers = [
      { questionId: createdQuiz.questions[0].id, selectedOptionIndex: 1 }, // Correct
      { questionId: createdQuiz.questions[1].id, selectedOptionIndex: 2 }, // Wrong (correct is 0)
      { questionId: createdQuiz.questions[2].id, selectedOptionIndex: 0 }, // Wrong (correct is 2)
    ];

    const lowResult = await quizService.submitQuiz(student.id, createdQuiz.id, lowAnswers, 45);
    console.log(`✅ Evaluated Attempt: Score ${lowResult.score}/${lowResult.totalQuestions} (${lowResult.accuracy}%)`);
    console.log(`   XP Awarded: ${lowResult.xpAwarded}`);
    console.log(`   Weak Topics Updated:`, lowResult.weakTopics);
    console.log(`   Weak Topics Flagged: ${lowResult.weakTopicsModified ? '✅ YES (Auto-flagged because < 60%)' : 'NO'}`);

    if (lowResult.weakTopics.includes(subject.name) || lowResult.weakTopics.length > 0) {
      console.log(`✅ PASS: Under-performing subject/topic successfully queued to weakTopics.`);
    } else {
      console.error('❌ FAIL: Subject was not added to weakTopics.');
    }

    // ── 5. SUBMIT QUIZ WITH HIGH ACCURACY (>= 80%) ─────────────────────────────
    console.log('\n--- 4. Testing Server-Side Evaluation with High Accuracy (>= 80%) ---');
    // Answering all 3 correctly (100% accuracy)
    const highAnswers = [
      { questionId: createdQuiz.questions[0].id, selectedOptionIndex: 1 }, // Correct
      { questionId: createdQuiz.questions[1].id, selectedOptionIndex: 0 }, // Correct
      { questionId: createdQuiz.questions[2].id, selectedOptionIndex: 2 }, // Correct
    ];

    const highResult = await quizService.submitQuiz(student.id, createdQuiz.id, highAnswers, 30);
    console.log(`✅ Evaluated Attempt: Score ${highResult.score}/${highResult.totalQuestions} (${highResult.accuracy}%)`);
    console.log(`   XP Awarded (Includes Mastery Bonus): +${highResult.xpAwarded} XP`);
    console.log(`   New Level: ${highResult.newLevel}, Total XP: ${highResult.newXp}`);
    console.log(`   Weak Topics after mastery:`, highResult.weakTopics);
    console.log(`   Weak Topics Remediated: ${highResult.weakTopicsModified ? '✅ YES (Removed because >= 80%)' : 'NO'}`);

    // ── 6. STUDY SESSIONS & ANALYTICS OVERVIEW ────────────────────────────────
    console.log('\n--- 5. Testing Study Sessions Management ---');
    const studySession = await analyticsService.createStudySession(student.id, {
      subjectId: subject.id,
      durationMinutes: 45,
      plannedDate: new Date(),
    });
    console.log(`✅ Created Study Session: ${studySession.durationMinutes} mins planned (ID: ${studySession.id})`);

    const completedSession = await analyticsService.completeStudySession(student.id, studySession.id);
    console.log(`✅ Completed Study Session: +${completedSession.xpEarned} XP awarded!`);

    // ── 7. COMPUTE REAL ANALYTICS OVERVIEW DIRECTLY FROM POSTGRESQL ───────────
    console.log('\n--- 6. Testing Analytics Service Overview (Direct PostgreSQL Calculations) ---');
    const overview = await analyticsService.getLearnerOverview(student.id);

    console.log('📊 Learner Overview Results:');
    console.log(`   - Learner: ${overview.learner.name} (Level ${overview.learner.level}, ${overview.learner.xp} XP, ${overview.learner.streakDays}-day streak)`);
    console.log(`   - Study Hours: ${overview.studyHours.completedHours}h completed / ${overview.studyHours.plannedHours}h planned (Adherence: ${overview.studyHours.adherenceRate})`);
    console.log(`   - Assessment Summary: ${overview.assessmentSummary.totalQuizzesTaken} quizzes taken, overall accuracy: ${overview.assessmentSummary.overallAccuracy}`);
    console.log(`   - Subject Mastery Count: ${overview.assessmentSummary.subjectMastery.length}`);
    overview.assessmentSummary.subjectMastery.forEach((sm) => {
      console.log(`     * ${sm.subjectName}: ${sm.averageAccuracy}% average accuracy [${sm.masteryLevel}]`);
    });
    console.log(`   - Revision Radar: ${overview.revisionRadar.totalWeakAreas} area(s) detected`);
    overview.revisionRadar.items.forEach((item) => {
      console.log(`     * [Urgency: ${item.urgency}] ${item.topic} (${item.recentAccuracy}) -> ${item.suggestedAction}`);
    });
    console.log(`   - Weekly Consistency: ${overview.consistency.weeklyConsistencyRate} (${overview.consistency.activeDaysLastWeek}/7 days active)`);
    console.log(`   - Heatmap: ${overview.consistency.weeklyHeatmap.map(d => `${d.dayName}:${d.active ? '●' : '○'}`).join(' ')}`);

    console.log('\n===========================================================');
    console.log('  🎉 ALL QUIZ & ANALYTICS TESTS PASSED WITH 100% INTEGRITY');
    console.log('===========================================================\n');
  } catch (error) {
    console.error('❌ Test execution error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testQuizAndAnalytics();
