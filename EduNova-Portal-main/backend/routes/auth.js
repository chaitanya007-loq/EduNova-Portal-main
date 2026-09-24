const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  register, login,
  requestPasswordReset, resetPassword,
  googleLogin, linkParent,
  getMe, refreshToken, logout,
} = require('../controllers/authController');

// ── Zod Schemas with Auto-Normalization ─────────────────────────────────────

const registerSchema = {
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.preprocess((val) => (val === '' ? undefined : val), z.string().email('Valid email is required').optional()),
    phone: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(10, 'Valid phone number required').optional()),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.preprocess((val) => (typeof val === 'string' ? val.toUpperCase() : val), z.enum(['STUDENT', 'INSTRUCTOR', 'PARENT']).optional()),
    learnerType: z.preprocess((val) => (typeof val === 'string' ? val.toUpperCase() : val), z.enum(['SCHOOL', 'COLLEGE', 'SKILLS', 'EXAM']).optional()),
    username: z.string().optional(),
    studentUsername: z.string().optional(),
  }).transform((data) => ({
    ...data,
    studentUsername: data.studentUsername || data.username,
  })).refine(data => data.email || data.phone || data.studentUsername, {
    message: 'Either email or phone is required',
  }),
};

const loginSchema = {
  body: z.object({
    email: z.preprocess((val) => (val === '' ? undefined : val), z.string().email().optional()),
    phone: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
    studentUsername: z.string().optional(),
    username: z.string().optional(),
    password: z.string().min(1, 'Password is required'),
  }).transform((data) => ({
    ...data,
    studentUsername: data.studentUsername || data.username,
  })).refine(data => data.email || data.phone || data.studentUsername, {
    message: 'Either email, phone, or student username is required',
  }),
};

const passwordResetRequestSchema = {
  body: z.object({ email: z.string().email('Valid email is required') }),
};

const passwordResetSchema = {
  body: z.object({
    email: z.string().email('Valid email is required'),
    code: z.string().regex(/^\d{6}$/, 'Reset code must be 6 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
};

const googleLoginSchema = {
  body: z.object({
    idToken: z.string().min(1, 'Google ID token is required'),
    role: z.preprocess((val) => (typeof val === 'string' ? val.toUpperCase() : val), z.enum(['STUDENT', 'INSTRUCTOR', 'PARENT']).optional()),
    learnerType: z.preprocess((val) => (typeof val === 'string' ? val.toUpperCase() : val), z.enum(['SCHOOL', 'COLLEGE', 'SKILLS', 'EXAM']).optional()),
  }),
};

const linkParentSchema = {
  body: z.object({
    studentUsername: z.string().min(1, 'Student username is required'),
  }),
};

const refreshSchema = {
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required').optional(),
  }),
};

// ── Routes ───────────────────────────────────────────────────────────────────

// Email/Password
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/password-reset/request', validate(passwordResetRequestSchema), requestPasswordReset);
router.post('/password-reset/confirm', validate(passwordResetSchema), resetPassword);

// Google
router.post('/google', validate(googleLoginSchema), googleLogin);

// Parent Linking (requires authenticated PARENT)
router.post('/link-parent', requireAuth, requireRole('PARENT'), validate(linkParentSchema), linkParent);

// Session
router.get('/me', requireAuth, getMe);
router.post('/refresh', validate(refreshSchema), refreshToken);
router.post('/logout', requireAuth, logout);

module.exports = router;
