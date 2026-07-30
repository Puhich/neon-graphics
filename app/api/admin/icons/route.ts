import { NextResponse } from "next/server";

import { hasIcon, iconNames, iconSvgMarkup } from "@/lib/icons";

export const runtime = "nodejs";

// Поиск по набору lucide для пикера иконок. Разметку отдаём с сервера,
// чтобы не тащить в браузер две тысячи иконок.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exactName = (searchParams.get("name") ?? "").trim().toLowerCase();

  // Запрос конкретной иконки по имени — для превью уже выбранной.
  if (exactName) {
    return NextResponse.json({
      total: iconNames.length,
      items: hasIcon(exactName) ? [{ name: exactName, svg: iconSvgMarkup(exactName, 24, 1.9) }] : []
    });
  }

  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const limit = Math.min(Number(searchParams.get("limit") ?? 60), 120);

  // Сначала точное совпадение, потом иконки, чьё имя начинается с запроса,
  // и только затем всё остальное: иначе «box» тонет среди «boom-box».
  const matched = query
    ? iconNames
        .filter((name) => name.includes(query))
        .sort((a, b) => rank(a, query) - rank(b, query) || a.localeCompare(b))
    : iconNames;

  return NextResponse.json({
    total: iconNames.length,
    items: matched.slice(0, limit).map((name) => ({ name, svg: iconSvgMarkup(name, 24, 1.9) }))
  });
}

function rank(name: string, query: string): number {
  if (name === query) {
    return 0;
  }

  if (name.startsWith(query)) {
    return 1;
  }

  // Совпадение в начале любого слова: «front» находит «tram-front».
  return name.split("-").some((part) => part.startsWith(query)) ? 2 : 3;
}
