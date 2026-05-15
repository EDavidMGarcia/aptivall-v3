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
  const containerRef = useRef<HTMLDivElement>(null);
  const statsNumbersRef = useRef<HTMLSpanElement[]>([]);

  // Datos de estadísticas desde traducciones
  const statsProjects = t.raw("hero.stats.projects");
  const statsPillars = t.raw("hero.stats.pillars");
  const statsResults = t.raw("hero.stats.results");
  const statsProjectsValue = parseInt(t.raw("hero.stats.projectsValue") || "50", 10);
  const statsPillarsValue = parseInt(t.raw("hero.stats.pillarsValue") || "4", 10);
  const statsResultsValue = parseInt(t.raw("hero.stats.resultsValue") || "100", 10);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        containerRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8 }
      )
        .fromTo(`.${styles.heroEyebrow}`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .fromTo(`.${styles.heroTitle}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
        .fromTo(`.${styles.heroSubtitle}`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .fromTo(`.${styles.statsCard}`, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1 }, "-=0.4")
        .fromTo(`.${styles.terminalCard}`, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.9 }, "-=0.6")
        .add(() => {
          const counters = [
            { el: statsNumbersRef.current[0], target: statsProjectsValue, suffix: "+" },
            { el: statsNumbersRef.current[1], target: statsPillarsValue, suffix: "" },
            { el: statsNumbersRef.current[2], target: statsResultsValue, suffix: "%" },
          ];
          counters.forEach(({ el, target, suffix }) => {
            if (!el) return;
            const counterObj = { val: 0 };
            gsap.to(counterObj, {
              val: target,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(counterObj.val) + suffix;
              },
            });
          });
        });
    }, heroRef);

    return () => ctx.revert();
  }, [statsProjectsValue, statsPillarsValue, statsResultsValue]);

  const setStatRef = (el: HTMLSpanElement | null, idx: number) => {
    if (el) statsNumbersRef.current[idx] = el;
  };

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.heroContainer} ref={containerRef}>
        {/* Columna izquierda: contenido */}
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <span className={styles.eyebrowDot} />
            {t("hero.eyebrow")}
          </div>

          <h1 className={styles.heroTitle}>
            {t("hero.title")}{" "}
            <span className={styles.accentWord}>{t("hero.titleHighlight")}</span>{" "}
            {t("hero.titleEnd")}
          </h1>

          <p className={styles.heroSubtitle}>{t("hero.subtitle")}</p>

          <div className={styles.statsGrid}>
            {/* Tarjeta 1: proyectos */}
            <div className={styles.statsCard}>
              <div>
                <span
                  ref={(el) => setStatRef(el, 0)}
                  className={styles.statNumber}
                  data-target={statsProjectsValue}
                  data-suffix="+"
                >
                  0
                </span>
                <span className={styles.statLabel}>{statsProjects}</span>
              </div>
            </div>

            {/* Tarjeta 2: pilares */}
            <div className={styles.statsCard}>
              <div>
                <span
                  ref={(el) => setStatRef(el, 1)}
                  className={styles.statNumber}
                  data-target={statsPillarsValue}
                  data-suffix=""
                >
                  0
                </span>
                <span className={styles.statLabel}>{statsPillars}</span>
              </div>
            </div>

            {/* Tarjeta 3: resultados */}
            <div className={styles.statsCard}>
              <div>
                <span
                  ref={(el) => setStatRef(el, 2)}
                  className={styles.statNumber}
                  data-target={statsResultsValue}
                  data-suffix="%"
                >
                  0
                </span>
                <span className={styles.statLabel}>{statsResults}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha: terminal */}
        <div className={styles.heroVisual}>
          <div className={styles.terminalCard}>
            <div className={styles.terminalHeader}>
              <span className={styles.terminalDot} />
              <span className={styles.terminalDot} />
              <span className={styles.terminalDot} />
              <span className={styles.terminalPath}>~/services</span>
            </div>
            <div className={styles.terminalBody}>
              <p className={styles.terminalLine}>
                <span className={styles.terminalKeyword}>import</span>{" "}
                <span className={styles.terminalString}>{"Innovation"}</span>
              </p>
              <p className={styles.terminalLine}>
                <span className={styles.terminalKeyword}>import</span>{" "}
                <span className={styles.terminalString}>{"Edtech"}</span>
              </p>
              <p className={styles.terminalLine}>
                <span className={styles.terminalKeyword}>import</span>{" "}
                <span className={styles.terminalString}>{"Talent"}</span>
              </p>
              <p className={styles.terminalLine}>
                <span className={styles.terminalKeyword}>import</span>{" "}
                <span className={styles.terminalString}>{"Media"}</span>
              </p>
              <span className={styles.terminalCursor} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}