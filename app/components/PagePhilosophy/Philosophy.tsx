"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";
import styles from "./Philosophy.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface Pillar {
  number: string;
  title: string;
  description: string;
  tag: string;
}

// Iconos SVG decorativos (ocultos para accesibilidad)
const ICONS = [
  <svg key="01" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M7 8h3M7 11h5" />
    <rect x="14" y="7" width="4" height="5" rx="1" />
  </svg>,
  <svg key="02" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v1a4 4 0 0 1-8 0v-1H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4Z" />
    <circle cx="9" cy="10" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
    <path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5" />
  </svg>,
  <svg key="03" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>,
];

// ─── Configuración visual del stack ──────────────────────────────────────────
interface LayerProps {
  y: number;
  x: number;
  scale: number;
  rotation: number;
  opacity: number;
  zIndex: number;
}

function getLayerProps(pos: number, total: number): LayerProps {
  if (pos === 0) {
    return { y: 0, x: 0, scale: 1, rotation: 0, opacity: 1, zIndex: total };
  }
  if (pos === 1) {
    return { y: -18, x: 6, scale: 0.95, rotation: 2.5, opacity: 0.75, zIndex: total - 1 };
  }
  return {
    y: -18 - (pos - 1) * 14,
    x: 6 + (pos - 1) * 5,
    scale: 0.95 - (pos - 1) * 0.04,
    rotation: 2.5 + (pos - 1) * 2,
    opacity: Math.max(0.3, 0.75 - (pos - 1) * 0.2),
    zIndex: total - pos,
  };
}

const Philosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimating = useRef(false);

  const locale = useLocale();
  const t = useTranslations("Philosophy");
  const pillars = t.raw("pillars") as Pillar[];
  const TOTAL = pillars.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // ── Posiciona todas las tarjetas según el stack actual ─────────────────────
  const layoutStack = useCallback(
    (active: number, animate = true) => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const pos = ((i - active) % TOTAL + TOTAL) % TOTAL;
        const props = getLayerProps(pos, TOTAL);

        if (animate) {
          gsap.to(card, {
            y: props.y,
            x: props.x,
            scale: props.scale,
            rotation: props.rotation,
            opacity: props.opacity,
            zIndex: props.zIndex,
            duration: 0.65,
            ease: "power3.inOut",
          });
        } else {
          gsap.set(card, {
            y: props.y,
            x: props.x,
            scale: props.scale,
            rotation: props.rotation,
            opacity: props.opacity,
            zIndex: props.zIndex,
          });
        }
      });
    },
    [TOTAL]
  );

  const advanceStack = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const prevActive = activeIndexRef.current;
    const prevCard = cardRefs.current[prevActive];
    const newActive = ((prevActive + 1) % TOTAL);

    if (prevCard) {
      gsap.to(prevCard, {
        y: 80,
        x: 40,
        scale: 0.85,
        opacity: 0,
        rotation: 8,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          activeIndexRef.current = newActive;
          setActiveIndex(newActive);
          layoutStack(newActive, true);
          gsap.delayedCall(0.65, () => {
            isAnimating.current = false;
          });
        },
      });
    } else {
      activeIndexRef.current = newActive;
      setActiveIndex(newActive);
      layoutStack(newActive, true);
      gsap.delayedCall(0.65, () => {
        isAnimating.current = false;
      });
    }
  }, [layoutStack, TOTAL]);

  // Animación de entrada y rotación automática (solo al montar)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Layout inicial sin animación
      layoutStack(0, false);

      // SplitText en el título
      let splitTitle: SplitText | null = null;
      if (titleRef.current) {
        splitTitle = new SplitText(titleRef.current, {
          type: "words,chars",
          wordsClass: styles.splitWord,
        });

        gsap.fromTo(
          splitTitle.chars,
          { opacity: 0, filter: "blur(10px)", y: 10 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            stagger: 0.02,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
            },
          }
        );
      }

      gsap.fromTo(
        `.${styles.sectionSubtitle}`,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.sectionSubtitle}`,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        `.${styles.stackWrapper}`,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.stackWrapper}`,
            start: "top 82%",
          },
        }
      );

      // Auto-avance cada 5 segundos con retraso inicial de 1s
      let interval: ReturnType<typeof setInterval>;
      const timeout = setTimeout(() => {
        interval = setInterval(() => {
          advanceStack();
        }, 5000);
      }, 1000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
        if (splitTitle) splitTitle.revert();
      };
    }, section);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sin dependencia de locale

  return (
    <section className={styles.section} ref={sectionRef} aria-labelledby="philosophy-heading">
      <div className={styles.bgGlow} />

      <div className={styles.container}>
        {/* Stack de tarjetas */}
        <div className={styles.stackOuter}>
          <div className={styles.stackWrapper} aria-label="Pilares filosóficos">
            {pillars.map((pillar, i) => {
              const isCurrent = i === activeIndex;
              return (
                <div
                  key={pillar.number}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`${styles.card} ${isCurrent ? styles.cardCurrent : ""}`}
                  aria-label={pillar.title}
                >
                  <div className={styles.cardInner}>
                    <span className={styles.cardNumber} aria-hidden="true">
                      {pillar.number}
                    </span>
                    <div className={styles.iconWrapper}>{ICONS[i]}</div>
                    <h3 className={styles.cardTitle}>{pillar.title}</h3>
                    <p className={styles.cardDescription}>{pillar.description}</p>
                    <span className={styles.cardTag}>{pillar.tag}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.stackDots} role="tablist" aria-label="Navegación de pilares">
            {pillars.map((pillar, i) => (
              <button
                key={pillar.number}
                className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Pilar ${i + 1}: ${pillar.title}`}
                type="button"
              />
            ))}
          </div>

          <p className={styles.stackHint}>
            {activeIndex + 1} / {TOTAL} · {pillars[activeIndex]?.title}
          </p>
        </div>

        {/* Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>{t("eyebrow")}</span>

          <h2 id="philosophy-heading" className={styles.sectionTitle} ref={titleRef}>
            {t("title")}{" "}
            <span className={styles.accentWord}>{t("titleHighlight")}</span>
          </h2>

          <p className={styles.sectionSubtitle}>
            {t("subtitle")}{" "}
            <span className={styles.accentWord}>{t("subtitleHighlight")}</span>{" "}
            {t("subtitleEnd")}
          </p>

          <Link href={`/${locale}/about`} className={styles.teamButton}>
            {t("teamButtonLabel")}
            <span className={styles.btnArrow}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;