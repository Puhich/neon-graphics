import Image from "next/image";

type SiteContent = typeof import("@/data/content.json");

type HeroProps = {
  content: SiteContent;
};

export default function Hero({ content }: HeroProps) {
  const { topBar, nav, hero, title, subtitle, ctaText, stats } = content;

  return (
    <section className="relative overflow-hidden bg-brand-bg text-white">
      {/* The abstract mark recreates the large blurred sign-shape from the Pencil design. */}
      <div className="pointer-events-none absolute right-[-6rem] top-36 h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl md:right-24 md:h-96 md:w-96" />

      <div className="hidden border-b border-white/5 bg-black/25 px-6 py-2 text-xs text-zinc-400 lg:block">
        <div className="mx-auto flex max-w-7xl justify-end gap-5">
          {topBar.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <Image src={nav.logoSrc} alt={nav.logoAlt} width={148} height={64} priority />
        <nav className="hidden items-center gap-7 text-sm text-zinc-400 lg:flex">
          {nav.links.map((link) => (
            <a className="transition hover:text-white" href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>
        <a
          className="rounded bg-brand-accent px-5 py-2.5 text-sm font-bold text-white shadow-neon transition hover:bg-red-700"
          href={nav.cta.href}
        >
          {nav.cta.label}
        </a>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-6 md:pt-14 lg:px-8 lg:pb-16">
        <div className="max-w-4xl">
          <h1 className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
            <span className="block">{title}</span>
            <span className="block text-brand-accent drop-shadow-[0_0_22px_rgba(204,26,44,0.75)]">
              {hero.highlight}
            </span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg lg:text-xl">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              className="rounded bg-brand-accent px-8 py-4 text-center font-bold text-white shadow-neon transition hover:bg-red-700"
              href={hero.primaryCta.href}
            >
              {ctaText}
            </a>
            <a
              className="rounded border border-zinc-700 px-8 py-4 text-center font-semibold text-white transition hover:border-white"
              href={hero.secondaryCta.href}
            >
              {hero.secondaryCta.label}
            </a>
          </div>

          <ul className="mt-7 flex flex-col gap-3 text-sm text-zinc-400 sm:flex-row sm:flex-wrap sm:gap-7">
            {hero.advantages.map((advantage) => (
              <li className="flex items-center gap-2" key={advantage}>
                <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] overflow-hidden px-5 pb-8 sm:px-6 lg:px-8">
        <div className="grid min-w-[760px] grid-cols-5 gap-4 md:min-w-0">
          {hero.images.map((image) => (
            <div className="relative h-36 overflow-hidden rounded-lg sm:h-44 md:h-52" key={image.src}>
              <Image className="object-cover" src={image.src} alt={image.alt} fill sizes="20vw" />
            </div>
          ))}
        </div>
      </div>

      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-6 border-t border-white/10 px-5 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div className="text-center" key={stat.label}>
            <dt className="font-heading text-3xl text-brand-accent sm:text-4xl">{stat.value}</dt>
            <dd className="mt-2 text-sm text-zinc-500">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
