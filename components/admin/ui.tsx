"use client";

import { useContentStore } from "@/components/admin/ContentProvider";

// Базовые кирпичики админки: заголовок страницы, карточка, поля ввода.
// Всё в одном стиле, чтобы разделы выглядели одинаково.

export function Page({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="font-heading text-[26px] leading-tight sm:text-[30px]">{title}</h1>
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
  "w-full rounded-xl border border-[var(--adm-border)] bg-[var(--adm-sunken)] px-4 text-[15px] text-[var(--adm-text)] outline-none transition placeholder:text-[var(--adm-faint)] focus:border-brand-accent/60 focus:ring-2 focus:ring-brand-accent/20";

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
    <label className="grid gap-1.5">
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
    <label className="grid gap-1.5">
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
    <label className="grid gap-1.5">
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
    <label className="flex cursor-pointer items-start gap-3">
      <input
        checked={checked}
        className="mt-0.5 h-4 w-4 shrink-0 accent-brand-accent"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
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
