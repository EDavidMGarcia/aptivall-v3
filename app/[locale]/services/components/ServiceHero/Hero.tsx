"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ServiceHero.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesHero() {
  const t = useTranslations("ServicesPage");
  const heroRef = useRef<HTMLElement>(null);
  const statsNumbersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ocultar todo inicialmente para evitar FOUC
      gsap.set(heroRef.current, { autoAlpha: 0 });
      gsap.set(
        [
          `.${styles.heroEyebrow}`,
          `.${styles.heroTitle}`,
          `.${styles.heroSubtitle}`,
          `.${styles.statsGrid}`,
          `.${styles.heroVisual}`,
        ],
        { opacity: 0, y: 30, visibility: "visible" }
      );

      // Línea de tiempo principal
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(heroRef.current, { autoAlpha: 1, duration: 0.4 })
        .to(`.${styles.heroEyebrow}`, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
        .to(`.${styles.heroTitle}`, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
        .to(`.${styles.heroSubtitle}`, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .to(`.${styles.statsGrid}`, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        .to(`.${styles.heroVisual}`, { opacity: 1, y: 0, duration: 0.9 }, "-=0.5")
        // Animación de los números (contadores) después de que las tarjetas aparezcan
        .add(() => {
          statsNumbersRef.current.forEach((el) => {
            const target = parseInt(el.getAttribute("data-target") || "0", 10);
            const suffix = el.getAttribute("data-suffix") || "";
            const counterObj = { val: 0 };
            gsap.to(counterObj, {
              val: target,
              duration: 1.5,
              ease: "power2.out",
              delay: 0.2, // pequeño retraso para que se vea después del slide
              onUpdate: () => {
                el.textContent = Math.round(counterObj.val) + suffix;
              },
            });
          });
        });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const statsProjects = t.raw("hero.stats.projects");
  const statsPillars = t.raw("hero.stats.pillars");
  const statsResults = t.raw("hero.stats.results");

  // Referencias para los contadores
  const setStatRef = (el: HTMLSpanElement | null, idx: number) => {
    if (el) statsNumbersRef.current[idx] = el;
  };

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.bgNoise} />

      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>{t("hero.eyebrow")}</div>

          <h1 className={styles.heroTitle}>
            {t("hero.title")}{" "}
            <span className={styles.accentWord}>{t("hero.titleHighlight")}</span>{" "}
            {t("hero.titleEnd")}
          </h1>

          <p className={styles.heroSubtitle}>{t("hero.subtitle")}</p>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span
                ref={(el) => setStatRef(el, 0)}
                className={styles.statNumber}
                data-target="50"
                data-suffix="+"
              >
                0
              </span>
              <span className={styles.statLabel}>{statsProjects}</span>
              <div className={styles.statBar} />
            </div>
            <div className={styles.statCard}>
              <span
                ref={(el) => setStatRef(el, 1)}
                className={styles.statNumber}
                data-target="4"
                data-suffix=""
              >
                0
              </span>
              <span className={styles.statLabel}>{statsPillars}</span>
              <div className={styles.statBar} />
            </div>
            <div className={styles.statCard}>
              <span
                ref={(el) => setStatRef(el, 2)}
                className={styles.statNumber}
                data-target="100"
                data-suffix="%"
              >
                0
              </span>
              <span className={styles.statLabel}>{statsResults}</span>
              <div className={styles.statBar} />
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.terminalCard}>
            <div className={styles.terminalHeader}>
              <span className={styles.terminalDotRed} />
              <span className={styles.terminalDotYellow} />
              <span className={styles.terminalDotGreen} />
              <span className={styles.terminalPath}>~/services</span>
            </div>
            <div className={styles.terminalContent}>
              <p className={styles.terminalLine}>
                <span className={styles.terminalKeyword}>import</span>{" "}
                <span className={styles.terminalString}>{'Innovation'}</span>
              </p>
              <p className={styles.terminalLine}>
                <span className={styles.terminalKeyword}>import</span>{" "}
                <span className={styles.terminalString}>{'Edtech'}</span>
              </p>
              <p className={styles.terminalLine}>
                <span className={styles.terminalKeyword}>import</span>{" "}
                <span className={styles.terminalString}>{'Talent'}</span>
              </p>
              <p className={styles.terminalLine}>
                <span className={styles.terminalKeyword}>import</span>{" "}
                <span className={styles.terminalString}>{'Media'}</span>
              </p>
              <div className={styles.terminalCursor} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}