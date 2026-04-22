"use client";

import Hero from "../components/Start/Hero";
import Filosofia from "../components/Philosophy/Filosofia";
import Servicios from "../components/Services/Servicios";
import Clientes from "../components/Clients/Clientes"
import Formulario from "../components/Forms/Formulario";
import ScrollStar from "../components/MotionPath/ScrollStar";

export default function Home() {
return (
    <>

    <ScrollStar />
      <div id="inicio"> 
        <Hero /> 
        </div>
      <div id="sobre">
        <Filosofia />
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