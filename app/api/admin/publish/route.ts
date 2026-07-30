import { NextResponse } from "next/server";

import { contentSchema } from "@/lib/content-schema";
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

  try {
    const result = await commitFiles(
      [
        {
          path: "data/content.json",
          content: `${JSON.stringify(parsed.data, null, 2)}\n`,
          encoding: "utf-8"
        }
      ],
      "Обновление контента сайта через админку"
    );

    return NextResponse.json({
      ok: true,
      mode: result.mode,
      url: result.url,
      message:
        result.mode === "github"
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
