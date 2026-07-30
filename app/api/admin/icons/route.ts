import { NextResponse } from "next/server";

import { iconNames, iconSvgMarkup } from "@/lib/icons";

export const runtime = "nodejs";

// Поиск по набору lucide для пикера иконок. Разметку отдаём с сервера,
// чтобы не тащить в браузер две тысячи иконок.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const limit = Math.min(Number(searchParams.get("limit") ?? 60), 120);

  const matched = (query ? iconNames.filter((name) => name.includes(query)) : iconNames).slice(0, limit);

  return NextResponse.json({
    total: iconNames.length,
    items: matched.map((name) => ({ name, svg: iconSvgMarkup(name, 24, 1.9) }))
  });
}
