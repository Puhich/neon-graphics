import Image from "next/image";

type SectionWatermarkProps = {
  side?: "left" | "right";
};

export default function SectionWatermark({ side = "right" }: SectionWatermarkProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute top-1/2 -z-10 -translate-y-1/2 select-none ${
        side === "right" ? "right-[-60px] lg:right-[-80px]" : "left-[-60px] lg:left-[-80px]"
      }`}
    >
      <Image
        className="h-[280px] w-auto brightness-0 opacity-[0.05] lg:h-[480px]"
        src="/logo-mark.svg"
        alt=""
        width={560}
        height={560}
      />
    </div>
  );
}
