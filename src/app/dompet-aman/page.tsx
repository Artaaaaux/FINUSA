"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, Clock3, MessageSquare, SendHorizontal, Sparkles, UserCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FeaturePageHeader, FilterTabs } from "@/components/features/FeatureBlocks";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface FaqQuestion {
  question: string;
  answer: string;
  category: "Financial Basics" | "Saving" | "Investing" | "Personal Finance" | "Economic Awareness";
  popular?: boolean;
}

const FAQ_QUESTIONS: FaqQuestion[] = [
  {
    category: "Financial Basics",
    question: "Apa itu inflasi?",
    popular: true,
    answer:
      "Inflasi adalah kondisi saat harga barang dan layanan naik secara bertahap. Dampaknya, uang yang sama bisa membeli lebih sedikit dibanding sebelumnya. Karena itu, menabung penting, tapi uang juga perlu ditempatkan dengan bijak agar nilainya tidak terlalu tergerus."
  },
  {
    category: "Financial Basics",
    question: "Kenapa harga barang bisa naik?",
    answer:
      "Harga barang bisa naik karena biaya bahan baku, ongkos kirim, kurs dolar, atau permintaan sedang tinggi. Contohnya, kalau harga beras atau bensin naik, biaya banyak produk lain juga bisa ikut naik. Jadi kenaikan harga biasanya bukan karena satu hal saja."
  },
  {
    category: "Financial Basics",
    question: "Rupiah melemah itu artinya apa?",
    popular: true,
    answer:
      "Rupiah melemah berarti butuh lebih banyak rupiah untuk membeli mata uang lain, misalnya dolar. Efeknya bisa terasa pada barang impor, biaya liburan ke luar negeri, atau produk yang bahan bakunya dari luar negeri. Untuk kebutuhan harian, dampaknya biasanya muncul pelan-pelan lewat harga."
  },
  {
    category: "Financial Basics",
    question: "Dollar naik pengaruhnya ke saya?",
    answer:
      "Kalau dolar naik, barang impor dan produk dengan bahan dari luar negeri bisa jadi lebih mahal. Gadget, biaya kuliah luar negeri, tiket perjalanan, atau bahan baku tertentu bisa ikut terdampak. Kalau tidak punya kebutuhan dolar, tidak perlu panik; cukup pantau pengeluaran dan tetap punya dana darurat."
  },
  {
    category: "Saving",
    question: "Gimana cara mulai nabung?",
    popular: true,
    answer:
      "Mulai dari angka kecil yang realistis. Sisihkan uang segera setelah menerima pemasukan, bukan menunggu sisa akhir bulan. Pakai rekening atau dompet terpisah supaya uang tabungan tidak tercampur dengan uang jajan."
  },
  {
    category: "Saving",
    question: "Berapa persen gaji ideal untuk ditabung?",
    answer:
      "Patokan sederhana: coba mulai dari 10% penghasilan. Kalau sudah nyaman, naikkan perlahan ke 20%. Yang paling penting bukan angka sempurna, tapi konsisten dan tidak membuat kebutuhan utama jadi terganggu."
  },
  {
    category: "Saving",
    question: "Dana darurat itu apa?",
    popular: true,
    answer:
      "Dana darurat adalah uang cadangan untuk kejadian mendadak, seperti sakit, kehilangan pekerjaan, atau kebutuhan keluarga. Target awal yang aman adalah 3 kali pengeluaran bulanan. Simpan di tempat yang mudah dicairkan, bukan di investasi yang naik-turun tajam."
  },
  {
    category: "Investing",
    question: "Investasi aman buat pemula apa?",
    popular: true,
    answer:
      "Untuk pemula, mulai dari instrumen yang risikonya rendah dan mudah dipahami, seperti reksa dana pasar uang, deposito, atau SBN ritel. Jangan mulai dari produk yang menjanjikan untung cepat. Pahami dulu tujuan, risiko, dan kapan uang itu akan dipakai."
  },
  {
    category: "Investing",
    question: "Bedanya saham dan reksa dana?",
    answer:
      "Saham berarti kamu membeli sebagian kecil kepemilikan perusahaan, jadi nilainya bisa naik-turun cukup besar. Reksa dana adalah kumpulan dana banyak orang yang dikelola manajer investasi. Untuk pemula, reksa dana biasanya lebih sederhana karena tidak perlu memilih saham satu per satu."
  },
  {
    category: "Investing",
    question: "Kalau modal kecil mulai dari mana?",
    answer:
      "Mulai dari tujuan dulu, bukan dari besar modal. Kalau uangnya mungkin dipakai dalam waktu dekat, pilih yang rendah risiko seperti reksa dana pasar uang. Kalau untuk jangka panjang, kamu bisa belajar bertahap lewat reksa dana indeks atau saham, dengan nominal kecil yang siap kamu tahan."
  },
  {
    category: "Personal Finance",
    question: "Cara ngatur uang bulanan gimana?",
    answer:
      "Bagi uang ke tiga kelompok: kebutuhan utama, tabungan/investasi, dan hiburan. Catat pengeluaran besar selama 1 bulan supaya kelihatan uang paling banyak habis di mana. Setelah itu, potong pelan-pelan bagian yang paling mudah dikurangi."
  },
  {
    category: "Personal Finance",
    question: "Gimana supaya gak boros?",
    answer:
      "Bikin jeda sebelum membeli barang yang bukan kebutuhan. Simpan dulu di wishlist 24 jam, lalu cek lagi apakah masih benar-benar perlu. Cara lain yang membantu: pisahkan rekening harian dan rekening tabungan supaya uang tidak terasa selalu tersedia."
  },
  {
    category: "Personal Finance",
    question: "Apakah utang selalu buruk?",
    answer:
      "Utang tidak selalu buruk, tapi harus jelas tujuannya dan sanggup dibayar. Utang produktif bisa membantu kalau dipakai untuk hal yang meningkatkan nilai, seperti usaha atau pendidikan. Yang perlu dihindari adalah utang konsumtif berbunga tinggi untuk gaya hidup."
  },
  {
    category: "Economic Awareness",
    question: "Kenapa berita ekonomi penting?",
    answer:
      "Berita ekonomi membantu kamu memahami kenapa harga berubah, kenapa cicilan bisa naik, atau kenapa investasi bergerak. Kamu tidak perlu membaca semuanya. Cukup pahami hal besar seperti inflasi, suku bunga, kurs rupiah, dan harga kebutuhan pokok."
  },
  {
    category: "Economic Awareness",
    question: "BI Rate itu apa?",
    answer:
      "BI Rate adalah suku bunga acuan dari Bank Indonesia. Angka ini bisa memengaruhi bunga pinjaman, deposito, dan arah ekonomi. Saat BI Rate naik, pinjaman bisa terasa lebih mahal; saat turun, bunga kredit biasanya lebih ringan secara bertahap."
  },
  {
    category: "Economic Awareness",
    question: "Inflasi tinggi dampaknya apa?",
    answer:
      "Inflasi tinggi membuat biaya hidup naik lebih cepat. Kalau pemasukan tidak ikut naik, daya beli jadi turun. Dampaknya bisa terasa di belanja bulanan, biaya transportasi, makan, dan kebutuhan keluarga. Karena itu penting punya anggaran, dana darurat, dan tabungan yang disiplin."
  }
];

const CATEGORY_LABELS = ["Financial Basics", "Saving", "Investing", "Personal Finance", "Economic Awareness"] as const;

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "intro-1",
    role: "assistant",
    content:
      "Halo, saya FINA. Pilih pertanyaan di bawah untuk mendapat penjelasan sederhana tentang uang, tabungan, investasi, dan ekonomi sehari-hari.",
    timestamp: "Sekarang"
  }
];

function currentTime() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function DompetAmanPage() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORY_LABELS)[number]>("Financial Basics");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const popularQuestions = FAQ_QUESTIONS.filter((item) => item.popular);
  const categoryQuestions = FAQ_QUESTIONS.filter((item) => item.category === selectedCategory);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const starterPrompt = params.get("prompt");
    if (!starterPrompt) return;

    const matchedQuestion = FAQ_QUESTIONS.find((item) => starterPrompt.toLowerCase().includes(item.question.toLowerCase()));
    if (matchedQuestion) {
      handleSelectQuestion(matchedQuestion);
    }
  }, []);

  const handleSelectQuestion = (item: FaqQuestion) => {
    if (isTyping) return;

    setSelectedQuestion(item.question);
    setSelectedCategory(item.category);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: item.question,
      timestamp: currentTime()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `fina-${Date.now()}`,
        role: "assistant",
        content: item.answer,
        timestamp: currentTime()
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 320);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5">
        <FeaturePageHeader
          label="Dompet Aman"
          title="Dompet Aman"
          description="Pilih pertanyaan finansial dan dapatkan jawaban sederhana dari FINA."
          action={<div className="hidden sm:block"><FilterTabs tabs={["Chat", "Planner", "Insight"]} /></div>}
        />

        <div className="grid min-w-0 gap-4 xl:grid-cols-[280px_1fr] xl:gap-5">
          <div className="order-1 xl:order-1">
            <Card title="Pertanyaan Populer" subtitle="Mulai dari topik yang paling sering ditanyakan">
              <div className="space-y-1.5">
                {popularQuestions.map((item) => (
                  <button
                    key={item.question}
                    type="button"
                    onClick={() => handleSelectQuestion(item)}
                    disabled={isTyping}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm font-medium leading-snug transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                      selectedQuestion === item.question
                        ? "border-primary/30 bg-primary/5 text-primary dark:border-primary/40 dark:bg-primary/10"
                        : "border-[var(--card-border-soft)] bg-[var(--surface)] text-[var(--text-2)] hover:border-primary/20 hover:bg-[var(--card)]"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare size={14} className={`mt-0.5 shrink-0 ${selectedQuestion === item.question ? "text-primary" : "text-[var(--text-3)]"}`} />
                      <span>{item.question}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="order-2 min-w-0 xl:order-2">
            <Card title="FINA Conversation" subtitle="Asisten keuangan ramah pemula" action={<Sparkles size={16} className="text-primary" />}>
              <div className="flex h-[78vh] min-h-[620px] min-w-0 max-w-full flex-col overflow-hidden rounded-xl border border-[var(--card-border-soft)] bg-[var(--surface)]/30 sm:min-h-[680px] xl:h-[72vh] xl:min-h-[620px] xl:max-h-[880px]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--card-border-soft)] bg-[var(--card)]/40 px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--badge-primary-border)] bg-[var(--badge-primary-bg)] text-primary sm:h-9 sm:w-9">
                    <Bot size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-1)]">FINA ASSISTANT</p>
                    <p className="flex items-center gap-1.5 text-xs font-medium text-emerald">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse-soft" />
                      Active - Guided Q&A
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-3)]">
                  <Clock3 size={12} /> Respon cepat
                </span>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 sm:p-4 xl:p-5">
                {messages.map((message) => {
                  const user = message.role === "user";
                  return (
                    <div key={message.id} className={`flex ${user ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[88%] rounded-xl border px-3 py-2 text-sm leading-relaxed shadow-none sm:max-w-[75%] sm:px-3.5 sm:py-2.5 ${
                          user
                            ? "rounded-tr-sm border-primary/10 bg-primary text-white"
                            : "rounded-tl-sm border-[var(--card-border-soft)] bg-[var(--card)] text-[var(--text-1)]"
                        }`}
                      >
                        <div
                          className={`mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${
                            user ? "text-blue-100/80" : "text-primary/90"
                          }`}
                        >
                          {user ? <UserCircle2 size={11} /> : <Bot size={11} />}
                          {user ? "Anda" : "FINA Guide"}
                        </div>
                        {message.content}
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[88%] rounded-xl rounded-tl-sm border border-[var(--card-border-soft)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text-1)] sm:max-w-[75%] sm:px-3.5 sm:py-2.5">
                      <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-primary/90">
                        <Bot size={11} />
                        FINA Guide
                      </div>
                      <div className="flex items-center gap-1 py-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary/70" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary/70" style={{ animationDelay: "110ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary/70" style={{ animationDelay: "220ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="min-w-0 border-t border-[var(--card-border-soft)] bg-[var(--card)]/20 p-3 sm:p-4">
                <div className="mb-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--card)] px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Pilih Pertanyaan</p>
                  <p className="mt-0.5 text-sm leading-5 text-[var(--text-2)]">
                    Pilih pertanyaan di bawah untuk mendapat penjelasan sederhana dari FINA.
                  </p>
                </div>

                <div className="mb-2.5 flex max-w-full snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {CATEGORY_LABELS.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`h-9 shrink-0 snap-start rounded-lg border px-3.5 text-sm font-semibold transition-all sm:h-10 sm:px-4 ${
                        selectedCategory === category
                          ? "border-primary/30 bg-primary text-white"
                          : "border-[var(--card-border-soft)] bg-[var(--surface)] text-[var(--text-2)] hover:border-primary/20 hover:bg-[var(--card)]"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {categoryQuestions.map((item) => (
                    <button
                      key={item.question}
                      type="button"
                      onClick={() => handleSelectQuestion(item)}
                      disabled={isTyping}
                      className="min-h-10 rounded-lg border border-[var(--card-border-soft)] bg-[var(--surface)] px-3.5 py-2.5 text-left text-sm font-medium leading-snug text-[var(--text-1)] transition-all hover:border-primary/25 hover:bg-[var(--card)] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-11 sm:px-4 sm:py-3"
                    >
                      {item.question}
                    </button>
                  ))}
                </div>

                <div className="mt-2.5 hidden items-center gap-2 rounded-lg border border-dashed border-[var(--input-border)] bg-[var(--surface)]/70 p-1.5 shadow-none sm:flex">
                  <input
                    value={selectedQuestion ? `Terakhir dipilih: ${selectedQuestion}` : ""}
                    placeholder="Tidak perlu mengetik. Pilih pertanyaan yang tersedia."
                    disabled
                    className="min-h-10 min-w-0 flex-1 bg-transparent px-2.5 py-1 text-sm text-[var(--text-2)] outline-none placeholder:text-[var(--text-3)]"
                  />
                  <Button type="button" disabled className="min-h-10 shrink-0 gap-1.5 px-3 py-2 text-xs font-semibold">
                    <span className="hidden sm:inline">Kirim</span> <SendHorizontal size={13} />
                  </Button>
                </div>
              </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
