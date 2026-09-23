const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV !== 'production';

/**
 * General API rate limiter (prevents scraping and DDoS)
 * Allows 1000 requests per 15 mins in development, 200 in production
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Strict authentication rate limiter
 * Allows 100 attempts per 15 mins in development, 20 in production
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login or OTP attempts from this IP. Please try again after 15 minutes.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
});

module.exports = { apiLimiter, authLimiter };
