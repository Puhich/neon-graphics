import Image from "next/image";

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
import Stages from "@/components/Stages";
import WhyUs from "@/components/WhyUs";
import content from "@/data/content.json";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Touch-only stationary grey fish (see SectionWatermark): fixed outside
          any clip-path so the compositor never repaints it. multiply blend
          hides it on dark pixels; dark hosts sit above it via z-20. */}
      <div
        aria-hidden
        className="fish-global pointer-events-none fixed right-[-70px] top-[18vh] z-[15] hidden h-[20rem] w-[16rem] select-none mix-blend-multiply sm:h-[26rem] sm:w-[21rem] lg:right-[9.5rem] lg:top-[8.2rem] lg:h-[31.8rem] lg:w-[25.8rem]"
      >
        <Image
          className="h-full w-full object-contain brightness-0 opacity-[0.06]"
          src="/fish-mark.webp"
          alt=""
          width={840}
          height={1034}
        />
      </div>
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
      <FinalForm form={content.finalForm} privacyHref={content.footer.privacyHref} />
      <Contacts contacts={content.contacts} />
      <Footer footer={content.footer} />
    </main>
  );
}
