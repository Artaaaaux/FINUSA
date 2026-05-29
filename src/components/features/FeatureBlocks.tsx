"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export function FeaturePageHeader({
  label,
  title,
  description,
  action,
}: {
  label: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="relative max-w-full overflow-hidden rounded-2xl border border-[var(--card-border-soft)] bg-[var(--card)] p-4 shadow-[var(--shadow-card)] sm:p-5 lg:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/70 bg-blue-50/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary dark:border-blue-400/30 dark:bg-blue-500/15">
            <Sparkles size={12} /> {label}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-[var(--text-1)] sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-2)] sm:text-base">{description}</p>
        </div>
        {action}
      </div>
    </section>
  );
}

export function FilterTabs({
  tabs,
  activeIndex = 0,
  onChange,
}: {
  tabs: string[];
  activeIndex?: number;
  onChange?: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange?.(index)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
            index === activeIndex
              ? "border-blue-200 bg-blue-50 text-primary shadow-[0_8px_18px_-15px_rgba(37,99,235,0.8)] dark:border-blue-400/30 dark:bg-blue-500/15"
              : "border-[var(--card-border)] bg-[var(--card)] text-[var(--text-2)] hover:border-[var(--card-border-soft)] hover:bg-[var(--surface)]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function TrendPill({ label, positive = true }: { label: string; positive?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        positive
          ? "bg-emerald-50 text-emerald dark:bg-emerald-500/20"
          : "bg-red-50 text-negative dark:bg-red-500/20"
      }`}
    >
      {label}
    </span>
  );
}

export function SkeletonBars({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-2.5 rounded-full bg-gradient-to-r from-[var(--surface)] via-blue-100/50 to-[var(--surface)] dark:via-blue-500/10"
          style={{ width: `${100 - index * 10}%` }}
        />
      ))}
    </div>
  );
}
