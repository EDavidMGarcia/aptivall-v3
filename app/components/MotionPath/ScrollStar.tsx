"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./ScrollStar.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const ROTATION_SPEED_DEG = 360;

export default function ScrollStar() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ctx = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (!containerRef.current) return;
      containerRef.current.style.height = `${document.documentElement.scrollHeight}px`;
    };

    const createTimeline = () => {
      ctx.current?.revert();

      ctx.current = gsap.context(() => {
        const box = document.querySelector(`.${styles.box}`) as HTMLElement | null;
        if (!box) return;

        // 1. Obtener marcadores visibles (cualquier grupo activo)
        const allMarkers = gsap.utils.toArray<HTMLElement>(`.${styles.marker}`);
        const visibleMarkers = allMarkers.filter((el) => el.offsetParent !== null);
        if (visibleMarkers.length === 0) return;

        // 2. Animación de entrada (solo opacidad/scale, la posición ya la da .initial)
        gsap.set(box, { opacity: 0, scale: 0.6, filter: "blur(12px)" });
        gsap.to(box, {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          delay: 0.8,
          ease: "expo.out",
        });

        // 3. Obtener rect de la caja ya posicionada por CSS
        const boxStartRect = box.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        // 4. Puntos relativos a esa posición inicial
        const points = visibleMarkers.map((marker) => {
          const r = marker.getBoundingClientRect();
          return {
            x: r.left + scrollX + r.width / 2 - (boxStartRect.left + scrollX + boxStartRect.width / 2),
            y: r.top + scrollY + r.height / 2 - (boxStartRect.top + scrollY + boxStartRect.height / 2),
          };
        });

        // 5. Timeline de movimiento
        gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            endTrigger: visibleMarkers[visibleMarkers.length - 1],
            end: "bottom bottom",
            scrub: 1,
          },
        }).to(box, {
          duration: 1,
          ease: "none",
          motionPath: {
            path: points,
            curviness: 1.5,
            autoRotate: false,
          },
        });

        // 6. Rotación
        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          endTrigger: visibleMarkers[visibleMarkers.length - 1],
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(`.${styles.starSvg}`, {
              rotation: self.progress * ROTATION_SPEED_DEG,
            });
          },
        });
      }, containerRef);
    };

    const handleResize = () => {
      updateHeight();
      createTimeline();
    };

    updateHeight();
    createTimeline();
    window.addEventListener("resize", handleResize);
    return () => {
      ctx.current?.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.wrapper} aria-hidden="true">
      <div className={styles.main}>
        {/* Contenedor inicial con la estrella. Posición CSS marca el inicio de la ruta */}
        <div className={`${styles.container} ${styles.initial}`}>
          <div className={styles.box}>
            <svg className={styles.starSvg} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* SVG verde completo */}
              <defs>
                <radialGradient id="starGradMain" cx="38%" cy="32%" r="70%">
                  <stop offset="0%" stopColor="#33FF99" />
                  <stop offset="25%" stopColor="#00FF81" />
                  <stop offset="55%" stopColor="#00B359" />
                  <stop offset="85%" stopColor="#004D26" />
                  <stop offset="100%" stopColor="#001A0D" stopOpacity="0.95" />
                </radialGradient>
                <radialGradient id="starShine" cx="38%" cy="25%" r="40%">
                  <stop offset="0%" stopColor="#99FFCC" stopOpacity="0.6" />
                  <stop offset="55%" stopColor="#33FF99" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#33FF99" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="60%" stopColor="#00FF81" stopOpacity="0" />
                  <stop offset="80%" stopColor="#00B359" stopOpacity="0.6" />
                  <stop offset="90%" stopColor="#33FF99" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#00FF81" stopOpacity="0" />
                </radialGradient>
                <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <clipPath id="starClip">
                  <path d="M100,18 C100,18 108,18 112,24 L124,58 C126,63 130,66 136,67 L171,68 C177,68 180,72 178,77 C176,80 174,82 172,84 L145,106 C141,110 139,115 141,121 L151,156 C153,162 149,167 144,165 C141,164 139,163 137,161 L107,140 C103,137 97,137 93,140 L63,161 C58,164 53,162 51,157 C50,154 50,151 51,148 L61,121 C63,115 61,110 57,106 L28,84 C23,80 23,74 28,71 C30,69 33,68 36,68 L64,67 C70,66 74,63 76,58 L88,24 C90,18 95,15 100,18 Z" />
                </clipPath>
              </defs>

              <circle cx="100" cy="100" r="78" fill="none" stroke="#00FF81" strokeWidth="22" opacity="0.07" filter="url(#starGlow)" />
              <ellipse cx="100" cy="100" rx="82" ry="22" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" transform="rotate(-22, 100, 100)" filter="url(#ringGlow)" className={styles.starRing} />
              <ellipse cx="100" cy="100" rx="76" ry="17" fill="none" stroke="#55FFAA" strokeWidth="0.8" strokeDasharray="4 8" transform="rotate(58, 100, 100)" opacity="0.4" className={styles.starRing2} />
              <path d="M100,18 C100,18 108,18 112,24 L124,58 C126,63 130,66 136,67 L171,68 C177,68 180,72 178,77 C176,80 174,82 172,84 L145,106 C141,110 139,115 141,121 L151,156 C153,162 149,167 144,165 C141,164 139,163 137,161 L107,140 C103,137 97,137 93,140 L63,161 C58,164 53,162 51,157 C50,154 50,151 51,148 L61,121 C63,115 61,110 57,106 L28,84 C23,80 23,74 28,71 C30,69 33,68 36,68 L64,67 C70,66 74,63 76,58 L88,24 C90,18 95,15 100,18 Z" fill="#00FF81" opacity="0.2" filter="url(#starGlow)" transform="scale(1.12) translate(-9, -9)" />
              <path d="M100,18 C100,18 108,18 112,24 L124,58 C126,63 130,66 136,67 L171,68 C177,68 180,72 178,77 C176,80 174,82 172,84 L145,106 C141,110 139,115 141,121 L151,156 C153,162 149,167 144,165 C141,164 139,163 137,161 L107,140 C103,137 97,137 93,140 L63,161 C58,164 53,162 51,157 C50,154 50,151 51,148 L61,121 C63,115 61,110 57,106 L28,84 C23,80 23,74 28,71 C30,69 33,68 36,68 L64,67 C70,66 74,63 76,58 L88,24 C90,18 95,15 100,18 Z" fill="url(#starGradMain)" filter="url(#starGlow)" />
              <path d="M100,18 C100,18 108,18 112,24 L124,58 C126,63 130,66 136,67 L171,68 C177,68 180,72 178,77 C176,80 174,82 172,84 L145,106 C141,110 139,115 141,121 L151,156 C153,162 149,167 144,165 C141,164 139,163 137,161 L107,140 C103,137 97,137 93,140 L63,161 C58,164 53,162 51,157 C50,154 50,151 51,148 L61,121 C63,115 61,110 57,106 L28,84 C23,80 23,74 28,71 C30,69 33,68 36,68 L64,67 C70,66 74,63 76,58 L88,24 C90,18 95,15 100,18 Z" fill="url(#starShine)" clipPath="url(#starClip)" />
              <ellipse cx="72" cy="65" rx="11" ry="6" fill="white" opacity="0.16" transform="rotate(-35, 72, 65)" />
              <ellipse cx="76" cy="60" rx="4.5" ry="2.5" fill="white" opacity="0.32" transform="rotate(-35, 76, 60)" />
              <circle cx="130" cy="62" r="2.5" fill="#55FFAA" opacity="0.7" className={styles.spark1} />
              <circle cx="140" cy="108" r="1.8" fill="#33FF99" opacity="0.6" className={styles.spark2} />
              <circle cx="58" cy="124" r="2" fill="#88FFCC" opacity="0.5" className={styles.spark3} />
            </svg>
          </div>
        </div>

        {/* ── Waypoints Desktop HD (≥1441px) ── */}
        <div className={`${styles.container} ${styles.hd2}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.hd3}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.hd4}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.hd5}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.hd6}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.hd7}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.hd8}`}><div className={styles.marker} /></div>

        {/* ── Waypoints Laptop Grande (1367px – 1440px) ── */}
        <div className={`${styles.container} ${styles.ll2}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.ll3}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.ll4}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.ll5}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.ll6}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.ll7}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.ll8}`}><div className={styles.marker} /></div>

        {/* ── Waypoints Laptop Pequeña (1025px – 1366px) ── */}
        <div className={`${styles.container} ${styles.ls2}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.ls3}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.ls4}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.ls5}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.ls6}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.ls7}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.ls8}`}><div className={styles.marker} /></div>

        {/* ── Waypoints Tablet (769px – 1024px) ── */}
        <div className={`${styles.container} ${styles.t2}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.t3}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.t4}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.t5}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.t6}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.t7}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.t8}`}><div className={styles.marker} /></div>

        {/* ── Waypoints Móvil (≤768px) ── */}
        <div className={`${styles.container} ${styles.m2}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.m3}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.m4}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.m5}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.m6}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.m7}`}><div className={styles.marker} /></div>
        <div className={`${styles.container} ${styles.m8}`}><div className={styles.marker} /></div>
      </div>
    </div>
  );
}