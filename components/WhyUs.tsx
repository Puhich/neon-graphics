import Image from "next/image";

import SectionWatermark from "@/components/SectionWatermark";

type WhyUsContent = typeof import("@/data/content.json")["whyUs"];

type WhyUsProps = {
  whyUs: WhyUsContent;
};

const iconPaths: Record<string, string> = {
  "shield-check": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-5",
  timer: "M10 2h4M12 14l3-3m5 3a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  "plug-zap": "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46L12 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46L11 14H4Z",
  truck: "M10 17h4V5H2v12h3m5 0a2 2 0 1 1-4 0m4 0a2 2 0 0 0-4 0m8 0h2m0 0a2 2 0 1 0 4 0m-4 0a2 2 0 0 1 4 0m0 0h2v-5l-3-4h-5"
};

function AdvantageIcon({ icon }: { icon: string }) {
  return (
    <svg aria-hidden="true" className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24">
      <path d={iconPaths[icon] ?? iconPaths["shield-check"]} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
    </svg>
  );
}

function TextCard({ card }: { card: WhyUsContent["rows"][number]["card"] }) {
  return (
    <article className="flex min-h-[400px] flex-col justify-between rounded-[16px] bg-[#f8f8f8] p-8 lg:h-full lg:min-h-0">
      <div>
        <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-brand-accent">{card.eyebrow}</p>
        <h3 className="mt-3 font-heading text-[28px] leading-[1.2] text-brand-ink">{card.title}</h3>
        <p className="mt-4 text-sm leading-[1.6] text-[#666666]">{card.description}</p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-5">
        {card.metrics.map((metric) => (
          <div className="min-w-[110px]" key={metric.label}>
            <dt className="font-heading text-[30px] leading-none tracking-wide text-brand-accent">{metric.value}</dt>
            <dd className="mt-2 text-[13px] text-[#999999]">{metric.label}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default function WhyUs({ whyUs }: WhyUsProps) {
  return (
    <section className="relative isolate bg-white px-5 py-16 text-brand-ink [clip-path:inset(0)] sm:px-6 lg:px-0 lg:py-20" id={whyUs.id}>
      <SectionWatermark />
      <div className="reveal mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[840px] text-center">
          <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-brand-accent sm:text-[18px]">{whyUs.eyebrow}</p>
          <h2 className="mt-4 font-heading text-[34px] leading-[1.15] sm:text-[42px] lg:text-[48px]">
            {whyUs.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[15px] leading-[1.6] text-[#666666] sm:text-base sm:leading-[1.6]">
            {whyUs.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-5">
          {whyUs.rows.map((row) => {
            const image = (
              <div className="relative min-h-[280px] overflow-hidden rounded-[16px] bg-zinc-200 lg:h-full lg:min-h-0">
                <Image
                  className="object-cover"
                  src={row.image.src}
                  alt={row.image.alt}
                  fill
                  sizes="(min-width: 1024px) 700px, 100vw"
                />
              </div>
            );
            const card = <TextCard card={row.card} />;

            return (
              <div className="flex flex-col gap-5 lg:h-[400px] lg:flex-row lg:items-stretch" key={row.card.title}>
                {row.imageFirst ? (
                  <>
                    <div className="order-2 lg:order-1 lg:basis-0 lg:flex-1">{image}</div>
                    <div className="order-1 lg:order-2 lg:basis-[480px] lg:flex-none">{card}</div>
                  </>
                ) : (
                  <>
                    <div className="lg:basis-[480px] lg:flex-none">{card}</div>
                    <div className="lg:basis-0 lg:flex-1">{image}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.advantages.map((advantage) => (
            <article className="rounded-[18px] bg-[#f8f8f8] p-6 text-center" key={advantage.title}>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white">
                <AdvantageIcon icon={advantage.icon} />
              </div>
              <h3 className="mt-4 text-[17px] font-bold">{advantage.title}</h3>
              <p className="mx-auto mt-2 max-w-[230px] text-[14px] leading-[1.45] text-[#999999]">{advantage.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
