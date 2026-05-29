import Link from "next/link";
import { FEATURE_CARDS } from "@/lib/constants";
import { Card } from "@/components/ui/Card";

export function QuickFeatureAccess() {
  return (
    <Card title="Quick Feature Access" subtitle="Akses cepat ke modul FINUSA">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FEATURE_CARDS.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-4 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_28px_-18px_rgba(37,99,235,0.45)]"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="mb-2 inline-flex rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-2 text-primary transition-transform duration-300 group-hover:scale-105">
                <Icon size={18} />
              </div>
              <h4 className="text-sm font-semibold text-[var(--text-1)] sm:text-base">{feature.title}</h4>
              <p className="mt-1 text-xs leading-5 text-[var(--text-2)] sm:text-sm sm:leading-6">{feature.description}</p>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
