"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?tab=reset");
  }, [router]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-8 text-center">
      <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-3" />
      <p className="text-sm text-slate-600">Redirecting to Mobile OTP Password Change...</p>
    </div>
  );
}
