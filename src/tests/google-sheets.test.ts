import { describe, it, expect } from "vitest";
import { appendInquiryToGoogleSheet, TARGET_GOOGLE_SHEET_ID } from "../lib/google-sheets";

describe("Google Sheets Integration Service", () => {
  it("targets the specific user Google Spreadsheet ID", () => {
    expect(TARGET_GOOGLE_SHEET_ID).toBe("1KCeS_yqhSyIPqOwlQA3tpoa8F49cE0WAmHaC_W9BnhY");
  });

  it("handles unconfigured webhook gracefully with formatted diagnostics", async () => {
    const payload = {
      inquiryId: "test-inquiry-100",
      fullName: "Alex Miller",
      email: "alex@miller.tech",
      companyName: "Miller Digital",
      projectType: "custom_software",
      budgetRange: "25k_50k",
      projectDescription: "Need custom PostgreSQL workflow platform synced to Google Sheets.",
      ipAddress: "127.0.0.1",
      submittedAt: new Date().toISOString(),
    };

    const result = await appendInquiryToGoogleSheet(payload);
    expect(result.success).toBe(true);
    expect(result.message).toContain("GOOGLE_SHEET_WEBHOOK_URL");
  });
});
