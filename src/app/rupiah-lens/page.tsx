"use client";

import { BarChart3, BrainCircuit, Clock3, ExternalLink, Newspaper, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { SentimentBadge } from "@/components/ui/SentimentBadge";
import { FeaturePageHeader, FilterTabs, SkeletonBars, TrendPill } from "@/components/features/FeatureBlocks";
import { useRupiahLensNews } from "@/hooks/useRupiahLensNews";

export default function RupiahLensPage() {
  const { categories, activeFilter, setFilterByIndex, featured, filteredNews, insight, isLoading } = useRupiahLensNews();
  const tonePill = insight.tone !== "cautious";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <FeaturePageHeader
          label="Rupiah Lens"
          title="AI-Powered Economic Newsroom"
          description="Pantau berita ekonomi penting dan lihat interpretasi insight adaptif berdasarkan dinamika sentimen pasar Indonesia."
          action={<TrendPill label={insight.headline} positive={tonePill} />}
        />

        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr] xl:gap-6">
          <div className="space-y-5 xl:space-y-6">
            <Card title="Featured Article" subtitle="Highlight utama hari ini">
              {featured ? (
                <a href={featured.articleUrl} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl border border-[var(--card-border-soft)] bg-[var(--surface)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-[var(--card)] sm:p-5">
                  {featured.image && (
                    <div className="mb-4 overflow-hidden rounded-xl border border-[var(--card-border-soft)] bg-[var(--card)]">
                      <img src={featured.image} alt={featured.title} className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]" />
                    </div>
                  )}
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded border border-[var(--badge-primary-border)] bg-[var(--badge-primary-bg)] px-2.5 py-0.5 text-[10.5px] font-semibold text-[var(--badge-primary-text)]">
                      <Sparkles size={12} /> Featured
                    </span>
                    <span className="inline-flex items-center gap-1 rounded border border-[var(--card-border-soft)] bg-[var(--card)] px-2.5 py-0.5 text-[10.5px] font-medium text-[var(--text-2)]">{featured.source}</span>
                    <SentimentBadge sentiment={featured.sentiment} />
                    <span className="text-xs font-medium text-[var(--text-3)]">- {featured.date}</span>
                  </div>
                  <h3 className="text-base font-bold tracking-tight text-[var(--text-1)] transition-colors duration-200 group-hover:text-primary sm:text-lg">{featured.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-2)]">{featured.description}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <ExternalLink size={12} /> Buka sumber asli
                  </div>
                </a>
              ) : (
                <p className="text-sm text-[var(--text-3)]">Belum ada artikel unggulan.</p>
              )}
            </Card>

            <Card
              title="News Feed"
              subtitle="Kurasi berita ekonomi Indonesia"
              action={<FilterTabs tabs={categories} activeIndex={Math.max(0, categories.indexOf(activeFilter))} onChange={setFilterByIndex} />}
            >
              <div className="space-y-4">
                {isLoading && <p className="text-sm text-[var(--text-3)]">Memuat berita...</p>}
                {filteredNews.map((item) => (
                  <a
                    key={item.id}
                    href={item.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl border border-[var(--card-border-soft)] bg-[var(--surface)] p-4 transition-all duration-200 hover:border-primary/20 hover:bg-[var(--card)] sm:p-5"
                  >
                    {item.image && (
                      <div className="mb-4 overflow-hidden rounded-lg border border-[var(--card-border-soft)] bg-[var(--card)]">
                        <img src={item.image} alt={item.title} className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]" />
                      </div>
                    )}
                    <div className="mb-2.5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded border border-[var(--badge-primary-border)] bg-[var(--badge-primary-bg)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--badge-primary-text)]">
                        <Newspaper size={12} /> {item.category}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded border border-[var(--card-border-soft)] bg-[var(--card)] px-2.5 py-0.5 text-[10.5px] font-medium text-[var(--text-2)]">{item.source}</span>
                      <SentimentBadge sentiment={item.sentiment} />
                      <span className="text-xs font-medium text-[var(--text-3)]">- {item.date}</span>
                    </div>
                    <h3 className="text-base font-bold tracking-tight text-[var(--text-1)] transition-colors duration-200 group-hover:text-primary">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-2)]">{item.description}</p>
                    <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-primary"><ExternalLink size={12} /> Buka sumber</span>
                  </a>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-5 xl:space-y-6">
            <Card title="AI Insight Panel" subtitle="Interpretasi adaptif berbasis sentimen">
              <div className="space-y-4">
                <div className="rounded-xl border border-[var(--card-border-soft)] bg-[var(--surface)] p-4">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">FINA Perspective</p>
                  <p className="text-base font-bold leading-6 tracking-tight text-[var(--text-1)]">{insight.headline}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-2)]">{insight.interpretation}</p>
                </div>
                <div className="rounded-xl border border-[var(--card-border-soft)] bg-[var(--surface)] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-[var(--text-1)]">Signal Strength</p>
                    <BarChart3 size={16} className="text-primary" />
                  </div>
                  <SkeletonBars rows={5} />
                </div>
              </div>
            </Card>

            <Card title="Economic Interpretation" subtitle="Ringkasan naratif kondisi ekonomi">
              <div className="rounded-xl border border-[var(--card-border-soft)] bg-[var(--surface)] p-4">
                <p className="text-sm leading-relaxed text-[var(--text-2)]">{insight.marketSummary}</p>
              </div>
            </Card>

            <Card title="Highlighted Insights" subtitle="Poin strategis untuk dipantau">
              <div className="space-y-2">
                {insight.highlights.map((item) => (
                  <div key={item} className="flex w-full items-start gap-2.5 rounded-xl border border-[var(--card-border-soft)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--text-2)]">
                    <BrainCircuit size={15} className="mt-0.5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Market Summary" subtitle="Konteks cepat untuk keputusan">
              <div className="flex w-full items-center gap-2.5 rounded-xl border border-[var(--card-border-soft)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--text-2)]">
                <Clock3 size={14} className="shrink-0 text-primary" />
                <span>Update insight mengikuti filter kategori aktif.</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
