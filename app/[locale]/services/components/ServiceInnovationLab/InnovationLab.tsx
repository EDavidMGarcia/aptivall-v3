"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import styles from "./InnovationLab.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Feature {
  title: string;
  description: string;
  tags: string[];
}

interface ImpactMetric {
  value: number;
  symbol: string;
  label: string;
}

interface ImpactData {
  header: string;
  badge: string;
  metrics: ImpactMetric[];
  description: string;
  button: string;
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

// Iconos SVG para las features (mismos que en la página principal)
const FEATURE_ICONS = [
  <svg key="01" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" />
  </svg>,
  <svg key="02" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>,
  <svg key="03" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 20c0-3-1.8-5.5-4.5-6.5" />
  </svg>,
];

// Icono para impacto (gráfico ascendente) - reemplaza al emoji
const IMPACT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20V10M12 20V4M6 20v-6" />
    <rect x="2" y="2" width="20" height="20" rx="2" />
  </svg>
);

export default function InnovationLab() {
  const t = useTranslations("ServicesPage");
  const sectionRef = useRef<HTMLElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const s1 = t.raw("services.s1");
  const features: Feature[] = s1?.subA?.features || [];
  const keywords: string[] = s1?.subA?.keywords || [];
  const itemsB: string[] = s1?.subB?.items || [];
  const tagsB: string[] = s1?.subB?.tags || [];
  const impact: ImpactData = s1?.impact; // Sin fallback, solo del JSON

  const cleanBadge = s1?.badge || s1?.eyebrow?.replace(/^[0-9]+ ·\s*/, "");

  // --- Cubo 3D (Three.js) ---
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2, 2, 3);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff81,
      emissive: 0x001dff,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const edgesGeo = new THREE.EdgesGeometry(geometry);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x00ff81 });
    const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
    cube.add(wireframe);

    const particleCount = 80;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.6;
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00ff81,
      size: 0.05,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00ff81, 1, 10);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);
    const backLight = new THREE.PointLight(0x001dff, 0.8);
    backLight.position.set(-2, -1, -3);
    scene.add(backLight);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.008;
      cube.rotation.y = time * 0.8;
      cube.rotation.x = Math.sin(time * 0.5) * 0.3;
      cube.rotation.z = Math.cos(time * 0.7) * 0.2;
      particles.rotation.y = time * 0.2;
      particles.rotation.x = time * 0.15;
      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // --- Nube de tags animada (GSAP) ---
  useEffect(() => {
    if (!tagsContainerRef.current) return;
    const items = tagsContainerRef.current.querySelectorAll(`.${styles.tagItem}`);
    if (!items.length) return;
    items.forEach((item) => {
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

  // --- Animación de contadores para el bloque "Impacto en cifras" ---
  useEffect(() => {
    const impactNumbers = document.querySelectorAll(`.${styles.impactNumber}`);
    impactNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute("data-target") || "0", 10);
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const data = { val: 0 };
          gsap.to(data, {
            val: target,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(data.val).toString();
            },
          });
        },
      });
    });
  }, [impact]); // Dependencia en impact, se ejecuta cuando ya está cargado

  // --- Animaciones GSAP de entrada (generales) ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(`.${styles.sectionEyebrow}`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.sectionTitle}`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.sectionDesc}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.subAText}`, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: `.${styles.subATop}`, start: "top 85%" } });
      gsap.fromTo(`.${styles.cubeContainer}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.9, scrollTrigger: { trigger: `.${styles.subATop}`, start: "top 85%" } });
      gsap.fromTo(`.${styles.featureGrid}`, { opacity: 0 }, { opacity: 1, duration: 0.8, scrollTrigger: { trigger: `.${styles.featureGrid}`, start: "top 85%" } });
      gsap.fromTo(`.${styles.subBLeft}`, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: `.${styles.subBContainer}`, start: "top 85%" } });
      gsap.fromTo(`.${styles.impactBox}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.9, scrollTrigger: { trigger: `.${styles.subBContainer}`, start: "top 85%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const formatNumber = (num: number) => (num + 1).toString().padStart(2, "0");

  return (
    <section id="service-1" data-service-section="0" ref={sectionRef} className={styles.innovationLab}>
      <div className={styles.bgNoise} />
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <span className={styles.eyebrowDot} />
            {cleanBadge || "Innovation Lab"}
          </div>
          <h2 className={styles.sectionTitle}>{s1?.title}</h2>
          <p className={styles.sectionDesc}>{s1?.desc}</p>
        </div>

        {/* Subsección A: IA + cubo 3D */}
        <div className={styles.subA}>
          <div className={styles.subATop}>
            <div className={styles.cubeContainer} ref={canvasContainerRef} />
            <div className={styles.subAText}>
              <div className={styles.subLabel}>
                <span className={styles.subLabelLine} />
                <span className={styles.subLabelText}>{s1?.subA?.label}</span>
              </div>
              <h3 className={styles.subTitle}>{renderAccentText(s1?.subA?.title)}</h3>
              <p className={styles.subText}>{renderAccentText(s1?.subA?.text)}</p>
            </div>
          </div>

          {/* Grid estático de feature cards */}
          <div className={styles.featureGrid}>
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
          <div className={styles.tagCloud} ref={tagsContainerRef}>
            {keywords.map((kw, idx) => (
              <span key={idx} className={styles.tagItem}>{kw}</span>
            ))}
          </div>
        </div>

        {/* Subsección B: Software + impacto */}
        <div className={styles.subB}>
          <div className={styles.subLabel}>
            <span className={styles.subLabelLine} />
            <span className={styles.subLabelText}>{s1?.subB?.label}</span>
          </div>
          <div className={styles.subBContainer}>
            <div className={styles.subBLeft}>
              <h3 className={styles.subTitle}>{renderAccentText(s1?.subB?.title)}</h3>
              <p className={styles.subText}>{s1?.subB?.text}</p>
              <ul className={styles.itemsList}>
                {itemsB.map((item, idx) => (
                  <li key={idx}>
                    <span className={styles.itemCheck}>✦</span> {item}
                  </li>
                ))}
              </ul>
              <div className={styles.tagRow}>
                {tagsB.map((tag, idx) => (
                  <span key={idx} className={styles.tagBlue}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Bloque de impacto - solo si existe en el JSON */}
            {impact && (
              <div className={styles.impactBox}>
                <div className={styles.impactHeader}>
                  <div className={styles.impactIconWrapper}>{IMPACT_ICON}</div>
                  <span>{impact.header}</span>
                  <span className={styles.impactBadge}>{impact.badge}</span>
                </div>
                <div className={styles.impactMetrics}>
                  {impact.metrics.map((metric, idx) => (
                    <div key={idx} className={styles.impactMetric}>
                      <span className={styles.impactNumber} data-target={metric.value}>0</span>
                      <span className={styles.impactSymbol}>{metric.symbol}</span>
                      <span className={styles.impactLabel}>{metric.label}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.impactText}>{impact.description}</p>
                <button className={styles.impactButton} onClick={() => window.location.href = "/contacto"}>
                  {impact.button}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}