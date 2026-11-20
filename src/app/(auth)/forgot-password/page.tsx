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
    <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
        <p className="text-gray-400 mt-2 text-sm">
          Enter your email address and we&apos;ll send you a reset link.
        </p>
      </div>

      {submitted ? (
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 mb-2">
            <svg
              className="w-7 h-7 text-green-400"
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
          <p className="text-white font-medium">Check your inbox</p>
          <p className="text-gray-400 text-sm">
            If an account exists for{" "}
            <span className="text-gray-200">{email}</span>, you will receive a
            password reset link shortly.
          </p>
          <Link
            href="/login"
            className="inline-block mt-4 text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            ← Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
            disabled={isLoading || !email.trim()}
          >
            Send Reset Link
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
