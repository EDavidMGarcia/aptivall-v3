"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";
import styles from "./Formulario.module.css";
// IMPORTACIÓN DEL ACTION (Asegúrate de que la ruta sea correcta)
import { sendEmail } from "@/app/[locale]/actions";

gsap.registerPlugin(ScrollTrigger);

const Formulario: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations("ContactBar");
  
  const [isMounted, setIsMounted] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const msgReq = t("form.validation.required");
      const msgEmail = t("form.validation.email");
      const msgName = t("form.validation.name");

      const handleInvalid = (e: Event, message: string) => {
        const target = e.target as HTMLInputElement;
        target.setCustomValidity(target.value === "" ? msgReq : message);
      };

      const handleInput = (e: Event) => {
        (e.target as HTMLInputElement).setCustomValidity("");
      };

      const nameEl = nameInputRef.current;
      const emailEl = emailInputRef.current;

      if (nameEl) {
        nameEl.oninvalid = (e) => handleInvalid(e, msgName);
        nameEl.oninput = handleInput;
      }
      if (emailEl) {
        emailEl.oninvalid = (e) => handleInvalid(e, msgEmail);
        emailEl.oninput = handleInput;
      }
    }
  }, [locale, isMounted, t]);

  useGSAP(
    () => {
      if (!isMounted) return;
      gsap.fromTo(`.${styles.ctaLeft}`, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: `.${styles.ctaSection}`, start: "top 82%", toggleActions: "play none none none" } });
      gsap.fromTo(`.${styles.formCard}`, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.15, scrollTrigger: { trigger: `.${styles.ctaSection}`, start: "top 82%", toggleActions: "play none none none" } });
    },
    { scope: sectionRef, dependencies: [locale, isMounted] }
  );

  if (!isMounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      const filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      setFormState((prev) => ({ ...prev, [name]: filteredValue }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending || sent) return;
    setSending(true);

    try {
      // Capturamos los datos del formulario directamente
      const formData = new FormData(e.currentTarget);
      const result = await sendEmail(formData, locale);

      if (result?.success) {
        setSent(true);
        setFormState({ name: "", email: "", subject: "", message: "" });
      } else if (result?.error) {
        // Mostramos el error traducido usando la clave que devuelve el servidor
        alert(t(`form.errors.${result.error}`));
      }
    } catch (err) {
      console.error("Error al enviar:", err);
      alert(t("form.errors.server_error"));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className={styles.ctaSection} ref={sectionRef} id="contact-section">
      <div className={styles.ctaContainer}>
        <div className={styles.ctaLeft}>
          <span className={styles.eyebrow}>{t("eyebrow")}</span>
          <h2 className={styles.ctaTitle}>{t("title")}<span className={styles.accentWord}> {t("titleHighlight")}</span></h2>
          <p className={styles.ctaSubtitle}>{t("subtitle")}</p>
          
          <div className={styles.contactMeta}>
            <div className={styles.contactMetaItem}>
              <div className={styles.contactMetaIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
              <span className={styles.contactMetaText}><a href="mailto:info@aptivall.com" className={styles.contactMetaValue}>info@aptivall.com</a></span>
            </div>
            
            <div className={styles.contactMetaItem}>
              <div className={styles.contactMetaIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92Z" /></svg>
              </div>
              <span className={styles.contactMetaText}><a href="tel:+573008101043" className={styles.contactMetaValue}>+57 300 810 1043</a></span>
            </div>

            <div className={styles.contactMetaItem}>
              <div className={styles.contactMetaIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
              </div>
              <span className={styles.contactMetaText}><a href="https://wa.me/573008101043" target="_blank" rel="noopener noreferrer" className={styles.contactMetaValue}>{t("whatsappLabel")}</a></span>
            </div>
          </div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formCardInner}>
            <form onSubmit={handleSubmit}>
              {/* Campo Honeypot invisible para humanos, trampa para bots */}
              <input type="text" name="_honeypot" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="cf-name">{t("form.labelName")}</label>
                  <input 
                    ref={nameInputRef}
                    id="cf-name" name="name" type="text" 
                    placeholder={t("form.placeholderName")} className={styles.formInput} 
                    value={formState.name} onChange={handleChange} required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="cf-email">{t("form.labelEmail")}</label>
                  <input 
                    ref={emailInputRef}
                    id="cf-email" name="email" type="email" 
                    placeholder={t("form.placeholderEmail")} className={styles.formInput} 
                    value={formState.email} onChange={handleChange} required 
                  />
                </div>
              </div>
              <div className={styles.formGroup} style={{ marginTop: "12px" }}>
                <label className={styles.formLabel} htmlFor="cf-subject">{t("form.labelSubject")}</label>
                <input id="cf-subject" name="subject" type="text" placeholder={t("form.placeholderSubject")} className={styles.formInput} value={formState.subject} onChange={handleChange} />
              </div>
              <div className={styles.formGroup} style={{ marginTop: "12px" }}>
                <label className={styles.formLabel} htmlFor="cf-message">{t("form.labelMessage")}</label>
                <textarea id="cf-message" name="message" placeholder={t("form.placeholderMessage")} className={styles.formTextarea} value={formState.message} onChange={handleChange} />
              </div>
              <button type="submit" className={`${styles.btnSubmit} ${sent ? styles.sent : ""}`} disabled={sending || sent} style={{ marginTop: "16px" }}>
                {sent ? (<>{t("form.btnSent")} <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></>) 
                : sending ? (t("form.btnSending")) 
                : (<>{t("form.btnSubmit")} <span className={styles.btnSubmitArrow}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></>)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Formulario;