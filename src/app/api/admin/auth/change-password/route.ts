/**
 * Admin Change-Password via OTP
 *
 * POST /api/admin/auth/change-password  — step 1: request OTP
 * PUT  /api/admin/auth/change-password  — step 2: verify OTP + set new password
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth/session";
import { changePasswordWithOtpSchema } from "@/lib/validations/auth";
import { createOtp, verifyOtp, clearOtp } from "@/lib/auth/otp-store";
import { sendOtpSms } from "@/lib/sms/send-otp";
import { hashPassword } from "@/lib/auth/password";
import { getPrismaClient } from "@/lib/db";
import { getLocalUserById, updateLocalUser } from "@/lib/auth/local-store";

export const dynamic = "force-dynamic";

function maskPhone(phone: string): string {
  const clean = phone.trim();
  if (clean.length <= 4) return clean;
  const last4 = clean.slice(-4);
  const prefix = clean.startsWith("+") ? clean.slice(0, 3) : "";
  return `${prefix} ******${last4}`;
}

// ── Step 1: Request OTP ───────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Admin authentication required." }, { status: 401 });
  }

  let body: { phone?: string } = {};
  try {
    body = await req.json();
  } catch {
    // optional body
  }

  const adminId = session.adminId;
  const admin = getLocalUserById(adminId);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Admin account not found." }, { status: 404 });
  }

  let targetPhone = admin.phone;
  if (!targetPhone || targetPhone.trim().length === 0) {
    if (!body.phone || body.phone.trim().length < 7) {
      return NextResponse.json(
        {
          success: false,
          needsPhone: true,
          message: "Please enter your mobile number to register it with your administrator account.",
        },
        { status: 400 }
      );
    }
    targetPhone = body.phone.trim();
    updateLocalUser(adminId, { phone: targetPhone });
  }

  const otp = createOtp(adminId, targetPhone);
  const result = await sendOtpSms(targetPhone, otp);

  if (!result.sent) {
    return NextResponse.json({ success: false, message: result.error ?? "Failed to send OTP." }, { status: 500 });
  }

  return NextResponse.json(
    {
      success: true,
      message: `OTP sent to your registered mobile number (${maskPhone(targetPhone)}).`,
      maskedPhone: maskPhone(targetPhone),
      ...(result.devOtp !== undefined && { devOtp: result.devOtp }),
    },
    { status: 200 }
  );
}

// ── Step 2: Verify OTP + Change Password ─────────────────────────────────────
export async function PUT(req: NextRequest): Promise<NextResponse> {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Admin authentication required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = changePasswordWithOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { otp, newPassword } = parsed.data;
  const adminId = session.adminId;

  if (!verifyOtp(adminId, otp)) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired OTP. Please request a new one." },
      { status: 400 }
    );
  }

  const newHash = await hashPassword(newPassword);

  const prisma = getPrismaClient();
  if (!prisma) {
    const updated = updateLocalUser(adminId, { passwordHash: newHash });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Admin account not found." }, { status: 404 });
    }
    clearOtp(adminId);
    return NextResponse.json({ success: true, message: "Password changed successfully." }, { status: 200 });
  }

  try {
    await prisma.user.update({ where: { id: adminId }, data: { passwordHash: newHash } });
    clearOtp(adminId);
    return NextResponse.json({ success: true, message: "Password changed successfully." }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update password." }, { status: 500 });
  }
}
