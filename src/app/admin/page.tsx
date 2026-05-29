import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-md pt-10">
        <Card title="FINUSA Admin Lite" subtitle="Login untuk mengelola konten berita">
          <AdminLoginForm />
        </Card>
      </div>
    </main>
  );
}
