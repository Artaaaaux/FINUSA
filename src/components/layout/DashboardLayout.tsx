"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncViewportMode = () => {
      const desktop = typeof mediaQuery.matches === "boolean"
        ? mediaQuery.matches
        : window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsSidebarOpen(false);
    };

    syncViewportMode();

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewportMode);
    } else {
      mediaQuery.addListener(syncViewportMode);
    }
    document.addEventListener("keydown", onEscape);

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", syncViewportMode);
      } else {
        mediaQuery.removeListener(syncViewportMode);
      }
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  if (isDesktop) {
    return (
      <div className="flex h-screen w-full max-w-full overflow-hidden bg-background">
        <Sidebar isDesktop />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Navbar onOpenSidebar={() => {}} />
          <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-6 scroll-smooth">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-full bg-background overflow-x-hidden">
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
      <main className="min-w-0 flex-1 p-4 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
      {/* Mobile drawer is kept mounted, controlled purely via Tailwind classes */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}
