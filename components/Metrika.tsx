"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import { onConsentChange, readConsent } from "@/lib/consent";

// Счётчик подключается только если он задан в админке и посетитель не
// отказался от cookie.
export default function Metrika({ counterId }: { counterId: string }) {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const check = (value: "accepted" | "declined" | null) => setIsAllowed(value !== "declined");

    check(readConsent());

    return onConsentChange(check);
  }, []);

  if (!counterId || !isAllowed) {
    return null;
  }

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
      ym(${Number(counterId)}, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true});`}
    </Script>
  );
}
