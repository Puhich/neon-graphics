import Image from "next/image";

type SectionWatermarkProps = {
  variant?: "hero" | "grey";
};

// Below lg the fish is absolute (scrolls with its section): iOS WebKit
// mispaints position: fixed inside clip-path containers, which showed up as
// black flashes and a vanishing header while scrolling.
const boxClasses =
  "pointer-events-none absolute -z-10 select-none right-[-70px] top-24 h-[20rem] w-[16rem] sm:h-[26rem] sm:w-[21rem] lg:fixed lg:right-[9.5rem] lg:top-[8.2rem] lg:h-[31.8rem] lg:w-[25.8rem]";

export default function SectionWatermark({ variant = "grey" }: SectionWatermarkProps) {
  if (variant === "hero") {
    return (
      <div aria-hidden className={boxClasses}>
        <Image
          className="absolute inset-[-5.5rem] h-[calc(100%+11rem)] w-[calc(100%+11rem)] object-contain opacity-75 blur-[44px] saturate-150 lg:blur-[88px]"
          src="/logo-mark.svg"
          alt=""
          fill
          priority
          sizes="540px"
        />
        <div className="absolute inset-[-8rem] bg-[radial-gradient(circle_at_center,rgba(204,26,44,0.2),rgba(22,140,205,0.18)_58%,rgba(15,15,13,0)_76%)] blur-[36px] lg:blur-[72px]" />
        <Image
          className="absolute inset-0 h-full w-full object-contain opacity-[0.72] brightness-0"
          src="/logo-mark.svg"
          alt=""
          fill
          priority
          sizes="420px"
        />
      </div>
    );
  }

  return (
    <div aria-hidden className={boxClasses}>
      <Image
        className="absolute inset-0 h-full w-full object-contain brightness-0 opacity-[0.06]"
        src="/logo-mark.svg"
        alt=""
        fill
        sizes="420px"
      />
    </div>
  );
}
