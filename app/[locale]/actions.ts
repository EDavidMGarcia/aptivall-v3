"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData, locale: string) {
  const rawData = Object.fromEntries(formData.entries());

  // 1. FILTRO ANTI-SPAM (Honeypot)
  // Si un bot llena este campo, devolvemos éxito para engañarlo, pero no hacemos nada.
  if (rawData._honeypot && String(rawData._honeypot).trim().length > 0) {
    return { success: true };
  }

  // 2. VALIDACIÓN DE SERVIDOR CON ZOD
  // Usamos el esquema que ya tienes para asegurar que los datos sean correctos
  const validatedData = contactSchema.safeParse(rawData);

  if (!validatedData.success) {
    // Si la validación falla (ej. email mal escrito), devolvemos el primer error
    return { error: validatedData.error.issues[0].message };
  }

  const { name, email, subject, message } = validatedData.data;

  try {
    // Cargamos los mensajes para las plantillas según el idioma
    let messages;
    if (locale === "en") {
      messages = await import("@/messages/en.json");
    } else {
      messages = await import("@/messages/es.json");
    }

    const t = messages.default.ContactBar.emailTemplates;

    // 3. ENVÍO DE CORREOS (STACK RESEND)
    
    // CORREO INTERNO: El que recibes tú con la información del lead
    await resend.emails.send({
      from: "Aptivall Web <onboarding@resend.dev>",
      to: "martinez.em246@gmail.com",
      subject: `🚀 [${locale.toUpperCase()}] ${subject || "Nuevo Contacto"}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000; border-bottom: 2px solid #eee; padding-bottom: 10px;">Nuevo mensaje desde la web</h2>
          <p><strong>Cliente:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Idioma:</strong> ${locale.toUpperCase()}</p>
          <p><strong>Asunto:</strong> ${subject || "Sin asunto"}</p>
          <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin-top: 15px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `
    });

    // CORREO DE CONFIRMACIÓN: El que recibe el cliente (Diseño Premium Dark)
    await resend.emails.send({
      from: "Aptivall <onboarding@resend.dev>",
      to: email,
      subject: t.userSubject,
      html: `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#080808; padding:40px 0; font-family: Inter, Helvetica, Arial, sans-serif;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:90%; background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:16px; overflow:hidden;">
        <tr>
          <td style="height:3px; background: linear-gradient(90deg, #001DFF, #00FF81);"></td>
        </tr>
        <tr>
          <td align="center" style="padding:30px 20px;">
            <img src="https://aptivall-v3.vercel.app/icons/aptiLogo.svg" width="140" alt="Aptivall" style="display:block;">
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 30px 40px;">
            <h2 style="color:#FFFFFF; margin:0 0 15px 0; font-weight:600;">
              ${t.userGreeting.replace("{name}", name)}
            </h2>
            <p style="color:#888888; margin:0 0 20px 0; line-height:1.6;">
              ${t.userBody}
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:25px 0;">
              <tr>
                <td style="background:#0d0d0d; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:18px;">
                  <p style="color:#00FF81; font-size:12px; margin:0 0 8px 0; letter-spacing:1px;">ASUNTO / SUBJECT</p>
                  <p style="color:#FFFFFF; margin:0; font-size:14px;">${subject || "..."}</p>
                </td>
              </tr>
            </table>
            <p style="color:#888888; margin:0 0 20px 0; line-height:1.6;">${t.userFollowUp}</p>
            <p style="color:#FFFFFF; font-weight:500; margin-top:25px;">${t.userClosing}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px; text-align:center; border-top:1px solid rgba(255,255,255,0.08);">
            <p style="color:#666666; font-size:12px; margin:0;">${t.userFooter}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error detallado en el servidor:", error);
    return { error: "server_error" };
  }
}