import { NextRequest, NextResponse } from "next/server";
import { clearUserSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json(
    { success: true, message: "Signed out successfully." },
    { status: 200 }
  );
  return clearUserSession(response);
}
