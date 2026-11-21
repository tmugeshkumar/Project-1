import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/guards";
import { getPrismaClient } from "@/lib/db";
import { getAllLocalUsers } from "@/lib/auth/local-store";
import type { AdminSessionPayload } from "@/types/auth";

export const dynamic = "force-dynamic";

export const GET = withAdminAuth(
  async (_req: NextRequest, { session }: { params: Record<string, string>; session: AdminSessionPayload }) => {
    void session; // authenticated via withAdminAuth

    const prisma = getPrismaClient();

    // ── Local store fallback ──────────────────────────────────────────────
    if (!prisma) {
      try {
        const allUsers = getAllLocalUsers();
        const total = allUsers.length;
        const verified = allUsers.filter((u) => u.emailVerified).length;
        const active = allUsers.filter((u) => u.accountStatus === "ACTIVE").length;
        const suspended = allUsers.filter((u) => u.accountStatus === "SUSPENDED").length;

        const recentRegistrations = [...allUsers]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map(({ passwordHash: _ph, ...u }) => u);

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
          { success: false, message: "An error occurred reading local user store." },
          { status: 500 }
        );
      }
    }

    // ── Prisma path ───────────────────────────────────────────────────────
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
