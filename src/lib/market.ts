import type { CurrencySnapshot, MarketStatus, RupiahRadarData, SupportedCurrency } from "@/types/economy";

interface FxApiPairResponse {
  base: string;
  target: string;
  rate: number;
  timestamp: string;
}

interface FxApiHistoryRate {
  date: string;
  rate: number;
}

interface FxApiHistoryResponse {
  rates?: FxApiHistoryRate[];
}

const FXAPI_BASE_URL = "https://fxapi.app/api";

const MARKET_PAIRS: Array<{ code: SupportedCurrency; base: string; target: string }> = [
  { code: "USD", base: "USD", target: "IDR" },
  { code: "SGD", base: "SGD", target: "IDR" },
  { code: "EUR", base: "EUR", target: "IDR" },
  { code: "JPY", base: "JPY", target: "IDR" },
];

function isoDate(daysOffset = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysOffset);
  return date.toISOString().slice(0, 10);
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { method: "GET", cache: "no-store" });
  if (!response.ok) {
    throw new Error(`FXAPI request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

async function fetchPairRate(base: string, target: string) {
  const url = `${FXAPI_BASE_URL}/${base}/${target}.json`;
  return fetchJson<FxApiPairResponse>(url);
}

async function fetchPairHistoryChange(base: string, target: string) {
  const from = isoDate(-2);
  const to = isoDate(0);
  const url = `${FXAPI_BASE_URL}/history/${base}/${target}.json?from=${from}&to=${to}`;

  try {
    const history = await fetchJson<FxApiHistoryResponse>(url);
    const rates = history.rates ?? [];

    if (rates.length < 2) return 0;

    const sorted = [...rates].sort((a, b) => a.date.localeCompare(b.date));
    const previous = sorted[sorted.length - 2]?.rate;
    const latest = sorted[sorted.length - 1]?.rate;

    if (!previous || !latest || previous === 0) return 0;
    return ((latest - previous) / previous) * 100;
  } catch {
    return 0;
  }
}

function deriveMarketStatus(items: CurrencySnapshot[]): MarketStatus {
  if (items.length === 0) return "Stable";

  const averageChange = items.reduce((sum, item) => sum + item.changePercent, 0) / items.length;

  if (averageChange <= -0.1) return "Bullish";
  if (averageChange >= 0.1) return "Bearish";
  return "Stable";
}

export async function fetchFxMarketData(): Promise<RupiahRadarData> {
  const pairResults = await Promise.all(
    MARKET_PAIRS.map(async ({ code, base, target }) => {
      const [pair, changePercent] = await Promise.all([
        fetchPairRate(base, target),
        fetchPairHistoryChange(base, target),
      ]);

      return {
        code,
        rate: Number(pair.rate) || 0,
        changePercent,
        timestamp: pair.timestamp,
      };
    }),
  );

  const fallbackIsoNow = new Date().toISOString();
  const latestTimestamp =
    pairResults
      .map((item) => item.timestamp)
      .filter((timestamp) => Boolean(timestamp))
      .sort()
      .at(-1) ?? fallbackIsoNow;

  const items: CurrencySnapshot[] = pairResults.map(({ code, rate, changePercent }) => ({
    code,
    rate,
    changePercent,
  }));

  return {
    asOfDate: latestTimestamp,
    updatedAt: fallbackIsoNow,
    marketStatus: deriveMarketStatus(items),
    items,
  };
}
