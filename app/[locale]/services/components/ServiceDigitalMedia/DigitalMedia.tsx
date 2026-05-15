"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./DigitalMedia.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const renderAccentText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      const inner = part.slice(1, -1);
      return <span key={idx} className={styles.accentWord}>{inner}</span>;
    }
    return part;
  });
};

// Iconos SVG para las subsecciones
const VIDEO_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="6" width="16" height="12" rx="2" />
    <path d="M18 10l4-2v8l-4-2" />
  </svg>
);

const WEB_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

// Bullet SVG para las listas (reemplaza ✦)
const BULLET_ICON = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function DigitalMedia() {
  const t = useTranslations("ServicesPage");
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const subARef = useRef<HTMLDivElement>(null);
  const subBRef = useRef<HTMLDivElement>(null);

  const s4 = t.raw("services.s4");
  const subA = s4?.subA || {};
  const subB = s4?.subB || {};
  const keywords: string[] = s4?.keywords || [];

  const cleanBadge = s4?.badge || s4?.eyebrow?.replace(/^[0-9]+ ·\s*/, "");

  // Animaciones GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Contenedor general (anti-FOUC)
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } }
      );
      gsap.fromTo(`.${styles.sectionEyebrow}`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.sectionTitle}`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.sectionDesc}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });

      gsap.fromTo(subARef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: subARef.current, start: "top 85%" } });
      gsap.fromTo(subBRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: subBRef.current, start: "top 85%" } });

      gsap.fromTo(`.${styles.tagCloud}`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: `.${styles.tagCloud}`, start: "top 85%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Nube de tags animada (movimiento orgánico)
  useEffect(() => {
    const tagItems = document.querySelectorAll(`.${styles.tagItem}`);
    if (!tagItems.length) return;
    tagItems.forEach((item) => {
      const duration = 8 + Math.random() * 6;
      const xMove = (Math.random() - 0.5) * 40;
      const yMove = (Math.random() - 0.5) * 30;
      gsap.to(item, {
        x: xMove,
        y: yMove,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywords]);

  return (
    <section id="service-4" data-service-section="3" ref={sectionRef} className={styles.digitalMedia}>
      <div className={styles.container} ref={containerRef}>
        {/* Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.eyebrowDot} />
            {cleanBadge || "Digital Media"}
          </div>
          <h2 className={styles.sectionTitle}>{s4?.title}</h2>
          <p className={styles.sectionDesc}>{s4?.desc}</p>
        </div>

        {/* Dos columnas */}
        <div className={styles.twoColumns}>
          {/* Subsección A: Video y Animación */}
          <div className={styles.mediaCard} ref={subARef}>
            <div className={styles.cardInner}>
              <div className={styles.mediaHeader}>
                <div className={styles.mediaIcon}>{VIDEO_ICON}</div>
                <span className={styles.mediaLabel}>{subA?.label}</span>
              </div>
              <h3 className={styles.mediaTitle}>{renderAccentText(subA?.title)}</h3>
              <p className={styles.mediaText}>{renderAccentText(subA?.text)}</p>
              <ul className={styles.mediaList}>
                {(subA?.items || []).map((item: string, idx: number) => (
                  <li key={idx}>
                    <span className={styles.listBullet}>{BULLET_ICON}</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className={styles.tagRow}>
                {(subA?.tags || []).map((tag: string, idx: number) => (
                  <span key={idx} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Subsección B: Webs y Diseño */}
          <div className={styles.mediaCard} ref={subBRef}>
            <div className={styles.cardInner}>
              <div className={styles.mediaHeader}>
                <div className={styles.mediaIcon}>{WEB_ICON}</div>
                <span className={styles.mediaLabel}>{subB?.label}</span>
              </div>
              <h3 className={styles.mediaTitle}>{renderAccentText(subB?.title)}</h3>
              <p className={styles.mediaText}>{renderAccentText(subB?.text)}</p>
              <ul className={styles.mediaList}>
                {(subB?.items || []).map((item: string, idx: number) => (
                  <li key={idx}>
                    <span className={styles.listBullet}>{BULLET_ICON}</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className={styles.tagRow}>
                {(subB?.tags || []).map((tag: string, idx: number) => (
                  <span key={idx} className={styles.tagGreen}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nube de tags animada */}
        <div className={styles.tagCloud}>
          {keywords.map((kw, idx) => (
            <span key={idx} className={styles.tagItem}>{kw}</span>
          ))}
        </div>
      </div>
    </section>
  );
}