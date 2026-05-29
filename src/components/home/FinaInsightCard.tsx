"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useExchangeRates } from "@/hooks/useExchangeRates";

export function FinaInsightCard() {
  const { data, isLoading } = useExchangeRates();

  const usdItem = data.items.find((item) => item.code === "USD");
  const value = usdItem && usdItem.rate > 0 ? usdItem.rate : 15450;
  const changePercent = usdItem ? usdItem.changePercent : -0.45;
  const rupiahWeakened = changePercent > 0; // If USD rate is higher, rupiah weakened

  // Formulate dynamic message
  let message = "Perubahan rupiah minggu ini berpotensi memengaruhi harga barang impor dan sektor tertentu. Sektor manufaktur dan ritel perlu memperhatikan fluktuasi ini untuk strategi pricing yang tepat.";
  let confidence = 87;
  let topics = ["Nilai Tukar", "Impor", "Manufaktur", "Strategi Harga"];

  if (!isLoading) {
    if (rupiahWeakened) {
      message = `Rupiah terpantau terdepresiasi tipis ke Rp${Math.round(value).toLocaleString("id-ID")} (+${changePercent.toFixed(2)}%). Tekanan eksternal mendesak sektor manufaktur dengan HPP impor tinggi untuk memantau cash buffer dan mempertimbangkan substitusi bahan baku lokal.`;
      confidence = 91;
      topics = ["Depresiasi Rupiah", "Bahan Impor", "Cash Buffer", "Manufaktur"];
    } else {
      message = `Tren penguatan Rupiah ke Rp${Math.round(value).toLocaleString("id-ID")} (${changePercent.toFixed(2)}%) berdaruh positif bagi kepercayaan pelaku pasar. Inflasi inti 2.8% yang terjaga memberikan peluang emas bagi sektor ritel dan UMKM domestik meningkatkan pasokan.`;
      confidence = 94;
      topics = ["Apresiasi Rupiah", "Inflasi Stabil", "Ritel & UMKM", "Ekspansi Bisnis"];
    }
  }

  return (
    <Card title="FINA Insight" subtitle={isLoading ? "Menganalisis..." : `Confidence ${confidence}%`}>
      <p className="text-sm leading-6 text-[var(--text-2)]">{message}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Badge key={topic} variant="neutral">{topic}</Badge>
        ))}
      </div>
    </Card>
  );
}
