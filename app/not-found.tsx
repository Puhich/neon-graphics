import Image from "next/image";
import Link from "next/link";

import SiteChrome from "@/components/SiteChrome";
import content from "@/lib/content";
import { telHref } from "@/lib/site";

export const metadata = {
  title: `${content.notFound.title} — ${content.company.name}`,
  robots: { index: false, follow: true }
};

export default function NotFound() {
  const { notFound, company, nav } = content;

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-brand-bg px-5 py-10 text-white sm:px-6">
      <div className="pointer-events-none absolute left-[6%] top-[-6rem] h-72 w-[30rem] rounded-full bg-brand-blue/15 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[4%] h-72 w-[32rem] rounded-full bg-brand-accent/20 blur-[120px]" />
      <Image
        aria-hidden
        className="pointer-events-none absolute right-[-6rem] top-1/2 hidden w-[30rem] -translate-y-1/2 opacity-[0.06] brightness-0 invert lg:block"
        src="/fish-mark.webp"
        alt=""
        width={480}
        height={594}
      />

      <Link className="relative" href="/">
        <Image className="h-12 w-auto lg:h-14" src={nav.logoSrc} alt={nav.logoAlt} width={185} height={80} priority />
      </Link>

      <div className="relative flex flex-1 items-center">
        <div className="max-w-[620px] py-16">
          <p className="font-heading text-[72px] leading-none text-brand-accent drop-shadow-[0_0_18px_rgba(204,26,44,0.4)] sm:text-[96px]">
            404
          </p>
          <h1 className="mt-5 font-heading text-[30px] leading-[1.15] sm:text-[40px]">{notFound.title}</h1>
          <p className="mt-4 text-[15px] leading-[1.6] text-[#999999] sm:text-[16px]">{notFound.subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              className="rounded-xl bg-brand-accent px-8 py-4 text-center text-[15px] font-bold text-white shadow-[0_0_22px_rgba(204,26,44,0.42)] transition hover:bg-red-700"
              href="/"
            >
              {notFound.buttonLabel}
            </Link>
            <Link
              className="rounded-xl border border-[#444444] px-8 py-4 text-center text-[15px] font-semibold text-white transition hover:border-white"
              href="/#request"
            >
              {notFound.secondaryLabel}
            </Link>
          </div>

          <div className="mt-10 flex flex-col gap-2 text-[14px] text-[#999999] sm:flex-row sm:gap-6">
            <a className="transition hover:text-white" href={telHref(company.phone)}>
              {company.phone}
            </a>
            <a className="transition hover:text-white" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </div>
        </div>
      </div>

      <SiteChrome />
    </main>
  );
}
