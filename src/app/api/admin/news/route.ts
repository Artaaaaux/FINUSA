import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { addNews, readNews } from "@/lib/news-storage";
import type { EconomicNews } from "@/types/economy";

function badAuth() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return badAuth();
  const items = await readNews();
  return NextResponse.json({ items }, { status: 200 });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return badAuth();

  const body = (await request.json()) as Partial<EconomicNews>;

  if (!body.title || !body.source || !body.description || !body.articleUrl || !body.category || !body.sentiment) {
    return NextResponse.json({ error: "Data berita belum lengkap." }, { status: 400 });
  }

  const created = await addNews({
    title: body.title,
    source: body.source,
    image: body.image || "",
    description: body.description,
    category: body.category,
    sentiment: body.sentiment,
    featured: Boolean(body.featured),
    articleUrl: body.articleUrl,
  });

  return NextResponse.json({ item: created }, { status: 201 });
}
