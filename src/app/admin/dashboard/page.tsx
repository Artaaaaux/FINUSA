import { Card } from "@/components/ui/Card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <Card title="Dashboard" subtitle="FINUSA Admin Lite CMS">
        <p className="text-sm text-[var(--text-2)]">
          Kelola berita ekonomi untuk Rupiah Lens. Gunakan menu kiri untuk menambah, mengedit, atau menghapus konten.
        </p>
      </Card>
    </div>
  );
}
