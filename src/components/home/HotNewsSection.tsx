import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { DUMMY_NEWS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function HotNewsSection() {
  return (
    <Card title="Hot News" subtitle="Sorotan ekonomi terbaru Indonesia">
      <div className="space-y-4">
        {DUMMY_NEWS.slice(0, 3).map((item) => (
          <article
            key={item.id}
            className="group rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-[var(--card)]"
          >
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <Badge variant="primary">{item.category}</Badge>
              <p className="text-[11px] tracking-wide text-[var(--text-3)]">{item.source} - {item.date}</p>
            </div>
            <h4 className="text-[15px] font-semibold leading-6 tracking-tight text-[var(--text-1)] group-hover:text-primary">{item.headline}</h4>
            <p className="mt-2 text-sm leading-6 text-[var(--text-2)]">{item.summary}</p>
            <Link href="/rupiah-lens" className="mt-2 inline-flex min-h-10 items-center gap-1 text-xs text-primary/80 hover:text-primary">
              <ExternalLink size={12} /> Baca ringkasan
            </Link>
          </article>
        ))}
      </div>
    </Card>
  );
}
