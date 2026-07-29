import Image from "next/image";

import SectionWatermark from "@/components/SectionWatermark";

type ClientsLogosContent = typeof import("@/data/content.json")["clientsLogos"];

type ClientsLogosProps = {
  clientsLogos: ClientsLogosContent;
};

export default function ClientsLogos({ clientsLogos }: ClientsLogosProps) {
  return (
    <section className="relative isolate bg-white pb-8 pt-16 text-brand-bg [clip-path:inset(0)] md:pb-10 md:pt-18" id={clientsLogos.id}>
      <SectionWatermark />
      <div className="reveal mx-auto max-w-[1240px] px-5 sm:px-6">
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="font-heading text-[28px] leading-[1.08] md:text-[40px]">
            {clientsLogos.title}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {clientsLogos.items.map((logo) => (
            <div
              className="relative h-14 w-full max-w-[230px] opacity-80 md:h-16"
              key={logo.src}
            >
              <Image
                alt={logo.alt}
                className="object-contain"
                fill
                sizes="(min-width: 1024px) 230px, (min-width: 640px) 30vw, 45vw"
                src={logo.src}
              />
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-[600px] text-center text-[13px] font-medium leading-[1.55] text-[#666666] sm:text-sm">
          {clientsLogos.note}
        </p>
      </div>
    </section>
  );
}
