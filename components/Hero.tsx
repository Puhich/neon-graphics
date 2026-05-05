"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

type SiteContent = typeof import("@/data/content.json");

type HeroProps = {
  content: SiteContent;
};

export default function Hero({ content }: HeroProps) {
  const { topBar, nav, hero, title, subtitle, ctaText, stats } = content;
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });
  const carouselImages = useMemo(() => [...hero.images, ...hero.images, ...hero.images], [hero.images]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    let frameId = 0;
    const tick = () => {
      if (!isPaused && !isDragging) {
        carousel.scrollLeft += 0.55;

        if (carousel.scrollLeft >= carousel.scrollWidth / 3) {
          carousel.scrollLeft = 0;
        }
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isDragging, isPaused]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    setIsDragging(true);
    setIsPaused(true);
    dragState.current = {
      startX: event.clientX,
      scrollLeft: carousel.scrollLeft
    };
    carousel.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel || !isDragging) {
      return;
    }

    carousel.scrollLeft = dragState.current.scrollLeft - (event.clientX - dragState.current.startX);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    setIsDragging(false);

    if (carousel?.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="relative overflow-hidden bg-brand-bg text-white">
      <div className="pointer-events-none absolute right-[-9rem] top-28 hidden h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(204,26,44,0.34),rgba(22,140,205,0.16)_42%,rgba(15,15,13,0)_70%)] blur-3xl lg:block" />
      <Image
        className="pointer-events-none absolute right-[7rem] top-[9.8rem] hidden h-auto w-[26.5rem] opacity-[0.48] brightness-0 lg:block"
        src={nav.logoSrc}
        alt=""
        width={422}
        height={182}
        priority
      />

      <div className="hidden bg-[#0a0a09] px-6 py-[10px] text-[12px] font-medium text-[#999999] lg:block">
        <div className="mx-auto flex max-w-[1200px] justify-end gap-4">
          {topBar.map((item, index) => (
            <span className="flex items-center gap-4" key={item}>
              {index > 0 ? <span className="text-[#444444]">·</span> : null}
              {item}
            </span>
          ))}
        </div>
      </div>

      <header className="relative z-10 mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3 sm:px-6 lg:px-0">
        <Image className="h-14 w-auto lg:h-16" src={nav.logoSrc} alt={nav.logoAlt} width={148} height={64} priority />
        <nav className="hidden items-center gap-9 text-[14px] font-medium text-[#999999] lg:flex">
          {nav.links.map((link) => (
            <a className="transition hover:text-white" href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>
        <a
          className="rounded bg-brand-accent px-6 py-[10px] text-[14px] font-bold text-white transition hover:bg-red-700"
          href={nav.cta.href}
        >
          {nav.cta.label}
        </a>
      </header>

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-10 pt-9 sm:px-6 md:pt-12 lg:px-[120px]">
        <div className="max-w-[780px]">
          <h1 className="font-heading text-[42px] leading-[1.08] sm:text-[56px] lg:text-[64px]">
            <span className="block">{title}</span>
            <span className="block text-brand-accent drop-shadow-[0_0_22px_rgba(204,26,44,0.75)]">
              {hero.highlight}
            </span>
          </h1>
          <p className="mt-6 max-w-[760px] text-base leading-[1.6] text-[#999999] sm:text-lg lg:text-[20px]">
            {subtitle}
          </p>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:gap-5">
            <a
              className="rounded bg-brand-accent px-9 py-4 text-center text-[16px] font-bold text-white shadow-[0_0_22px_rgba(204,26,44,0.42)] transition hover:bg-red-700"
              href={hero.primaryCta.href}
            >
              {ctaText}
            </a>
            <a
              className="rounded border border-[#444444] px-9 py-4 text-center text-[16px] font-semibold text-white transition hover:border-white"
              href={hero.secondaryCta.href}
            >
              {hero.secondaryCta.label}
            </a>
          </div>

          <ul className="mt-5 flex flex-col gap-3 pt-2 text-[13px] text-[#999999] sm:flex-row sm:flex-wrap sm:gap-8">
            {hero.advantages.map((advantage) => (
              <li className="flex items-center gap-2" key={advantage}>
                <span className="h-3 w-3 rounded-full border border-brand-accent bg-brand-accent/20 shadow-[0_0_10px_rgba(204,26,44,0.85)]" />
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] pb-6 pt-2">
        <div className="pointer-events-none absolute inset-y-2 left-0 z-10 w-20 bg-gradient-to-r from-brand-bg to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-2 right-0 z-10 w-20 bg-gradient-to-l from-brand-bg to-transparent sm:w-28" />
        <div
          ref={carouselRef}
          className={`flex cursor-grab select-none gap-4 overflow-x-auto px-5 py-6 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing sm:px-0 [&::-webkit-scrollbar]:hidden`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (!isDragging) {
              setIsPaused(false);
            }
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {carouselImages.map((image, index) => (
            <div
              className="relative h-[156px] w-[238px] shrink-0 overflow-hidden rounded-lg bg-zinc-900 sm:h-[198px] sm:w-[292px] lg:h-[230px] lg:w-[320px]"
              key={`${image.src}-${index}`}
            >
              <Image
                className="pointer-events-none object-cover"
                src={image.src}
                alt={image.alt}
                fill
                sizes="320px"
                priority={index < hero.images.length}
              />
            </div>
          ))}
        </div>
      </div>

      <dl className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-2 gap-y-8 px-5 pb-12 pt-3 sm:px-6 lg:grid-cols-4 lg:px-0 lg:pb-16">
        {stats.map((stat) => (
          <div className="border-[#333333] text-center lg:border-l lg:first:border-l-0" key={stat.label}>
            <dt className="font-heading text-[36px] leading-none text-brand-accent sm:text-[48px]">{stat.value}</dt>
            <dd className="mt-3 text-[15px] font-medium text-[#999999]">{stat.label}</dd>
          </div>
        ))}
      </dl>

      <a
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-xl text-white shadow-[0_0_24px_rgba(204,26,44,0.6)] transition hover:bg-red-700 lg:h-16 lg:w-16"
        href={nav.cta.href}
        aria-label={nav.cta.label}
      >
        {hero.callIcon}
      </a>
    </section>
  );
}
