"use client";

import React, { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const locale = useLocale();
  const t = useTranslations("Hero");

  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      
      gsap.set(heroRef.current, { autoAlpha: 0 });
      gsap.set(
        [
          `.${styles.heroEyebrow}`, 
          `.${styles.heroCtas}`, 
          `.${styles.heroMeta}`, 
          `.${styles.heroVisual}`, 
          `.${styles.scrollIndicator}`
        ],
        { opacity: 0, visibility: "hidden" }
      );

      let splitTitle: SplitText | null = null;
      if (titleRef.current) {
        splitTitle = new SplitText(titleRef.current, { 
          type: "words,chars",
          wordsClass: styles.splitWord 
        });
      }

      tl.to(heroRef.current, { autoAlpha: 1, duration: 0.4 })
        .fromTo(`.${styles.heroEyebrow}`, 
          { y: 15, opacity: 0, visibility: "visible" }, 
          { y: 0, opacity: 1, duration: 0.6 }
        );

      if (splitTitle && splitTitle.chars.length > 0) {
        tl.fromTo(
          splitTitle.chars,
          { opacity: 0, filter: "blur(10px)", y: 10 },
          { 
            opacity: 1, 
            filter: "blur(0px)", 
            y: 0, 
            stagger: 0.02, 
            duration: 0.8,
            ease: "power2.out"
          }, 
          "-=0.4"
        );
      }

      tl.fromTo(`.${styles.heroVisual}`, 
        { opacity: 0, x: 30, visibility: "visible" }, 
        { opacity: 1, x: 0, duration: 1.2, ease: "expo.out" },
        "-=0.7"
      );

      tl.fromTo(subtitleRef.current, 
        { y: 15, opacity: 0, visibility: "visible" }, 
        { y: 0, opacity: 1, duration: 0.8 }, 
        "-=0.9"
      )
      .fromTo(`.${styles.heroCtas}`, 
        { y: 15, opacity: 0, visibility: "visible" }, 
        { y: 0, opacity: 1, duration: 0.6 }, 
        "-=0.7"
      )
      .fromTo(`.${styles.heroMeta}`, 
        { opacity: 0, visibility: "visible" }, 
        { opacity: 1, duration: 0.6 }, 
        "-=0.5"
      )
      .fromTo(`.${styles.scrollIndicator}`, 
        { opacity: 0, visibility: "visible" }, 
        { opacity: 0.35, duration: 0.6 }, 
        "-=0.3"
      );

      gsap.to(`.${styles.heroVisual}`, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      return () => {
        if (splitTitle) splitTitle.revert();
      };
    },
    { scope: heroRef, dependencies: [locale] }
  );

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.bgNoise} />

      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>{t("tag")}</div>
          
          <h1 className={styles.heroTitle} ref={titleRef}>
            {t("title1")}
            <span className={styles.accentWord}> {t("titleHighlight")}</span>
          </h1>

          <p className={styles.heroSubtitle} ref={subtitleRef}>{t("description")}</p>

          <div className={styles.heroCtas}>
            <button onClick={() => scrollToSection("contacto")} className={styles.btnPrimary}>
              {t("cta")}
              <span className={styles.btnArrow}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <button onClick={() => scrollToSection("servicios")} className={styles.btnSecondary}>
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