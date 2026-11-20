"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Mail,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface UserDetail {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  accountStatus: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  const router = useRouter();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data);
      } else {
        setError(data.message || "Failed to load user profile.");
      }
    } catch {
      setError("Unable to connect to user service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleStatusChange = async (newStatus: "ACTIVE" | "SUSPENDED") => {
    if (!confirm(`Are you sure you want to mark this account as ${newStatus}?`)) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          reason: `Admin requested status change to ${newStatus}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Action failed.");

      await fetchUser();
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-surface-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-brand-500" />
        Loading account details...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs text-surface-400 hover:text-brand-400"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </Link>
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
          {error || "User record not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Registered Users
        </Link>
        <div className="flex items-center gap-3">
          {user.accountStatus === "ACTIVE" ? (
            <Button
              variant="danger"
              size="sm"
              disabled={actionLoading || user.role === "ADMIN"}
              onClick={() => handleStatusChange("SUSPENDED")}
              className="inline-flex items-center gap-1.5"
            >
              <UserX className="w-4 h-4" /> Suspend Account
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled={actionLoading}
              onClick={() => handleStatusChange("ACTIVE")}
              className="inline-flex items-center gap-1.5 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
            >
              <UserCheck className="w-4 h-4" /> Reactivate Account
            </Button>
          )}
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl p-8 shadow-xl space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-800 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{user.fullName}</h1>
              <Badge variant={user.role === "ADMIN" ? "brand" : "default"} size="sm">
                {user.role}
              </Badge>
              <Badge
                variant={user.accountStatus === "ACTIVE" ? "success" : "danger"}
                size="sm"
              >
                {user.accountStatus}
              </Badge>
            </div>
            <p className="text-surface-400 font-mono text-xs mt-1">
              @{user.username} • User ID: {user.id}
            </p>
          </div>
        </div>

        {/* Account Attribute Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-surface-950/60 border border-surface-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </div>
            <div className="text-sm font-mono text-white break-all">{user.email}</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-950/60 border border-surface-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" /> Verification State
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">
                {user.emailVerified ? "Verified" : "Unverified"}
              </span>
              {user.emailVerifiedAt && (
                <span className="text-xs text-surface-500 font-mono">
                  ({new Date(user.emailVerifiedAt).toLocaleDateString()})
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-950/60 border border-surface-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" /> Registration Timestamp
            </div>
            <div className="text-sm text-white">
              {new Date(user.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-950/60 border border-surface-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" /> Last Activity
            </div>
            <div className="text-sm text-white">
              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never active"}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 rounded-xl bg-surface-950/40 border border-surface-800 text-xs text-surface-400 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-surface-200">Security Architecture:</span>{" "}
            Passwords and credentials are encrypted using irreversible salted bcrypt hashing.
            Administrative operators cannot view or decrypt sensitive user security artifacts.
          </div>
        </div>
      </div>
    </div>
  );
}
