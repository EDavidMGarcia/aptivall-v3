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
            autoRotate: false, // desactivado para que el orbe siempre esté upright
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

        {/* 💎 Orbe de energía animado */}
        <div className={`${styles.container} ${styles.initial}`}>
          <div className={styles.box}>
            <svg
              className={styles.orbeSvg}
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>

                {/* Gradiente base del orbe */}
                <radialGradient id="orbeBase" cx="38%" cy="30%" r="72%">
                  <stop offset="0%"   stopColor="#C8BAFF" stopOpacity="1" />
                  <stop offset="25%"  stopColor="#7C5CFC" stopOpacity="1" />
                  <stop offset="55%"  stopColor="#2D1FA8" stopOpacity="1" />
                  <stop offset="85%"  stopColor="#0A0840" stopOpacity="1" />
                  <stop offset="100%" stopColor="#000318" stopOpacity="1" />
                </radialGradient>

                {/* Destello especular superior-izquierdo */}
                <radialGradient id="orbeShine" cx="32%" cy="24%" r="38%">
                  <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.75" />
                  <stop offset="60%"  stopColor="#A090FF" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#A090FF" stopOpacity="0" />
                </radialGradient>

                {/* Núcleo brillante central */}
                <radialGradient id="orbeCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.9" />
                  <stop offset="40%"  stopColor="#8B6FFF" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3B1FCC" stopOpacity="0" />
                </radialGradient>

                {/* Anillo exterior */}
                <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="60%"  stopColor="#5533FF" stopOpacity="0" />
                  <stop offset="80%"  stopColor="#7755FF" stopOpacity="0.6" />
                  <stop offset="90%"  stopColor="#AACCFF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#5533FF" stopOpacity="0" />
                </radialGradient>

                {/* Glow exterior */}
                <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Glow suave para el anillo */}
                <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Máscara circular para el orbe */}
                <clipPath id="orbeClip">
                  <circle cx="80" cy="80" r="54" />
                </clipPath>

              </defs>

              {/* ── Halo exterior difuso ── */}
              <circle
                cx="80" cy="80" r="72"
                fill="none"
                stroke="#5533FF"
                strokeWidth="18"
                opacity="0.08"
                filter="url(#outerGlow)"
              />

              {/* ── Anillo orbital inclinado ── */}
              <ellipse
                cx="80" cy="80"
                rx="68" ry="18"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="1.5"
                transform="rotate(-22, 80, 80)"
                filter="url(#ringGlow)"
                className={styles.orbeRing}
              />

              {/* ── Segundo anillo, eje diferente ── */}
              <ellipse
                cx="80" cy="80"
                rx="62" ry="14"
                fill="none"
                stroke="#88AAFF"
                strokeWidth="0.8"
                strokeDasharray="4 8"
                transform="rotate(58, 80, 80)"
                opacity="0.45"
                className={styles.orbeRing2}
              />

              {/* ── Cuerpo principal del orbe ── */}
              <circle
                cx="80" cy="80" r="54"
                fill="url(#orbeBase)"
                filter="url(#outerGlow)"
              />

              {/* ── Capa de brillo especular ── */}
              <circle
                cx="80" cy="80" r="54"
                fill="url(#orbeShine)"
                clipPath="url(#orbeClip)"
              />

              {/* ── Núcleo interno pulsante ── */}
              <circle
                cx="80" cy="80" r="22"
                fill="url(#orbeCore)"
                className={styles.orbeCore}
              />

              {/* ── Punto de luz central ── */}
              <circle
                cx="80" cy="80" r="5"
                fill="white"
                opacity="0.9"
                className={styles.orbeDot}
              />

              {/* ── Destello de lente (lens flare) ── */}
              <ellipse
                cx="58" cy="58" rx="10" ry="6"
                fill="white"
                opacity="0.18"
                transform="rotate(-35, 58, 58)"
              />
              <ellipse
                cx="62" cy="55" rx="4" ry="2.5"
                fill="white"
                opacity="0.35"
                transform="rotate(-35, 62, 55)"
              />

              {/* ── Partícula de brillo pequeña ── */}
              <circle cx="104" cy="52" r="2.5" fill="#AACCFF" opacity="0.7" className={styles.spark1} />
              <circle cx="112" cy="88" r="1.8" fill="#7755FF" opacity="0.6" className={styles.spark2} />
              <circle cx="48"  cy="100" r="2"  fill="#CCBBFF" opacity="0.5" className={styles.spark3} />

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