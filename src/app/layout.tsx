import { pageMetadata, siteOrigin } from "@/lib/site";
import localFont from "next/font/local";
import { themeScript } from "@/lib/theme";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plexSans = localFont({ src: "./fonts/IBMPlexSans.ttf", variable: "--font-plex-sans", display: "swap", weight: "100 700" });

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
    icon: [
      { url: "/brand/arisestudio-symbol-color.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/brand/arisestudio-symbol-white.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plexSans.variable} suppressHydrationWarning>
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
