"use client";

import { Moon, Sun } from "lucide";
import { useEffect, useState } from "react";

import ClientIcon from "@/components/admin/ClientIcon";
import type { IconNode } from "@/lib/icons";

const THEME_KEY = "ng-admin-theme";

type Theme = "dark" | "light";

// Переключатель темы админки. Выбор запоминается в браузере — у каждого,
// кто заходит в админку, своя тема.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.dataset.adminTheme;
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.adminTheme = next;
    setTheme(next);

    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // приватный режим — тема просто не запомнится
    }
  };

  return (
    <button
      aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
      className="rounded-xl border border-[var(--adm-border)] p-2 text-[var(--adm-nav-text)] transition hover:border-[var(--adm-border-hover)] hover:text-[var(--adm-text)]"
      onClick={toggle}
      title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
      type="button"
    >
      <ClientIcon className="h-[18px] w-[18px]" node={(theme === "dark" ? Sun : Moon) as IconNode} />
    </button>
  );
}
