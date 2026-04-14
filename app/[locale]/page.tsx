"use client";

import Hero from "../components/Start/Hero";
import Philosophy from "../components/FPhilosophy/Philosophy";
import Servicios from "../components/Services/Servicios";
import Clientes from "../components/Clients/Clientes"
import Formulario from "../components/Forms/Formulario";

export default function Home() {
return (
    <>
      <div id="inicio"> 
        <Hero /> 
        </div>
      <div id="sobre">
        <Philosophy />
        </div>
      <div id="servicios">
        <Servicios />
        </div>
      <div id="clientes">
        <Clientes />
        </div>
      <div id="contacto">
        <Formulario />
        </div>
    </>
  );
}