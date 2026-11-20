import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession, getAdminSessionFromRequest } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Get admin session before clearing
  const session = await getAdminSessionFromRequest(req);

  const response = NextResponse.json(
    { success: true, message: "Admin signed out successfully." },
    { status: 200 }
  );

  // Insert AdminAuditLog if session exists
  if (session) {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        await prisma.adminAuditLog.create({
          data: {
            action: "ADMIN_LOGOUT",
            adminId: session.adminId,
          },
        });
      } catch {
        // Non-fatal: still clear the session
      }
    }
  }

  return clearAdminSession(response);
}
