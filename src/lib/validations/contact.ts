import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(100, { message: "Name must not exceed 100 characters." }),
  email: z
    .string()
    .trim()
    .email({ message: "Please provide a valid business or personal email address." })
    .max(255, { message: "Email must not exceed 255 characters." }),
  companyName: z
    .string()
    .trim()
    .max(120, { message: "Company name must not exceed 120 characters." })
    .optional()
    .or(z.literal("")),
  projectType: z.enum(
    [
      "custom_software",
      "product_licensing",
      "automation",
      "modernization",
      "consulting",
      "other",
    ],
    {
      errorMap: () => ({ message: "Please select an appropriate project type." }),
    }
  ),
  budgetRange: z
    .enum(["under_10k", "10k_25k", "25k_50k", "50k_plus", "undecided"])
    .optional(),
  projectDescription: z
    .string()
    .trim()
    .min(15, { message: "Please provide at least 15 characters describing your project or goals." })
    .max(3000, { message: "Description must not exceed 3,000 characters." }),
  honeypot: z.string().optional(),
  submissionTimestamp: z.number().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
