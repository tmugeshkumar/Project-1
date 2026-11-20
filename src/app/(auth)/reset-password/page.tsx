"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing password reset token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Reset token is missing. Please use the link provided in your reset email.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?reset=success");
      }, 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-surface-900 border border-surface-800 rounded-xl p-8 text-center shadow-xl">
        <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Password Reset Successful</h2>
        <p className="text-surface-400 text-sm mb-6">
          Your password has been securely updated. Redirecting you to sign in...
        </p>
        <Link href="/login">
          <Button variant="primary" className="w-full">
            Proceed to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-xl p-8 shadow-xl">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-full bg-brand-500/10 text-brand-400 mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Set New Password</h1>
        <p className="text-surface-400 text-sm mt-1">
          Choose a strong, unique password for your account.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition text-sm pr-10"
              placeholder="••••••••"
              disabled={loading || !token}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-200 transition"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-surface-500 mt-1">
            Must contain 8+ characters, uppercase, lowercase, number, and special character.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Confirm New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition text-sm"
            placeholder="••••••••"
            disabled={loading || !token}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={loading || !token}
        >
          {loading ? "Updating Password..." : "Update Password"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-surface-400 hover:text-brand-400 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-surface-400">Loading reset session...</div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
