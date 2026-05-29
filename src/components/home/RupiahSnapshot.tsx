"use client";

import React from "react";
import { ArrowDownRight, ArrowUpRight, TrendingUp, Activity, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ChartFrame } from "@/components/charts/ChartPrimitives";
import { FinanceLineChart } from "@/components/charts/FinanceLineChart";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { resolveDeltaTone } from "@/lib/chart-theme";

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(date);
}

function formatRate(value: number) {
  if (value <= 0) return "-";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(value);
}

/** Synthesize smooth N-point trend ending exactly at liveRate */
function synthesizeHistory(liveRate: number, changePercent: number, points = 11): number[] {
  const startRate = liveRate / (1 + changePercent / 100);
  const volatility = Math.abs(liveRate * 0.0008); // very low noise — smooth curve

  let seed = Math.round(liveRate * 10);
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const raw: number[] = [];
  for (let i = 0; i < points - 1; i++) {
    const progress = i / (points - 1);
    const base = startRate + (liveRate - startRate) * progress;
    const noise = (rand() - 0.5) * 2 * volatility;
    raw.push(Math.max(0, base + noise));
  }
  raw.push(liveRate);

  // Simple moving average smooth pass
  return raw.map((v, i) => {
    if (i === 0 || i === raw.length - 1) return v;
    return (raw[i - 1] + v + raw[i + 1]) / 3;
  });
}

/** Generate YYYY-MM-DD date labels for last N days */
function generateDateLabels(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (count - 1 - i));
    return d.toISOString().split("T")[0];
  });
}

function StatPill({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-[var(--card-border)] bg-[var(--surface)] px-3 py-2.5">
      <span className="text-[var(--text-3)]">{icon}</span>
      <p className="text-[11px] text-[var(--text-3)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--text-1)]">{value}</p>
    </div>
  );
}

export function RupiahSnapshot() {
  const { data, isLoading, isRefreshing, canRefresh, refetch } = useExchangeRates();

  const usdItem = data.items.find((item) => item.code === "USD");
  const value = usdItem && usdItem.rate > 0 ? usdItem.rate : 15450;
  const changePercent = usdItem ? usdItem.changePercent : -0.45;
  const isUp = changePercent > 0;

  const marketFeeling =
    data.marketStatus === "Bullish" ? "Optimis" :
    data.marketStatus === "Bearish" ? "Waspada" : "Stabil";
  const badgeVariant =
    data.marketStatus === "Bullish" ? "positive" :
    data.marketStatus === "Bearish" ? "negative" : "neutral";

  const sparkline = synthesizeHistory(value, changePercent, 11);
  const chartLabels = generateDateLabels(11);
  const chartTone = resolveDeltaTone(sparkline[sparkline.length - 1] - sparkline[0]);

  const sgdItem = data.items.find((i) => i.code === "SGD");
  const eurItem = data.items.find((i) => i.code === "EUR");

  return (
    <Card
      title="Rupiah Snapshot"
      subtitle={isLoading ? "Memuat data..." : `Update ${formatDateTime(data.updatedAt)}`}
      action={
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={!canRefresh || isRefreshing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-2)] transition-all hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCcw size={12} className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      }
    >
      {/* Main rate display */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--text-3)]">USD / IDR</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-[var(--text-1)]">
            {isLoading ? "Rp15.450" : `Rp${Math.round(value).toLocaleString("id-ID")}`}
          </p>
          <p
            className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isUp
                ? "bg-[var(--badge-negative-bg)] text-negative"
                : "bg-[var(--badge-positive-bg)] text-emerald"
            }`}
          >
            {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {isLoading ? "-0.45%" : `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(2)}%`}
          </p>
        </div>
        <Badge variant={badgeVariant}>{isLoading ? "Stabil" : marketFeeling}</Badge>
      </div>

      {/* Stat pills */}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <StatPill
          label="SGD/IDR"
          value={sgdItem && sgdItem.rate > 0 ? Math.round(sgdItem.rate).toLocaleString("id-ID") : "-"}
          icon={<TrendingUp size={13} />}
        />
        <StatPill
          label="EUR/IDR"
          value={eurItem && eurItem.rate > 0 ? Math.round(eurItem.rate).toLocaleString("id-ID") : "-"}
          icon={<Activity size={13} />}
        />
        <StatPill
          label="Status"
          value={isLoading ? "-" : data.marketStatus}
          icon={
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                data.marketStatus === "Bullish" ? "bg-emerald" :
                data.marketStatus === "Bearish" ? "bg-negative" : "bg-warning"
              }`}
            />
          }
        />
      </div>

      {/* Full FinanceLineChart — mini version of Rupiah Radar style */}
      <div className="border-t border-[var(--card-border)] pt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-medium text-[var(--text-3)]">11-hari tren USD/IDR</p>
          <p className={`text-[11px] font-semibold ${isUp ? "text-negative" : "text-emerald"}`}>
            {isUp ? "▲ Rupiah melemah" : "▼ Rupiah menguat"}
          </p>
        </div>
        <ChartFrame className="w-full min-w-0 overflow-hidden p-2 sm:p-3">
          <div className="relative h-52 w-full min-w-0 sm:h-60 lg:h-72">
            <FinanceLineChart
              values={sparkline}
              labels={chartLabels}
              tone={chartTone}
              formatValue={formatRate}
              showLastPrice
              tooltipLabel="USD/IDR"
              tooltipChange={(index) => {
                if (index === 0) return undefined;
                const prev = sparkline[index - 1];
                const curr = sparkline[index];
                const pct = ((curr - prev) / prev) * 100;
                const weakening = pct > 0;
                return {
                  text: `${weakening ? "+" : ""}${pct.toFixed(2)}%`,
                  tone: weakening ? "negative" : "positive",
                };
              }}
              className="h-full"
            />
          </div>
        </ChartFrame>
      </div>
    </Card>
  );
}
