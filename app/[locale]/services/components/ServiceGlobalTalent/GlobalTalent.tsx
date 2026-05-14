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

// Iconos SVG para las categorías principales
const CATEGORY_ICONS: Record<string, React.ReactElement> = {
  engineering: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  pmo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  marketing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9" />
    </svg>
  ),
};

// Mapeo de iconos a SVG para los perfiles
const PROFILE_ICONS: Record<string, React.ReactElement> = {
  "</>": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  "⚡": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  "☁️": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  ),
  "📐": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
      <path d="m14.5 12.5 2-2" />
      <path d="m11.5 9.5 2-2" />
      <path d="m8.5 6.5 2-2" />
      <path d="m17.5 15.5 2-2" />
    </svg>
  ),
  "🎯": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  "🔄": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  ),
  "✍️": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  "🎬": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  "📈": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

export default function GlobalTalent() {
  const t = useTranslations("ServicesPage");
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const s3 = t.raw("services.s3");
  const categoriesData = s3?.categories || {};
  const stats = s3?.stats || { colocados: "1,200+", retencion: "95%", satisfaccion: "4.8/5" };
  // Sin useMemo: el compilador de React no puede preservar la memoización con dependencia [s3]
  const keywords: string[] = s3?.keywords || [];
  const cleanBadge = s3?.badge || s3?.eyebrow?.replace(/^[0-9]+ ·\s*/, "");

  // Convertir objeto de categorías a array
  const categoriesArray: { key: string; data: Category }[] = Object.entries(categoriesData).map(([key, value]) => ({
    key,
    data: value as Category,
  }));

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
      <div className={styles.container} ref={containerRef}>
        {/* Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.eyebrowDot} />
            {cleanBadge || "Global Talent"}
          </div>
          <h2 className={styles.sectionTitle}>{s3?.title}</h2>
          <p className={styles.sectionDesc}>{s3?.desc}</p>
        </div>

        {/* Subsección superior: texto + estadísticas */}
        <div className={styles.subATop}>
          <div className={styles.subAText}>
            <div className={styles.subLabel}>
              <span className={styles.subLabelLine} />
              <span className={styles.subLabelText}>{s3?.subA?.label}</span>
            </div>
            <h3 className={styles.subTitle}>{renderAccentText(s3?.subA?.title)}</h3>
            <p className={styles.subText}>{renderAccentText(s3?.subA?.text)}</p>
          </div>
          <div className={styles.talentStats}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.colocados || stats.placed}</span>
              <span className={styles.statLabel}>{t("services.s3.statsLabels.colocados")}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.retencion || stats.retention}</span>
              <span className={styles.statLabel}>{t("services.s3.statsLabels.retencion")}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.satisfaccion || stats.satisfaction}</span>
              <span className={styles.statLabel}>{t("services.s3.statsLabels.satisfaccion")}</span>
            </div>
          </div>
        </div>

        {/* Grid de categorías */}
        <div className={styles.categoriesGrid} ref={categoriesRef}>
          {categoriesArray.map(({ key, data }) => (
            <div key={key} className={styles.categoryCard}>
              <div className={styles.cardInner}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>
                    {CATEGORY_ICONS[key] || CATEGORY_ICONS.engineering}
                  </div>
                  <h3 className={styles.categoryTitle}>{data.name}</h3>
                  <span className={styles.profileCount}>{data.profiles.length}</span>
                </div>
                <div className={styles.profilesList}>
                  {data.profiles.map((profile: Profile, idx: number) => (
                    <div key={idx} className={styles.profileItem}>
                      <div className={styles.profileIconWrapper}>
                        {PROFILE_ICONS[profile.icon] || PROFILE_ICONS["</>"]}
                      </div>
                      <div className={styles.profileContent}>
                        <h4 className={styles.profileTitle}>{profile.title}</h4>
                        <p className={styles.profileDesc}>{profile.description}</p>
                      </div>
                    </div>
                  ))}
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
    </section>
  );
}