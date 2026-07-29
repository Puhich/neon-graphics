import Image from "next/image";

export default function SectionWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-[-40px] top-1/2 z-[1] -translate-y-1/2 select-none sm:right-[-60px] lg:right-[-80px]"
    >
      <Image
        className="h-[320px] w-auto brightness-0 opacity-[0.05] sm:h-[440px] lg:h-[560px]"
        src="/logo-mark.svg"
        alt=""
        width={560}
        height={560}
      />
    </div>
  );
}
