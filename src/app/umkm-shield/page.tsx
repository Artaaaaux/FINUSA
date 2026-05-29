"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, BriefcaseBusiness, CircleCheckBig, Lightbulb, ShieldCheck, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UMKM_BUSINESS_TYPES } from "@/lib/constants";
import { FeaturePageHeader, TrendPill } from "@/components/features/FeatureBlocks";

interface RiskFactor {
  factor: string;
  level: "Rendah" | "Sedang" | "Tinggi";
  score: number;
  color: string;
}

export default function UmkmShieldPage() {
  const [businessName, setBusinessName] = useState<string>("Kopi Nusantara Sejahtera");
  const [sector, setSector] = useState<string>("Makanan & Minuman");
  const [turnoverText, setTurnoverText] = useState<string>("145.000.000");
  const [importPercent, setImportPercent] = useState<number>(32);

  // Calculated state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [healthScore, setHealthScore] = useState<number>(78);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    { factor: "Risiko Nilai Tukar", level: "Sedang", score: 65, color: "text-warning" },
    { factor: "Risiko Inflasi", level: "Rendah", score: 35, color: "text-emerald" },
    { factor: "Risiko Suku Bunga", level: "Rendah", score: 40, color: "text-emerald" },
    { factor: "Risiko Pasar", level: "Tinggi", score: 78, color: "text-negative" },
    { factor: "Risiko Likuiditas", level: "Sedang", score: 55, color: "text-warning" },
  ]);
  const [insights, setInsights] = useState<string[]>([
    "Eksposur kurs masih terkendali. Komponen impor 32% masih dapat dikelola dengan buffer stok 4-6 minggu.",
    "Peluang efisiensi biaya distribusi. Penurunan harga energi dapat menekan biaya logistik dalam 1-2 siklus pengiriman."
  ]);
  const [recommendations, setRecommendations] = useState<string[]>([
    "Negosiasikan kontrak pasokan jangka menengah untuk mengunci harga bahan baku utama.",
    "Alokasikan 12% kas operasional ke dana cadangan volatilitas untuk kuartal berikutnya.",
    "Terapkan review risiko mingguan berbasis sinyal Rupiah Lens dan Rupiah Radar."
  ]);

  // Clean numerical parsing helper
  const parseTurnover = (text: string): number => {
    const numbersOnly = text.replace(/[^0-9]/g, "");
    return Number(numbersOnly) || 15000000;
  };

  // Run dynamic analysis calculations
  const calculateAnalysis = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const revenue = parseTurnover(turnoverText);
      
      // 1. RISK NILAI TUKAR (Depends on import percentage)
      let exchangeScore = Math.min(95, Math.max(10, importPercent * 2.2 + Math.random() * 8));
      let exchangeLevel: "Rendah" | "Sedang" | "Tinggi" = "Rendah";
      let exchangeColor = "text-emerald";
      if (exchangeScore > 65) {
        exchangeLevel = "Tinggi";
        exchangeColor = "text-negative";
      } else if (exchangeScore > 35) {
        exchangeLevel = "Sedang";
        exchangeColor = "text-warning";
      }

      // 2. RISK INFLASI (Depends on sector and imports)
      let inflationBase = 25;
      if (["Makanan & Minuman", "Pertanian & Perikanan", "Fashion & Tekstil"].includes(sector)) {
        inflationBase += 25;
      }
      let inflationScore = Math.min(90, Math.max(15, inflationBase + importPercent * 0.5 + Math.random() * 10));
      let inflationLevel: "Rendah" | "Sedang" | "Tinggi" = "Rendah";
      let inflationColor = "text-emerald";
      if (inflationScore > 60) {
        inflationLevel = "Tinggi";
        inflationColor = "text-negative";
      } else if (inflationScore > 30) {
        inflationLevel = "Sedang";
        inflationColor = "text-warning";
      }

      // 3. RISK SUKU BUNGA (Capital intensive sectors)
      let rateBase = 20;
      if (["Teknologi & Digital", "Manufaktur"].includes(sector)) {
        rateBase += 25;
      }
      if (revenue < 30000000) {
        rateBase += 15; // Small businesses struggle with higher rate lending
      }
      let rateScore = Math.min(95, Math.max(10, rateBase + Math.random() * 12));
      let rateLevel: "Rendah" | "Sedang" | "Tinggi" = "Rendah";
      let rateColor = "text-emerald";
      if (rateScore > 60) {
        rateLevel = "Tinggi";
        rateColor = "text-negative";
      } else if (rateScore > 35) {
        rateLevel = "Sedang";
        rateColor = "text-warning";
      }

      // 4. RISK PASAR (Sectors with high consumer choice or competition)
      let marketBase = 30;
      if (["Makanan & Minuman", "Fashion & Tekstil", "Kerajinan Tangan"].includes(sector)) {
        marketBase += 30;
      }
      let marketScore = Math.min(98, Math.max(15, marketBase + Math.random() * 15));
      let marketLevel: "Rendah" | "Sedang" | "Tinggi" = "Rendah";
      let marketColor = "text-emerald";
      if (marketScore > 70) {
        marketLevel = "Tinggi";
        marketColor = "text-negative";
      } else if (marketScore > 40) {
        marketLevel = "Sedang";
        marketColor = "text-warning";
      }

      // 5. RISK LIKUIDITAS (Inversely proportional to turnover)
      let liquidityScore = 30;
      if (revenue < 25000000) {
        liquidityScore = 80;
      } else if (revenue < 75000000) {
        liquidityScore = 55;
      } else if (revenue < 150000000) {
        liquidityScore = 40;
      } else {
        liquidityScore = 20;
      }
      liquidityScore = Math.min(95, Math.max(10, liquidityScore + Math.random() * 10));
      let liquidityLevel: "Rendah" | "Sedang" | "Tinggi" = "Rendah";
      let liquidityColor = "text-emerald";
      if (liquidityScore > 65) {
        liquidityLevel = "Tinggi";
        liquidityColor = "text-negative";
      } else if (liquidityScore > 35) {
        liquidityLevel = "Sedang";
        liquidityColor = "text-warning";
      }

      // HEALTH SCORE (Inverse of average risk)
      const avgRisk = (exchangeScore + inflationScore + rateScore + marketScore + liquidityScore) / 5;
      const score = Math.round(100 - avgRisk * 0.6);

      // Generate dynamic insights
      const newInsights: string[] = [];
      if (importPercent > 35) {
        newInsights.push(`Eksposur nilai tukar yang tinggi (${importPercent}%) pada bahan baku meningkatkan kerentanan HPP terhadap volatilitas Rupiah.`);
      } else if (importPercent > 10) {
        newInsights.push(`Eksposur bahan baku impor moderat (${importPercent}%). Volatilitas Rupiah jangka pendek masih dapat diserap oleh cadangan stok 4 minggu.`);
      } else {
        newInsights.push(`Ketergantungan impor sangat rendah (${importPercent}%). Bisnis Anda memiliki keunggulan kompetitif alami dalam ketahanan kurs.`);
      }

      if (sector === "Makanan & Minuman") {
        newInsights.push("Sektor F&B memiliki sensitivitas tinggi terhadap inflasi komoditas pangan segar domestik. Amankan rantai pasok.");
      } else if (sector === "Teknologi & Digital") {
        newInsights.push("Sektor Digital sensitif terhadap siklus pendanaan dan perubahan daya beli diskresioner pasar.");
      } else if (sector === "Pertanian & Perikanan") {
        newInsights.push("Sektor agrikultur rentan terhadap faktor cuaca dan inflasi pupuk/logistik angkutan.");
      } else {
        newInsights.push("Sektor operasional Anda cenderung stabil, dengan perhatian utama tetap pada volume transaksi ritel bulanan.");
      }

      if (revenue < 30000000) {
        newInsights.push("Skala omzet tergolong mikro. Prioritaskan percepatan perputaran piutang pelanggan untuk melonggarkan arus kas.");
      } else {
        newInsights.push("Skala omzet memadai untuk membentuk dana cadangan likuid jangka menengah guna menangkap peluang ekspansi.");
      }

      // Generate dynamic recommendations
      const newRecs: string[] = [];
      if (importPercent > 25) {
        newRecs.push("Jajaki opsi substitusi bahan baku lokal atau negosiasikan kontrak harga tetap (fixed-price contract) jangka menengah dengan importir.");
      } else {
        newRecs.push("Manfaatkan struktur biaya lokal Anda untuk mempromosikan stabilitas harga jual dibandingkan kompetitor.");
      }

      if (revenue < 50000000) {
        newRecs.push("Alokasikan minimal 15% dari laba bersih bulanan khusus untuk dana cadangan darurat (kas buffer) hingga mencapai target operasional 3 bulan.");
      } else {
        newRecs.push("Optimalkan penempatan dana mengendap (idle cash) ke instrumen reksa dana pasar uang (RDPU) atau SBN jangka pendek untuk mengalahkan inflasi.");
      }

      if (sector === "Makanan & Minuman" || sector === "Fashion & Tekstil") {
        newRecs.push("Fokus pada diversifikasi menu/katalog dengan opsi ekonomis (bundling package) untuk menjaga loyalitas pelanggan di tengah fluktuasi inflasi.");
      }

      newRecs.push("Lakukan pemantauan mingguan sinyal moneter di Rupiah Lens dan pergerakan tren valas di Rupiah Radar FINUSA.");

      // Save states
      setHealthScore(score);
      setRiskFactors([
        { factor: "Risiko Nilai Tukar", level: exchangeLevel, score: Math.round(exchangeScore), color: exchangeColor },
        { factor: "Risiko Inflasi", level: inflationLevel, score: Math.round(inflationScore), color: inflationColor },
        { factor: "Risiko Suku Bunga", level: rateLevel, score: Math.round(rateScore), color: rateColor },
        { factor: "Risiko Pasar", level: marketLevel, score: Math.round(marketScore), color: marketColor },
        { factor: "Risiko Likuiditas", level: liquidityLevel, score: Math.round(liquidityScore), color: liquidityColor },
      ]);
      setInsights(newInsights);
      setRecommendations(newRecs);
      setIsAnalyzing(false);
    }, 1200);
  };

  // Run initial calculations on mount
  useEffect(() => {
    // Only pre-calculate once to show fresh data
    const revenue = parseTurnover(turnoverText);
    const avgRisk = (65 + 35 + 40 + 78 + 55) / 5;
    setHealthScore(Math.round(100 - avgRisk * 0.6));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <FeaturePageHeader
          label="UMKM Shield"
          title="Business Risk & Insight Dashboard"
          description="Masukkan profil bisnis, lihat indikator risiko utama, dan dapatkan rekomendasi strategis berbasis AI untuk memperkuat daya tahan UMKM."
          action={<TrendPill label={`Business Health ${healthScore}/100`} positive={healthScore >= 70} />}
        />

        <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr] xl:gap-6">
          <Card title="Business Input" subtitle="Data dasar untuk analisis AI" action={<BriefcaseBusiness size={16} className="text-primary" />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-2)]">
                Nama Usaha
                <input 
                  type="text"
                  value={businessName} 
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Masukkan nama usaha..."
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm font-medium text-[var(--text-1)] outline-none transition-all duration-200 focus:border-primary/50 focus:bg-[var(--card)]" 
                />
              </label>

              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-2)]">
                Sektor
                <select 
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm font-medium text-[var(--text-1)] outline-none transition-all duration-200 focus:border-primary/50 focus:bg-[var(--card)]"
                >
                  {UMKM_BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-2)]">
                Omzet Bulanan (Rp)
                <input 
                  type="text"
                  value={turnoverText} 
                  onChange={(e) => setTurnoverText(e.target.value)}
                  placeholder="Misal: 45.000.000"
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm font-medium text-[var(--text-1)] outline-none transition-all duration-200 focus:border-primary/50 focus:bg-[var(--card)]" 
                />
              </label>

              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-2)]">
                Komponen Bahan Impor ({importPercent}%)
                <div className="flex items-center gap-3 mt-1">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={importPercent}
                    onChange={(e) => setImportPercent(Number(e.target.value))}
                    className="flex-1 accent-primary h-1.5 rounded-full bg-[var(--card-border-soft)]"
                  />
                  <span className="text-sm font-semibold text-[var(--text-1)] w-8 text-right">{importPercent}%</span>
                </div>
              </label>
            </div>

            <Button 
              onClick={calculateAnalysis} 
              disabled={isAnalyzing || !businessName.trim()} 
              className="mt-5 w-full font-semibold flex items-center justify-center gap-2 py-3"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Menganalisis Profil Usaha...
                </>
              ) : (
                "Generate AI Insight"
              )}
            </Button>
          </Card>

          <Card title="Risk Indicators" subtitle="Pemantauan faktor risiko bisnis" action={<AlertTriangle size={16} className="text-warning" />}>
            <div className="space-y-3">
              {riskFactors.map((risk) => {
                const barBg = 
                  risk.level === "Tinggi" 
                    ? "bg-negative" 
                    : risk.level === "Sedang" 
                      ? "bg-warning" 
                      : "bg-emerald";
                return (
                  <div key={risk.factor} className="rounded-xl border border-[var(--card-border-soft)] bg-[var(--surface)] p-3.5">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-[var(--text-1)]">{risk.factor}</p>
                      <span className={`text-xs font-bold ${risk.color}`}>{risk.level} ({risk.score}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--card)] overflow-hidden">
                      <div className={`h-2 rounded-full ${barBg} transition-all duration-500 ease-out`} style={{ width: `${risk.score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-2 xl:gap-6">
          <Card title="Insight Cards" subtitle="Temuan penting untuk operasional">
            <div className="space-y-3">
              {insights.map((insightText, index) => (
                <div key={index} className="rounded-xl border border-[var(--card-border-soft)] bg-[var(--surface)] p-4 transition-all duration-250 hover:border-primary/20 hover:bg-[var(--card)]">
                  <p className="text-sm font-bold text-[var(--text-1)] tracking-tight">Temuan Analitis #{index + 1}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-2)]">{insightText}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Recommendations" subtitle="Langkah strategis yang disarankan" action={<Lightbulb size={16} className="text-primary" />}>
            <ul className="space-y-3 text-sm text-[var(--text-2)]">
              {recommendations.map((recText, index) => {
                const isShield = index === recommendations.length - 1;
                return (
                  <li key={index} className="flex items-start gap-3 rounded-xl border border-[var(--card-border-soft)] bg-[var(--surface)] p-3.5 hover:bg-[var(--card)] transition-colors duration-150">
                    {isShield ? (
                      <ShieldCheck size={16} className="mt-0.5 shrink-0 text-primary" />
                    ) : (
                      <CircleCheckBig size={16} className="mt-0.5 shrink-0 text-emerald" />
                    )}
                    <span>{recText}</span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
