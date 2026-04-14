"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("Hero");

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 🔥 OCULTAR TODO EL HERO AL INICIO
      gsap.set(heroRef.current, { autoAlpha: 0 });

      // 🔥 MOSTRAR HERO (evita flash)
      tl.to(heroRef.current, {
        autoAlpha: 1,
        duration: 0.6,
      });

      // Mantienes EXACTAMENTE tu lógica original
      gsap.set(
        `.${styles.heroEyebrow}, .${styles.heroTitle}, .${styles.heroSubtitle}, .${styles.heroCtas}, .${styles.heroMeta}, .${styles.heroVisual}, .${styles.floatingCard}, .${styles.scrollIndicator}`,
        { opacity: 0, visibility: "hidden" }
      );

      tl.fromTo(`.${styles.heroEyebrow}`, { y: 20, opacity: 0, visibility: "visible" }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(`.${styles.heroTitle}`, { y: 30, opacity: 0, visibility: "visible" }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.4")
        .fromTo(`.${styles.heroSubtitle}`, { y: 20, opacity: 0, visibility: "visible" }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
        .fromTo(`.${styles.heroCtas}`, { y: 20, opacity: 0, visibility: "visible" }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
        .fromTo(`.${styles.heroMeta}`, { opacity: 0, visibility: "visible" }, { opacity: 1, duration: 0.5 }, "-=0.2")
        .fromTo(`.${styles.heroVisual}`, { x: 40, opacity: 0, visibility: "visible" }, { x: 0, opacity: 1, duration: 1.1, ease: "power2.out" }, 0.3)
        .fromTo(
          [`.${styles.floatingCardTop}`, `.${styles.floatingCardBottom}`],
          { scale: 0.8, opacity: 0, visibility: "visible" },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.15 },
          "-=0.3"
        )
        .fromTo(`.${styles.scrollIndicator}`, { opacity: 0, visibility: "visible" }, { opacity: 0.35, duration: 0.5 }, "-=0.2");

      gsap.to(`.${styles.heroVisual}`, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    },
    { scope: heroRef, dependencies: [locale] }
  );

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.bgNoise} />

      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>{t("tag")}</div>
          <h1 className={styles.heroTitle}>
            {t("title1")}
            <span className={styles.accentWord}> {t("titleHighlight")}</span>
          </h1>
          <p className={styles.heroSubtitle}>{t("description")}</p>

          <div className={styles.heroCtas}>
            <Link href={`/${locale}#contact-section`} className={styles.btnPrimary}>
              {t("cta")}
              <span className={styles.btnArrow}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
            <Link href={`/${locale}/services`} className={styles.btnSecondary}>
              {t("viewServices")}
            </Link>
          </div>

          <div className={styles.heroMeta}>
            <span className={styles.metaText}>
              <span className={styles.metaHighlight}>+50</span> {t("projectsCount")}
            </span>
            <div className={styles.metaDivider} />
            <span className={styles.metaText}>IA · Ingeniería · Producto</span>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.starShape}>
            <div className={styles.starRing} />
            <div className={styles.starCard}>
              <svg className={styles.starSvg} viewBox="0 0 160 160" fill="none">
                <path d="M80 8 C80 8, 86 38, 102 52 C118 66, 148 62, 148 62 C148 62, 124 76, 118 96 C112 116, 128 144, 128 144 C128 144, 106 124, 80 124 C54 124, 32 144, 32 144 C32 144, 48 116, 42 96 C36 76, 12 62, 12 62 C12 62, 42 66, 58 52 C74 38, 80 8, 80 8 Z" fill="url(#starGrad)" />
                <defs>
                  <radialGradient id="starGrad" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#00FF81" />
                    <stop offset="55%" stopColor="#00CC66" />
                    <stop offset="100%" stopColor="#001DFF" stopOpacity="0.6" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
            <div className={`${styles.floatingCard} ${styles.floatingCardTop}`}>
              <div className={styles.floatingCardDot} style={{ background: "#00FF81" }} />
              <span>{t("badge1")}</span>
            </div>
            <div className={`${styles.floatingCard} ${styles.floatingCardBottom}`}>
              <div className={styles.floatingCardDot} style={{ background: "#001DFF" }} />
              <span>{t("badge2")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span>scroll</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2V12M7 12L3 8M7 12L11 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;