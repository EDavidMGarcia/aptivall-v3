import createNextIntlPlugin from 'next-intl/plugin';

// Configuración de internacionalización con next-intl
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/**
 * Política de seguridad de contenido (CSP) base
 * Ajustar 'script-src' y 'style-src' según necesidad de scripts inline o fuentes externas.
 * Se recomienda usar nonces o hashes en producción para mayor seguridad.
 */
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deshabilita la cabecera X-Powered-By por seguridad
  poweredByHeader: false,

  // Límite de tamaño del cuerpo de las Server Actions (previene payloads enormes)
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },

  // Cabeceras de seguridad aplicadas globalmente
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          // Previene que el navegador intente adivinar el tipo MIME
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Protección contra clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Política de referrer: solo envía origen cuando cambia el dominio
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Solo usar HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Permisos del navegador (cámara, micrófono, etc.) - negar por defecto
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Configuración de caché para recursos estáticos
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Configuración de imágenes (agregar dominios según se necesiten)
  images: {
    // Formatos modernos
    formats: ['image/avif', 'image/webp'],
    // Patrones remotos (descomentar si se cargan imágenes externas)
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'cdn.example.com',
    //     port: '',
    //     pathname: '/images/**',
    //   },
    // ],
  },
};

export default withNextIntl(nextConfig);