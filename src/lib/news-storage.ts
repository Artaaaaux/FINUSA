import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { EconomicNews, NewsSentiment } from "@/types/economy";

const DATA_PATH = path.join(process.cwd(), "data", "news.json");

export interface NewsInput {
  title: string;
  source: string;
  image: string;
  description: string;
  category: EconomicNews["category"];
  sentiment: NewsSentiment;
  featured: boolean;
  articleUrl: string;
}

async function ensureFile() {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, "[]", "utf8");
  }
}

function sanitizeJsonContent(raw: string) {
  return raw.replace(/^\uFEFF/, "").trim();
}

async function resetNewsFile() {
  await fs.writeFile(DATA_PATH, "[]", "utf8");
}

export async function readNews(): Promise<EconomicNews[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const sanitized = sanitizeJsonContent(raw);
    const safeJson = sanitized.length === 0 ? "[]" : sanitized;
    const parsed = JSON.parse(safeJson) as unknown;

    if (!Array.isArray(parsed)) {
      console.warn("[news-storage] news.json bukan array valid. File di-reset ke []");
      await resetNewsFile();
      return [];
    }

    return parsed as EconomicNews[];
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown parse error";
    console.warn(`[news-storage] Gagal membaca news.json (${message}). File di-reset ke []`);
    await resetNewsFile();
    return [];
  }
}

async function writeNews(news: EconomicNews[]) {
  await ensureFile();
  await fs.writeFile(DATA_PATH, JSON.stringify(news, null, 2), "utf8");
}

function todayLabel() {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());
}

export async function addNews(input: NewsInput) {
  const current = await readNews();

  const nextItem: EconomicNews = {
    id: randomUUID(),
    date: todayLabel(),
    ...input,
  };

  const normalized = input.featured
    ? current.map((item) => ({ ...item, featured: false }))
    : current;

  const next = [nextItem, ...normalized];
  await writeNews(next);
  return nextItem;
}

export async function updateNews(id: string, patch: Partial<NewsInput>) {
  const current = await readNews();
  const index = current.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const base = current[index];
  const updated: EconomicNews = {
    ...base,
    ...(patch.title !== undefined ? { title: patch.title } : {}),
    ...(patch.source !== undefined ? { source: patch.source } : {}),
    ...(patch.image !== undefined ? { image: patch.image } : {}),
    ...(patch.description !== undefined ? { description: patch.description } : {}),
    ...(patch.category !== undefined ? { category: patch.category } : {}),
    ...(patch.sentiment !== undefined ? { sentiment: patch.sentiment } : {}),
    ...(patch.featured !== undefined ? { featured: patch.featured } : {}),
    ...(patch.articleUrl !== undefined ? { articleUrl: patch.articleUrl } : {}),
  };

  let next = [...current];
  next[index] = updated;

  if (patch.featured) {
    next = next.map((item) => (item.id === id ? item : { ...item, featured: false }));
  }

  await writeNews(next);
  return updated;
}

export async function deleteNews(id: string) {
  const current = await readNews();
  const next = current.filter((item) => item.id !== id);
  if (next.length === current.length) return false;
  await writeNews(next);
  return true;
}
