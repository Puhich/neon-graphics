"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

type PortfolioContent = typeof import("@/data/content.json")["portfolio"];

type PortfolioProps = {
  portfolio: PortfolioContent;
};

export default function Portfolio({ portfolio }: PortfolioProps) {
  const slides = useMemo(() => [portfolio.featured, ...portfolio.thumbnails], [portfolio.featured, portfolio.thumbnails]);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = useCallback((nextIndex: number) => {
    const normalizedIndex = (nextIndex + slides.length) % slides.length;
    setActiveIndex(normalizedIndex);
  }, [slides.length]);

  return (
    <section className="bg-white px-5 py-16 text-brand-ink sm:px-6 lg:px-0 lg:py-20" id={portfolio.id}>
      <div className="mx-auto max-w-[1200px] text-center">
        <h2 className="font-heading text-[34px] leading-tight sm:text-[42px] lg:text-[48px]">{portfolio.title}</h2>
        <p className="mx-auto mt-4 max-w-[620px] text-sm leading-7 text-[#666666] sm:text-base">
          {portfolio.subtitle}
        </p>

        <div
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 sm:gap-5 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide) => (
            <div
              className="relative h-72 min-w-[82vw] snap-start overflow-hidden rounded-xl bg-zinc-100 sm:h-[420px] sm:min-w-[72vw]"
              key={slide.src}
            >
              <Image
                className="object-cover"
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="82vw"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 hidden items-center gap-5 lg:grid lg:grid-cols-[48px_1fr_48px]">
          <button
            aria-label={portfolio.previousLabel}
            className="hidden h-12 w-12 rounded-full bg-[#f0f0f0] text-3xl leading-none text-[#333333] transition hover:bg-brand-accent hover:text-white lg:block"
            onClick={() => goToSlide(activeIndex - 1)}
            type="button"
          >
            {portfolio.previousIcon}
          </button>

          <div
            className="relative h-72 overflow-hidden rounded-xl bg-zinc-100 sm:h-[420px] lg:h-[500px]"
          >
            {slides.map((slide, index) => (
              <Image
                className={`pointer-events-none select-none object-cover transition-opacity duration-300 ${
                  index === activeIndex ? "opacity-100" : "opacity-0"
                }`}
                src={slide.src}
                alt={slide.alt}
                fill
                key={`${slide.src}-${index}`}
                loading={index < 4 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 1104px, 100vw"
              />
            ))}
          </div>

          <button
            aria-label={portfolio.nextLabel}
            className="hidden h-12 w-12 rounded-full bg-[#f0f0f0] text-3xl leading-none text-[#333333] transition hover:bg-brand-accent hover:text-white lg:block"
            onClick={() => goToSlide(activeIndex + 1)}
            type="button"
          >
            {portfolio.nextIcon}
          </button>
        </div>

        <div className="mx-auto mt-5 hidden max-w-full justify-start gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex lg:justify-center [&::-webkit-scrollbar]:hidden">
          {slides.map((image, index) => (
            <button
              aria-label={image.alt}
              className={`relative h-[50px] w-[75px] shrink-0 overflow-hidden rounded border-2 transition ${
                index === activeIndex ? "border-brand-accent" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              key={`${image.src}-${index}`}
              onClick={() => goToSlide(index)}
              type="button"
            >
              <Image className="object-cover" src={image.src} alt="" fill sizes="75px" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
