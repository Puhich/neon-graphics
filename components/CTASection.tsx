type CTAContent = typeof import("@/data/content.json")["cta"];

type CTASectionProps = {
  cta: CTAContent;
};

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px] text-brand-accent" fill="none" viewBox="0 0 24 24">
      <path d="m20 6-11 11-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
    </svg>
  );
}

export default function CTASection({ cta }: CTASectionProps) {
  return (
    <section className="bg-[linear-gradient(to_bottom,#ffffff_0%,#ffffff_50%,#f8f8f8_50%,#f8f8f8_100%)] px-5 py-12 text-white sm:px-6 lg:px-0 lg:py-16">
      <div className="reveal relative mx-auto max-w-[1200px] overflow-hidden rounded-2xl bg-brand-ink px-6 py-10 text-center sm:px-10 lg:px-16 lg:py-12">
        <div className="pointer-events-none absolute left-[6%] top-[-4rem] h-64 w-[30rem] rounded-full bg-brand-blue/26 blur-[74px]" />
        <div className="pointer-events-none absolute bottom-[4.7rem] left-1/2 h-48 w-[30rem] -translate-x-1/2 rounded-full bg-brand-accent/62 blur-[64px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(204,26,44,0.22),transparent_25%),radial-gradient(circle_at_16%_10%,rgba(22,140,205,0.12),transparent_28%)]" />

        <h2 className="relative z-10 mx-auto max-w-[700px] whitespace-pre-line font-heading text-[30px] leading-[1.25] sm:text-[38px] lg:text-[42px]">
          {cta.title}
        </h2>
        <p className="relative z-10 mx-auto mt-5 max-w-[600px] text-sm leading-[1.5] text-[#999999] sm:text-base">{cta.subtitle}</p>

        <a
          className="relative z-10 mt-7 inline-flex rounded bg-brand-accent px-9 py-4 text-[16px] font-bold text-white transition hover:bg-red-700"
          href={cta.button.href}
        >
          {cta.button.label}
        </a>

        <ul className="relative z-10 mt-7 flex flex-col items-center justify-center gap-3 text-sm text-[#999999] sm:flex-row sm:gap-8">
          {cta.checks.map((check) => (
            <li className="flex items-center gap-2" key={check}>
              <CheckIcon />
              <span>{check}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
