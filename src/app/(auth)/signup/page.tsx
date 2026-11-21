"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function StrengthBar({ score }: { score: number }) {
  const colors = [
    "",
    "bg-red-500",
    "bg-red-400",
    "bg-yellow-500",
    "bg-green-400",
    "bg-green-500",
  ];
  const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              score >= i ? colors[score] : "bg-gray-700"
            )}
          />
        ))}
      </div>
      {score > 0 && (
        <p
          className={cn(
            "text-xs",
            score <= 2
              ? "text-red-400"
              : score === 3
                ? "text-yellow-400"
                : "text-green-400"
          )}
        >
          {labels[score]}
        </p>
      )}
    </div>
  );
}

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submissionTimestamp, setSubmissionTimestamp] = useState(0);

  useEffect(() => {
    setSubmissionTimestamp(Date.now());
  }, []);

  const passwordScore = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !fullName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setError(
        "Password must contain at least one uppercase, lowercase, number, and special character."
      );
      return;
    }

    const form = e.currentTarget;
    const honeypotEl = form.elements.namedItem("website") as HTMLInputElement | null;
    if (honeypotEl?.value) return; // Bot detected — silently ignore

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          username: username.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          agreeToTerms: agreed,
          submissionTimestamp,
        }),
      });

      const data = (await res.json()) as {
        message?: string;
        errors?: Record<string, string | string[]>;
      };

      if (!res.ok) {
        if (data.errors) {
          const firstVal = Object.values(data.errors)[0];
          const firstMsg = Array.isArray(firstVal) ? firstVal[0] : firstVal;
          setError(firstMsg ?? data.message ?? "Registration failed.");
        } else {
          setError(data.message ?? "Registration failed. Please try again.");
        }
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get("redirect");
      const target = redirectParam
        ? `/login?registered=1&redirect=${encodeURIComponent(redirectParam)}`
        : "/login?registered=1";
      window.location.href = target;
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-6 sm:p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md mx-auto mb-3">
          <span className="font-bold text-lg text-brand-400">
            {siteConfig.name.charAt(0)}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Join {siteConfig.name} to start your project discussion
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Honeypot */}
        <div aria-hidden="true" style={{ display: "none" }}>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-slate-300",
              "text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
            )}
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-slate-300 font-mono",
              "text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
            )}
            placeholder="johndoe"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-slate-500">
            3–30 chars, letters, numbers, underscores, hyphens
          </p>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-slate-300",
              "text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
            )}
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm bg-white border border-slate-300",
                "text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
              )}
              placeholder="••••••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password && <StrengthBar score={passwordScore} />}
          <p className="mt-1 text-xs text-slate-500">
            Min 8 chars with uppercase, lowercase, number, and special character (!@#$%^&*)
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={cn(
                "w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm bg-white border border-slate-300",
                "text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm",
                confirmPassword &&
                  confirmPassword !== password &&
                  "border-red-400"
              )}
              placeholder="••••••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
              aria-label={
                showConfirm ? "Hide confirm password" : "Show confirm password"
              }
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="mt-1 text-xs text-red-600">
              Passwords do not match
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 pt-2">
          <input
            id="agreed"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            disabled={isLoading}
          />
          <label
            htmlFor="agreed"
            className="text-xs text-slate-600 leading-snug"
          >
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2"
            >
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2"
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full justify-center shadow-md shadow-brand-500/20"
          disabled={isLoading}
        >
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href={typeof window !== "undefined" && new URLSearchParams(window.location.search).get("redirect") ? `/login?redirect=${encodeURIComponent(new URLSearchParams(window.location.search).get("redirect")!)}` : "/login"}
          className="text-brand-600 hover:text-brand-700 font-bold transition-colors ml-1"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}
