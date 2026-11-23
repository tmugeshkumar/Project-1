import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/guards";
import { getPrismaClient } from "@/lib/db";
import { getLocalUserById, updateLocalUser } from "@/lib/auth/local-store";
import type { AdminSessionPayload } from "@/types/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const adminUserUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(15).optional().nullable(),
  accountStatus: z.enum(["ACTIVE", "SUSPENDED", "PENDING_VERIFICATION"]).optional(),
});

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

    // ── Local store fallback ──────────────────────────────────────────────
    if (!prisma) {
      try {
        const record = getLocalUserById(id);
        if (!record) {
          return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
        }
        const { passwordHash: _ph, ...user } = record;
        return NextResponse.json({ success: true, data: user }, { status: 200 });
      } catch {
        return NextResponse.json(
          { success: false, message: "An error occurred reading local user store." },
          { status: 500 }
        );
      }
    }

    // ── Prisma path ───────────────────────────────────────────────────────
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

export const PATCH = withAdminAuth(
  async (
    req: NextRequest,
    { params, session }: { params: { id: string }; session: AdminSessionPayload }
  ) => {
    void session;
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, message: "User ID is required." }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
    }

    const parsed = adminUserUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed.", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      const updated = updateLocalUser(id, parsed.data);
      if (!updated) {
        return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
      }
      const { passwordHash: _ph, ...clean } = updated;
      return NextResponse.json({ success: true, message: "User updated successfully.", data: clean }, { status: 200 });
    }

    try {
      const updated = await prisma.user.update({
        where: { id },
        data: parsed.data,
      });
      return NextResponse.json({ success: true, message: "User updated successfully.", data: updated }, { status: 200 });
    } catch {
      return NextResponse.json({ success: false, message: "Failed to update user." }, { status: 500 });
    }
  }
);
