import Image from "next/image";

type SectionWatermarkProps = {
  variant?: "hero" | "grey";
};

const boxSize =
  "-z-10 select-none right-[-70px] h-[20rem] w-[16rem] sm:h-[26rem] sm:w-[21rem] lg:right-[9.5rem] lg:top-[8.2rem] lg:h-[31.8rem] lg:w-[25.8rem]";

// Grey fish stays fixed on all viewports. The colored (blurred) variant is
// absolute below lg: heavy blurred layers in position: fixed inside clip-path
// containers caused iOS repaint glitches, and inside dark cards the absolute
// placement reads as intentional. Absolute is safe there because every host
// has overflow-hidden (an absolute child poking past the viewport edge would
// otherwise create horizontal page scroll — clip-path alone doesn't stop it).
const greyBox = `pointer-events-none fixed top-[18vh] ${boxSize}`;
const heroBox = `pointer-events-none absolute top-24 lg:fixed ${boxSize}`;

export default function SectionWatermark({ variant = "grey" }: SectionWatermarkProps) {
  if (variant === "hero") {
    return (
      <div aria-hidden className={heroBox}>
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
    <div aria-hidden className={greyBox}>
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
