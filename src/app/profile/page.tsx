"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Send,
  Clock,
  Check,
  X,
  FileEdit,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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

interface ChangeRequest {
  id: string;
  requestedPhone?: string | null;
  requestedEmail?: string | null;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  resolvedAt?: string | null;
}

type Step = "idle" | "sent" | "done";

function maskPhone(phone?: string | null): string {
  if (!phone) return "";
  const clean = phone.trim();
  if (clean.length <= 4) return clean;
  const last4 = clean.slice(-4);
  const prefix = clean.startsWith("+") ? clean.slice(0, 3) : "";
  return `${prefix} ******${last4}`;
}

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
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
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
          className="w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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

  // Initial phone registration state (if user didn't register phone yet)
  const [initialPhone, setInitialPhone] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneSaveMsg, setPhoneSaveMsg] = useState("");
  const [phoneSaveErr, setPhoneSaveErr] = useState("");

  // Change password state
  const [step, setStep] = useState<Step>("idle");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [maskedTargetPhone, setMaskedTargetPhone] = useState<string>("");
  const [passBusy, setPassBusy] = useState(false);
  const [passErr, setPassErr] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  // Change request modal/form state
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqPhone, setReqPhone] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqReason, setReqReason] = useState("");
  const [reqBusy, setReqBusy] = useState(false);
  const [reqMsg, setReqMsg] = useState("");
  const [reqErr, setReqErr] = useState("");
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);

  const fetchUserAndRequests = async () => {
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

      // Fetch user's change requests
      const crRes = await fetch("/api/auth/profile/change-request");
      if (crRes.ok) {
        const crData = await crRes.json();
        if (crData.success && Array.isArray(crData.data)) {
          setChangeRequests(crData.data);
        }
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndRequests();
  }, [router]);

  // Handle saving initial phone (if missing)
  const handleSaveInitialPhone = async () => {
    setPhoneSaveErr("");
    setPhoneSaveMsg("");
    if (!initialPhone.trim() || initialPhone.trim().length < 7) {
      setPhoneSaveErr("Please enter a valid phone number (at least 7 digits).");
      return;
    }
    setSavingPhone(true);
    try {
      const res = await fetch("/api/auth/profile/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: initialPhone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPhoneSaveErr(data.message || "Failed to save phone number.");
        return;
      }
      setPhoneSaveMsg("Mobile number registered successfully! It is now locked for security.");
      setUser((prev) => (prev ? { ...prev, phone: initialPhone.trim() } : null));
    } catch {
      setPhoneSaveErr("A network error occurred. Please try again.");
    } finally {
      setSavingPhone(false);
    }
  };

  // Handle Request OTP to registered mobile number
  const handleRequestOtp = async () => {
    setPassErr("");
    setPassSuccess("");
    setPassBusy(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setPassErr(data.message ?? "Failed to send OTP.");
        return;
      }
      setStep("sent");
      setMaskedTargetPhone(data.maskedPhone || maskPhone(user?.phone));
      setPassSuccess(data.message || "OTP sent to your registered mobile number.");
      if (data.devOtp) {
        setDevOtp(data.devOtp);
      }
    } catch {
      setPassErr("A network error occurred. Please try again.");
    } finally {
      setPassBusy(false);
    }
  };

  // Handle Submit OTP & New Password
  const handleChangePassword = async () => {
    setPassErr("");
    setPassSuccess("");
    if (!otp.trim() || otp.length !== 6) {
      setPassErr("Please enter the 6-digit numeric OTP.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setPassErr("Password must be at least 8 characters.");
      return;
    }
    if (
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      setPassErr("Password must contain uppercase, lowercase, number, and special character.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassErr("Passwords do not match.");
      return;
    }

    setPassBusy(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otp.trim(), newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPassErr(data.message ?? "Failed to change password.");
        return;
      }
      setStep("done");
      setPassSuccess("Password changed successfully! You will be signed out in 3 seconds.");
      setDevOtp(null);

      setTimeout(async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }, 3000);
    } catch {
      setPassErr("A network error occurred. Please try again.");
    } finally {
      setPassBusy(false);
    }
  };

  // Handle Submit Change Request to Admin
  const handleSubmitChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setReqErr("");
    setReqMsg("");

    if (!reqPhone.trim() && !reqEmail.trim()) {
      setReqErr("Please enter the requested new phone number or new email.");
      return;
    }
    if (!reqReason.trim() || reqReason.trim().length < 5) {
      setReqErr("Please provide a reason for the change request (at least 5 characters).");
      return;
    }

    setReqBusy(true);
    try {
      const res = await fetch("/api/auth/profile/change-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedPhone: reqPhone.trim() || undefined,
          requestedEmail: reqEmail.trim() || undefined,
          reason: reqReason.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReqErr(data.message || "Failed to submit change request.");
        return;
      }
      setReqMsg("Your change request has been sent to the Administrator! You will see updates below once reviewed.");
      setReqPhone("");
      setReqEmail("");
      setReqReason("");
      setShowRequestForm(false);
      // Refresh requests list
      fetchUserAndRequests();
    } catch {
      setReqErr("A network error occurred. Please try again.");
    } finally {
      setReqBusy(false);
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
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-2xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{user.fullName}</h1>
                <p className="text-slate-500 text-sm">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">
                {user.accountStatus}
              </Badge>
              <Badge variant="default" size="sm">
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Account Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" /> Username
              </div>
              <div className="text-slate-800 font-mono font-medium">@{user.username}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> Email Address
                </span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              </div>
              <div className="text-slate-800 font-medium truncate">{user.email}</div>
            </div>

            {/* Registered Mobile Number Box */}
            <div className="sm:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> Registered Mobile Number
                </span>
                {user.phone ? (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked &amp; Verified for OTP
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                    Not Registered Yet
                  </span>
                )}
              </div>

              {user.phone ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
                  <div className="font-mono text-base font-semibold text-slate-900">{user.phone}</div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowRequestForm(!showRequestForm)}
                    className="text-xs border-slate-300"
                  >
                    <FileEdit className="w-3.5 h-3.5 mr-1.5" />
                    Request Phone / Email Change
                  </Button>
                </div>
              ) : (
                /* Initial Phone Registration (allowed when no phone exists) */
                <div className="mt-2 space-y-3">
                  <p className="text-xs text-slate-600">
                    No phone number registered on this account yet. Add your mobile number below to enable secure OTP password changes:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="tel"
                      value={initialPhone}
                      onChange={(e) => setInitialPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      disabled={savingPhone}
                      className="flex-1 px-3.5 py-2 rounded-lg text-sm bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono shadow-sm"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveInitialPhone}
                      isLoading={savingPhone}
                      disabled={savingPhone}
                    >
                      Save Mobile Number
                    </Button>
                  </div>
                  {phoneSaveErr && <p className="text-xs text-red-600">{phoneSaveErr}</p>}
                  {phoneSaveMsg && <p className="text-xs text-green-600 font-medium">{phoneSaveMsg}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Change Request Form (if opened) */}
        {showRequestForm && (
          <div className="bg-white border-2 border-brand-200 rounded-2xl shadow-md p-6 sm:p-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-600" />
                  Request Contact Information Update
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mobile number and email are locked for security. Changes require Administrator approval.
                </p>
              </div>
              <button
                onClick={() => setShowRequestForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reqErr && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {reqErr}
              </div>
            )}
            {reqMsg && (
              <div className="p-3 mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs">
                {reqMsg}
              </div>
            )}

            <form onSubmit={handleSubmitChangeRequest} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    New Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={reqPhone}
                    onChange={(e) => setReqPhone(e.target.value)}
                    placeholder="+91 91234 56789"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 font-mono text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    New Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={reqEmail}
                    onChange={(e) => setReqEmail(e.target.value)}
                    placeholder="new@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Reason for Update Request *
                </label>
                <textarea
                  rows={2}
                  required
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  placeholder="e.g. Switched to a new SIM card / company phone"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm shadow-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="primary" size="sm" isLoading={reqBusy} disabled={reqBusy}>
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Submit to Administrator
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Change Requests History */}
        {changeRequests.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Contact Update Requests
            </h3>
            <div className="space-y-2.5">
              {changeRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <div className="font-medium text-slate-800">
                      {req.requestedPhone && <span>Phone: <code className="font-mono">{req.requestedPhone}</code> </span>}
                      {req.requestedEmail && <span>Email: <code className="font-mono">{req.requestedEmail}</code></span>}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">&ldquo;{req.reason}&rdquo; &bull; {new Date(req.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    {req.status === "PENDING" && (
                      <Badge variant="warning" size="sm" className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending Admin Review
                      </Badge>
                    )}
                    {req.status === "APPROVED" && (
                      <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> Approved by Admin
                      </Badge>
                    )}
                    {req.status === "REJECTED" && (
                      <Badge variant="danger" size="sm" className="inline-flex items-center gap-1">
                        <X className="w-3 h-3" /> Rejected
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Change Password Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-100 text-brand-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Change Password via Registered Mobile OTP</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Passwords can only be changed after OTP verification sent to your registered mobile number
              </p>
            </div>
          </div>

          {/* Feedback Banners */}
          {passErr && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {passErr}
            </div>
          )}
          {passSuccess && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              {passSuccess}
            </div>
          )}

          {/* Dev OTP Box */}
          {devOtp && (
            <div className="p-3.5 mb-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                <span>🔧 Development Mode SMS Simulation</span>
              </div>
              <p>
                An OTP was dispatched to your mobile number. Your verification code is:{" "}
                <span className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900 tracking-wider">
                  {devOtp}
                </span>
              </p>
            </div>
          )}

          {!user.phone ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <p className="font-semibold mb-1">Mobile Number Required</p>
              Please register your mobile number in the account section above to enable OTP-based password changes.
            </div>
          ) : step === "done" ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-slate-800 font-semibold text-sm">Password Updated Successfully!</p>
              <p className="text-slate-500 text-xs mt-1">Redirecting to sign-in page...</p>
            </div>
          ) : step === "idle" ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <p>
                  To change your password, an OTP will be dispatched to your registered mobile number:{" "}
                  <strong className="font-mono text-slate-900">{maskPhone(user.phone)}</strong>
                </p>
              </div>
              <Button
                variant="primary"
                onClick={handleRequestOtp}
                isLoading={passBusy}
                disabled={passBusy}
                className="w-full sm:w-auto"
              >
                Send OTP to {maskPhone(user.phone)}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center justify-between">
                <span>OTP dispatched to: <strong className="font-mono">{maskedTargetPhone}</strong></span>
                <span className="text-[11px] text-blue-600">Expires in 5 mins</span>
              </div>

              <div>
                <label htmlFor="user-otp" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Enter 6-Digit OTP *
                </label>
                <input
                  id="user-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  disabled={passBusy}
                  className="w-full sm:w-64 px-3.5 py-2.5 rounded-lg text-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono tracking-widest text-center shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PasswordInput
                  id="new-password"
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  disabled={passBusy}
                />
                <PasswordInput
                  id="confirm-password"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  disabled={passBusy}
                />
              </div>

              <p className="text-xs text-slate-500">
                Min 8 characters &bull; uppercase &bull; lowercase &bull; number &bull; special character
              </p>

              <div className="flex items-center gap-3 pt-2">
                <Button variant="primary" onClick={handleChangePassword} isLoading={passBusy} disabled={passBusy}>
                  Verify OTP &amp; Change Password
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep("idle");
                    setOtp("");
                    setPassErr("");
                    setPassSuccess("");
                    setDevOtp(null);
                  }}
                  disabled={passBusy}
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
