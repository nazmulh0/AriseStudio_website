import { pageMetadata, siteOrigin } from "@/lib/site";
import localFont from "next/font/local";
import { themeScript } from "@/lib/theme";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const manrope = localFont({ src: "./fonts/Manrope.ttf", variable: "--font-manrope", display: "swap", weight: "200 800" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  ...pageMetadata("AriseStudio | Automation & custom software", "Business automation, custom ERP and CRM, commerce integrations and managed IT. Built around the way your business works.", "/"),
  metadataBase: new URL(siteOrigin()),
  keywords: [
    "AriseStudio",
    "business automation",
    "e-commerce automation",
    "custom ERP",
    "custom CRM",
    "IT support",
    "workflow automation",
    "software development Bangladesh",
    "enterprise solutions"
  ],
  authors: [{ name: "AriseStudio Team" }],
  icons: {
    icon: "/brand/arisestudio-shutter-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body
        className="min-h-screen flex flex-col bg-canvas text-ink antialiased"
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-xl focus:bg-accent focus:px-5 focus:py-3 focus:text-on-accent">Skip to content</a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
