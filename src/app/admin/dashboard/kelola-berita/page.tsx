"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { EconomicNews } from "@/types/economy";

export default function KelolaBeritaPage() {
  const [items, setItems] = useState<EconomicNews[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/admin/news", { cache: "no-store" });
    const payload = (await response.json()) as { items?: EconomicNews[]; error?: string };
    if (!response.ok) {
      setError(payload.error || "Gagal memuat berita.");
      setLoading(false);
      return;
    }
    setItems(payload.items || []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function removeItem(id: string) {
    const response = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Gagal menghapus berita.");
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function toggleFeatured(item: EconomicNews) {
    const response = await fetch(`/api/admin/news/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !item.featured }),
    });

    if (!response.ok) {
      setError("Gagal memperbarui featured.");
      return;
    }

    await load();
  }

  async function quickEdit(item: EconomicNews) {
    const title = window.prompt("Ubah headline", item.title);
    if (!title) return;

    const response = await fetch(`/api/admin/news/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      setError("Gagal mengedit berita.");
      return;
    }

    setItems((prev) => prev.map((entry) => (entry.id === item.id ? { ...entry, title } : entry)));
  }

  return (
    <Card title="Kelola Berita" subtitle="Edit, hapus, dan atur featured article">
      <div className="space-y-3">
        {loading && <p className="text-sm text-[var(--text-3)]">Memuat data berita...</p>}
        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10">{error}</p>}

        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--text-3)]">{item.source} • {item.date}</p>
                <h3 className="mt-1 text-sm font-semibold text-[var(--text-1)]">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--text-2)]">{item.description}</p>
                <a href={item.articleUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex text-xs text-primary hover:underline">Preview source</a>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => void quickEdit(item)}>Edit</Button>
                <Button type="button" variant="secondary" onClick={() => void toggleFeatured(item)}>{item.featured ? "Unfeature" : "Feature"}</Button>
                <Button type="button" variant="secondary" onClick={() => void removeItem(item.id)}>Delete</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
