import { NextRequest, NextResponse } from "next/server";
import { getUserSessionFromRequest } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Requires user session
  const session = await getUserSessionFromRequest(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 }
    );
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
      where: { id: session.userId },
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
        // passwordHash is intentionally omitted
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
