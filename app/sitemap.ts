import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aptivall.com';
  const locales = ['es', 'en'];
  const pages = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/services', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
  ];

  return locales.flatMap((locale) =>
    pages.map(({ path, changeFrequency, priority }) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${path}`])
        ),
      },
    }))
  );
}