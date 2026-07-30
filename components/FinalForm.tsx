"use client";

import { useState, type FormEvent } from "react";

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
  const [consent, setConsent] = useState(true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "sending" || !consent) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setStatus("sending");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          message: formData.get("message"),
          // Honeypot: поле скрыто от людей, боты его заполняют.
          company: formData.get("company")
        })
      });

      if (!response.ok) {
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
      <div className="reveal mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-accent">{form.eyebrow}</p>
          <h2 className="mt-4 whitespace-pre-line font-heading text-[34px] leading-[1.1] sm:text-[42px] lg:text-[48px]">
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
                <input className={inputClass} name="name" placeholder={form.namePlaceholder} required type="text" />
              </label>
              <label className="grid gap-1.5 text-[13px] text-[#666666]">
                <span>{form.phoneLabel}</span>
                <input className={inputClass} name="phone" placeholder={form.phonePlaceholder} required type="tel" />
              </label>
              <label className="grid gap-1.5 text-[13px] text-[#666666]">
                <span>{form.emailLabel}</span>
                <input className={inputClass} name="email" placeholder={form.emailPlaceholder} type="email" />
              </label>
              <label className="grid gap-1.5 text-[13px] text-[#666666]">
                <span>{form.messageLabel}</span>
                <textarea
                  className="min-h-[118px] resize-y rounded-xl bg-[#e8e8e8] px-4 py-3 text-[15px] text-brand-ink outline-none transition placeholder:text-[#999999] focus:ring-2 focus:ring-brand-accent/35"
                  name="message"
                  placeholder={form.messagePlaceholder}
                />
              </label>
            </div>

            <input
              aria-hidden="true"
              autoComplete="off"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              name="company"
              tabIndex={-1}
            />

            <button
              className="mt-6 h-12 w-full rounded-xl bg-brand-accent px-5 text-[15px] font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={status === "sending" || !consent}
              type="submit"
            >
              {status === "sending" ? form.sendingText : form.submitText}
            </button>

            <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.4] text-[#666666]">
              <input
                checked={consent}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-accent"
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

            {status === "error" ? (
              <p className="mt-3 text-[13px] font-semibold leading-[1.4] text-brand-accent">{form.errorText}</p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
