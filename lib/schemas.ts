import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "name_short"),
  email: z.string().email("email_invalid"),
  subject: z.string().optional(),
  message: z.string().min(10, "message_short"),
  _honeypot: z.string().max(0).optional(), 
});

export type ContactFormData = z.infer<typeof contactSchema>;