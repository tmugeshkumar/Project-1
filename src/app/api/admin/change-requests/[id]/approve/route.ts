import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/guards";
import { approveChangeRequest } from "@/lib/auth/change-requests";
import type { AdminSessionPayload } from "@/types/auth";

export const dynamic = "force-dynamic";

export const POST = withAdminAuth(
  async (
    _req: NextRequest,
    { params, session }: { params: { id: string }; session: AdminSessionPayload }
  ) => {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, message: "Request ID is required." }, { status: 400 });
    }

    const res = approveChangeRequest(id, session.adminId);
    if (!res.success) {
      return NextResponse.json({ success: false, message: res.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: res.message, data: res.request }, { status: 200 });
  }
);
