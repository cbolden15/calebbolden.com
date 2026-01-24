import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caleb Bolden | AI Automation & Product Operations",
  description: "Product Manager at Blockdaemon. I build intelligent systems that give people their time back. 10+ years in process improvement, AI automation, and blockchain.",
  keywords: ["AI automation", "product operations", "n8n consultant", "process improvement", "blockchain product manager"],
  authors: [{ name: "Caleb Bolden" }],
  openGraph: {
    title: "Caleb Bolden | AI Automation & Product Operations",
    description: "I build intelligent systems that give people their time back.",
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
