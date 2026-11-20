/**
 * JWT generation and verification using jose (pure-JS, no native bindings).
 * Two separate secrets — one for user sessions, one for admin sessions.
 */

import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import * as joseErrors from "jose/errors";
import type { SessionPayload, AdminSessionPayload } from "@/types/auth";

function getSecret(key: string): Uint8Array {
  const value = process.env[key];
  if (!value || value.length < 32) {
    throw new Error(
      `Environment variable ${key} must be set and at least 32 characters long.`
    );
  }
  return new Uint8Array(new TextEncoder().encode(value));
}

// ─── User JWT ─────────────────────────────────────────────────────────────────

export async function signUserToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret("JWT_SECRET"));
}

export async function verifyUserToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret("JWT_SECRET"));
    return payload as unknown as SessionPayload;
  } catch (err) {
    if (
      err instanceof joseErrors.JWTExpired ||
      err instanceof joseErrors.JWSInvalid ||
      err instanceof joseErrors.JWTInvalid
    ) {
      return null;
    }
    return null;
  }
}

// ─── Admin JWT ────────────────────────────────────────────────────────────────

export async function signAdminToken(
  payload: AdminSessionPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret("JWT_ADMIN_SECRET"));
}

export async function verifyAdminToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret("JWT_ADMIN_SECRET"));
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}
