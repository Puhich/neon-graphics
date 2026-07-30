import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";
import content from "@/lib/content";

export const metadata: Metadata = {
  title: `${content.privacy.title} — ${content.company.name}`,
  description: content.privacy.intro,
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  const { privacy, nav } = content;

  return (
    <main className="min-h-screen bg-white text-brand-ink">
      <header className="bg-brand-bg px-5 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4">
          <Link href="/">
            <Image className="h-11 w-auto lg:h-14" src={nav.logoSrc} alt={nav.logoAlt} width={185} height={80} priority />
          </Link>
          <Link
            className="rounded-xl border border-[#444444] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:border-white sm:px-6"
            href="/"
          >
            {privacy.backLabel}
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-[900px] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="font-heading text-[30px] leading-[1.15] sm:text-[40px]">{privacy.title}</h1>
        {privacy.updatedAt ? (
          <p className="mt-3 text-[13px] text-[#999999]">Редакция от {privacy.updatedAt}</p>
        ) : null}
        {privacy.intro ? (
          <p className="mt-6 text-[15px] leading-[1.65] text-[#555555] sm:text-[16px]">{privacy.intro}</p>
        ) : null}

        <div className="mt-10 grid gap-9">
          {privacy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-[20px] leading-[1.25] sm:text-[24px]">{section.title}</h2>
              <div className="mt-3 grid gap-3">
                {section.text.split("\n\n").map((paragraph, index) => (
                  <p
                    className="whitespace-pre-line text-[15px] leading-[1.65] text-[#555555]"
                    key={`${section.title}-${index}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      <Footer company={content.company} footer={content.footer} />
      <SiteChrome />
    </main>
  );
}
