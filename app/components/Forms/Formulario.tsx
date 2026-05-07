"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";
import styles from "./Formulario.module.css";
import { sendEmail } from "@/app/[locale]/actions";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

const Formulario: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations("ContactBar");

  const [isMounted, setIsMounted] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  // 🛡️ Timestamp antifraude
  const [startTime] = useState(Date.now());

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

      gsap.fromTo(
        `.${styles.ctaLeft}`,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.ctaSection}`,
            start: "top 82%",
          },
        }
      );

      gsap.fromTo(
        `.${styles.formCard}`,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: `.${styles.ctaSection}`,
            start: "top 82%",
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [locale, isMounted] }
  );

  if (!isMounted) return null;

  // 🛡️ Control de longitud (anti abuso)
  const maxLengths: Record<string, number> = {
    name: 50,
    subject: 100,
    message: 1000,
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (value.length > (maxLengths[name] || 2000)) return;

    if (name === "name") {
      const filteredValue = value.replace(
        /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
        ""
      );
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
      const formData = new FormData(e.currentTarget);

      // 🛡️ Enviar timestamp antifraude
      formData.append("formStartTime", startTime.toString());

      const result = await sendEmail(formData, locale);

      if (result?.success) {
        setSent(true);
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        toast.success(
          t("form.success_message") || "Message sent successfully!"
        );
      } else if (result?.error) {
        toast.error(t(`form.errors.${result.error}`));
      }
    } catch (err) {
      console.error("Error al enviar:", err);
      toast.error(t("form.errors.server_error"));
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      className={styles.ctaSection}
      ref={sectionRef}
      id="contact-section"
    >
      <div className={styles.ctaContainer}>
        <div className={styles.ctaLeft}>
          <span className={styles.eyebrow}>{t("eyebrow")}</span>
          <h2 className={styles.ctaTitle}>
            {t("title")}
            <span className={styles.accentWord}>
              {" "}
              {t("titleHighlight")}
            </span>
          </h2>
          <p className={styles.ctaSubtitle}>{t("subtitle")}</p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formCardInner}>
            <form onSubmit={handleSubmit}>
              {/* 🛡️ Honeypot mejor camuflado */}
              <input
                type="text"
                name="company_name"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="cf-name"
                  >
                    {t("form.labelName")}
                  </label>
                  <input
                    ref={nameInputRef}
                    id="cf-name"
                    name="name"
                    type="text"
                    maxLength={50}
                    placeholder={t("form.placeholderName")}
                    className={styles.formInput}
                    value={formState.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="cf-email"
                  >
                    {t("form.labelEmail")}
                  </label>
                  <input
                    ref={emailInputRef}
                    id="cf-email"
                    name="email"
                    type="email"
                    maxLength={100}
                    placeholder={t("form.placeholderEmail")}
                    className={styles.formInput}
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div
                className={styles.formGroup}
                style={{ marginTop: "12px" }}
              >
                <label
                  className={styles.formLabel}
                  htmlFor="cf-subject"
                >
                  {t("form.labelSubject")}
                </label>
                <input
                  id="cf-subject"
                  name="subject"
                  type="text"
                  maxLength={100}
                  placeholder={t("form.placeholderSubject")}
                  className={styles.formInput}
                  value={formState.subject}
                  onChange={handleChange}
                />
              </div>

              <div
                className={styles.formGroup}
                style={{ marginTop: "12px" }}
              >
                <label
                  className={styles.formLabel}
                  htmlFor="cf-message"
                >
                  {t("form.labelMessage")}
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  maxLength={1000}
                  placeholder={t("form.placeholderMessage")}
                  className={styles.formTextarea}
                  value={formState.message}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className={`${styles.btnSubmit} ${
                  sent ? styles.sent : ""
                }`}
                disabled={sending || sent}
                style={{ marginTop: "16px" }}
              >
                {sent
                  ? t("form.btnSent")
                  : sending
                  ? t("form.btnSending")
                  : t("form.btnSubmit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Formulario;