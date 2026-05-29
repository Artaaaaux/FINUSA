"use client";

import { useRouter } from "next/navigation";
import { BrainCircuit, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="group relative max-w-full overflow-hidden rounded-3xl border border-[var(--card-border-soft)] bg-[linear-gradient(165deg,var(--hero-gradient-1),var(--hero-gradient-2),var(--hero-gradient-3))] px-4 py-6 shadow-[var(--shadow-card)] sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(100,116,139,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.05)_1px,transparent_1px)] [background-size:34px_34px] dark:opacity-20" />
      <div className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl sm:h-48 sm:w-48" />
      <div className="pointer-events-none absolute -right-10 bottom-2 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl sm:h-44 sm:w-44" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

      <div className="relative z-10 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-end">
        <div className="max-w-full animate-fade-in-up">
          <p
            className="mb-4 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-sm"
            style={{
              background: "var(--hero-badge-bg)",
              border: "1px solid var(--hero-badge-border)",
              color: "var(--hero-badge-text)",
              boxShadow: "var(--hero-badge-shadow), var(--hero-badge-glow)",
            }}
          >
            <Sparkles size={13} className="opacity-80" /> AI Economic Intelligence
          </p>

          <h2 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-[var(--text-1)] sm:text-4xl lg:text-5xl">Pahami Ekonomi Indonesia dengan Lebih Cerdas</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-2)] sm:text-[15px] lg:text-base">
            FINUSA membantu Anda membaca sinyal ekonomi, memantau rupiah, dan mengambil keputusan finansial dengan analisis berbasis AI.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button className="w-full sm:w-auto sm:min-w-44" onClick={() => document.getElementById("dashboard-sections")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
              Jelajahi Dashboard
            </Button>
            <Button
              variant="secondary"
              className="w-full gap-2 sm:w-auto sm:min-w-36"
              onClick={() => router.push("/dompet-aman?focusChat=1&prompt=Halo%20FINA%2C%20beri%20ringkasan%20sinyal%20ekonomi%20hari%20ini")}
            >
              <BrainCircuit size={16} />
              Tanya FINA
            </Button>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-[var(--card-border-soft)] bg-[var(--card)]/60 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-3)]">Signal Preview</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-3">
              <p className="text-[11px] text-[var(--text-3)]">Confidence</p>
              <p className="text-lg font-bold text-primary">82%</p>
            </div>
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-3">
              <p className="text-[11px] text-[var(--text-3)]">Mood</p>
              <p className="text-sm font-semibold text-[var(--text-1)]">Neutral</p>
            </div>
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald">
            <TrendingUp size={13} />
            Rupiah dalam rentang stabil
          </p>
        </div>
      </div>
    </section>
  );
}
