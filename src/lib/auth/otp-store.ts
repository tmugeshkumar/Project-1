/**
 * In-memory OTP store for phone-based change-password flow.
 * OTPs expire after 5 minutes and are single-use.
 * In production, replace with Redis or a durable store.
 */

interface OtpEntry {
  code: string;
  userId: string;
  phone: string;
  expiresAt: number; // ms timestamp
  used: boolean;
}

// Module-level map — survives across requests in the same Node.js process
const otpStore = new Map<string, OtpEntry>();

/** Generate a secure 6-digit OTP */
function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Create (or replace) an OTP for a user.
 * Returns the OTP code (for dev logging / simulated SMS).
 */
export function createOtp(userId: string, phone: string): string {
  const code = generateCode();
  otpStore.set(userId, {
    code,
    userId,
    phone,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    used: false,
  });
  return code;
}

/**
 * Verify an OTP for a user.
 * Returns true if valid, false if wrong / expired / already used.
 */
export function verifyOtp(userId: string, code: string): boolean {
  const entry = otpStore.get(userId);
  if (!entry) return false;
  if (entry.used) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(userId);
    return false;
  }
  if (entry.code !== code) return false;

  // Mark as used (single-use)
  entry.used = true;
  otpStore.set(userId, entry);
  return true;
}

/** Clear OTP after successful password change */
export function clearOtp(userId: string): void {
  otpStore.delete(userId);
}
