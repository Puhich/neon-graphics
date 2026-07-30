"use client";

import { useEffect, useState } from "react";

type IconItem = { name: string; svg: string };

// Пикер иконок lucide: поиск идёт на сервере, в браузер приходят только
// найденные иконки готовой разметкой.
export default function IconPicker({
  label,
  value,
  onChange,
  hint
}: {
  label: string;
  value: string;
  onChange: (name: string) => void;
  hint?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<IconItem[]>([]);
  const [current, setCurrent] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/admin/icons?name=${encodeURIComponent(value)}`)
      .then((response) => response.json())
      .then((data: { items: IconItem[] }) => {
        if (!cancelled) {
          setCurrent(data.items[0]?.svg ?? "");
        }
      })
      .catch(() => setCurrent(""));

    return () => {
      cancelled = true;
    };
  }, [value]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      fetch(`/api/admin/icons?q=${encodeURIComponent(query)}&limit=90`)
        .then((response) => response.json())
        .then((data: { items: IconItem[] }) => {
          if (!cancelled) {
            setItems(data.items);
          }
        })
        .catch(() => setItems([]));
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isOpen, query]);

  return (
    <div className="grid gap-1.5">
      <span className="text-[13px] font-semibold text-[var(--adm-text-2)]">{label}</span>

      <button
        className="flex items-center gap-3 rounded-xl border border-[var(--adm-border)] bg-[var(--adm-sunken)] px-4 py-2.5 text-left transition hover:border-[var(--adm-border-hover)]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--adm-chip)] text-brand-accent [&>svg]:h-5 [&>svg]:w-5"
          dangerouslySetInnerHTML={{ __html: current }}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] text-[var(--adm-text)]">{value || "иконка не выбрана"}</span>
          <span className="block text-[12px] text-[var(--adm-faint)]">Нажмите, чтобы выбрать другую</span>
        </span>
      </button>

      {hint ? <span className="text-[12px] leading-[1.45] text-[var(--adm-faint)]">{hint}</span> : null}

      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6">
          <div className="flex h-[80vh] w-full max-w-[620px] flex-col rounded-t-2xl border border-[var(--adm-border)] bg-[var(--adm-surface)] sm:h-[560px] sm:rounded-2xl">
            <div className="flex items-center gap-3 border-b border-[var(--adm-border)] p-4">
              <input
                autoFocus
                className="h-11 flex-1 rounded-xl border border-[var(--adm-border)] bg-[var(--adm-sunken)] px-4 text-[15px] text-[var(--adm-text)] outline-none transition placeholder:text-[var(--adm-faint)] focus:border-brand-accent/60"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск: shield, truck, zap…"
                value={query}
              />
              <button
                className="rounded-xl border border-[var(--adm-border-strong)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--adm-text-2)] transition hover:text-[var(--adm-text)]"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Закрыть
              </button>
            </div>

            <div className="adm-scroll grid flex-1 auto-rows-min content-start grid-cols-4 gap-2 overflow-y-auto overflow-x-hidden overscroll-contain p-4 sm:grid-cols-6">
              {items.map((item) => (
                <button
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition ${
                    item.name === value
                      ? "border-brand-accent/60 bg-brand-accent/10"
                      : "border-[var(--adm-border)] bg-[var(--adm-sunken)] hover:border-[var(--adm-border-hover)]"
                  }`}
                  key={item.name}
                  onClick={() => {
                    onChange(item.name);
                    setIsOpen(false);
                  }}
                  title={item.name}
                  type="button"
                >
                  <span
                    className="text-brand-accent [&>svg]:h-6 [&>svg]:w-6"
                    dangerouslySetInnerHTML={{ __html: item.svg }}
                  />
                  <span className="w-full truncate text-center text-[10px] text-[var(--adm-faint)]">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
