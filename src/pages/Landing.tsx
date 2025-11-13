import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Benefits } from "@/components/Benefits";
import { Pricing } from "@/components/Pricing";
import { Guarantee } from "@/components/Guarantee";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { SEO } from "@/components/SEO";

const Landing = () => {
  return (
    <>
      <SEO
        title="MASTER CLASS - Mentoria Online Premium | Identidade, Finanças e Vida com Deus"
        description="Transforme sua vida com a mentoria MASTER CLASS. Acesso vitalício a conteúdos exclusivos sobre identidade, finanças inteligentes e vida espiritual. Garantia de 7 dias."
      />
      <main className="min-h-screen">
        <Hero />
        <Stats />
        <Features />
        <Testimonials />
        <Benefits />
        <Pricing />
        <Guarantee />
        <FAQ />
        <FinalCTA />
      </main>
    </>
  );
};

export default Landing;
