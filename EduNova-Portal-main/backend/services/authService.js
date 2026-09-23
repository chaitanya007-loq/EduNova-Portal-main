const prisma = require('../config/db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const otpService = require('./otpService');
const googleAuthService = require('./googleAuthService');

// ── Argon2 config ────────────────────────────────────────────────────────────
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,  // 64 MB
  timeCost: 3,
  parallelism: 1,
};

// ── Token helpers ────────────────────────────────────────────────────────────

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * Build a safe user response (strip passwordHash)
 */
const safeUserResponse = (user) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

/**
 * Build full auth response with tokens
 */
const authResponse = (user) => {
  const token = generateToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);
  return {
    user: safeUserResponse(user),
    token,
    refreshToken,
  };
};

// ════════════════════════════════════════════════════════════════════════════
// 1. EMAIL / PASSWORD REGISTRATION
// ════════════════════════════════════════════════════════════════════════════

const register = async ({ name, email, phone, password, role, learnerType, studentUsername }) => {
  // Uniqueness checks
  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw { status: 400, message: 'User already exists with this email' };
  }
  if (phone) {
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) throw { status: 400, message: 'User already exists with this phone' };
  }

  // Hash password with Argon2id
  const passwordHash = password
    ? await argon2.hash(password, ARGON2_OPTIONS)
    : null;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      role: role || 'STUDENT',
      learnerType: learnerType || 'SCHOOL',
      studentUsername,
      // Auto-create learner profile for students
      ...((!role || role === 'STUDENT') && {
        learnerProfile: {
          create: {
            board: null,
            degree: null,
            goals: [],
            weakTopics: [],
            xp: 0,
            level: 1,
            streakDays: 0,
          },
        },
      }),
    },
    include: { learnerProfile: true },
  });

  return authResponse(user);
};

// ════════════════════════════════════════════════════════════════════════════
// 2. EMAIL / PASSWORD LOGIN
// ════════════════════════════════════════════════════════════════════════════

const login = async ({ email, phone, studentUsername, password }) => {
  let user;

  if (email) {
    user = await prisma.user.findUnique({
      where: { email },
      include: { learnerProfile: true },
    });
  } else if (phone) {
    user = await prisma.user.findUnique({
      where: { phone },
      include: { learnerProfile: true },
    });
  } else if (studentUsername) {
    user = await prisma.user.findFirst({
      where: { studentUsername, role: 'PARENT' },
      include: { learnerProfile: true },
    });
  }

  if (!user) throw { status: 401, message: 'Invalid credentials' };
  if (!user.passwordHash) throw { status: 401, message: 'This account uses OTP or social login. No password set.' };

  // Verify with Argon2 (or legacy bcrypt with auto-migration to Argon2)
  let isMatch = false;
  if (user.passwordHash.startsWith('$argon2')) {
    isMatch = await argon2.verify(user.passwordHash, password);
  } else if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$')) {
    const bcrypt = require('bcryptjs');
    isMatch = await bcrypt.compare(password, user.passwordHash);
    if (isMatch) {
      // Seamlessly upgrade password hash to Argon2id
      const newHash = await argon2.hash(password, ARGON2_OPTIONS);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      });
    }
  } else {
    try {
      isMatch = await argon2.verify(user.passwordHash, password);
    } catch {
      isMatch = false;
    }
  }

  if (!isMatch) throw { status: 401, message: 'Invalid credentials' };

  // Update last activity
  await prisma.user.update({
    where: { id: user.id },
    data: { updatedAt: new Date() },
  });

  return authResponse(user);
};

// ════════════════════════════════════════════════════════════════════════════
// 3. PHONE OTP — REQUEST
// ════════════════════════════════════════════════════════════════════════════

const requestOtp = async (phone) => {
  return await otpService.sendOtp(phone);
};

// ════════════════════════════════════════════════════════════════════════════
// 4. PHONE OTP — VERIFY & LOGIN/REGISTER
// ════════════════════════════════════════════════════════════════════════════

const verifyOtpAndLogin = async ({ phone, otp, name, role, learnerType }) => {
  // Verify the OTP first
  await otpService.verifyOtp(phone, otp);

  // Check if user exists with this phone
  let user = await prisma.user.findUnique({
    where: { phone },
    include: { learnerProfile: true },
  });

  if (user) {
    // Existing user — login
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
    });
    return authResponse(user);
  }

  // New user — register
  if (!name) throw { status: 400, message: 'Name is required for new registration' };

  user = await prisma.user.create({
    data: {
      name,
      phone,
      role: role || 'STUDENT',
      learnerType: learnerType || 'SCHOOL',
      ...((!role || role === 'STUDENT') && {
        learnerProfile: {
          create: { xp: 0, level: 1, streakDays: 0 },
        },
      }),
    },
    include: { learnerProfile: true },
  });

  return authResponse(user);
};

// ════════════════════════════════════════════════════════════════════════════
// 5. GOOGLE LOGIN
// ════════════════════════════════════════════════════════════════════════════

const googleLogin = async ({ idToken, role, learnerType }) => {
  const user = await googleAuthService.googleLogin(idToken, { role, learnerType });

  // Update last activity
  await prisma.user.update({
    where: { id: user.id },
    data: { updatedAt: new Date() },
  });

  return authResponse(user);
};

// ════════════════════════════════════════════════════════════════════════════
// 6. PARENT LINKING
// ════════════════════════════════════════════════════════════════════════════

const linkParentToStudent = async (parentId, studentUsername) => {
  // Verify the student exists
  const student = await prisma.user.findFirst({
    where: { studentUsername, role: 'STUDENT' },
    select: { id: true, name: true, studentUsername: true },
  });

  if (!student) {
    throw { status: 404, message: `No student found with username "${studentUsername}"` };
  }

  // Update parent's studentUsername
  const parent = await prisma.user.update({
    where: { id: parentId },
    data: { studentUsername },
    include: { learnerProfile: true },
  });

  return {
    message: `Successfully linked to student: ${student.name}`,
    parent: safeUserResponse(parent),
    linkedStudent: student,
  };
};

// ════════════════════════════════════════════════════════════════════════════
// 7. GET CURRENT USER
// ════════════════════════════════════════════════════════════════════════════

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { learnerProfile: true },
  });

  if (!user) throw { status: 404, message: 'User not found' };
  return safeUserResponse(user);
};

// ════════════════════════════════════════════════════════════════════════════
// 8. REFRESH TOKEN
// ════════════════════════════════════════════════════════════════════════════

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) throw { status: 401, message: 'User not found' };

    const token = generateToken(user.id, user.role);
    const rotatedRefreshToken = generateRefreshToken(user.id);
    return { token, refreshToken: rotatedRefreshToken };
  } catch (error) {
    if (error.status) throw error;
    throw { status: 401, message: 'Invalid or expired refresh token' };
  }
};

module.exports = {
  register, login,
  requestOtp, verifyOtpAndLogin,
  googleLogin,
  linkParentToStudent,
  getMe, refreshAccessToken, generateToken, generateRefreshToken,
};
