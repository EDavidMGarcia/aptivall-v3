import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

// 1. Importaciones de next-intl y navegación
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { locales, type Locale } from "../../i18n"; 

// 2. Importaciones de tus componentes
// Ajusta las rutas si tus carpetas se llaman distinto
import Navbar from "../components/FNavbar/Navbar";
import ContactBar from "../components/FContactBar/ContactBar";

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
  // Esperamos los parámetros de la URL
  const { locale } = await params;

  // Validamos que el idioma sea correcto (es o en)
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Obtenemos los mensajes del JSON correspondiente
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {/* Pasamos 'messages' y 'locale' para que todo el sitio sepa el idioma */}
        <NextIntlClientProvider messages={messages} locale={locale}>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <ContactBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}