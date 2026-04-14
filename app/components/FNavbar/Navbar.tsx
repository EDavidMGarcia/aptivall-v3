"use client";

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import styles from "./Navbar.module.css";
import { gsap } from "gsap";

const Navbar: React.FC = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const t = useTranslations("Navbar");

  const [scrolled, setScrolled] = useState<boolean>(false);

  // 🔥 NUEVO
  const [isOpen, setIsOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  // GSAP
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

  // Scroll
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

  // LOGO
  const handleLogoClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.preventDefault();
      setIsOpen(false); // 🔥 cerrar menú
      if (pathname === `/${locale}`) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push(`/${locale}`);
      }
    },
    [pathname, router, locale]
  );

  // HOME
  const handleHomeClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsOpen(false); // 🔥 cerrar menú
      if (pathname === `/${locale}`) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push(`/${locale}`);
      }
    },
    [pathname, router, locale]
  );

  // CONTACT
  const handleContactClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsOpen(false); // 🔥 cerrar menú

      if (pathname === `/${locale}`) {
        const section = document.getElementById("ContactBar");
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        router.push(`/${locale}#ContactBar`);
      }
    },
    [pathname, router, locale]
  );

  return (
    <nav
      ref={navRef}
      className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}
    >
      <div className={styles.navContainer}>
        {/* LOGO */}
        <div
          className={styles.logoWrapper}
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleLogoClick(e)}
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

        {/* 🔥 HAMBURGUESA */}
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
            <Link
              href={`/${locale}`}
              className={`${styles.navItem} ${pathname === `/${locale}` ? styles.active : ""}`}
              onClick={handleHomeClick}
            >
              {t("inicio")}
            </Link>
          </li>

          <li>
            <Link
              href={`/${locale}/about`}
              className={`${styles.navItem} ${pathname === `/${locale}/about` ? styles.active : ""}`}
              onClick={() => setIsOpen(false)}
            >
              {t("sobre")}
            </Link>
          </li>

          <li>
            <Link
              href={`/${locale}/services`}
              className={`${styles.navItem} ${pathname === `/${locale}/services` ? styles.active : ""}`}
              onClick={() => setIsOpen(false)}
            >
              {t("servicios")}
            </Link>
          </li>

          <li>
            <a
              href={`/${locale}#contact-section`}
              className={styles.navContact}
              onClick={handleContactClick}
            >
              {t("contacto")}
            </a>
          </li>

          {/* CAMBIO DE IDIOMA */}
          <li className={styles.langSwitch}>
            <button
              onClick={() => {
                setIsOpen(false); // 🔥 cerrar menú
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