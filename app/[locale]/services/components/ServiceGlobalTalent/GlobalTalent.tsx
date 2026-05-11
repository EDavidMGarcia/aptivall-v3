// app/[locale]/services/components/ServiceGlobalTalent/GlobalTalent.tsx
"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./GlobalTalent.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Profile {
  title: string;
  description: string;
  icon: string;
}

interface Category {
  name: string;
  profiles: Profile[];
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

// Iconos SVG para las categorías
const CATEGORY_ICONS = {
  engineering: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  pmo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 8v4l3 3M12 2a10 10 0 1 0 10 10" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  marketing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9" />
    </svg>
  ),
};

export default function GlobalTalent() {
  const t = useTranslations("ServicesPage");
  const sectionRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const s3 = t.raw("services.s3");
  const categoriesData = s3?.categories || {};
  const stats = s3?.stats || { placed: "1,200+", retention: "95%", satisfaction: "4.8/5" };
  const keywords: string[] = s3?.keywords || [];

  const cleanBadge = s3?.badge || s3?.eyebrow?.replace(/^[0-9]+ ·\s*/, "");

  // Convertir objeto de categorías a array para mapear
  const categoriesArray: { key: string; data: Category }[] = Object.entries(categoriesData).map(([key, value]) => ({
    key,
    data: value as Category,
  }));

  // Animaciones GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(`.${styles.sectionEyebrow}`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.sectionTitle}`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.sectionDesc}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.subAText}`, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: `.${styles.subATop}`, start: "top 85%" } });
      gsap.fromTo(`.${styles.talentStats}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.9, scrollTrigger: { trigger: `.${styles.subATop}`, start: "top 85%" } });
      
      gsap.utils.toArray<HTMLElement>(`.${styles.categoryCard}`).forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.15, scrollTrigger: { trigger: categoriesRef.current, start: "top 85%" } });
      });
      
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
  }, [keywords]);

  return (
    <section id="service-3" data-service-section="2" ref={sectionRef} className={styles.globalTalent}>
      <div className={styles.bgNoise} />
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.eyebrowDot} />
            {cleanBadge || "Global Talent"}
          </div>
          <h2 className={styles.sectionTitle}>{s3?.title}</h2>
          <p className={styles.sectionDesc}>{s3?.desc}</p>
        </div>

        <div className={styles.subATop}>
          <div className={styles.subAText}>
            <h3 className={styles.subTitle}>Talento de Alto Impacto para tu Operación</h3>
            <p className={styles.subText}>{s3?.subA?.text}</p>
          </div>
          <div className={styles.talentStats}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.placed}</span>
              <span className={styles.statLabel}>profesionales colocados</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.retention}</span>
              <span className={styles.statLabel}>retención anual</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.satisfaction}</span>
              <span className={styles.statLabel}>satisfacción cliente</span>
            </div>
          </div>
        </div>

        <div className={styles.categoriesGrid} ref={categoriesRef}>
          {categoriesArray.map(({ key, data }) => (
            <div key={key} className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  {key === "engineering" && CATEGORY_ICONS.engineering}
                  {key === "pmo" && CATEGORY_ICONS.pmo}
                  {key === "marketing" && CATEGORY_ICONS.marketing}
                </div>
                <h3 className={styles.categoryTitle}>{data.name}</h3>
              </div>
              <div className={styles.profilesList}>
                {data.profiles.map((profile: Profile, idx: number) => (
                  <div key={idx} className={styles.profileItem}>
                    <span className={styles.profileIcon}>{profile.icon}</span>
                    <div>
                      <h4 className={styles.profileTitle}>{profile.title}</h4>
                      <p className={styles.profileDesc}>{profile.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.tagCloud}>
          {keywords.map((kw, idx) => (
            <span key={idx} className={styles.tagItem}>{kw}</span>
          ))}
        </div>
      </div>
    </section>
  );
}