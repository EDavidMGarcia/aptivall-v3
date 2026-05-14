"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import styles from "./under-construction.module.css";

export default function UnderConstruction() {
  const locale = useLocale();
  const t = useTranslations("ContactBar");

  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    let glitchId: ReturnType<typeof setInterval>;

    const ctx = gsap.context(() => {
      const lines = linesRef.current?.querySelectorAll(`.${styles.line}`) ?? [];

      gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });

      gsap.to(gridRef.current, { opacity: 1, duration: 2, ease: "power2.out" });

      gsap.to(lines, {
        scaleX: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.7 })
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.9 }, "-=0.4")
        .to(descRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");

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

    ctxRef.current = ctx;

    return () => {
      clearInterval(glitchId);
      ctx.revert();
    };
  }, []);

  return (
    <section className={styles.wrapper}>
      <div ref={gridRef} className={styles.grid} aria-hidden="true" />
      <div className={styles.scanlines} aria-hidden="true" />

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
          {t("underConstruction.badge")}
        </div>

        <h1 ref={titleRef} className={styles.title}>
          {t("underConstruction.title")}{" "}
          <span className={styles.titleAccent}>
            {t("underConstruction.titleAccent")}
          </span>
        </h1>

        <p ref={descRef} className={styles.desc}>
          {t("underConstruction.description")}
        </p>

        <div ref={ctaRef} className={styles.actions}>
          <Link
            href={`/${locale}`}
            className={styles.ctaBtn}
            aria-label={t("underConstruction.cta")}
          >
            {t("underConstruction.cta")}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div className={styles.etaTag}>{t("underConstruction.eta")}</div>
        </div>

        <div className={styles.progress} aria-hidden="true">
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} />
          </div>
          <span className={styles.progressLabel}>{t("underConstruction.loading")}</span>
        </div>
      </div>
    </section>
  );
}