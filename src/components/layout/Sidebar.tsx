"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Landmark } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center gap-3 px-1.5 py-1">
        <div
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--card-border-soft)] transition-transform duration-300"
          style={{ background: "var(--sidebar-icon-bg)" }}
        >
          <Landmark size={18} className="text-primary" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">FINUSA</p>
            <span className="inline-flex items-center rounded bg-primary/10 px-1 py-0.5 text-[9px] font-semibold text-primary">Beta</span>
          </div>
          <h1 className="truncate text-[14px] font-bold tracking-tight text-[var(--text-1)]">Economic Intelligence</h1>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2.5 px-1">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-3)]">Menu</span>
        <div className="h-px flex-1 bg-[var(--divider)]" />
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                isActive
                  ? "border border-[var(--sidebar-active-border)] bg-[var(--sidebar-active-bg)]"
                  : "border border-transparent hover:border-[var(--card-border-soft)] hover:bg-[var(--sidebar-hover-bg)]"
              }`}
            >
              {isActive && (
                <span className="absolute -left-4 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary lg:-left-5" />
              )}
              <span
                className={`inline-flex shrink-0 rounded-lg border p-2 transition-all duration-200 ${
                  isActive
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-[var(--card-border)] bg-[var(--card)] text-[var(--text-3)] group-hover:border-primary/20 group-hover:text-primary"
                }`}
              >
                <Icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-[13px] font-semibold tracking-tight transition-colors duration-200 ${isActive ? "text-primary" : "text-[var(--text-1)]"}`}>
                  {item.label}
                </p>
                <p className="truncate text-[11px] leading-4 text-[var(--text-3)]">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 shrink-0 rounded-xl border border-[var(--card-border-soft)] bg-[var(--sidebar-surface)] p-3.5">
        <p className="text-[11px] font-medium leading-5 text-[var(--text-3)]">Powered by FINUSA Developer</p>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald" />
          <span className="text-[10.5px] font-medium text-emerald">System Online</span>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({
  isOpen = false,
  onClose = () => {},
  isDesktop = false,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  isDesktop?: boolean;
}) {
  const pathname = usePathname();
  
  useEffect(() => {
    if (isDesktop) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isDesktop]);

  if (isDesktop) {
    return (
      <aside className="sidebar-premium hidden h-full w-72 shrink-0 flex-col border-r border-[var(--sidebar-border)] px-5 py-7 lg:flex">
        <SidebarContent pathname={pathname} />
      </aside>
    );
  }

  return (
    <div 
      className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        aria-hidden={!isOpen}
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        aria-modal="true"
        role="dialog"
        className={`sidebar-premium absolute inset-y-0 left-0 z-50 flex h-full w-[82vw] max-w-[320px] flex-col overflow-y-auto border-r border-[var(--sidebar-border)] px-4 py-6 shadow-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent pathname={pathname} onClose={onClose} />
      </aside>
    </div>
  );
}
