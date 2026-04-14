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

  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  // GSAP Animación de entrada
  useLayoutEffect(() => {
    if (!navRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
      }).to(
        linksRef.current?.querySelectorAll("li") || [],
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
        "-=0.4"
      );
    });
    return () => ctx.revert();
  }, [locale]);

  // Scroll Detection para estilos
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función unificada de Scroll sin cambiar URL
  const scrollToSection = useCallback((sectionId: string) => {
    setIsOpen(false); // Cerrar menú mobile

    if (pathname === `/${locale}`) {
      const section = document.getElementById(sectionId);
      if (section) {
        // Calculamos el offset basado en la altura de tu navbar (72px o 64px)
        const navbarHeight = scrolled ? 64 : 72;
        const elementPosition = section.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    } else {
      // Si no estamos en el Home, navegamos al Home + el hash
      router.push(`/${locale}#${sectionId}`);
    }
  }, [pathname, locale, scrolled, router]);

  return (
    <nav
      ref={navRef}
      className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}
    >
      <div className={styles.navContainer}>
        {/* LOGO */}
        <div
          className={styles.logoWrapper}
          onClick={() => scrollToSection("inicio")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && scrollToSection("inicio")}
        >
          <Image
            src="/icons/aptiLogo.svg"
            alt="Aptivall"
            width={140}
            height={35}
            priority
            className={styles.logo}
          />
        </div>

        {/* HAMBURGUESA */}
        <button
          className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* LINKS */}
        <ul
          ref={linksRef}
          className={`${styles.navLinks} ${isOpen ? styles.active : ""}`}
        >
          <li>
            <button
              className={`${styles.navItem} ${pathname === `/${locale}` ? styles.active : ""}`}
              onClick={() => scrollToSection("inicio")}
            >
              {t("inicio")}
            </button>
          </li>

          <li>
            <button
              className={styles.navItem}
              onClick={() => scrollToSection("sobre")}
            >
              {t("sobre")}
            </button>
          </li>

          <li>
            <button
              className={styles.navItem}
              onClick={() => scrollToSection("servicios")}
            >
              {t("servicios")}
            </button>
          </li>

          <li>
            <button
              className={styles.navContact}
              onClick={() => scrollToSection("contacto")}
            >
              {t("contacto")}
            </button>
          </li>

          {/* CAMBIO DE IDIOMA */}
          <li className={styles.langSwitch}>
            <button
              onClick={() => {
                setIsOpen(false);
                const newPath = pathname.replace(
                  `/${locale}`,
                  `/${locale === "es" ? "en" : "es"}`
                );
                router.push(newPath);
              }}
              className={styles.langButton}
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