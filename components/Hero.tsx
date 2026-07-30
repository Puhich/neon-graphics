"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

import SectionWatermark from "@/components/SectionWatermark";
import type { SiteContent } from "@/lib/content-schema";
import { telHref, topBarItems } from "@/lib/site";

type HeroProps = {
  content: SiteContent;
};

const contactIcons = [
  {
    label: "phone",
    path: "M22 16.92v2.5a2.45 2.45 0 0 1-2.67 2.45A19.3 19.3 0 0 1 10.92 19 18.9 18.9 0 0 1 5 13.08a19.3 19.3 0 0 1-2.87-8.46A2.45 2.45 0 0 1 4.57 2h2.5a2.45 2.45 0 0 1 2.45 2.1c.16 1.18.43 2.33.82 3.43a2.45 2.45 0 0 1-.55 2.52l-1.06 1.06a15.7 15.7 0 0 0 6.16 6.16l1.06-1.06a2.45 2.45 0 0 1 2.52-.55c1.1.39 2.25.66 3.43.82A2.45 2.45 0 0 1 22 16.92Z"
  },
  {
    label: "map",
    path: "M12 22s8-6.8 8-12a8 8 0 1 0-16 0c0 5.2 8 12 8 12Zm0-9.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z"
  },
  {
    label: "clock",
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1.2 5.2v4.3l3.5 2-1.2 2.1-4.7-2.7V7.2h2.4Z"
  }
];

function ContactIcon({ path, label }: { path: string; label: string }) {
  return (
    <svg aria-label={label} className="h-3.5 w-3.5 shrink-0 text-[#8a8a8a]" fill="none" viewBox="0 0 24 24">
      <path d={path} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5 text-brand-accent" fill="none" viewBox="0 0 24 24">
      <path d="m20 6-11 11-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
    </svg>
  );
}

function BurgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      {isOpen ? (
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      )}
    </svg>
  );
}

const socialIconFiles: Record<string, string> = {
  telegram: "/icons/tg.svg",
  max: "/icons/max.svg",
  vk: "/icons/vk.svg"
};

function NavSocialIcon({ icon }: { icon: string }) {
  const file = socialIconFiles[icon] ?? socialIconFiles.telegram;

  return (
    <span
      aria-hidden="true"
      className="inline-block h-[22px] w-[22px] bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
      style={{ maskImage: `url(${file})`, WebkitMaskImage: `url(${file})` }}
    />
  );
}

function PhoneFillIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
      <path d="M22 16.92v2.5a2.45 2.45 0 0 1-2.67 2.45A19.3 19.3 0 0 1 10.92 19 18.9 18.9 0 0 1 5 13.08a19.3 19.3 0 0 1-2.87-8.46A2.45 2.45 0 0 1 4.57 2h2.5a2.45 2.45 0 0 1 2.45 2.1c.16 1.18.43 2.33.82 3.43a2.45 2.45 0 0 1-.55 2.52l-1.06 1.06a15.7 15.7 0 0 0 6.16 6.16l1.06-1.06a2.45 2.45 0 0 1 2.52-.55c1.1.39 2.25.66 3.43.82A2.45 2.45 0 0 1 22 16.92Z" fill="currentColor" />
    </svg>
  );
}

export default function Hero({ content }: HeroProps) {
  const { company, nav, hero } = content;
  const topBar = useMemo(() => topBarItems(company), [company]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navOpacity, setNavOpacity] = useState(0);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });
  const autoScrollPos = useRef(0);
  const carouselImages = useMemo(() => [...hero.images, ...hero.images, ...hero.images], [hero.images]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    let frameId = 0;
    const tick = () => {
      if (!isPaused && !isDragging) {
        // Safari rounds scrollLeft to integers, so a fractional increment on
        // the live value never accumulates — keep the position in a float ref.
        if (Math.abs(carousel.scrollLeft - autoScrollPos.current) > 2) {
          autoScrollPos.current = carousel.scrollLeft;
        }

        autoScrollPos.current += 0.55;

        if (autoScrollPos.current >= carousel.scrollWidth / 3) {
          autoScrollPos.current = 0;
        }

        carousel.scrollLeft = autoScrollPos.current;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isDragging, isPaused]);

  useEffect(() => {
    const updateHeaderState = () => setNavOpacity(Math.min(window.scrollY / 120, 1));

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

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
    <>
      <div className="hidden bg-[linear-gradient(to_right,#0f0f0d_0%,#0c0c0b_45%,#050504_100%)] px-6 py-[10px] text-[12px] font-medium text-[#999999] lg:block lg:px-8 xl:px-6">
        <div className="mx-auto flex max-w-[1200px] justify-end gap-9">
          {topBar.map((item, index) => (
            <span className="flex items-center gap-1.5" key={item}>
              <ContactIcon {...contactIcons[index]} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <header
        className="sticky top-0 z-[9000] -mb-[64px] lg:-mb-[80px] xl:-mb-[88px]"
        style={{
          "--nav-bg-opacity": isMenuOpen ? 0.9 : navOpacity * 0.9,
          "--nav-blur": `${(isMenuOpen ? 1 : navOpacity) * 18}px`,
          "--nav-shadow-opacity": (isMenuOpen ? 1 : navOpacity) * 0.28,
          "--logo-scale": 1 - navOpacity * 0.12
        } as React.CSSProperties}
      >
        <div
          className="nav-backdrop pointer-events-none absolute inset-0 bg-[rgb(7_7_6_/_var(--nav-bg-opacity))] shadow-[0_10px_34px_rgb(0_0_0_/_var(--nav-shadow-opacity))] lg:backdrop-blur-[var(--nav-blur)]"
        />
        <div className="relative mx-auto flex max-w-[1200px] items-center justify-between px-5 py-2 sm:px-6 lg:px-8 xl:px-0">
          <Image
            className="h-12 w-auto origin-left lg:h-16 lg:transition-transform lg:duration-150 lg:[transform:scale(var(--logo-scale))] xl:h-[72px]"
            src={nav.logoSrc}
            alt={nav.logoAlt}
            width={185}
            height={80}
            priority
          />
          <div className="hidden items-center gap-4 lg:flex xl:gap-7">
            <nav className="flex items-center gap-4 whitespace-nowrap text-[14px] font-medium text-[#999999] xl:gap-8">
              {nav.links.map((link) => (
                <a className="transition hover:text-white" href={link.href} key={link.label}>
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3.5 text-[#999999] xl:gap-5">
              {nav.socials.map((social) => (
                <a
                  aria-label={social.label}
                  className="flex items-center transition hover:text-white"
                  href={social.href}
                  key={social.label}
                >
                  <NavSocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
            <a
              className="rounded-xl bg-brand-accent px-6 py-[10px] text-[14px] font-bold text-white transition hover:bg-red-700"
              href={nav.cta.href}
            >
              {nav.cta.label}
            </a>
          </div>
          <a
            className="ml-auto mr-3 rounded-xl bg-brand-accent px-5 py-[10px] text-[14px] font-bold text-white transition hover:bg-red-700 lg:hidden"
            href={nav.cta.href}
          >
            {nav.cta.label}
          </a>
          <button
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? nav.menuCloseLabel : nav.menuOpenLabel}
            className="relative z-[9100] flex h-11 w-11 items-center justify-center rounded-xl border border-[#333333] text-[#dddddd] transition hover:border-[#555555] lg:hidden"
            onClick={() => setIsMenuOpen((value) => !value)}
            type="button"
          >
            <BurgerIcon isOpen={isMenuOpen} />
          </button>

        {isMenuOpen ? (
          <div className="absolute left-5 right-5 top-[calc(100%+8px)] z-[9100] rounded-2xl border border-[#2a2a28] bg-[#0a0a09]/95 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:left-6 sm:right-6 lg:hidden">
            <div className="grid gap-3 text-[12px] font-medium text-[#999999]">
              {topBar.map((item, index) => (
                <span className="flex items-center gap-2" key={item}>
                  <ContactIcon {...contactIcons[index]} />
                  {item}
                </span>
              ))}
            </div>

            <nav className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 text-[15px] font-semibold text-[#dddddd]">
              {nav.links.map((link) => (
                <a
                  className="transition hover:text-white"
                  href={link.href}
                  key={link.label}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-5 flex items-center gap-5 text-[#999999]">
              {nav.socials.map((social) => (
                <a
                  aria-label={social.label}
                  className="flex items-center transition hover:text-white"
                  href={social.href}
                  key={social.label}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <NavSocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>
        ) : null}
        </div>
      </header>

      <section className="relative isolate z-20 overflow-hidden bg-brand-bg text-white [clip-path:inset(0)]">
      <SectionWatermark variant="hero" />

      <div className="reveal relative z-10 mx-auto max-w-[1440px] px-5 pb-8 pt-28 sm:px-6 md:pt-32 lg:px-[120px]">
        <div className="max-w-[860px]">
          <h1 className="font-heading text-[34px] leading-[1.08] sm:text-[46px] lg:text-[52px]">
            <span className="block">{hero.title}</span>
            <span className="block text-brand-accent drop-shadow-[0_0_10px_rgba(204,26,44,0.42)]">
              {hero.highlight}
            </span>
          </h1>
          <p className="mt-5 max-w-[700px] text-[15px] leading-[1.6] text-[#999999] sm:text-[16px] lg:text-[17px]">
            {hero.subtitle}
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-5">
            <a
              className="rounded-xl bg-brand-accent px-9 py-4 text-center text-[16px] font-bold text-white shadow-[0_0_22px_rgba(204,26,44,0.42)] transition hover:bg-red-700"
              href={hero.primaryCta.href}
            >
              {hero.primaryCta.label}
            </a>
            <a
              className="rounded-xl border border-[#444444] px-9 py-4 text-center text-[16px] font-semibold text-white transition hover:border-white"
              href={hero.secondaryCta.href}
            >
              {hero.secondaryCta.label}
            </a>
          </div>

          <ul className="mt-7 flex flex-col gap-2 text-[13px] text-[#999999] sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
            {hero.advantages.map((advantage) => (
              <li className="flex items-center gap-1.5" key={advantage}>
                <CheckIcon />
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="reveal relative z-10 mx-auto max-w-[1920px] pb-6 pt-0">
        <div className="pointer-events-none absolute bottom-6 left-0 top-6 z-10 w-20 bg-gradient-to-r from-brand-bg to-transparent sm:w-28" />
        <div className="pointer-events-none absolute bottom-6 right-0 top-6 z-10 w-20 bg-gradient-to-l from-brand-bg to-transparent sm:w-28" />
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
              className="relative h-[156px] w-[238px] shrink-0 overflow-hidden rounded-xl bg-zinc-900 sm:h-[198px] sm:w-[292px] lg:h-[230px] lg:w-[340px] 2xl:h-[260px] 2xl:w-[410px]"
              key={`${image.src}-${index}`}
            >
              <Image
                className="pointer-events-none object-cover"
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1536px) 410px, (min-width: 1024px) 340px, (min-width: 640px) 292px, 238px"
                priority={index < 3}
              />
            </div>
          ))}
        </div>
      </div>

      <dl className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-2 gap-y-8 px-5 pb-12 pt-3 sm:px-6 lg:grid-cols-4 lg:px-8 xl:px-0 lg:pb-16">
        {hero.stats.map((stat) => (
          <div className="border-white/10 text-center lg:border-l lg:first:border-l-0" key={stat.label}>
            <dt className="font-heading text-[36px] leading-none text-brand-accent sm:text-[48px]">{stat.value}</dt>
            <dd className="mt-3 text-[15px] font-medium text-[#999999]">{stat.label}</dd>
          </div>
        ))}
      </dl>

      </section>
      <a
        className="fixed bottom-20 right-5 z-[2147483647] flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-xl text-white shadow-[0_0_24px_rgba(204,26,44,0.6)] transition hover:bg-red-700 sm:bottom-6 sm:right-6 lg:h-16 lg:w-16"
        href={telHref(company.phone)}
        aria-label={nav.callLabel}
      >
        <PhoneFillIcon />
      </a>
    </>
  );
}
