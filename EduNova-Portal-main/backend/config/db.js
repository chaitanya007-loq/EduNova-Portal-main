const { PrismaClient } = require('@prisma/client');

/**
 * Prisma Client Singleton
 * 
 * Prevents multiple PrismaClient instances in development
 * due to hot-reloading (nodemon restarts).
 */
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
