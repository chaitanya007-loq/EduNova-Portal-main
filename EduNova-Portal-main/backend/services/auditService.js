const prisma = require('../config/db');

/**
 * Log an admin action
 */
const logAction = async (adminId, { action, targetType, targetId, details }) => {
  const log = await prisma.adminAuditLog.create({
    data: {
      adminId,
      action,
      targetType,
      targetId,
      details: details || null,
    },
  });

  return log;
};

/**
 * Get audit logs with filters
 */
const getAuditLogs = async ({ adminId, action, targetType, page = 1, limit = 20 }) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, parseInt(limit, 10) || 20);

  const where = {};

  if (adminId) where.adminId = adminId;
  if (action) where.action = action;
  if (targetType) where.targetType = targetType;

  const [logs, total] = await Promise.all([
    prisma.adminAuditLog.findMany({
      where,
      include: {
        admin: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
    }),
    prisma.adminAuditLog.count({ where }),
  ]);

  return { logs, total, page: parsedPage, totalPages: Math.ceil(total / parsedLimit) };
};

module.exports = { logAction, getAuditLogs };
