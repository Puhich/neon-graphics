import Image from "next/image";

import SectionWatermark from "@/components/SectionWatermark";

type FooterContent = typeof import("@/data/content.json")["footer"];

type FooterProps = {
  footer: FooterContent;
};

const socialIconFiles: Record<string, string> = {
  telegram: "/icons/tg.svg",
  max: "/icons/max.svg",
  vk: "/icons/vk.svg"
};

function SocialIcon({ icon }: { icon: string }) {
  const file = socialIconFiles[icon] ?? socialIconFiles.telegram;

  return (
    <span
      aria-hidden="true"
      className="inline-block h-5 w-5 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
      style={{ maskImage: `url(${file})`, WebkitMaskImage: `url(${file})` }}
    />
  );
}

export default function Footer({ footer }: FooterProps) {
  return (
    <footer className="relative isolate overflow-hidden bg-brand-bg px-5 py-16 text-white [clip-path:inset(0)] sm:px-6 lg:px-0 lg:py-20">
      <SectionWatermark variant="hero" />
      <div className="pointer-events-none absolute left-[5%] top-[-5rem] h-64 w-[28rem] rounded-full bg-brand-blue/20 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[12%] h-64 w-[30rem] rounded-full bg-brand-accent/28 blur-[96px]" />
      <div className="relative mx-auto max-w-[1200px]">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
          <div>
            <Image className="h-auto w-[185px]" src={footer.logoSrc} alt={footer.logoAlt} width={185} height={80} />
            <p className="mt-6 max-w-[340px] text-[14px] leading-[1.55] text-[#999999]">{footer.about}</p>
            <div className="mt-6 flex items-center gap-4 text-[#999999]">
              {footer.socials.map((social) => (
                <a
                  aria-label={social.label}
                  className="flex items-center transition hover:text-white"
                  href={social.href}
                  key={social.label}
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-[#777777]">{footer.navTitle}</h2>
            <ul className="mt-4 grid gap-3 text-[14px]">
              {footer.nav.map((link) => (
                <li key={link.label}>
                  <a className="text-[#bbbbbb] transition hover:text-white" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-[#777777]">{footer.servicesTitle}</h2>
            <ul className="mt-4 grid gap-3 text-[14px]">
              {footer.services.map((service) => (
                <li key={service.label}>
                  <a className="text-[#bbbbbb] transition hover:text-white" href={service.href}>
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-[#777777]">{footer.contactsTitle}</h2>
            <ul className="mt-4 grid gap-3 text-[14px]">
              {footer.contacts.map((contact) => (
                <li key={contact.label}>
                  {"href" in contact && contact.href ? (
                    <a className="text-[#bbbbbb] transition hover:text-white" href={contact.href}>
                      {contact.label}
                    </a>
                  ) : (
                    <span className="text-[#bbbbbb]">{contact.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 h-px bg-[#333333]" />

        <div className="mt-6 flex flex-col gap-4 text-[12px] text-[#666666] xl:flex-row xl:items-center xl:justify-between">
          <p className="text-[11px] xl:whitespace-nowrap xl:text-[12px]">{footer.copyright}</p>
          <a className="text-[#999999] transition hover:text-white" href="#contacts">
            {footer.privacy}
          </a>
        </div>
      </div>
    </footer>
  );
}
