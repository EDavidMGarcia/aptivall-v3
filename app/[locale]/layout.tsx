import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, getTranslations } from "next-intl/server";
import { locales, type Locale } from "../../i18n";
import { Toaster } from "sonner";
import Navbar from "../components/PageNavbar/NavBar";
import Footer from "../components/PageFooter/Footer";
import "../globals.css";

// ------------------------------------------------------------------
// Configuración de fuentes
// ------------------------------------------------------------------
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ------------------------------------------------------------------
// Metadatos dinámicos (SEO + Open Graph + hreflang)
// ------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      template: "%s | Aptivall",
      default: t("home.title"),
    },
    description: t("home.description"),
    alternates: {
      canonical: `https://aptivall.com/${locale}`,
      languages: {
        es: "https://aptivall.com/es",
        en: "https://aptivall.com/en",
      },
    },
    openGraph: {
      title: t("home.title"),
      description: t("home.description"),
      url: `https://aptivall.com/${locale}`,
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
      title: t("home.title"),
      description: t("home.description"),
      images: ["/og-image.jpg"],
    },
  };
}

// ------------------------------------------------------------------
// RootLayout asíncrono
// ------------------------------------------------------------------
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icons/aptiLogo.png" />
      <body className="min-h-screen flex flex-col text-white">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Toaster position="bottom-right" richColors theme="dark" closeButton />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}