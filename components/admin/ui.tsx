"use client";

import { useState } from "react";

import { useContentStore } from "@/components/admin/ContentProvider";
import type { HideableSection } from "@/lib/site";

// Базовые кирпичики админки: заголовок страницы, карточка, поля ввода.
// Всё в одном стиле, чтобы разделы выглядели одинаково.

export function Page({
  title,
  description,
  actions,
  children
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h1 className="font-heading text-[26px] leading-tight sm:text-[30px]">{title}</h1>
        {actions}
      </div>
      {description ? <p className="mt-2 text-[14px] leading-[1.5] text-[var(--adm-muted)]">{description}</p> : null}
      <div className="mt-6 grid gap-5">{children}</div>
    </div>
  );
}

export function Card({
  title,
  description,
  actions,
  children
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface)] p-5 sm:p-6">
      {title || actions ? (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title ? <h2 className="font-heading text-[18px]">{title}</h2> : null}
            {description ? <p className="mt-1.5 text-[13px] leading-[1.5] text-[var(--adm-muted)]">{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

const controlClass =
  "w-full rounded-xl border border-[var(--adm-field-border)] bg-[var(--adm-field)] px-4 text-[15px] text-[var(--adm-text)] outline-none transition placeholder:text-[var(--adm-faint)] focus:border-brand-accent/60 focus:ring-2 focus:ring-brand-accent/20";

export function useFieldError(path: string): string | undefined {
  const { issues } = useContentStore();

  return issues.find((issue) => issue.path === path)?.message;
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  path?: string;
  rows?: number;
  type?: "text" | "email" | "tel" | "url";
  disabled?: boolean;
};

export function Field({
  label,
  value,
  onChange,
  hint,
  placeholder,
  path,
  rows,
  type = "text",
  disabled = false
}: FieldProps) {
  const error = useFieldError(path ?? "");
  const errorClass = error ? "border-brand-accent/70" : "";

  return (
    <label className="grid content-start gap-1.5">
      <span className="text-[13px] font-semibold text-[var(--adm-text-2)]">{label}</span>
      {rows ? (
        <textarea
          className={`${controlClass} ${errorClass} resize-y py-3 leading-[1.5]`}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          value={value}
        />
      ) : (
        <input
          className={`${controlClass} ${errorClass} h-11`}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      )}
      {error ? (
        <span className="text-[12px] font-semibold text-brand-accent">{error}</span>
      ) : hint ? (
        <span className="text-[12px] leading-[1.45] text-[var(--adm-faint)]">{hint}</span>
      ) : null}
    </label>
  );
}

// Поле без подписи — для однострочных списков (галочки, пункты), где
// подпись «Текст» над каждым полем только мешает.
export function InlineField({
  value,
  onChange,
  path,
  placeholder,
  ariaLabel = "Текст"
}: {
  value: string;
  onChange: (value: string) => void;
  path?: string;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const error = useFieldError(path ?? "");

  return (
    <div className="grid content-start gap-1">
      <input
        aria-label={ariaLabel}
        className={`${controlClass} h-10 ${error ? "border-brand-accent/70" : ""}`}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {error ? <span className="text-[12px] font-semibold text-brand-accent">{error}</span> : null}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  hint,
  step = 1
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  step?: number;
}) {
  return (
    <label className="grid content-start gap-1.5">
      <span className="text-[13px] font-semibold text-[var(--adm-text-2)]">{label}</span>
      <input
        className={`${controlClass} h-11`}
        onChange={(event) => {
          const next = Number(event.target.value);

          if (!Number.isNaN(next)) {
            onChange(next);
          }
        }}
        step={step}
        type="number"
        value={value}
      />
      {hint ? <span className="text-[12px] leading-[1.45] text-[var(--adm-faint)]">{hint}</span> : null}
    </label>
  );
}

export function Select({
  label,
  value,
  options,
  onChange,
  hint
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="grid content-start gap-1.5">
      <span className="text-[13px] font-semibold text-[var(--adm-text-2)]">{label}</span>
      <select
        className={`${controlClass} h-11`}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <span className="text-[12px] leading-[1.45] text-[var(--adm-faint)]">{hint}</span> : null}
    </label>
  );
}

export function Toggle({
  label,
  hint,
  checked,
  onChange
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        checked={checked}
        className="peer sr-only"
        onChange={(event) => onChange(event.target.checked)}
        role="switch"
        type="checkbox"
      />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-full bg-[var(--adm-border-strong)] transition peer-checked:bg-brand-accent peer-focus-visible:ring-2 peer-focus-visible:ring-brand-accent/40 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5"
      />
      <span>
        <span className="block text-[14px] text-[var(--adm-text)]">{label}</span>
        {hint ? <span className="mt-1 block text-[12px] leading-[1.45] text-[var(--adm-faint)]">{hint}</span> : null}
      </span>
    </label>
  );
}

export function Note({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  const toneClass =
    tone === "warn"
      ? "border-[#f3a40d]/30 bg-[#f3a40d]/10 text-[var(--adm-warn)]"
      : "border-[var(--adm-border)] bg-[var(--adm-note)] text-[var(--adm-muted)]";

  return <p className={`rounded-xl border px-4 py-3 text-[13px] leading-[1.5] ${toneClass}`}>{children}</p>;
}

// Ссылка на секцию сайта: выпадающий список секций вместо ручного ввода
// «#services». Для нестандартных адресов остаётся пункт «Другая ссылка».
export function useSectionOptions(): { value: string; label: string }[] {
  const { content } = useContentStore();

  return [
    { value: `#${content.clientsLogos.id}`, label: "Логотипы клиентов" },
    { value: `#${content.services.id}`, label: "Услуги" },
    { value: `#${content.portfolio.id}`, label: "Портфолио" },
    { value: `#${content.whyUs.id}`, label: "Почему выбирают нас" },
    { value: `#${content.stages.id}`, label: "Этапы работы" },
    { value: `#${content.reviews.id}`, label: "Отзывы" },
    { value: `#${content.faq.id}`, label: "Вопросы и ответы" },
    { value: `#${content.finalForm.id}`, label: "Форма заявки" },
    { value: `#${content.contacts.id}`, label: "Контакты" }
  ];
}

const CUSTOM_LINK = "__custom__";

export function LinkField({
  label,
  value,
  onChange,
  path,
  hint
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  path?: string;
  hint?: string;
}) {
  const options = useSectionOptions();
  const error = useFieldError(path ?? "");
  const isKnown = options.some((option) => option.value === value);
  const [custom, setCustom] = useState(!isKnown);
  const selectValue = custom ? CUSTOM_LINK : value;

  return (
    <div className="grid content-start gap-1.5">
      <span className="text-[13px] font-semibold text-[var(--adm-text-2)]">{label}</span>
      <div className={`grid gap-2 ${custom ? "sm:grid-cols-2" : ""}`}>
        <select
          className={`${controlClass} h-11 ${error ? "border-brand-accent/70" : ""}`}
          onChange={(event) => {
            if (event.target.value === CUSTOM_LINK) {
              setCustom(true);
              return;
            }
            setCustom(false);
            onChange(event.target.value);
          }}
          value={selectValue}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          <option value={CUSTOM_LINK}>Другая ссылка…</option>
        </select>
        {custom ? (
          <input
            className={`${controlClass} h-11 ${error ? "border-brand-accent/70" : ""}`}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://… или #секция"
            type="text"
            value={value}
          />
        ) : null}
      </div>
      {error ? (
        <span className="text-[12px] font-semibold text-brand-accent">{error}</span>
      ) : hint ? (
        <span className="text-[12px] leading-[1.45] text-[var(--adm-faint)]">{hint}</span>
      ) : null}
    </div>
  );
}

// Переключатель «показывать секцию на сайте». Скрытая секция остаётся
// в админке со всем содержимым и возвращается одним кликом.
export function SectionVisibility({ section }: { section: HideableSection }) {
  const { content, update } = useContentStore();
  const hidden = Boolean(content[section].hidden);

  return (
    <Toggle
      checked={!hidden}
      label="Показывать на сайте"
      onChange={(value) => update((draft) => void (draft[section].hidden = value ? undefined : true))}
    />
  );
}
