/**
 * Zod validation schemas for authentication forms and API requests
 */

import { z } from "zod";
import { passwordSchema, usernameSchema } from "@/lib/auth/password";

export const phoneSchema = z
  .string()
  .min(7, "Phone number must be at least 7 digits")
  .max(15, "Phone number must not exceed 15 digits")
  .regex(/^\+?[0-9\s\-().]+$/, "Invalid phone number format")
  .optional();

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters")
      .regex(/^[a-zA-Z\s'.-]+$/, "Full name contains invalid characters"),
    username: usernameSchema,
    email: z.string().email("Please enter a valid email address"),
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the Terms and Privacy Policy",
    }),
    honeypot: z.string().optional(),
    submissionTimestamp: z.number().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or username is required")
    .max(255),
  password: z.string().min(1, "Password is required"),
  honeypot: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const adminLoginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"]),
  reason: z.string().max(500).optional(),
});

export const requestOtpSchema = z.object({
  phone: z.string().min(7).max(15).regex(/^\+?[0-9\s\-().]+$/, "Invalid phone number"),
});

export const changePasswordWithOtpSchema = z
  .object({
    otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d{6}$/, "OTP must be numeric"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type ChangePasswordWithOtpInput = z.infer<typeof changePasswordWithOtpSchema>;
