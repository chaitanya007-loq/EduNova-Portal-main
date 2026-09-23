/**
 * EduNova Conversation & Chat Service
 * 
 * Manages active conversation threads, unread counts, and cursor-based message pagination.
 */

const prisma = require('../config/db');

class ConversationService {
  /**
   * List all active conversations for a user, including the last message and unread count
   * @param {string} userId 
   */
  async getUserConversations(userId) {
    const userMemberships = await prisma.conversationMember.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                    role: true,
                    learnerType: true,
                  },
                },
              },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
            skillExchange: {
              select: {
                id: true,
                skillOffered: true,
                skillWanted: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        conversation: {
          updatedAt: 'desc',
        },
      },
    });

    // Compute unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      userMemberships.map(async (membership) => {
        const conv = membership.conversation;
        const lastMessage = conv.messages[0] || null;

        const unreadCount = await prisma.chatMessage.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            createdAt: { gt: membership.lastReadAt },
          },
        });

        // Filter other members (peers)
        const peers = conv.members
          .filter((m) => m.userId !== userId)
          .map((m) => ({
            ...m.user,
            role: m.role,
            joinedAt: m.joinedAt,
          }));

        return {
          id: conv.id,
          type: conv.type,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          lastReadAt: membership.lastReadAt,
          unreadCount,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                messageType: lastMessage.messageType,
                fileUrl: lastMessage.fileUrl,
                createdAt: lastMessage.createdAt,
                sender: lastMessage.sender,
              }
            : null,
          peers,
          allMembers: conv.members.map((m) => ({
            ...m.user,
            memberRole: m.role,
            lastReadAt: m.lastReadAt,
          })),
          skillExchange: conv.skillExchange,
        };
      })
    );

    return conversationsWithUnread;
  }

  /**
   * Fetch a single conversation by ID with membership check
   * @param {string} conversationId 
   * @param {string} userId 
   */
  async getConversationById(conversationId, userId) {
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!membership) {
      const error = new Error('Unauthorized: You are not a member of this conversation');
      error.status = 403;
      throw error;
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
                learnerType: true,
              },
            },
          },
        },
        skillExchange: true,
      },
    });

    return conversation;
  }

  /**
   * Cursor-based paginated message history for a conversation
   * @param {string} conversationId 
   * @param {string} userId 
   * @param {{ cursor?: string, limit?: number }} query 
   */
  async getConversationMessages(conversationId, userId, { cursor, limit = 30 }) {
    // 1. Verify membership
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!membership) {
      const error = new Error('Unauthorized: You are not a member of this conversation');
      error.status = 403;
      throw error;
    }

    const takeLimit = Math.min(Math.max(parseInt(limit, 10) || 30, 1), 100);

    // 2. Fetch messages ordered by createdAt DESC for pagination
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
      take: takeLimit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            learnerType: true,
          },
        },
      },
    });

    const hasMore = messages.length > takeLimit;
    const paginatedMessages = hasMore ? messages.slice(0, takeLimit) : messages;
    const nextCursor = hasMore ? paginatedMessages[paginatedMessages.length - 1].id : null;

    // 3. Update member's lastReadAt
    await prisma.conversationMember.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return {
      messages: paginatedMessages.reverse(), // Chronological order (oldest to newest)
      nextCursor,
      hasMore,
      count: paginatedMessages.length,
    };
  }

  /**
   * Post a new message to a conversation via REST
   * @param {string} conversationId 
   * @param {string} senderId 
   * @param {{ content: string, messageType?: string, fileUrl?: string }} data 
   */
  async sendMessage(conversationId, senderId, { content, messageType = 'TEXT', fileUrl = null }) {
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: senderId,
        },
      },
    });

    if (!membership) {
      const error = new Error('Unauthorized: You are not a member of this conversation');
      error.status = 403;
      throw error;
    }

    if (!content || !content.trim()) {
      const error = new Error('Message content cannot be empty');
      error.status = 400;
      throw error;
    }

    const [message] = await prisma.$transaction([
      prisma.chatMessage.create({
        data: {
          conversationId,
          senderId,
          content: content.trim(),
          messageType,
          fileUrl,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
              learnerType: true,
            },
          },
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
      prisma.conversationMember.update({
        where: {
          conversationId_userId: {
            conversationId,
            userId: senderId,
          },
        },
        data: { lastReadAt: new Date() },
      }),
    ]);

    return message;
  }
}

module.exports = new ConversationService();
