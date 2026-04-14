"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl"; // 🔥 Importación correcta
import styles from "./CaseStudies.module.css";

gsap.registerPlugin(ScrollTrigger);

// Tipado para los casos
interface CaseCard {
  id: string | number;
  client: string;
  title: string;
  desc: string;
}

const CARD_COLORS = ["#0ff", "#f90", "#f0f", "#0f9", "#09f"];
const CARD_WIDTH = 300;
const CARD_GAP = 30;
const STEP = CARD_WIDTH + CARD_GAP;

function getVisualProps(distance: number) {
  const abs = Math.abs(distance);
  if (abs === 0) return { scale: 1, opacity: 1, zIndex: 10, blur: 0, y: 0 };
  if (abs === 1) return { scale: 0.85, opacity: 0.6, zIndex: 5, blur: 2, y: 0 };
  return { scale: 0.7, opacity: 0, zIndex: 1, blur: 8, y: 20 };
}

export default function CaseStudies() {
  const locale = useLocale(); // 🔥 Idioma de la URL
  const t = useTranslations("CaseStudies"); // 🔥 Traducciones de next-intl
  
  // Obtenemos los casos de forma segura como array
  const casesData = t.raw("cases") as CaseCard[];
  const TOTAL = casesData.length;

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentIndex = useRef(0);
  const isAnimating = useRef(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const wrapIndex = useCallback(
    (i: number) => ((i % TOTAL) + TOTAL) % TOTAL,
    [TOTAL]
  );

  const layoutCards = useCallback(
    (activeIdx: number, animate = true) => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        let dist = i - activeIdx;
        if (dist > TOTAL / 2) dist -= TOTAL;
        if (dist < -TOTAL / 2) dist += TOTAL;

        const { scale, opacity, zIndex, blur, y } = getVisualProps(dist);
        const x = dist * STEP;

        if (animate) {
          gsap.to(card, {
            x, y, scale, opacity, zIndex,
            filter: `blur(${blur}px)`,
            duration: 0.7,
            ease: "power3.inOut",
          });
        } else {
          gsap.set(card, {
            x, y, scale, opacity, zIndex,
            filter: `blur(${blur}px)`,
            visibility: "visible",
          });
        }
      });
    },
    [TOTAL]
  );

  const goTo = useCallback(
    (delta: number) => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      currentIndex.current = wrapIndex(currentIndex.current + delta);
      layoutCards(currentIndex.current, true);
      gsap.delayedCall(0.7, () => { isAnimating.current = false; });
    },
    [layoutCards, wrapIndex]
  );

  // Reiniciar slider al cambiar de idioma
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, TOTAL);
    
    cardRefs.current.forEach((card) => {
      if (card) gsap.set(card, { visibility: "hidden" });
    });
    
    currentIndex.current = 0;
    layoutCards(0, false);
  }, [layoutCards, locale, TOTAL]); // 🔥 Dependencia de locale

  // Animaciones de entrada con ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        viewportRef.current,
        { scale: 0.96, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: viewportRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
  controlsRef.current,
  { y: 20, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.7,
    ease: "power3.out",
    scrollTrigger: {
      trigger: controlsRef.current,
      start: "top 100%", // 👈 mismo timing que el header
      toggleActions: "play none none none",
    },
  }
);
    }, sectionRef);

    return () => ctx.revert();
  }, [locale]); // 🔥 Dependencia de locale

  return (
    <section className={styles.sliderSection} ref={sectionRef}>
      <div className={styles.sectionHeader} ref={headerRef}>
        <span className={styles.eyebrow}>{t("eyebrow")}</span>
        <h2 className={styles.sectionTitle}>
          {t("title")}{" "}
          <span className={styles.accentWord}>{t("titleHighlight")}</span>
        </h2>
        <p className={styles.sectionSubtitle}>{t("subtitle")}</p>
      </div>

      <div className={styles.viewport} ref={viewportRef}>
        <div className={styles.track}>
          {casesData.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={styles.card}
              style={{
                "--card-color": CARD_COLORS[i % CARD_COLORS.length],
                visibility: "hidden",
              } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardTag}>{card.client}</span>
                <span className={styles.cardId}>0{card.id}</span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.brandName}>{t("brandLabel")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.controls} ref={controlsRef}>
        <button
          className={`${styles.btn} ${styles.btnPrev}`}
          onClick={() => goTo(-1)}
          type="button"
          aria-label={t("ariaLabelPrev")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("btnPrev")}
        </button>

        <span className={styles.controlsDivider} />

        <button
          className={`${styles.btn} ${styles.btnNext}`}
          onClick={() => goTo(1)}
          type="button"
          aria-label={t("ariaLabelNext")}
        >
          {t("btnNext")}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}