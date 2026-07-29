"use client";

import { useState } from "react";

import SectionWatermark from "@/components/SectionWatermark";

type FAQContent = typeof import("@/data/content.json")["faq"];

type FAQProps = {
  faq: FAQContent;
};

export default function FAQ({ faq }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative isolate bg-[#f8f8f8] px-5 py-16 text-brand-ink [clip-path:inset(0)] sm:px-6 lg:px-0 lg:py-20" id={faq.id}>
      <SectionWatermark />
      <div className="reveal mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[360px_1fr] lg:justify-between lg:gap-12">
        <div>
          <h2 className="font-heading text-[34px] leading-[1.1] sm:text-[42px]">{faq.title}</h2>
          <p className="mt-5 text-sm leading-[1.55] text-[#666666] sm:text-base sm:leading-[1.55]">{faq.subtitle}</p>
        </div>

        <div className="lg:ml-auto lg:w-[700px]">
          {faq.items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
            <div className="border-b border-[#dddddd] px-0 py-6 lg:px-6" key={item.question}>
              <button
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-5 text-left text-base font-bold"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                type="button"
              >
                <span>{item.question}</span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xl leading-none text-brand-accent transition duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="pt-3 text-sm leading-[1.55] text-[#666666]">{item.answer}</p>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
