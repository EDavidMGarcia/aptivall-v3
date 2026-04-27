"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import styles from "./under-construction.module.css";
import Link from "next/link";

const content = {
  es: {
    badge: "EN DESARROLLO",
    title: "Algo épico",
    titleAccent: "está llegando",
    description:
      "Estamos construyendo algo extraordinario. Vuelve pronto para descubrir lo que tenemos preparado para ti.",
    cta: "Volver al inicio",
    eta: "Próximamente",
  },
  en: {
    badge: "IN DEVELOPMENT",
    title: "Something epic",
    titleAccent: "is coming",
    description:
      "We're building something extraordinary. Come back soon to discover what we have prepared for you.",
    cta: "Back to home",
    eta: "Coming Soon",
  },
};

export default function UnderConstruction() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "es";
  const t = content[locale as keyof typeof content] ?? content.es;

  const titleRef  = useRef<HTMLHeadingElement>(null);
  const badgeRef  = useRef<HTMLDivElement>(null);
  const descRef   = useRef<HTMLParagraphElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);
  const gridRef   = useRef<HTMLDivElement>(null);
  const linesRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let glitchId: ReturnType<typeof setInterval>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;

    const init = async () => {
      const { gsap } = await import("gsap");

      ctx = gsap.context(() => {
        const lines = linesRef.current?.querySelectorAll(`.${styles.line}`) ?? [];

        // ── Set initial state BEFORE animating ──
        // Critical for client-side navigation in Next.js App Router:
        // gsap.from() won't work after hydration because the DOM is already
        // at its final rendered state. gsap.set() + gsap.to() is the fix.
        gsap.set(gridRef.current,  { opacity: 0 });
        gsap.set(lines,            { scaleX: 0, transformOrigin: "left center" });
        gsap.set(badgeRef.current, { opacity: 0, y: 30 });
        gsap.set(titleRef.current, { opacity: 0, y: 50 });
        gsap.set(descRef.current,  { opacity: 0, y: 25 });
        gsap.set(ctaRef.current,   { opacity: 0, y: 25 });

        // Grid fade in
        gsap.to(gridRef.current, { opacity: 1, duration: 2, ease: "power2.out" });

        // Lines reveal left→right
        gsap.to(lines, {
          scaleX: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
        });

        // Staggered entrance
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.7 })
          .to(titleRef.current, { opacity: 1, y: 0, duration: 0.9 }, "-=0.4")
          .to(descRef.current,  { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
          .to(ctaRef.current,   { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");

        // Periodic glitch
        const glitch = () => {
          if (!titleRef.current) return;
          gsap.to(titleRef.current, {
            skewX: 4,
            duration: 0.05,
            onComplete() {
              gsap.to(titleRef.current, {
                skewX: -4,
                duration: 0.05,
                onComplete() {
                  gsap.to(titleRef.current, { skewX: 0, duration: 0.05 });
                },
              });
            },
          });
        };
        glitchId = setInterval(glitch, 4500);
      });
    };

    init();

    return () => {
      clearInterval(glitchId);
      ctx?.revert(); // kills all tweens and restores original CSS
    };
  }, []);

  return (
    <section className={styles.wrapper}>
      <div ref={gridRef}  className={styles.grid}      aria-hidden="true" />
      <div               className={styles.scanlines}  aria-hidden="true" />

      <div className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />

      <div ref={linesRef} className={styles.linesWrap} aria-hidden="true">
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={styles.line} />
      </div>

      <div className={styles.inner}>
        <div ref={badgeRef} className={styles.badge}>
          <span className={styles.badgeDot} />
          {t.badge}
        </div>

        <h1 ref={titleRef} className={styles.title}>
          {t.title}{" "}
          <span className={styles.titleAccent}>{t.titleAccent}</span>
        </h1>

        <p ref={descRef} className={styles.desc}>
          {t.description}
        </p>

        <div ref={ctaRef} className={styles.actions}>
          <Link href={`/${locale}`} className={styles.ctaBtn}>
            {t.cta}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div className={styles.etaTag}>{t.eta}</div>
        </div>

        <div className={styles.progress} aria-hidden="true">
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} />
          </div>
          <span className={styles.progressLabel}>Loading...</span>
        </div>
      </div>
    </section>
  );
}