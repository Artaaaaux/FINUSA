"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { EconomicNews } from "@/types/economy";

const categories: EconomicNews["category"][] = ["Moneter", "Inflasi", "Perdagangan", "UMKM", "Fiskal"];
const sentiments: EconomicNews["sentiment"][] = ["positive", "neutral", "negative"];

export default function TambahBeritaPage() {
  const [form, setForm] = useState({
    title: "",
    source: "",
    articleUrl: "",
    category: "Moneter" as EconomicNews["category"],
    sentiment: "neutral" as EconomicNews["sentiment"],
    description: "",
    image: "",
    featured: false,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewImage = useMemo(() => form.image, [form.image]);

  function onField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function onFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onField("image", reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error || "Gagal menyimpan berita.");
        return;
      }

      setMessage("Berita berhasil disimpan dan otomatis tampil di Rupiah Lens.");
      setForm({
        title: "",
        source: "",
        articleUrl: "",
        category: "Moneter",
        sentiment: "neutral",
        description: "",
        image: "",
        featured: false,
      });
    } catch {
      setError("Terjadi gangguan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card title="Tambah Berita" subtitle="Input konten berita ekonomi baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-[var(--text-2)]">Headline
            <input required value={form.title} onChange={(e) => onField("title", e.target.value)} className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm text-[var(--text-1)] outline-none focus:border-primary/50" />
          </label>
          <label className="text-sm text-[var(--text-2)]">Source
            <input required value={form.source} onChange={(e) => onField("source", e.target.value)} className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm text-[var(--text-1)] outline-none focus:border-primary/50" />
          </label>
        </div>

        <label className="block text-sm text-[var(--text-2)]">Article Link
          <input required type="url" value={form.articleUrl} onChange={(e) => onField("articleUrl", e.target.value)} className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm text-[var(--text-1)] outline-none focus:border-primary/50" />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-[var(--text-2)]">Category
            <select value={form.category} onChange={(e) => onField("category", e.target.value as EconomicNews["category"])} className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm text-[var(--text-1)] outline-none focus:border-primary/50">
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-sm text-[var(--text-2)]">Sentiment
            <select value={form.sentiment} onChange={(e) => onField("sentiment", e.target.value as EconomicNews["sentiment"])} className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm text-[var(--text-1)] outline-none focus:border-primary/50">
              {sentiments.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <label className="block text-sm text-[var(--text-2)]">Short Description
          <textarea required value={form.description} onChange={(e) => onField("description", e.target.value)} rows={4} className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm text-[var(--text-1)] outline-none focus:border-primary/50" />
        </label>

        <label className="block text-sm text-[var(--text-2)]">Image Upload
          <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-2)]" />
        </label>

        {previewImage && (
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-3">
            <p className="mb-2 text-xs text-[var(--text-3)]">Preview</p>
            <img src={previewImage} alt="preview" className="h-44 w-full rounded-lg object-cover" />
          </div>
        )}

        <label className="inline-flex items-center gap-2 text-sm text-[var(--text-2)]">
          <input type="checkbox" checked={form.featured} onChange={(e) => onField("featured", e.target.checked)} /> Featured Article
        </label>

        {message && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10">{message}</p>}
        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10">{error}</p>}

        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Menyimpan..." : "Simpan Berita"}</Button>
      </form>
    </Card>
  );
}
