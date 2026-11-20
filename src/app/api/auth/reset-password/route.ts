import { NextRequest, NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashPassword } from "@/lib/auth/password";
import { getPrismaClient } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Rate limit: 5 req/min per IP
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const rl = checkRateLimit(`reset-password:${ip}`, { intervalMs: 60_000, maxRequests: 5 });
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // 2. Validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { token, password } = parsed.data;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(
      { success: false, message: "Database not configured. Please contact the administrator." },
      { status: 503 }
    );
  }

  try {
    // 3. Find valid, unused, non-expired PasswordResetToken
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    // 4. Invalid / expired
    if (!resetToken) {
      return NextResponse.json(
        { success: false, message: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    // 5. Hash the new password
    const passwordHash = await hashPassword(password);

    // 6. Update user and mark token as used in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    // 7. Return success
    return NextResponse.json(
      { success: true, message: "Password updated successfully. Please sign in." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
