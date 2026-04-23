"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./ScrollStar.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

type Point = {
  x: number;
  y: number;
};

export default function ScrollStar() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ctx = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (!containerRef.current) return;
      const docHeight = document.documentElement.scrollHeight;
      containerRef.current.style.height = `${docHeight}px`;
    };

    const createTimeline = () => {
      ctx.current?.revert();

      ctx.current = gsap.context(() => {
        const box = document.querySelector(
          `.${styles.box}`
        ) as HTMLElement | null;

        if (!box) return;

        const boxStartRect = box.getBoundingClientRect();

        const containers = gsap.utils.toArray<HTMLElement>(
          `.${styles.container}:not(.${styles.initial})`
        );

        const points: Point[] = containers.map((container) => {
          const marker =
            (container.querySelector(
              `.${styles.marker}`
            ) as HTMLElement | null) ?? container;

          const r = marker.getBoundingClientRect();
          const scrollX = window.scrollX;
          const scrollY = window.scrollY;

          return {
            x:
              r.left + scrollX + r.width / 2 -
              (boxStartRect.left + scrollX + boxStartRect.width / 2),
            y:
              r.top + scrollY + r.height / 2 -
              (boxStartRect.top + scrollY + boxStartRect.height / 2),
          };
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            endTrigger: `.${styles.eighteen}`,
            end: "bottom bottom",
            scrub: 1,
          },
        });

        tl.to(`.${styles.box}`, {
          duration: 1,
          ease: "none",
          motionPath: {
            path: points,
            curviness: 1.5,
            autoRotate: false,
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
    <div ref={containerRef} className={styles.wrapper}>
      <div className={styles.main}>

        <div className={`${styles.container} ${styles.initial}`}>
          <div className={styles.box}>
            <svg
              className={styles.starSvg}
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>

                {/* Gradiente principal — igual que el orbe */}
                <radialGradient id="starGradMain" cx="38%" cy="32%" r="70%">
                  <stop offset="0%"   stopColor="#C8BAFF" />
                  <stop offset="25%"  stopColor="#7C5CFC" />
                  <stop offset="55%"  stopColor="#2D1FA8" />
                  <stop offset="85%"  stopColor="#0A0840" />
                  <stop offset="100%" stopColor="#000318" stopOpacity="0.95" />
                </radialGradient>

                {/* Brillo especular superior */}
                <radialGradient id="starShine" cx="38%" cy="25%" r="40%">
                  <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.7" />
                  <stop offset="55%"  stopColor="#A090FF" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#A090FF" stopOpacity="0" />
                </radialGradient>

                {/* Gradiente del anillo */}
                <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="60%"  stopColor="#5533FF" stopOpacity="0" />
                  <stop offset="80%"  stopColor="#7755FF" stopOpacity="0.6" />
                  <stop offset="90%"  stopColor="#AACCFF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#5533FF" stopOpacity="0" />
                </radialGradient>

                {/* Núcleo */}
                <radialGradient id="starCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.9" />
                  <stop offset="40%"  stopColor="#8B6FFF" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3B1FCC" stopOpacity="0" />
                </radialGradient>

                {/* Glow exterior */}
                <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Glow del anillo */}
                <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Clip en forma de estrella redondeada para el shine */}
                <clipPath id="starClip">
                  <path d="
                    M100,18
                    C100,18 108,18 112,24
                    L124,58
                    C126,63 130,66 136,67
                    L171,68
                    C177,68 180,72 178,77
                    C176,80 174,82 172,84
                    L145,106
                    C141,110 139,115 141,121
                    L151,156
                    C153,162 149,167 144,165
                    C141,164 139,163 137,161
                    L107,140
                    C103,137 97,137 93,140
                    L63,161
                    C58,164 53,162 51,157
                    C50,154 50,151 51,148
                    L61,121
                    C63,115 61,110 57,106
                    L28,84
                    C23,80 23,74 28,71
                    C30,69 33,68 36,68
                    L64,67
                    C70,66 74,63 76,58
                    L88,24
                    C90,18 95,15 100,18 Z
                  " />
                </clipPath>

              </defs>

              {/* ── Halo exterior difuso ── */}
              <circle
                cx="100" cy="100" r="78"
                fill="none"
                stroke="#5533FF"
                strokeWidth="22"
                opacity="0.07"
                filter="url(#starGlow)"
              />

              {/* ── Anillo orbital inclinado ── */}
              <ellipse
                cx="100" cy="100"
                rx="82" ry="22"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="1.5"
                transform="rotate(-22, 100, 100)"
                filter="url(#ringGlow)"
                className={styles.starRing}
              />

              {/* ── Segundo anillo punteado ── */}
              <ellipse
                cx="100" cy="100"
                rx="76" ry="17"
                fill="none"
                stroke="#88AAFF"
                strokeWidth="0.8"
                strokeDasharray="4 8"
                transform="rotate(58, 100, 100)"
                opacity="0.4"
                className={styles.starRing2}
              />

              {/* ── Sombra/glow de la estrella (capa trasera) ── */}
              <path
                d="
                  M100,18
                  C100,18 108,18 112,24
                  L124,58
                  C126,63 130,66 136,67
                  L171,68
                  C177,68 180,72 178,77
                  C176,80 174,82 172,84
                  L145,106
                  C141,110 139,115 141,121
                  L151,156
                  C153,162 149,167 144,165
                  C141,164 139,163 137,161
                  L107,140
                  C103,137 97,137 93,140
                  L63,161
                  C58,164 53,162 51,157
                  C50,154 50,151 51,148
                  L61,121
                  C63,115 61,110 57,106
                  L28,84
                  C23,80 23,74 28,71
                  C30,69 33,68 36,68
                  L64,67
                  C70,66 74,63 76,58
                  L88,24
                  C90,18 95,15 100,18 Z
                "
                fill="#3333CC"
                opacity="0.3"
                filter="url(#starGlow)"
                transform="scale(1.12) translate(-9, -9)"
              />

              {/* ── Cuerpo principal de la estrella ── */}
              <path
                d="
                  M100,18
                  C100,18 108,18 112,24
                  L124,58
                  C126,63 130,66 136,67
                  L171,68
                  C177,68 180,72 178,77
                  C176,80 174,82 172,84
                  L145,106
                  C141,110 139,115 141,121
                  L151,156
                  C153,162 149,167 144,165
                  C141,164 139,163 137,161
                  L107,140
                  C103,137 97,137 93,140
                  L63,161
                  C58,164 53,162 51,157
                  C50,154 50,151 51,148
                  L61,121
                  C63,115 61,110 57,106
                  L28,84
                  C23,80 23,74 28,71
                  C30,69 33,68 36,68
                  L64,67
                  C70,66 74,63 76,58
                  L88,24
                  C90,18 95,15 100,18 Z
                "
                fill="url(#starGradMain)"
                filter="url(#starGlow)"
              />

              {/* ── Brillo especular (shine) ── */}
              <path
                d="
                  M100,18
                  C100,18 108,18 112,24
                  L124,58
                  C126,63 130,66 136,67
                  L171,68
                  C177,68 180,72 178,77
                  C176,80 174,82 172,84
                  L145,106
                  C141,110 139,115 141,121
                  L151,156
                  C153,162 149,167 144,165
                  C141,164 139,163 137,161
                  L107,140
                  C103,137 97,137 93,140
                  L63,161
                  C58,164 53,162 51,157
                  C50,154 50,151 51,148
                  L61,121
                  C63,115 61,110 57,106
                  L28,84
                  C23,80 23,74 28,71
                  C30,69 33,68 36,68
                  L64,67
                  C70,66 74,63 76,58
                  L88,24
                  C90,18 95,15 100,18 Z
                "
                fill="url(#starShine)"
                clipPath="url(#starClip)"
              />

              {/* ── Núcleo central pulsante ── */}
              <circle
                cx="100" cy="100" r="18"
                fill="url(#starCore)"
                className={styles.starCore}
              />

              {/* ── Punto de luz central ── */}
              <circle
                cx="100" cy="100" r="4.5"
                fill="white"
                opacity="0.9"
                className={styles.starDot}
              />

              {/* ── Lens flare ── */}
              <ellipse
                cx="72" cy="65" rx="11" ry="6"
                fill="white"
                opacity="0.16"
                transform="rotate(-35, 72, 65)"
              />
              <ellipse
                cx="76" cy="60" rx="4.5" ry="2.5"
                fill="white"
                opacity="0.32"
                transform="rotate(-35, 76, 60)"
              />

              {/* ── Partículas orbitales ── */}
              <circle cx="130" cy="62" r="2.5" fill="#AACCFF" opacity="0.7" className={styles.spark1} />
              <circle cx="140" cy="108" r="1.8" fill="#7755FF" opacity="0.6" className={styles.spark2} />
              <circle cx="58"  cy="124" r="2"   fill="#CCBBFF" opacity="0.5" className={styles.spark3} />

            </svg>
          </div>
        </div>

        <div className={`${styles.container} ${styles.second}`}><div className={styles.marker}></div></div>
        <div className={`${styles.container} ${styles.third}`}><div className={styles.marker}></div></div>
        <div className={`${styles.container} ${styles.seventh}`}><div className={styles.marker}></div></div>
        <div className={`${styles.container} ${styles.eight}`}><div className={styles.marker}></div></div>
        <div className={`${styles.container} ${styles.twelve}`}><div className={styles.marker}></div></div>
        <div className={`${styles.container} ${styles.eighteen}`}><div className={styles.marker}></div></div>

      </div>
    </div>
  );
}