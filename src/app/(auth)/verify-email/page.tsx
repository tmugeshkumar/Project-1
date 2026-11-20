"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setSuccess(false);
      setMessage("Verification token is missing. Please check the link in your email.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setSuccess(true);
          setMessage(data.message || "Your email address has been successfully verified.");
        } else {
          setSuccess(false);
          setMessage(data.message || "Verification link is invalid or has expired.");
        }
      } catch {
        setSuccess(false);
        setMessage("Unable to complete verification at this time. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-xl p-8 text-center shadow-xl">
      {loading ? (
        <div className="py-8">
          <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Verifying Your Email</h2>
          <p className="text-surface-400 text-sm">Validating security token with the server...</p>
        </div>
      ) : success ? (
        <div>
          <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Email Verified</h2>
          <p className="text-surface-400 text-sm mb-6">{message}</p>
          <Link href="/login">
            <Button variant="primary" className="w-full inline-flex items-center justify-center gap-2">
              Sign In to Your Account <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-400 mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
          <p className="text-surface-400 text-sm mb-6">{message}</p>
          <div className="space-y-3">
            <Link href="/signup">
              <Button variant="secondary" className="w-full">
                Create a New Account
              </Button>
            </Link>
            <div>
              <Link href="/login" className="text-xs text-surface-400 hover:text-brand-400 transition">
                Return to Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-surface-400">Loading verification session...</div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
