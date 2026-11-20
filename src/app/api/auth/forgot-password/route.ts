import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getPrismaClient } from "@/lib/db";

export const dynamic = "force-dynamic";

const GENERIC_RESPONSE = {
  success: true,
  message: "If that email is registered, a reset link has been sent.",
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Rate limit: 3 req/min per IP
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const rl = checkRateLimit(`forgot-password:${ip}`, { intervalMs: 60_000, maxRequests: 3 });
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

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    // 3. Always return generic message
    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  }

  const { email } = parsed.data;

  // 4. If DB not configured, return the same message (don't reveal DB status)
  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  }

  try {
    // 5. Find user by email
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    // 6. If not found: return generic message
    if (!user) {
      return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
    }

    // 7. Generate token and create PasswordResetToken
    const token = crypto.randomUUID();
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        used: false,
      },
    });

    // 8. Log in dev mode
    if (process.env.NODE_ENV !== "production") {
      console.log(`[ForgotPassword] Reset token for ${user.id}: ${token}`);
    }

    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  } catch {
    // Always return generic message — never reveal error details
    return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
  }
}
