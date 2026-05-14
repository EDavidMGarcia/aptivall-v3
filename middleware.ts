import createMiddleware from 'next-intl/middleware';

// Middleware para forzar el locale en todas las rutas
// La detección automática se desactiva para evitar redirecciones inesperadas y mantener control SEO
export default createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localeDetection: false,
});

export const config = {
  // Intercepta todas las rutas excepto archivos estáticos, API y favicon
  matcher: ['/', '/(es|en)/:path*'],
};