import { getTranslations } from "next-intl/server";
import Hero from "./components/ServiceHero/Hero";
import InnovationLab from "./components/ServiceInnovationLab/InnovationLab";
import EdtechStudio from "./components/ServiceEdtechStudio/EdtechStudio";
import GlobalTalent from "./components/ServiceGlobalTalent/GlobalTalent";
import DigitalMedia from "./components/ServiceDigitalMedia/DigitalMedia";

// ------------------------------------------------------------------
// Metadatos dinámicos (SEO + hreflang + Open Graph)
// ------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("services.title"),
    description: t("services.description"),
    alternates: {
      canonical: `https://aptivall.com/${locale}/services`,
      languages: {
        es: "https://aptivall.com/es/servicios",
        en: "https://aptivall.com/en/services",
      },
    },
    openGraph: {
      title: t("services.title"),
      description: t("services.description"),
      url: `https://aptivall.com/${locale}/services`,
      siteName: "Aptivall",
      locale: locale === "es" ? "es_CO" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Aptivall Servicios",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("services.title"),
      description: t("services.description"),
      images: ["/og-image.jpg"],
    },
  };
}

// ------------------------------------------------------------------
// Página de Servicios
// ------------------------------------------------------------------
export default function ServicesPage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* 1. Innovation Lab */}
      <InnovationLab />

      {/* 2. Edtech Studio */}
      <EdtechStudio />

      {/* 3. Global Talent */}
      <GlobalTalent />

      {/* 4. Digital Media */}
      <DigitalMedia />
    </main>
  );
}