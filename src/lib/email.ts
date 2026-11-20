import { siteConfig } from "@/config/site";
import { ContactFormInput } from "@/lib/validations/contact";

export interface EmailDispatchResult {
  sent: boolean;
  provider: "smtp" | "resend" | "development_logger";
  recipient: string;
  messageId?: string;
  error?: string;
}

/**
 * Dispatches transactional notifications for incoming client inquiries.
 * Supports configurable transactional providers via environment variables.
 * In development or when credentials are unconfigured, safely falls back to structured logging.
 */
export async function sendInquiryNotification(
  inquiry: ContactFormInput,
  inquiryId: string
): Promise<EmailDispatchResult> {
  const recipient = process.env.CONTACT_RECEIVER_EMAIL || siteConfig.contact.inquiriesEmail;
  const siteName = siteConfig.name;

  const emailSubject = `[New Project Inquiry] ${inquiry.fullName} - ${inquiry.projectType}`;
  const emailText = `
New Project Inquiry Received for ${siteName}
---------------------------------------------
Inquiry Reference ID: ${inquiryId}
Full Name: ${inquiry.fullName}
Email: ${inquiry.email}
Company: ${inquiry.companyName || "Not provided"}
Project Type: ${inquiry.projectType}
Budget Range: ${inquiry.budgetRange || "Not specified"}

Project Description:
${inquiry.projectDescription}

Submitted At: ${new Date().toISOString()}
  `.trim();

  // If RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || `notifications@${new URL(siteConfig.url).hostname || "example.com"}`,
          to: [recipient],
          reply_to: inquiry.email,
          subject: emailSubject,
          text: emailText,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Email Notification Failed via Resend]:", errorText);
        return {
          sent: false,
          provider: "resend",
          recipient,
          error: errorText,
        };
      }

      const data = await response.json() as { id?: string };
      console.info(`[Email Dispatched via Resend] ID: ${data.id} to ${recipient}`);
      return {
        sent: true,
        provider: "resend",
        recipient,
        messageId: data.id,
      };
    } catch (err) {
      console.error("[Email Network Error]:", err);
      return {
        sent: false,
        provider: "resend",
        recipient,
        error: String(err),
      };
    }
  }

  // Graceful fallback for local development and initial staging
  console.info(
    `\n================= [TRANSACTIONAL EMAIL DISPATCH LOG] =================\n` +
    `Recipient: ${recipient}\n` +
    `Subject: ${emailSubject}\n` +
    `Body:\n${emailText}\n` +
    `=======================================================================\n`
  );

  return {
    sent: true,
    provider: "development_logger",
    recipient,
    messageId: `mock-${Date.now()}`,
  };
}
