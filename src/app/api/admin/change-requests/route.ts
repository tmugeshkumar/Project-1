import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/guards";
import { getAllChangeRequests } from "@/lib/auth/change-requests";
import type { AdminSessionPayload } from "@/types/auth";

export const dynamic = "force-dynamic";

export const GET = withAdminAuth(
  async (_req: NextRequest, { session }: { params: Record<string, string>; session: AdminSessionPayload }) => {
    void session;
    const requests = getAllChangeRequests();
    return NextResponse.json({ success: true, data: requests }, { status: 200 });
  }
);
