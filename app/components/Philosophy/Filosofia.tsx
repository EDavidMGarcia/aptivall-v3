"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl"; // 🔥 Importación correcta
import styles from "./Filosofia.module.css";

gsap.registerPlugin(ScrollTrigger);

// Definimos la interfaz para mantener el tipado fuerte de TS
interface Pillar {
  number: string;
  title: string;
  description: string;
  tag: string;
}

const ICONS = [
  <svg key="01" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M7 8h3M7 11h5" />
    <rect x="14" y="7" width="4" height="5" rx="1" />
  </svg>,
  <svg key="02" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v1a4 4 0 0 1-8 0v-1H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4Z" />
    <circle cx="9" cy="10" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
    <path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5" />
  </svg>,
  <svg key="03" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>,
];

const Philosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const locale = useLocale(); // 🔥 Idioma de la URL
  const t = useTranslations("Philosophy"); // 🔥 Traducciones de next-intl

  // Obtenemos el array de pilares del JSON de forma segura
  // next-intl permite obtener el objeto crudo usando .raw si es un array
  const pillars = t.raw("pillars") as Pillar[];

  useGSAP(
    () => {
      // Animación del Header
      gsap.fromTo(
        `.${styles.sectionHeader}`,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.sectionHeader}`,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Animación de las Cards
      gsap.fromTo(
        `.${styles.card}`,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: `.${styles.grid}`,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [locale] }
  );

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.bgGlow} />

      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>{t("eyebrow")}</span>
          <h2 className={styles.sectionTitle}>
            {t("title")}{" "}
            <span className={styles.accentWord}>{t("titleHighlight")}</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            {t("subtitle")}{" "}
            <span className={styles.accentWord}>{t("subtitleHighlight")}</span>{" "}
            {t("subtitleEnd")}
          </p>
        </div>

        {/* GRID DE CARDS */}
        <div className={styles.grid}>
          {pillars.map((pillar, i) => (
            <div className={styles.card} key={pillar.number}>
              <div className={styles.cardInner}>
                <span className={styles.cardNumber}>{pillar.number}</span>

                <div className={styles.iconWrapper}>{ICONS[i]}</div>

                <h3 className={styles.cardTitle}>{pillar.title}</h3>
                <p className={styles.cardDescription}>{pillar.description}</p>

                <span className={styles.cardTag}>{pillar.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;