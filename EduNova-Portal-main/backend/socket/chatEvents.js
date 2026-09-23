/**
 * EduNova Socket.IO Chat Events Module
 * 
 * Handles real-time messaging, room subscriptions, read receipts, and typing indicators.
 * Persists messages directly to PostgreSQL with atomic updates to conversation metadata.
 */

const prisma = require('../config/db');

/**
 * Register all chat and messaging socket events
 * @param {import('socket.io').Server} io 
 * @param {import('socket.io').Socket} socket 
 */
function registerChatEvents(io, socket) {
  const user = socket.user;
  if (!user || !user.id) return;

  /**
   * Event: join:conversation
   * Subscribes socket to conversation room and marks messages as read.
   */
  socket.on('join:conversation', async (data, callback) => {
    try {
      const conversationId = typeof data === 'string' ? data : data?.conversationId;

      if (!conversationId) {
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'conversationId is required' });
        }
        return;
      }

      // Verify that this user is an authorized member of the conversation
      const membership = await prisma.conversationMember.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId: user.id,
          },
        },
      });

      if (!membership) {
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'Unauthorized: Not a member of this conversation' });
        }
        return socket.emit('error', { message: 'Not a member of this conversation' });
      }

      const roomName = `conversation:${conversationId}`;
      socket.join(roomName);

      // Update lastReadAt for this member
      const now = new Date();
      await prisma.conversationMember.update({
        where: {
          conversationId_userId: {
            conversationId,
            userId: user.id,
          },
        },
        data: {
          lastReadAt: now,
        },
      });

      // Broadcast read receipt to room
      socket.to(roomName).emit('conversation:read', {
        conversationId,
        userId: user.id,
        readAt: now.toISOString(),
      });

      if (typeof callback === 'function') {
        callback({ success: true, conversationId });
      }
    } catch (error) {
      console.error('[Socket Chat] join:conversation error:', error);
      if (typeof callback === 'function') {
        callback({ success: false, message: 'Internal server error while joining conversation' });
      }
    }
  });

  /**
   * Event: leave:conversation
   * Leaves the conversation room
   */
  socket.on('leave:conversation', (data, callback) => {
    try {
      const conversationId = typeof data === 'string' ? data : data?.conversationId;
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
      }
      if (typeof callback === 'function') {
        callback({ success: true, conversationId });
      }
    } catch (error) {
      console.error('[Socket Chat] leave:conversation error:', error);
      if (typeof callback === 'function') {
        callback({ success: false, message: error.message });
      }
    }
  });

  /**
   * Event: send:message
   * Persists message to database, broadcasts to room, and sends push notifications
   * to offline or unfocused conversation members.
   */
  socket.on('send:message', async (data, callback) => {
    try {
      const { conversationId, content, messageType = 'TEXT', fileUrl = null } = data || {};

      if (!conversationId) {
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'conversationId is required' });
        }
        return;
      }

      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'Message content cannot be empty' });
        }
        return;
      }

      const validTypes = ['TEXT', 'CODE', 'FILE'];
      const sanitizedType = validTypes.includes(messageType) ? messageType : 'TEXT';

      // 1. Verify membership
      const membership = await prisma.conversationMember.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId: user.id,
          },
        },
      });

      if (!membership) {
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'You are not a member of this conversation' });
        }
        return;
      }

      // 2. Persist message and touch conversation in a transaction
      const [message] = await prisma.$transaction([
        prisma.chatMessage.create({
          data: {
            conversationId,
            senderId: user.id,
            content: content.trim(),
            messageType: sanitizedType,
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
              userId: user.id,
            },
          },
          data: {
            lastReadAt: new Date(),
          },
        }),
      ]);

      const roomName = `conversation:${conversationId}`;

      // 3. Broadcast to all sockets currently in the conversation room
      io.to(roomName).emit('message:received', message);

      // 4. Query other members of the conversation to emit targeted push notifications
      const otherMembers = await prisma.conversationMember.findMany({
        where: {
          conversationId,
          userId: { not: user.id },
        },
        select: {
          userId: true,
        },
      });

      // Emit push alert to each member's private user room
      otherMembers.forEach((member) => {
        io.to(`user:${member.userId}`).emit('notification:new_message', {
          conversationId,
          message,
          sender: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          },
        });
      });

      if (typeof callback === 'function') {
        callback({ success: true, message });
      }
    } catch (error) {
      console.error('[Socket Chat] send:message error:', error);
      if (typeof callback === 'function') {
        callback({ success: false, message: 'Failed to send message' });
      }
    }
  });

  /**
   * Event: typing:start
   * Ephemeral broadcast to room members that this user started typing
   */
  socket.on('typing:start', (data) => {
    const conversationId = typeof data === 'string' ? data : data?.conversationId;
    if (!conversationId) return;

    socket.to(`conversation:${conversationId}`).emit('typing:started', {
      conversationId,
      user: {
        id: user.id,
        name: user.name,
      },
    });
  });

  /**
   * Event: typing:stop
   * Ephemeral broadcast to room members that this user stopped typing
   */
  socket.on('typing:stop', (data) => {
    const conversationId = typeof data === 'string' ? data : data?.conversationId;
    if (!conversationId) return;

    socket.to(`conversation:${conversationId}`).emit('typing:stopped', {
      conversationId,
      userId: user.id,
    });
  });
}

module.exports = { registerChatEvents };
