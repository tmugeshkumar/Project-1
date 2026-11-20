import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/guards";
import { updateUserStatusSchema } from "@/lib/validations/auth";
import { getPrismaClient } from "@/lib/db";
import type { AdminSessionPayload } from "@/types/auth";

export const dynamic = "force-dynamic";

export const PATCH = withAdminAuth(
  async (
    req: NextRequest,
    { params, session }: { params: { id: string }; session: AdminSessionPayload }
  ) => {
    const { id: userId } = params;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required." }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
    }

    const parsed = updateUserStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed.", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { status, reason } = parsed.data;

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { success: false, message: "Database not configured. Please contact the administrator." },
        { status: 503 }
      );
    }

    try {
      // Check the user exists
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
      }

      // Update accountStatus
      await prisma.user.update({
        where: { id: userId },
        data: { accountStatus: status },
      });

      // Insert audit log
      const action = status === "SUSPENDED" ? "USER_SUSPENDED" : "USER_REACTIVATED";
      await prisma.adminAuditLog.create({
        data: {
          action,
          adminId: session.adminId,
          targetUserId: userId,
          metadata: reason ? { reason } : undefined,
        },
      });

      return NextResponse.json(
        { success: true, message: "Account status updated." },
        { status: 200 }
      );
    } catch {
      return NextResponse.json(
        { success: false, message: "An error occurred. Please try again later." },
        { status: 500 }
      );
    }
  }
);
