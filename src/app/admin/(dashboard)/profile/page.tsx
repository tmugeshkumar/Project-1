"use client";

import { useState } from "react";
import { ShieldCheck, Phone, KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Step = "idle" | "sent" | "done";

function PasswordInput({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
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
          placeholder="••••••••••••"
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

export default function AdminProfilePage() {
  const [step, setStep] = useState<Step>("idle");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequestOtp = async () => {
    setError("");
    setSuccess("");
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/auth/change-password", {
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
      const res = await fetch("/api/admin/auth/change-password", {
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
      setSuccess("Password changed successfully! You will be signed out shortly.");
      setDevOtp(null);
      setTimeout(async () => {
        await fetch("/api/admin/auth/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }, 3000);
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Profile</h1>
          <p className="text-surface-400 text-sm mt-1">Manage your admin account security</p>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
            <KeyRound className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Change Password</h2>
            <p className="text-surface-400 text-sm">Verify via OTP sent to your registered mobile</p>
          </div>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            {success}
          </div>
        )}

        {/* Dev OTP */}
        {devOtp && (
          <div className="p-3 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
            <strong>🔧 Dev Mode:</strong> No SMS provider configured. Your OTP is:{" "}
            <span className="font-mono font-bold text-amber-200 text-base">{devOtp}</span>
          </div>
        )}

        {step === "done" ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-surface-200 font-medium">Password changed! Signing you out…</p>
          </div>
        ) : step === "idle" ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-phone" className="block text-sm font-medium text-surface-200 mb-1.5">
                <Phone className="w-4 h-4 inline mr-1.5" />
                Mobile Phone Number
              </label>
              <input
                id="admin-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                disabled={busy}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-950 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              />
              <p className="mt-1 text-xs text-surface-500">An OTP will be sent to this number</p>
            </div>
            <Button variant="primary" onClick={handleRequestOtp} isLoading={busy} disabled={busy}>
              Send OTP
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-otp" className="block text-sm font-medium text-surface-200 mb-1.5">
                Enter OTP
              </label>
              <input
                id="admin-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                disabled={busy}
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-950 border border-surface-700",
                  "text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500",
                  "font-mono tracking-widest text-center text-lg transition-colors"
                )}
              />
            </div>
            <PasswordInput id="admin-new-pass" label="New Password" value={newPassword} onChange={setNewPassword} disabled={busy} />
            <PasswordInput id="admin-confirm-pass" label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} disabled={busy} />
            <p className="text-xs text-surface-500">
              Min 8 chars · uppercase · lowercase · number · special character
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
  );
}
