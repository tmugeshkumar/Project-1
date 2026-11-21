/**
 * Session cookie management.
 * All cookies are HTTP-only, SameSite=Strict, Secure (in production).
 */

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { signUserToken, verifyUserToken, signAdminToken, verifyAdminToken } from "./jwt";
import type { SessionPayload, AdminSessionPayload } from "@/types/auth";

export const USER_COOKIE = "auth_token";
export const ADMIN_COOKIE = "admin_token";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: "strict" as const,
  path: "/",
};

// ─── User session helpers ─────────────────────────────────────────────────────

export async function createUserSession(
  payload: SessionPayload,
  response: NextResponse
): Promise<NextResponse> {
  const token = await signUserToken(payload);
  response.cookies.set(USER_COOKIE, token, {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return response;
}

export async function getUserSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(USER_COOKIE)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function getUserSessionFromRequest(
  req: NextRequest
): Promise<SessionPayload | null> {
  const token = req.cookies.get(USER_COOKIE)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export function clearUserSession(response: NextResponse): NextResponse {
  response.cookies.set(USER_COOKIE, "", {
    ...COOKIE_OPTS,
    maxAge: 0,
    expires: new Date(0),
  });
  response.cookies.set(ADMIN_COOKIE, "", {
    ...COOKIE_OPTS,
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

// ─── Admin session helpers ────────────────────────────────────────────────────

export async function createAdminSession(
  payload: AdminSessionPayload,
  response: NextResponse
): Promise<NextResponse> {
  const token = await signAdminToken(payload);
  response.cookies.set(ADMIN_COOKIE, token, {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return response;
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function getAdminSessionFromRequest(
  req: NextRequest
): Promise<AdminSessionPayload | null> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function clearAdminSession(response: NextResponse): NextResponse {
  response.cookies.set(ADMIN_COOKIE, "", {
    ...COOKIE_OPTS,
    maxAge: 0,
    expires: new Date(0),
  });
  response.cookies.set(USER_COOKIE, "", {
    ...COOKIE_OPTS,
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
