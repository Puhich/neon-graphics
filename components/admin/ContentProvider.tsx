"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { contentSchema, type SiteContent } from "@/lib/content-schema";

const DRAFT_KEY = "ng-admin-draft-v1";

export type ValidationIssue = {
  path: string;
  message: string;
  section: string;
};

type PublishState =
  | { status: "idle" }
  | { status: "publishing" }
  | { status: "done"; message: string }
  | { status: "error"; message: string };

type ContentContextValue = {
  content: SiteContent;
  published: SiteContent;
  isReady: boolean;
  isDirty: boolean;
  changedSections: string[];
  issues: ValidationIssue[];
  update: (mutate: (draft: SiteContent) => void) => void;
  reset: () => void;
  publish: () => Promise<void>;
  publishState: PublishState;
};

const ContentContext = createContext<ContentContextValue | null>(null);

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function diffSections(published: SiteContent, draft: SiteContent): string[] {
  return Object.keys(published).filter((key) => {
    const typedKey = key as keyof SiteContent;

    return JSON.stringify(published[typedKey]) !== JSON.stringify(draft[typedKey]);
  });
}

export function ContentProvider({
  published,
  children
}: {
  published: SiteContent;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(() => clone(published));
  const [isReady, setIsReady] = useState(false);
  const [publishState, setPublishState] = useState<PublishState>({ status: "idle" });
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  // Черновик переживает перезагрузку страницы. Если сайт успели опубликовать
  // из другого места, черновик от старой версии отбрасываем.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DRAFT_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as { base?: string; content?: SiteContent };

        if (parsed.base === JSON.stringify(published) && parsed.content) {
          setContent(parsed.content);
        } else if (parsed.content) {
          window.localStorage.removeItem(DRAFT_KEY);
        }
      }
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    }

    setIsReady(true);
  }, [published]);

  const update = useCallback((mutate: (draft: SiteContent) => void) => {
    setContent((current) => {
      const next = clone(current);
      mutate(next);

      return next;
    });
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(published) !== JSON.stringify(content),
    [published, content]
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (isDirty) {
        window.localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ base: JSON.stringify(published), content })
        );
      } else {
        window.localStorage.removeItem(DRAFT_KEY);
      }
    }, 400);

    return () => clearTimeout(saveTimer.current);
  }, [content, published, isDirty, isReady]);

  const changedSections = useMemo(() => diffSections(published, content), [published, content]);

  const issues = useMemo<ValidationIssue[]>(() => {
    const result = contentSchema.safeParse(content);

    if (result.success) {
      return [];
    }

    return result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      section: String(issue.path[0] ?? "")
    }));
  }, [content]);

  const reset = useCallback(() => {
    setContent(clone(published));
    window.localStorage.removeItem(DRAFT_KEY);
    setPublishState({ status: "idle" });
  }, [published]);

  const publish = useCallback(async () => {
    if (issues.length > 0) {
      setPublishState({
        status: "error",
        message: "Сначала исправьте незаполненные поля — они отмечены красным."
      });
      return;
    }

    setPublishState({ status: "publishing" });

    try {
      const response = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string; message?: string };

      if (!response.ok) {
        setPublishState({ status: "error", message: data.error ?? "Не удалось опубликовать" });
        return;
      }

      window.localStorage.removeItem(DRAFT_KEY);
      setPublishState({
        status: "done",
        message: data.message ?? "Опубликовано. Изменения появятся на сайте через 1–2 минуты."
      });
      router.refresh();
    } catch {
      setPublishState({ status: "error", message: "Сервер недоступен, попробуйте ещё раз" });
    }
  }, [content, issues.length, router]);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      published,
      isReady,
      isDirty,
      changedSections,
      issues,
      update,
      reset,
      publish,
      publishState
    }),
    [content, published, isReady, isDirty, changedSections, issues, update, reset, publish, publishState]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContentStore(): ContentContextValue {
  const context = useContext(ContentContext);

  if (!context) {
    throw new Error("useContentStore используется вне ContentProvider");
  }

  return context;
}
