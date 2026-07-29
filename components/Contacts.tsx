import Image from "next/image";

type ContactsContent = typeof import("@/data/content.json")["contacts"];

type ContactsProps = {
  contacts: ContactsContent;
};

const iconPaths = {
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92Z",
  mail: "M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm20 1-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
  pin: "M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0Zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 2"
};

function Icon({ path, muted = false }: { path: string; muted?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 shrink-0 ${muted ? "text-[#666666]" : "text-brand-accent"}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path d={path} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function getMapUrls(contacts: ContactsContent) {
  const [lat, lon] = contacts.mapCenter;
  const [centerLat, centerLon] = contacts.mapWidgetCenter;
  const encodedCenter = `${centerLon}%2C${centerLat}`;
  const encodedPoint = `${lon}%2C${lat}`;
  const mobileCenter = `${lon}%2C${lat + 0.0075}`;

  return {
    widget: `https://yandex.ru/map-widget/v1/?ll=${encodedCenter}&pt=${encodedPoint}%2Cpm2rdm&z=${contacts.mapZoom}&l=map`,
    mobileWidget: `https://yandex.ru/map-widget/v1/?ll=${mobileCenter}&pt=${encodedPoint}%2Cpm2rdm&z=${contacts.mapZoom}&l=map`
  };
}

export default function Contacts({ contacts }: ContactsProps) {
  const mapUrls = getMapUrls(contacts);

  return (
    <section className="bg-brand-bg text-white" id={contacts.id}>
      <div className="relative min-h-[700px] overflow-hidden">
        <iframe
          aria-label={contacts.mapAlt}
          className="absolute inset-0 hidden h-full w-full border-0 md:block"
          loading="eager"
          src={mapUrls.widget}
          title={contacts.mapAlt}
        />
        <iframe
          aria-label={contacts.mapAlt}
          className="absolute inset-0 h-full w-full border-0 md:hidden"
          loading="eager"
          src={mapUrls.mobileWidget}
          title={contacts.mapAlt}
        />
        <div className="pointer-events-none absolute inset-0 bg-[#0f0f0d]/48" />

        <div className="relative z-10 mx-auto flex min-h-[700px] max-w-[1440px] items-start px-5 pb-72 pt-10 sm:px-6 md:py-16 lg:px-20">
          <div className="reveal w-full rounded-xl border border-[#2a2a28] bg-[#151513]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur md:w-[480px] md:p-[30px]">
            <h2 className="font-heading text-[26px]">{contacts.title}</h2>

            <div className="mt-5 grid gap-2">
              <a className="flex items-center gap-4 rounded-xl border border-[#242421] bg-[#181816] py-3.5 pl-5 pr-4 transition hover:border-[#3c3c38] hover:bg-[#1f1f1d]" href={contacts.phone.href}>
                <Icon path={iconPaths.phone} />
                <span>
                  <span className="block text-[11px] font-bold text-[#777777]">{contacts.phone.label}</span>
                  <span className="mt-1 block text-[19px] font-extrabold">{contacts.phone.value}</span>
                </span>
              </a>
              <a className="flex items-center gap-4 rounded-xl border border-[#242421] bg-[#181816] py-3.5 pl-5 pr-4 transition hover:border-[#3c3c38] hover:bg-[#1f1f1d]" href={contacts.email.href}>
                <Icon path={iconPaths.mail} />
                <span>
                  <span className="block text-[11px] font-bold text-[#777777]">{contacts.email.label}</span>
                  <span className="mt-1 block text-[17px] font-extrabold">{contacts.email.value}</span>
                </span>
              </a>
            </div>

            <div className="my-5 h-px bg-[#242421]" />

            <div className="grid gap-4">
              <div className="flex items-center gap-4 pl-1">
                <Icon muted path={iconPaths.pin} />
                <span>
                  <span className="block text-[11px] font-bold text-[#5a5a5a]">{contacts.address.label}</span>
                  <span className="mt-1 block text-[13px] font-medium leading-[1.25] text-[#a0a0a0]">{contacts.address.value}</span>
                </span>
              </div>
              <div className="flex items-center gap-4 pl-1">
                <Icon muted path={iconPaths.clock} />
                <span>
                  <span className="block text-[11px] font-bold text-[#5a5a5a]">{contacts.schedule.label}</span>
                  <span className="mt-1 block text-[13px] font-medium text-[#a0a0a0]">{contacts.schedule.value}</span>
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {contacts.mapButtons.map((button) => (
                <a
                  className="inline-flex items-center gap-2.5 rounded-xl border border-[#2e2e2b] bg-[#1d1d1b] px-4 py-2.5 text-[13px] font-bold text-white transition hover:border-[#4a4a46] hover:bg-[#242422]"
                  href={button.href}
                  key={button.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Image
                    className="h-[22px] w-[22px] rounded-[5px]"
                    src={button.icon}
                    alt=""
                    width={22}
                    height={22}
                  />
                  {button.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
