import Image from "next/image";

type FooterContent = typeof import("@/data/content.json")["footer"];

type FooterProps = {
  footer: FooterContent;
};

function SocialIcon({ icon }: { icon: string }) {
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
    <footer className="bg-brand-bg px-5 py-12 text-white sm:px-6 lg:px-0">
      <div className="mx-auto max-w-[1200px]">
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
