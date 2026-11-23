"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Lock, KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UserData {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  accountStatus: string;
  emailVerified: boolean;
  phone?: string | null;
}

type Step = "idle" | "sent" | "done";

function PasswordInput({
  id,
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-surface-200 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder ?? "••••••••••••"}
          className="w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm bg-surface-900 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-200"
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Change password state
  const [step, setStep] = useState<Step>("idle");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (!data.success) {
          router.push("/login");
          return;
        }
        setUser(data.data);
        if (data.data.phone) setPhone(data.data.phone);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleRequestOtp = async () => {
    setError("");
    setSuccess("");
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Failed to send OTP.");
        return;
      }
      setStep("sent");
      setSuccess("OTP sent to your phone number. It expires in 5 minutes.");
      if (data.devOtp) {
        setDevOtp(data.devOtp);
      }
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");
    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      setError("Password must contain uppercase, lowercase, number, and special character.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otp.trim(), newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Failed to change password.");
        return;
      }
      setStep("done");
      setSuccess("Password changed successfully! Please sign in again with your new password.");
      setDevOtp(null);
      // Auto sign out after 3s
      setTimeout(async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }, 3000);
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{user.fullName}</h1>
              <p className="text-slate-500 text-sm">@{user.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Username</div>
                <div className="text-slate-700 font-mono">@{user.username}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Email</div>
                <div className="text-slate-700">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Phone</div>
                <div className="text-slate-700">{user.phone ?? <span className="text-slate-400 italic">Not set</span>}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Status</div>
                <div className={cn("font-semibold", user.accountStatus === "ACTIVE" ? "text-green-600" : "text-red-600")}>
                  {user.accountStatus}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-brand-50 border border-brand-100">
              <KeyRound className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
              <p className="text-slate-500 text-sm">Verify your identity via OTP sent to your mobile</p>
            </div>
          </div>

          {/* Error / Success banners */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              {success}
            </div>
          )}

          {/* Dev mode OTP notice */}
          {devOtp && (
            <div className="p-3 mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <strong>🔧 Dev Mode:</strong> No SMS provider configured. Your OTP is:{" "}
              <span className="font-mono font-bold text-amber-900 text-base">{devOtp}</span>
            </div>
          )}

          {step === "done" ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-slate-700 font-medium">Password changed! Signing you out…</p>
            </div>
          ) : step === "idle" ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="phone-otp" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Mobile Phone Number
                </label>
                <input
                  id="phone-otp"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  disabled={busy}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
                />
                <p className="mt-1 text-xs text-slate-500">An OTP will be sent to this number</p>
              </div>
              <Button variant="primary" onClick={handleRequestOtp} isLoading={busy} disabled={busy}>
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="otp-input" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Enter OTP
                </label>
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  disabled={busy}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm font-mono tracking-widest text-center text-lg"
                />
              </div>
              <PasswordInput id="new-pass" label="New Password" value={newPassword} onChange={setNewPassword} disabled={busy} />
              <PasswordInput id="confirm-pass" label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} disabled={busy} />
              <p className="text-xs text-slate-500">
                Min 8 chars with uppercase, lowercase, number, and special character
              </p>
              <div className="flex gap-3">
                <Button variant="primary" onClick={handleChangePassword} isLoading={busy} disabled={busy}>
                  Change Password
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { setStep("idle"); setOtp(""); setError(""); setSuccess(""); setDevOtp(null); }}
                  disabled={busy}
                >
                  Resend OTP
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
