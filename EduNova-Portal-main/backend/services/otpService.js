const crypto = require('crypto');
const argon2 = require('argon2');
const prisma = require('../config/db');

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 3;

/**
 * Generate a cryptographically secure 6-digit OTP
 */
const generateOtp = () => {
  // Generate random bytes and convert to a 6-digit number
  const buffer = crypto.randomBytes(4);
  const num = buffer.readUInt32BE(0);
  const otp = String(num % 1000000).padStart(OTP_LENGTH, '0');
  return otp;
};

/**
 * Send OTP to a phone number
 * Creates the OTP record in DB with Argon2-hashed code
 * 
 * Returns the plaintext OTP (for dev/testing — in production, send via SMS gateway)
 */
const sendOtp = async (phone) => {
  // Invalidate any previous unconsumed OTPs for this phone
  await prisma.otpVerification.updateMany({
    where: { phone, consumed: false },
    data: { consumed: true },
  });

  const otp = generateOtp();
  const otpHash = await argon2.hash(otp, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });

  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.otpVerification.create({
    data: {
      phone,
      otpHash,
      expiresAt,
      attempts: 0,
      consumed: false,
    },
  });

  // TODO: In production, integrate with SMS gateway (Twilio, MSG91, etc.)
  // For now, return the OTP for development/testing
  console.log(`📱 OTP for ${phone}: ${otp} (dev only — expires in ${OTP_EXPIRY_MINUTES} min)`);

  return {
    message: 'OTP sent successfully',
    expiresAt,
    // Remove in production:
    ...(process.env.NODE_ENV === 'development' && { devOtp: otp }),
  };
};

/**
 * Verify OTP for a phone number
 * Enforces max 3 attempts, 5-minute expiry, single-use
 */
const verifyOtp = async (phone, otpCode) => {
  // Find the latest unconsumed OTP for this phone
  const record = await prisma.otpVerification.findFirst({
    where: {
      phone,
      consumed: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    throw { status: 400, message: 'No valid OTP found. Please request a new one.' };
  }

  // Check max attempts
  if (record.attempts >= MAX_ATTEMPTS) {
    // Consume the OTP so it can't be used again
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { consumed: true },
    });
    throw { status: 429, message: 'Maximum OTP attempts exceeded. Please request a new one.' };
  }

  // Increment attempts
  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { attempts: record.attempts + 1 },
  });

  // Verify the OTP hash
  const isValid = await argon2.verify(record.otpHash, otpCode);

  if (!isValid) {
    const remainingAttempts = MAX_ATTEMPTS - (record.attempts + 1);
    throw {
      status: 401,
      message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
    };
  }

  // Mark as consumed
  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { consumed: true },
  });

  return { verified: true };
};

module.exports = { generateOtp, sendOtp, verifyOtp };
