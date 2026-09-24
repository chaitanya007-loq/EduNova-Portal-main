const authService = require('../services/authService');

/**
 * @desc    Register with email/password
 * @route   POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    // Set HTTP-only cookie
    setTokenCookie(res, result.token);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Login with email/phone + password
 * @route   POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    setTokenCookie(res, result.token);
    setRefreshTokenCookie(res, result.refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const result = await authService.requestPasswordReset(req.body.email);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPasswordWithCode(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Google login/register
 * @route   POST /api/auth/google
 */
const googleLogin = async (req, res) => {
  try {
    const result = await authService.googleLogin(req.body);
    setTokenCookie(res, result.token);
    setRefreshTokenCookie(res, result.refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Link parent to student
 * @route   POST /api/auth/link-parent
 */
const linkParent = async (req, res) => {
  try {
    const result = await authService.linkParentToStudent(req.user.id, req.body.studentUsername);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }
    const result = await authService.refreshAccessToken(refreshToken);
    setTokenCookie(res, result.token);
    setRefreshTokenCookie(res, result.refreshToken);
    res.json({
      success: true,
      token: result.token,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Logout (clear cookie)
 * @route   POST /api/auth/logout
 */
const logout = async (req, res) => {
  await require('../config/db').user.update({
    where: { id: req.user.id },
    data: { tokenVersion: { increment: 1 } },
  });
  res.cookie('edunova_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  });
  res.cookie('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully' });
};

// ── Helper ──────────────────────────────────────────────────────────────────

/**
 * Set JWT as HTTP-only secure cookie
 */
const setTokenCookie = (res, token) => {
  res.cookie('edunova_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

module.exports = {
  register, login,
  requestPasswordReset, resetPassword,
  googleLogin, linkParent,
  getMe, refreshToken, logout,
};
