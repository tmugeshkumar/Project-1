import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdminSession } from "@/lib/auth/guards";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  await requireAdminSession();

  return (
    <div className="min-h-screen bg-surface-950 text-surface-50 flex">
      <AdminSidebar />
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
