import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from '../i18n';

/**
 * Configuración de next-intl para la carga de mensajes.
 * Valida que el locale de la URL sea uno de los permitidos.
 * Si no es válido o no se proporciona, usa el locale por defecto.
 */
export default getRequestConfig(async ({ locale }) => {
  // Aseguramos que el locale sea válido comparando con la lista de locales permitidos
  const safeLocale: Locale =
    locale && locales.includes(locale as Locale)
      ? (locale as Locale)
      : defaultLocale;

  return {
    locale: safeLocale,
    // Carga dinámica de los mensajes correspondientes al locale seguro
    messages: (await import(`../messages/${safeLocale}.json`)).default,
  };
});