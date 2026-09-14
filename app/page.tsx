import QRCode from "qrcode";

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
import content from "@/lib/content";
import { telHref } from "@/lib/site";

export default async function Home() {
  const callHref = telHref(content.company.phone);
  const callQr = await QRCode.toString(callHref, { type: "svg", margin: 0, errorCorrectionLevel: "M" });

  return (
    <main className="min-h-screen bg-white">
      <Hero content={content} />
      <ClientsLogos clientsLogos={content.clientsLogos} />
      <Services services={content.services} />
      <Portfolio portfolio={content.portfolio} />
      <WhyUs whyUs={content.whyUs} />
      <CTASection cta={content.cta} />
      <Stages stages={content.stages} />
      <Reviews reviews={content.reviews} />
      <DirectorQuote quote={content.directorQuote} />
      <FAQ faq={content.faq} />
      <FinalForm
        form={content.finalForm}
        metrikaId={content.meta.yandexMetrikaId}
        privacyHref={content.footer.privacyHref}
      />
      <Contacts company={content.company} contacts={content.contacts} />
      <Footer company={content.company} footer={content.footer} />
      <CallFab href={callHref} label={content.nav.callLabel} phone={content.company.phone} qrSvg={callQr} />
      <SiteChrome withJsonLd />
    </main>
  );
}
