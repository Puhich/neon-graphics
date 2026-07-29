"use client";

import Image from "next/image";
import { useRef } from "react";

import SectionWatermark from "@/components/SectionWatermark";

type ReviewsContent = typeof import("@/data/content.json")["reviews"];

type ReviewsProps = {
  reviews: ReviewsContent;
};

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function Reviews({ reviews }: ReviewsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: "left" | "right") => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const scrollAmount = scroller.clientWidth + 24;
    const currentScroll = scroller.scrollLeft;
    let nextScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;

    if (direction === "right" && currentScroll >= maxScroll - 8) {
      nextScroll = 0;
    }

    if (direction === "left" && currentScroll <= 8) {
      nextScroll = maxScroll;
    }

    scroller.scrollTo({
      left: nextScroll,
      behavior: "smooth"
    });
  };

  return (
    <section className="relative isolate bg-white px-5 py-16 text-brand-ink [clip-path:inset(0)] sm:px-6 lg:px-0 lg:py-20" id={reviews.id}>
      <SectionWatermark />
      <div className="reveal mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="font-heading text-[34px] leading-tight sm:text-[42px] lg:text-[48px]">{reviews.title}</h2>
          <p className="mx-auto mt-4 max-w-[600px] text-sm leading-[1.55] text-[#666666] sm:text-base sm:leading-[1.55]">{reviews.subtitle}</p>
        </div>

        <div className="-mx-5 mt-12 flex items-center gap-4 overflow-hidden sm:-mx-6 lg:mx-0 lg:overflow-visible lg:gap-6">
          <button
            aria-label={reviews.previousLabel}
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-brand-ink transition hover:bg-brand-accent hover:text-white lg:flex"
            onClick={() => scrollByCard("left")}
            type="button"
          >
            <ChevronIcon direction="left" />
          </button>

          <div
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 scroll-smooth px-5 pb-4 [touch-action:pan-x_pan-y] sm:gap-6 sm:scroll-px-6 sm:px-6 lg:px-0 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            ref={scrollerRef}
          >
            {reviews.items.map((review) => (
              <article className="min-w-[calc(100vw-40px)] snap-start sm:min-w-[360px] lg:min-w-[calc((100%_-_48px)/3)]" key={review.author}>
                <div className="relative h-[220px] overflow-hidden rounded-lg bg-zinc-200">
                  <Image
                    className="pointer-events-none object-cover"
                    src={review.imageSrc}
                    alt={review.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 320px, 86vw"
                  />
                </div>
                <p className="mt-4 text-[15px] leading-[1.6] text-[#333333]">{review.text}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#d0d0d0]" />
                  <div>
                    <p className="text-sm font-bold">{review.author}</p>
                    <p className="mt-0.5 text-[13px] text-[#999999]">{review.company}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            aria-label={reviews.nextLabel}
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-brand-ink transition hover:bg-brand-accent hover:text-white lg:flex"
            onClick={() => scrollByCard("right")}
            type="button"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
