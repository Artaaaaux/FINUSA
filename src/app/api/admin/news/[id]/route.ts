import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteNews, updateNews } from "@/lib/news-storage";
import type { EconomicNews } from "@/types/economy";

function badAuth() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return badAuth();

  const { id } = await params;
  const body = (await request.json()) as Partial<EconomicNews>;

  const updated = await updateNews(id, {
    title: body.title,
    source: body.source,
    image: body.image,
    description: body.description,
    category: body.category,
    sentiment: body.sentiment,
    featured: body.featured,
    articleUrl: body.articleUrl,
  });

  if (!updated) {
    return NextResponse.json({ error: "Berita tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ item: updated }, { status: 200 });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return badAuth();

  const { id } = await params;
  const ok = await deleteNews(id);

  if (!ok) {
    return NextResponse.json({ error: "Berita tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
