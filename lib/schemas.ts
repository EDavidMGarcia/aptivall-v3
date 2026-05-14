import { z } from "zod";

/**
 * Esquema de validación para el formulario de contacto.
 * Los códigos de error (name_short, email_invalid, etc.) se usan
 * en el frontend para mostrar mensajes traducidos al usuario.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "name_short")
    .max(50, "name_too_long")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, "name_invalid"),
  email: z.string().email("email_invalid").max(50, "email_too_long"),
  subject: z.string().max(100, "subject_too_long").optional(),
  message: z.string().min(10, "message_short").max(5000, "message_too_long"),
  _honeypot: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;