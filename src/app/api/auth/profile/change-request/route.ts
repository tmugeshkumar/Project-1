import { NextRequest, NextResponse } from "next/server";
import { getUserSessionFromRequest } from "@/lib/auth/session";
import {
  getUserChangeRequests,
  createChangeRequest,
} from "@/lib/auth/change-requests";
import { phoneSchema } from "@/lib/validations/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const changeRequestSchema = z.object({
  requestedPhone: phoneSchema,
  requestedEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  reason: z.string().min(5, "Please provide a reason for the change (at least 5 characters)").max(500),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getUserSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  }

  const requests = getUserChangeRequests(session.userId);
  return NextResponse.json({ success: true, data: requests }, { status: 200 });
}

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

  const parsed = changeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { requestedPhone, requestedEmail, reason } = parsed.data;

  if (!requestedPhone && !requestedEmail) {
    return NextResponse.json(
      { success: false, message: "Please specify a new phone number or email address." },
      { status: 400 }
    );
  }

  const newRequest = createChangeRequest({
    userId: session.userId,
    requestedPhone: requestedPhone || null,
    requestedEmail: requestedEmail || null,
    reason,
  });

  return NextResponse.json(
    {
      success: true,
      message:
        "Change request submitted to the administrator. Your mobile number / email will be updated once approved.",
      data: newRequest,
    },
    { status: 201 }
  );
}
