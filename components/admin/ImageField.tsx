"use client";

import { useRef, useState, type DragEvent } from "react";

type UploadKind = "photo" | "logo" | "brand" | "og" | "favicon";

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (src: string) => void;
  kind?: UploadKind;
  hint?: string;
  ratio?: "wide" | "square" | "logo";
};

// Превью компактное: миниатюра фиксированного размера, а не картинка во всю
// ширину — иначе страницы с фотографиями превращаются в бесконечную ленту.
const ratioClass: Record<NonNullable<ImageFieldProps["ratio"]>, string> = {
  wide: "h-28 w-44",
  square: "h-24 w-24",
  logo: "h-20 w-44"
};

export function assetPreviewUrl(src: string): string {
  if (!src) {
    return "";
  }

  if (/^https?:\/\//.test(src)) {
    return src;
  }

  // Только что загруженный файл лежит в репозитории, но на сайте появится
  // после публикации — поэтому превью берём через админский прокси.
  return `/api/admin/asset?path=${encodeURIComponent(src)}`;
}

export default function ImageField({
  label,
  value,
  onChange,
  kind = "photo",
  hint,
  ratio = "wide"
}: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);

    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = (await response.json().catch(() => ({}))) as { src?: string; error?: string };

      if (!response.ok || !data.src) {
        setError(data.error ?? "Не удалось загрузить файл");
        return;
      }

      onChange(data.src);
    } catch {
      setError("Сервер недоступен, попробуйте ещё раз");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      void upload(file);
    }
  };

  return (
    <div className="grid gap-2">
      <span className="text-[13px] font-semibold text-[var(--adm-text-2)]">{label}</span>

      <div className="flex flex-wrap items-start gap-4">
        <div
          className={`relative shrink-0 overflow-hidden rounded-xl border border-dashed transition ${
            isDragOver ? "border-brand-accent bg-brand-accent/5" : "border-[var(--adm-border-strong)] bg-[var(--adm-sunken)]"
          } ${ratioClass[ratio]}`}
          onClick={() => inputRef.current?.click()}
          onDragLeave={() => setIsDragOver(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragOver(true);
          }}
          onDrop={handleDrop}
          role="button"
          tabIndex={-1}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className="h-full w-full cursor-pointer object-contain p-1.5" src={assetPreviewUrl(value)} />
          ) : (
            <span className="absolute inset-0 flex cursor-pointer items-center justify-center px-2 text-center text-[12px] leading-[1.35] text-[var(--adm-faint)]">
              Перетащите файл или нажмите
            </span>
          )}

          {isUploading ? (
            <span className="absolute inset-0 flex items-center justify-center bg-black/60 px-2 text-center text-[12px] font-semibold text-white">
              Загружаем…
            </span>
          ) : null}
        </div>

        <div className="grid min-w-0 flex-1 gap-2 self-center">
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="rounded-xl border border-[var(--adm-border-strong)] px-3.5 py-2 text-[13px] font-semibold text-[var(--adm-text-2)] transition hover:border-[var(--adm-border-hover)] hover:text-[var(--adm-text)] disabled:opacity-50"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              {value ? "Заменить" : "Выбрать файл"}
            </button>
            <span className="truncate text-[12px] text-[var(--adm-faint)]">{value || "файл не выбран"}</span>
          </div>
          {error ? <span className="text-[12px] font-semibold text-brand-accent">{error}</span> : null}
          {hint && !error ? <span className="text-[12px] leading-[1.45] text-[var(--adm-faint)]">{hint}</span> : null}
        </div>
      </div>

      <input
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void upload(file);
          }

          event.target.value = "";
        }}
        ref={inputRef}
        type="file"
      />

    </div>
  );
}
