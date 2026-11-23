import { NextRequest, NextResponse } from "next/server";
import { getUserSessionFromRequest, getAdminSessionFromRequest } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/db";
import { getLocalUserById } from "@/lib/auth/local-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Check user session
  const userSession = await getUserSessionFromRequest(req);
  const adminSession = await getAdminSessionFromRequest(req);

  if (!userSession && !adminSession) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 }
    );
  }

  // If admin session
  if (adminSession && !userSession) {
    return NextResponse.json({
      success: true,
      data: {
        id: adminSession.adminId,
        fullName: "Administrator",
        username: adminSession.username,
        email: adminSession.email,
        role: "ADMIN",
        accountStatus: "ACTIVE",
        emailVerified: true,
      },
    });
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    // Local store: get full record to include phone
    const record = getLocalUserById(userSession!.userId);
    return NextResponse.json({
      success: true,
      data: {
        id: userSession!.userId,
        fullName: record?.fullName ?? userSession!.username,
        username: userSession!.username,
        email: userSession!.email,
        role: userSession!.role,
        accountStatus: record?.accountStatus ?? "ACTIVE",
        emailVerified: record?.emailVerified ?? true,
        phone: record?.phone ?? null,
      },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userSession!.userId },
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

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
