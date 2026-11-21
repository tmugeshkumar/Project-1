import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyPassword } from "@/lib/auth/password";
import { createUserSession } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/db";
import { findLocalUser } from "@/lib/auth/local-store";

export const dynamic = "force-dynamic";

const INVALID_CREDENTIALS_MSG = "Invalid credentials. Please try again.";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Rate limit: 10 req/min per IP
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const rl = checkRateLimit(`login:${ip}`, { intervalMs: 60_000, maxRequests: 10 });
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // 2. Parse and validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { identifier, password, honeypot } = parsed.data;

  // 3. Honeypot check
  if (honeypot && honeypot.length > 0) {
    return NextResponse.json({ success: false, message: INVALID_CREDENTIALS_MSG }, { status: 401 });
  }

  try {
    const prisma = getPrismaClient();
    let user: {
      id: string;
      email: string;
      username: string;
      passwordHash: string;
      role: "USER" | "ADMIN";
      accountStatus: string;
      emailVerified: boolean;
    } | null = null;

    if (prisma) {
      try {
        user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier.toLowerCase() },
              { username: identifier.toLowerCase() },
            ],
          },
        });
      } catch {
        user = findLocalUser(identifier);
      }
    } else {
      user = findLocalUser(identifier);
    }

    // 6. User not found — generic error
    if (!user) {
      return NextResponse.json({ success: false, message: INVALID_CREDENTIALS_MSG }, { status: 401 });
    }

    // 9. Verify password before status checks to keep timing consistent
    const passwordMatch = await verifyPassword(password, user.passwordHash);

    // 6 (continued). Password doesn't match — same generic error
    if (!passwordMatch) {
      return NextResponse.json({ success: false, message: INVALID_CREDENTIALS_MSG }, { status: 401 });
    }

    // 7. Check account suspension
    if (user.accountStatus === "SUSPENDED") {
      return NextResponse.json(
        { success: false, message: "Your account has been suspended." },
        { status: 403 }
      );
    }

    // 8. Check email verification (allow admin bypass)
    if (!user.emailVerified && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Please verify your email before signing in." },
        { status: 403 }
      );
    }

    // 10. Update lastLoginAt if DB active
    if (prisma) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
      } catch {
        // non-fatal
      }
    }

    // 11. Create user session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Signed in successfully.",
        data: { userId: user.id, role: user.role },
      },
      { status: 200 }
    );

    return createUserSession(
      { userId: user.id, email: user.email, role: user.role, username: user.username },
      response
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
