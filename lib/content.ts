import raw from "@/data/content.json";
import { contentSchema, type SiteContent } from "@/lib/content-schema";

// Контент проверяется схемой при импорте: если админка или ручная правка
// сломают структуру, сборка упадёт с понятной ошибкой, а не выдаст битую
// страницу в проде.
const parsed = contentSchema.safeParse(raw);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  • ${issue.path.join(".") || "(корень)"}: ${issue.message}`)
    .join("\n");

  throw new Error(`data/content.json не соответствует схеме:\n${issues}`);
}

const content: SiteContent = parsed.data;

export default content;
export type { SiteContent };
