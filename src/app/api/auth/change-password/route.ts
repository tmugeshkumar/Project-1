/**
 * User Change-Password via OTP
 *
 * POST /api/auth/change-password  — step 1: request OTP (send to phone)
 * PUT  /api/auth/change-password  — step 2: verify OTP + set new password
 */

import { NextRequest, NextResponse } from "next/server";
import { getUserSessionFromRequest } from "@/lib/auth/session";
import { requestOtpSchema, changePasswordWithOtpSchema } from "@/lib/validations/auth";
import { createOtp, verifyOtp, clearOtp } from "@/lib/auth/otp-store";
import { sendOtpSms } from "@/lib/sms/send-otp";
import { hashPassword } from "@/lib/auth/password";
import { getPrismaClient } from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// ── Step 1: Request OTP ───────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getUserSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = requestOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please enter a valid phone number.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { phone } = parsed.data;
  const userId = session.userId;

  // Generate OTP and send SMS
  const otp = createOtp(userId, phone);
  const result = await sendOtpSms(phone, otp);

  if (!result.sent) {
    return NextResponse.json({ success: false, message: result.error ?? "Failed to send OTP." }, { status: 500 });
  }

  // Persist phone to local store if not already set
  const prisma = getPrismaClient();
  if (!prisma) {
    const DATA_FILE = path.join(process.cwd(), ".data", "users.json");
    try {
      const users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Array<Record<string, unknown>>;
      const idx = users.findIndex((u) => u.id === userId);
      if (idx !== -1 && !users[idx].phone) {
        users[idx].phone = phone;
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
      }
    } catch { /* non-fatal */ }
  }

  return NextResponse.json(
    {
      success: true,
      message: "OTP sent to your phone number.",
      // In dev mode (no SMS provider), return OTP in response for testing
      ...(result.devOtp !== undefined && { devOtp: result.devOtp }),
    },
    { status: 200 }
  );
}

// ── Step 2: Verify OTP + Change Password ─────────────────────────────────────
export async function PUT(req: NextRequest): Promise<NextResponse> {
  const session = await getUserSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
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
  const userId = session.userId;

  // Verify OTP
  if (!verifyOtp(userId, otp)) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired OTP. Please request a new one." },
      { status: 400 }
    );
  }

  const newHash = await hashPassword(newPassword);

  const prisma = getPrismaClient();
  if (!prisma) {
    // Local store path
    const DATA_FILE = path.join(process.cwd(), ".data", "users.json");
    try {
      const users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Array<Record<string, unknown>>;
      const idx = users.findIndex((u) => u.id === userId);
      if (idx === -1) {
        return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
      }
      users[idx].passwordHash = newHash;
      users[idx].updatedAt = new Date().toISOString();
      fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
      clearOtp(userId);
      return NextResponse.json({ success: true, message: "Password changed successfully." }, { status: 200 });
    } catch {
      return NextResponse.json({ success: false, message: "Failed to update password." }, { status: 500 });
    }
  }

  // Prisma path
  try {
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });
    clearOtp(userId);
    return NextResponse.json({ success: true, message: "Password changed successfully." }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update password." }, { status: 500 });
  }
}
