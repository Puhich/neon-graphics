"use client";

import { useState } from "react";

import { useContentStore } from "@/components/admin/ContentProvider";

export default function PublishBar() {
  const { isDirty, changedSections, issues, publish, publishState, reset } = useContentStore();
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const isPublishing = publishState.status === "publishing";
  const canPublish = isDirty && issues.length === 0 && !isPublishing;

  return (
    <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
      <div className="mr-auto flex min-w-0 items-center gap-2">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            issues.length > 0 ? "bg-[#f3a40d]" : isDirty ? "bg-brand-blue" : "bg-[#3fb950]"
          }`}
        />
        <span className="truncate text-[13px] text-[#a6a6a1]">
          {issues.length > 0
            ? `Незаполненных полей: ${issues.length}`
            : isDirty
              ? `Не опубликовано: ${changedSections.length} ${changedSections.length === 1 ? "раздел" : "раздела(ов)"}`
              : "Всё опубликовано"}
        </span>
      </div>

      {publishState.status === "done" ? (
        <span className="hidden max-w-[320px] truncate text-[13px] text-[#3fb950] sm:inline">{publishState.message}</span>
      ) : null}
      {publishState.status === "error" ? (
        <span className="max-w-[320px] truncate text-[13px] text-brand-accent">{publishState.message}</span>
      ) : null}

      {isDirty ? (
        isConfirmingReset ? (
          <span className="flex items-center gap-2 text-[13px] text-[#a6a6a1]">
            Отменить все правки?
            <button
              className="rounded-lg border border-white/15 px-2.5 py-1 font-bold text-white transition hover:border-brand-accent hover:text-brand-accent"
              onClick={() => {
                reset();
                setIsConfirmingReset(false);
              }}
              type="button"
            >
              Да
            </button>
            <button
              className="rounded-lg border border-white/15 px-2.5 py-1 transition hover:text-white"
              onClick={() => setIsConfirmingReset(false)}
              type="button"
            >
              Нет
            </button>
          </span>
        ) : (
          <button
            className="rounded-xl border border-white/15 px-3.5 py-2 text-[13px] font-semibold text-[#a6a6a1] transition hover:border-white/30 hover:text-white"
            onClick={() => setIsConfirmingReset(true)}
            type="button"
          >
            Сбросить
          </button>
        )
      ) : null}

      <button
        className="rounded-xl bg-brand-accent px-4 py-2 text-[13px] font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-45"
        disabled={!canPublish}
        onClick={publish}
        type="button"
      >
        {isPublishing ? "Публикуем…" : "Опубликовать"}
      </button>
    </div>
  );
}
