/**
 * Sage AI Service Layer Test Suite
 */

const prisma = require('./config/db');
const contextBuilder = require('./ai/contextBuilder');
const { validateQuizResponse, validateWeakTopicPlanResponse } = require('./ai/responseValidator');
const geminiClient = require('./ai/geminiClient');

async function testSageAI() {
  console.log('🤖 ========================================================');
  console.log('🤖 Starting Sage AI Service Layer Test Suite');
  console.log('🤖 ========================================================\n');

  try {
    // 1. Setup / update student profile for AI context test
    console.log('🔍 [1/5] Testing Context Builder with PostgreSQL...');
    const user = await prisma.user.upsert({
      where: { email: 'student@edunova.in' },
      update: { learnerType: 'COLLEGE' },
      create: {
        email: 'student@edunova.in',
        name: 'Arjun Sharma',
        role: 'STUDENT',
        learnerType: 'COLLEGE',
      },
    });

    await prisma.learnerProfile.upsert({
      where: { userId: user.id },
      update: {
        degree: 'B.Tech Computer Science',
        goals: ['Full-Stack Architect', 'Google SWE'],
        weakTopics: ['Dynamic Programming', 'Graph Theory'],
        streakDays: 7,
        xp: 1250,
        level: 4,
      },
      create: {
        userId: user.id,
        degree: 'B.Tech Computer Science',
        goals: ['Full-Stack Architect', 'Google SWE'],
        weakTopics: ['Dynamic Programming', 'Graph Theory'],
        streakDays: 7,
        xp: 1250,
        level: 4,
      },
    });

    const context = await contextBuilder.buildStudentContext(user.id);
    console.log(`✅ Context assembled for ${context.studentName}:`);
    console.log(`   - Degree: ${context.degree}`);
    console.log(`   - Level: ${context.level} (Streak: ${context.streakDays} days)`);
    console.log(`   - Weak Topics: ${context.weakTopics.join(', ')}`);

    const systemPrompt = await contextBuilder.getTutorSystemInstruction(user.id);
    if (!systemPrompt.includes('Sage AI') || !systemPrompt.includes('Dynamic Programming')) {
      throw new Error('System prompt did not incorporate student weak topics');
    }
    console.log('✅ System instruction correctly personalized with student constraints.');

    // 2. Test Socratic Chat Generation
    console.log('\n💬 [2/5] Testing Socratic Chat Pipeline...');
    const chatReply = await geminiClient.generateChatReply({
      systemInstruction: systemPrompt,
      history: [],
      message: 'Can you just give me the code for recursive fibonacci?',
    });
    console.log(`✅ Sage Socratic Tutor Reply:\n   "${chatReply.slice(0, 150)}..."`);

    // 3. Test Quiz Generation & Zod Validation
    console.log('\n📝 [3/5] Testing Dynamic Quiz Generation & Zod Validator...');
    const mockQuizRaw = JSON.stringify({
      title: 'Computer Science: Graph Theory Mastery Quiz',
      subject: 'Computer Science',
      topic: 'Graph Theory',
      difficulty: 'INTERMEDIATE',
      totalQuestions: 5,
      questions: [
        {
          id: 1,
          question: 'What is the time complexity of Dijkstra algorithm using a Fibonacci heap?',
          codeSnippet: null,
          options: ['O(V^2)', 'O(E + V log V)', 'O(E log V)', 'O(V log E)'],
          correctIndex: 1,
          correctAnswer: 'O(E + V log V)',
          explanation: 'Using a Fibonacci heap reduces the decrease-key operation amortized cost to O(1), leading to O(E + V log V).',
          bloomTaxonomy: 'ANALYZE',
        },
        {
          id: 2,
          question: 'Which traversal algorithm is preferred for finding the shortest path on an unweighted graph?',
          codeSnippet: null,
          options: ['Depth-First Search', 'Breadth-First Search', 'Topological Sort', 'Bellman-Ford'],
          correctIndex: 1,
          correctAnswer: 'Breadth-First Search',
          explanation: 'Breadth-First Search explores vertices in order of their hop distance from the source.',
          bloomTaxonomy: 'UNDERSTAND',
        },
      ],
    });

    const validatedQuiz = validateQuizResponse(mockQuizRaw);
    console.log(`✅ Zod successfully validated quiz: "${validatedQuiz.title}"`);
    console.log(`   Total questions verified: ${validatedQuiz.questions.length}`);
    if (validatedQuiz.questions[0].correctAnswer !== 'O(E + V log V)') {
      throw new Error('Validated answer mismatch');
    }

    // 4. Test Weak Topic Remediation Plan
    console.log('\n🩹 [4/5] Testing Weak Topic Recovery Plan...');
    const mockPlanRaw = JSON.stringify({
      studentName: 'Arjun Sharma',
      diagnosticSummary: 'Recurring difficulty with optimal substructure and state overlapping in Dynamic Programming.',
      targetRecoveryAreas: [
        {
          topic: 'Dynamic Programming',
          coreMisconception: 'Attempting to calculate base cases top-down without memoization table initialization.',
          actionableSteps: [
            'Draw subproblem dependency DAGs',
            'Write the mathematical recurrence relation before touching code',
          ],
          practiceProblem: 'Solve Climbing Stairs using iterative bottom-up table formulation.',
          estimatedMinutes: 30,
        },
      ],
      threeDayPlan: [
        {
          day: 1,
          focus: 'Recurrence Identification',
          tasks: ['Study overlapping subproblems', 'Solve 2 1D DP puzzles'],
          xpReward: 50,
        },
        {
          day: 2,
          focus: 'State Transition Matrices',
          tasks: ['Implement 2D grid DP (Unique Paths)'],
          xpReward: 75,
        },
        {
          day: 3,
          focus: 'Diagnostic Verification',
          tasks: ['Retake DP Quiz targeting 90%+'],
          xpReward: 100,
        },
      ],
    });

    const validatedPlan = validateWeakTopicPlanResponse(mockPlanRaw);
    console.log(`✅ Zod successfully validated study plan for: ${validatedPlan.studentName}`);
    console.log(`   3-Day Plan steps: ${validatedPlan.threeDayPlan.length} milestones`);

    // 5. Test Error Guard on Malformed Response
    console.log('\n🛡️ [5/5] Testing Malformed Schema Rejection...');
    let caughtError = false;
    try {
      validateQuizResponse({ invalid: 'no questions array' });
    } catch (err) {
      caughtError = true;
      console.log(`✅ Correctly rejected invalid quiz structure: "${err.message.slice(0, 60)}..."`);
    }
    if (!caughtError) throw new Error('Validator failed to catch malformed schema');

    console.log('\n🎉 ALL SAGE AI SERVICE TESTS PASSED CLEANLY!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  }
}

testSageAI();
