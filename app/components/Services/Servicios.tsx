"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl"; // 🔥 Importación correcta
import styles from "./Servicios.module.css";

gsap.registerPlugin(ScrollTrigger);

// Interfaces para mantener el tipado fuerte
interface ServiceItem {
  id: string;
  number?: string;
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
}

const ICONS = [
  <svg key="01" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" />
  </svg>,
  <svg key="02" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>,
  <svg key="03" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 20c0-3-1.8-5.5-4.5-6.5" />
  </svg>,
  <svg key="04" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>,
];

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const locale = useLocale(); // 🔥 Idioma real de la URL
  const t = useTranslations("Services"); // 🔥 Diccionario next-intl

  // Obtenemos los servicios del JSON y desestructuramos
  const servicesData = t.raw("services") as ServiceItem[];
  const [featured, ...smallServices] = servicesData;

  useGSAP(
    () => {
      gsap.fromTo(
        `.${styles.sectionHeader}`,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.sectionHeader}`,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        `.${styles.cardFeatured}`,
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.bentoGrid}`,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        `.${styles.cardSmall}`,
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.75, ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: `.${styles.bentoGrid}`,
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
      <div className={styles.bgGlowBlue} />
      <div className={styles.bgGlowGreen} />

      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>{t("eyebrow")}</span>
            <h2 className={styles.sectionTitle}>
              {t("title")}{" "}
              <span className={styles.accentWord}>{t("titleHighlight")}</span>{" "}
              {t("titleEnd")}
            </h2>
            <p className={styles.sectionSubtitle}>{t("subtitle")}</p>
          </div>

          <div className={styles.headerRight}>
            <Link href={`/${locale}/services`} className={styles.btnOutline}>
              {t("ctaAll")}
              <span className={styles.btnArrow}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className={styles.bentoGrid}>
          {/* CARD FEATURED */}
          <Link href={`/${locale}/services`} className={`${styles.card} ${styles.cardFeatured}`}>
            <div className={styles.cardInner}>
              <span className={styles.featuredNumber}>{featured.number}</span>
              <div className={styles.featuredIconWrapper}>{ICONS[0]}</div>

              <div className={styles.cardContent}>
                <span className={styles.cardEyebrow}>{featured.eyebrow}</span>
                <h3 className={styles.cardTitle}>{featured.title}</h3>
                <p className={styles.cardDescription}>{featured.description}</p>

                <div className={styles.cardTags}>
                  {featured.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>

                <span className={styles.cardArrow}>
                  {t("featuredLabel")}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* CARDS PEQUEÑAS */}
          {smallServices.map((service, i) => (
            <Link key={service.id} href={`/${locale}/services`} className={`${styles.card} ${styles.cardSmall}`}>
              <div className={styles.cardInner}>
                <div className={styles.iconWrapper}>{ICONS[i + 1]}</div>
                <div className={styles.cardContent}>
                  <span className={styles.cardEyebrow}>{service.eyebrow}</span>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <p className={styles.cardDescription}>{service.description}</p>
                  <div className={styles.cardTags}>
                    {service.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;