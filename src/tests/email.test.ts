import { describe, it, expect } from "vitest";
import { sendInquiryNotification } from "../lib/email";

describe("Transactional Email Service", () => {
  it("gracefully dispatches via development logger when external credentials are unset", async () => {
    const sampleInquiry = {
      fullName: "Marcus Test",
      email: "marcus@testcompany.org",
      companyName: "Test Logistics",
      projectType: "custom_software" as const,
      budgetRange: "10k_25k" as const,
      projectDescription: "Testing the transactional email dispatch notification pipeline.",
    };

    const result = await sendInquiryNotification(sampleInquiry, "test-inquiry-12345");
    expect(result.sent).toBe(true);
    expect(result.provider).toBe("development_logger");
    expect(result.messageId).toBeDefined();
  });
});
