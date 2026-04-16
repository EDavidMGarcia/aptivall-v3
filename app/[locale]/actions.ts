"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData, locale: string) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedData = contactSchema.safeParse(rawData);

  if (!validatedData.success) {
    return { error: validatedData.error.issues[0].message };
  }

  const { name, email, subject, message, _honeypot } = validatedData.data;

  // Filtro anti-spam
  if (_honeypot) return { success: true };

  try {
    // Importación segura de traducciones
    let messages;
    if (locale === "en") {
      messages = await import("@/messages/en.json");
    } else {
      messages = await import("@/messages/es.json");
    }

    const t = messages.default.ContactBar.emailTemplates;

    // 1. CORREO PARA TI (Lead de Negocio)
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

    // 2. CORREO PARA EL USUARIO (Confirmación Profesional)
    await resend.emails.send({
      from: "Aptivall <onboarding@resend.dev>",
      to: email,
      subject: t.userSubject,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background: #000; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">Aptivall</h1>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #000; margin-top: 0;">${t.userGreeting.replace("{name}", name)}</h2>
            <p>${t.userBody}</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #000; font-style: italic; margin: 20px 0;">
              "${subject || "..."}"
            </div>
            
            <p>${t.userFollowUp}</p>
            <p style="font-weight: bold; margin-top: 25px;">${t.userClosing}</p>
          </div>
          
          <div style="background: #f4f4f4; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #888; margin: 0;">${t.userFooter}</p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error detallado en el servidor:", error);
    return { error: "server_error" };
  }
}