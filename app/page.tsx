import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import content from "@/data/content.json";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg">
      <Hero content={content} />
      <Services services={content.services} />
      <Portfolio portfolio={content.portfolio} />
    </main>
  );
}
