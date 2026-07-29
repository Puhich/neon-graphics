import Image from "next/image";

import SectionWatermark from "@/components/SectionWatermark";

type ServicesContent = typeof import("@/data/content.json")["services"];

type ServicesProps = {
  services: ServicesContent;
};

const iconPaths: Record<string, string> = {
  canopy: "M4 9h16l-2-4H6L4 9Zm1 0v10h14V9M8 13h8",
  box: "M21 8 12 3 3 8m18 0-9 5-9-5m18 0v8l-9 5-9-5V8",
  cpu: "M9 9h6v6H9V9Zm-4 2H3m2 4H3m18-4h-2m2 4h-2M9 3v2m6-2v2M9 19v2m6-2v2M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  cut: "M4 7h12M4 12h16M4 17h10",
  facade: "M4 20V8l8-4 8 4v12M8 20v-7h8v7M8 9h.01M12 9h.01M16 9h.01",
  landmark: "M3 21h18M5 21v-8m4 8v-8m6 8v-8m4 8v-8M3 10l9-6 9 6H3Z",
  letters: "M4 19 10 5h4l6 14m-13-5h10",
  lightbox: "M5 7h14v10H5V7Zm2-4v2m10-2v2M7 21v-2m10 2v-2",
  printer: "M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6v-7Zm14-2h.01",
  roof: "M3 11 12 4l9 7M5 10v10h14V10",
  scissors: "m14 14 7 7M14 10l7-7M5 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm3-5 6-6M8 8l6 6",
  sign: "M4 7h16v10H4V7Zm4 14v-4m8 4v-4M8 11h8",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z",
  steel: "M4 7h16M6 7l2 14h8l2-14M9 11h6m-5 4h4",
  zap: "M13 2 4 14h7l-1 8 10-13h-7l1-7Z"
};

function ServiceIcon({ icon }: { icon: string }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24">
      <path d={iconPaths[icon] ?? iconPaths.sign} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
    </svg>
  );
}

export default function Services({ services }: ServicesProps) {
  return (
    <section className="relative isolate overflow-hidden bg-white px-5 py-16 text-brand-ink sm:px-6 lg:px-0 lg:py-20" id={services.id}>
      <SectionWatermark side="left" />
      <div className="reveal mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[820px] text-center">
          <h2 className="font-heading text-[34px] leading-tight sm:text-[42px] lg:text-[48px]">{services.title}</h2>
          <p className="mt-4 text-sm leading-[1.55] text-[#666666] sm:text-base sm:leading-[1.55]">{services.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.main.map((service) => (
            <article className="rounded-lg bg-[#f8f8f8] p-7" key={service.title}>
              <div className="relative h-40 overflow-hidden rounded bg-zinc-200">
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
            <article className="flex min-h-[170px] gap-4 rounded bg-[#f8f8f8] px-6 py-5" key={service.title}>
              <div className="mt-0.5 shrink-0">
                <ServiceIcon icon={service.icon} />
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
