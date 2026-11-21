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

    const form = e.currentTarget;
    const honeypotEl = form.elements.namedItem("website") as HTMLInputElement | null;
    if (honeypotEl?.value) return; // Bot detected — silently ignore

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          username,
          email,
          password,
          confirmPassword,
          submissionTimestamp,
        }),
      });

      const data = (await res.json()) as {
        message?: string;
        errors?: Record<string, string>;
      };

      if (!res.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          setError(firstError ?? data.message ?? "Registration failed.");
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
    <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 mb-4">
          <span className="text-white font-bold text-lg">
            {siteConfig.name.charAt(0)}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Join {siteConfig.name} today
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
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
            className="block text-sm font-medium text-gray-300 mb-1.5"
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
              "w-full px-3.5 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700",
              "text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            )}
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-300 mb-1.5"
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
              "w-full px-3.5 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700",
              "text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            )}
            placeholder="johndoe"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            3–30 chars, letters, numbers, underscores, hyphens
          </p>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1.5"
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
              "w-full px-3.5 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700",
              "text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            )}
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-1.5"
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
                "w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm bg-gray-800 border border-gray-700",
                "text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              )}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password && <StrengthBar score={passwordScore} />}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-300 mb-1.5"
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
                "w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm bg-gray-800 border border-gray-700",
                "text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors",
                confirmPassword &&
                  confirmPassword !== password &&
                  "border-red-500/60"
              )}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              tabIndex={-1}
              aria-label={
                showConfirm ? "Hide confirm password" : "Show confirm password"
              }
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="mt-1 text-xs text-red-400">
              Passwords do not match
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3">
          <input
            id="agreed"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-800 text-brand-600 focus:ring-brand-500 focus:ring-offset-gray-900"
            disabled={isLoading}
          />
          <label
            htmlFor="agreed"
            className="text-sm text-gray-400 leading-snug"
          >
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-brand-400 hover:text-brand-300 transition-colors"
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
          className="w-full"
          disabled={isLoading}
        >
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href={typeof window !== "undefined" && new URLSearchParams(window.location.search).get("redirect") ? `/login?redirect=${encodeURIComponent(new URLSearchParams(window.location.search).get("redirect")!)}` : "/login"}
          className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
