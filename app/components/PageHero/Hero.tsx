"use client";

import React, { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations} from "next-intl";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const t = useTranslations("Hero");

  // Función de scroll suave a una sección (similar a Navbar)
  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (!hero || !title || !subtitle) return;

    // Respetar preferencia de reducción de movimiento
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Estado inicial
      gsap.set(hero, { autoAlpha: 0 });
      gsap.set(
        [`.${styles.heroEyebrow}`, `.${styles.heroCtas}`, `.${styles.heroMeta}`, `.${styles.heroVisual}`, `.${styles.scrollIndicator}`],
        { opacity: 0, visibility: "hidden" }
      );

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Solo aplicar SplitText si no hay preferencia reducida
      let splitTitle: SplitText | null = null;
      if (!prefersReducedMotion && title) {
        splitTitle = new SplitText(title, {
          type: "words,chars",
          wordsClass: styles.splitWord,
        });
      }

      tl.to(hero, { autoAlpha: 1, duration: 0.4 })
        .fromTo(`.${styles.heroEyebrow}`, { y: 15, opacity: 0, visibility: "visible" }, { y: 0, opacity: 1, duration: 0.6 });

      if (splitTitle && splitTitle.chars && splitTitle.chars.length > 0) {
        tl.fromTo(
          splitTitle.chars,
          { opacity: 0, filter: "blur(10px)", y: 10 },
          { opacity: 1, filter: "blur(0px)", y: 0, stagger: 0.02, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        );
      } else {
        // Animación simple para título si no se usó SplitText
        tl.fromTo(title, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
      }

      tl.fromTo(`.${styles.heroVisual}`, { opacity: 0, x: 30, visibility: "visible" }, { opacity: 1, x: 0, duration: 1.2, ease: "expo.out" }, "-=0.7")
        .fromTo(subtitle, { y: 15, opacity: 0, visibility: "visible" }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.9")
        .fromTo(`.${styles.heroCtas}`, { y: 15, opacity: 0, visibility: "visible" }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.7")
        .fromTo(`.${styles.heroMeta}`, { opacity: 0, visibility: "visible" }, { opacity: 1, duration: 0.6 }, "-=0.5")
        .fromTo(`.${styles.scrollIndicator}`, { opacity: 0, visibility: "visible" }, { opacity: 0.35, duration: 0.6 }, "-=0.3");

      // Paralaje del visual
      gsap.to(`.${styles.heroVisual}`, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Limpieza
      return () => {
        if (splitTitle) splitTitle.revert();
      };
    }, heroRef);

    return () => ctx.revert();
  }, []); // Animación única, sin dependencia de locale

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.bgNoise} aria-hidden="true" />

      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>{t("tag")}</div>

          <h1
            className={styles.heroTitle}
            ref={titleRef}
            aria-label={`${t("title1")} ${t("titleHighlight")}`}
          >
            {t("title1")}
            <span className={styles.accentWord}> {t("titleHighlight")}</span>
          </h1>

          <p className={styles.heroSubtitle} ref={subtitleRef}>
            {t("description")}
          </p>

          <div className={styles.heroCtas}>
            <button
              onClick={() => scrollToSection("contacto")}
              className={styles.btnPrimary}
              aria-label={t("cta")}
            >
              {t("cta")}
              <span className={styles.btnArrow} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => scrollToSection("servicios")}
              className={styles.btnSecondary}
              aria-label={t("viewServices")}
            >
              {t("viewServices")}
            </button>
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
              {/* SVG decorativo de estrella se puede insertar aquí */}
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

      <div className={styles.scrollIndicator} aria-hidden="true">
        <span>scroll</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2V12M7 12L3 8M7 12L11 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;