"use client";

import React, { useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";
import styles from "./Services.module.css";

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  id: string;
  number?: string;
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
}

// Iconos SVG decorativos (fuera del componente para evitar recreaciones)
const SERVICE_ICONS = [
  <svg key="01" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" />
  </svg>,
  <svg key="02" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>,
  <svg key="03" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 20c0-3-1.8-5.5-4.5-6.5" />
  </svg>,
  <svg key="04" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>,
];

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const locale = useLocale();
  const t = useTranslations("Services");

  // Memorizar los datos de servicios para evitar reprocesamiento
  const servicesData = useMemo(() => t.raw("services") as ServiceItem[], [t]);
  const [featured, ...smallServices] = servicesData;

  // Animación GSAP (una sola vez, sin dependencia de locale)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
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

      gsap.fromTo(
        `.${styles.cardFeatured}`,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
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
          x: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: `.${styles.bentoGrid}`,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef} aria-labelledby="services-heading">
      <div className={styles.bgGlowBlue} aria-hidden="true" />
      <div className={styles.bgGlowGreen} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>{t("eyebrow")}</span>
            <h2 id="services-heading" className={styles.sectionTitle}>
              {t("title")}{" "}
              <span className={styles.accentWord}>{t("titleHighlight")}</span>{" "}
              {t("titleEnd")}
            </h2>
            <p className={styles.sectionSubtitle}>{t("subtitle")}</p>
          </div>

          <div className={styles.headerRight}>
            <Link href={`/${locale}/services`} className={styles.btnOutline}>
              {t("ctaAll")}
              <span className={styles.btnArrow} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        <div className={styles.bentoGrid}>
          {/* Tarjeta destacada (primer servicio) → enlace restaurado */}
          <Link
            href={`/${locale}/services#service-1`}
            className={`${styles.card} ${styles.cardFeatured}`}
            aria-label={`Ir a ${featured.eyebrow}`}
          >
            <div className={styles.cardInner}>
              <span className={styles.featuredNumber} aria-hidden="true">{featured.number}</span>
              <div className={styles.featuredIconWrapper}>{SERVICE_ICONS[0]}</div>

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
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Columna derecha con tarjetas pequeñas → enlaces restaurados con índices */}
          <div className={styles.rightColumn}>
            {smallServices.map((service, i) => {
              const serviceIndex = i + 2; // 2, 3, 4
              return (
                <Link
                  key={service.id}
                  href={`/${locale}/services#service-${serviceIndex}`}
                  className={`${styles.card} ${styles.cardSmall}`}
                  aria-label={`Ir a ${service.eyebrow}`}
                >
                  <div className={styles.cardInner}>
                    <span className={styles.smallNumber} aria-hidden="true">{service.number}</span>
                    <div className={styles.iconWrapper}>{SERVICE_ICONS[i + 1]}</div>
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;