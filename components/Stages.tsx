import SectionWatermark from "@/components/SectionWatermark";

import type { SiteContent } from "@/lib/content-schema";

type StagesContent = SiteContent["stages"];

type StagesProps = {
  stages: StagesContent;
};

export default function Stages({ stages }: StagesProps) {
  return (
    <section className="relative isolate bg-[#f8f8f8] px-5 pb-16 pt-4 text-brand-ink [clip-path:inset(0)] sm:px-6 lg:px-8 xl:px-0 lg:pb-20 lg:pt-6" id={stages.id}>
      <SectionWatermark />
      <div className="reveal mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="font-heading text-[34px] leading-tight sm:text-[42px] lg:text-[48px]">{stages.title}</h2>
          <p className="mx-auto mt-4 max-w-[700px] text-sm leading-[1.55] text-[#666666] sm:text-base sm:leading-[1.55]">{stages.subtitle}</p>
        </div>

        {/* Колонок столько, сколько шагов; пунктир идёт от центра первого кружка
            до центра последнего — половина ширины колонки с каждого края. */}
        <div
          className="relative mt-12 grid gap-8 lg:gap-6 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
          style={{ ["--cols" as string]: stages.steps.length }}
        >
          <div
            className="absolute top-6 hidden border-t-2 border-dashed border-brand-accent/45 lg:block"
            style={{
              left: `${50 / stages.steps.length}%`,
              right: `${50 / stages.steps.length}%`
            }}
          />
          {stages.steps.map((step) => (
            <article className="relative z-10 flex flex-col items-center text-center" key={step.number}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent font-heading text-2xl text-white">
                {step.number}
              </div>
              <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-[1.55] text-[#666666]">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
