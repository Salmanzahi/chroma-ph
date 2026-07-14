import type { Metadata } from "next";
import "./globals.css";
import { SkipToContent } from "@/src/components/layout/SkipToContent";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { SHARED } from "@/src/data/placeholder-content";

export const metadata: Metadata = {
  title: SHARED.siteTitle,
  description: SHARED.siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body className="flex min-h-full flex-col bg-surface-off-white text-text-primary antialiased">
        <SkipToContent />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
