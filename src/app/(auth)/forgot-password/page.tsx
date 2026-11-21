"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Intentionally ignore errors — always show success message
    } finally {
      setIsLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-6 sm:p-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reset Your Password</h1>
        <p className="text-slate-500 mt-2 text-sm">
          Enter your registered email address and we&apos;ll send you a recovery link.
        </p>
      </div>

      {submitted ? (
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 mb-2">
            <svg
              className="w-7 h-7 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-slate-900 font-semibold">Check your inbox</p>
          <p className="text-slate-500 text-sm">
            If an account exists for{" "}
            <span className="text-slate-900 font-medium">{email}</span>, you will receive a
            password reset link shortly.
          </p>
          <Link
            href="/login"
            className="inline-block mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            ← Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center shadow-md shadow-brand-500/20"
            disabled={isLoading || !email.trim()}
          >
            Send Reset Link
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
