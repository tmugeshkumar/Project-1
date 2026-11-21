"use client";

import { useState, type FormEvent, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function LoginFormContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const initialTab = searchParams.get("tab") === "admin" ? "admin" : "user";

  // Tab state: "user" is the default, ensuring User Login always shows first
  const [activeTab, setActiveTab] = useState<"user" | "admin">(initialTab);

  // User form states
  const [userIdentifier, setUserIdentifier] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showUserPassword, setShowUserPassword] = useState(false);

  // Admin form states
  const [adminIdentifier, setAdminIdentifier] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const registeredNotice = searchParams.get("registered") === "1";
  const resetNotice = searchParams.get("reset") === "1" || searchParams.get("reset") === "success";

  // Handle User Login
  const handleUserSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!userIdentifier.trim() || !userPassword) {
      setError("Please fill in both your email/username and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: userIdentifier.trim(), password: userPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid credentials. Please try again.");
        return;
      }

      // Successful user login
      const target = redirectUrl && redirectUrl !== "/login" ? redirectUrl : "/";
      window.location.href = target;
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Admin Login
  const handleAdminSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!adminIdentifier.trim() || !adminPassword) {
      setError("Please provide your admin username/email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: adminIdentifier.trim(), password: adminPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid administrator credentials.");
        return;
      }

      // Successful admin login: redirect to requested page or admin dashboard
      const target =
        redirectUrl && redirectUrl !== "/login" && !redirectUrl.startsWith("/admin/login")
          ? redirectUrl
          : "/admin/dashboard";

      window.location.href = target;
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-2xl shadow-2xl p-6 sm:p-8">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-block group focus:outline-none">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 mb-3 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl">
              {siteConfig.name.charAt(0)}
            </span>
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">{siteConfig.name}</h1>
        <p className="text-surface-400 mt-1 text-xs sm:text-sm">
          {redirectUrl ? "Authentication required to proceed" : "Welcome back. Please sign in."}
        </p>
      </div>

      {/* Redirect Alert Notice if attempting to access protected action */}
      {redirectUrl && (
        <div className="mb-6 p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-start gap-3">
          <Lock className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
          <p className="text-xs text-brand-300 leading-relaxed">
            Please sign in with your user account or administrator credentials to access{" "}
            <span className="font-semibold text-white">
              {redirectUrl === "/contact" ? "Discuss Your Project / Contact Us" : redirectUrl}
            </span>
            .
          </p>
        </div>
      )}

      {/* Success Notices */}
      {registeredNotice && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          Account created successfully! You can now sign in with your credentials.
        </div>
      )}
      {resetNotice && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          Password has been reset. Please sign in with your new password.
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="flex-1">{error}</p>
        </div>
      )}

      {/* Tab Switcher: User Login vs Admin Login */}
      <div className="grid grid-cols-2 p-1 bg-surface-950 border border-surface-800 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab("user");
            setError("");
          }}
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all",
            activeTab === "user"
              ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
              : "text-surface-400 hover:text-white"
          )}
        >
          <User className="w-4 h-4" />
          <span>User Login</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("admin");
            setError("");
          }}
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all",
            activeTab === "admin"
              ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
              : "text-surface-400 hover:text-white"
          )}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Login</span>
        </button>
      </div>

      {/* TAB 1: USER LOGIN (ALWAYS SHOWS FIRST BY DEFAULT) */}
      {activeTab === "user" && (
        <form onSubmit={handleUserSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="user-identifier"
              className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1.5"
            >
              Email Address or Username
            </label>
            <input
              id="user-identifier"
              type="text"
              autoComplete="username"
              required
              value={userIdentifier}
              onChange={(e) => setUserIdentifier(e.target.value)}
              className={cn(
                "w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-800 border border-surface-700",
                "text-white placeholder-surface-500",
                "focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500",
                "transition-colors"
              )}
              placeholder="name@company.com or username"
              disabled={isLoading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="user-password"
                className="block text-xs font-semibold uppercase tracking-wider text-surface-400"
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
                id="user-password"
                type={showUserPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className={cn(
                  "w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm bg-surface-800 border border-surface-700",
                  "text-white placeholder-surface-500",
                  "focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500",
                  "transition-colors"
                )}
                placeholder="••••••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowUserPassword(!showUserPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-200 transition-colors"
                tabIndex={-1}
                aria-label={showUserPassword ? "Hide password" : "Show password"}
              >
                {showUserPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In to Your Account"}
          </Button>

          {/* Sign Up Alternative */}
          <div className="pt-4 mt-4 border-t border-surface-800 text-center">
            <p className="text-xs text-surface-400">
              Don&apos;t have an account yet?{" "}
              <Link
                href={redirectUrl ? `/signup?redirect=${encodeURIComponent(redirectUrl)}` : "/signup"}
                className="text-brand-400 hover:text-brand-300 font-semibold transition-colors inline-flex items-center gap-1"
              >
                Sign up here <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </form>
      )}

      {/* TAB 2: ADMIN LOGIN */}
      {activeTab === "admin" && (
        <form onSubmit={handleAdminSubmit} noValidate className="space-y-4">
          <div className="p-3 rounded-lg bg-surface-950 border border-surface-800 text-[11px] text-surface-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
            <span>Administrative console credentials required.</span>
          </div>

          <div>
            <label
              htmlFor="admin-identifier"
              className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1.5"
            >
              Admin Username or Email
            </label>
            <input
              id="admin-identifier"
              type="text"
              autoComplete="username"
              required
              value={adminIdentifier}
              onChange={(e) => setAdminIdentifier(e.target.value)}
              className={cn(
                "w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-800 border border-surface-700",
                "text-white placeholder-surface-500 font-mono",
                "focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500",
                "transition-colors"
              )}
              placeholder="admin@company.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1.5"
            >
              Admin Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showAdminPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className={cn(
                  "w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm bg-surface-800 border border-surface-700",
                  "text-white placeholder-surface-500",
                  "focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500",
                  "transition-colors"
                )}
                placeholder="••••••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-200 transition-colors"
                tabIndex={-1}
                aria-label={showAdminPassword ? "Hide password" : "Show password"}
              >
                {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2 inline-flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <Lock className="w-4 h-4" />
            {isLoading ? "Authenticating Admin..." : "Sign In as Administrator"}
          </Button>

          <div className="pt-4 mt-4 border-t border-surface-800 text-center">
            <span className="text-xs text-surface-500">
              Admin sessions are logged for audit compliance.
            </span>
          </div>
        </form>
      )}

      {/* Return to website link */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs text-surface-500 hover:text-surface-300 transition-colors"
        >
          ← Return to Public Website
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface-900 border border-surface-800 rounded-2xl p-8 text-center text-surface-400">
          Loading authentication portal...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
