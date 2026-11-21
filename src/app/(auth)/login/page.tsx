"use client";

import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [redirectUrl, setRedirectUrl] = useState("");
  const [registeredNotice, setRegisteredNotice] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  // Tab state: "user" is the default, ensuring User Login always shows first
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user");

  // Read URL parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "";
      const tab = params.get("tab");
      const registered = params.get("registered") === "1";
      const reset = params.get("reset") === "1" || params.get("reset") === "success";

      if (redirect) setRedirectUrl(redirect);
      if (tab === "admin") setActiveTab("admin");
      if (registered) setRegisteredNotice(true);
      if (reset) setResetNotice(true);
    }
  }, []);

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
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-6 sm:p-10">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block group focus:outline-none">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md mx-auto mb-3 group-hover:bg-brand-600 transition-colors">
            <Code2 className="w-6 h-6 text-brand-400 group-hover:text-white transition-colors" />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {siteConfig.name}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          {redirectUrl ? "Please sign in to continue with your project inquiry" : "Sign in to access your digital products & services"}
        </p>
      </div>

      {/* Redirect Alert Notice if attempting to access protected action */}
      {redirectUrl && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-3">
          <Lock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <div className="text-xs text-brand-900 leading-relaxed">
            <span className="font-semibold block text-sm text-brand-950 mb-0.5">Authentication Required</span>
            Please sign in with your user account or administrator credentials to access{" "}
            <span className="font-semibold text-brand-700">
              {redirectUrl === "/contact" ? "Discuss Your Project / Contact Us" : redirectUrl}
            </span>
            .
          </div>
        </div>
      )}

      {/* Success Notices */}
      {registeredNotice && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Account created successfully! Please sign in with your credentials.</span>
        </div>
      )}
      {resetNotice && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Password reset successfully. Please sign in with your new password.</span>
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="flex-1">{error}</p>
        </div>
      )}

      {/* Tab Switcher: User Login vs Admin Login */}
      <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 border border-slate-200 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab("user");
            setError("");
          }}
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all",
            activeTab === "user"
              ? "bg-white text-brand-700 shadow-sm border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <User className="w-4 h-4 text-brand-600" />
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
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <ShieldCheck className="w-4 h-4 text-brand-400" />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* TAB 1: USER LOGIN (ALWAYS SHOWS FIRST BY DEFAULT) */}
      {activeTab === "user" && (
        <form onSubmit={handleUserSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="user-identifier"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
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
                "w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-slate-300",
                "text-slate-900 placeholder-slate-400",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
                "transition-colors shadow-sm"
              )}
              placeholder="you@example.com or username"
              disabled={isLoading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="user-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
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
                  "w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm bg-white border border-slate-300",
                  "text-slate-900 placeholder-slate-400",
                  "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
                  "transition-colors shadow-sm"
                )}
                placeholder="••••••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowUserPassword(!showUserPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
            className="w-full mt-2 justify-center shadow-md shadow-brand-500/20"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In to Your Account"}
          </Button>

          {/* Sign Up Alternative */}
          <div className="pt-5 mt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Don&apos;t have an account yet?{" "}
              <Link
                href={redirectUrl ? `/signup?redirect=${encodeURIComponent(redirectUrl)}` : "/signup"}
                className="text-brand-600 hover:text-brand-700 font-bold transition-colors inline-flex items-center gap-1 ml-1"
              >
                Sign up here <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </form>
      )}

      {/* TAB 2: ADMIN LOGIN */}
      {activeTab === "admin" && (
        <form onSubmit={handleAdminSubmit} noValidate className="space-y-4">
          <div className="p-3 rounded-lg bg-slate-900 text-slate-300 text-xs flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
            <span>Administrative console credentials required.</span>
          </div>

          <div>
            <label
              htmlFor="admin-identifier"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
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
                "w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-slate-300 font-mono",
                "text-slate-900 placeholder-slate-400",
                "focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900",
                "transition-colors shadow-sm"
              )}
              placeholder="admin@company.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
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
                  "w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm bg-white border border-slate-300",
                  "text-slate-900 placeholder-slate-400",
                  "focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900",
                  "transition-colors shadow-sm"
                )}
                placeholder="••••••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
            className="w-full mt-2 justify-center bg-slate-900 hover:bg-slate-800 text-white shadow-md inline-flex items-center gap-2"
            disabled={isLoading}
          >
            <Lock className="w-4 h-4" />
            {isLoading ? "Authenticating Admin..." : "Sign In as Administrator"}
          </Button>

          <div className="pt-4 mt-4 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">
              Administrative sessions are strictly recorded in the audit log.
            </span>
          </div>
        </form>
      )}

      {/* Return to website link */}
      <div className="mt-8 pt-4 border-t border-slate-100 text-center">
        <Link
          href="/"
          className="text-xs text-slate-500 hover:text-brand-600 transition-colors font-medium"
        >
          ← Return to Public Website
        </Link>
      </div>
    </div>
  );
}
