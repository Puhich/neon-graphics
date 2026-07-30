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

const ratioClass: Record<NonNullable<ImageFieldProps["ratio"]>, string> = {
  wide: "aspect-[16/10]",
  square: "aspect-square",
  logo: "aspect-[16/7]"
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

      <div
        className={`relative overflow-hidden rounded-xl border border-dashed transition ${
          isDragOver ? "border-brand-accent bg-brand-accent/5" : "border-[var(--adm-border-strong)] bg-[var(--adm-sunken)]"
        } ${ratioClass[ratio]}`}
        onDragLeave={() => setIsDragOver(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDrop={handleDrop}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className="h-full w-full object-contain" src={assetPreviewUrl(value)} />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[13px] text-[var(--adm-faint)]">
            Перетащите файл сюда
          </span>
        )}

        {isUploading ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-[13px] font-semibold text-white">
            Загружаем и сжимаем…
          </span>
        ) : null}
      </div>

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

      {error ? <span className="text-[12px] font-semibold text-brand-accent">{error}</span> : null}
      {hint && !error ? <span className="text-[12px] leading-[1.45] text-[var(--adm-faint)]">{hint}</span> : null}
    </div>
  );
}
