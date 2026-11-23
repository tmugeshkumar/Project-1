import { NextRequest, NextResponse } from "next/server";
import { findLocalUser, updateLocalUser } from "@/lib/auth/local-store";
import { createOtp, verifyOtp, clearOtp } from "@/lib/auth/otp-store";
import { sendOtpSms } from "@/lib/sms/send-otp";
import { hashPassword } from "@/lib/auth/password";
import { passwordSchema } from "@/lib/auth/password";
import { getPrismaClient } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

function maskPhone(phone: string): string {
  const clean = phone.trim();
  if (clean.length <= 4) return clean;
  const last4 = clean.slice(-4);
  const prefix = clean.startsWith("+") ? clean.slice(0, 3) : "";
  return `${prefix} ******${last4}`;
}

const requestOtpSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
});

const resetPasswordOtpSchema = z
  .object({
    identifier: z.string().min(1, "Username or email is required"),
    otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d{6}$/, "OTP must be numeric"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Step 1: Request OTP to registered mobile number ─────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = requestOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please provide your username or email." },
      { status: 422 }
    );
  }

  const { identifier } = parsed.data;
  const user = findLocalUser(identifier);

  if (!user) {
    // Avoid user enumeration by giving standard message or clear guidance
    return NextResponse.json(
      { success: false, message: "No account found matching this username or email." },
      { status: 404 }
    );
  }

  if (!user.phone || user.phone.trim().length === 0) {
    return NextResponse.json(
      {
        success: false,
        noPhoneRegistered: true,
        message:
          "No mobile number is registered for this account. Please sign in to add your mobile number, or contact your administrator.",
      },
      { status: 400 }
    );
  }

  const otp = createOtp(user.id, user.phone);
  const result = await sendOtpSms(user.phone, otp);

  if (!result.sent) {
    return NextResponse.json({ success: false, message: result.error ?? "Failed to send OTP." }, { status: 500 });
  }

  return NextResponse.json(
    {
      success: true,
      message: `OTP sent to your registered mobile number (${maskPhone(user.phone)}).`,
      maskedPhone: maskPhone(user.phone),
      ...(result.devOtp !== undefined && { devOtp: result.devOtp }),
    },
    { status: 200 }
  );
}

// ── Step 2: Verify OTP and reset password ───────────────────────────────────
export async function PUT(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = resetPasswordOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { identifier, otp, newPassword } = parsed.data;
  const user = findLocalUser(identifier);

  if (!user) {
    return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
  }

  if (!verifyOtp(user.id, otp)) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired OTP. Please request a new one." },
      { status: 400 }
    );
  }

  const newHash = await hashPassword(newPassword);

  const prisma = getPrismaClient();
  if (!prisma) {
    updateLocalUser(user.id, { passwordHash: newHash });
    clearOtp(user.id);
    return NextResponse.json(
      { success: true, message: "Password changed successfully! You can now sign in." },
      { status: 200 }
    );
  }

  try {
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
    clearOtp(user.id);
    return NextResponse.json(
      { success: true, message: "Password changed successfully! You can now sign in." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update password." }, { status: 500 });
  }
}
