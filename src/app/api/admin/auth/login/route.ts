import { NextRequest, NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyPassword } from "@/lib/auth/password";
import { createAdminSession } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/db";
import { findLocalUser } from "@/lib/auth/local-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Rate limit: 5 req/min per IP (stricter)
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const rl = checkRateLimit(`admin-login:${ip}`, { intervalMs: 60_000, maxRequests: 5 });
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // 2. Validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid admin credentials." },
      { status: 401 }
    );
  }

  const { identifier, password } = parsed.data;

  try {
    const prisma = getPrismaClient();
    let admin: {
      id: string;
      email: string;
      username: string;
      passwordHash: string;
      role: string;
      accountStatus: string;
    } | null = null;

    if (prisma) {
      try {
        admin = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier.toLowerCase() },
              { username: identifier.toLowerCase() },
            ],
          },
        });
      } catch {
        admin = findLocalUser(identifier);
      }
    } else {
      admin = findLocalUser(identifier);
    }

    // 4. Not found, wrong password, or not ADMIN — same generic error
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    const passwordMatch = await verifyPassword(password, admin.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    // 5. Check accountStatus
    if (admin.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        { success: false, message: "Admin account is not active." },
        { status: 403 }
      );
    }

    // 7. Create ADMIN session
    const response = NextResponse.json(
      { success: true, message: "Admin signed in.", data: { adminId: admin.id } },
      { status: 200 }
    );

    // 8. Insert AdminAuditLog if DB connected
    if (prisma) {
      try {
        await prisma.adminAuditLog.create({
          data: {
            action: "ADMIN_LOGIN",
            adminId: admin.id,
          },
        });
      } catch {
        // non-fatal
      }
    }

    return createAdminSession(
      { adminId: admin.id, email: admin.email, username: admin.username, role: "ADMIN" },
      response
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
