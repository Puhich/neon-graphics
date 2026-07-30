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
    <div className="fixed inset-x-3 bottom-3 z-[2147483646] rounded-2xl border border-[#2a2a28] bg-[#151513]/95 p-4 text-white shadow-[0_18px_48px_rgba(0,0,0,0.5)] backdrop-blur sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[380px]">
      <p className="text-[13px] leading-[1.5] text-[#b5b5b0]">
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
        className="mt-3 rounded-xl bg-brand-accent px-5 py-2 text-[13px] font-bold text-white transition hover:bg-red-700"
        onClick={dismiss}
        type="button"
      >
        {banner.acceptLabel}
      </button>
    </div>
  );
}
