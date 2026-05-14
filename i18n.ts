/**
 * Configuración centralizada de localización.
 * Este archivo define los locales disponibles y el idioma por defecto.
 * Se importa tanto en la configuración de next-intl (i18n/request.ts) como en cualquier
 * otro módulo que necesite conocer los locales o el tipo.
 */
export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';