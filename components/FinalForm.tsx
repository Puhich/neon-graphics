"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { isValidEmail } from "@/lib/email";
import { formatRuPhone, isCompleteRuPhone } from "@/lib/phone-mask";

import SectionWatermark from "@/components/SectionWatermark";
import type { SiteContent } from "@/lib/content-schema";
import { reachGoal } from "@/lib/metrika";

type FinalFormContent = SiteContent["finalForm"];

type FinalFormProps = {
  form: FinalFormContent;
  privacyHref: string;
  metrikaId: string;
};

type Status = "idle" | "sending" | "success" | "error";

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-brand-accent" fill="none" viewBox="0 0 24 24">
      <path d="m20 6-11 11-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
    </svg>
  );
}

const inputClass =
  "h-11 rounded-xl bg-[#e8e8e8] px-4 text-[15px] text-brand-ink outline-none transition placeholder:text-[#999999] focus:ring-2 focus:ring-brand-accent/35";

export default function FinalForm({ form, privacyHref, metrikaId }: FinalFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [serverError, setServerError] = useState("");
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const MAX_PHOTOS = 5;

  const addPhotos = (list: FileList | null) => {
    if (!list) return;
    const next = [...photos];
    for (const file of Array.from(list)) {
      if (next.length >= MAX_PHOTOS) break;
      if (!file.type.startsWith("image/")) continue;
      next.push({ file, url: URL.createObjectURL(file) });
    }
    setPhotos(next);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photos[index].url);
    setPhotos(photos.filter((_, i) => i !== index));
  };
  const phoneRef = useRef<HTMLInputElement>(null);

  // Маска дописывает скобки и дефисы — курсор держим в конце, чтобы
  // следующая цифра всегда вставала на своё место.
  useEffect(() => {
    const el = phoneRef.current;
    if (el && document.activeElement === el) {
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [phone]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "sending" || !consent) {
      return;
    }

    // Проверяем до отправки: подсвечиваем поле и говорим, чего не хватает.
    const errors: { name?: string; phone?: string; email?: string } = {};
    if (!name.trim()) errors.name = form.nameRequiredText;
    if (!phone.trim() || phone.trim() === "+7") errors.phone = form.phoneRequiredText;
    else if (!isCompleteRuPhone(phone)) errors.phone = form.phoneIncompleteText;
    if (email.trim() && !isValidEmail(email)) errors.email = form.emailInvalidText;
    setFieldErrors(errors);
    if (errors.name || errors.phone || errors.email) {
      setStatus("idle");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setServerError("");
    setStatus("sending");

    // Уходит как multipart: текстовые поля плюс фото. Honeypot «company»
    // скрыт от людей, боты его заполняют.
    const payload = new FormData();
    for (const key of ["name", "phone", "email", "message", "company"]) {
      payload.append(key, String(formData.get(key) ?? ""));
    }
    for (const photo of photos) {
      payload.append("photos", photo.file, photo.file.name);
    }

    try {
      const response = await fetch("/api/lead", { method: "POST", body: payload });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setServerError(response.status === 400 && data.error ? data.error : "");
        throw new Error("request failed");
      }

      setStatus("success");
      reachGoal(metrikaId, "lead_form_submit");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative isolate bg-white px-5 py-16 text-brand-ink [clip-path:inset(0)] sm:px-6 lg:px-8 xl:px-0 lg:py-20" id={form.id}>
      <SectionWatermark />
      <div className="reveal mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        {/* На широком экране текст едет вместе со скроллом, пока форма не кончится */}
        <div className="lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-accent">{form.eyebrow}</p>
          <h2 className="mt-4 whitespace-pre-line font-heading text-[30px] leading-[1.1] sm:text-[34px] lg:text-[36px]">
            {form.title}
          </h2>
          <p className="mt-5 text-sm leading-[1.55] text-[#666666] sm:text-base sm:leading-[1.55]">{form.description}</p>

          <ul className="mt-7 grid gap-3">
            {form.bullets.map((bullet) => (
              <li className="flex items-center gap-2.5 text-[15px] text-[#555555]" key={bullet}>
                <CheckIcon />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {status === "success" ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl bg-[#f8f8f8] p-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/10">
              <svg aria-hidden="true" className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24">
                <path d="m20 6-11 11-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
              </svg>
            </span>
            <h3 className="mt-5 font-heading text-[26px]">{form.successTitle}</h3>
            <p className="mt-3 max-w-[360px] text-sm leading-[1.55] text-[#666666]">{form.successText}</p>
          </div>
        ) : (
          <form className="rounded-2xl bg-[#f8f8f8] p-6 sm:p-8" noValidate onSubmit={handleSubmit}>
            <div className="grid gap-5">
              <label className="grid gap-1.5 text-[13px] text-[#666666]">
                <span>{form.nameLabel}</span>
                <input
                  className={`${inputClass} ${fieldErrors.name ? "ring-2 ring-brand-accent/60" : ""}`}
                  name="name"
                  onChange={(event) => {
                    setName(event.target.value);
                    if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder={form.namePlaceholder}
                  type="text"
                  value={name}
                />
                {fieldErrors.name ? <span className="text-[12px] font-semibold text-brand-accent">{fieldErrors.name}</span> : null}
              </label>
              <label className="grid gap-1.5 text-[13px] text-[#666666]">
                <span>{form.phoneLabel}</span>
                <input
                  autoComplete="tel"
                  className={`${inputClass} ${fieldErrors.phone ? "ring-2 ring-brand-accent/60" : ""}`}
                  inputMode="tel"
                  name="phone"
                  onChange={(event) => {
                    const next = event.target.value;
                    const prevDigits = phone.replace(/\D/g, "");
                    const nextDigits = next.replace(/\D/g, "");
                    // Backspace на скобке или дефисе: цифры не изменились, а маска
                    // вернула бы символ обратно — удаляем ещё и последнюю цифру.
                    if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                    if (next.length < phone.length && nextDigits === prevDigits) {
                      setPhone(formatRuPhone(nextDigits.slice(0, -1)));
                      return;
                    }
                    setPhone(formatRuPhone(next));
                  }}
                  onFocus={() => {
                    if (!phone) setPhone("+7 ");
                  }}
                  onBlur={() => {
                    if (phone.trim() === "+7") setPhone("");
                  }}
                  placeholder={form.phonePlaceholder}
                  ref={phoneRef}
                  type="tel"
                  value={phone}
                />
                {fieldErrors.phone ? <span className="text-[12px] font-semibold text-brand-accent">{fieldErrors.phone}</span> : null}
              </label>
              <label className="grid gap-1.5 text-[13px] text-[#666666]">
                <span>{form.emailLabel}</span>
                <input
                  autoComplete="email"
                  className={`${inputClass} ${fieldErrors.email ? "ring-2 ring-brand-accent/60" : ""}`}
                  inputMode="email"
                  name="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder={form.emailPlaceholder}
                  type="email"
                  value={email}
                />
                {fieldErrors.email ? <span className="text-[12px] font-semibold text-brand-accent">{fieldErrors.email}</span> : null}
              </label>
              <label className="grid gap-1.5 text-[13px] text-[#666666]">
                <span>{form.messageLabel}</span>
                <textarea
                  className="site-scroll min-h-[118px] resize-y rounded-xl bg-[#e8e8e8] px-4 py-3 text-[15px] text-brand-ink outline-none transition placeholder:text-[#999999] focus:ring-2 focus:ring-brand-accent/35"
                  name="message"
                  placeholder={form.messagePlaceholder}
                />
              </label>
              <div className="grid gap-1.5 text-[13px] text-[#666666]">
                <span>{form.photosLabel}</span>
                <div className="flex flex-wrap gap-2.5">
                  {photos.map((photo, index) => (
                    <div className="relative h-[72px] w-[72px] overflow-hidden rounded-xl bg-[#e8e8e8]" key={photo.url}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" className="h-full w-full object-cover" src={photo.url} />
                      <button
                        aria-label="Убрать фото"
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[13px] leading-none text-white transition hover:bg-brand-accent"
                        onClick={() => removePhoto(index)}
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {photos.length < MAX_PHOTOS ? (
                    <button
                      className="flex h-[72px] min-w-[72px] items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#c4c4c0] px-5 text-[13px] font-semibold text-[#666666] transition hover:border-brand-accent hover:text-brand-accent"
                      onClick={() => photoInputRef.current?.click()}
                      type="button"
                    >
                      <span className="text-[18px] leading-none">+</span>
                      {photos.length === 0 ? form.photosAddText : null}
                    </button>
                  ) : null}
                </div>
                {form.photosHint ? <span className="text-[12px] text-[#999999]">{form.photosHint}</span> : null}
                <input
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={(event) => {
                    addPhotos(event.target.files);
                    event.target.value = "";
                  }}
                  ref={photoInputRef}
                  type="file"
                />
              </div>
            </div>

            <input
              aria-hidden="true"
              autoComplete="off"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              name="company"
              tabIndex={-1}
            />

            <label className="mt-6 flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.4] text-[#666666]">
              <input
                checked={consent}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-accent [color-scheme:light]"
                onChange={(event) => setConsent(event.target.checked)}
                type="checkbox"
              />
              <span>
                {form.consentPrefix}
                <a className="underline underline-offset-2 transition hover:text-brand-ink" href={privacyHref}>
                  {form.consentLinkText}
                </a>
              </span>
            </label>

            <button
              className="mt-4 h-12 w-full rounded-xl bg-brand-accent px-5 text-[15px] font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={status === "sending" || !consent}
              type="submit"
            >
              {status === "sending" ? form.sendingText : form.submitText}
            </button>

            {status === "error" ? (
              <p className="mt-3 text-[13px] font-semibold leading-[1.4] text-brand-accent">{serverError || form.errorText}</p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
