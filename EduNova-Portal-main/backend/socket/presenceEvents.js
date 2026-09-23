/**
 * EduNova Socket.IO Presence Events Module
 * 
 * Tracks real-time online/offline presence for active learners and instructors.
 * Manages socket-to-user mapping with multi-device/multi-tab support.
 */

// userId -> Set<socketId>
const userSockets = new Map();
// socketId -> userId
const socketUser = new Map();

/**
 * Add a socket connection for a user.
 * Returns true if this is the user's first active connection (transitions from offline to online).
 */
function addUser(userId, socketId) {
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  const sockets = userSockets.get(userId);
  const isFirstConnection = sockets.size === 0;
  sockets.add(socketId);
  socketUser.set(socketId, userId);
  return isFirstConnection;
}

/**
 * Remove a socket connection on disconnect.
 * Returns { userId, isLastConnection } where isLastConnection indicates user has zero active sockets left.
 */
function removeUser(socketId) {
  const userId = socketUser.get(socketId);
  if (!userId) {
    return { userId: null, isLastConnection: false };
  }

  socketUser.delete(socketId);
  const sockets = userSockets.get(userId);
  let isLastConnection = false;

  if (sockets) {
    sockets.delete(socketId);
    if (sockets.size === 0) {
      userSockets.delete(userId);
      isLastConnection = true;
    }
  }

  return { userId, isLastConnection };
}

/**
 * Check if a specific user is currently online.
 */
function isUserOnline(userId) {
  const sockets = userSockets.get(userId);
  return Boolean(sockets && sockets.size > 0);
}

/**
 * Get an array of all currently online user IDs.
 */
function getOnlineUserIds() {
  return Array.from(userSockets.keys());
}

/**
 * Get all active socket IDs for a given user ID.
 */
function getSocketIdsForUser(userId) {
  const sockets = userSockets.get(userId);
  return sockets ? Array.from(sockets) : [];
}

/**
 * Register presence events on a connected socket.
 */
function registerPresenceEvents(io, socket) {
  const user = socket.user;
  if (!user || !user.id) return;

  const isFirstConnection = addUser(user.id, socket.id);

  // Automatically join a personal room for private push alerts
  socket.join(`user:${user.id}`);

  // If user just transitioned to online, broadcast to all connected clients
  if (isFirstConnection) {
    socket.broadcast.emit('user:online', {
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        learnerType: user.learnerType,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Send initial list of currently online users to the freshly connected client
  socket.emit('presence:online_users', getOnlineUserIds());

  // Handle client requesting status of a specific batch of users
  socket.on('presence:check', (userIds, callback) => {
    if (!Array.isArray(userIds)) return;
    const statusMap = {};
    userIds.forEach((id) => {
      statusMap[id] = isUserOnline(id);
    });
    if (typeof callback === 'function') {
      callback({ success: true, statuses: statusMap });
    } else {
      socket.emit('presence:batch_status', statusMap);
    }
  });

  // Handle socket disconnect
  socket.on('disconnect', () => {
    const { userId, isLastConnection } = removeUser(socket.id);

    if (isLastConnection && userId) {
      io.emit('user:offline', {
        userId,
        timestamp: new Date().toISOString(),
      });
    }
  });
}

module.exports = {
  addUser,
  removeUser,
  isUserOnline,
  getOnlineUserIds,
  getSocketIdsForUser,
  registerPresenceEvents,
};
