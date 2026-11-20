/**
 * Next.js Edge Middleware — Route Protection
 * Runs before every request matching the config pattern.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken, verifyAdminToken } from "@/lib/auth/jwt";
import { USER_COOKIE, ADMIN_COOKIE } from "@/lib/auth/session";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  // ── Admin route protection ──────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    // Admin login page — only redirect if already authenticated as admin
    if (pathname === "/admin/login") {
      const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;
      if (adminToken) {
        const session = await verifyAdminToken(adminToken);
        if (session?.role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
      }
      return NextResponse.next();
    }

    // All other /admin/* routes require a valid admin token
    const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    const adminSession = await verifyAdminToken(adminToken);
    if (!adminSession || adminSession.role !== "ADMIN") {
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.set(ADMIN_COOKIE, "", { maxAge: 0, path: "/" });
      return res;
    }
    return NextResponse.next();
  }

  // ── Redirect logged-in users away from auth pages ──────────────────────────
  const authOnlyPages = ["/login", "/signup", "/forgot-password"];
  if (authOnlyPages.includes(pathname)) {
    const userToken = req.cookies.get(USER_COOKIE)?.value;
    if (userToken) {
      const session = await verifyUserToken(userToken);
      if (session) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/signup",
    "/forgot-password",
  ],
};
