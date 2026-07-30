import AdminShell from "@/components/admin/AdminShell";
import { ContentProvider } from "@/components/admin/ContentProvider";
import bundledContent from "@/lib/content";
import { contentSchema, type SiteContent } from "@/lib/content-schema";
import { readRepoFile } from "@/lib/publisher";

// Опубликованную версию читаем не из сборки, а из репозитория: сразу после
// публикации сайт ещё пересобирается 1–2 минуты, и админка должна показывать
// уже сохранённый контент, а не старую версию из бандла.
export const dynamic = "force-dynamic";

async function loadPublished(): Promise<SiteContent> {
  try {
    const file = await readRepoFile("data/content.json");

    if (file) {
      const parsed = contentSchema.safeParse(JSON.parse(file.toString("utf-8")));

      if (parsed.success) {
        return parsed.data;
      }
    }
  } catch {
    // Репозиторий недоступен — работаем с версией из сборки.
  }

  return bundledContent;
}

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const published = await loadPublished();

  return (
    <ContentProvider published={published}>
      <AdminShell>{children}</AdminShell>
    </ContentProvider>
  );
}
