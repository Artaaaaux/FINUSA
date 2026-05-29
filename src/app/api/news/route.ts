import { NextResponse } from "next/server";
import { readNews } from "@/lib/news-storage";

export async function GET() {
  try {
    const news = await readNews();
    return NextResponse.json({ items: news }, { status: 200 });
  } catch {
    return NextResponse.json({ items: [], error: "Gagal memuat data berita." }, { status: 200 });
  }
}
