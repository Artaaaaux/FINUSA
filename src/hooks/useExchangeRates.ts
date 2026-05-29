"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RupiahRadarData, SupportedCurrency } from "@/types/economy";

const FALLBACK_CODES: SupportedCurrency[] = ["USD", "SGD", "EUR", "JPY"];
const COOLDOWN_SECONDS = 60;

const FALLBACK_DATA: RupiahRadarData = {
  asOfDate: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  marketStatus: "Stable",
  items: FALLBACK_CODES.map((code) => ({ code, rate: 0, changePercent: 0 })),
};

type MarketApiResponse = RupiahRadarData & { error?: string };

export function useExchangeRates() {
  const [data, setData] = useState<RupiahRadarData>(FALLBACK_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshAt, setLastRefreshAt] = useState<number | null>(null);
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const cooldownRemaining = useMemo(() => {
    if (!lastRefreshAt) return 0;
    const elapsed = Math.floor((nowTick - lastRefreshAt) / 1000);
    return Math.max(0, COOLDOWN_SECONDS - elapsed);
  }, [lastRefreshAt, nowTick]);

  const canRefresh = cooldownRemaining === 0 && !isRefreshing;

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/market?t=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json()) as MarketApiResponse;

      if (!response.ok) {
        throw new Error("Gagal memuat data pasar.");
      }

      setData(payload);
      if (payload.error) {
        setError(payload.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat kurs rupiah.");
      setData(FALLBACK_DATA);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (!canRefresh) return;

    try {
      setIsRefreshing(true);
      setError(null);

      const response = await fetch(`/api/market?t=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json()) as MarketApiResponse;

      if (!response.ok) {
        throw new Error("Gagal memuat data pasar.");
      }

      setData(payload);
      setLastRefreshAt(Date.now());
      if (payload.error) {
        setError(payload.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat refresh data.");
    } finally {
      setIsRefreshing(false);
    }
  }, [canRefresh]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    cooldownRemaining,
    canRefresh,
    refetch,
  };
}
