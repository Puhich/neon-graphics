type ServicesContent = typeof import("@/data/content.json")["services"];

type ServicesProps = {
  services: ServicesContent;
};

export default function Services({ services }: ServicesProps) {
  return (
    <section className="bg-white px-5 py-16 text-brand-ink sm:px-6 lg:px-8 lg:py-20" id={services.id}>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl">{services.title}</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">{services.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.main.map((service) => (
            <article className="rounded-lg bg-zinc-50 p-6" key={service.title}>
              <div className="h-36 rounded bg-zinc-200" />
              <h3 className="mt-5 text-lg font-extrabold">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{service.description}</p>
              <p className="mt-4 text-sm font-extrabold text-brand-accent">{service.price}</p>
            </article>
          ))}
        </div>

        <h3 className="mt-12 font-heading text-2xl">{services.additionalTitle}</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.additional.map((service) => (
            <article className="rounded bg-zinc-50 p-5" key={service.title}>
              <h4 className="font-bold">{service.title}</h4>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{service.description}</p>
              <p className="mt-3 text-sm font-extrabold text-brand-accent">{service.price}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
