"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FilePlus2, Newspaper, LogOut } from "lucide-react";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/tambah-berita", label: "Tambah Berita", icon: FilePlus2 },
  { href: "/admin/dashboard/kelola-berita", label: "Kelola Berita", icon: Newspaper },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <aside className="w-full shrink-0 overflow-y-auto border-b border-[var(--divider)] bg-[var(--sidebar)] p-4 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-5">
      <h2 className="mb-6 text-lg font-semibold tracking-tight text-[var(--text-1)]">FINUSA CMS</h2>
      <nav className="flex flex-wrap gap-2 lg:block lg:space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition lg:flex ${
                active
                  ? "border-blue-200 bg-blue-50 text-primary dark:border-blue-400/30 dark:bg-blue-500/10"
                  : "border-transparent text-[var(--text-2)] hover:border-[var(--card-border)] hover:bg-[var(--surface)]"
              }`}
            >
              <Icon size={16} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => void logout()}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--text-2)] transition hover:border-primary/30 hover:text-primary lg:mt-6"
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}
