/**
 * EduNova Realtime Socket.IO & Peer Skill Exchange Test Suite
 */

const io = require('socket.io-client');
const prisma = require('./config/db');
const conversationService = require('./services/conversationService');
const skillExchangeService = require('./services/skillExchangeService');
const jwt = require('jsonwebtoken');
const http = require('http');
const express = require('express');
const { initSocket } = require('./socket/socketServer');

async function runTests() {
  console.log('🧪 ========================================================');
  console.log('🧪 Starting Socket.IO & Peer Skill Exchange Backend Tests');
  console.log('🧪 ========================================================\n');

  try {
    // 1. Setup two test learners in DB
    const studentA = await prisma.user.upsert({
      where: { email: 'peer.alice@edunova.in' },
      update: { name: 'Alice Walker', role: 'STUDENT', learnerType: 'SKILLS' },
      create: {
        email: 'peer.alice@edunova.in',
        name: 'Alice Walker',
        role: 'STUDENT',
        learnerType: 'SKILLS',
      },
    });

    const studentB = await prisma.user.upsert({
      where: { email: 'peer.bob@edunova.in' },
      update: { name: 'Bob Builder', role: 'STUDENT', learnerType: 'COLLEGE' },
      create: {
        email: 'peer.bob@edunova.in',
        name: 'Bob Builder',
        role: 'STUDENT',
        learnerType: 'COLLEGE',
      },
    });

    console.log(`✅ [1/6] Provisioned test users: Alice (${studentA.id}) & Bob (${studentB.id})`);

    // Clean up previous test exchanges
    await prisma.skillExchange.deleteMany({
      where: {
        OR: [
          { senderId: studentA.id, receiverId: studentB.id },
          { senderId: studentB.id, receiverId: studentA.id },
        ],
      },
    });

    // 2. Test Skill Exchange Creation (Alice proposes swap to Bob)
    console.log('\n🔄 [2/6] Proposing Peer Skill Exchange...');
    const exchange = await skillExchangeService.createExchangeRequest(studentA.id, {
      receiverId: studentB.id,
      skillOffered: 'React & Next.js Development',
      skillWanted: 'PostgreSQL & System Design',
    });

    console.log(`✅ Exchange created with ID: ${exchange.id}, status: ${exchange.status}`);
    if (exchange.status !== 'PENDING') throw new Error('Expected status PENDING');

    // 3. Test Acceptance with Atomic Conversation Provisioning
    console.log('\n🤝 [3/6] Bob accepting Peer Skill Exchange...');
    const acceptedExchange = await skillExchangeService.updateExchangeStatus(
      exchange.id,
      studentB.id,
      { status: 'ACCEPTED' }
    );

    console.log(`✅ Exchange accepted! Linked conversation ID: ${acceptedExchange.conversationId}`);
    if (!acceptedExchange.conversationId) throw new Error('Expected conversationId to be populated');

    // Verify conversation was created with 2 members and 1 kickoff message
    const conv = await conversationService.getConversationById(
      acceptedExchange.conversationId,
      studentA.id
    );
    console.log(`✅ Conversation type: ${conv.type}, Member count: ${conv.members.length}`);
    if (conv.members.length !== 2) throw new Error('Expected 2 conversation members');

    // 4. Test Listing Conversations & Messages
    console.log('\n💬 [4/6] Listing conversations and cursor-based messages...');
    const aliceConversations = await conversationService.getUserConversations(studentA.id);
    console.log(`✅ Alice active conversations: ${aliceConversations.length}`);
    console.log(`   Last message preview: "${aliceConversations[0].lastMessage?.content}"`);

    // Alice sends a reply
    const sentMsg = await conversationService.sendMessage(
      acceptedExchange.conversationId,
      studentA.id,
      { content: 'Hey Bob! Excited to exchange React tips for Postgres indexing.' }
    );
    console.log(`✅ Alice sent message: "${sentMsg.content}"`);

    // Fetch messages with pagination
    const messageHistory = await conversationService.getConversationMessages(
      acceptedExchange.conversationId,
      studentB.id,
      { limit: 10 }
    );
    console.log(`✅ Bob fetched ${messageHistory.messages.length} messages (hasMore: ${messageHistory.hasMore})`);

    // 5. Test Socket.IO Handshake & Realtime Server
    console.log('\n⚡ [5/6] Testing Socket.IO Handshake and Realtime Engine...');
    const testApp = express();
    const testHttpServer = http.createServer(testApp);
    const testIo = initSocket(testHttpServer);

    const testPort = 5055;
    await new Promise((resolve) => testHttpServer.listen(testPort, resolve));
    console.log(`✅ Standalone test socket server listening on port ${testPort}`);

    // Generate JWT for Alice
    const aliceToken = jwt.sign(
      { id: studentA.id, email: studentA.email, role: studentA.role },
      process.env.JWT_SECRET || 'edunova_super_secure_jwt_secret_dev_2026',
      { expiresIn: '1h' }
    );

    // Connect socket client with auth token
    const clientSocket = io(`http://localhost:${testPort}`, {
      auth: { token: aliceToken },
      transports: ['websocket'],
    });

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Socket connection timed out')), 5000);
      clientSocket.on('connect', () => {
        console.log(`✅ Socket connected successfully! Socket ID: ${clientSocket.id}`);
        clearTimeout(timeout);
        resolve();
      });
      clientSocket.on('connect_error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    // Test join:conversation via socket
    await new Promise((resolve, reject) => {
      clientSocket.emit(
        'join:conversation',
        { conversationId: acceptedExchange.conversationId },
        (response) => {
          if (response && response.success) {
            console.log(`✅ Socket joined room conversation:${response.conversationId}`);
            resolve();
          } else {
            reject(new Error(response?.message || 'Failed to join conversation'));
          }
        }
      );
    });

    // Test send:message via socket
    await new Promise((resolve, reject) => {
      clientSocket.emit(
        'send:message',
        {
          conversationId: acceptedExchange.conversationId,
          content: 'Testing real-time transmission over WebSocket!',
          messageType: 'TEXT',
        },
        (response) => {
          if (response && response.success) {
            console.log(`✅ Socket send:message confirmed! Message ID: ${response.message.id}`);
            resolve();
          } else {
            reject(new Error(response?.message || 'Failed to send message'));
          }
        }
      );
    });

    clientSocket.disconnect();
    await new Promise((resolve) => testHttpServer.close(resolve));
    console.log('✅ Test socket server cleanly shut down.');

    console.log('\n🎉 [6/6] ALL REALTIME & SKILL EXCHANGE TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  }
}

runTests();
