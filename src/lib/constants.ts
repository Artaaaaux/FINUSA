import {
  Home,
  Eye,
  Radar,
  Wallet,
  Shield,
  type LucideIcon,
} from "lucide-react";

/* ========== Navigation ========== */
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    description: "Dashboard utama",
  },
  {
    label: "Rupiah Lens",
    href: "/rupiah-lens",
    icon: Eye,
    description: "Analisis berita ekonomi",
  },
  {
    label: "Rupiah Radar",
    href: "/rupiah-radar",
    icon: Radar,
    description: "Monitor pergerakan rupiah",
  },
  {
    label: "Dompet Aman",
    href: "/dompet-aman",
    icon: Wallet,
    description: "Asisten keuangan AI",
  },
  {
    label: "UMKM Shield",
    href: "/umkm-shield",
    icon: Shield,
    description: "Analisis bisnis UMKM",
  },
];

/* ========== Dummy News Data ========== */
export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
  source: string;
}

export const DUMMY_NEWS: NewsItem[] = [
  {
    id: "1",
    headline: "Bank Indonesia Pertahankan Suku Bunga Acuan di 5,75%",
    summary:
      "Rapat Dewan Gubernur BI memutuskan untuk mempertahankan BI-Rate sebagai langkah menjaga stabilitas nilai tukar rupiah di tengah ketidakpastian global.",
    category: "Kebijakan Moneter",
    date: "23 Mei 2026",
    readTime: "4 min",
    source: "CNBC Indonesia",
  },
  {
    id: "2",
    headline: "Rupiah Menguat Tipis di Tengah Pelemahan Dolar AS",
    summary:
      "Nilai tukar rupiah terhadap dolar AS mengalami penguatan sebesar 0,3% pada perdagangan hari ini seiring melemahnya indeks dolar.",
    category: "Forex",
    date: "23 Mei 2026",
    readTime: "3 min",
    source: "Bisnis.com",
  },
  {
    id: "3",
    headline: "Inflasi Mei 2026 Tercatat 2,8%, Masih dalam Sasaran BI",
    summary:
      "Badan Pusat Statistik mencatat inflasi tahunan Mei 2026 sebesar 2,8% year-on-year, masih dalam target sasaran Bank Indonesia.",
    category: "Ekonomi Makro",
    date: "22 Mei 2026",
    readTime: "5 min",
    source: "Kompas",
  },
  {
    id: "4",
    headline: "Ekspor Indonesia Tumbuh 8,2% pada April 2026",
    summary:
      "Pertumbuhan ekspor didorong oleh komoditas kelapa sawit dan nikel yang mencatat kenaikan signifikan di pasar internasional.",
    category: "Perdagangan",
    date: "22 Mei 2026",
    readTime: "4 min",
    source: "Reuters",
  },
];

/* ========== Rupiah Snapshot Data ========== */
export const RUPIAH_DATA = {
  value: 15450,
  previousValue: 15520,
  change: -70,
  changePercent: -0.45,
  high24h: 15580,
  low24h: 15410,
  marketFeeling: "Optimis" as const,
  lastUpdated: "23 Mei 2026, 14:30 WIB",
  sparkline: [
    15600, 15580, 15550, 15520, 15540, 15510, 15490, 15480, 15500, 15470,
    15460, 15450, 15480, 15460, 15440, 15450,
  ],
};

/* ========== FINA Insight ========== */
export const FINA_INSIGHT = {
  message:
    "Perubahan rupiah minggu ini berpotensi memengaruhi harga barang impor dan sektor tertentu. Sektor manufaktur dan ritel perlu memperhatikan fluktuasi ini untuk strategi pricing yang tepat.",
  topics: ["Nilai Tukar", "Impor", "Manufaktur", "Strategi Harga"],
  confidence: 87,
  timestamp: "23 Mei 2026, 14:00 WIB",
};

/* ========== Feature Cards ========== */
export interface FeatureCard {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Rupiah Lens",
    description:
      "Analisis berita ekonomi dengan kecerdasan AI. Pahami dampak berita terhadap ekonomi Indonesia.",
    href: "/rupiah-lens",
    icon: Eye,
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-primary",
  },
  {
    title: "Rupiah Radar",
    description:
      "Pantau pergerakan rupiah secara real-time dengan grafik interaktif dan analisis tren.",
    href: "/rupiah-radar",
    icon: Radar,
    gradient: "from-emerald/10 to-teal-500/10",
    iconColor: "text-emerald",
  },
  {
    title: "Dompet Aman",
    description:
      "Konsultasikan keuangan Anda dengan FINA, asisten AI yang memahami kondisi ekonomi Indonesia.",
    href: "/dompet-aman",
    icon: Wallet,
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-500",
  },
  {
    title: "UMKM Shield",
    description:
      "Lindungi bisnis UMKM Anda dengan analisis risiko dan rekomendasi strategi berbasis AI.",
    href: "/umkm-shield",
    icon: Shield,
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-warning",
  },
];

/* ========== Rupiah Radar dummy data ========== */
export const RADAR_METRICS = [
  { label: "USD/IDR", value: "15.450", change: -0.45, period: "Hari Ini" },
  { label: "EUR/IDR", value: "16.820", change: 0.12, period: "Hari Ini" },
  { label: "JPY/IDR", value: "110.5", change: -0.22, period: "Hari Ini" },
  { label: "SGD/IDR", value: "11.580", change: 0.08, period: "Hari Ini" },
  { label: "CNY/IDR", value: "2.145", change: -0.31, period: "Hari Ini" },
  { label: "GBP/IDR", value: "19.340", change: 0.55, period: "Hari Ini" },
];

export const CHART_DATA_MONTHLY = [
  { month: "Jan", value: 15800 },
  { month: "Feb", value: 15650 },
  { month: "Mar", value: 15720 },
  { month: "Apr", value: 15580 },
  { month: "Mei", value: 15450 },
];

/* ========== Dompet Aman dummy messages ========== */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const DUMMY_CHAT: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Halo FINA, apakah saat ini waktu yang tepat untuk menabung dalam dolar?",
    timestamp: "14:20",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Halo! Pertanyaan yang menarik. Berdasarkan analisis saya, saat ini rupiah sedang dalam tren penguatan terhadap dolar AS. Kurs USD/IDR turun 0,45% hari ini ke level Rp15.450.\n\nBeberapa pertimbangan:\n\n1. **Jangka Pendek**: Rupiah berpotensi melanjutkan penguatan karena data inflasi yang terkendali\n2. **Jangka Menengah**: Kebijakan BI yang stabil memberikan dukungan terhadap rupiah\n3. **Diversifikasi**: Alokasi 10-20% dalam mata uang asing tetap disarankan untuk diversifikasi\n\nApakah Anda ingin saya memberikan analisis lebih detail?",
    timestamp: "14:21",
  },
  {
    id: "3",
    role: "user",
    content: "Bagaimana dengan dampak inflasi terhadap tabungan saya?",
    timestamp: "14:23",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "Inflasi saat ini tercatat 2,8% year-on-year — masih dalam target BI (2-4%). Artinya daya beli uang Anda menurun sekitar 2,8% per tahun.\n\n**Perbandingan return vs inflasi:**\n- 💰 Deposito: ~4,5% — masih di atas inflasi\n- 📈 Obligasi Negara (SBN): ~6,2% — cukup aman\n- 🏦 Tabungan biasa: ~1,5% — di bawah inflasi\n\n**Rekomendasi**: Pertimbangkan untuk memindahkan sebagian dana dari tabungan biasa ke deposito atau SBN agar nilai tabungan Anda tetap terjaga dari inflasi.",
    timestamp: "14:24",
  },
];

/* ========== UMKM Shield dummy data ========== */
export const UMKM_RISK_FACTORS = [
  { factor: "Risiko Nilai Tukar", level: "Sedang", score: 65, color: "text-warning" },
  { factor: "Risiko Inflasi", level: "Rendah", score: 35, color: "text-emerald" },
  { factor: "Risiko Suku Bunga", level: "Rendah", score: 40, color: "text-emerald" },
  { factor: "Risiko Pasar", level: "Tinggi", score: 78, color: "text-negative" },
  { factor: "Risiko Likuiditas", level: "Sedang", score: 55, color: "text-warning" },
];

export const UMKM_BUSINESS_TYPES = [
  "Makanan & Minuman",
  "Fashion & Tekstil",
  "Kerajinan Tangan",
  "Teknologi & Digital",
  "Pertanian & Perikanan",
  "Jasa & Layanan",
  "Perdagangan Umum",
  "Manufaktur",
];
