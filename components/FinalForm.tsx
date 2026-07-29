import SectionWatermark from "@/components/SectionWatermark";

type FinalFormContent = typeof import("@/data/content.json")["finalForm"];

type FinalFormProps = {
  form: FinalFormContent;
};

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-brand-accent" fill="none" viewBox="0 0 24 24">
      <path d="m20 6-11 11-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
    </svg>
  );
}

export default function FinalForm({ form }: FinalFormProps) {
  return (
    <section className="relative isolate bg-white px-5 py-16 text-brand-ink [clip-path:inset(0)] sm:px-6 lg:px-0 lg:py-20" id={form.id}>
      <SectionWatermark />
      <div className="reveal mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-accent">{form.eyebrow}</p>
          <h2 className="mt-4 whitespace-pre-line font-heading text-[34px] leading-[1.1] sm:text-[42px] lg:text-[48px]">
            {form.title}
          </h2>
          <p className="mt-5 text-sm leading-[1.55] text-[#666666] sm:text-base sm:leading-[1.55]">{form.description}</p>

          <ul className="mt-7 grid gap-3">
            {form.bullets.map((bullet) => (
              <li className="flex items-center gap-2.5 text-[15px] text-[#555555]" key={bullet}>
                <CheckIcon />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <form className="rounded-2xl bg-[#f8f8f8] p-6 sm:p-8">
          <div className="grid gap-5">
            {form.fields.map((field) => (
              <label className="grid gap-1.5 text-[13px] text-[#666666]" key={field.label}>
                <span>{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    className="min-h-[118px] resize-y rounded-xl bg-[#e8e8e8] px-4 py-3 text-[15px] text-brand-ink outline-none transition placeholder:text-[#999999] focus:ring-2 focus:ring-brand-accent/35"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    className="h-11 rounded-xl bg-[#e8e8e8] px-4 text-[15px] text-brand-ink outline-none transition placeholder:text-[#999999] focus:ring-2 focus:ring-brand-accent/35"
                    placeholder={field.placeholder}
                    type={field.type}
                  />
                )}
              </label>
            ))}
          </div>

          <button
            className="mt-6 h-12 w-full rounded-xl bg-brand-accent px-5 text-[15px] font-bold text-white transition hover:bg-red-700"
            type="button"
          >
            {form.submitText}
          </button>
          <p className="mt-4 text-[13px] leading-[1.4] text-[#666666]">{form.privacyText}</p>
        </form>
      </div>
    </section>
  );
}
