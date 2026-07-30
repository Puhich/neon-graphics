"use client";

import Link from "next/link";

import ClientIcon from "@/components/admin/ClientIcon";
import { useContentStore } from "@/components/admin/ContentProvider";
import { fallbackIcon, routeIcons } from "@/components/admin/route-icons";
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
                  <span className="font-semibold text-[var(--adm-warn)]">
                    {sectionTitles[issue.section] ?? issue.section}
                  </span>
                  <span className="text-[var(--adm-muted)]">{issue.message}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card title="Статус">
        {isDirty ? (
          <>
            <p className="text-[14px] text-[var(--adm-text-2)]">Изменены разделы:</p>
            <ul className="flex flex-wrap gap-2">
              {changedSections.map((section) => (
                <li key={section}>
                  <Link
                    className="inline-flex rounded-lg border border-brand-blue/30 bg-brand-blue/10 px-3 py-1.5 text-[13px] text-[var(--adm-info)] transition hover:border-brand-blue/60"
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
          <p className="text-[14px] text-[var(--adm-muted)]">
            {publishState.status === "done"
              ? publishState.message
              : "Черновик совпадает с сайтом — публиковать нечего."}
          </p>
        )}
      </Card>

      {adminNav
        .filter((group) => group.items.some((item) => item.href !== "/admin"))
        .map((group) => (
          <Card key={group.title} title={group.title}>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {group.items
                .filter((item) => item.href !== "/admin")
                .map((item) => (
                  <Link
                    className="group flex min-h-[136px] flex-col justify-between rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-sunken)] p-4 transition hover:border-brand-accent/45 hover:bg-[var(--adm-hover)]"
                    href={item.href}
                    key={item.href}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--adm-chip)] text-brand-accent transition group-hover:bg-brand-accent/15">
                      <ClientIcon className="h-5 w-5" node={routeIcons[item.href] ?? fallbackIcon} />
                    </span>
                    <span className="mt-4">
                      <span className="block text-[14px] font-semibold leading-[1.3] text-[var(--adm-text)]">{item.label}</span>
                      {item.hint ? (
                        <span className="mt-1 block text-[12px] leading-[1.4] text-[var(--adm-faint)]">{item.hint}</span>
                      ) : null}
                    </span>
                  </Link>
                ))}
            </div>
          </Card>
        ))}
    </Page>
  );
}
