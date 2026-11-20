// @vitest-environment node
/**
 * Auth Unit Tests — password hashing, JWT signing/verifying, validation schemas
 */

import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { hashPassword, verifyPassword, passwordSchema, usernameSchema } from "@/lib/auth/password";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";

// ─── Password Tests ───────────────────────────────────────────────────────────

describe("Password Utilities", () => {
  it("hashes a password and produces a bcrypt hash", async () => {
    const hash = await hashPassword("SecurePass@123");
    expect(hash).toMatch(/^\$2[aby]\$12\$/); // bcrypt format, cost 12
    expect(hash).not.toBe("SecurePass@123");
  });

  it("verifies correct password against hash", async () => {
    const hash = await hashPassword("MyP@ssw0rd!");
    const result = await verifyPassword("MyP@ssw0rd!", hash);
    expect(result).toBe(true);
  });

  it("rejects incorrect password against hash", async () => {
    const hash = await hashPassword("CorrectPass@1");
    const result = await verifyPassword("WrongPass@1", hash);
    expect(result).toBe(false);
  });

  it("produces different hashes for the same password (salt uniqueness)", async () => {
    const hash1 = await hashPassword("SamePass@1");
    const hash2 = await hashPassword("SamePass@1");
    expect(hash1).not.toBe(hash2);
  });
});

// ─── Password Schema Tests ────────────────────────────────────────────────────

describe("Password Schema Validation", () => {
  it("accepts a strong password", () => {
    const result = passwordSchema.safeParse("StrongP@ss1");
    expect(result.success).toBe(true);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = passwordSchema.safeParse("Ab1!");
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const result = passwordSchema.safeParse("weakpass@1");
    expect(result.success).toBe(false);
  });

  it("rejects password without special character", () => {
    const result = passwordSchema.safeParse("WeakPass1");
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = passwordSchema.safeParse("WeakPass!");
    expect(result.success).toBe(false);
  });
});

// ─── Username Schema Tests ────────────────────────────────────────────────────

describe("Username Schema Validation", () => {
  it("accepts valid username", () => {
    expect(usernameSchema.safeParse("john_doe").success).toBe(true);
    expect(usernameSchema.safeParse("user-123").success).toBe(true);
    expect(usernameSchema.safeParse("Admin99").success).toBe(true);
  });

  it("rejects username shorter than 3 characters", () => {
    expect(usernameSchema.safeParse("ab").success).toBe(false);
  });

  it("rejects username with spaces", () => {
    expect(usernameSchema.safeParse("user name").success).toBe(false);
  });

  it("rejects username with special characters", () => {
    expect(usernameSchema.safeParse("user@name!").success).toBe(false);
  });
});

// ─── Register Schema Tests ────────────────────────────────────────────────────

describe("Register Schema Validation", () => {
  const validData = {
    fullName: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    password: "Secure@Pass1",
    confirmPassword: "Secure@Pass1",
    agreeToTerms: true,
  };

  it("passes with valid registration data", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when passwords do not match", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "Different@Pass1",
    });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.flatten())).toContain("Passwords do not match");
  });

  it("fails when agreeToTerms is false", () => {
    const result = registerSchema.safeParse({ ...validData, agreeToTerms: false });
    expect(result.success).toBe(false);
  });

  it("fails with invalid email format", () => {
    const result = registerSchema.safeParse({ ...validData, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("fails with weak password", () => {
    const result = registerSchema.safeParse({ ...validData, password: "weakpass", confirmPassword: "weakpass" });
    expect(result.success).toBe(false);
  });
});

// ─── Login Schema Tests ───────────────────────────────────────────────────────

describe("Login Schema Validation", () => {
  it("accepts valid login with email", () => {
    const result = loginSchema.safeParse({ identifier: "user@example.com", password: "anypassword" });
    expect(result.success).toBe(true);
  });

  it("accepts valid login with username", () => {
    const result = loginSchema.safeParse({ identifier: "johndoe", password: "anypassword" });
    expect(result.success).toBe(true);
  });

  it("fails with empty identifier", () => {
    const result = loginSchema.safeParse({ identifier: "", password: "password" });
    expect(result.success).toBe(false);
  });

  it("fails with empty password", () => {
    const result = loginSchema.safeParse({ identifier: "user@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});

// ─── Forgot Password Schema Tests ─────────────────────────────────────────────

describe("Forgot Password Schema", () => {
  it("accepts valid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "test@example.com" }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });
});

// ─── Reset Password Schema Tests ──────────────────────────────────────────────

describe("Reset Password Schema", () => {
  it("passes with valid token and matching passwords", () => {
    const result = resetPasswordSchema.safeParse({
      token: "some-secure-token",
      password: "NewSecure@Pass1",
      confirmPassword: "NewSecure@Pass1",
    });
    expect(result.success).toBe(true);
  });

  it("fails when new passwords do not match", () => {
    const result = resetPasswordSchema.safeParse({
      token: "some-token",
      password: "NewSecure@Pass1",
      confirmPassword: "Different@Pass1",
    });
    expect(result.success).toBe(false);
  });
});

// ─── JWT Tests ────────────────────────────────────────────────────────────────

describe("JWT Token Generation and Verification", () => {
  beforeAll(() => {
    vi.stubEnv("JWT_SECRET", "test-jwt-secret-key-at-least-32-chars-long!!!");
    vi.stubEnv("JWT_ADMIN_SECRET", "test-admin-secret-key-at-least-32-chars!!!");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it("signs and verifies a user token", async () => {
    const { signUserToken, verifyUserToken } = await import("@/lib/auth/jwt");
    const payload = { userId: "user-1", email: "user@test.com", role: "USER" as const, username: "testuser" };
    const token = await signUserToken(payload);
    expect(token).toBeTruthy();
    const verified = await verifyUserToken(token);
    expect(verified?.userId).toBe("user-1");
    expect(verified?.email).toBe("user@test.com");
    expect(verified?.role).toBe("USER");
  });

  it("signs and verifies an admin token", async () => {
    const { signAdminToken, verifyAdminToken } = await import("@/lib/auth/jwt");
    const payload = { adminId: "admin-1", email: "admin@test.com", role: "ADMIN" as const, username: "admin" };
    const token = await signAdminToken(payload);
    const verified = await verifyAdminToken(token);
    expect(verified?.adminId).toBe("admin-1");
    expect(verified?.role).toBe("ADMIN");
  });

  it("returns null for an invalid user token", async () => {
    const { verifyUserToken } = await import("@/lib/auth/jwt");
    const result = await verifyUserToken("invalid.token.string");
    expect(result).toBeNull();
  });

  it("returns null for an invalid admin token", async () => {
    const { verifyAdminToken } = await import("@/lib/auth/jwt");
    const result = await verifyAdminToken("tampered.token.value");
    expect(result).toBeNull();
  });

  it("admin token is invalid when verified with user secret", async () => {
    const { signAdminToken, verifyUserToken } = await import("@/lib/auth/jwt");
    const payload = { adminId: "admin-1", email: "admin@test.com", role: "ADMIN" as const, username: "admin" };
    const adminToken = await signAdminToken(payload);
    // User verifier uses different secret — should return null
    const result = await verifyUserToken(adminToken);
    expect(result).toBeNull();
  });
});
