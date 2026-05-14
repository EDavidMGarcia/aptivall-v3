"use client";

import Hero from "../components/PageHero/Hero";
import Philosophy from "../components/PagePhilosophy/Philosophy";
import Services from "../components/PageServices/Services";
import Clients from "../components/PageClients/Clients";
import Forms from "../components/PageForms/Forms";
import ScrollStar from "../components/MotionPath/ScrollStar";

export default function Home() {
  return (
    <>
      <div aria-hidden="true">
        <ScrollStar />
      </div>

      <section id="inicio"><Hero /></section>
      <section id="sobre"><Philosophy /></section>
      <section id="servicios"><Services /></section>
      <section id="clientes"><Clients /></section>
      <section id="contacto"><Forms /></section>
    </>
  );
}