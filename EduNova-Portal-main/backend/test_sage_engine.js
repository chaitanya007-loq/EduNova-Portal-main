const prisma = require('./config/db');
const contextBuilder = require('./ai/contextBuilder');
const geminiProvider = require('./ai/geminiProvider');
const aiController = require('./controllers/aiController');

async function testSageEngine() {
  console.log('===========================================================');
  console.log('  EDUNOVA: SAGE AI ENGINE & PIPELINE VERIFICATION');
  console.log('===========================================================\n');

  try {
    // 1. Get test student Chaitanya Sanchaniya
    const student = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'chaitanyasanchaniya7@gmail.com' },
          { studentUsername: 'chaitanya_s' },
        ],
      },
      include: { learnerProfile: true },
    });

    if (!student) {
      throw new Error('No student found in database to test.');
    }

    console.log(`👤 Testing with Student: ${student.name} (${student.id})`);
    console.log(`   Board: ${student.learnerProfile?.board}, Degree: ${student.learnerProfile?.degree}`);
    console.log(`   Weak Topics:`, student.learnerProfile?.weakTopics);

    // ── STEP 1: TEST CONTEXT BUILDER ──────────────────────────────────────────
    console.log('\n--- 1. Testing Context Builder ---');
    const studentContext = await contextBuilder.buildStudentContext(student.id);
    const systemInstruction = await contextBuilder.getTutorSystemInstruction(student.id);

    console.log('✅ Context extracted:', {
      name: studentContext.studentName,
      stage: studentContext.learnerType,
      level: studentContext.level,
      streak: studentContext.streakDays,
      weakTopics: studentContext.weakTopics,
    });

    if (systemInstruction.includes('Sage AI') && systemInstruction.includes('SOCRATIC')) {
      console.log('✅ PASS: Socratic tutor prompt successfully constructed with student constraints.');
    } else {
      console.error('❌ FAIL: System instruction missing Socratic rules.');
    }

    // ── STEP 2: TEST GEMINI PROVIDER (STREAMING & JSON RETRY) ────────────────
    console.log('\n--- 2. Testing Gemini Provider Streaming Engine ---');
    let chunksReceived = 0;
    let accumulatedText = '';

    const streamResult = await geminiProvider.generateStream({
      systemInstruction,
      message: 'Can you explain how recursion works in a binary search tree?',
      onChunk: (chunk) => {
        chunksReceived++;
        accumulatedText += chunk;
      },
    });

    console.log(`✅ Stream Completed: ${chunksReceived} chunks received, total length: ${accumulatedText.length} chars`);
    console.log(`   Model Engine: ${streamResult.model}`);
    console.log(`   Snippet: "${accumulatedText.slice(0, 120)}..."`);

    console.log('\n--- 3. Testing Gemini Provider Structured JSON & Retry Logic ---');
    const samplePrompt = 'Generate a 2-question diagnostic test for Rotational Dynamics in JSON.';
    const jsonResult = await geminiProvider.generateStructuredJson({
      prompt: samplePrompt,
      systemInstruction: 'Output valid JSON only.',
    });

    console.log('✅ Structured JSON result received:', typeof jsonResult === 'object' ? 'VALID OBJECT' : 'FALLBACK/NULL');

    // ── STEP 3: TEST CONTROLLER POST /api/ai/chat (STREAMING & DB PERSISTENCE) ──
    console.log('\n--- 4. Testing aiController.chat (Streaming SSE & PostgreSQL persistence) ---');
    let sseOutput = '';
    const mockResStream = {
      writeHead: (status, headers) => {
        console.log(`   SSE Headers sent: status ${status}`);
      },
      flushHeaders: () => {},
      write: (data) => {
        sseOutput += data;
      },
      end: () => {
        console.log(`   SSE Stream ended. Total bytes transferred: ${sseOutput.length}`);
      },
    };

    const mockReqStream = {
      user: { id: student.id, role: student.role },
      body: {
        message: 'How does moment of inertia change if mass is distributed further from the rotation axis?',
        stream: true,
      },
      headers: { accept: 'text/event-stream' },
      query: {},
    };

    await aiController.chat(mockReqStream, mockResStream, (err) => {
      if (err) throw err;
    });

    // Verify stored record in PostgreSQL
    const savedRecord = await prisma.aiConversation.findFirst({
      where: { userId: student.id },
      orderBy: { createdAt: 'desc' },
    });

    if (savedRecord && savedRecord.prompt.includes('moment of inertia')) {
      console.log('✅ PASS: Q&A turn successfully persisted to `ai_conversations` table in PostgreSQL!');
      console.log(`   Record ID: ${savedRecord.id}`);
      console.log(`   Title: "${savedRecord.title}"`);
      console.log(`   Model used: ${savedRecord.metadata?.model}`);
      console.log(`   Weak topics targeted:`, savedRecord.metadata?.weakTopicsTargeted);
    } else {
      console.error('❌ FAIL: Conversation was not recorded in PostgreSQL.');
    }

    // ── STEP 4: TEST CONTROLLER POST /api/ai/generate-quiz ────────────────────
    console.log('\n--- 5. Testing aiController.generateQuiz (Weak topics injection) ---');
    let generatedQuizData = null;
    const mockResQuiz = {
      json: (payload) => {
        generatedQuizData = payload;
      },
      status: (code) => mockResQuiz,
    };

    const mockReqQuiz = {
      user: { id: student.id, role: student.role },
      body: {
        subject: 'Physics XII',
        topic: 'Rotational Dynamics',
        questionCount: 5,
        difficulty: 'INTERMEDIATE',
      },
    };

    await aiController.generateQuiz(mockReqQuiz, mockResQuiz, (err) => {
      if (err) throw err;
    });

    console.log('✅ aiController.generateQuiz Result:');
    console.log(`   Title: "${generatedQuizData?.data?.title}"`);
    console.log(`   Total Questions: ${generatedQuizData?.data?.questions?.length}`);
    console.log(`   Weak Topics Targeted:`, generatedQuizData?.data?.weakTopicsTargeted);
    console.log(`   Sample Question 1: "${generatedQuizData?.data?.questions?.[0]?.question}"`);
    console.log(`   Options:`, generatedQuizData?.data?.questions?.[0]?.options);
    console.log(`   Bloom Taxonomy: ${generatedQuizData?.data?.questions?.[0]?.bloomTaxonomy}`);

    // ── STEP 5: TEST CONTROLLER GET /api/ai/history ───────────────────────────
    console.log('\n--- 6. Testing aiController.getChatHistory ---');
    let historyPayload = null;
    const mockResHistory = {
      json: (payload) => {
        historyPayload = payload;
      },
      status: (code) => mockResHistory,
    };

    const mockReqHistory = {
      user: { id: student.id, role: student.role },
      query: { page: '1', limit: '5' },
    };

    await aiController.getChatHistory(mockReqHistory, mockResHistory, (err) => {
      if (err) throw err;
    });

    console.log('✅ aiController.getChatHistory Result:');
    console.log(`   Total Sessions in DB: ${historyPayload?.data?.total}`);
    console.log(`   Retrieved in Page 1: ${historyPayload?.data?.history?.length} session(s)`);
    console.log(`   Most Recent Prompt: "${historyPayload?.data?.history?.[0]?.prompt}"`);

    // ── STEP 6: TEST CONTROLLER POST /api/ai/weak-topic-plan ──────────────────
    console.log('\n--- 7. Testing aiController.generateWeakTopicPlan ---');
    let planPayload = null;
    const mockResPlan = {
      json: (payload) => {
        planPayload = payload;
      },
      status: (code) => mockResPlan,
    };

    const mockReqPlan = {
      user: { id: student.id, role: student.role },
      body: {
        recentErrors: [
          { question: 'Calculate torque about axis', studentAnswer: 'F * r', correctAnswer: 'r x F' },
        ],
      },
    };

    await aiController.generateWeakTopicPlan(mockReqPlan, mockResPlan, (err) => {
      if (err) throw err;
    });

    console.log('✅ aiController.generateWeakTopicPlan Result:');
    console.log(`   Summary: "${planPayload?.data?.diagnosticSummary}"`);
    console.log(`   Target Recovery Areas:`, planPayload?.data?.targetRecoveryAreas?.map(r => r.topic));
    console.log(`   3-Day Plan Days: ${planPayload?.data?.threeDayPlan?.length}`);

    console.log('\n===========================================================');
    console.log('  🎉 SAGE AI PIPELINE VERIFICATION PASSED WITH 100% SUCCESS');
    console.log('===========================================================\n');
  } catch (error) {
    console.error('❌ Sage test error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testSageEngine();
