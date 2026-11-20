"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  RotateCw,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface UserItem {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  accountStatus: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  createdAt: string;
  lastLoginAt: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [verified, setVerified] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortOrder,
      });

      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);
      if (verified) params.set("verified", verified);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setUsers(data.data.users);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      } else {
        setUsers([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, status, verified, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Registered Users</h1>
          <p className="text-surface-400 text-sm mt-1">
            Browse, inspect, and manage client and member accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchUsers()}
            disabled={loading}
            className="inline-flex items-center gap-2"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-900 border border-surface-800 rounded-xl p-4 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by full name, @username, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-white placeholder-surface-500 text-sm focus:outline-none focus:border-brand-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-surface-400" />
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="PENDING_VERIFICATION">Pending</option>
              </select>
            </div>

            <select
              value={verified}
              onChange={(e) => {
                setVerified(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 text-sm focus:outline-none focus:border-brand-500"
            >
              <option value="">Verification: All</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>

            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split(":");
                setSortBy(sb);
                setSortOrder(so as "desc" | "asc");
                setPage(1);
              }}
              className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 text-sm focus:outline-none focus:border-brand-500"
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="fullName:asc">Name (A-Z)</option>
              <option value="lastLoginAt:desc">Last Active</option>
            </select>

            <Button type="submit" variant="primary" size="sm">
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-950/60 text-surface-400 text-xs uppercase tracking-wider border-b border-surface-800">
              <tr>
                <th className="py-3.5 px-6 font-medium">User Profile</th>
                <th className="py-3.5 px-6 font-medium">Email</th>
                <th className="py-3.5 px-6 font-medium">Role</th>
                <th className="py-3.5 px-6 font-medium">Verification</th>
                <th className="py-3.5 px-6 font-medium">Status</th>
                <th className="py-3.5 px-6 font-medium">Last Login</th>
                <th className="py-3.5 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800 text-surface-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-surface-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-500" />
                    Fetching user records...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-surface-400">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-surface-600" />
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-800/40 transition">
                    <td className="py-4 px-6 font-medium text-white">
                      <div>{user.fullName}</div>
                      <div className="text-xs text-surface-500 font-mono">@{user.username}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-surface-300">
                      {user.email}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={user.role === "ADMIN" ? "brand" : "default"} size="sm">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      {user.emailVerified ? (
                        <Badge variant="success" size="sm">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="sm">
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={user.accountStatus === "ACTIVE" ? "success" : "danger"}
                        size="sm"
                      >
                        {user.accountStatus}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-xs text-surface-400">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link href={`/admin/users/${user.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                      </Link>
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
            Showing <span className="font-semibold text-white">{users.length}</span> of{" "}
            <span className="font-semibold text-white">{total}</span> accounts
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
