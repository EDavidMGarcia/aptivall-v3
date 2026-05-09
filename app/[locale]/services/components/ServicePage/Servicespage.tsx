"use client";

import { useEffect, useRef } from "react";
import styles from "./Servicespage.module.css";

// ─── GSAP is loaded globally in the project ─────────────────────────────────
// Assumes gsap + ScrollTrigger are available as globals or imported at app level.
// If your project uses: import gsap from 'gsap' and ScrollTrigger, adjust accordingly.

export default function ServicesPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const initGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");
      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

      // ── Hero entrance ──────────────────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        `.${styles.heroEyebrow}`,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7 }
      )
        .fromTo(
          `.${styles.heroTitle}`,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.4"
        )
        .fromTo(
          `.${styles.heroSubtitle}`,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          `.${styles.heroStar}`,
          { opacity: 0, scale: 0.5, rotation: -20 },
          { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: "back.out(1.4)" },
          "-=0.8"
        );

      // ── Star floating loop ─────────────────────────────────────────────────
      gsap.to(`.${styles.heroStar}`, {
        y: -18,
        rotation: 8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ── Sticky service nav highlight on scroll ─────────────────────────────
      const sections = document.querySelectorAll("[data-service-section]");
      const navItems = document.querySelectorAll(`.${styles.stickyNavItem}`);

      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => highlightNav(i, navItems),
          onEnterBack: () => highlightNav(i, navItems),
        });
      });

      // ── Section title reveals ──────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(`.${styles.sectionEyebrow}`).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(`.${styles.sectionTitle}`).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      // ── Card stack / staggered reveal for feature cards ───────────────────
      gsap.utils.toArray<HTMLElement>(`.${styles.featureCard}`).forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            delay: (i % 3) * 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });

      // ── Infinite slider (service 1 tags) ──────────────────────────────────
      const sliders = document.querySelectorAll(`.${styles.infiniteTrack}`);
      sliders.forEach((slider) => {
        const items = slider.querySelectorAll(`.${styles.sliderItem}`);
        const totalWidth = Array.from(items).reduce(
          (acc, item) => acc + (item as HTMLElement).offsetWidth + 24,
          0
        );
        gsap.to(slider, {
          x: -totalWidth / 2,
          duration: 20,
          repeat: -1,
          ease: "none",
          modifiers: {
            x: gsap.utils.unitize((x: number) => parseFloat(x) % (totalWidth / 2)),
          },
        });
      });

      // ── MotionPath waypoints for the decorative orbit ─────────────────────
      const orbitDot = document.querySelector(`.${styles.orbitDot}`);
      if (orbitDot) {
        gsap.to(orbitDot, {
          duration: 12,
          repeat: -1,
          ease: "none",
          motionPath: {
            path: `M 120,0 C 120,66 66,120 0,120 C -66,120 -120,66 -120,0 C -120,-66 -66,-120 0,-120 C 66,-120 120,-66 120,0`,
            autoRotate: true,
            alignOrigin: [0.5, 0.5],
          },
        });
      }

      // ── Talent grid cards stagger ─────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(`.${styles.talentCard}`).forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: (i % 4) * 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 90%" },
          }
        );
      });

      // ── Number counters ───────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(`.${styles.statNumber}`).forEach((el) => {
        const target = parseInt(el.getAttribute("data-target") || "0", 10);
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              { val: 0 },
              { val: target, duration: 1.8, ease: "power2.out", onUpdate: function () {
                  el.textContent = Math.round((this as any).targets()[0].val) + (el.getAttribute("data-suffix") || "");
                }
              }
            );
          },
        });
      });
    };

    initGSAP();
  }, []);

  return (
    <main className={styles.page}>
      {/* ════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════ */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroBg}>
          <div className={styles.heroBgGlow1} />
          <div className={styles.heroBgGlow2} />
          <div className={styles.heroGrid} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <span className={styles.heroEyebrow}>
              <span className={styles.eyebrowDot} />
              Servicios
            </span>
            <h1 className={styles.heroTitle}>
              Soluciones Diseñadas para{" "}
              <span className={styles.heroHighlight}>Escalar</span>{" "}
              su Negocio
            </h1>
            <p className={styles.heroSubtitle}>
              Integramos tecnología, talento y estrategia para transformar
              organizaciones en líderes de su industria.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.statNumber} data-target="50" data-suffix="+">0+</span>
                <span className={styles.statLabel}>proyectos</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.statNumber} data-target="4" data-suffix="">0</span>
                <span className={styles.statLabel}>pilares de servicio</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.statNumber} data-target="100" data-suffix="%">0%</span>
                <span className={styles.statLabel}>resultados medibles</span>
              </div>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroStarWrapper}>
              <div className={styles.orbitRing}>
                <div className={styles.orbitDot} />
              </div>
              <img
                src="/star.png"
                alt="Aptivall Star"
                className={styles.heroStar}
                onError={(e) => {
                  // Fallback star if image missing
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className={styles.starGlowHero} />
              {/* Fallback SVG star */}
              <div className={styles.starFallback}>
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60 5L73 40L110 40L80 62L92 97L60 76L28 97L40 62L10 40L47 40Z" fill="url(#sg)" opacity="0.9"/>
                  <defs>
                    <radialGradient id="sg" cx="50%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#7CFFC4"/>
                      <stop offset="60%" stopColor="#3B82F6"/>
                      <stop offset="100%" stopColor="#1E40AF"/>
                    </radialGradient>
                  </defs>
                </svg>
                <div className={styles.starGlow} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick-jump nav */}
        <div className={styles.heroJumpNav}>
          {["Innovation Lab", "EdTech Studio", "Global Talent", "Digital Media"].map((label, i) => (
            <a key={i} href={`#service-${i + 1}`} className={styles.jumpNavItem}>
              <span className={styles.jumpNavNum}>0{i + 1}</span>
              <span className={styles.jumpNavLabel}>{label}</span>
              <span className={styles.jumpNavArrow}>↓</span>
            </a>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          STICKY SIDE NAV
      ════════════════════════════════════════════════ */}
      <nav className={styles.stickyNav} ref={navRef} aria-label="Service sections">
        {[
          { label: "Innovation Lab", num: "01" },
          { label: "EdTech Studio", num: "02" },
          { label: "Global Talent", num: "03" },
          { label: "Digital Media", num: "04" },
        ].map((item, i) => (
          <a key={i} href={`#service-${i + 1}`} className={styles.stickyNavItem} data-index={i}>
            <span className={styles.stickyNavNum}>{item.num}</span>
            <span className={styles.stickyNavLabel}>{item.label}</span>
            <span className={styles.stickyNavBar} />
          </a>
        ))}
      </nav>

      {/* ════════════════════════════════════════════════
          SERVICE 1 — INNOVATION LAB
      ════════════════════════════════════════════════ */}
      <section
        id="service-1"
        data-service-section="0"
        className={`${styles.serviceSection} ${styles.serviceSectionAlt}`}
      >
        <div className={styles.sectionGlowLeft} />
        <div className={styles.sectionInner}>
          {/* Header */}
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>
              <span className={styles.eyebrowDot} />
              01 · Innovation Lab
            </span>
            <h2 className={styles.sectionTitle}>
              IA, Visión Computacional{" "}
              <span className={styles.highlight}>&amp; Software</span>
            </h2>
            <p className={styles.sectionDesc}>
              Desarrollamos soluciones de IA con modelos de video para
              identificación de objetos y AI Agents con razonamiento lógico.
              Nuestra tecnología no solo automatiza, sino que optimiza
              procesos críticos.
            </p>
          </div>

          {/* Sub-section A: IA */}
          <div className={styles.subSection} id="service-1a">
            <div className={styles.subSectionLabel}>
              <span className={styles.subLabelLine} />
              <span>A — Inteligencia Artificial y Automatización</span>
            </div>
            <h3 className={styles.subSectionTitle}>
              Inteligencia Artificial que Resuelve{" "}
              <span className={styles.highlightGreen}>Desafíos Reales</span>
            </h3>
            <p className={styles.subSectionText}>
              Nuestra tecnología se centra en la automatización de tareas de
              alto valor. Implementamos flujos de trabajo inteligentes con
              herramientas líderes como <strong>n8n</strong> para la
              orquestación, e integramos modelos como{" "}
              <strong>Microsoft Copilot</strong> y <strong>Claude</strong>{" "}
              para dotar a los sistemas de razonamiento avanzado.
            </p>

            {/* Feature cards — 3 cols */}
            <div className={styles.featureGrid}>
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  ),
                  num: "01",
                  title: "Agentes Autónomos y Robots de Tareas",
                  text: "Implementamos flujos con n8n, Copilot y Claude para gestionar ciclos completos: reclutamiento, servicio al cliente y análisis de datos sin intervención humana.",
                  tags: ["AI Agents", "n8n", "Copilot", "Claude"],
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  ),
                  num: "02",
                  title: "Visión Computacional en Tiempo Real",
                  text: "Integramos IA con sistemas CCTV existentes para análisis en tiempo real: detección de anomalías en producción, análisis de comportamiento e inventario físico.",
                  tags: ["Visión Computacional", "CCTV/IA", "Tiempo Real"],
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375z" />
                    </svg>
                  ),
                  num: "03",
                  title: "Creación de Video con LLM",
                  text: "Utilizamos los últimos LLMs e IA generativa para la producción automatizada de videos corporativos y de marketing, acelerando el time-to-market de contenidos.",
                  tags: ["Video IA", "LLM", "IA Generativa"],
                },
              ].map((card, i) => (
                <div key={i} className={styles.featureCard}>
                  <div className={styles.featureCardHeader}>
                    <div className={styles.featureCardIcon}>{card.icon}</div>
                    <span className={styles.featureCardNum}>{card.num}</span>
                  </div>
                  <h4 className={styles.featureCardTitle}>{card.title}</h4>
                  <p className={styles.featureCardText}>{card.text}</p>
                  <div className={styles.featureCardTags}>
                    {card.tags.map((tag, j) => (
                      <span key={j} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infinite keyword slider */}
          <div className={styles.infiniteSliderWrapper}>
            <div className={styles.infiniteTrack}>
              {[
                "AI Agents corporativos",
                "Automatización autónoma",
                "n8n Orchestration",
                "Visión Computacional",
                "IA en Recursos Humanos",
                "Microsoft Copilot",
                "Claude AI",
                "Robots de Tareas",
                "Análisis CCTV",
                "Video IA con LLM",
                "AI Agents corporativos",
                "Automatización autónoma",
                "n8n Orchestration",
                "Visión Computacional",
                "IA en Recursos Humanos",
                "Microsoft Copilot",
                "Claude AI",
                "Robots de Tareas",
                "Análisis CCTV",
                "Video IA con LLM",
              ].map((kw, i) => (
                <span key={i} className={styles.sliderItem}>
                  <span className={styles.sliderDot} />
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Sub-section B: Software & Games */}
          <div className={`${styles.subSection} ${styles.subSectionReverse}`} id="service-1b">
            <div className={styles.subSectionLabel}>
              <span className={styles.subLabelLine} />
              <span>B — Ingeniería de Software y Videojuegos Corporativos</span>
            </div>
            <div className={styles.splitLayout}>
              <div className={styles.splitLeft}>
                <h3 className={styles.subSectionTitle}>
                  Software de Alto Impacto y{" "}
                  <span className={styles.highlightBlue}>Gamificación B2B</span>
                </h3>
                <p className={styles.subSectionText}>
                  Creamos ecosistemas digitales escalables y videojuegos para
                  empresas que buscan transformar el compromiso de su audiencia
                  interna y externa. Incluye juegos corporativos completos,
                  casuales para engagement masivo, advergaming inmersivo y
                  recursos gamificados (badges, puntos, rankings) para
                  upskilling y retención del conocimiento.
                </p>
                <div className={styles.tagRow}>
                  {["Desarrollo a medida", "Videojuegos corporativos", "Advergaming", "Gamificación B2B", "Recursos gamificados"].map((t, i) => (
                    <span key={i} className={styles.tagBlue}>{t}</span>
                  ))}
                </div>
              </div>
              <div className={styles.splitRight}>
                <div className={styles.gameCardsStack}>
                  {[
                    { label: "Juegos Corporativos", icon: "🎮", color: "#3B82F6" },
                    { label: "Advergaming", icon: "📡", color: "#22D3EE" },
                    { label: "Gamificación B2B", icon: "🏆", color: "#4ADE80" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={styles.gameCard}
                      style={{
                        transform: `translateY(${i * -8}px) translateX(${i * 4}px)`,
                        zIndex: 3 - i,
                        "--card-color": item.color,
                      } as React.CSSProperties}
                    >
                      <span className={styles.gameCardIcon}>{item.icon}</span>
                      <span className={styles.gameCardLabel}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SERVICE 2 — EDTECH STUDIO
      ════════════════════════════════════════════════ */}
      <section
        id="service-2"
        data-service-section="1"
        className={styles.serviceSection}
      >
        <div className={styles.sectionGlowRight} />
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>
              <span className={styles.eyebrowDot} />
              02 · EdTech Studio
            </span>
            <h2 className={styles.sectionTitle}>
              Ecosistemas de{" "}
              <span className={styles.highlight}>Aprendizaje</span>
            </h2>
            <p className={styles.sectionDesc}>
              Como partners de Open edX, construimos plataformas e-learning de
              grado empresarial con diseño instruccional y tecnología de
              vanguardia para sectores de alta complejidad.
            </p>
          </div>

          {/* Sub-section A */}
          <div className={styles.subSection} id="service-2a">
            <div className={styles.subSectionLabel}>
              <span className={styles.subLabelLine} />
              <span>A — Transformación del Capital Humano</span>
            </div>
            <h3 className={styles.subSectionTitle}>
              EdTech de Élite para{" "}
              <span className={styles.highlightGreen}>Capital Humano</span>
            </h3>

            {/* 4-step process */}
            <div className={styles.processFlow}>
              {[
                {
                  step: "01",
                  title: "Diseño Instruccional Quirúrgico",
                  text: "Articulamos cada tema en objetivos de aprendizaje medibles. No digitalizamos; reingenierizamos la experiencia.",
                  icon: "✦",
                },
                {
                  step: "02",
                  title: "Ecosistema de Inmersión Total",
                  text: "Objetos interactivos con H5P.org, autoevaluaciones en tiempo real, videolecciones y recursos lúdicos para retención superior.",
                  icon: "◈",
                },
                {
                  step: "03",
                  title: "Gamificación & Realidad Aumentada",
                  text: "Convertimos diapositivas estáticas en experiencias de conexión emocional profunda. Aprendizaje memorable y motivador.",
                  icon: "⬡",
                },
                {
                  step: "04",
                  title: "Métricas Avanzadas",
                  text: "Análisis granular más allá de las tasas de finalización. Identificamos quiénes absorbieron mejor los contenidos.",
                  icon: "◎",
                },
              ].map((step, i) => (
                <div key={i} className={styles.processStep}>
                  <div className={styles.processStepNum}>{step.step}</div>
                  <div className={styles.processStepIcon}>{step.icon}</div>
                  <div className={styles.processConnector} />
                  <h4 className={styles.processStepTitle}>{step.title}</h4>
                  <p className={styles.processStepText}>{step.text}</p>
                </div>
              ))}
            </div>

            {/* Case studies */}
            <div className={styles.caseStudyRow}>
              <div className={styles.caseStudyCard}>
                <div className={styles.caseStudyBadge}>Caso de Éxito</div>
                <div className={styles.caseStudyClient}>Universidad del Norte</div>
                <h4 className={styles.caseStudyTitle}>Seguridad Industrial Gamificada</h4>
                <p className={styles.caseStudyText}>
                  Cursos gamificados de alto impacto en SST que transformaron
                  la capacitación en una experiencia interactiva. Resultado:
                  índices de retención y compromiso del personal significativamente elevados.
                </p>
                <div className={styles.caseStudyTags}>
                  <span className={styles.tag}>Gamificación</span>
                  <span className={styles.tag}>SST</span>
                  <span className={styles.tag}>Open edX</span>
                </div>
              </div>
              <div className={styles.caseStudyCard}>
                <div className={styles.caseStudyBadge}>Caso de Éxito</div>
                <div className={styles.caseStudyClient}>Pfizer</div>
                <h4 className={styles.caseStudyTitle}>Educación Médica Continua</h4>
                <p className={styles.caseStudyText}>
                  Personalización integral del LMS corporativo con diseño
                  instruccional de vanguardia para nuevas tecnologías de
                  tratamiento cardiovascular y oncológico.
                </p>
                <div className={styles.caseStudyTags}>
                  <span className={styles.tag}>LMS B2B</span>
                  <span className={styles.tag}>H5P</span>
                  <span className={styles.tag}>Cardiología</span>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className={styles.infiniteSliderWrapper}>
              <div className={styles.infiniteTrack}>
                {[
                  "Plataformas e-learning B2B",
                  "Open edX Partner",
                  "Capacitación Médica Online",
                  "Interactividad H5P",
                  "Gamificación B2B",
                  "Realidad Aumentada",
                  "Diseño Instruccional",
                  "Métricas Avanzadas",
                  "Plataformas e-learning B2B",
                  "Open edX Partner",
                  "Capacitación Médica Online",
                  "Interactividad H5P",
                  "Gamificación B2B",
                  "Realidad Aumentada",
                  "Diseño Instruccional",
                  "Métricas Avanzadas",
                ].map((kw, i) => (
                  <span key={i} className={styles.sliderItem}>
                    <span className={styles.sliderDot} />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SERVICE 3 — GLOBAL TALENT
      ════════════════════════════════════════════════ */}
      <section
        id="service-3"
        data-service-section="2"
        className={`${styles.serviceSection} ${styles.serviceSectionAlt}`}
      >
        <div className={styles.sectionGlowLeft} />
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>
              <span className={styles.eyebrowDot} />
              03 · Global Talent
            </span>
            <h2 className={styles.sectionTitle}>
              Talento de{" "}
              <span className={styles.highlight}>Alto Impacto</span>
            </h2>
            <p className={styles.sectionDesc}>
              Ofrecemos staff augmentation offshore con profesionales senior
              en IT y Marketing en Latinoamérica. Una red de Gerentes de
              Proyectos especializados en iniciativas de alto impacto.
            </p>
          </div>

          {/* Talent grid */}
          <div className={styles.talentCategories}>
            {[
              {
                category: "Ingeniería y Desarrollo",
                color: "#3B82F6",
                profiles: [
                  { title: "Desarrolladores Full Stack Senior", desc: "React, Node.js, Python — entornos de alta escalabilidad", icon: "</>" },
                  { title: "AI/ML Engineers", desc: "Visión Computacional, Modelos de Video, AI Agents corporativos", icon: "⚡" },
                  { title: "DevOps / Cloud Engineers", desc: "AWS, GCP y Azure — gestión de infraestructura crítica", icon: "☁️" },
                  { title: "Diseñadores Instruccionales", desc: "Open edX, experiencias gamificadas y LMS enterprise", icon: "📐" },
                ],
              },
              {
                category: "Gerencia de Proyectos (PMO)",
                color: "#4ADE80",
                profiles: [
                  { title: "Project Managers Senior PMP/PMI", desc: "Metodologías ágiles y tradicionales para proyectos complejos", icon: "🎯" },
                  { title: "Scrum Masters y Agile Coaches", desc: "Adopción de prácticas ágiles y optimización de equipos", icon: "🔄" },
                ],
              },
              {
                category: "Marketing y Medios Digitales",
                color: "#22D3EE",
                profiles: [
                  { title: "Content Strategists B2B", desc: "Contenido técnico y narrativas de valor para audiencias corporativas", icon: "✍️" },
                  { title: "Video Editors y Motion Designers", desc: "Post-producción profesional y animación 2D/3D", icon: "🎬" },
                  { title: "Especialistas SEO/SEM Senior", desc: "Visibilidad y performance de campañas de marketing digital", icon: "📈" },
                ],
              },
            ].map((cat, ci) => (
              <div key={ci} className={styles.talentCategory}>
                <div
                  className={styles.talentCategoryHeader}
                  style={{ "--cat-color": cat.color } as React.CSSProperties}
                >
                  <span className={styles.talentCategoryDot} />
                  <h3 className={styles.talentCategoryTitle}>{cat.category}</h3>
                </div>
                <div className={styles.talentGrid}>
                  {cat.profiles.map((profile, pi) => (
                    <div key={pi} className={styles.talentCard}>
                      <span className={styles.talentCardIcon}>{profile.icon}</span>
                      <h4 className={styles.talentCardTitle}>{profile.title}</h4>
                      <p className={styles.talentCardDesc}>{profile.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Keywords slider */}
          <div className={styles.infiniteSliderWrapper}>
            <div className={styles.infiniteTrack}>
              {[
                "Staff Augmentation IT",
                "Gerencia de Proyectos Offshore",
                "Project Managers PMP",
                "Desarrolladores Offshore",
                "Ingenieros AI Remotos",
                "Scrum Master Offshore",
                "Diseño Instruccional Remoto",
                "Full Stack Senior",
                "Staff Augmentation IT",
                "Gerencia de Proyectos Offshore",
                "Project Managers PMP",
                "Desarrolladores Offshore",
                "Ingenieros AI Remotos",
                "Scrum Master Offshore",
                "Diseño Instruccional Remoto",
                "Full Stack Senior",
              ].map((kw, i) => (
                <span key={i} className={styles.sliderItem}>
                  <span className={styles.sliderDot} />
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SERVICE 4 — DIGITAL MEDIA
      ════════════════════════════════════════════════ */}
      <section
        id="service-4"
        data-service-section="3"
        className={styles.serviceSection}
      >
        <div className={styles.sectionGlowRight} />
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>
              <span className={styles.eyebrowDot} />
              04 · Digital Media
            </span>
            <h2 className={styles.sectionTitle}>
              Contenido Audiovisual y{" "}
              <span className={styles.highlight}>Webs B2B</span>
            </h2>
            <p className={styles.sectionDesc}>
              Producción de videos corporativos, animación 2D/3D y efectos
              especiales. Desarrollo de sitios web con enfoque en CRO,
              arquitectura SEO-friendly e integración con CRM.
            </p>
          </div>

          {/* Two sub-sections */}
          <div className={styles.mediaGrid}>
            {/* A — Video & Animation */}
            <div className={styles.mediaBlock} id="service-4a">
              <div className={styles.subSectionLabel}>
                <span className={styles.subLabelLine} />
                <span>A — Video, Animación y Post-Producción</span>
              </div>
              <h3 className={styles.subSectionTitle}>
                Contenido Audiovisual de Alto Impacto para el Sector{" "}
                <span className={styles.highlightBlue}>B2B</span>
              </h3>
              <p className={styles.subSectionText}>
                Desarrollamos y producimos productos de marketing audiovisual
                que consolidan su mensaje corporativo. Videos explicativos,
                corporativos, animación 2D/3D, edición avanzada y efectos
                especiales que garantizan comunicación clara, dinámica y
                memorable para tomadores de decisiones.
              </p>
              <div className={styles.mediaFeatureList}>
                {[
                  "Videos corporativos profesionales",
                  "Videos explicativos y animados",
                  "Animación 2D / 3D",
                  "Efectos especiales (VFX)",
                  "Post-producción avanzada",
                  "Contenido de marketing audiovisual",
                ].map((item, i) => (
                  <div key={i} className={styles.mediaFeatureItem}>
                    <span className={styles.mediaFeatureCheck}>✦</span>
                    {item}
                  </div>
                ))}
              </div>
              <div className={styles.tagRow}>
                {["Video Corporativo", "Animación 3D", "VFX", "Post-Producción"].map((t, i) => (
                  <span key={i} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>

            {/* B — Web & Digital */}
            <div className={styles.mediaBlock} id="service-4b">
              <div className={styles.subSectionLabel}>
                <span className={styles.subLabelLine} />
                <span>B — Webs y Diseño Digital Estratégico</span>
              </div>
              <h3 className={styles.subSectionTitle}>
                Desarrollo de Experiencias Web de Alto Rendimiento{" "}
                <span className={styles.highlightGreen}>B2B</span>
              </h3>
              <p className={styles.subSectionText}>
                Creamos sitios web corporativos y landing pages que son la
                columna vertebral de su estrategia digital. Diseño centrado en
                la conversión (CRO), arquitectura SEO-friendly e integración
                con CRM para que su presencia online impulse resultados
                medibles.
              </p>
              <div className={styles.webMetrics}>
                {[
                  { label: "CRO", desc: "Diseño centrado en conversión" },
                  { label: "SEO", desc: "Arquitectura SEO-friendly" },
                  { label: "CRM", desc: "Integración completa" },
                ].map((m, i) => (
                  <div key={i} className={styles.webMetricCard}>
                    <span className={styles.webMetricLabel}>{m.label}</span>
                    <span className={styles.webMetricDesc}>{m.desc}</span>
                  </div>
                ))}
              </div>
              <div className={styles.tagRow}>
                {["Webs B2B", "Landing Pages", "SEO", "CRO & CRM"].map((t, i) => (
                  <span key={i} className={styles.tagBlue}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Keywords slider */}
          <div className={styles.infiniteSliderWrapper}>
            <div className={styles.infiniteTrack}>
              {[
                "Producción de Videos Corporativos",
                "Videos Explicativos",
                "Animación Profesional",
                "Efectos Especiales",
                "Creación de Webs B2B",
                "Diseño Web Corporativo",
                "Landing Pages",
                "SEO Web",
                "Producción de Videos Corporativos",
                "Videos Explicativos",
                "Animación Profesional",
                "Efectos Especiales",
                "Creación de Webs B2B",
                "Diseño Web Corporativo",
                "Landing Pages",
                "SEO Web",
              ].map((kw, i) => (
                <span key={i} className={styles.sliderItem}>
                  <span className={styles.sliderDot} />
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════════════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg}>
          <div className={styles.ctaGlow} />
        </div>
        <div className={styles.ctaInner}>
          <span className={styles.sectionEyebrow}>
            <span className={styles.eyebrowDot} />
            Siguiente Paso
          </span>
          <h2 className={styles.ctaTitle}>
            ¿Listo para el siguiente{" "}
            <span className={styles.highlight}>nivel?</span>
          </h2>
          <p className={styles.ctaText}>
            Su visión merece un aliado que domine la complejidad. En Aptivall,
            convertimos su estrategia en tecnología de vanguardia.
          </p>
          <div className={styles.ctaButtons}>
            <a href="/contacto" className={styles.ctaBtnPrimary}>
              Iniciar Consultoría Estratégica
              <span className={styles.ctaBtnArrow}>→</span>
            </a>
            <a href="/#service-1" className={styles.ctaBtnSecondary}>
              Ver todos los servicios
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Helper ────────────────────────────────────────────────────────────────
function highlightNav(index: number, items: NodeListOf<Element>) {
  items.forEach((item, i) => {
    if (i === index) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}