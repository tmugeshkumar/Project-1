/**
 * Server-side authorization guards for API route handlers.
 * Always validate on the server — never trust client-supplied roles.
 */

import { NextRequest, NextResponse } from "next/server";
import { getUserSessionFromRequest, getAdminSessionFromRequest } from "./session";
import type { SessionPayload, AdminSessionPayload } from "@/types/auth";

type ApiHandler<T = unknown> = (
  req: NextRequest,
  context: { params: T; session: SessionPayload }
) => Promise<NextResponse>;

type AdminApiHandler<T = unknown> = (
  req: NextRequest,
  context: { params: T; session: AdminSessionPayload }
) => Promise<NextResponse>;

/** Wraps an API handler requiring a valid user session */
export function withAuth<T = Record<string, string>>(handler: ApiHandler<T>) {
  return async (req: NextRequest, ctx: { params: T }): Promise<NextResponse> => {
    const session = await getUserSessionFromRequest(req);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }
    return handler(req, { ...ctx, session });
  };
}

/** Wraps an API handler requiring a valid admin session */
export function withAdminAuth<T = Record<string, string>>(
  handler: AdminApiHandler<T>
) {
  return async (req: NextRequest, ctx: { params: T }): Promise<NextResponse> => {
    const session = await getAdminSessionFromRequest(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }
    return handler(req, { ...ctx, session });
  };
}

/** Standalone check for server components */
export async function requireAdminSession(): Promise<AdminSessionPayload> {
  const { getAdminSession } = await import("./session");
  const session = await getAdminSession();
  if (!session || session.role !== "ADMIN") {
    const { redirect } = await import("next/navigation");
    redirect("/admin/login");
    // redirect() throws — TypeScript doesn't know this, so unreachable:
  }
  // session is non-null here; redirect() would have thrown above
  return session as AdminSessionPayload;
}

/** Standalone check for server components */
export async function requireUserSession(): Promise<SessionPayload> {
  const { getUserSession } = await import("./session");
  const session = await getUserSession();
  if (!session) {
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }
  return session as SessionPayload;
}
