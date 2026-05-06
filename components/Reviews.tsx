"use client";

import Image from "next/image";
import { useRef } from "react";

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

    const scrollAmount = scroller.clientWidth + 24;
    scroller.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <section className="bg-white px-5 py-16 text-brand-ink sm:px-6 lg:px-0 lg:py-20" id={reviews.id}>
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="font-heading text-[34px] leading-tight sm:text-[42px] lg:text-[48px]">{reviews.title}</h2>
          <p className="mx-auto mt-4 max-w-[600px] text-sm leading-[1.6] text-[#666666] sm:text-base">{reviews.subtitle}</p>
        </div>

        <div className="mt-12 flex items-center gap-4 lg:gap-6">
          <button
            aria-label={reviews.previousLabel}
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-brand-ink transition hover:bg-brand-accent hover:text-white lg:flex"
            onClick={() => scrollByCard("left")}
            type="button"
          >
            <ChevronIcon direction="left" />
          </button>

          <div
            className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 sm:gap-6 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            ref={scrollerRef}
          >
            {reviews.items.map((review) => (
              <article className="min-w-[82vw] snap-start sm:min-w-[360px] lg:min-w-[calc((100%_-_48px)/3)]" key={review.author}>
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
