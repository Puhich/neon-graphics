"use client";

import Link from "next/link";

import { useContentStore } from "@/components/admin/ContentProvider";
import { Card, Note, Page } from "@/components/admin/ui";
import { adminNav, sectionTitles, sectionsByRoute } from "@/lib/admin-nav";

function routeForSection(section: string): string {
  const entry = Object.entries(sectionsByRoute).find(([, sections]) => sections.includes(section));

  return entry?.[0] ?? "/admin";
}

export default function AdminDashboardPage() {
  const { changedSections, issues, isDirty, publishState } = useContentStore();

  return (
    <Page
      title="Дашборд"
      description="Здесь видно, что изменено и готово к публикации. Правки сохраняются в браузере, пока вы не нажмёте «Опубликовать»."
    >
      {issues.length > 0 ? (
        <Card title="Незаполненные поля" description="Пока они пустые, опубликовать нельзя.">
          <ul className="grid gap-2">
            {issues.slice(0, 12).map((issue) => (
              <li key={issue.path}>
                <Link
                  className="flex items-start gap-3 rounded-xl border border-[#f3a40d]/25 bg-[#f3a40d]/5 px-4 py-3 text-[13px] transition hover:border-[#f3a40d]/50"
                  href={routeForSection(issue.section)}
                >
                  <span className="font-semibold text-[#f0c274]">
                    {sectionTitles[issue.section] ?? issue.section}
                  </span>
                  <span className="text-[#8a8a8a]">{issue.message}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card title="Статус">
        {isDirty ? (
          <>
            <p className="text-[14px] text-[#c9c9c4]">Изменены разделы:</p>
            <ul className="flex flex-wrap gap-2">
              {changedSections.map((section) => (
                <li key={section}>
                  <Link
                    className="inline-flex rounded-lg border border-brand-blue/30 bg-brand-blue/10 px-3 py-1.5 text-[13px] text-[#9dd3f5] transition hover:border-brand-blue/60"
                    href={routeForSection(section)}
                  >
                    {sectionTitles[section] ?? section}
                  </Link>
                </li>
              ))}
            </ul>
            <Note>
              Нажмите «Опубликовать» вверху страницы. Изменения появятся на сайте примерно через 1–2 минуты — сайт
              пересобирается автоматически.
            </Note>
          </>
        ) : (
          <p className="text-[14px] text-[#8a8a8a]">
            {publishState.status === "done"
              ? publishState.message
              : "Черновик совпадает с сайтом — публиковать нечего."}
          </p>
        )}
      </Card>

      <Card title="Разделы" description="Всё, что можно менять на сайте.">
        <div className="grid gap-2 sm:grid-cols-2">
          {adminNav
            .flatMap((group) => group.items)
            .filter((item) => item.href !== "/admin")
            .map((item) => (
              <Link
                className="rounded-xl border border-white/10 bg-[#0f0f0d] px-4 py-3 transition hover:border-white/25"
                href={item.href}
                key={item.href}
              >
                <span className="block text-[14px] text-white">{item.label}</span>
                {item.hint ? <span className="mt-0.5 block text-[12px] text-[#6f6f6a]">{item.hint}</span> : null}
              </Link>
            ))}
        </div>
      </Card>
    </Page>
  );
}
