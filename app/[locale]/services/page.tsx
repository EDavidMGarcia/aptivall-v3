// app/[locale]/services/page.tsx
// Server Component - Orquestador principal

import { Metadata } from "next";
import Hero from "./components/ServiceHero/Hero";
import InnovationLab from "./components/ServiceInnovationLab/InnovationLab";
import EdtechStudio from "./components/ServiceEdtechStudio/EdtechStudio";
// DigitalMedia aún no está creado, lo importamos cuando exista
// import DigitalMedia from "./components/ServiceDigitalMedia/DigitalMedia";

export const metadata: Metadata = {
  title: "Servicios | Soluciones de IA, EdTech, Talento Global y Medios Digitales",
  description:
    "Transformación digital de alto impacto: Innovation Lab, EdTech Studio, Global Talent y Digital Media. Soluciones diseñadas para escalar su negocio.",
};

export default function ServicesPage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* 1. Innovation Lab */}
      <InnovationLab />

      {/* 2. Edtech Studio */}
      <EdtechStudio />


      {/* 4. Digital Media - Comentado hasta que exista el componente */}
      {/* <DigitalMedia /> */}
    </main>
  );
}