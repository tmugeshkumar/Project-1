import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import { checkRateLimit } from "@/lib/rate-limit";
import { saveInquiry } from "@/lib/db";
import { sendInquiryNotification } from "@/lib/email";
import { appendInquiryToGoogleSheet } from "@/lib/google-sheets";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // 1. IP & Rate Limiting Check
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = checkRateLimit(`contact:${ip}`, {
      intervalMs: 60 * 1000, // 1 minute
      maxRequests: 5, // max 5 requests per minute per IP
    });

    if (!rateLimit.allowed) {
      console.warn(`[Security Alert] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please wait a minute before submitting again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString(),
          },
        }
      );
    }

    // 2. Parse & Validate Payload
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON payload provided.",
        },
        { status: 400 }
      );
    }

    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      const flattenedErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the errors in the form.",
          errors: flattenedErrors,
        },
        { status: 422 }
      );
    }

    const data = validationResult.data;

    // 3. Anti-Spam Honeypot Verification
    if (data.honeypot && data.honeypot.trim().length > 0) {
      console.info(`[Spam Blocked] Honeypot triggered by IP: ${ip}`);
      // Respond with 200 to trick spam bots into thinking submission succeeded
      return NextResponse.json({
        success: true,
        message: "Your inquiry has been successfully received.",
      });
    }

    // 4. Anti-Spam Submission Timing Verification
    // Forms submitted in less than 2 seconds are usually automated bots
    if (data.submissionTimestamp) {
      const elapsedMs = Date.now() - data.submissionTimestamp;
      if (elapsedMs < 1800) {
        console.warn(`[Spam Suspect] Rapid submission detected (${elapsedMs}ms) by IP: ${ip}`);
        return NextResponse.json({
          success: true,
          message: "Your inquiry has been successfully received.",
        });
      }
    }

    // 5. Database Persistence (PostgreSQL via Prisma ORM)
    const userAgent = req.headers.get("user-agent") || undefined;
    const inquiryRecord = await saveInquiry({
      fullName: data.fullName,
      email: data.email,
      companyName: data.companyName,
      projectType: data.projectType,
      budgetRange: data.budgetRange,
      projectDescription: data.projectDescription,
      ipAddress: ip,
      userAgent: userAgent ? userAgent.substring(0, 255) : undefined,
    });

    // 6. Transactional Email Notification Dispatch
    await sendInquiryNotification(data, inquiryRecord.id);

    // 7. Google Sheets Database Sync
    await appendInquiryToGoogleSheet({
      inquiryId: inquiryRecord.id,
      fullName: data.fullName,
      email: data.email,
      companyName: data.companyName,
      projectType: data.projectType,
      budgetRange: data.budgetRange,
      projectDescription: data.projectDescription,
      ipAddress: ip,
      submittedAt: new Date().toISOString(),
    });

    // 8. Structured Audit Log (without logging private PII passwords/secrets)
    console.info(
      `[Inquiry Processed] ID: ${inquiryRecord.id} | Type: ${data.projectType} | IP: ${ip}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out. We have received your inquiry and will respond within 24 hours.",
        data: {
          inquiryId: inquiryRecord.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Contact API Internal Error]:", error);
    // Never leak internal stack trace to visitors
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred while processing your inquiry. Please try again or contact us directly.",
      },
      { status: 500 }
    );
  }
}
