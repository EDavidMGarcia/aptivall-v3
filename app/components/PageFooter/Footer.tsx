"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";
import styles from "./Footer.module.css";

gsap.registerPlugin(ScrollTrigger);

// ------------------------------------------------------------------
// Datos de contacto ofuscados (Base64) para evitar scraping automático.
// Solo se decodifican en tiempo de ejecución; la función maneja tanto
// el entorno servidor (Node.js) como cliente (navegador) para que no
// haya diferencias en la hidratación.
// ------------------------------------------------------------------
const ENCODED_EMAIL = "aW5mb0BhcHRpdmFsbC5jb20=";
const ENCODED_WHATSAPP_NUMBER = "NTczMTEyMTg4NjM1"; 
const ENCODED_PHONE_NUMBER = "NTczMDA4MTAxMDQz";    

function decodeBase64(encoded: string): string {
  if (typeof window === "undefined") {
    // Servidor (Node.js)
    return Buffer.from(encoded, "base64").toString("utf-8");
  }
  // Cliente
  return atob(encoded);
}

const Footer: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations("ContactBar");
  const tNav = useTranslations("Navbar");

  const footerRef = useRef<HTMLDivElement>(null);

  // Decodificación segura e idéntica en servidor y cliente
  const email = decodeBase64(ENCODED_EMAIL);
  const whatsappNumber = decodeBase64(ENCODED_WHATSAPP_NUMBER);
  const phoneNumber = decodeBase64(ENCODED_PHONE_NUMBER);

  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const telLink = `tel:+${phoneNumber}`;

  // Animación GSAP (una vez)
  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerEl,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerEl,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.wrapper}>
      <footer className={styles.footer} ref={footerRef}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrand}>
            <Link href={`/${locale}`} aria-label="Aptivall">
              <Image
                src="/icons/aptiLogo.png"
                alt="Aptivall"
                width={220}
                height={70}
                className={styles.footerLogo}
              />
            </Link>
            <p className={styles.footerTagline}>{t("footer.tagline")}</p>
          </div>

          <div className={styles.footerCol} role="navigation" aria-label={t("footer.colServices")}>
            <span className={styles.footerColTitle}>{t("footer.colServices")}</span>
            <Link href={`/${locale}/services#service-1`} className={styles.footerLink}>
              {tNav("services.innovation")}
            </Link>
            <Link href={`/${locale}/services#service-2`} className={styles.footerLink}>
              {tNav("services.edtech")}
            </Link>
            <Link href={`/${locale}/services#service-3`} className={styles.footerLink}>
              {tNav("services.talent")}
            </Link>
            <Link href={`/${locale}/services#service-4`} className={styles.footerLink}>
              {tNav("services.media")}
            </Link>
          </div>

          <div className={styles.footerCol} role="navigation" aria-label={t("footer.colCompany")}>
            <span className={styles.footerColTitle}>{t("footer.colCompany")}</span>
            <Link href={`/${locale}/about`} className={styles.footerLink}>
              {t("footer.linkAbout")}
            </Link>
            <Link href={`/${locale}/services`} className={styles.footerLink}>
              {t("footer.linkServices")}
            </Link>
            <a href="#contact-section" className={styles.footerLink}>
              {t("footer.linkContact")}
            </a>
          </div>

          <div className={styles.footerCol} role="contentinfo" aria-label={t("footer.colSupport")}>
            <span className={styles.footerColTitle}>{t("footer.colSupport")}</span>

            <a
              href={whatsappLink}
              className={styles.footerLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Iniciar chat de WhatsApp`}
            >
              +57 311 218 8635
            </a>
            <a
              href={telLink}
              className={styles.footerLink}
              aria-label={`Llamar al numero telefonico`}
            >
              +57 300 810 1043
            </a>
            <a
              href={`mailto:${email}`}
              className={styles.footerLink}
              aria-label={`Enviar correo a ${email}`}
            >
              {email}
            </a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            © {new Date().getFullYear()} <span>Aptivall</span>. {t("footer.copyright")}
          </p>
          <div className={styles.footerLegal}>
            <Link href={`/${locale}/privacy`} className={styles.footerLegalLink}>
              {t("footer.privacy")}
            </Link>
            <Link href={`/${locale}/terms`} className={styles.footerLegalLink}>
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;