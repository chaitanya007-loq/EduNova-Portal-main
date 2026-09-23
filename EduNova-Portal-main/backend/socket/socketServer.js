/**
 * EduNova Socket.IO Server Engine
 * 
 * Configures Socket.IO with CORS, HTTP-only cookie JWT decryption handshake,
 * and attaches presence and chat event listeners.
 */

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { registerPresenceEvents } = require('./presenceEvents');
const { registerChatEvents } = require('./chatEvents');

let io = null;

/**
 * Parse raw Cookie header string into key-value map
 * @param {string} cookieHeader 
 * @returns {Record<string, string>}
 */
function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc, str) => {
    const [key, ...values] = str.trim().split('=');
    if (key) {
      acc[key] = decodeURIComponent(values.join('='));
    }
    return acc;
  }, {});
}

/**
 * Initialize Socket.IO on the underlying HTTP server
 * @param {import('http').Server} httpServer 
 * @returns {Server}
 */
function initSocket(httpServer) {
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ];

  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman) or matching origin
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  // ── Authentication Handshake Middleware ─────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      let token = null;

      // 1. Auth payload (from client: io({ auth: { token: '...' } }))
      if (socket.handshake.auth?.token) {
        token = socket.handshake.auth.token;
      } else if (socket.handshake.auth?.access_token) {
        token = socket.handshake.auth.access_token;
      }

      // 2. Authorization Header (Bearer <token>)
      if (!token && socket.handshake.headers?.authorization) {
        const authHeader = socket.handshake.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        }
      }

      // 3. HTTP-Only Cookies (edunova_token or access_token)
      if (!token && socket.handshake.headers?.cookie) {
        const cookies = parseCookies(socket.handshake.headers.cookie);
        token = cookies.edunova_token || cookies.access_token || null;
      }

      if (!token) {
        return next(new Error('Authentication required: No token provided in handshake'));
      }

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return next(new Error('Invalid token structure'));
      }

      // Fetch user profile from DB to ensure account is valid and role is current
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          learnerType: true,
          avatar: true,
          studentUsername: true,
        },
      });

      if (!user) {
        return next(new Error('User account not found'));
      }

      // Attach verified user to socket instance
      socket.user = user;
      next();
    } catch (err) {
      console.warn('[Socket Handshake Auth Error]', err.message);
      return next(new Error(`Authentication failed: ${err.message}`));
    }
  });

  // ── Connection Lifecycle ───────────────────────────────────────────────────
  io.on('connection', (socket) => {
    console.log(`🔌 [Socket Connected] Socket ID: ${socket.id} | User: ${socket.user?.name} (${socket.user?.id})`);

    // Register modular events
    registerPresenceEvents(io, socket);
    registerChatEvents(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`🔌 [Socket Disconnected] Socket ID: ${socket.id} | Reason: ${reason}`);
    });
  });

  return io;
}

/**
 * Retrieve the active Socket.IO server instance
 * @returns {Server}
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initSocket(server) first.');
  }
  return io;
}

module.exports = {
  initSocket,
  getIO,
};
