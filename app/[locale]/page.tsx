"use client";

import Hero from "../components/FHero/Hero";
import Philosophy from "../components/FPhilosophy/Philosophy";
import Services from "../components/FServices/Services";
import CaseStudies from "../components/FCaseStudies/CaseStudies";

export default function Home() {
return (
    <>
      <Hero />
      <Philosophy />
      <Services />
      <CaseStudies />
    </>
  );
}