import type { ReactNode } from "react";

export function Badge({ children, variant = "neutral" }: { children: ReactNode; variant?: "neutral" | "primary" | "positive" | "warning" | "negative" }) {
  const styles = {
    neutral: "bg-[var(--badge-neutral-bg)] border-[var(--badge-neutral-border)] text-[var(--badge-neutral-text)]",
    primary: "bg-[var(--badge-primary-bg)] border-[var(--badge-primary-border)] text-[var(--badge-primary-text)]",
    positive: "bg-[var(--badge-positive-bg)] border-[var(--badge-positive-border)] text-[var(--badge-positive-text)]",
    warning: "bg-[var(--badge-warning-bg)] border-[var(--badge-warning-border)] text-[var(--badge-warning-text)]",
    negative: "bg-[var(--badge-negative-bg)] border-[var(--badge-negative-border)] text-[var(--badge-negative-text)]",
  }[variant];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide backdrop-blur-sm transition-colors duration-200 ${styles}`}>
      {children}
    </span>
  );
}
