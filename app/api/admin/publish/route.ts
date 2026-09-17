import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { sectionTitles } from "@/lib/admin-nav";
import { getContent } from "@/lib/content";
import { contentSchema } from "@/lib/content-schema";
import { isSelfHosted } from "@/lib/env";
import { commitFiles } from "@/lib/publisher";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const parsed = contentSchema.safeParse((body as { content?: unknown })?.content);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Контент не прошёл проверку — публикация отменена",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      },
      { status: 400 }
    );
  }

  // В сообщение коммита — какие разделы изменились: это и есть история
  // публикаций, которую видит клиент в админке.
  let message = "Публикация из админки";
  try {
    const current = getContent() as unknown as Record<string, unknown>;
    const next = parsed.data as unknown as Record<string, unknown>;
    const changed = Object.keys(next)
      .filter((key) => JSON.stringify(current[key]) !== JSON.stringify(next[key]))
      .map((key) => sectionTitles[key] ?? key);
    if (changed.length > 0) {
      message = `Изменено: ${changed.join(", ")}`;
    }
  } catch {
    // Не удалось сравнить — оставляем общее сообщение.
  }

  try {
    const result = await commitFiles(
      [
        {
          path: "data/content.json",
          content: `${JSON.stringify(parsed.data, null, 2)}\n`,
          encoding: "utf-8"
        }
      ],
      message
    );

    if (isSelfHosted) {
      // Контент уже на диске — перегенерировать страницы, не дожидаясь сборки.
      revalidatePath("/", "layout");
    }

    return NextResponse.json({
      ok: true,
      mode: result.mode,
      url: result.url,
      message:
        result.mode === "both"
          ? "Опубликовано. Изменения уже на сайте."
          : result.mode === "github"
            ? "Опубликовано. Изменения появятся на сайте через 1–2 минуты."
            : "Сохранено локально в data/content.json (режим разработки)."
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Не удалось опубликовать: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
