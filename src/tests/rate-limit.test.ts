import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../lib/rate-limit";

describe("Sliding Window Rate Limiter", () => {
  it("allows requests below the defined threshold", () => {
    const testId = `test-client-${Date.now()}`;
    const options = { intervalMs: 5000, maxRequests: 3 };

    const first = checkRateLimit(testId, options);
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(2);

    const second = checkRateLimit(testId, options);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(1);

    const third = checkRateLimit(testId, options);
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);
  });

  it("blocks requests that exceed the maxRequests threshold", () => {
    const testId = `blocked-client-${Date.now()}`;
    const options = { intervalMs: 5000, maxRequests: 2 };

    checkRateLimit(testId, options); // req 1
    checkRateLimit(testId, options); // req 2

    const blocked = checkRateLimit(testId, options); // req 3
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetMs).toBeGreaterThan(0);
  });
});
