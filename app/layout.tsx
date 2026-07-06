import type { Metadata } from "next";
import { Archivo, Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import AIChat from "@/components/AIChat";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

const martian = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Caleb Bolden | AI Consulting for Small Business",
  description:
    "I map how your business actually works, then build the AI that gives you your time back. Process-first AI consulting for small businesses.",
  keywords: ["AI consultant", "small business automation", "process improvement", "AI readiness audit", "workflow automation"],
  authors: [{ name: "Caleb Bolden" }],
  openGraph: {
    title: "Caleb Bolden | AI Consulting for Small Business",
    description: "I map how your business actually works, then build the AI that gives you your time back.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Caleb Bolden",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${schibsted.variable} ${martian.variable}`}>
      <body className="antialiased">
        {children}
        <AIChat />
      </body>
    </html>
  );
}
