"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Menu, Search, Sparkles, TrendingUp, X } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { FEATURE_CARDS, NAV_ITEMS } from "@/lib/constants";
import type { EconomicNews } from "@/types/economy";

type SearchResult = { label: string; type: "page" | "feature" | "news"; href: string; meta?: string };

export function Navbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [newsItems, setNewsItems] = useState<EconomicNews[]>([]);
  const [isSignalOpen, setIsSignalOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const mobileSearchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        const payload = (await res.json()) as { items?: EconomicNews[] };
        if (mounted) setNewsItems(payload.items ?? []);
      } catch {
        if (mounted) setNewsItems([]);
      }
    };
    void run();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchBoxRef.current && !searchBoxRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
      if (mobileSearchBoxRef.current && !mobileSearchBoxRef.current.contains(target)) {
        setIsSearchOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileSearchOpen(false);
        setIsSignalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [] as SearchResult[];

    const pageResults: SearchResult[] = NAV_ITEMS.map((item) => ({
      label: item.label,
      type: "page",
      href: item.href,
      meta: item.description,
    }));
    const featureResults: SearchResult[] = FEATURE_CARDS.map((item) => ({
      label: item.title,
      type: "feature",
      href: item.href,
      meta: item.description,
    }));
    const newsResults: SearchResult[] = newsItems.map((item) => ({
      label: item.title,
      type: "news",
      href: "/rupiah-lens",
      meta: `${item.category} - ${item.source}`,
    }));

    return [...pageResults, ...featureResults, ...newsResults]
      .filter((item) => `${item.label} ${item.meta ?? ""}`.toLowerCase().includes(term))
      .slice(0, 8);
  }, [newsItems, query]);

  // Shared result list renderer
  const ResultList = ({ mobile = false }: { mobile?: boolean }) =>
    results.length > 0 ? (
      <div className={`${mobile ? "max-h-[50dvh]" : "max-h-80"} overflow-y-auto p-1.5`}>
        {results.map((result, index) => (
          <Link
            key={`${mobile ? "mobile-" : ""}${result.type}-${result.label}-${index}`}
            href={result.href}
            onClick={() => {
              setIsSearchOpen(false);
              if (mobile) setIsMobileSearchOpen(false);
            }}
            className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-[var(--surface)]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-1)]">{result.label}</p>
              {result.meta && <p className="truncate text-xs text-[var(--text-3)]">{result.meta}</p>}
            </div>
            <span className="shrink-0 rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-3)]">
              {result.type}
            </span>
          </Link>
        ))}
      </div>
    ) : (
      <div className="px-3 py-3 text-sm text-[var(--text-3)]">Tidak ada hasil untuk &ldquo;{query}&rdquo;.</div>
    );

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--card-border-soft)] bg-[var(--glass-bg)] px-3 py-2.5 shadow-[var(--shadow-navbar)] backdrop-blur-xl sm:px-4 sm:py-3 lg:px-6">
      {/* ── Main row ── */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Burger — mobile only */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-[var(--text-2)] transition-all duration-200 hover:border-primary/30 hover:text-primary lg:hidden"
        >
          <Menu size={18} />
        </button>

        {/* Desktop search */}
        <div ref={searchBoxRef} className="relative hidden min-w-0 flex-1 md:block">
          <SearchInput
            placeholder="Cari insight ekonomi, topik, atau fitur..."
            value={query}
            onChange={(value) => {
              setQuery(value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
          />
          {isSearchOpen && query.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-lg">
              <ResultList />
            </div>
          )}
        </div>

        {/* Mobile search toggle */}
        <button
          type="button"
          onClick={() => {
            setIsMobileSearchOpen((prev) => !prev);
            setIsSearchOpen(true);
          }}
          aria-label="Toggle search"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-[var(--text-2)] transition-all duration-200 hover:border-primary/30 hover:text-primary md:hidden"
        >
          {isMobileSearchOpen ? <X size={18} /> : <Search size={18} />}
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-[var(--text-2)] transition-all duration-200 hover:border-primary/30 hover:text-primary"
        >
          <Bell size={18} />
        </button>

        <button
          type="button"
          onClick={() => setIsSignalOpen(true)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--badge-primary-border)] bg-[var(--badge-primary-bg)] text-sm font-medium text-[var(--badge-primary-text)] transition-all duration-200 hover:bg-[var(--badge-primary-bg)]/90 sm:h-auto sm:w-auto sm:min-h-11 sm:px-3 sm:py-2"
        >
          <Sparkles size={16} />
          <span className="hidden sm:inline lg:hidden">Signal</span>
          <span className="hidden lg:inline">AI Signal</span>
        </button>

        <ThemeToggle />
      </div>

      {/* ── Mobile search bar (expandable) ── */}
      {isMobileSearchOpen && (
        <div ref={mobileSearchBoxRef} className="relative mt-2 md:hidden">
          <SearchInput
            placeholder="Cari insight ekonomi..."
            value={query}
            onChange={(value) => {
              setQuery(value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
          />
          {isSearchOpen && query.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-lg">
              <ResultList mobile />
            </div>
          )}
        </div>
      )}

      {/* ── AI Signal modal ── */}
      {isSignalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-[2px]"
          onClick={() => setIsSignalOpen(false)}
        >
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 md:inset-0 md:flex md:items-center md:justify-center md:p-6">
            <div
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-xl overflow-hidden rounded-t-2xl border border-[var(--card-border)] bg-[var(--glass-bg)] p-4 shadow-xl backdrop-blur-xl md:rounded-2xl md:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-[var(--text-1)]">Economic Signal Center</h3>
                  <p className="text-xs text-[var(--text-3)]">Ringkasan cepat AI macro signal</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSignalOpen(false)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-[var(--surface)]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-3">
                  <p className="text-xs text-[var(--text-3)]">Confidence Score</p>
                  <p className="text-lg font-bold text-primary">82%</p>
                </div>
                <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-3">
                  <p className="text-xs text-[var(--text-3)]">Rupiah Trend</p>
                  <p className="text-sm font-semibold text-emerald">Stable / Strengthening</p>
                </div>
                <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-3">
                  <p className="text-xs text-[var(--text-3)]">Market Mood</p>
                  <p className="text-sm font-semibold text-primary">Neutral</p>
                </div>
                <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-3">
                  <p className="text-xs text-[var(--text-3)]">Economic Status</p>
                  <p className="text-sm font-semibold text-warning">Watchlist</p>
                </div>
              </div>

              <div className="mt-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-3">
                <p className="text-xs text-[var(--text-3)]">AI Summary</p>
                <p className="text-sm text-[var(--text-2)]">Likuiditas terjaga, pantau rilis inflasi dan arus global.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsSignalOpen(false)}
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--badge-primary-border)] bg-[var(--badge-primary-bg)] px-3 py-2 text-sm font-semibold text-[var(--badge-primary-text)]"
              >
                <TrendingUp size={16} />
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
