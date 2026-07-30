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
