const prisma = require('../config/db');
const contextBuilder = require('../ai/contextBuilder');
const geminiProvider = require('../ai/geminiProvider');

const buildHistory = (records) => records
  .reverse()
  .flatMap((record) => [
    { role: 'user', parts: [{ text: record.prompt }] },
    { role: 'model', parts: [{ text: record.response }] },
  ]);

const chat = async ({ userId, message, conversationId = null }) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_')) {
    throw { status: 503, message: 'AI service is not configured on the backend' };
  }

  const studentContext = await contextBuilder.buildStudentContext(userId);
  const systemInstruction = await contextBuilder.getTutorSystemInstruction(userId);
  const previousTurns = await prisma.aiConversation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const reply = await geminiProvider.generateChatReply({
    systemInstruction,
    history: buildHistory(previousTurns),
    message: message.trim(),
  });

  const conversation = await prisma.aiConversation.create({
    data: {
      userId,
      title: message.trim().slice(0, 80),
      prompt: message.trim(),
      response: reply.trim(),
      metadata: {
        model: geminiProvider.modelName,
        conversationId,
        learnerType: studentContext.learnerType,
        goals: studentContext.goals,
        weakTopics: studentContext.weakTopics,
      },
    },
  });

  await prisma.aiMessage.createMany({
    data: [
      { conversationId: conversation.id, role: 'user', content: message.trim() },
      { conversationId: conversation.id, role: 'model', content: reply.trim() },
    ],
  });

  return {
    reply: reply.trim(),
    conversationId: conversation.id,
    model: geminiProvider.modelName,
  };
};

const getHistory = async ({ userId, page = 1, limit = 20 }) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const [history, total] = await Promise.all([
    prisma.aiConversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    }),
    prisma.aiConversation.count({ where: { userId } }),
  ]);

  return {
    history,
    total,
    page: safePage,
    totalPages: Math.ceil(total / safeLimit),
  };
};

module.exports = { chat, getHistory };