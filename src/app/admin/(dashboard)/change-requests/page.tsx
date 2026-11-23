"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ChangeRequest {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  currentPhone?: string | null;
  requestedPhone?: string | null;
  currentEmail?: string | null;
  requestedEmail?: string | null;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  resolvedAt?: string | null;
}

export default function AdminChangeRequestsPage() {
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-requests");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRequests(data.data);
      }
    } catch {
      setErr("Failed to load change requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id: string) => {
    setActionBusy(id);
    setMsg("");
    setErr("");
    try {
      const res = await fetch(`/api/admin/change-requests/${id}/approve`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.message || "Failed to approve request.");
        return;
      }
      setMsg("Request approved! The user's contact information has been updated.");
      loadRequests();
    } catch {
      setErr("A network error occurred.");
    } finally {
      setActionBusy(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionBusy(id);
    setMsg("");
    setErr("");
    try {
      const res = await fetch(`/api/admin/change-requests/${id}/reject`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.message || "Failed to reject request.");
        return;
      }
      setMsg("Request has been marked as rejected.");
      loadRequests();
    } catch {
      setErr("A network error occurred.");
    } finally {
      setActionBusy(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-brand-400" />
            Contact Update Requests
          </h1>
          <p className="text-surface-400 text-sm mt-1">
            Review and approve user requests to change registered phone numbers and emails.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={loadRequests}
          disabled={loading}
          className="self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Notifications */}
      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {msg}
        </div>
      )}
      {err && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {err}
        </div>
      )}

      {/* Summary Banner */}
      <div className="p-4 rounded-xl bg-surface-900 border border-surface-800 text-sm flex items-center justify-between">
        <span className="text-surface-300">
          Total Requests: <strong className="text-white">{requests.length}</strong>
        </span>
        <span className="text-amber-400 font-medium">
          Pending Admin Action: <strong>{pendingCount}</strong>
        </span>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="py-16 text-center text-surface-400">Loading change requests...</div>
      ) : requests.length === 0 ? (
        <div className="py-16 text-center bg-surface-900 border border-surface-800 rounded-2xl text-surface-400">
          No contact update requests recorded.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-5 sm:p-6 rounded-2xl bg-surface-900 border border-surface-800 space-y-4 shadow-lg transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-surface-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-800 text-brand-400 flex items-center justify-center font-bold text-sm">
                    {req.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{req.fullName}</div>
                    <div className="text-xs text-surface-400 font-mono">@{req.username} &bull; ID: {req.userId}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === "PENDING" && (
                    <Badge variant="warning" size="sm" className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending Review
                    </Badge>
                  )}
                  {req.status === "APPROVED" && (
                    <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Approved
                    </Badge>
                  )}
                  {req.status === "REJECTED" && (
                    <Badge variant="danger" size="sm" className="inline-flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Rejected
                    </Badge>
                  )}
                  <span className="text-xs text-surface-500 font-mono">
                    {new Date(req.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Proposed Changes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Phone Change */}
                <div className="p-3.5 rounded-xl bg-surface-950/60 border border-surface-800">
                  <div className="text-surface-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-400" /> Mobile Number Change
                  </div>
                  <div className="space-y-1">
                    <div className="text-surface-400">
                      Current: <span className="font-mono text-surface-300">{req.currentPhone ?? "Not set"}</span>
                    </div>
                    <div className="text-white font-medium">
                      Requested:{" "}
                      {req.requestedPhone ? (
                        <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {req.requestedPhone}
                        </span>
                      ) : (
                        <span className="text-surface-500">No change requested</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Change */}
                <div className="p-3.5 rounded-xl bg-surface-950/60 border border-surface-800">
                  <div className="text-surface-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-400" /> Email Address Change
                  </div>
                  <div className="space-y-1">
                    <div className="text-surface-400">
                      Current: <span className="font-mono text-surface-300">{req.currentEmail ?? "Not set"}</span>
                    </div>
                    <div className="text-white font-medium">
                      Requested:{" "}
                      {req.requestedEmail ? (
                        <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {req.requestedEmail}
                        </span>
                      ) : (
                        <span className="text-surface-500">No change requested</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Reason */}
              <div className="p-3 rounded-lg bg-surface-950/40 text-xs text-surface-300">
                <span className="text-surface-500 font-medium mr-1.5">User Reason:</span>
                &ldquo;{req.reason}&rdquo;
              </div>

              {/* Action Buttons */}
              {req.status === "PENDING" && (
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(req.id)}
                    isLoading={actionBusy === req.id}
                    disabled={actionBusy !== null}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Approve &amp; Update User Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReject(req.id)}
                    disabled={actionBusy !== null}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject Request
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
