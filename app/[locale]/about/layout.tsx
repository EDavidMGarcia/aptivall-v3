import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("about.title"),
    description: t("about.description"),
    alternates: {
      canonical: `https://aptivall.com/${locale}/about`,
      languages: {
        es: "https://aptivall.com/es/sobre-nosotros",
        en: "https://aptivall.com/en/about",
      },
    },
    openGraph: {
      title: t("about.title"),
      description: t("about.description"),
      url: `https://aptivall.com/${locale}/about`,
      siteName: "Aptivall",
      locale: locale === "es" ? "es_CO" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Aptivall",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("about.title"),
      description: t("about.description"),
      images: ["/og-image.jpg"],
    },
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}