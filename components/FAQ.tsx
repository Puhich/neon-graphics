type FAQContent = typeof import("@/data/content.json")["faq"];

type FAQProps = {
  faq: FAQContent;
};

export default function FAQ({ faq }: FAQProps) {
  return (
    <section className="bg-[#f8f8f8] px-5 py-16 text-brand-ink sm:px-6 lg:px-0 lg:py-20" id={faq.id}>
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[360px_1fr] lg:justify-between lg:gap-12">
        <div>
          <h2 className="font-heading text-[34px] leading-[1.1] sm:text-[42px]">{faq.title}</h2>
          <p className="mt-5 text-sm leading-[1.6] text-[#666666] sm:text-base">{faq.subtitle}</p>
        </div>

        <div className="lg:ml-auto lg:w-[700px]">
          {faq.items.map((item) => (
            <details className="group border-b border-[#dddddd] px-0 py-6 lg:px-6" key={item.question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-bold [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xl leading-none text-brand-accent transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-[1.55] text-[#666666]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
