import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { SEO } from "@/components/SEO";

const Landing = () => {
  return (
    <>
      <SEO
        title="MASTER CLASS - Plataforma de Cursos Online Premium"
        description="Transforme sua carreira com cursos online de alta qualidade. Trilhas personalizadas de aprendizado em ecossistema, finanças e muito mais."
      />
      <main className="min-h-screen">
        <Hero />
        <Features />
      </main>
    </>
  );
};

export default Landing;
