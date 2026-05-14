"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas";
import { headers } from "next/headers";
import sanitizeHtml from "sanitize-html";

// =====================================================================
// RATE LIMITING EN MEMORIA (Map)
// =====================================================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutos
const MAX_REQUESTS_PER_WINDOW = 3;

// Rate limiting por email (anti email-bombing)
const emailRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const EMAIL_RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutos
const MAX_EMAIL_REQUESTS_PER_WINDOW = 3;

const resend = new Resend(process.env.RESEND_API_KEY);

/** Tiempo mínimo (segundos) para rellenar el formulario (anti-bot) */
const MIN_FORM_TIME = 3;

// =====================================================================
// VALIDACIÓN DE ORIGEN (ANTI-CSRF)
// =====================================================================
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  "https://aptivall.com",
  "https://www.aptivall.com",
];

function validateOrigin(headersList: Headers): boolean {
  const origin = headersList.get("origin");
  const host = headersList.get("host");
  const referer = headersList.get("referer");

  if (!origin && !referer) {
    console.warn("Solicitud sin origin/referer");
    return true;
  }

  if (origin && ALLOWED_ORIGINS.includes(origin)) return true;

  if (host && ALLOWED_ORIGINS.some((allowed) => allowed.includes(host))) {
    return true;
  }

  return false;
}

// =====================================================================
// FUNCIONES DE RATE LIMITING EN MEMORIA
// =====================================================================
function checkRateLimit(
  map: Map<string, { count: number; resetTime: number }>,
  key: string,
  windowMs: number,
  maxRequests: number
): boolean {
  const now = Date.now();
  const record = map.get(key);

  if (!record || now > record.resetTime) {
    map.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// =====================================================================
// FUNCIÓN PRINCIPAL
// =====================================================================

export async function sendEmail(formData: FormData, locale: string) {
  // 1. Obtener IP y validar origen
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown";

  if (!validateOrigin(headersList)) {
    console.warn(`Origen no permitido: IP=${ip}`);
    return { error: "invalid_origin" };
  }

  // 2. Rate limiting por IP (en memoria)
  if (!checkRateLimit(rateLimitMap, ip, RATE_LIMIT_WINDOW, MAX_REQUESTS_PER_WINDOW)) {
    console.warn(`Rate limit IP: ${ip}`);
    return { error: "rate_limit" };
  }

  // 3. Convertir FormData a objeto
  const rawData = Object.fromEntries(formData.entries());

  // 4. Honeypot (anti-spam)
  if (rawData._honeypot && String(rawData._honeypot).trim().length > 0) {
    return { success: true };
  }

  // 5. Validación con Zod
  const validatedData = contactSchema.safeParse(rawData);
  if (!validatedData.success) {
    console.warn(`Validación fallida: IP=${ip}`);
    return { error: "invalid_data" };
  }

  const { name, email, subject, message } = validatedData.data;

  // 6. Rate limiting por email (anti email-bombing)
  const emailKey = email.toLowerCase().trim();
  if (!checkRateLimit(emailRateLimitMap, emailKey, EMAIL_RATE_LIMIT_WINDOW, MAX_EMAIL_REQUESTS_PER_WINDOW)) {
    console.warn(`Rate limit email: ${emailKey}`);
    return { error: "rate_limit" };
  }

  // 7. Verificación de tiempo mínimo
  const timestamp = Number(rawData._timestamp);
  if (timestamp && !isNaN(timestamp)) {
    const now = Date.now();
    const elapsed = Math.floor(now / 1000) - timestamp;
    if (elapsed < MIN_FORM_TIME) {
      console.warn(`Envío rápido: IP=${ip}`);
      return { error: "too_fast" };
    }
  }

  // 8. Sanitización con sanitize-html
  const sanitizedMessage = sanitizeHtml(message);
  const sanitizedSubject = sanitizeHtml(subject || "");

  // 9. Envío de correos
  try {
    let messages;
    if (locale === "en") {
      messages = await import("@/messages/en.json");
    } else {
      messages = await import("@/messages/es.json");
    }
    const t = messages.default.ContactBar.emailTemplates;

    const adminEmail = process.env.ADMIN_EMAIL || "martinez.em246@gmail.com";
    const fromEmail = process.env.FROM_EMAIL || "Aptivall <onboarding@resend.dev>";

    // Correo interno (administrador)
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🚀 [${locale.toUpperCase()}] ${sanitizedSubject || "Nuevo Contacto"}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Nuevo mensaje desde la web</h2>
          <p><strong>Cliente:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Idioma:</strong> ${locale.toUpperCase()}</p>
          <p><strong>Asunto:</strong> ${sanitizedSubject || "Sin asunto"}</p>
          <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin-top: 15px;">
            <p style="margin: 0; white-space: pre-wrap;">${sanitizedMessage}</p>
          </div>
        </div>
      `
    });

    // Correo de confirmación (cliente) — plantilla premium
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: t.userSubject,
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#080808; padding:40px 0; font-family: Inter, Helvetica, Arial, sans-serif;">
          <!-- ... (plantilla premium sin cambios) ... -->
        </table>
      `
    });

    return { success: true };
  } catch {
    console.error("Error en envío de correo");
    return { error: "server_error" };
  }
}