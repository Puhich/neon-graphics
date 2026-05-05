import Image from "next/image";

type PortfolioContent = typeof import("@/data/content.json")["portfolio"];

type PortfolioProps = {
  portfolio: PortfolioContent;
};

export default function Portfolio({ portfolio }: PortfolioProps) {
  return (
    <section className="bg-white px-5 py-16 text-brand-ink sm:px-6 lg:px-8 lg:py-20" id={portfolio.id}>
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl">{portfolio.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
          {portfolio.subtitle}
        </p>

        <div className="mt-10 grid items-center gap-5 lg:grid-cols-[48px_1fr_48px]">
          <button
            aria-label={portfolio.previousLabel}
            className="hidden h-12 w-12 rounded-full bg-zinc-100 text-2xl text-zinc-700 lg:block"
            type="button"
          >
            {portfolio.previousIcon}
          </button>
          <div className="relative h-72 overflow-hidden rounded-xl sm:h-[420px] lg:h-[520px]">
            <Image
              className="object-cover"
              src={portfolio.featured.src}
              alt={portfolio.featured.alt}
              fill
              sizes="(min-width: 1024px) 1100px, 100vw"
            />
          </div>
          <button
            aria-label={portfolio.nextLabel}
            className="hidden h-12 w-12 rounded-full bg-zinc-100 text-2xl text-zinc-700 lg:block"
            type="button"
          >
            {portfolio.nextIcon}
          </button>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {portfolio.thumbnails.map((image) => (
            <div
              className="relative h-14 w-20 shrink-0 overflow-hidden rounded border border-transparent first:border-brand-accent"
              key={image.src}
            >
              <Image className="object-cover" src={image.src} alt={image.alt} fill sizes="80px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
