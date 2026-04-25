import type { Metadata, Viewport } from "next";
import { Geist_Mono, Geist } from "next/font/google";
import { Oswald } from "next/font/google";
import "@/app/globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { siteContent } from "@/lib/data/mock-data";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${siteContent.name} | ${siteContent.subtitle}`,
  description: siteContent.manifesto,
  applicationName: siteContent.name,
  keywords: ["CSN", "Volta Redonda", "territorio", "imoveis", "mapa popular"],
  manifest: "/manifest.webmanifest",
  openGraph: {
    siteName: siteContent.name,
    title: `${siteContent.name} | ${siteContent.subtitle}`,
    description: siteContent.manifesto,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteContent.name} | ${siteContent.subtitle}`,
    description: siteContent.manifesto,
  },
};

export const viewport: Viewport = {
  themeColor: "#3b474f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} bg-ink font-sans text-paper antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
