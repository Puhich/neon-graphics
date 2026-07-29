type ContactsContent = typeof import("@/data/content.json")["contacts"];

type ContactsProps = {
  contacts: ContactsContent;
};

const iconPaths = {
  phone:
    "M22 16.92v2.5a2.45 2.45 0 0 1-2.67 2.45A19.3 19.3 0 0 1 10.92 19 18.9 18.9 0 0 1 5 13.08a19.3 19.3 0 0 1-2.87-8.46A2.45 2.45 0 0 1 4.57 2h2.5a2.45 2.45 0 0 1 2.45 2.1c.16 1.18.43 2.33.82 3.43a2.45 2.45 0 0 1-.55 2.52l-1.06 1.06a15.7 15.7 0 0 0 6.16 6.16l1.06-1.06a2.45 2.45 0 0 1 2.52-.55c1.1.39 2.25.66 3.43.82A2.45 2.45 0 0 1 22 16.92Z",
  mail: "M4 4h16v16H4V4Zm0 3 8 6 8-6",
  pin: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 2"
};

function Icon({ path, muted = false }: { path: string; muted?: boolean }) {
  return (
    <svg aria-hidden="true" className={`h-5 w-5 shrink-0 ${muted ? "text-[#666666]" : "text-brand-accent"}`} fill="none" viewBox="0 0 24 24">
      <path d={path} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function getMapUrls(contacts: ContactsContent) {
  const [lat, lon] = contacts.mapCenter;
  const [centerLat, centerLon] = contacts.mapWidgetCenter;
  const encodedCenter = `${centerLon}%2C${centerLat}`;
  const encodedPoint = `${lon}%2C${lat}`;
  const mobileCenter = `${lon + 0.0018}%2C${lat + 0.0002}`;

  return {
    directions: contacts.mapLinkUrl,
    widget: `https://yandex.ru/map-widget/v1/?ll=${encodedCenter}&pt=${encodedPoint}%2Cpm2rdm&z=${contacts.mapZoom}&l=map`,
    mobileWidget: `https://yandex.ru/map-widget/v1/?ll=${mobileCenter}&pt=${encodedPoint}%2Cpm2rdm&z=${contacts.mapZoom}&l=map`
  };
}

export default function Contacts({ contacts }: ContactsProps) {
  const mapUrls = getMapUrls(contacts);

  return (
    <section className="relative z-10 bg-brand-bg text-white" id={contacts.id}>
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

        <div className="relative z-10 mx-auto flex min-h-[700px] max-w-[1440px] items-start px-5 py-16 sm:px-6 lg:px-20">
          <div className="reveal w-full rounded-xl border border-[#2a2a28] bg-[#151513]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur md:w-[480px] md:p-[30px]">
            <h2 className="font-heading text-[26px]">{contacts.title}</h2>

            <div className="mt-5 grid gap-2">
              <a className="flex items-center gap-3 rounded-lg border border-[#242421] bg-[#181816] px-3.5 py-3" href={contacts.phone.href}>
                <Icon path={iconPaths.phone} />
                <span>
                  <span className="block text-[11px] font-bold text-[#777777]">{contacts.phone.label}</span>
                  <span className="mt-0.5 block text-[19px] font-extrabold">{contacts.phone.value}</span>
                </span>
              </a>
              <a className="flex items-center gap-3 rounded-lg border border-[#242421] bg-[#181816] px-3.5 py-3" href={contacts.email.href}>
                <Icon path={iconPaths.mail} />
                <span>
                  <span className="block text-[11px] font-bold text-[#777777]">{contacts.email.label}</span>
                  <span className="mt-0.5 block text-[17px] font-extrabold">{contacts.email.value}</span>
                </span>
              </a>
            </div>

            <div className="my-5 h-px bg-[#242421]" />

            <div className="grid gap-4">
              <div className="flex items-start gap-2.5">
                <Icon muted path={iconPaths.pin} />
                <span>
                  <span className="block text-[11px] font-bold text-[#5a5a5a]">{contacts.address.label}</span>
                  <span className="mt-0.5 block text-[13px] font-medium leading-[1.25] text-[#a0a0a0]">{contacts.address.value}</span>
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Icon muted path={iconPaths.clock} />
                <span>
                  <span className="block text-[11px] font-bold text-[#5a5a5a]">{contacts.schedule.label}</span>
                  <span className="mt-0.5 block text-[13px] font-medium text-[#a0a0a0]">{contacts.schedule.value}</span>
                </span>
              </div>
            </div>

            <a
              className="mt-6 inline-flex rounded-lg bg-brand-accent px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#b91626]"
              href={mapUrls.directions}
              rel="noreferrer"
              target="_blank"
            >
              {contacts.mapLinkText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
