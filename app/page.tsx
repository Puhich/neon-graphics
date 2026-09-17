import CallFab from "@/components/CallFab";
import CTASection from "@/components/CTASection";
import ClientsLogos from "@/components/ClientsLogos";
import DirectorQuote from "@/components/DirectorQuote";
import FAQ from "@/components/FAQ";
import FinalForm from "@/components/FinalForm";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import SiteChrome from "@/components/SiteChrome";
import Stages from "@/components/Stages";
import WhyUs from "@/components/WhyUs";
import { getContent } from "@/lib/content";
import { qrSvg } from "@/lib/qr";
import { hiddenAnchors, telHref } from "@/lib/site";

export default function Home() {
  const content = getContent();
  const callHref = telHref(content.company.phone);
  const callQr = qrSvg(callHref);
  const hidden = hiddenAnchors(content);

  return (
    <main className="min-h-screen bg-white">
      <Hero content={content} />
      {content.clientsLogos.hidden ? null : <ClientsLogos clientsLogos={content.clientsLogos} />}
      {content.services.hidden ? null : <Services services={content.services} />}
      {content.portfolio.hidden ? null : <Portfolio portfolio={content.portfolio} />}
      {content.whyUs.hidden ? null : <WhyUs whyUs={content.whyUs} />}
      {content.cta.hidden ? null : <CTASection cta={content.cta} />}
      {content.stages.hidden ? null : <Stages stages={content.stages} />}
      {content.reviews.hidden ? null : <Reviews reviews={content.reviews} />}
      {content.directorQuote.hidden ? null : <DirectorQuote quote={content.directorQuote} />}
      {content.faq.hidden ? null : <FAQ faq={content.faq} />}
      <FinalForm
        form={content.finalForm}
        metrikaId={content.meta.yandexMetrikaId}
        privacyHref={content.footer.privacyHref}
      />
      <Contacts company={content.company} contacts={content.contacts} />
      <Footer company={content.company} contactsId={content.contacts.id} footer={content.footer} hiddenAnchors={hidden} />
      <CallFab hint={content.nav.callQrHint} href={callHref} label={content.nav.callLabel} phone={content.company.phone} qrSvg={callQr} />
      <SiteChrome withJsonLd />
    </main>
  );
}
