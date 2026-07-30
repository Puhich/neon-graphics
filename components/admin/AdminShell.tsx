"use client";

import { Menu, X } from "lucide";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ClientIcon from "@/components/admin/ClientIcon";
import PublishBar from "@/components/admin/PublishBar";
import { useContentStore } from "@/components/admin/ContentProvider";
import { fallbackIcon, routeIcons } from "@/components/admin/route-icons";
import { adminNav, sectionsByRoute } from "@/lib/admin-nav";
import type { IconNode } from "@/lib/icons";

function isRouteChanged(href: string, changedSections: string[]): boolean {
  const sections = sectionsByRoute[href];

  return Boolean(sections?.some((section) => changedSections.includes(section)));
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { changedSections, issues } = useContentStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link className="flex items-center gap-3" href="/admin">
          <Image className="h-9 w-auto" src="/logo-mark.svg" alt="" width={36} height={44} />
          <span className="font-heading text-[15px] leading-tight">
            Неон Графикс
            <span className="block text-[11px] font-sans font-bold uppercase tracking-[0.16em] text-[#6f6f6a]">
              админка
            </span>
          </span>
        </Link>
        <button
          aria-label="Закрыть меню"
          className="rounded-lg border border-white/10 p-1.5 text-[#8a8a8a] lg:hidden"
          onClick={() => setIsMenuOpen(false)}
          type="button"
        >
          <ClientIcon className="h-5 w-5" node={X as IconNode} />
        </button>
      </div>

      <nav className="adm-scroll flex-1 overflow-y-auto overflow-x-hidden px-3 pb-6">
        {adminNav.map((group) => (
          <div className="mb-5" key={group.title}>
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5f5f5b]">
              {group.title}
            </p>
            <ul className="grid min-w-0 gap-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const changed = isRouteChanged(item.href, changedSections);
                const hasIssue = (sectionsByRoute[item.href] ?? []).some((section) =>
                  issues.some((issue) => issue.section === section)
                );

                return (
                  <li className="min-w-0" key={item.href}>
                    <Link
                      className={`flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition ${
                        isActive
                          ? "bg-brand-accent/15 text-white ring-1 ring-inset ring-brand-accent/40"
                          : "text-[#a6a6a1] hover:bg-white/5 hover:text-white"
                      }`}
                      href={item.href}
                    >
                      <ClientIcon
                        className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-brand-accent" : "text-[#6f6f6a]"}`}
                        node={routeIcons[item.href] ?? fallbackIcon}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {hasIssue ? (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f3a40d]" title="Есть незаполненные поля" />
                      ) : changed ? (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" title="Есть изменения" />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <a
          className="block text-[13px] text-[#8a8a8a] transition hover:text-white"
          href="/"
          rel="noreferrer"
          target="_blank"
        >
          Открыть сайт →
        </a>
        <button className="mt-3 text-[13px] text-[#8a8a8a] transition hover:text-white" onClick={logout} type="button">
          Выйти
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[268px_1fr]">
      <aside className="hidden border-r border-white/10 bg-[#121210] lg:sticky lg:top-0 lg:block lg:h-screen">
        {sidebar}
      </aside>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMenuOpen(false)}
            type="button"
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-white/10 bg-[#121210]">{sidebar}</aside>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0f0d]/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              aria-label="Меню"
              className="rounded-xl border border-white/10 p-2 text-[#a6a6a1] transition hover:text-white lg:hidden"
              onClick={() => setIsMenuOpen(true)}
              type="button"
            >
              <ClientIcon className="h-5 w-5" node={Menu as IconNode} />
            </button>
            <PublishBar />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[900px] flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
