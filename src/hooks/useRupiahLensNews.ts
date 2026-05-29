"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { EconomicNews } from "@/types/economy";

export type NewsFilter = "Semua" | EconomicNews["category"];

interface InsightResult {
  tone: "optimistic" | "balanced" | "cautious";
  headline: string;
  interpretation: string;
  marketSummary: string;
  highlights: string[];
}

function buildInsight(news: EconomicNews[]): InsightResult {
  const positive = news.filter((item) => item.sentiment === "positive").length;
  const negative = news.filter((item) => item.sentiment === "negative").length;

  if (positive > negative) {
    return {
      tone: "optimistic",
      headline: "Outlook Optimistis Moderat",
      interpretation: "Sentimen positif lebih dominan, menandakan kepercayaan pasar membaik pada kebijakan moneter dan aktivitas konsumsi.",
      marketSummary: "Rupiah cenderung didukung arus data makro yang konstruktif, dengan risiko volatilitas tetap terjaga.",
      highlights: ["Momentum konsumsi domestik terlihat stabil.", "Dukungan pada sektor UMKM meningkat bertahap.", "Tekanan eksternal belum menjadi disrupsi utama."],
    };
  }

  if (negative > positive) {
    return {
      tone: "cautious",
      headline: "Outlook Waspada Terkendali",
      interpretation: "Sentimen negatif lebih menonjol sehingga pasar membutuhkan manajemen risiko yang lebih disiplin pada horizon jangka pendek.",
      marketSummary: "Fokus pada pengendalian biaya dan likuiditas menjadi kunci sampai sinyal stabilisasi kembali menguat.",
      highlights: ["Volatilitas harga pangan perlu dipantau ketat.", "Margin usaha sensitif terhadap perubahan biaya input.", "Strategi cash buffer menjadi prioritas utama."],
    };
  }

  return {
    tone: "balanced",
    headline: "Outlook Berimbang",
    interpretation: "Komposisi sentimen relatif seimbang, menunjukkan pasar bergerak selektif sambil menunggu konfirmasi data ekonomi lanjutan.",
    marketSummary: "Arah rupiah diperkirakan stabil dengan rentang pergerakan moderat pada jangka dekat.",
    highlights: ["Peluang pertumbuhan ada, namun belum merata.", "Sektor defensif masih menarik untuk dijaga.", "Keputusan berbasis data mingguan tetap disarankan."],
  };
}

export function useRupiahLensNews() {
  const [activeFilter, setActiveFilter] = useState<NewsFilter>("Semua");
  const [items, setItems] = useState<EconomicNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/news", { cache: "no-store" });
      const payload = (await response.json()) as { items?: EconomicNews[] };
      setItems(payload.items || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNews();
  }, [loadNews]);

  const categories = useMemo<NewsFilter[]>(() => {
    const uniqueCategories = Array.from(new Set(items.map((item) => item.category)));
    return ["Semua", ...uniqueCategories];
  }, [items]);

  const filteredNews = useMemo(
    () => (activeFilter === "Semua" ? items : items.filter((item) => item.category === activeFilter)),
    [activeFilter, items],
  );

  const featured = useMemo(() => {
    const pool = activeFilter === "Semua" ? items : filteredNews;
    return pool.find((item) => item.featured) ?? pool[0] ?? null;
  }, [activeFilter, items, filteredNews]);

  const insight = useMemo(() => buildInsight(filteredNews), [filteredNews]);

  const setFilterByIndex = useCallback((index: number) => {
    const next = categories[index];
    if (next) setActiveFilter(next);
  }, [categories]);

  return { categories, activeFilter, setFilterByIndex, featured, filteredNews, insight, isLoading, refreshNews: loadNews };
}
