"use client";

import Hero from "../components/Start/Hero";
import Philosophy from "../components/FPhilosophy/Philosophy";
import Servicios from "../components/Services/Servicios";
import Clientes from "../components/Clients/Clientes"
import Formulario from "../components/Forms/Formulario";

export default function Home() {
return (
    <>
      <Hero />
      <Philosophy />
      <Servicios />
      <Clientes />
      <Formulario />
    </>
  );
}