import Image from "next/image";

import Icon from "@/components/Icon";
import SectionWatermark from "@/components/SectionWatermark";
import type { SiteContent } from "@/lib/content-schema";

type ServicesContent = SiteContent["services"];

type ServicesProps = {
  services: ServicesContent;
};

export default function Services({ services }: ServicesProps) {
  return (
    <section className="relative isolate bg-white px-5 pb-16 pt-4 text-brand-ink [clip-path:inset(0)] sm:px-6 lg:px-8 xl:px-0 lg:pb-20 lg:pt-6" id={services.id}>
      <SectionWatermark />
      <div className="reveal mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[820px] text-center">
          <h2 className="font-heading text-[34px] leading-tight sm:text-[42px] lg:text-[48px]">{services.title}</h2>
          <p className="mt-4 text-sm leading-[1.55] text-[#666666] sm:text-base sm:leading-[1.55]">{services.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.main.map((service) => (
            <article className="rounded-2xl bg-[#f8f8f8] p-7" key={service.title}>
              <div className="relative h-52 overflow-hidden rounded-xl bg-zinc-200 lg:h-56">
                <Image
                  className="object-cover"
                  src={service.imageSrc}
                  alt={service.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 368px, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-extrabold">{service.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-[1.55] text-[#666666]">{service.description}</p>
              <p className="mt-4 text-sm font-extrabold text-brand-accent">{service.price}</p>
            </article>
          ))}
        </div>

        <h3 className="mt-12 font-heading text-[28px]">{services.additionalTitle}</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.additional.map((service) => (
            <article className="flex min-h-[170px] gap-4 rounded-2xl bg-[#f8f8f8] px-6 py-5" key={service.title}>
              <div className="mt-0.5 shrink-0">
                <Icon className="h-6 w-6 text-brand-accent" name={service.icon} />
              </div>
              <div>
                <h4 className="text-base font-semibold">{service.title}</h4>
                <p className="mt-2 text-[13px] leading-[1.4] text-[#666666]">{service.description}</p>
                <p className="mt-3 text-sm font-bold text-brand-accent">{service.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
