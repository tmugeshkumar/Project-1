"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = (await res.json()) as { message?: string; redirectTo?: string };

      if (!res.ok) {
        setError(data.message ?? "Login failed. Please try again.");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect") ?? data.redirectTo ?? "/";
      window.location.href = redirectTo;
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
        <h1 className="text-2xl font-bold text-white">{siteConfig.name}</h1>
        <p className="text-gray-400 mt-1 text-sm">Sign in to your account</p>
      </div>

      {/* Success messages from redirects */}
      {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("registered") === "1" && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          Account created! Please sign in.
        </div>
      )}
      {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("reset") === "1" && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          Password reset successfully. Please sign in with your new password.
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Identifier */}
        <div>
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Email or Username
          </label>
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700",
              "text-white placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
              "transition-colors"
            )}
            placeholder="you@example.com or username"
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm bg-gray-800 border border-gray-700",
                "text-white placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
                "transition-colors"
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
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
          disabled={isLoading}
        >
          Sign In
        </Button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
