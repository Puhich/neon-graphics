"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { readConsent, writeConsent } from "@/lib/consent";
import type { SiteContent } from "@/lib/content-schema";

// Плашка показывается один раз: после выбора решение запоминается в браузере.
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
    if (banner.enabled && readConsent() === null) {
      setIsVisible(true);
    }
  }, [banner.enabled]);

  if (!isVisible) {
    return null;
  }

  const decide = (value: "accepted" | "declined") => {
    writeConsent(value);
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 z-[2147483646] mx-auto max-w-[760px] rounded-2xl border border-[#2a2a28] bg-[#151513]/95 p-4 text-white shadow-[0_18px_48px_rgba(0,0,0,0.5)] backdrop-blur sm:bottom-5 sm:left-5 sm:right-5 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
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
        <div className="flex shrink-0 items-center gap-4">
          <button
            className="text-[13px] text-[#7e7e79] underline underline-offset-2 transition hover:text-[#b5b5b0]"
            onClick={() => decide("declined")}
            type="button"
          >
            {banner.declineLabel}
          </button>
          <button
            className="rounded-xl bg-brand-accent px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-red-700"
            onClick={() => decide("accepted")}
            type="button"
          >
            {banner.acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
