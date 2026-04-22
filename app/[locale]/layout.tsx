import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "../normalize.css";
import "../globals.css";
import LavaBackground from "../components/Lava/LavaBackground";

// 1. Importaciones de next-intl y navegación
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { locales, type Locale } from "../../i18n";

// IMPORTACIÓN PARA NOTIFICACIONES
import { Toaster } from "sonner";

// 2. Importaciones de tus componentes
import Barra from "../components/Navbar/Barra";
import Finisher from "../components/PageFooter/Finisher";

// 3. Configuración de fuentes
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aptivall",
  description: "Transformación Tecnológica Dedicada",
};

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
      <body className="min-h-full flex flex-col text-white relative">
        {/* ← SIN bg-black — eso tapaba todo */}

        <LavaBackground />  {/* ← primer hijo, z-index: 0 */}

        <NextIntlClientProvider messages={messages} locale={locale}>
          <Toaster position="bottom-right" richColors theme="dark" closeButton />
          <Barra />
          <main className="flex-1 relative z-10">
            {/* ← z-index: 10 en main para que el contenido quede ENCIMA del canvas */}
            {children}
          </main>
          <Finisher />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}