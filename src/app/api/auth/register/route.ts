import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashPassword } from "@/lib/auth/password";
import { getPrismaClient } from "@/lib/db";
import { findLocalUser, saveLocalUser } from "@/lib/auth/local-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Rate limit: 3 req/min per IP
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const rl = checkRateLimit(`register:${ip}`, { intervalMs: 60_000, maxRequests: 3 });
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // 2. Parse and validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { fullName, username, email, phone, password, honeypot } = parsed.data;

  // 3. Honeypot check — silently succeed
  if (honeypot && honeypot.length > 0) {
    return NextResponse.json({ success: true, message: "Account created. You can now log in." }, { status: 200 });
  }

  try {
    const prisma = getPrismaClient();

    if (!prisma) {
      // Local fallback mode
      const existingByEmail = findLocalUser(email);
      if (existingByEmail) {
        return NextResponse.json(
          {
            success: false,
            message: "An account with this email address already exists. Please sign in or use a different email.",
          },
          { status: 409 }
        );
      }

      const existingByUsername = findLocalUser(username);
      if (existingByUsername) {
        return NextResponse.json(
          {
            success: false,
            message: "This username is already taken. Please choose a different username.",
          },
          { status: 409 }
        );
      }

      const passwordHash = await hashPassword(password);
      saveLocalUser({
        fullName,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        passwordHash,
        role: "USER",
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
        accountStatus: "ACTIVE",
        phone: phone ?? null,
      });

      return NextResponse.json(
        { success: true, message: "Account created successfully. You can now log in!" },
        { status: 201 }
      );
    }

    // 6. Check for duplicate email
    const existingEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    // 7. Check for duplicate username
    const existingUsername = await prisma.user.findUnique({ where: { username: username.toLowerCase() } });

    // Return generic error for BOTH duplicates — never reveal which field is taken
    if (existingEmail || existingUsername) {
      return NextResponse.json(
        { success: false, message: "Registration failed. Please check your details." },
        { status: 409 }
      );
    }

    // 8. Hash password
    const passwordHash = await hashPassword(password);

    // 9. Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        passwordHash,
        role: "USER",
        accountStatus: "ACTIVE",
      },
    });

    // 10. Generate verification token
    const token = crypto.randomUUID();

    // 11. Create VerificationToken record
    await prisma.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        used: false,
      },
    });

    return NextResponse.json(
      { success: true, message: "Account created. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Registration failed. Please try again later." },
      { status: 500 }
    );
  }
}
