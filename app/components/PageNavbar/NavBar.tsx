"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import styles from "./NavBar.module.css";
import { gsap } from "gsap";

// ------------------------------------------------------------------
// Hooks personalizados
// ------------------------------------------------------------------

const useScrolled = (threshold = 10): boolean => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
};

const useIsDesktop = (): boolean => {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 769px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return isDesktop;
};

const useActiveSection = (sections: string[]): string => {
  const [active, setActive] = useState<string>("inicio");
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split("/");
    const homePath = `/${segments[1]}`;
    if (pathname !== homePath && pathname !== `${homePath}/`) return;

    const observerOptions = {
      root: null,
      rootMargin: "-72px 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname, sections]);

  return active;
};

/**
 * Hook para manejar el dropdown sin exponer refs en el objeto retornado.
 * Toma refs externos para asignarlos internamente y evitar que el linter
 * detecte acceso a refs durante el renderizado.
 */
const useDropdown = (
  isDesktop: boolean,
  dropdownRef: React.RefObject<HTMLDivElement | null>,
  buttonRef: React.RefObject<HTMLButtonElement | null>
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const visible = isDesktop ? isHovering : isOpen;

  const handleMouseEnter = useCallback(() => {
    if (isDesktop) setIsHovering(true);
  }, [isDesktop]);

  const handleMouseLeave = useCallback(() => {
    if (isDesktop) setIsHovering(false);
  }, [isDesktop]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Cerrar al hacer clic fuera (solo móvil)
  useEffect(() => {
    if (isDesktop) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktop, dropdownRef, buttonRef]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsHovering(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsHovering(false);
  }, []);

  return {
    visible,
    handleMouseEnter,
    handleMouseLeave,
    toggle,
    close,
  };
};

// ------------------------------------------------------------------
// Componente Navbar
// ------------------------------------------------------------------
const Navbar: React.FC = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Navbar");

  const scrolled = useScrolled(10);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection([
    "inicio",
    "sobre",
    "servicios",
    "clientes",
    "contacto",
  ]);
  const isDesktop = useIsDesktop();

  // Refs para el dropdown, creados aquí fuera del hook
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dropdown = useDropdown(isDesktop, dropdownRef, buttonRef);

  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  // Animación inicial GSAP (solo montaje)
  useEffect(() => {
    if (!navRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(navRef.current, { y: 0, opacity: 1, duration: 0.8 }).to(
        linksRef.current?.querySelectorAll("li") || [],
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
        "-=0.4"
      );
    });
    return () => ctx.revert();
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      setMenuOpen(false);
      dropdown.close();
      const homePath = `/${locale}`;
      if (pathname === homePath || pathname === `${homePath}/`) {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        router.push(`/${locale}#${sectionId}`);
      }
    },
    [pathname, locale, router, dropdown]
  );

  const navigateToService = useCallback(
    (serviceId: number) => {
      setMenuOpen(false);
      dropdown.close();
      const sectionId = `service-${serviceId}`;
      const homePath = `/${locale}`;
      if (pathname === homePath || pathname === `${homePath}/`) {
        router.push(`/${locale}/services#${sectionId}`);
      } else if (pathname.includes("/services")) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        router.push(`/${locale}/services#${sectionId}`);
      }
    },
    [pathname, locale, router, dropdown]
  );

  const switchLocale = useCallback(() => {
    const newLocale = locale === "es" ? "en" : "es";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  }, [locale, pathname, router]);

  const serviceItems = [
    { id: 1, label: t("services.innovation") },
    { id: 2, label: t("services.edtech") },
    { id: 3, label: t("services.talent") },
    { id: 4, label: t("services.media") },
  ];

  const navbarClass = `${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`;
  const hamburgerClass = `${styles.hamburger} ${menuOpen ? styles.open : ""}`;
  const navLinksClass = `${styles.navLinks} ${menuOpen ? styles.active : ""}`;

  return (
    <nav ref={navRef} className={navbarClass} role="navigation" aria-label={t("mainNavigation")}>
      <div className={styles.navContainer}>
        <div className={styles.logoWrapper} onClick={() => scrollToSection("inicio")}>
          <Image
            src="/icons/aptiLogo.png"
            alt="Aptivall"
            width={130}
            height={10}
            priority
            className={styles.logo}
          />
        </div>

        <button
          className={hamburgerClass}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
        >
          <span />
          <span />
          <span />
        </button>

        <ul ref={linksRef} id="main-menu" className={navLinksClass}>
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

          <li
            className={styles.dropdownContainer}
            onMouseEnter={dropdown.handleMouseEnter}
            onMouseLeave={dropdown.handleMouseLeave}
          >
            <div className={styles.dropdownWrapper}>
              <button
                className={`${styles.navItem} ${activeSection === "servicios" ? styles.active : ""}`}
                onClick={() => scrollToSection("servicios")}
              >
                {t("servicios")}
              </button>
              <button
                ref={buttonRef}
                className={`${styles.dropdownArrow} ${dropdown.visible ? styles.dropdownArrowActive : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  dropdown.toggle();
                }}
                aria-label={t("openServicesMenu")}
                aria-expanded={dropdown.visible}
                aria-haspopup="true"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
            <div
              ref={dropdownRef}
              className={`${styles.dropdownMenu} ${dropdown.visible ? styles.dropdownMenuVisible : ""}`}
              onMouseEnter={dropdown.handleMouseEnter}
              onMouseLeave={dropdown.handleMouseLeave}
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
              onClick={() => setMenuOpen(false)}
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
            <button
              onClick={switchLocale}
              className={styles.langButton}
              aria-label={t("switchLanguage")}
            >
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