import { describe, it, expect } from "vitest";
import { contactFormSchema } from "../lib/validations/contact";

describe("Contact Form Zod Validation Schema", () => {
  it("passes validation with complete valid inputs", () => {
    const validData = {
      fullName: "Alexander Hamilton",
      email: "alexander@example.com",
      companyName: "Treasury Corp",
      projectType: "custom_software" as const,
      budgetRange: "25k_50k" as const,
      projectDescription: "We need a custom distributed ledger and reconciliation system built with Next.js and PostgreSQL.",
    };

    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("passes validation without optional companyName and budgetRange", () => {
    const minimalData = {
      fullName: "Jane Doe",
      email: "jane.doe@example.org",
      projectType: "automation" as const,
      projectDescription: "Looking to automate our daily inventory sync between warehouse databases and our storefront.",
    };

    const result = contactFormSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });

  it("fails validation when name is shorter than 2 characters", () => {
    const invalidData = {
      fullName: "J",
      email: "jane@example.com",
      projectType: "custom_software" as const,
      projectDescription: "Valid length project description here.",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.fullName).toBeDefined();
    }
  });

  it("fails validation when email format is invalid", () => {
    const invalidData = {
      fullName: "Jane Doe",
      email: "not-an-email",
      projectType: "custom_software" as const,
      projectDescription: "Valid length project description here.",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("fails validation when description is shorter than 15 characters", () => {
    const invalidData = {
      fullName: "Jane Doe",
      email: "jane@example.com",
      projectType: "custom_software" as const,
      projectDescription: "Too short",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.projectDescription).toBeDefined();
    }
  });

  it("fails validation with an unrecognized projectType enum value", () => {
    const invalidData = {
      fullName: "Jane Doe",
      email: "jane@example.com",
      projectType: "cryptocurrency_ico_scam",
      projectDescription: "Valid length project description here for testing.",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
