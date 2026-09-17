import { readFileSync, statSync } from "node:fs";
import path from "node:path";

import { contentSchema, type SiteContent } from "@/lib/content-schema";

// Контент читается с диска на каждый рендер, но с кэшем по времени изменения
// файла: пока data/content.json не менялся, парсинг не повторяется. На своём
// сервере это позволяет публиковать правки из админки без пересборки —
// файл перезаписали, страницы перегенерировались.
//
// Схема проверяется при чтении: если админка или ручная правка сломают
// структуру, получим понятную ошибку, а не битую страницу.

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

let cache: { mtimeMs: number; content: SiteContent } | null = null;

export function getContent(): SiteContent {
  const mtimeMs = statSync(CONTENT_PATH).mtimeMs;

  if (cache && cache.mtimeMs === mtimeMs) {
    return cache.content;
  }

  const parsed = contentSchema.safeParse(JSON.parse(readFileSync(CONTENT_PATH, "utf-8")));

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  • ${issue.path.join(".") || "(корень)"}: ${issue.message}`)
      .join("\n");

    throw new Error(`data/content.json не соответствует схеме:\n${issues}`);
  }

  cache = { mtimeMs, content: parsed.data };

  return parsed.data;
}

export type { SiteContent };
