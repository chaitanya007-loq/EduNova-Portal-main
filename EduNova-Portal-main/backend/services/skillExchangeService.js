/**
 * EduNova Peer Skill Exchange Service
 * 
 * Manages skill swap proposals and auto-provisions collaborative conversation rooms upon acceptance.
 * Uses atomic multi-table transactions (prisma.$transaction).
 */

const prisma = require('../config/db');

class SkillExchangeService {
  /**
   * Create a skill swap proposal between two learners
   * @param {string} senderId 
   * @param {{ receiverId: string, skillOffered: string, skillWanted: string }} payload 
   */
  async createExchangeRequest(senderId, { receiverId, skillOffered, skillWanted }) {
    if (!receiverId || !skillOffered || !skillWanted) {
      const error = new Error('receiverId, skillOffered, and skillWanted are required');
      error.status = 400;
      throw error;
    }

    if (senderId === receiverId) {
      const error = new Error('You cannot initiate a skill exchange with yourself');
      error.status = 400;
      throw error;
    }

    // 1. Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, name: true, role: true },
    });

    if (!receiver) {
      const error = new Error('The requested peer does not exist');
      error.status = 404;
      throw error;
    }

    // 2. Prevent duplicate pending requests with the same skills
    const existingPending = await prisma.skillExchange.findFirst({
      where: {
        senderId,
        receiverId,
        skillOffered: skillOffered.trim(),
        skillWanted: skillWanted.trim(),
        status: 'PENDING',
      },
    });

    if (existingPending) {
      const error = new Error('An identical pending skill exchange proposal already exists');
      error.status = 409;
      throw error;
    }

    // 3. Create exchange proposal
    const exchange = await prisma.skillExchange.create({
      data: {
        senderId,
        receiverId,
        skillOffered: skillOffered.trim(),
        skillWanted: skillWanted.trim(),
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
            learnerType: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true,
            learnerType: true,
          },
        },
      },
    });

    return exchange;
  }

  /**
   * Accept, reject, or complete a skill exchange proposal
   * Auto-provisions a shared conversation room upon acceptance using prisma.$transaction
   * @param {string} exchangeId 
   * @param {string} userId 
   * @param {{ status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED' }} payload 
   */
  async updateExchangeStatus(exchangeId, userId, { status }) {
    const validStatuses = ['ACCEPTED', 'REJECTED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      const error = new Error(`Invalid status: ${status}. Must be ACCEPTED, REJECTED, or COMPLETED`);
      error.status = 400;
      throw error;
    }

    const exchange = await prisma.skillExchange.findUnique({
      where: { id: exchangeId },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
        conversation: true,
      },
    });

    if (!exchange) {
      const error = new Error('Skill exchange proposal not found');
      error.status = 404;
      throw error;
    }

    // Authorization checks
    if (status === 'ACCEPTED' || status === 'REJECTED') {
      if (exchange.receiverId !== userId) {
        const error = new Error('Unauthorized: Only the recipient can accept or reject this proposal');
        error.status = 403;
        throw error;
      }
      if (exchange.status !== 'PENDING') {
        const error = new Error(`Cannot update proposal: current status is already ${exchange.status}`);
        error.status = 400;
        throw error;
      }
    } else if (status === 'COMPLETED') {
      if (exchange.senderId !== userId && exchange.receiverId !== userId) {
        const error = new Error('Unauthorized: You are not a participant of this skill exchange');
        error.status = 403;
        throw error;
      }
      if (exchange.status !== 'ACCEPTED') {
        const error = new Error('Only active ACCEPTED skill exchanges can be marked as COMPLETED');
        error.status = 400;
        throw error;
      }
    }

    // ── Status: ACCEPTED ──
    if (status === 'ACCEPTED') {
      return await prisma.$transaction(async (tx) => {
        // 1. Create a dedicated conversation room for the peer exchange
        const conversation = await tx.conversation.create({
          data: {
            type: 'SKILL_EXCHANGE',
          },
        });

        // 2. Add both sender and receiver as conversation members
        await tx.conversationMember.createMany({
          data: [
            {
              conversationId: conversation.id,
              userId: exchange.senderId,
              role: 'MEMBER',
            },
            {
              conversationId: conversation.id,
              userId: exchange.receiverId,
              role: 'MEMBER',
            },
          ],
        });

        // 3. Post an automated kickoff message
        await tx.chatMessage.create({
          data: {
            conversationId: conversation.id,
            senderId: exchange.receiverId,
            content: `🤝 Skill exchange accepted! You are now connected to swap knowledge: "${exchange.skillOffered}" (offered by ${exchange.sender.name}) ↔ "${exchange.skillWanted}" (wanted). Feel free to share code snippets or notes here!`,
            messageType: 'TEXT',
          },
        });

        // 4. Update the exchange record with ACCEPTED status and linked conversation
        const updatedExchange = await tx.skillExchange.update({
          where: { id: exchangeId },
          data: {
            status: 'ACCEPTED',
            conversationId: conversation.id,
          },
          include: {
            sender: { select: { id: true, name: true, avatar: true } },
            receiver: { select: { id: true, name: true, avatar: true } },
            conversation: {
              include: {
                members: {
                  include: {
                    user: { select: { id: true, name: true, avatar: true } },
                  },
                },
              },
            },
          },
        });

        return updatedExchange;
      });
    }

    // ── Status: REJECTED or COMPLETED ──
    const updatedExchange = await prisma.skillExchange.update({
      where: { id: exchangeId },
      data: { status },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
        conversation: true,
      },
    });

    return updatedExchange;
  }

  /**
   * Fetch all skill exchanges involving a user (sent and received)
   * @param {string} userId 
   * @param {{ status?: string, type?: 'sent' | 'received' | 'all' }} filters 
   */
  async getUserExchanges(userId, { status, type = 'all' } = {}) {
    const where = {};

    if (type === 'sent') {
      where.senderId = userId;
    } else if (type === 'received') {
      where.receiverId = userId;
    } else {
      where.OR = [{ senderId: userId }, { receiverId: userId }];
    }

    if (status) {
      where.status = status;
    }

    const exchanges = await prisma.skillExchange.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
            learnerType: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true,
            learnerType: true,
          },
        },
        conversation: {
          select: {
            id: true,
            updatedAt: true,
          },
        },
      },
    });

    return exchanges;
  }

  /**
   * Get a specific exchange by ID
   * @param {string} exchangeId 
   * @param {string} userId 
   */
  async getExchangeById(exchangeId, userId) {
    const exchange = await prisma.skillExchange.findUnique({
      where: { id: exchangeId },
      include: {
        sender: { select: { id: true, name: true, avatar: true, learnerType: true } },
        receiver: { select: { id: true, name: true, avatar: true, learnerType: true } },
        conversation: {
          include: {
            members: {
              include: {
                user: { select: { id: true, name: true, avatar: true } },
              },
            },
          },
        },
      },
    });

    if (!exchange) {
      const error = new Error('Skill exchange proposal not found');
      error.status = 404;
      throw error;
    }

    if (exchange.senderId !== userId && exchange.receiverId !== userId) {
      const error = new Error('Unauthorized: You are not a participant in this exchange');
      error.status = 403;
      throw error;
    }

    return exchange;
  }
}

module.exports = new SkillExchangeService();
