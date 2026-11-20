import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/guards";
import { getPrismaClient } from "@/lib/db";
import type { AdminSessionPayload } from "@/types/auth";

export const dynamic = "force-dynamic";

export const GET = withAdminAuth(
  async (_req: NextRequest, { session }: { params: Record<string, string>; session: AdminSessionPayload }) => {
    void session; // authenticated via withAdminAuth

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { success: false, message: "Database not configured. Please contact the administrator." },
        { status: 503 }
      );
    }

    try {
      const [total, verified, active, suspended] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { emailVerified: true } }),
        prisma.user.count({ where: { accountStatus: "ACTIVE" } }),
        prisma.user.count({ where: { accountStatus: "SUSPENDED" } }),
      ]);

      const recentRegistrations = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          fullName: true,
          username: true,
          email: true,
          role: true,
          emailVerified: true,
          accountStatus: true,
          createdAt: true,
          lastLoginAt: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            totalUsers: total,
            verifiedUsers: verified,
            unverifiedUsers: total - verified,
            activeUsers: active,
            suspendedUsers: suspended,
            recentRegistrations,
          },
        },
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
