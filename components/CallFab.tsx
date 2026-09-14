"use client";

import { useEffect, useRef, useState } from "react";

type CallFabProps = {
  href: string;
  phone: string;
  label: string;
  hint: string;
  /** SVG QR-кода со ссылкой tel:, собранный на сервере. */
  qrSvg: string;
};

function PhoneFillIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24">
      <path d="M22 16.92v2.5a2.45 2.45 0 0 1-2.67 2.45A19.3 19.3 0 0 1 10.92 19 18.9 18.9 0 0 1 5 13.08a19.3 19.3 0 0 1-2.87-8.46A2.45 2.45 0 0 1 4.57 2h2.5a2.45 2.45 0 0 1 2.45 2.1c.16 1.18.43 2.33.82 3.43a2.45 2.45 0 0 1-.55 2.52l-1.06 1.06a15.7 15.7 0 0 0 6.16 6.16l1.06-1.06a2.45 2.45 0 0 1 2.52-.55c1.1.39 2.25.66 3.43.82A2.45 2.45 0 0 1 22 16.92Z" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 lg:h-5 lg:w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

const buttonClass =
  "call-fab fixed bottom-20 right-5 z-[2147483647] flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-xl text-white shadow-[0_0_24px_rgba(204,26,44,0.6)] transition hover:bg-red-700 sm:bottom-6 sm:right-6 lg:h-12 lg:w-12 lg:shadow-[0_0_18px_rgba(204,26,44,0.55)]";

/**
 * Плавающая кнопка звонка. На тач-устройствах — обычная ссылка tel:.
 * На десктопе (есть hover) клик открывает над кнопкой карточку с QR-кодом:
 * телефон сканирует код и сразу набирает номер. Иконка при этом
 * становится крестиком.
 */
export default function CallFab({ href, phone, label, hint, qrSvg }: CallFabProps) {
  const [canHover, setCanHover] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!canHover) {
    return (
      <a className={buttonClass} href={href} aria-label={label}>
        <PhoneFillIcon />
      </a>
    );
  }

  return (
    <div ref={rootRef}>
      <div
        aria-hidden={!open}
        className={`fixed bottom-[84px] right-6 z-[2147483646] w-[224px] origin-bottom-right rounded-2xl border border-[#2a2a28] bg-[#151513]/95 p-4 text-white shadow-[0_18px_48px_rgba(0,0,0,0.5)] backdrop-blur transition duration-200 ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div
          className="overflow-hidden rounded-xl bg-white p-3 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />
        <p className="mt-3 text-center text-[13px] leading-[1.4] text-[#bbbbbb]">{hint}</p>
        <a className="mt-1.5 block text-center font-heading text-[17px] text-white transition hover:text-brand-accent" href={href}>
          {phone}
        </a>
      </div>
      <button
        aria-expanded={open}
        aria-label={open ? "Закрыть" : label}
        className={buttonClass}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <CloseIcon /> : <PhoneFillIcon />}
      </button>
    </div>
  );
}
