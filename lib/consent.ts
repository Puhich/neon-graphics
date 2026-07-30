"use client";

// Выбор пользователя в cookie-баннере. Хранится локально в браузере;
// от него зависит, подгружать ли стороннюю карту Яндекса и счётчик Метрики.

export const CONSENT_KEY = "ng-cookie-consent";
export const CONSENT_EVENT = "ng-consent-change";

export type ConsentValue = "accepted" | "declined";

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(CONSENT_KEY);

  return stored === "accepted" || stored === "declined" ? stored : null;
}

export function writeConsent(value: ConsentValue): void {
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function onConsentChange(handler: (value: ConsentValue | null) => void): () => void {
  const listener = () => handler(readConsent());

  window.addEventListener(CONSENT_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(CONSENT_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
