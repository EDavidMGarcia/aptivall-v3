import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localeDetection: false // 🔥 DESACTIVA detección automática
});

export const config = {
  matcher: ['/', '/(es|en)/:path*']
};