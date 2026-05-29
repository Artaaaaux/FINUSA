import type { RupiahRadarData, SupportedCurrency } from "@/types/economy";

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

const FRANKFURTER_BASE_URL = "https://api.frankfurter.app";
const TARGETS: SupportedCurrency[] = ["USD", "SGD", "EUR", "JPY"];

function toRadarRates(rates: Record<string, number>) {
  const idrPerEur = rates.IDR;

  if (!idrPerEur) {
    throw new Error("Data IDR tidak tersedia dari Frankfurter API.");
  }

  return TARGETS.map((code) => {
    const baseRate = rates[code];
    if (!baseRate) {
      throw new Error(`Data ${code} tidak tersedia dari Frankfurter API.`);
    }

    return {
      code,
      rate: idrPerEur / baseRate,
    };
  });
}

async function fetchRatesAt(datePath: string) {
  const query = "from=EUR&to=IDR,USD,SGD,JPY";
  const url = `${FRANKFURTER_BASE_URL}/${datePath}?${query}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Gagal mengambil data kurs dari Frankfurter API.");
  }

  return (await response.json()) as FrankfurterResponse;
}

export async function fetchRupiahRadarData(): Promise<RupiahRadarData> {
  const latest = await fetchRatesAt("latest");

  const previousDate = new Date();
  previousDate.setDate(previousDate.getDate() - 1);
  const datePath = previousDate.toISOString().slice(0, 10);
  const previous = await fetchRatesAt(datePath);

  const latestRates = toRadarRates(latest.rates);
  const previousRates = toRadarRates(previous.rates);

  return {
    asOfDate: latest.date,
    updatedAt: new Date().toISOString(),
    marketStatus: "Stable",
    items: latestRates.map((item) => {
      const previousItem = previousRates.find((entry) => entry.code === item.code);
      const previousRate = previousItem?.rate ?? item.rate;
      const changePercent = previousRate === 0 ? 0 : ((item.rate - previousRate) / previousRate) * 100;

      return {
        code: item.code,
        rate: item.rate,
        changePercent,
      };
    }),
  };
}
