"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, CandlestickChart, Gauge, RefreshCcw, Waves } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { FeaturePageHeader, FilterTabs, TrendPill } from "@/components/features/FeatureBlocks";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { resolveDeltaTone, resolveMarketTone } from "@/lib/chart-theme";
import { ChartFrame } from "@/components/charts/ChartPrimitives";
import { FinanceLineChart } from "@/components/charts/FinanceLineChart";

function formatRate(value: number) {
  if (value <= 0) return "-";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(value);
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(date);
}

function synthesizeHistory(liveRate: number, changePercent: number, points = 10): number[] {
  const values: number[] = [];
  const startRate = liveRate / (1 + changePercent / 100);
  const volatility = Math.abs(liveRate * 0.003);
  let seed = Math.round(liveRate * 100);
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < points - 1; i++) {
    const progress = i / (points - 1);
    const base = startRate + (liveRate - startRate) * progress;
    const noise = (rand() - 0.5) * 2 * volatility;
    values.push(Math.max(0, base + noise));
  }
  values.push(liveRate);
  return values;
}

function generateDateLabels(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (count - 1 - i));
    return d.toISOString().split("T")[0];
  });
}

const CHART_CURRENCIES = ["USD", "SGD", "EUR", "JPY"] as const;
type ChartCurrency = (typeof CHART_CURRENCIES)[number];

export default function RupiahRadarPage() {
  const { data, isLoading, isRefreshing, error, cooldownRemaining, canRefresh, refetch } = useExchangeRates();
  const [selectedCurrency, setSelectedCurrency] = useState<ChartCurrency>("USD");
  const [selectedMetricTab, setSelectedMetricTab] = useState(0);

  const strongest = data.items.reduce((acc, item) => (item.changePercent < acc.changePercent ? item : acc), data.items[0]);
  const weakest = data.items.reduce((acc, item) => (item.changePercent > acc.changePercent ? item : acc), data.items[0]);
  const statusTone = data.marketStatus !== "Bearish";

  const activeCurrencyItem = useMemo(
    () => data.items.find((item) => item.code === selectedCurrency) ?? data.items[0],
    [data.items, selectedCurrency],
  );

  const { chartValues, chartLabels, chartTone } = useMemo(() => {
    if (!activeCurrencyItem) {
      return { chartValues: [], chartLabels: [], chartTone: resolveMarketTone(data.marketStatus) };
    }
    const values = synthesizeHistory(activeCurrencyItem.rate || 0, activeCurrencyItem.changePercent || 0);
    const labels = generateDateLabels(values.length);
    const tone = resolveDeltaTone(activeCurrencyItem.rate - values[0]);
    return { chartValues: values, chartLabels: labels, chartTone: tone };
  }, [activeCurrencyItem, data.marketStatus]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <FeaturePageHeader
          label="Rupiah Radar"
          title="Currency Monitoring Dashboard"
          description="Pantau kurs rupiah berbasis data live dan identifikasi pergerakan utama pasar secara cepat."
          action={<TrendPill label={isLoading ? "Updating..." : data.marketStatus} positive={statusTone} />}
        />

        <FilterTabs tabs={["Harian", "Mingguan", "Sinyal"]} activeIndex={selectedMetricTab} onChange={setSelectedMetricTab} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          <Card title="Market Status" subtitle="Sumber: fxapi.app">
            <div className="space-y-3">
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-3">
                <p className="text-xs text-[var(--text-3)]">Last Updated</p>
                <p className="mt-1 text-sm font-semibold text-[var(--text-1)] sm:text-base">{formatDateTime(data.updatedAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => void refetch()}
                disabled={!canRefresh || isRefreshing}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--text-2)] transition-all hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:border-[var(--card-border)] disabled:bg-[var(--surface)] disabled:text-[var(--text-3)]"
              >
                <RefreshCcw size={14} className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </button>
              {!canRefresh && <p className="text-xs font-medium text-[var(--text-3)]">Refresh available in {cooldownRemaining}s</p>}
            </div>
          </Card>

          <Card title="Trend Indicators" subtitle="Perubahan vs candle sebelumnya">
            <div className="grid grid-cols-1 gap-2 text-center sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--card-border)] bg-[var(--surface)] p-3">
                <Gauge size={16} className="mx-auto text-primary" />
                <p className="mt-2 text-xs text-[var(--text-2)]">Strongest</p>
                <p className="text-sm font-semibold text-[var(--text-1)]">{strongest?.code ?? "-"}</p>
              </div>
              <div className="rounded-lg border border-[var(--card-border)] bg-[var(--surface)] p-3">
                <Waves size={16} className="mx-auto text-emerald" />
                <p className="mt-2 text-xs text-[var(--text-2)]">Weakest</p>
                <p className="text-sm font-semibold text-[var(--text-1)]">{weakest?.code ?? "-"}</p>
              </div>
              <div className="rounded-lg border border-[var(--card-border)] bg-[var(--surface)] p-3">
                <Activity size={16} className="mx-auto text-warning" />
                <p className="mt-2 text-xs text-[var(--text-2)]">Pairs</p>
                <p className="text-sm font-semibold text-[var(--text-1)]">{data.items.length}</p>
              </div>
            </div>
          </Card>

          <Card title="System Status" subtitle="Kualitas data pasar">
            <div
              className={`rounded-xl border p-4 ${
                error
                  ? "border-red-200/80 bg-red-50/80 dark:border-red-400/30 dark:bg-red-500/10"
                  : "border-blue-200/80 bg-blue-50/60 dark:border-blue-400/30 dark:bg-blue-500/10"
              }`}
            >
              <p className="text-sm leading-6 text-[var(--text-2)]">{error ? error : `Data kurs live aktif. Kondisi pasar saat ini: ${data.marketStatus}.`}</p>
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr] xl:gap-6">
          <Card
            title={`${selectedCurrency}/IDR Trend Chart`}
            subtitle={`10-hari terakhir - As of ${formatDateTime(data.asOfDate)}`}
            action={<CandlestickChart size={16} className="text-primary" />}
          >
            <ChartFrame className="w-full min-w-0 overflow-hidden p-2 sm:p-3">
              <div className="relative h-52 w-full min-w-0 sm:h-60 lg:h-72">
                {chartValues.length > 0 ? (
                  <FinanceLineChart
                    values={chartValues}
                    labels={chartLabels}
                    tone={chartTone}
                    formatValue={formatRate}
                    showLastPrice
                    tooltipLabel={`${selectedCurrency}/IDR`}
                    tooltipChange={(index) => {
                      if (index === 0) return undefined;
                      const prev = chartValues[index - 1];
                      const curr = chartValues[index];
                      const pct = ((curr - prev) / prev) * 100;
                      const weakening = pct > 0;
                      return { text: `${weakening ? "+" : ""}${pct.toFixed(2)}%`, tone: weakening ? "negative" : "positive" };
                    }}
                    className="h-full"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[var(--text-3)]">Mengambil data...</div>
                )}
              </div>
            </ChartFrame>
          </Card>

          <Card title="Monitoring Cards" subtitle="USD, SGD, EUR, JPY terhadap IDR">
            <div className="space-y-2">
              {isLoading && <p className="text-sm text-[var(--text-3)]">Mengambil kurs terbaru...</p>}
              {data.items.map((item) => {
                const rupiahWeakening = item.changePercent > 0;
                const isSelected = item.code === selectedCurrency;
                const isCurrencyCard = CHART_CURRENCIES.includes(item.code as ChartCurrency);

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      if (isCurrencyCard) setSelectedCurrency(item.code as ChartCurrency);
                    }}
                    className={[
                      "flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-all duration-200",
                      isCurrencyCard ? "cursor-pointer" : "cursor-default",
                      isSelected
                        ? "border-primary/40 bg-primary/5 shadow-sm ring-1 ring-primary/20"
                        : "border-[var(--card-border)] bg-[var(--surface)] hover:border-primary/20 hover:bg-[var(--surface-hover)]",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${isSelected ? "text-primary" : "text-[var(--text-1)]"}`}>
                        {item.code}/IDR
                        {isSelected && <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">Active</span>}
                      </p>
                      <p className="truncate text-xs text-[var(--text-3)]">Updated {formatDateTime(data.updatedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-[var(--text-1)]"}`}>{formatRate(item.rate)}</p>
                      <p className={`inline-flex items-center gap-1 text-xs ${rupiahWeakening ? "text-negative" : "text-emerald"}`}>
                        {rupiahWeakening ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(item.changePercent).toFixed(2)}%
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
