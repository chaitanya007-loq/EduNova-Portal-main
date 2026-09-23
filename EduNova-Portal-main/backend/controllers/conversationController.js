/**
 * EduNova Conversation Controller
 * 
 * REST handlers for listing conversation threads and fetching paginated message histories.
 */

const conversationService = require('../services/conversationService');
const { getIO } = require('../socket/socketServer');

class ConversationController {
  /**
   * GET /api/conversations
   * Returns all active conversation threads with unread counts and last message
   */
  async getUserConversations(req, res, next) {
    try {
      const conversations = await conversationService.getUserConversations(req.user.id);
      return res.json({
        success: true,
        message: 'Conversations retrieved successfully',
        data: conversations,
        count: conversations.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/conversations/:id
   * Fetch details for a specific conversation thread
   */
  async getConversationById(req, res, next) {
    try {
      const conversation = await conversationService.getConversationById(req.params.id, req.user.id);
      return res.json({
        success: true,
        message: 'Conversation details retrieved successfully',
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/conversations/:id/messages
   * Cursor-based paginated chat message history
   */
  async getConversationMessages(req, res, next) {
    try {
      const { cursor, limit } = req.query;
      const result = await conversationService.getConversationMessages(
        req.params.id,
        req.user.id,
        { cursor, limit }
      );

      return res.json({
        success: true,
        message: 'Messages retrieved successfully',
        data: result.messages,
        pagination: {
          nextCursor: result.nextCursor,
          hasMore: result.hasMore,
          count: result.count,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/conversations/:id/messages
   * Post message via REST endpoint (fallback for non-socket clients)
   */
  async sendMessage(req, res, next) {
    try {
      const { content, messageType, fileUrl } = req.body;
      const message = await conversationService.sendMessage(
        req.params.id,
        req.user.id,
        { content, messageType, fileUrl }
      );

      // Try broadcasting to active socket room if initialized
      try {
        const io = getIO();
        io.to(`conversation:${req.params.id}`).emit('message:received', message);
      } catch (socketErr) {
        // Socket not initialized or error; REST still succeeds
      }

      return res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConversationController();
