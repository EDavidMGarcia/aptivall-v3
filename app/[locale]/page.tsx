"use client";

import Hero from "../components/FHero/Hero";
import Philosophy from "../components/FPhilosophy/Philosophy";
import Services from "../components/FServices/Services";
import Clientes from "../components/Clients/Clientes"
import Formulario from "../components/Forms/Formulario";

export default function Home() {
return (
    <>
      <Hero />
      <Philosophy />
      <Services />
      <Clientes />
      <Formulario />
    </>
  );
}