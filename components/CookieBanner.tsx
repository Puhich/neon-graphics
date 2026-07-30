"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { SiteContent } from "@/lib/content-schema";

const NOTICE_KEY = "ng-cookie-notice";

// Полоса внизу экрана: одна строка, одна кнопка. После нажатия больше
// не показывается.
export default function CookieBanner({
  banner,
  privacyHref
}: {
  banner: SiteContent["cookieBanner"];
  privacyHref: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  // На самой странице политики ссылка на неё же не нужна.
  const isOnPrivacyPage = usePathname() === privacyHref;

  useEffect(() => {
    if (banner.enabled && window.localStorage.getItem(NOTICE_KEY) !== "seen") {
      setIsVisible(true);
      // Кнопка звонка приподнимается, чтобы не лежать на полосе.
      document.body.classList.add("cookie-notice-open");
    }

    return () => document.body.classList.remove("cookie-notice-open");
  }, [banner.enabled]);

  if (!isVisible) {
    return null;
  }

  const dismiss = () => {
    window.localStorage.setItem(NOTICE_KEY, "seen");
    document.body.classList.remove("cookie-notice-open");
    setIsVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[2147483646] border-t border-white/10 bg-[#151513] text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-6 sm:px-6 lg:px-8">
        <p className="flex-1 text-[13px] leading-[1.5] text-[#b5b5b0]">
          {banner.text}
          {isOnPrivacyPage ? null : (
            <>
              {" "}
              <a className="underline underline-offset-2 transition hover:text-white" href={privacyHref}>
                {banner.linkText}
              </a>
            </>
          )}
        </p>
        <button
          className="shrink-0 rounded-xl bg-brand-accent px-6 py-2.5 text-[13px] font-bold text-white transition hover:bg-red-700"
          onClick={dismiss}
          type="button"
        >
          {banner.acceptLabel}
        </button>
      </div>
    </div>
  );
}
