"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./EdtechStudio.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Feature {
  title: string;
  description: string;
  tags: string[];
}

interface CaseItem {
  client: string;
  title: string;
  desc: string;
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

// Iconos SVG para las features (educativos)
const FEATURE_ICONS = [
  <svg key="01" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6v7m0 0-3-3m3 3 3-3M4 4h16v12H4z" />
    <path d="M8 20h8" />
  </svg>, // Diseño instruccional
  <svg key="02" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>, // Ecosistema digital
  <svg key="03" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15 15 0 0 0 0 20 15 15 0 0 0 0-20" />
    <path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" />
  </svg>, // Gamificación
  <svg key="04" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9" />
  </svg>, // Métricas
];

export default function EdtechStudio() {
  const t = useTranslations("ServicesPage");
  const sectionRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const casesRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  const s2 = t.raw("services.s2");
  const features: Feature[] = s2?.subA?.features || [];
  const keywords: string[] = s2?.subA?.keywords || [];
  const cases: CaseItem[] = s2?.cases || [];

  const cleanBadge = s2?.badge || s2?.eyebrow?.replace(/^[0-9]+ ·\s*/, "");

  // --- Animaciones GSAP ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo(`.${styles.sectionEyebrow}`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.sectionTitle}`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.sectionDesc}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });

      // Bloque texto + mockup (izquierda texto, derecha mockup)
      gsap.fromTo(`.${styles.subAText}`, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: `.${styles.subATop}`, start: "top 85%" } });
      gsap.fromTo(`.${styles.lmsMockup}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.9, scrollTrigger: { trigger: `.${styles.subATop}`, start: "top 85%" } });

      // Grid de features (stagger)
      gsap.utils.toArray<HTMLElement>(`.${styles.featureCard}`).forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 50, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: i * 0.1, scrollTrigger: { trigger: featuresRef.current, start: "top 85%" } });
      });

      // Nube de tags (entrada)
      gsap.fromTo(`.${styles.tagCloud}`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: `.${styles.tagCloud}`, start: "top 85%" } });

      // Casos de éxito (stagger)
      gsap.utils.toArray<HTMLElement>(`.${styles.caseCard}`).forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.7, delay: i * 0.15, scrollTrigger: { trigger: casesRef.current, start: "top 85%" } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // --- Animación de la nube de tags (movimiento orgánico) ---
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
  }, [keywords]);

  const formatNumber = (num: number) => (num + 1).toString().padStart(2, "0");

  return (
    <section id="service-2" data-service-section="1" ref={sectionRef} className={styles.edtechStudio}>
      <div className={styles.bgNoise} />
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.eyebrowDot} />
            {cleanBadge || "EdTech Studio"}
          </div>
          <h2 className={styles.sectionTitle}>{s2?.title}</h2>
          <p className={styles.sectionDesc}>{s2?.desc}</p>
        </div>

        {/* Subsección A: texto + mockup LMS */}
        <div className={styles.subA}>
          <div className={styles.subATop}>
            <div className={styles.subAText}>
              <div className={styles.subLabel}>
                <span className={styles.subLabelLine} />
                <span className={styles.subLabelText}>{s2?.subA?.label}</span>
              </div>
              <h3 className={styles.subTitle}>{renderAccentText(s2?.subA?.title)}</h3>
              <p className={styles.subText}>{renderAccentText(s2?.subA?.text)}</p>
            </div>
            <div className={styles.lmsMockup} ref={mockupRef}>
              <div className={styles.mockupHeader}>
                <span className={styles.mockupDot} />
                <span className={styles.mockupDot} />
                <span className={styles.mockupDot} />
                <span className={styles.mockupTitle}>Student Progress Dashboard</span>
              </div>
              <div className={styles.mockupBody}>
                <div className={styles.progressItem}>
                  <span>Course completion</span>
                  <div className={styles.progressBar}><div style={{ width: "78%" }} /></div>
                  <span>78%</span>
                </div>
                <div className={styles.progressItem}>
                  <span>Avg. score</span>
                  <div className={styles.progressBar}><div style={{ width: "92%" }} /></div>
                  <span>92%</span>
                </div>
                <div className={styles.mockupBadges}>
                  <span>🏆 3 badges</span>
                  <span>⭐ 5 modules</span>
                  <span>📅 weekly streak</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de features (4 cards) */}
          <div className={styles.featureGrid} ref={featuresRef}>
            {features.map((feature, idx) => (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.cardInner}>
                  <span className={styles.cardNumber}>{formatNumber(idx)}</span>
                  <div className={styles.cardIconWrapper}>{FEATURE_ICONS[idx]}</div>
                  <div className={styles.cardContent}>
                    <h4 className={styles.cardTitle}>{feature.title}</h4>
                    <p className={styles.cardDescription}>{feature.description}</p>
                    <div className={styles.cardTags}>
                      {feature.tags?.slice(0, 2).map((tag, tidx) => (
                        <span key={tidx} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nube de tags animada */}
          <div className={styles.tagCloud}>
            {keywords.map((kw, idx) => (
              <span key={idx} className={styles.tagItem}>{kw}</span>
            ))}
          </div>
        </div>

        {/* Subsección B: Casos de éxito */}
        <div className={styles.subB}>
          <div className={styles.subLabel}>
            <span className={styles.subLabelLine} />
            <span className={styles.subLabelText}>Casos de éxito</span>
          </div>
          <div className={styles.casesGrid} ref={casesRef}>
            {cases.map((caseItem, idx) => (
              <div key={idx} className={styles.caseCard}>
                <div className={styles.caseHeader}>
                  <span className={styles.caseClient}>{caseItem.client}</span>
                  <span className={styles.caseBadge}>Éxito</span>
                </div>
                <h4 className={styles.caseTitle}>{caseItem.title}</h4>
                <p className={styles.caseDesc}>{caseItem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}