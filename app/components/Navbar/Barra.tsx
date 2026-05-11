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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);      // solo para móvil
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // para desktop (hover con delay)
  const [isDesktop, setIsDesktop] = useState(false);                // para saber si es cliente y ancho > 768

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownContainerRef = useRef<HTMLLIElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  // Detectar si es escritorio (cliente)
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDesktop(window.innerWidth > 768);
      const handleResize = () => setIsDesktop(window.innerWidth > 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // --- 1. Lógica de Resaltado (Intersection Observer) ---
  useEffect(() => {
    const sections = ["inicio", "sobre", "servicios", "clientes", "contacto"];
    
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

  // --- 4. Cerrar dropdown móvil al hacer clic fuera ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isDesktop) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
            dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktop]);

  // --- 5. Funciones para el hover con delay (desktop) ---
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 500);
  };

  const handleMenuMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // --- 6. Función de scroll original ---
  const scrollToSection = useCallback((sectionId: string) => {
    setIsOpen(false);
    setIsDropdownOpen(false);
    setIsDropdownVisible(false);
    if (pathname === `/${locale}`) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start" 
        });
      }
    } else {
      router.push(`/${locale}#${sectionId}`);
    }
  }, [pathname, locale, router]);

  // --- 7. Navegación a servicios (dropdown) ---
  const navigateToService = (serviceId: number) => {
    setIsOpen(false);
    setIsDropdownOpen(false);
    setIsDropdownVisible(false);
    if (pathname === `/${locale}`) {
      router.push(`/${locale}/services#service-${serviceId}`);
    } else if (pathname.includes("/services")) {
      const element = document.getElementById(`service-${serviceId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.push(`/${locale}/services#service-${serviceId}`);
    }
  };

  // Datos de servicios (desde traducciones)
  const serviceItems = [
    { id: 1, label: t("services.innovation") },
    { id: 2, label: t("services.edtech") },
    { id: 3, label: t("services.talent") },
    { id: 4, label: t("services.media") },
  ];

  // Determinar si el menú debe ser visible
  const showDropdown = isDesktop ? isDropdownVisible : isDropdownOpen;

  return (
    <nav ref={navRef} className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}>
      <div className={styles.navContainer}>
        <div className={styles.logoWrapper} onClick={() => scrollToSection("inicio")}>
          <Image src="/icons/aptiLogo.png" alt="Aptivall" width={130} height={10} priority className={styles.logo} />
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

          {/* Servicios con dropdown */}
          <li
            ref={dropdownContainerRef}
            className={styles.dropdownContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.dropdownWrapper}>
              <button
                ref={dropdownButtonRef}
                className={`${styles.navItem} ${activeSection === "servicios" ? styles.active : ""}`}
                onClick={() => scrollToSection("servicios")}
              >
                {t("servicios")}
              </button>
              <button
                className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.dropdownArrowActive : ""}`}
                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                aria-label="Abrir menú de servicios"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            <div
              ref={dropdownRef}
              className={`${styles.dropdownMenu} ${showDropdown ? styles.dropdownMenuVisible : ""}`}
              onMouseEnter={handleMenuMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {serviceItems.map((service) => (
                <button
                  key={service.id}
                  className={styles.dropdownItem}
                  onClick={() => navigateToService(service.id)}
                >
                  {service.label}
                </button>
              ))}
            </div>
          </li>

          <li>
            <button 
              className={`${styles.navItem} ${activeSection === "clientes" ? styles.active : ""}`} 
              onClick={() => scrollToSection("clientes")}
            >
              {t("clientes")}
            </button>
          </li>

          <li>
            <a
              href="https://aptivall.com/elearning/login/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navItem}
              onClick={() => setIsOpen(false)}
            >
              {t("elearning")}
            </a>
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