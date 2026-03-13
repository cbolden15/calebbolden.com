import type { Metadata } from "next";
import "./globals.css";
import AIChat from "@/components/AIChat";

export const metadata: Metadata = {
  title: "Caleb Bolden | AI Solutions for Small Business",
  description: "I build AI systems that give small businesses their time back. Voice agents, CRM automation, marketing engines, and AI employees tailored to your industry.",
  keywords: ["AI consultant", "small business automation", "AI voice agents", "CRM automation", "AI employees"],
  authors: [{ name: "Caleb Bolden" }],
  openGraph: {
    title: "Caleb Bolden | AI Solutions for Small Business",
    description: "I build AI systems that give small businesses their time back.",
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
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
        <AIChat />
      </body>
    </html>
  );
}
