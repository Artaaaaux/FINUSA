import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  action,
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="max-w-full overflow-hidden rounded-2xl border border-[var(--card-border-soft)] bg-[var(--card)] p-4 shadow-[var(--shadow-card)] transition-all duration-250 hover:-translate-y-[1px] hover:border-[var(--card-border)] hover:shadow-[var(--shadow-card-hover)] sm:p-5 lg:p-6">
      {(title || subtitle || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 sm:mb-5">
          <div>
            {title && <h3 className="text-[15px] font-semibold tracking-tight text-[var(--text-1)] lg:text-base">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm leading-6 text-[var(--text-2)]">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
