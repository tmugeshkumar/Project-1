import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/guards";
import { getPrismaClient } from "@/lib/db";
import type { AdminSessionPayload } from "@/types/auth";

export const dynamic = "force-dynamic";

export const GET = withAdminAuth(
  async (
    _req: NextRequest,
    { params, session }: { params: { id: string }; session: AdminSessionPayload }
  ) => {
    void session; // authenticated via withAdminAuth

    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, message: "User ID is required." }, { status: 400 });
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { success: false, message: "Database not configured. Please contact the administrator." },
        { status: 503 }
      );
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          fullName: true,
          username: true,
          email: true,
          role: true,
          emailVerified: true,
          emailVerifiedAt: true,
          accountStatus: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          // passwordHash intentionally omitted
        },
      });

      if (!user) {
        return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch {
      return NextResponse.json(
        { success: false, message: "An error occurred. Please try again later." },
        { status: 500 }
      );
    }
  }
);
