/**
 * EduNova Skill Exchange Controller
 * 
 * REST handlers for managing peer-to-peer skill swap proposals and room auto-provisioning.
 */

const skillExchangeService = require('../services/skillExchangeService');
const { getIO } = require('../socket/socketServer');

class SkillExchangeController {
  /**
   * POST /api/exchanges/request
   * Create a skill swap proposal between two learners
   */
  async createExchangeRequest(req, res, next) {
    try {
      const { receiverId, skillOffered, skillWanted } = req.body;
      const exchange = await skillExchangeService.createExchangeRequest(req.user.id, {
        receiverId,
        skillOffered,
        skillWanted,
      });

      // Emit real-time notification to recipient if socket is active
      try {
        const io = getIO();
        io.to(`user:${receiverId}`).emit('exchange:new_request', {
          exchange,
          sender: {
            id: req.user.id,
            name: req.user.name,
            avatar: req.user.avatar,
          },
        });
      } catch (socketErr) {
        // Socket may not be connected or initialized
      }

      return res.status(201).json({
        success: true,
        message: 'Skill exchange request submitted successfully',
        data: exchange,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/exchanges/:id/status
   * Accept, reject, or complete a skill exchange proposal
   */
  async updateExchangeStatus(req, res, next) {
    try {
      const { status } = req.body;
      const exchange = await skillExchangeService.updateExchangeStatus(
        req.params.id,
        req.user.id,
        { status }
      );

      // Emit socket notification to both participants
      try {
        const io = getIO();
        const notifyData = {
          exchangeId: exchange.id,
          status: exchange.status,
          conversationId: exchange.conversationId,
          updatedBy: req.user.id,
        };

        io.to(`user:${exchange.senderId}`).emit('exchange:status_updated', notifyData);
        io.to(`user:${exchange.receiverId}`).emit('exchange:status_updated', notifyData);

        if (status === 'ACCEPTED' && exchange.conversationId) {
          io.to(`user:${exchange.senderId}`).emit('conversation:created', {
            conversationId: exchange.conversationId,
            type: 'SKILL_EXCHANGE',
          });
          io.to(`user:${exchange.receiverId}`).emit('conversation:created', {
            conversationId: exchange.conversationId,
            type: 'SKILL_EXCHANGE',
          });
        }
      } catch (socketErr) {
        // Socket not initialized or non-critical
      }

      return res.json({
        success: true,
        message: `Skill exchange status updated to ${status}`,
        data: exchange,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/exchanges
   * List all skill exchanges involving the authenticated learner
   */
  async getUserExchanges(req, res, next) {
    try {
      const { status, type } = req.query;
      const exchanges = await skillExchangeService.getUserExchanges(req.user.id, { status, type });
      return res.json({
        success: true,
        message: 'Skill exchanges retrieved successfully',
        data: exchanges,
        count: exchanges.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/exchanges/:id
   * Fetch specific skill exchange details
   */
  async getExchangeById(req, res, next) {
    try {
      const exchange = await skillExchangeService.getExchangeById(req.params.id, req.user.id);
      return res.json({
        success: true,
        message: 'Skill exchange retrieved successfully',
        data: exchange,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SkillExchangeController();
