"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";
import styles from "./Finisher.module.css";

gsap.registerPlugin(ScrollTrigger);

const Finisher: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations("ContactBar");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animamos directamente. GSAP se encarga de esperar al montaje en el cliente.
      gsap.fromTo(
        `.${styles.footer}`,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: `.${styles.footer}`,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: wrapperRef, dependencies: [locale] }
  );

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <footer className={styles.footer} style={{ opacity: 0 }}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrand}>
            <Link href={`/${locale}`}>
              <Image
                src="/icons/aptiLogo.svg"
                alt="Aptivall"
                width={120}
                height={30}
                style={{ objectFit: "contain" }}
              />
            </Link>
            <p className={styles.footerTagline}>{t("footer.tagline")}</p>
          </div>

          <div className={styles.footerCol}>
            <span className={styles.footerColTitle}>{t("footer.colServices")}</span>
            <Link href={`/${locale}/services`} className={styles.footerLink}>Innovation Lab</Link>
            <Link href={`/${locale}/services`} className={styles.footerLink}>EdTech Studio</Link>
          </div>

          <div className={styles.footerCol}>
            <span className={styles.footerColTitle}>{t("footer.colCompany")}</span>
            <Link href={`/${locale}/about`} className={styles.footerLink}>{t("footer.linkAbout")}</Link>
            <Link href={`/${locale}/services`} className={styles.footerLink}>{t("footer.linkServices")}</Link>
            <a href="#contact-section" className={styles.footerLink}>{t("footer.linkContact")}</a>
          </div>

          <div className={styles.footerCol}>
            <span className={styles.footerColTitle}>{t("footer.colSupport")}</span>
            <a href="mailto:info@aptivall.com" className={styles.footerLink}>info@aptivall.com</a>
            <a href="tel:+573008101043" className={styles.footerLink}>+57 300 810 1043</a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            © 2026 <span>Aptivall</span>. {t("footer.copyright")}
          </p>
          <div className={styles.footerLegal}>
            <a href="#" className={styles.footerLegalLink}>{t("footer.privacy")}</a>
            <a href="#" className={styles.footerLegalLink}>{t("footer.terms")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Finisher;