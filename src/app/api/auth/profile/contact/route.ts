import { NextRequest, NextResponse } from "next/server";
import { getUserSessionFromRequest } from "@/lib/auth/session";
import { getLocalUserById, updateLocalUser } from "@/lib/auth/local-store";
import { phoneSchema } from "@/lib/validations/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const contactUpdateSchema = z.object({
  phone: phoneSchema,
  email: z.string().email("Invalid email address").optional(),
});

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

  const parsed = contactUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { phone, email } = parsed.data;
  const user = getLocalUserById(session.userId);
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
  }

  const updates: Record<string, string> = {};

  // Rule: If phone is ALREADY set, the user CANNOT change it directly!
  if (phone) {
    if (user.phone && user.phone.trim().length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Mobile number is already registered and locked for security. You must submit a change request to the administrator.",
        },
        { status: 403 }
      );
    }
    updates.phone = phone.trim();
  }

  // Rule: If email is ALREADY set, the user CANNOT change it directly!
  if (email) {
    if (user.email && user.email.trim().length > 0 && user.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email address is already registered and locked for security. You must submit a change request to the administrator.",
        },
        { status: 403 }
      );
    }
    updates.email = email.trim().toLowerCase();
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, message: "No changes provided." }, { status: 400 });
  }

  const updated = updateLocalUser(user.id, updates);
  return NextResponse.json(
    {
      success: true,
      message: "Contact information added successfully.",
      data: {
        phone: updated?.phone,
        email: updated?.email,
      },
    },
    { status: 200 }
  );
}
