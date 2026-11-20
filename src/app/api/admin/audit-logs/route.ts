import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/guards";
import { getPrismaClient } from "@/lib/db";
import type { AdminSessionPayload } from "@/types/auth";

export const dynamic = "force-dynamic";

export const GET = withAdminAuth(
  async (
    req: NextRequest,
    { session }: { params: Record<string, string>; session: AdminSessionPayload }
  ) => {
    void session; // authenticated via withAdminAuth

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { success: false, message: "Database not configured. Please contact the administrator." },
        { status: 503 }
      );
    }

    const { searchParams } = req.nextUrl;
    const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
    const rawPageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const pageSize = isNaN(rawPageSize) || rawPageSize < 1 ? 20 : Math.min(rawPageSize, 100);

    try {
      const [logs, total] = await Promise.all([
        prisma.adminAuditLog.findMany({
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            admin: {
              select: { fullName: true, username: true },
            },
            targetUser: {
              select: { fullName: true, username: true },
            },
          },
        }),
        prisma.adminAuditLog.count(),
      ]);

      return NextResponse.json(
        {
          success: true,
          data: {
            logs,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
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
