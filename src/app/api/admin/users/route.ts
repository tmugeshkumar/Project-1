import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/guards";
import { getPrismaClient } from "@/lib/db";
import { getAllLocalUsers } from "@/lib/auth/local-store";
import { Prisma } from "@prisma/client";
import type { AdminSessionPayload } from "@/types/auth";

export const dynamic = "force-dynamic";

export const GET = withAdminAuth(
  async (req: NextRequest, { session }: { params: Record<string, string>; session: AdminSessionPayload }) => {
    void session; // authenticated via withAdminAuth

    const { searchParams } = req.nextUrl;
    const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
    const rawPageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const pageSize = isNaN(rawPageSize) || rawPageSize < 1 ? 10 : Math.min(rawPageSize, 50);

    const search = searchParams.get("search") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const verified = searchParams.get("verified") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? "createdAt";
    const sortOrder = (searchParams.get("sortOrder") ?? "desc") === "asc" ? "asc" : "desc";

    const prisma = getPrismaClient();

    // ── Local store fallback (no DB configured) ──────────────────────────
    if (!prisma) {
      try {
        let users = getAllLocalUsers().map(({ passwordHash: _ph, ...u }) => u);

        // Filter: search
        if (search) {
          const q = search.toLowerCase();
          users = users.filter(
            (u) =>
              u.fullName.toLowerCase().includes(q) ||
              u.username.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q)
          );
        }

        // Filter: status
        if (status && ["ACTIVE", "SUSPENDED", "PENDING_VERIFICATION"].includes(status)) {
          users = users.filter((u) => u.accountStatus === status);
        }

        // Filter: emailVerified
        if (verified !== undefined) {
          const wantVerified = verified === "true";
          users = users.filter((u) => u.emailVerified === wantVerified);
        }

        // Sort
        const allowedSortFields = ["createdAt", "lastLoginAt", "fullName", "username", "email"] as const;
        type SortField = (typeof allowedSortFields)[number];
        const orderByField: SortField = (allowedSortFields as readonly string[]).includes(sortBy)
          ? (sortBy as SortField)
          : "createdAt";

        users.sort((a, b) => {
          const av = (a as unknown as Record<string, unknown>)[orderByField] ?? "";
          const bv = (b as unknown as Record<string, unknown>)[orderByField] ?? "";
          const cmp = String(av).localeCompare(String(bv));
          return sortOrder === "asc" ? cmp : -cmp;
        });

        const total = users.length;
        const paged = users.slice((page - 1) * pageSize, page * pageSize);

        return NextResponse.json(
          {
            success: true,
            data: {
              users: paged,
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
          { success: false, message: "An error occurred reading local user store." },
          { status: 500 }
        );
      }
    }

    // ── Prisma path ───────────────────────────────────────────────────────
    try {
      const where: Prisma.UserWhereInput = {};

      if (search) {
        where.OR = [
          { fullName: { contains: search, mode: "insensitive" } },
          { username: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      if (status && ["ACTIVE", "SUSPENDED", "PENDING_VERIFICATION"].includes(status)) {
        where.accountStatus = status as Prisma.EnumAccountStatusFilter;
      }

      if (verified !== undefined) {
        where.emailVerified = verified === "true";
      }

      const allowedSortFields = ["createdAt", "lastLoginAt", "fullName", "username", "email"];
      const orderByField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

      const [dbUsers, total] = await Promise.all([
        prisma.user.findMany({
          where,
          orderBy: { [orderByField]: sortOrder },
          skip: (page - 1) * pageSize,
          take: pageSize,
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
            // passwordHash intentionally omitted
          },
        }),
        prisma.user.count({ where }),
      ]);

      return NextResponse.json(
        {
          success: true,
          data: {
            users: dbUsers,
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
