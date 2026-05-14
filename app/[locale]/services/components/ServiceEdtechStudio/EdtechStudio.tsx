"use client";

import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
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
  <svg key="01" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 6v7m0 0-3-3m3 3 3-3M4 4h16v12H4z" />
    <path d="M8 20h8" />
  </svg>,
  <svg key="02" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>,
  <svg key="03" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15 15 0 0 0 0 20 15 15 0 0 0 0-20" />
    <path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" />
  </svg>,
  <svg key="04" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9" />
  </svg>,
];

// Iconos para las características de Open edX
const OPEN_EDX_FEATURE_ICONS = [
  <svg key="e1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
  <svg key="e2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>,
  <svg key="e3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>,
  <svg key="e4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>,
];

export default function EdtechStudio() {
  const t = useTranslations("ServicesPage");
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const casesRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  // Referencias para el flip de los casos
  const caseCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const caseFrontRefs = useRef<(HTMLDivElement | null)[]>([]);
  const caseBackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const caseFlipTLs = useRef<gsap.core.Timeline[]>([]);

  const s2 = t.raw("services.s2");
  const features: Feature[] = useMemo(() => s2?.subA?.features || [], [s2]);
  const keywords: string[] = useMemo(() => s2?.subA?.keywords || [], [s2]);
  const cases: CaseItem[] = useMemo(() => s2?.cases || [], [s2]);

  const cleanBadge = s2?.badge || s2?.eyebrow?.replace(/^[0-9]+ ·\s*/, "");

  // --- Animaciones GSAP ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } }
      );
      gsap.fromTo(`.${styles.sectionEyebrow}`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.sectionTitle}`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.sectionDesc}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.lmsMockupEnhanced}`, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.9, scrollTrigger: { trigger: `.${styles.subATop}`, start: "top 85%" } });
      gsap.fromTo(`.${styles.subAText}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: `.${styles.subATop}`, start: "top 85%" } });

      gsap.utils.toArray<HTMLElement>(`.${styles.featureCard}`).forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 50, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: i * 0.1, scrollTrigger: { trigger: featuresRef.current, start: "top 85%" } });
      });
      gsap.fromTo(`.${styles.tagCloud}`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: `.${styles.tagCloud}`, start: "top 85%" } });
      gsap.utils.toArray<HTMLElement>(`.${styles.caseCard}`).forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.7, delay: i * 0.15, scrollTrigger: { trigger: casesRef.current, start: "top 85%" } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // --- Efecto flip 3D para las tarjetas de casos ---
  useEffect(() => {
    caseFlipTLs.current.forEach((tl) => tl.kill());
    caseFlipTLs.current = [];

    cases.forEach((_, i) => {
      const card = caseCardRefs.current[i];
      const front = caseFrontRefs.current[i];
      const back = caseBackRefs.current[i];
      if (!card || !front || !back) return;

      gsap.set(card, {
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      });

      gsap.set(back, { rotationY: -180 });

      const tl = gsap.timeline({ paused: true })
        .to(front, { rotationY: 180, duration: 0.65, ease: "power2.inOut" }, 0)
        .to(back, { rotationY: 0, duration: 0.65, ease: "power2.inOut" }, 0)
        .to(card, { z: 20, duration: 0.25, ease: "power2.out" }, 0)
        .to(card, { z: 0, duration: 0.25, ease: "power2.in" }, 0.4);

      caseFlipTLs.current[i] = tl;

      const onEnter = () => tl.play();
      const onLeave = () => tl.reverse();

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);

      return () => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      };
    });
  }, [cases]);

  // --- Animación de la nube de tags (movimiento orgánico) ---
  useEffect(() => {
    const tagItems = document.querySelectorAll(`.${styles.tagItem}`);
    if (!tagItems.length) return;
    tagItems.forEach((item) => {
      const duration = 8 + Math.random() * 6;
      const xMove = (Math.random() - 0.5) * 40;
      const yMove = (Math.random() - 0.5) * 30;
      gsap.to(item, {
        x: xMove, y: yMove, duration: duration, repeat: -1, yoyo: true, ease: "sine.inOut", delay: Math.random() * 2,
      });
    });
  }, [keywords]);

  const formatNumber = (num: number) => (num + 1).toString().padStart(2, "0");

  const openEdxFeatures = t.raw("edtech.openEdxFeatures") as Array<{ title: string; desc: string }>;

  return (
    <section id="service-2" data-service-section="1" ref={sectionRef} className={styles.edtechStudio}>
      <div className={styles.container} ref={containerRef}>
        {/* Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.eyebrowDot} />
            {cleanBadge || "EdTech Studio"}
          </div>
          <h2 className={styles.sectionTitle}>{s2?.title}</h2>
          <p className={styles.sectionDesc}>{s2?.desc}</p>
        </div>

        {/* Subsección A: Enhanced Open edX card (izquierda) + Texto (derecha) */}
        <div className={styles.subA}>
          <div className={styles.subATop}>
            {/* Tarjeta mejorada de Open edX Partner */}
            <div className={styles.lmsMockupEnhanced} ref={mockupRef}>
              <div className={styles.mockupEnhancedHeader}>
                <span className={styles.mockupDot} />
                <span className={styles.mockupDot} />
                <span className={styles.mockupDot} />
                <span className={styles.mockupEnhancedTitle}>{t("edtech.enhancedMockup.title")}</span>
              </div>
              <div className={styles.mockupEnhancedBody}>
                <Image
                  src="/logos/EdX_newer_logo.svg"
                  alt="Open edX"
                  width={120}
                  height={40}
                  className={styles.mockupEnhancedLogo}
                />
                <span className={styles.partnerBadge}>{t("edtech.enhancedMockup.partnerBadge")}</span>
                <p className={styles.partnerDescription}>
                  {t("edtech.enhancedMockup.partnerDescription")}
                </p>
                <div className={styles.featuresGridEnhanced}>
                  {openEdxFeatures.map((feature, idx) => (
                    <div key={idx} className={styles.featureItemEnhanced}>
                      <div className={styles.featureIconEnhanced}>{OPEN_EDX_FEATURE_ICONS[idx]}</div>
                      <div className={styles.featureTextEnhanced}>
                        <span className={styles.featureTitleEnhanced}>{feature.title}</span>
                        <span className={styles.featureDescEnhanced}>{feature.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.impactSection}>
                  <span className={styles.impactLabel}>{t("edtech.enhancedMockup.impactLabel")}</span>
                  <div className={styles.impactStats}>
                    <div className={styles.impactStat}>
                      <span className={styles.impactStatValue}>100M+</span>
                      <span className={styles.impactStatDesc}>{t("edtech.enhancedMockup.impactLearners")}</span>
                    </div>
                    <div className={styles.impactDivider} />
                    <div className={styles.impactStat}>
                      <span className={styles.impactStatValue}>2,283+</span>
                      <span className={styles.impactStatDesc}>{t("edtech.enhancedMockup.impactSites")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Texto descriptivo (derecha) */}
            <div className={styles.subAText}>
              <div className={styles.subLabel}>
                <span className={styles.subLabelLine} />
                <span className={styles.subLabelText}>{s2?.subA?.label}</span>
              </div>
              <h3 className={styles.subTitle}>{renderAccentText(s2?.subA?.title)}</h3>
              <p className={styles.subText}>{renderAccentText(s2?.subA?.text)}</p>
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

        {/* Subsección B: Casos de éxito con efecto flip 3D */}
        <div className={styles.subB}>
          <div className={styles.subLabel}>
            <span className={styles.subLabelLine} />
            <span className={styles.subLabelText}>{t("edtech.subB.label")}</span>
          </div>
          <div className={styles.casesGrid} ref={casesRef}>
            {cases.map((caseItem, idx) => (
              <div
                key={idx}
                ref={(el) => { caseCardRefs.current[idx] = el; }}
                className={styles.caseCard}
              >
                {/* Cara frontal: solo el logo a máximo tamaño */}
                <div
                  ref={(el) => { caseFrontRefs.current[idx] = el; }}
                  className={styles.caseCardFront}
                >
                  <Image
                    src={`/logos/${idx === 0 ? "5" : "1"}.png`}
                    alt={`${caseItem.client} logo`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.caseLogo}
                    style={{ objectFit: "contain" }}
                  />
                </div>

                {/* Cara trasera: información del caso */}
                <div
                  ref={(el) => { caseBackRefs.current[idx] = el; }}
                  className={styles.caseCardBack}
                >
                  <div className={styles.caseHeader}>
                    <span className={styles.caseClient}>{caseItem.client}</span>
                    <span className={styles.caseBadge}>{t("edtech.caseBadge")}</span>
                  </div>
                  <h4 className={styles.caseTitle}>{caseItem.title}</h4>
                  <p className={styles.caseDesc}>{caseItem.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}