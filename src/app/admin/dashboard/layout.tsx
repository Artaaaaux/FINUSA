import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background lg:flex-row">
      <AdminSidebar />
      <section className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6">{children}</section>
    </main>
  );
}
