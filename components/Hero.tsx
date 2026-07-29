"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

type SiteContent = typeof import("@/data/content.json");

type HeroProps = {
  content: SiteContent;
};

const contactIcons = [
  {
    label: "phone",
    path: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92Z"
  },
  {
    label: "map",
    path: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
  },
  {
    label: "clock",
    path: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2"
  }
];

function ContactIcon({ path, label }: { path: string; label: string }) {
  return (
    <svg aria-label={label} className="h-3.5 w-3.5 text-[#666666]" fill="none" viewBox="0 0 24 24">
      <path d={path} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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

function NavSocialIcon({ icon }: { icon: string }) {
  if (icon === "max") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M21 11.5a8.38 8.38 0 0 1-1.17 4.28A8.5 8.5 0 0 1 12.5 20a8.38 8.38 0 0 1-4.28-1.17L3 20l1.17-5.22A8.38 8.38 0 0 1 3 10.5 8.5 8.5 0 0 1 7.22 3.17 8.38 8.38 0 0 1 11.5 2h.5A8.48 8.48 0 0 1 21 10v1.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M8.9 14.4V9.2l3.1 2.9 3.1-2.9v5.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (icon === "vk") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="1.5 4 21 13.5">
        <path d="M12.79 16.24s.28-.03.43-.19c.14-.15.13-.43.13-.43s-.02-1.3.58-1.5c.59-.19 1.34 1.26 2.14 1.82.6.42 1.06.33 1.06.33l2.14-.03s1.12-.07.59-.96c-.04-.08-.31-.66-1.59-1.87-1.34-1.27-1.16-1.06.45-3.25.99-1.33 1.38-2.14 1.26-2.49-.12-.33-.84-.24-.84-.24l-2.41.01s-.18-.02-.31.06c-.13.08-.21.26-.21.26s-.38 1.03-.89 1.91c-1.07 1.85-1.5 1.95-1.67 1.83-.41-.27-.31-1.07-.31-1.65 0-1.79.27-2.54-.52-2.73-.26-.07-.45-.11-1.12-.11-.86-.01-1.59 0-2 .2-.27.14-.48.44-.35.46.16.02.52.1.71.36.25.34.24 1.11.24 1.11s.14 2.11-.33 2.37c-.32.18-.77-.19-1.72-1.87-.49-.86-.86-1.81-.86-1.81s-.07-.18-.2-.27c-.15-.12-.37-.15-.37-.15l-2.29.01s-.34.01-.47.16c-.11.14-.01.42-.01.42s1.79 4.25 3.82 6.4c1.86 1.97 3.97 1.84 3.97 1.84h.96Z" fill="currentColor" />
      </svg>
    );
  }

  if (icon === "telegram") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M21.5 4.5 18.2 20c-.25 1.14-.92 1.41-1.86.88l-5.15-3.8-2.48 2.38c-.28.28-.51.51-1.04.51l.37-5.24 9.54-8.62c.42-.37-.09-.58-.64-.21L5.15 13.32.07 11.73c-1.1-.35-1.12-1.1.23-1.62L20.2 2.44c.92-.34 1.72.2 1.3 2.06Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M21 11.5a8.38 8.38 0 0 1-1.17 4.28A8.5 8.5 0 0 1 12.5 20a8.38 8.38 0 0 1-4.28-1.17L3 20l1.17-5.22A8.38 8.38 0 0 1 3 10.5 8.5 8.5 0 0 1 7.22 3.17 8.38 8.38 0 0 1 11.5 2h.5A8.48 8.48 0 0 1 21 10v1.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
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
  const { topBar, nav, hero, title, subtitle, ctaText, stats } = content;
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navOpacity, setNavOpacity] = useState(0);
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
      <div className="hidden bg-[#0a0a09] px-6 py-[10px] text-[12px] font-medium text-[#999999] lg:block">
        <div className="mx-auto flex max-w-[1200px] justify-end gap-4">
          {topBar.map((item, index) => (
            <span className="flex items-center gap-1.5" key={item}>
              <ContactIcon {...contactIcons[index]} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <header
        className="sticky top-0 z-[9000] -mb-[64px] lg:-mb-[88px]"
        style={{
          "--nav-bg-opacity": isMenuOpen ? 0.9 : navOpacity * 0.9,
          "--nav-blur": `${(isMenuOpen ? 1 : navOpacity) * 18}px`,
          "--nav-shadow-opacity": (isMenuOpen ? 1 : navOpacity) * 0.28,
          "--logo-scale": 1 - navOpacity * 0.12
        } as React.CSSProperties}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[rgb(7_7_6_/_var(--nav-bg-opacity))] shadow-[0_10px_34px_rgb(0_0_0_/_var(--nav-shadow-opacity))] backdrop-blur-[var(--nav-blur)]"
        />
        <div className="relative mx-auto flex max-w-[1200px] items-center justify-between px-5 py-2 sm:px-6 lg:px-0">
          <Image
            className="h-12 w-auto origin-left lg:h-[72px] lg:transition-transform lg:duration-150 lg:[transform:scale(var(--logo-scale))]"
            src={nav.logoSrc}
            alt={nav.logoAlt}
            width={185}
            height={80}
            priority
          />
          <div className="hidden items-center gap-7 lg:flex">
            <nav className="flex items-center gap-8 text-[14px] font-medium text-[#999999]">
              {nav.links.map((link) => (
                <a className="transition hover:text-white" href={link.href} key={link.label}>
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-5 text-[#999999]">
              {nav.socials.map((social) => (
                <a
                  aria-label={social.label}
                  className="transition hover:text-white"
                  href={social.href}
                  key={social.label}
                >
                  <NavSocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
            <a
              className="rounded bg-brand-accent px-6 py-[10px] text-[14px] font-bold text-white transition hover:bg-red-700"
              href={nav.cta.href}
            >
              {nav.cta.label}
            </a>
          </div>
          <a
            className="ml-auto mr-3 rounded bg-brand-accent px-5 py-[10px] text-[14px] font-bold text-white transition hover:bg-red-700 lg:hidden"
            href={nav.cta.href}
          >
            {nav.cta.label}
          </a>
          <button
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? nav.menuCloseLabel : nav.menuOpenLabel}
            className="relative z-[9100] flex h-11 w-11 items-center justify-center rounded border border-[#333333] text-[#dddddd] transition hover:border-[#555555] lg:hidden"
            onClick={() => setIsMenuOpen((value) => !value)}
            type="button"
          >
            <BurgerIcon isOpen={isMenuOpen} />
          </button>

        {isMenuOpen ? (
          <div className="absolute left-5 right-5 top-[calc(100%+8px)] z-[9100] rounded-lg border border-[#2a2a28] bg-[#0a0a09]/95 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:left-6 sm:right-6 lg:hidden">
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
                  className="transition hover:text-white"
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

      <section className="relative isolate overflow-hidden bg-brand-bg text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden lg:block">
        <div className="relative mx-auto max-w-[1440px]">
          <div className="absolute right-[7.5rem] top-[8.2rem] h-[31.8rem] w-[25.8rem]">
            <Image
              className="absolute inset-[-5.5rem] h-[calc(100%+11rem)] w-[calc(100%+11rem)] object-contain opacity-75 blur-[88px] saturate-150"
              src={hero.watermarkLogoSrc}
              alt=""
              fill
              priority
              sizes="540px"
            />
            <div className="absolute inset-[-8rem] bg-[radial-gradient(circle_at_center,rgba(204,26,44,0.2),rgba(22,140,205,0.18)_58%,rgba(15,15,13,0)_76%)] blur-[72px]" />
            <Image
              className="absolute inset-0 h-full w-full object-contain opacity-[0.72] brightness-0"
              src={hero.watermarkLogoSrc}
              alt=""
              fill
              priority
              sizes="420px"
            />
          </div>
        </div>
      </div>

      <div className="reveal relative z-10 mx-auto max-w-[1440px] px-5 pb-8 pt-28 sm:px-6 md:pt-32 lg:px-[120px]">
        <div className="max-w-[860px]">
          <h1 className="font-heading text-[34px] leading-[1.08] sm:text-[46px] lg:text-[52px]">
            <span className="block">{title}</span>
            <span className="block text-brand-accent drop-shadow-[0_0_10px_rgba(204,26,44,0.42)]">
              {hero.highlight}
            </span>
          </h1>
          <p className="mt-5 max-w-[700px] text-[15px] leading-[1.6] text-[#999999] sm:text-[16px] lg:text-[17px]">
            {subtitle}
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-5">
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

          <ul className="mt-4 flex flex-col gap-2 text-[13px] text-[#999999] sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
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
              className="relative h-[156px] w-[238px] shrink-0 overflow-hidden rounded-lg bg-zinc-900 sm:h-[198px] sm:w-[292px] lg:h-[230px] lg:w-[340px] 2xl:h-[260px] 2xl:w-[410px]"
              key={`${image.src}-${index}`}
            >
              <Image
                className="pointer-events-none object-cover"
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1536px) 410px, (min-width: 1024px) 340px, (min-width: 640px) 292px, 238px"
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

      </section>
      <a
        className="fixed bottom-20 right-5 z-[2147483647] flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-xl text-white shadow-[0_0_24px_rgba(204,26,44,0.6)] transition hover:bg-red-700 sm:bottom-6 sm:right-6 lg:h-16 lg:w-16"
        href="tel:+78482270999"
        aria-label={nav.cta.label}
      >
        <PhoneFillIcon />
      </a>
    </>
  );
}
