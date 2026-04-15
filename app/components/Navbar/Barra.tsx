"use client";

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, memo } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import styles from "./Barra.module.css";
import { gsap } from "gsap";

const Navbar: React.FC = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Navbar");

  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("inicio");

  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  // --- 1. Lógica de Resaltado (Intersection Observer) ---
  useEffect(() => {
    const sections = ["inicio", "sobre", "servicios", "contacto"];
    
    // Ajustamos el rootMargin para que el cambio de color ocurra 
    // justo cuando la sección toca la parte inferior de la navbar (72px)
    const observerOptions = {
      root: null,
      rootMargin: "-72px 0px -70% 0px", 
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  // --- 2. Animaciones GSAP ---
  useLayoutEffect(() => {
    if (!navRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(navRef.current, { y: 0, opacity: 1, duration: 0.8 })
        .to(linksRef.current?.querySelectorAll("li") || [],
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, "-=0.4");
    });
    return () => ctx.revert();
  }, [locale]);

  // --- 3. Detección de Scroll ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 4. FUNCIÓN DE SCROLL LIMPIA (Usa el CSS scroll-margin-top) ---
  const scrollToSection = useCallback((sectionId: string) => {
    setIsOpen(false);
    
    if (pathname === `/${locale}`) {
      const section = document.getElementById(sectionId);
      if (section) {
        // IMPORTANTE: Al usar scrollIntoView con "start", 
        // el navegador leerá el 'scroll-margin-top: 72px' de tu CSS
        // y lo dejará perfecto sin cálculos manuales.
        section.scrollIntoView({
          behavior: "smooth",
          block: "start" 
        });
      }
    } else {
      router.push(`/${locale}#${sectionId}`);
    }
  }, [pathname, locale, router]);

  return (
    <nav ref={navRef} className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}>
      <div className={styles.navContainer}>
        <div className={styles.logoWrapper} onClick={() => scrollToSection("inicio")}>
          <Image src="/icons/aptiLogo.svg" alt="Aptivall" width={140} height={35} priority className={styles.logo} />
        </div>

        <button className={`${styles.hamburger} ${isOpen ? styles.open : ""}`} onClick={() => setIsOpen(!isOpen)}>
          <span /><span /><span />
        </button>

        <ul ref={linksRef} className={`${styles.navLinks} ${isOpen ? styles.active : ""}`}>
          <li>
            <button 
              className={`${styles.navItem} ${activeSection === "inicio" ? styles.active : ""}`} 
              onClick={() => scrollToSection("inicio")}
            >
              {t("inicio")}
            </button>
          </li>
          <li>
            <button 
              className={`${styles.navItem} ${activeSection === "sobre" ? styles.active : ""}`} 
              onClick={() => scrollToSection("sobre")}
            >
              {t("sobre")}
            </button>
          </li>
          <li>
            <button 
              className={`${styles.navItem} ${activeSection === "servicios" ? styles.active : ""}`} 
              onClick={() => scrollToSection("servicios")}
            >
              {t("servicios")}
            </button>
          </li>
          <li>
            <button 
              className={`${styles.navContact} ${activeSection === "contacto" ? styles.active : ""}`} 
              onClick={() => scrollToSection("contacto")}
            >
              {t("contacto")}
            </button>
          </li>
          <li className={styles.langSwitch}>
            <button onClick={() => {
              const newPath = pathname.replace(`/${locale}`, `/${locale === "es" ? "en" : "es"}`);
              router.push(newPath);
            }} className={styles.langButton}>
              {locale === "es" ? "EN" : "ES"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;