import Image from "next/image";

type FooterContent = typeof import("@/data/content.json")["footer"];

type FooterProps = {
  footer: FooterContent;
};

function SocialIcon({ icon }: { icon: string }) {
  if (icon === "max") {
    return (
      <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
        <path d="M21 11.5a8.38 8.38 0 0 1-1.17 4.28A8.5 8.5 0 0 1 12.5 20a8.38 8.38 0 0 1-4.28-1.17L3 20l1.17-5.22A8.38 8.38 0 0 1 3 10.5 8.5 8.5 0 0 1 7.22 3.17 8.38 8.38 0 0 1 11.5 2h.5A8.48 8.48 0 0 1 21 10v1.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M8.9 14.4V9.2l3.1 2.9 3.1-2.9v5.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (icon === "vk") {
    return (
      <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="1.5 4 21 13.5">
        <path d="M12.79 16.24s.28-.03.43-.19c.14-.15.13-.43.13-.43s-.02-1.3.58-1.5c.59-.19 1.34 1.26 2.14 1.82.6.42 1.06.33 1.06.33l2.14-.03s1.12-.07.59-.96c-.04-.08-.31-.66-1.59-1.87-1.34-1.27-1.16-1.06.45-3.25.99-1.33 1.38-2.14 1.26-2.49-.12-.33-.84-.24-.84-.24l-2.41.01s-.18-.02-.31.06c-.13.08-.21.26-.21.26s-.38 1.03-.89 1.91c-1.07 1.85-1.5 1.95-1.67 1.83-.41-.27-.31-1.07-.31-1.65 0-1.79.27-2.54-.52-2.73-.26-.07-.45-.11-1.12-.11-.86-.01-1.59 0-2 .2-.27.14-.48.44-.35.46.16.02.52.1.71.36.25.34.24 1.11.24 1.11s.14 2.11-.33 2.37c-.32.18-.77-.19-1.72-1.87-.49-.86-.86-1.81-.86-1.81s-.07-.18-.2-.27c-.15-.12-.37-.15-.37-.15l-2.29.01s-.34.01-.47.16c-.11.14-.01.42-.01.42s1.79 4.25 3.82 6.4c1.86 1.97 3.97 1.84 3.97 1.84h.96Z" fill="currentColor" />
      </svg>
    );
  }

  if (icon === "telegram") {
    return (
      <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
        <path d="M21.5 4.5 18.2 20c-.25 1.14-.92 1.41-1.86.88l-5.15-3.8-2.48 2.38c-.28.28-.51.51-1.04.51l.37-5.24 9.54-8.62c.42-.37-.09-.58-.64-.21L5.15 13.32.07 11.73c-1.1-.35-1.12-1.1.23-1.62L20.2 2.44c.92-.34 1.72.2 1.3 2.06Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <path d="M21 11.5a8.38 8.38 0 0 1-1.17 4.28A8.5 8.5 0 0 1 12.5 20a8.38 8.38 0 0 1-4.28-1.17L3 20l1.17-5.22A8.38 8.38 0 0 1 3 10.5 8.5 8.5 0 0 1 7.22 3.17 8.38 8.38 0 0 1 11.5 2h.5A8.48 8.48 0 0 1 21 10v1.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export default function Footer({ footer }: FooterProps) {
  return (
    <footer className="relative z-10 overflow-hidden bg-brand-bg px-5 py-12 text-white sm:px-6 lg:px-0">
      <div className="pointer-events-none absolute left-[5%] top-[-5rem] h-64 w-[28rem] rounded-full bg-brand-blue/20 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[12%] h-64 w-[30rem] rounded-full bg-brand-accent/28 blur-[96px]" />
      <div className="relative mx-auto max-w-[1200px]">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
          <div>
            <Image className="h-auto w-[150px]" src={footer.logoSrc} alt={footer.logoAlt} width={150} height={65} />
            <p className="mt-5 max-w-[360px] text-[13px] leading-[1.5] text-[#999999]">{footer.about}</p>
            <div className="mt-5 flex items-center gap-4 text-[#999999]">
              {footer.socials.map((social) => (
                <a aria-label={social.label} className="transition hover:text-white" href={social.href} key={social.label}>
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold">{footer.servicesTitle}</h2>
            <ul className="mt-3 grid gap-2.5 text-[13px] text-[#999999]">
              {footer.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold">{footer.contactsTitle}</h2>
            <ul className="mt-3 grid gap-2.5 text-[13px] text-[#999999]">
              {footer.contacts.map((contact) => (
                <li key={contact}>{contact}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 h-px bg-[#333333]" />

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
