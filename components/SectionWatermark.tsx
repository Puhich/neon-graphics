"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type SectionWatermarkProps = {
  variant?: "hero" | "grey";
};

// Both variants share one fixed on-screen position so the fish stays put
// while sections scroll past, only changing its look with the background.
const boxClasses =
  "pointer-events-none fixed -z-10 select-none right-[-70px] top-[18vh] h-[20rem] w-[16rem] sm:h-[26rem] sm:w-[21rem] lg:right-[9.5rem] lg:top-[8.2rem] lg:h-[31.8rem] lg:w-[25.8rem]";

// position: fixed inside a clip-path ancestor forces WebKit to re-rasterize
// the fish every scroll frame; touch devices (iPad especially, with its huge
// retina surface) can't keep up during fast flicks and show black unpainted
// tiles. On hover-less devices we switch to position: absolute and pin the
// fish to the viewport with a transform instead — moving a layer is
// compositor-only work, nothing gets repainted.
function useTouchTransformPinning(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: none)").matches) {
      return;
    }

    el.style.position = "absolute";
    el.style.top = "0px";

    const host = el.offsetParent as HTMLElement | null;
    if (!host) {
      return;
    }

    // clip-path clips painting but not scrollable overflow — without this the
    // absolute fish poking past the right edge adds horizontal page scroll.
    host.style.overflow = "hidden";

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewportTop = window.innerWidth >= 1024 ? 131.2 : window.innerHeight * 0.18;
      el.style.transform = `translate3d(0, ${viewportTop - host.getBoundingClientRect().top}px, 0)`;
    };
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [ref]);
}

export default function SectionWatermark({ variant = "grey" }: SectionWatermarkProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  useTouchTransformPinning(boxRef);

  if (variant === "hero") {
    return (
      <div aria-hidden className={boxClasses} ref={boxRef}>
        <Image
          className="fish-glow-img absolute inset-[-5.5rem] hidden h-[calc(100%+11rem)] w-[calc(100%+11rem)] object-contain opacity-75 blur-[88px] saturate-150 lg:block"
          src="/logo-mark.svg"
          alt=""
          fill
          priority
          sizes="540px"
        />
        <div className="fish-glow-grad absolute inset-[-8rem] bg-[radial-gradient(48%_42%_at_38%_36%,rgba(204,26,44,0.34),transparent_100%),radial-gradient(38%_36%_at_58%_58%,rgba(22,140,205,0.28),transparent_100%),radial-gradient(34%_30%_at_48%_46%,rgba(204,26,44,0.18),transparent_100%)] [mask-image:radial-gradient(closest-side,#000_55%,transparent_98%)] lg:bg-[radial-gradient(circle_at_center,rgba(204,26,44,0.2),rgba(22,140,205,0.18)_58%,rgba(15,15,13,0)_76%)] lg:blur-[72px] lg:[mask-image:none]" />
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
    <div aria-hidden className={boxClasses} ref={boxRef}>
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
