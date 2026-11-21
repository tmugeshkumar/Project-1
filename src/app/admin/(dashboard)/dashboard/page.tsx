import Link from "next/link";
import { getPrismaClient } from "@/lib/db";
import { getAllLocalUsers } from "@/lib/auth/local-store";
import {
  Users,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const prisma = getPrismaClient();

  let totalUsers = 0;
  let verifiedUsers = 0;
  let unverifiedUsers = 0;
  let activeUsers = 0;
  let suspendedUsers = 0;
  let recentRegistrations: Array<{
    id: string;
    fullName: string;
    username: string;
    email: string;
    emailVerified: boolean;
    accountStatus: string;
    createdAt: Date | string;
  }> = [];

  if (!prisma) {
    // ── Local store fallback ────────────────────────────────────────────
    try {
      const allUsers = getAllLocalUsers();
      totalUsers = allUsers.length;
      verifiedUsers = allUsers.filter((u) => u.emailVerified).length;
      unverifiedUsers = totalUsers - verifiedUsers;
      activeUsers = allUsers.filter((u) => u.accountStatus === "ACTIVE").length;
      suspendedUsers = allUsers.filter((u) => u.accountStatus === "SUSPENDED").length;
      recentRegistrations = [...allUsers]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    } catch (err) {
      console.error("[Admin Dashboard Local Store Error]:", err);
    }
  } else {
    // ── Prisma path ─────────────────────────────────────────────────────
    try {
      const [total, verified, active, suspended, recent] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { emailVerified: true } }),
        prisma.user.count({ where: { accountStatus: "ACTIVE" } }),
        prisma.user.count({ where: { accountStatus: "SUSPENDED" } }),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
            emailVerified: true,
            accountStatus: true,
            createdAt: true,
          },
        }),
      ]);

      totalUsers = total;
      verifiedUsers = verified;
      unverifiedUsers = total - verified;
      activeUsers = active;
      suspendedUsers = suspended;
      recentRegistrations = recent;
    } catch (err) {
      console.error("[Admin Dashboard Query Error]:", err);
    }
  }

  const statCards = [
    {
      label: "Total Accounts",
      value: totalUsers,
      icon: Users,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Verified Users",
      value: verifiedUsers,
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Pending Verification",
      value: unverifiedUsers,
      icon: Clock,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Active Accounts",
      value: activeUsers,
      icon: UserCheck,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      label: "Suspended",
      value: suspendedUsers,
      icon: UserX,
      color: "text-red-400 bg-red-500/10 border-red-500/20",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-surface-400 text-sm mt-1">
            Real-time status of users and security metrics.
          </p>
        </div>
        <Link href="/admin/users">
          <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
            Manage All Users <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-surface-900 border border-surface-800 rounded-xl p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-surface-400 font-medium">{card.label}</span>
                <div className={`p-2 rounded-lg border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-surface-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Registrations</h2>
            <p className="text-xs text-surface-400 mt-0.5">Last 5 accounts registered in the system</p>
          </div>
          <Link
            href="/admin/users"
            className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1"
          >
            View all <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-950/50 text-surface-400 text-xs uppercase tracking-wider border-b border-surface-800">
              <tr>
                <th className="py-3.5 px-6 font-medium">User</th>
                <th className="py-3.5 px-6 font-medium">Email</th>
                <th className="py-3.5 px-6 font-medium">Verification</th>
                <th className="py-3.5 px-6 font-medium">Status</th>
                <th className="py-3.5 px-6 font-medium">Registered</th>
                <th className="py-3.5 px-6 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800 text-surface-200">
              {recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-surface-500 text-sm">
                    No registered accounts recorded yet.
                  </td>
                </tr>
              ) : (
                recentRegistrations.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-800/40 transition">
                    <td className="py-4 px-6 font-medium text-white">
                      <div>{user.fullName}</div>
                      <div className="text-xs text-surface-500 font-mono">@{user.username}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-surface-300">{user.email}</td>
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
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link href={`/admin/users/${user.id}`}>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
