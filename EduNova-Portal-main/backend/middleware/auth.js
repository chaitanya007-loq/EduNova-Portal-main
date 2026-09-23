const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

/**
 * requireAuth — Validates JWT from HTTP-only cookie OR Bearer header.
 * Attaches `req.user` with full user data from PostgreSQL.
 * 
 * Token resolution order:
 *   1. HTTP-only cookie (`edunova_token`)
 *   2. Authorization: Bearer <token> header
 */
const requireAuth = async (req, res, next) => {
  let token = null;

  // 1. Check HTTP-only cookie first
  if (req.cookies && req.cookies.edunova_token) {
    token = req.cookies.edunova_token;
  }

  // 2. Fallback to Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // No token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No token provided.',
    });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        learnerType: true,
        avatar: true,
        studentUsername: true,
        googleId: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please refresh or log in again.',
        code: 'TOKEN_EXPIRED',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
        code: 'TOKEN_INVALID',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};

/**
 * requireRole — Restricts endpoints to designated roles.
 * Must be used AFTER requireAuth.
 * 
 * Usage:
 *   router.get('/admin-only', requireAuth, requireRole('ADMIN'), handler)
 *   router.get('/staff', requireAuth, requireRole('ADMIN', 'INSTRUCTOR'), handler)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before role check.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}.`,
        code: 'INSUFFICIENT_ROLE',
      });
    }

    next();
  };
};

module.exports = { requireAuth, requireRole };
