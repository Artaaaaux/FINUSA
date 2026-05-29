export type SupportedCurrency = "USD" | "SGD" | "EUR" | "JPY";
export type MarketStatus = "Bullish" | "Stable" | "Bearish";

export interface CurrencySnapshot {
  code: SupportedCurrency;
  rate: number;
  changePercent: number;
}

export interface RupiahRadarData {
  asOfDate: string;
  updatedAt: string;
  marketStatus: MarketStatus;
  items: CurrencySnapshot[];
}

export type NewsSentiment = "positive" | "neutral" | "negative";

export interface EconomicNews {
  id: string;
  title: string;
  source: string;
  image: string;
  description: string;
  category: "Moneter" | "Inflasi" | "Perdagangan" | "UMKM" | "Fiskal";
  sentiment: NewsSentiment;
  featured: boolean;
  articleUrl: string;
  date: string;
}
