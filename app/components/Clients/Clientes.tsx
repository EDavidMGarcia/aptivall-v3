"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";
import styles from "./Clientes.module.css";

gsap.registerPlugin(ScrollTrigger);

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface CaseCard {
  id: string | number;
  client: string;
  title: string;
  desc: string;
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const CARD_COLORS = ["#0093d0", "#D71500", "#7FBA00", "#00C2CB", "#b6024F"];
const CARD_WIDTH = 260;
const CARD_GAP = 32;
const STEP = CARD_WIDTH + CARD_GAP;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getVisualProps(distance: number) {
  const abs = Math.abs(distance);
  if (abs === 0) return { scale: 1,    opacity: 1,    zIndex: 10, blur: 0 };
  if (abs === 1) return { scale: 0.82, opacity: 0.55, zIndex: 5,  blur: 3 };
  return               { scale: 0.68, opacity: 0,    zIndex: 1,  blur: 8 };
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function CaseStudies() {
  const locale = useLocale();
  const t      = useTranslations("CaseStudies");

  const casesData = t.raw("cases") as CaseCard[];
  const TOTAL     = casesData.length;

  // ── Refs ────────────────────────────────────────────────────────────────────

  /**
   * cardRefs[i] apunta al contenedor externo .card
   * frontRefs[i] apunta a .cardFront   (cara visible por defecto)
   * backRefs[i]  apunta a .cardBack    (cara que muestra el texto)
   * flipTLs[i]   guarda la timeline de flip de cada tarjeta
   */
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const frontRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const flipTLs   = useRef<gsap.core.Timeline[]>([]);

  const currentIndex = useRef(0);
  const isAnimating  = useRef(false);

  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  // ── Posicionamiento del carrusel ────────────────────────────────────────────

  const wrapIndex = useCallback(
    (i: number) => ((i % TOTAL) + TOTAL) % TOTAL,
    [TOTAL]
  );

  const layoutCards = useCallback(
    (activeIdx: number, animate = true) => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        let dist = i - activeIdx;
        if (dist >  TOTAL / 2) dist -= TOTAL;
        if (dist < -TOTAL / 2) dist += TOTAL;

        const { scale, opacity, zIndex, blur } = getVisualProps(dist);
        const x = dist * STEP;

        if (animate) {
          gsap.to(card, {
            x, scale, opacity, zIndex,
            filter: `blur(${blur}px)`,
            duration: 0.65,
            ease: "power3.inOut",
          });
        } else {
          gsap.set(card, {
            x, scale, opacity, zIndex,
            filter: `blur(${blur}px)`,
            visibility: "visible",
          });
        }
      });
    },
    [TOTAL]
  );

  // ── Navegación ──────────────────────────────────────────────────────────────

  const goTo = useCallback(
    (delta: number) => {
      if (isAnimating.current) return;
      isAnimating.current  = true;
      currentIndex.current = wrapIndex(currentIndex.current + delta);
      layoutCards(currentIndex.current, true);
      gsap.delayedCall(0.65, () => { isAnimating.current = false; });
    },
    [layoutCards, wrapIndex]
  );

  // ── Efecto flip 3D ──────────────────────────────────────────────────────────

  useEffect(() => {
    // Limpiar timelines anteriores
    flipTLs.current.forEach((tl) => tl.kill());
    flipTLs.current = [];

    casesData.forEach((_, i) => {
      const card  = cardRefs.current[i];
      const front = frontRefs.current[i];
      const back  = backRefs.current[i];
      if (!card || !front || !back) return;

      // Configuración 3D del contenedor
      gsap.set(card, {
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      });

      // La cara trasera empieza girada -180°
      gsap.set(back, { rotationY: -180 });

      // Timeline de flip (pausada; se activa con hover)
      const tl = gsap.timeline({ paused: true })
        // Gira ambas caras simultáneamente
        .to(front, { rotationY:  180, duration: 0.75, ease: "power2.inOut" }, 0)
        .to(back,  { rotationY:    0, duration: 0.75, ease: "power2.inOut" }, 0)
        // Elevación Z para efecto de "salir del plano"
        .to(card,  { z: 40, duration: 0.3, ease: "power2.out" }, 0)
        .to(card,  { z:  0, duration: 0.3, ease: "power2.in"  }, 0.45);

      flipTLs.current[i] = tl;

      const onEnter = () => tl.play();
      const onLeave = () => tl.reverse();

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);

      // Cleanup de listeners cuando el efecto se repita
      return () => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, TOTAL]);

  // ── Reset del carrusel al cambiar idioma ────────────────────────────────────

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, TOTAL);
    cardRefs.current.forEach((card) => {
      if (card) gsap.set(card, { visibility: "hidden" });
    });
    currentIndex.current = 0;
    layoutCards(0, false);
  }, [layoutCards, locale, TOTAL]);

  // ── Animaciones de entrada (ScrollTrigger) ──────────────────────────────────

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
          y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: {
            trigger: controlsRef.current,
            start: "top 100%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [locale]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <section className={styles.sliderSection} ref={sectionRef}>

      {/* Encabezado */}
      <div className={styles.sectionHeader} ref={headerRef}>
        <span className={styles.eyebrow}>{t("eyebrow")}</span>
        <h2 className={styles.sectionTitle}>
          {t("title")}{" "}
          <span className={styles.accentWord}>{t("titleHighlight")}</span>
        </h2>
        <p className={styles.sectionSubtitle}>{t("subtitle")}</p>
      </div>

      {/* Carrusel */}
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
              {/*
               * ┌─────────────────────────────┐
               * │  cardFront  (imagen)        │  ← visible por defecto
               * │  cardBack   (texto/info)    │  ← aparece al hacer hover
               * └─────────────────────────────┘
               *
               * Rutas de imagen esperadas en /public/images/cases/:
               *   case-1.jpg → Pfizer
               *   case-2.jpg → Johnson & Johnson
               *   case-3.jpg → Microsoft
               *   case-4.jpg → Lean Solutions Group
               *   case-5.jpg → Universidad del Norte
               */}

              {/* Cara frontal — imagen */}
              <div
                ref={(el) => { frontRefs.current[i] = el; }}
                className={styles.cardFront}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/logos/${i + 1}.png`}
                  alt={`${card.client} — ${card.title}`}
                  className={styles.cardImage}
                />
                <div className={styles.cardFrontOverlay}>
                  <span className={styles.cardFrontLabel}>{card.client}</span>
                  <span className={styles.cardId}>0{card.id}</span>
                </div>
              </div>

              {/* Cara trasera — contenido */}
              <div
                ref={(el) => { backRefs.current[i] = el; }}
                className={styles.cardBack}
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

                <div
                  className={styles.colorBar}
                  style={{ background: "var(--card-color)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles */}
      <div className={styles.controls} ref={controlsRef}>
        <button
          className={`${styles.btn} ${styles.btnPrev}`}
          onClick={() => goTo(-1)}
          type="button"
          aria-label={t("ariaLabelPrev")}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

    </section>
  );
}
