import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // 1. Get token from searchParams
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired verification link." },
      { status: 400 }
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
    // 2. Find valid, unused, non-expired VerificationToken
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    // 3. If invalid
    if (!verificationToken) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification link." },
        { status: 400 }
      );
    }

    // 4. Update user and mark token as used in a transaction
    const now = new Date();
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true, emailVerifiedAt: now },
      }),
      prisma.verificationToken.update({
        where: { id: verificationToken.id },
        data: { used: true },
      }),
    ]);

    // 5. Return success
    return NextResponse.json(
      { success: true, message: "Email verified successfully. You can now sign in." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
