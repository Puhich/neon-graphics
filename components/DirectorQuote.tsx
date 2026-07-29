import Image from "next/image";

import SectionWatermark from "@/components/SectionWatermark";

type DirectorQuoteContent = typeof import("@/data/content.json")["directorQuote"];

type DirectorQuoteProps = {
  quote: DirectorQuoteContent;
};

export default function DirectorQuote({ quote }: DirectorQuoteProps) {
  return (
    <section className="relative isolate bg-[linear-gradient(to_bottom,#ffffff_0%,#ffffff_50%,#f8f8f8_50%,#f8f8f8_100%)] px-5 py-16 text-white [clip-path:inset(0)] sm:px-6 lg:px-0 lg:py-20">
      <SectionWatermark />
      <div className="reveal relative mx-auto grid max-w-[1200px] overflow-hidden rounded-2xl bg-brand-ink shadow-[0_8px_40px_rgba(0,0,0,0.07)] lg:grid-cols-[320px_1fr]">
        <div className="pointer-events-none absolute left-[15rem] top-[-6rem] h-72 w-[34rem] rounded-full bg-brand-blue/34 blur-[86px]" />
        <div className="pointer-events-none absolute bottom-[-5rem] right-[6rem] h-72 w-[34rem] rounded-full bg-brand-accent/58 blur-[90px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_76%,rgba(204,26,44,0.18),transparent_30%),radial-gradient(circle_at_32%_15%,rgba(22,140,205,0.14),transparent_28%)]" />

        <div className="relative z-10 min-h-[260px] bg-zinc-800 lg:min-h-[430px]">
          <Image
            className="object-cover"
            src={quote.imageSrc}
            alt={quote.imageAlt}
            fill
            sizes="(min-width: 1024px) 320px, 100vw"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-13">
          <p className="font-heading text-[64px] leading-none text-brand-accent">{quote.quoteMark}</p>
          <blockquote className="mt-2 text-[22px] font-bold leading-[1.55] sm:text-[28px]">
            {quote.text}
          </blockquote>
          <div className="mt-8">
            <Image
              className="h-auto w-[120px] opacity-80"
              src={quote.signatureSrc}
              alt={quote.signatureAlt}
              width={120}
              height={84}
            />
            <p className="mt-4 text-base font-bold">{quote.author}</p>
            <p className="mt-1 text-sm text-[#777777]">{quote.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
