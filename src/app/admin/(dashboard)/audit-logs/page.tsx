"use client";

import { useState, useEffect, useCallback } from "react";
import { ShieldAlert, RotateCw, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetUserId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  admin: {
    fullName: string;
    username: string;
  };
  targetUser: {
    fullName: string;
    username: string;
  } | null;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/audit-logs?page=${page}&pageSize=${pageSize}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setLogs(data.data.logs);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionBadge = (action: string) => {
    if (action.includes("SUSPEND")) {
      return <Badge variant="danger" size="sm">{action}</Badge>;
    }
    if (action.includes("REACTIVATE")) {
      return <Badge variant="success" size="sm">{action}</Badge>;
    }
    if (action.includes("LOGIN")) {
      return <Badge variant="brand" size="sm">{action}</Badge>;
    }
    return <Badge variant="default" size="sm">{action}</Badge>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Administrative Audit Logs</h1>
          <p className="text-surface-400 text-sm mt-1">
            Immutable tracking of operator actions and security state transitions.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fetchLogs()}
          disabled={loading}
          className="inline-flex items-center gap-2"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-950/60 text-surface-400 text-xs uppercase tracking-wider border-b border-surface-800">
              <tr>
                <th className="py-3.5 px-6 font-medium">Timestamp</th>
                <th className="py-3.5 px-6 font-medium">Operator (Admin)</th>
                <th className="py-3.5 px-6 font-medium">Action Event</th>
                <th className="py-3.5 px-6 font-medium">Target User</th>
                <th className="py-3.5 px-6 font-medium">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800 text-surface-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-surface-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-500" />
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-surface-500">
                    <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-surface-600" />
                    No administrative audit events recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-800/40 transition">
                    <td className="py-4 px-6 text-xs text-surface-400 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-white font-medium">
                      <div>{log.admin.fullName}</div>
                      <div className="text-xs text-surface-500 font-mono">@{log.admin.username}</div>
                    </td>
                    <td className="py-4 px-6">{getActionBadge(log.action)}</td>
                    <td className="py-4 px-6">
                      {log.targetUser ? (
                        <div>
                          <div className="text-white text-xs font-medium">{log.targetUser.fullName}</div>
                          <div className="text-xs text-surface-500 font-mono">@{log.targetUser.username}</div>
                        </div>
                      ) : (
                        <span className="text-surface-500 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs font-mono text-surface-400 max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-surface-800 flex items-center justify-between text-xs text-surface-400">
          <div>
            Showing <span className="font-semibold text-white">{logs.length}</span> of{" "}
            <span className="font-semibold text-white">{total}</span> audit records
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || loading}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages || loading}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
