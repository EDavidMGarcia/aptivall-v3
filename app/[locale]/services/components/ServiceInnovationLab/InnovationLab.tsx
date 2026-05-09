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

  const cleanBadge = s1?.badge || s1?.eyebrow?.replace(/^[0-9]+ ·\s*/, "");

  // --- Cubo isométrico 3D con Three.js ---
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Escena, cámara, renderizador
    const scene = new THREE.Scene();
    scene.background = null; // transparente

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2, 2, 3);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // fondo transparente
    container.appendChild(renderer.domElement);

    // Crear cubo con aristas brillantes
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

    // Aristas resaltadas (edges)
    const edgesGeo = new THREE.EdgesGeometry(geometry);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x00ff81, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
    cube.add(wireframe);

    // Partículas alrededor del cubo (nodos de datos)
    const particleCount = 80;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Posiciones en una esfera de radio 1.6
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

    // Luz ambiental y puntual
    const ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00ff81, 1, 10);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);
    const backLight = new THREE.PointLight(0x001dff, 0.8);
    backLight.position.set(-2, -1, -3);
    scene.add(backLight);

    // Animación
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

    // Resize observer para ajustar el canvas
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
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // --- Nube de tags con movimiento orgánico ---
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

  // --- Dashboard de gamificación (sin cambios) ---
  const [gamificationStats, setGamificationStats] = useState({
    activeUsers: 1247,
    pointsGenerated: 28400,
    levelsCompleted: 342,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setGamificationStats({
        activeUsers: Math.floor(Math.random() * 1500) + 800,
        pointsGenerated: Math.floor(Math.random() * 50000) + 15000,
        levelsCompleted: Math.floor(Math.random() * 600) + 200,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // --- Animaciones GSAP de entrada ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(`.${styles.sectionEyebrow}`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.sectionTitle}`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.sectionDesc}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } });
      gsap.fromTo(`.${styles.subAText}`, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: `.${styles.subATop}`, start: "top 85%" } });
      gsap.fromTo(`.${styles.cubeContainer}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.9, scrollTrigger: { trigger: `.${styles.subATop}`, start: "top 85%" } });
      gsap.utils.toArray<HTMLElement>(`.${styles.featureCard}`).forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 50, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: i * 0.1, scrollTrigger: { trigger: card, start: "top 88%" } });
      });
      gsap.fromTo(`.${styles.subBLeft}`, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: `.${styles.subBContainer}`, start: "top 85%" } });
      gsap.fromTo(`.${styles.dashboard}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.9, scrollTrigger: { trigger: `.${styles.subBContainer}`, start: "top 85%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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
            {/* Cubo a la izquierda */}
            <div className={styles.cubeContainer} ref={canvasContainerRef} />

            {/* Texto a la derecha */}
            <div className={styles.subAText}>
              <div className={styles.subLabel}>
                <span className={styles.subLabelLine} />
                <span className={styles.subLabelText}>{s1?.subA?.label}</span>
              </div>
              <h3 className={styles.subTitle}>{renderAccentText(s1?.subA?.title)}</h3>
              <p className={styles.subText}>{renderAccentText(s1?.subA?.text)}</p>
            </div>
          </div>

          <div className={styles.featureGrid}>
            {features.map((feature, idx) => (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  {idx === 0 && "🤖"}
                  {idx === 1 && "👁️"}
                  {idx === 2 && "🎬"}
                </div>
                <h4 className={styles.featureTitle}>{feature.title}</h4>
                <p className={styles.featureDesc}>{feature.description}</p>
                <div className={styles.featureTags}>
                  {feature.tags?.slice(0, 2).map((tag, tidx) => (
                    <span key={tidx} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.tagCloud} ref={tagsContainerRef}>
            {keywords.map((kw, idx) => (
              <span key={idx} className={styles.tagItem}>{kw}</span>
            ))}
          </div>
        </div>

        {/* Subsección B: Software + Dashboard */}
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
                  <li key={idx}><span className={styles.itemCheck}>✦</span> {item}</li>
                ))}
              </ul>
              <div className={styles.tagRow}>
                {tagsB.map((tag, idx) => (
                  <span key={idx} className={styles.tagBlue}>{tag}</span>
                ))}
              </div>
            </div>
            <div className={styles.dashboard}>
              <div className={styles.dashboardHeader}>
                <span>📊 Gamification Core</span>
                <span className={styles.dashboardStatus}>● LIVE</span>
              </div>
              <div className={styles.dashboardMetric}>
                <span>Active users</span>
                <strong>{gamificationStats.activeUsers}</strong>
              </div>
              <div className={styles.dashboardMetric}>
                <span>Points generated</span>
                <strong>{gamificationStats.pointsGenerated.toLocaleString()}</strong>
              </div>
              <div className={styles.dashboardMetric}>
                <span>Levels completed</span>
                <strong>{gamificationStats.levelsCompleted}</strong>
              </div>
              <div className={styles.dashboardProgress}>
                <div className={styles.progressLabel}>Engagement rate</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: "78%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}