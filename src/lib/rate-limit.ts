/**
 * In-Memory Sliding Window Rate Limiter
 * 
 * Provides rate-limiting defense for contact submissions and API routes
 * without requiring mandatory external Redis for single-instance or serverless deployments.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired timestamps periodically (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    const windowMs = 60 * 1000 * 15; // 15 minutes
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  intervalMs: number; // Time window in ms (e.g., 60,000 for 1 min)
  maxRequests: number; // Max allowed requests in this window
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { intervalMs: 60 * 1000, maxRequests: 5 }
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier) || { timestamps: [] };

  // Filter timestamps within current window
  const windowStart = now - options.intervalMs;
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  if (record.timestamps.length >= options.maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const resetMs = Math.max(0, options.intervalMs - (now - oldestTimestamp));
    return {
      allowed: false,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);
  rateLimitStore.set(identifier, record);

  return {
    allowed: true,
    remaining: options.maxRequests - record.timestamps.length,
    resetMs: options.intervalMs,
  };
}
