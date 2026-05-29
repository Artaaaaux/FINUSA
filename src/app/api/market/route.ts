import { NextResponse } from "next/server";
import { fetchFxMarketData } from "@/lib/market";
import type { RupiahRadarData, SupportedCurrency } from "@/types/economy";

const FALLBACK_CODES: SupportedCurrency[] = ["USD", "SGD", "EUR", "JPY"];

const FALLBACK_DATA: RupiahRadarData = {
  asOfDate: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  marketStatus: "Stable",
  items: FALLBACK_CODES.map((code) => ({ code, rate: 0, changePercent: 0 })),
};

export async function GET() {
  try {
    const payload = await fetchFxMarketData();
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat data pasar dari fxapi.";
    return NextResponse.json({ ...FALLBACK_DATA, error: message }, { status: 200 });
  }
}
